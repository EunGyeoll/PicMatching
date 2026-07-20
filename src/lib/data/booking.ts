import { createClient } from "@/lib/supabase/server";
import { getPublicStorageUrl } from "@/lib/supabase/storage";
import type { BookablePhotographer, LocationOption } from "@/types/domain";

export async function getBookablePhotographer(
  photographerId: string,
): Promise<BookablePhotographer | null> {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("photographer_profiles")
    .select("id, display_name, cancellation_policy")
    .eq("id", photographerId)
    .eq("status", "active")
    .maybeSingle();

  if (!profile) return null;

  const { data: account } = await supabase
    .from("profiles")
    .select("avatar_url")
    .eq("id", photographerId)
    .single();

  const { data: services } = await supabase
    .from("shooting_services")
    .select(
      `id, title, description, price, duration_minutes, buffer_before_minutes,
       buffer_after_minutes, cover_image_path, updated_at, inclusions, retouched_photo_count,
       provides_raw_files, delivery_days, max_participants, extra_fee_conditions,
       travel_fee, night_surcharge, weekend_surcharge,
       photographer_service_tags(service_tags(label))`,
    )
    .eq("photographer_id", photographerId)
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  return {
    id: profile.id,
    displayName: profile.display_name,
    avatarUrl: account?.avatar_url ?? null,
    cancellationPolicy: profile.cancellation_policy,
    services: (services ?? []).map((s) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      price: s.price,
      durationMinutes: s.duration_minutes,
      bufferBeforeMinutes: s.buffer_before_minutes,
      bufferAfterMinutes: s.buffer_after_minutes,
      coverImageUrl: s.cover_image_path
        ? getPublicStorageUrl("services", s.cover_image_path, s.updated_at)
        : null,
      inclusions: s.inclusions,
      retouchedPhotoCount: s.retouched_photo_count,
      providesRawFiles: s.provides_raw_files,
      deliveryDays: s.delivery_days,
      maxParticipants: s.max_participants,
      extraFeeConditions: s.extra_fee_conditions,
      travelFee: s.travel_fee,
      nightSurcharge: s.night_surcharge,
      weekendSurcharge: s.weekend_surcharge,
      tags: s.photographer_service_tags.map((t) => t.service_tags.label),
    })),
  };
}

export async function getLocationOptions(
  photographerId: string,
): Promise<{ recommended: LocationOption[]; popular: LocationOption[] }> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("locations")
    .select(
      "id, name, area, description, address, cover_image_path, has_travel_fee, photographer_id",
    )
    .or(`photographer_id.eq.${photographerId},photographer_id.is.null`);

  const toOption = (row: NonNullable<typeof data>[number]): LocationOption => ({
    id: row.id,
    name: row.name,
    area: row.area,
    description: row.description,
    address: row.address,
    coverImageUrl: row.cover_image_path
      ? getPublicStorageUrl("services", row.cover_image_path)
      : null,
    hasTravelFee: row.has_travel_fee,
    isPhotographerOwn: row.photographer_id === photographerId,
  });

  const rows = data ?? [];
  return {
    recommended: rows.filter((r) => r.photographer_id === photographerId).map(toOption),
    popular: rows.filter((r) => r.photographer_id === null).map(toOption),
  };
}
