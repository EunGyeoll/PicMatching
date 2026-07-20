import { createClient } from "@/lib/supabase/server";
import { getPublicStorageUrl } from "@/lib/supabase/storage";
import { intersectServiceIdsByLabels } from "@/lib/data/tags";
import type { MyServiceListItem, ServiceCard, ServiceEditData } from "@/types/domain";

function toServiceCard(row: {
  id: string;
  title: string;
  price: number;
  duration_minutes: number;
  cover_image_path: string | null;
  updated_at: string;
  photographer_id: string;
  areas: string[];
  photographer_profiles: { display_name: string } | null;
}): ServiceCard {
  return {
    id: row.id,
    title: row.title,
    price: row.price,
    durationMinutes: row.duration_minutes,
    coverImageUrl: row.cover_image_path
      ? getPublicStorageUrl("services", row.cover_image_path, row.updated_at)
      : null,
    photographerId: row.photographer_id,
    photographerName: row.photographer_profiles?.display_name ?? "",
    areas: row.areas,
  };
}

export async function getFeaturedServices(limit = 10): Promise<ServiceCard[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("shooting_services")
    .select(
      "id, title, price, duration_minutes, cover_image_path, updated_at, photographer_id, areas, photographer_profiles!inner(display_name)",
    )
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []).map(toServiceCard);
}

export type ServiceFilters = {
  purpose?: string;
  mood?: string;
  area?: string;
};

export async function getExploreServices(
  filters: ServiceFilters,
): Promise<ServiceCard[]> {
  const supabase = await createClient();

  const idFilter = await intersectServiceIdsByLabels([
    filters.purpose,
    filters.mood,
  ]);
  if (idFilter && idFilter.length === 0) return [];

  let query = supabase
    .from("shooting_services")
    .select(
      "id, title, price, duration_minutes, cover_image_path, updated_at, photographer_id, areas, photographer_profiles!inner(display_name)",
    )
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (idFilter) {
    query = query.in("id", idFilter);
  }
  if (filters.area) {
    query = query.contains("areas", [filters.area]);
  }

  const { data } = await query;
  return (data ?? []).map(toServiceCard);
}

/** 촬영자 본인의 서비스 목록(비공개 포함)을 관리 화면용으로 반환합니다. */
export async function getMyServices(
  photographerId: string,
): Promise<MyServiceListItem[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("shooting_services")
    .select("id, title, price, duration_minutes, cover_image_path, updated_at, is_published")
    .eq("photographer_id", photographerId)
    .order("created_at", { ascending: false });

  return (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    price: row.price,
    durationMinutes: row.duration_minutes,
    coverImageUrl: row.cover_image_path
      ? getPublicStorageUrl("services", row.cover_image_path, row.updated_at)
      : null,
    isPublished: row.is_published,
  }));
}

/** 본인 소유 서비스 하나를 수정 화면에 채울 형태로 반환합니다. 소유자가 아니면 null. */
export async function getServiceForEdit(
  photographerId: string,
  serviceId: string,
): Promise<ServiceEditData | null> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("shooting_services")
    .select(
      `id, title, description, price, duration_minutes, buffer_after_minutes,
       cover_image_path, updated_at, is_published, inclusions, areas,
       retouched_photo_count, provides_raw_files, provides_all_raw_files,
       delivery_days, max_participants, allows_outfit_change, recommended_for,
       extra_fee_conditions, travel_fee, night_surcharge, weekend_surcharge, notes,
       photographer_service_tags(service_tags(id, category))`,
    )
    .eq("id", serviceId)
    .eq("photographer_id", photographerId)
    .maybeSingle();

  if (!data) return null;

  const purposeTagIds = data.photographer_service_tags
    .filter((t) => t.service_tags?.category === "purpose")
    .map((t) => t.service_tags!.id);
  const moodTagIds = data.photographer_service_tags
    .filter((t) => t.service_tags?.category === "mood")
    .map((t) => t.service_tags!.id);

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    price: data.price,
    durationMinutes: data.duration_minutes,
    bufferAfterMinutes: data.buffer_after_minutes,
    coverImagePath: data.cover_image_path,
    coverImageUrl: data.cover_image_path
      ? getPublicStorageUrl("services", data.cover_image_path, data.updated_at)
      : null,
    isPublished: data.is_published,
    inclusions: data.inclusions,
    areas: data.areas,
    purposeTagIds,
    moodTagIds,
    retouchedPhotoCount: data.retouched_photo_count,
    providesRawFiles: data.provides_raw_files,
    providesAllRawFiles: data.provides_all_raw_files,
    deliveryDays: data.delivery_days,
    maxParticipants: data.max_participants,
    allowsOutfitChange: data.allows_outfit_change,
    recommendedFor: data.recommended_for,
    extraFeeConditions: data.extra_fee_conditions,
    travelFee: data.travel_fee,
    nightSurcharge: data.night_surcharge,
    weekendSurcharge: data.weekend_surcharge,
    notes: data.notes,
  };
}
