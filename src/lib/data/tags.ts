import { createClient } from "@/lib/supabase/server";
import { getPublicStorageUrl } from "@/lib/supabase/storage";
import type { MoodDiscoveryTile } from "@/types/domain";

/** 촬영 목적/무드 태그 전체 목록을 카테고리별로 반환합니다. */
export async function getServiceTagsByCategory(): Promise<{
  purpose: string[];
  mood: string[];
}> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("service_tags")
    .select("category, label")
    .order("id");

  const purpose = (data ?? [])
    .filter((t) => t.category === "purpose")
    .map((t) => t.label);
  const mood = (data ?? [])
    .filter((t) => t.category === "mood")
    .map((t) => t.label);

  return { purpose, mood };
}

/** 서비스 등록 화면의 태그 선택 칩에 쓰는 id+라벨 목록입니다. */
export async function getServiceTagOptions(): Promise<{
  purpose: { id: number; label: string }[];
  mood: { id: number; label: string }[];
}> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("service_tags")
    .select("id, category, label")
    .order("id");

  const purpose = (data ?? [])
    .filter((t) => t.category === "purpose")
    .map((t) => ({ id: t.id, label: t.label }));
  const mood = (data ?? [])
    .filter((t) => t.category === "mood")
    .map((t) => ({ id: t.id, label: t.label }));

  return { purpose, mood };
}

/**
 * 무드 태그 중 실제로 공개된 서비스가 연결된 것만, 그 서비스의 커버 사진과 함께 반환합니다.
 * 태그당 가장 최근에 등록된 서비스의 커버 사진 1장을 대표 이미지로 씁니다.
 */
export async function getMoodDiscoveryTiles(limit = 6): Promise<MoodDiscoveryTile[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("service_tags")
    .select(
      `label,
       photographer_service_tags!inner(
         shooting_services!inner(cover_image_path, is_published, created_at, updated_at)
       )`,
    )
    .eq("category", "mood")
    .eq("photographer_service_tags.shooting_services.is_published", true)
    .order("id");

  const tiles: MoodDiscoveryTile[] = [];

  for (const tag of data ?? []) {
    const services = tag.photographer_service_tags
      .map((t) => t.shooting_services)
      .filter((s) => s.cover_image_path !== null)
      .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));

    if (services.length === 0) continue;

    tiles.push({
      label: tag.label,
      photoUrl: getPublicStorageUrl(
        "services",
        services[0].cover_image_path!,
        services[0].updated_at,
      ),
    });

    if (tiles.length >= limit) break;
  }

  return tiles;
}

/** 태그 라벨(예: "데이트")로 그 태그가 붙은 촬영 서비스 id 목록을 반환합니다. */
export async function serviceIdsWithTagLabel(label: string): Promise<string[]> {
  const supabase = await createClient();

  const { data: tag } = await supabase
    .from("service_tags")
    .select("id")
    .eq("label", label)
    .maybeSingle();

  if (!tag) return [];

  const { data: links } = await supabase
    .from("photographer_service_tags")
    .select("service_id")
    .eq("tag_id", tag.id);

  return (links ?? []).map((l) => l.service_id);
}

/**
 * 여러 필터 라벨을 AND 조건으로 결합해 서비스 id 목록을 좁힙니다.
 * 반환값이 null이면 필터가 없다는 뜻이고, 빈 배열이면 조건에 맞는 서비스가 없다는 뜻입니다.
 */
export async function intersectServiceIdsByLabels(
  labels: (string | undefined)[],
): Promise<string[] | null> {
  let result: string[] | null = null;

  for (const label of labels) {
    if (!label) continue;
    const ids = await serviceIdsWithTagLabel(label);
    result = result ? result.filter((id) => ids.includes(id)) : ids;
  }

  return result;
}
