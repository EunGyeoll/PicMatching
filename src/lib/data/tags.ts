import { createClient } from "@/lib/supabase/server";

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
