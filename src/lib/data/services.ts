import { createClient } from "@/lib/supabase/server";
import { getPublicStorageUrl } from "@/lib/supabase/storage";
import { intersectServiceIdsByLabels } from "@/lib/data/tags";
import type { ServiceCard } from "@/types/domain";

function toServiceCard(row: {
  id: string;
  title: string;
  price: number;
  duration_minutes: number;
  cover_image_path: string | null;
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
      ? getPublicStorageUrl("services", row.cover_image_path)
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
      "id, title, price, duration_minutes, cover_image_path, photographer_id, areas, photographer_profiles!inner(display_name)",
    )
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []).map(toServiceCard);
}

export type ServiceFilters = {
  purpose?: string;
  mood?: string;
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
      "id, title, price, duration_minutes, cover_image_path, photographer_id, areas, photographer_profiles!inner(display_name)",
    )
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (idFilter) {
    query = query.in("id", idFilter);
  }

  const { data } = await query;
  return (data ?? []).map(toServiceCard);
}
