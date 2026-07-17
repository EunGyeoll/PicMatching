"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/supabase/auth";
import { serviceFormSchema, parseServiceFormData } from "@/lib/validations/service";

export type ServiceFormState = { error?: string };

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
    title: parsed.data.title,
    description: parsed.data.description,
    price: parsed.data.price,
    duration_minutes: parsed.data.durationMinutes,
    buffer_after_minutes: parsed.data.bufferAfterMinutes,
    cover_image_path: parsed.data.coverImagePath,
    is_published: parsed.data.isPublished,
    inclusions: parsed.data.inclusions ?? null,
    retouched_photo_count: parsed.data.retouchedPhotoCount ?? null,
    provides_raw_files: parsed.data.providesRawFiles ?? null,
    provides_all_raw_files: parsed.data.providesAllRawFiles ?? null,
    delivery_days: parsed.data.deliveryDays ?? null,
    max_participants: parsed.data.maxParticipants ?? null,
    allows_outfit_change: parsed.data.allowsOutfitChange ?? null,
    recommended_for: parsed.data.recommendedFor ?? null,
    extra_fee_conditions: parsed.data.extraFeeConditions ?? null,
    travel_fee: parsed.data.travelFee ?? null,
    night_surcharge: parsed.data.nightSurcharge ?? null,
    weekend_surcharge: parsed.data.weekendSurcharge ?? null,
    areas: parsed.data.areas,
  });

  if (insertError) {
    return { error: "저장 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요." };
  }

  const tagIds = [...parsed.data.purposeTagIds, ...parsed.data.moodTagIds];
  if (tagIds.length > 0) {
    await supabase
      .from("photographer_service_tags")
      .insert(tagIds.map((tagId) => ({ service_id: serviceId, tag_id: tagId })));
  }

  redirect("/photographer/services");
}
