/**
 * `version`을 넘기면 캐시 무효화용 쿼리스트링(`?v=`)을 붙입니다. Next.js Image Optimizer는
 * 같은 URL이면 원본이 바뀌어도 기본 4시간(minimumCacheTTL)까지 이전 이미지를 그대로 캐시해
 * 보여줄 수 있어서(경로가 고정된 커버 이미지처럼), 내용이 바뀔 때마다 URL도 바뀌게 해야 합니다.
 */
export function getPublicStorageUrl(
  bucket: string,
  path: string,
  version?: string | number | null,
) {
  const base = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
  return version ? `${base}?v=${encodeURIComponent(version)}` : base;
}
