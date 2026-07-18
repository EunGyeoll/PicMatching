"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/supabase/auth";
import { serviceFormSchema, parseServiceFormData } from "@/lib/validations/service";

export type ServiceFormState = { error?: string };
export type ServiceActionResult = { error?: string };

function toRow(parsed: ReturnType<typeof serviceFormSchema.parse>) {
  return {
    title: parsed.title,
    description: parsed.description,
    price: parsed.price,
    duration_minutes: parsed.durationMinutes,
    buffer_after_minutes: parsed.bufferAfterMinutes,
    cover_image_path: parsed.coverImagePath,
    is_published: parsed.isPublished,
    inclusions: parsed.inclusions ?? null,
    retouched_photo_count: parsed.retouchedPhotoCount ?? null,
    provides_raw_files: parsed.providesRawFiles ?? null,
    provides_all_raw_files: parsed.providesAllRawFiles ?? null,
    delivery_days: parsed.deliveryDays ?? null,
    max_participants: parsed.maxParticipants ?? null,
    allows_outfit_change: parsed.allowsOutfitChange ?? null,
    recommended_for: parsed.recommendedFor ?? null,
    extra_fee_conditions: parsed.extraFeeConditions ?? null,
    travel_fee: parsed.travelFee ?? null,
    night_surcharge: parsed.nightSurcharge ?? null,
    weekend_surcharge: parsed.weekendSurcharge ?? null,
    notes: parsed.notes ?? null,
    areas: parsed.areas,
  };
}

async function syncServiceTags(
  supabase: Awaited<ReturnType<typeof createClient>>,
  serviceId: string,
  tagIds: number[],
) {
  await supabase.from("photographer_service_tags").delete().eq("service_id", serviceId);
  if (tagIds.length > 0) {
    await supabase
      .from("photographer_service_tags")
      .insert(tagIds.map((tagId) => ({ service_id: serviceId, tag_id: tagId })));
  }
}

export async function createServiceAction(
  _prevState: ServiceFormState,
  formData: FormData,
): Promise<ServiceFormState> {
  const user = await getAuthUser();
  if (!user) {
    return { error: "로그인이 필요합니다." };
  }

  const supabase = await createClient();

  const { data: photographerProfile } = await supabase
    .from("photographer_profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!photographerProfile) {
    return { error: "촬영자 등록을 먼저 완료해주세요." };
  }

  const serviceId = formData.get("serviceId");
  if (typeof serviceId !== "string" || serviceId.length === 0) {
    return { error: "잠시 후 다시 시도해주세요." };
  }

  const raw = parseServiceFormData(formData);
  const parsed = serviceFormSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." };
  }

  const { error: insertError } = await supabase.from("shooting_services").insert({
    id: serviceId,
    photographer_id: user.id,
    ...toRow(parsed.data),
  });

  if (insertError) {
    return { error: "저장 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요." };
  }

  await syncServiceTags(supabase, serviceId, [
    ...parsed.data.purposeTagIds,
    ...parsed.data.moodTagIds,
  ]);

  redirect("/photographer/services");
}

export async function updateServiceAction(
  _prevState: ServiceFormState,
  formData: FormData,
): Promise<ServiceFormState> {
  const user = await getAuthUser();
  if (!user) {
    return { error: "로그인이 필요합니다." };
  }

  const serviceId = formData.get("serviceId");
  if (typeof serviceId !== "string" || serviceId.length === 0) {
    return { error: "잠시 후 다시 시도해주세요." };
  }

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("shooting_services")
    .select("id")
    .eq("id", serviceId)
    .eq("photographer_id", user.id)
    .maybeSingle();

  if (!existing) {
    return { error: "서비스를 찾을 수 없습니다." };
  }

  const raw = parseServiceFormData(formData);
  const parsed = serviceFormSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." };
  }

  const { error: updateError } = await supabase
    .from("shooting_services")
    .update(toRow(parsed.data))
    .eq("id", serviceId)
    .eq("photographer_id", user.id);

  if (updateError) {
    return { error: "저장 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요." };
  }

  await syncServiceTags(supabase, serviceId, [
    ...parsed.data.purposeTagIds,
    ...parsed.data.moodTagIds,
  ]);

  redirect("/photographer/services");
}

export async function deleteServiceAction(serviceId: string): Promise<ServiceActionResult> {
  const user = await getAuthUser();
  if (!user) {
    return { error: "로그인이 필요합니다." };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("shooting_services")
    .delete()
    .eq("id", serviceId)
    .eq("photographer_id", user.id);

  if (error) {
    if (error.code === "23503") {
      return {
        error: "이미 예약 이력이 있는 서비스는 삭제할 수 없어요. 대신 비공개로 전환해주세요.",
      };
    }
    return { error: "삭제 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요." };
  }

  revalidatePath("/photographer/services");
  return {};
}

export async function togglePublishAction(
  serviceId: string,
  nextPublished: boolean,
): Promise<ServiceActionResult> {
  const user = await getAuthUser();
  if (!user) {
    return { error: "로그인이 필요합니다." };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("shooting_services")
    .update({ is_published: nextPublished })
    .eq("id", serviceId)
    .eq("photographer_id", user.id);

  if (error) {
    return { error: "처리 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요." };
  }

  revalidatePath("/photographer/services");
  return {};
}
