/**
 * 라우팅 골격 확인용 임시 화면입니다.
 * TODO: 각 라우트의 실제 화면 구현 단계(섹션 26)에서 이 컴포넌트 대신
 * 명세에 정의된 실제 UI로 교체합니다.
 */
export function RoutePlaceholder({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <main className="mx-auto flex min-h-dvh max-w-120 flex-col items-center justify-center gap-2 px-6 text-center">
      <h1 className="text-xl font-semibold">{title}</h1>
      {description ? (
        <p className="text-sm text-neutral-500">{description}</p>
      ) : null}
    </main>
  );
}
