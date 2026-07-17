import { RoutePlaceholder } from "@/app/_components/route-placeholder";

export default async function PhotographerServiceEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <RoutePlaceholder
      title="촬영 서비스 수정 화면 준비 중입니다"
      description={`서비스 ID: ${id} — 촬영 서비스 수정 폼은 이후 단계에서 구현됩니다.`}
    />
  );
}
