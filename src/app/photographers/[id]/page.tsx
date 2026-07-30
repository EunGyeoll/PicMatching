import Link from "next/link";
import Image from "next/image";
import { getPhotographerDetail } from "@/lib/data/photographers";
import { PortfolioLightbox } from "@/components/photo/portfolio-lightbox";

export default async function PhotographerDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab } = await searchParams;
  const activeTab = tab === "services" ? "services" : "portfolio";

  const photographer = await getPhotographerDetail(id);

  if (!photographer) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-120 flex-col items-center justify-center gap-3 px-6 text-center">
        <h1 className="text-lg font-semibold text-stone-900">
          촬영자를 찾을 수 없습니다
        </h1>
        <p className="text-sm text-stone-500">
          삭제되었거나 존재하지 않는 촬영자예요.
        </p>
        <Link href="/explore" className="text-sm text-stone-900 underline">
          탐색으로 돌아가기
        </Link>
      </main>
    );
  }

  const startingPrice =
    photographer.services.length > 0
      ? Math.min(...photographer.services.map((s) => s.price))
      : null;

  return (
    <main className="mx-auto flex min-h-dvh max-w-120 flex-col pb-24">
      <div className="flex flex-col items-center gap-2 px-6 pt-8 pb-4 text-center">
        <div className="relative size-21 overflow-hidden rounded-full bg-stone-100">
          {photographer.avatarUrl ? (
            <Image
              src={photographer.avatarUrl}
              alt={photographer.displayName}
              fill
              sizes="84px"
              className="object-cover"
            />
          ) : (
            <span className="flex size-full items-center justify-center text-xl font-semibold text-stone-400">
              {photographer.displayName.slice(0, 1)}
            </span>
          )}
        </div>
        <h1 className="max-w-full wrap-break-word text-[15.5px] font-bold text-stone-900">
          {photographer.displayName}
        </h1>
        {photographer.headline ? (
          <p className="max-w-60 wrap-break-word text-xs text-stone-500">{photographer.headline}</p>
        ) : null}
        {photographer.areas.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-1">
            {photographer.areas.map((area) => (
              <span
                key={area}
                className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[10px] text-stone-600"
              >
                {area}
              </span>
            ))}
          </div>
        ) : null}
        <div className="flex gap-5 pt-2">
          <Stat value={photographer.portfolioImages.length} label="포트폴리오" />
          <Stat value={photographer.services.length} label="등록 서비스" />
          <Stat value={photographer.completedBookingCount} label="완료 촬영" />
          <Stat
            value={photographer.reviewCount > 0 ? photographer.reviewCount : "-"}
            label={photographer.reviewCount > 0 ? "후기" : "후기 없음"}
          />
        </div>
      </div>

      <div className="flex border-y border-stone-200">
        <Link
          href={`/photographers/${id}?tab=portfolio`}
          className={`flex-1 border-b-2 py-2.5 text-center text-[11.5px] font-bold ${
            activeTab === "portfolio"
              ? "border-stone-900 text-stone-900"
              : "border-transparent text-stone-400"
          }`}
        >
          포트폴리오
        </Link>
        <Link
          href={`/photographers/${id}?tab=services`}
          className={`flex-1 border-b-2 py-2.5 text-center text-[11.5px] font-bold ${
            activeTab === "services"
              ? "border-stone-900 text-stone-900"
              : "border-transparent text-stone-400"
          }`}
        >
          촬영 서비스
        </Link>
      </div>

      {activeTab === "portfolio" ? (
        photographer.portfolioImages.length > 0 ? (
          <PortfolioLightbox images={photographer.portfolioImages} />
        ) : (
          <p className="py-10 text-center text-xs text-stone-400">
            아직 등록된 포트폴리오가 없어요.
          </p>
        )
      ) : (
        <div className="flex flex-col gap-3 px-4 py-4">
          {photographer.services.length > 0 ? (
            photographer.services.map((service) => (
              <div
                key={service.id}
                className="flex gap-3 rounded-xl border border-stone-200 p-3"
              >
                <Link
                  href={`/photographers/${id}/services/${service.id}`}
                  className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-stone-100"
                >
                  {service.coverImageUrl ? (
                    <Image
                      src={service.coverImageUrl}
                      alt={service.title}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : null}
                </Link>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <Link
                    href={`/photographers/${id}/services/${service.id}`}
                    className="truncate text-[12.5px] font-bold text-stone-900"
                  >
                    {service.title}
                  </Link>
                  <div className="text-[10.5px] text-stone-400">
                    {service.price.toLocaleString()}원 · {service.durationMinutes}분
                    {service.retouchedPhotoCount
                      ? ` · 보정본 ${service.retouchedPhotoCount}장`
                      : ""}
                  </div>
                  {service.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {service.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] text-stone-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <Link
                    href={`/booking/${id}/service?service=${service.id}`}
                    className="mt-1 self-start rounded-full border border-stone-800 px-2.5 py-2 text-[10.5px] font-semibold text-stone-800"
                  >
                    이 서비스로 예약
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="py-10 text-center text-xs text-stone-400">
              아직 공개된 촬영 서비스가 없어요.
            </p>
          )}
        </div>
      )}

      {photographer.bio ? (
        <div className="flex flex-col gap-1.5 border-t border-stone-100 px-4 py-4">
          <h2 className="text-xs font-bold text-stone-400">소개</h2>
          <p className="text-[12.5px] leading-relaxed text-stone-700">
            {photographer.bio}
          </p>
        </div>
      ) : null}

      {photographer.cancellationPolicy ? (
        <div className="flex flex-col gap-1.5 border-t border-stone-100 px-4 py-4">
          <h2 className="text-xs font-bold text-stone-400">취소 정책</h2>
          <p className="text-[12.5px] leading-relaxed text-stone-700">
            {photographer.cancellationPolicy}
          </p>
        </div>
      ) : null}

      {startingPrice !== null ? (
        <div className="fixed inset-x-0 bottom-0 z-10 mx-auto flex max-w-120 items-center justify-between border-t border-stone-200 bg-white px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom))]">
          <div className="flex flex-col">
            <span className="text-[10px] text-stone-400">시작가</span>
            <span className="text-[15px] font-extrabold text-stone-900">
              {startingPrice.toLocaleString()}원부터
            </span>
          </div>
          <Link
            href={`/booking/${id}/service`}
            className="rounded-lg bg-stone-900 px-5 py-3 text-[13px] font-bold text-white"
          >
            예약하기
          </Link>
        </div>
      ) : null}
    </main>
  );
}

function Stat({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-sm font-extrabold text-stone-900">{value}</span>
      <span className="text-[9.5px] text-stone-400">{label}</span>
    </div>
  );
}
