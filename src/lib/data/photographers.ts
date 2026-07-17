import { createClient } from "@/lib/supabase/server";
import { getPublicStorageUrl } from "@/lib/supabase/storage";
import { intersectServiceIdsByLabels } from "@/lib/data/tags";
import type {
  PhotographerDetail,
  PhotographerSummary,
  RecentlyActivePhotographer,
  ServiceDetail,
} from "@/types/domain";

const RECENT_UPDATE_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

/** 최근 포트폴리오를 올린 순으로 활성 촬영자를 반환합니다 (홈 스토리 바용). */
export async function getRecentlyActivePhotographers(
  limit: number,
): Promise<RecentlyActivePhotographer[]> {
  const supabase = await createClient();

  const { data: portfolioRows } = await supabase
    .from("portfolio_images")
    .select("photographer_id, created_at")
    .order("created_at", { ascending: false })
    .limit(300);

  const latestByPhotographer = new Map<string, string>();
  for (const row of portfolioRows ?? []) {
    if (!latestByPhotographer.has(row.photographer_id)) {
      latestByPhotographer.set(row.photographer_id, row.created_at);
    }
  }

  const candidateIds = [...latestByPhotographer.keys()].slice(0, limit);
  if (candidateIds.length === 0) return [];

  const [{ data: photographers }, { data: profiles }] = await Promise.all([
    supabase
      .from("photographer_profiles")
      .select("id, display_name")
      .in("id", candidateIds)
      .eq("status", "active"),
    supabase.from("profiles").select("id, avatar_url").in("id", candidateIds),
  ]);

  const nameById = new Map((photographers ?? []).map((p) => [p.id, p.display_name]));
  const avatarById = new Map((profiles ?? []).map((p) => [p.id, p.avatar_url]));
  const activeIds = new Set((photographers ?? []).map((p) => p.id));
  const recentCutoff = Date.now() - RECENT_UPDATE_WINDOW_MS;

  return candidateIds
    .filter((id) => activeIds.has(id))
    .map((id) => ({
      id,
      displayName: nameById.get(id) ?? "",
      avatarUrl: avatarById.get(id) ?? null,
      hasRecentUpdate:
        new Date(latestByPhotographer.get(id)!).getTime() >= recentCutoff,
    }));
}

export type PhotographerFilters = {
  purpose?: string;
  mood?: string;
};

export async function getExplorePhotographers(
  filters: PhotographerFilters,
): Promise<PhotographerSummary[]> {
  const supabase = await createClient();

  const idFilter = await intersectServiceIdsByLabels([
    filters.purpose,
    filters.mood,
  ]);
  if (idFilter && idFilter.length === 0) return [];

  const { data } = await supabase
    .from("photographer_profiles")
    .select(
      `id, display_name,
       photographer_areas(area),
       portfolio_images(storage_path, sort_order),
       shooting_services(id, price, is_published,
         photographer_service_tags(service_tags(label)))`,
    )
    .eq("status", "active")
    .order("created_at", { ascending: false });

  const summaries: PhotographerSummary[] = [];

  for (const row of data ?? []) {
    const publishedServices = row.shooting_services.filter(
      (s) => s.is_published,
    );
    if (publishedServices.length === 0) continue;

    if (idFilter && !publishedServices.some((s) => idFilter.includes(s.id))) {
      continue;
    }

    const sortedPortfolio = [...row.portfolio_images].sort(
      (a, b) => a.sort_order - b.sort_order,
    );

    const styleTags = [
      ...new Set(
        publishedServices.flatMap((s) =>
          s.photographer_service_tags.map((t) => t.service_tags.label),
        ),
      ),
    ];

    summaries.push({
      id: row.id,
      displayName: row.display_name,
      areas: row.photographer_areas.map((a) => a.area),
      styleTags,
      startingPrice: Math.min(...publishedServices.map((s) => s.price)),
      coverImageUrl: sortedPortfolio[0]
        ? getPublicStorageUrl("portfolios", sortedPortfolio[0].storage_path)
        : null,
    });
  }

  return summaries;
}

export async function getPhotographerDetail(
  id: string,
): Promise<PhotographerDetail | null> {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("photographer_profiles")
    .select(
      `id, display_name, headline, bio, cancellation_policy,
       photographer_areas(area)`,
    )
    .eq("id", id)
    .eq("status", "active")
    .maybeSingle();

  if (!profile) return null;

  const [{ data: account }, { data: portfolio }, { data: services }, { count: reviewCount }] =
    await Promise.all([
      supabase.from("profiles").select("avatar_url").eq("id", id).single(),
      supabase
        .from("portfolio_images")
        .select("id, storage_path")
        .eq("photographer_id", id)
        .order("sort_order"),
      supabase
        .from("shooting_services")
        .select(
          `id, title, description, price, duration_minutes, cover_image_path,
           inclusions, retouched_photo_count, provides_raw_files, delivery_days,
           max_participants, extra_fee_conditions,
           photographer_service_tags(service_tags(label))`,
        )
        .eq("photographer_id", id)
        .eq("is_published", true)
        .order("created_at", { ascending: false }),
      // reviews는 RLS로 전체 공개(reviews_select_all)라 누구나 조회 가능
      supabase
        .from("reviews")
        .select("id", { count: "exact", head: true })
        .eq("photographer_id", id),
    ]);

  const serviceDetails: ServiceDetail[] = (services ?? []).map((s) => ({
    id: s.id,
    title: s.title,
    description: s.description,
    price: s.price,
    durationMinutes: s.duration_minutes,
    coverImageUrl: s.cover_image_path
      ? getPublicStorageUrl("services", s.cover_image_path)
      : null,
    inclusions: s.inclusions,
    retouchedPhotoCount: s.retouched_photo_count,
    providesRawFiles: s.provides_raw_files,
    deliveryDays: s.delivery_days,
    maxParticipants: s.max_participants,
    extraFeeConditions: s.extra_fee_conditions,
    tags: s.photographer_service_tags.map((t) => t.service_tags.label),
  }));

  return {
    id: profile.id,
    displayName: profile.display_name,
    headline: profile.headline,
    bio: profile.bio,
    avatarUrl: account?.avatar_url
      ? account.avatar_url
      : null,
    areas: profile.photographer_areas.map((a) => a.area),
    cancellationPolicy: profile.cancellation_policy,
    portfolioImages: (portfolio ?? []).map((p) => ({
      id: p.id,
      url: getPublicStorageUrl("portfolios", p.storage_path),
    })),
    services: serviceDetails,
    reviewCount: reviewCount ?? 0,
    // TODO: bookings는 RLS상 당사자(고객/촬영자)만 조회할 수 있어 공개 페이지에서
    // 완료 건수를 직접 셀 수 없습니다. 지금은 완료된 예약이 실제로 하나도 없어 0이 정확한
    // 값이지만, 예약 기능이 생기면 완료 건수만 안전하게 노출하는 공개 집계 함수(RPC)가 필요합니다.
    completedBookingCount: 0,
  };
}
