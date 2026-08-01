"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/supabase/auth";
import { availabilityFormSchema } from "@/lib/validations/availability";

export type AvailabilityFormState = { error?: string; success?: boolean };

export async function updateAvailabilityAction(
  _prevState: AvailabilityFormState,
  formData: FormData,
): Promise<AvailabilityFormState> {
  const user = await getAuthUser();
  if (!user) {
    return { error: "로그인이 필요합니다." };
  }

  let raw: unknown;
  try {
    raw = JSON.parse(formData.get("rules")?.toString() ?? "[]");
  } catch {
    return { error: "입력값을 확인해주세요." };
  }

  const parsed = availabilityFormSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." };
  }

  const supabase = await createClient();

  const { error: deleteError } = await supabase
    .from("availability_rules")
    .delete()
    .eq("photographer_id", user.id);

  if (deleteError) {
    return { error: "저장 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요." };
  }

  const enabledRows = parsed.data
    .filter((r) => r.enabled)
    .map((r) => ({
      photographer_id: user.id,
      day_of_week: r.dayOfWeek,
      start_time: r.startTime,
      end_time: r.endTime,
    }));

  if (enabledRows.length > 0) {
    const { error: insertError } = await supabase.from("availability_rules").insert(enabledRows);
    if (insertError) {
      return { error: "저장 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요." };
    }
  }

  revalidatePath("/photographer/availability");
  return { success: true };
}
