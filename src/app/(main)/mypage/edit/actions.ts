"use server";

import { revalidatePath } from "next/cache";
import { getAuthUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { profileUpdateSchema } from "@/lib/validations/profile";

export type ProfileFormState = { error?: string; success?: boolean };

export async function updateProfileAction(
  _prevState: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const user = await getAuthUser();
  if (!user) {
    return { error: "로그인이 필요합니다." };
  }

  const parsed = profileUpdateSchema.safeParse({
    nickname: formData.get("nickname"),
    phone: formData.get("phone"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      nickname: parsed.data.nickname,
      phone: parsed.data.phone || null,
    })
    .eq("id", user.id);

  if (error) {
    return { error: "저장 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요." };
  }

  revalidatePath("/mypage");
  revalidatePath("/mypage/edit");
  return { success: true };
}
