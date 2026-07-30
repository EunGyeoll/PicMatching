import Link from "next/link";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { getBookablePhotographer } from "@/lib/data/booking";

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string; serviceId: string }>;
}) {
  const { id, serviceId } = await params;

  const photographer = await getBookablePhotographer(id);
  const service = photographer?.services.find((s) => s.id === serviceId);

  if (!photographer || !service) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-120 flex-col items-center justify-center gap-3 px-6 text-center">
        <h1 className="text-lg font-semibold text-stone-900">
          촬영 서비스를 찾을 수 없어요
        </h1>
        <Link href={`/photographers/${id}`} className="text-sm text-stone-900 underline">
          촬영자 프로필로 돌아가기
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-120 flex-col pb-24">
      <div className="relative aspect-[4/5] bg-stone-100">
        {service.coverImageUrl ? (
          <Image
            src={service.coverImageUrl}
            alt={service.title}
            fill
            sizes="480px"
            className="object-cover"
            priority
          />
        ) : null}
        <Link
          href={`/photographers/${id}`}
          aria-label="촬영자 프로필로"
          className="absolute top-3 left-3 flex size-8 items-center justify-center rounded-full bg-white/90 text-stone-700"
        >
          <ChevronLeft className="size-5" />
        </Link>
      </div>

      <div className="flex flex-col gap-2 border-b border-stone-100 p-4">
        <Link href={`/photographers/${id}`} className="flex min-w-0 items-center gap-2">
          <div className="relative size-7 shrink-0 overflow-hidden rounded-full bg-stone-100">
            {photographer.avatarUrl ? (
              <Image
                src={photographer.avatarUrl}
                alt={photographer.displayName}
                fill
                sizes="28px"
                className="object-cover"
              />
            ) : (
              <span className="flex size-full items-center justify-center text-[10px] font-semibold text-stone-400">
                {photographer.displayName.slice(0, 1)}
              </span>
            )}
          </div>
          <span className="min-w-0 truncate text-xs font-medium text-stone-500">
            {photographer.displayName}
          </span>
        </Link>
        <h1 className="text-base font-bold wrap-break-word text-stone-900">{service.title}</h1>
        <div className="text-sm font-extrabold text-stone-900">
          {service.price.toLocaleString()}원{" "}
          <span className="text-xs font-medium text-stone-400">
            · {service.durationMinutes}분
          </span>
        </div>
        {service.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {service.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[10.5px] text-stone-600"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5 border-b border-stone-100 p-4">
        <h2 className="text-xs font-bold text-stone-400">상세 설명</h2>
        <p className="text-[12.5px] leading-relaxed whitespace-pre-line text-stone-700">
          {service.description}
        </p>
      </div>

      <div className="flex flex-col gap-2 border-b border-stone-100 p-4 text-[12px]">
        <h2 className="text-xs font-bold text-stone-400">포함 사항</h2>
        <Row k="포함 사항" v={service.inclusions ?? "안내 없음"} />
        <Row
          k="보정본"
          v={service.retouchedPhotoCount ? `${service.retouchedPhotoCount}장` : "안내 없음"}
        />
        <Row
          k="원본 제공"
          v={
            service.providesRawFiles === null
              ? "안내 없음"
              : service.providesRawFiles
                ? "제공"
                : "미제공"
          }
        />
        <Row k="전달 기간" v={service.deliveryDays ? `${service.deliveryDays}일 이내` : "안내 없음"} />
        <Row
          k="촬영 가능 인원"
          v={service.maxParticipants ? `최대 ${service.maxParticipants}인` : "제한 없음"}
        />
        <Row k="추가 비용 조건" v={service.extraFeeConditions ?? "없음"} />
      </div>

      <div className="fixed inset-x-0 bottom-0 mx-auto flex max-w-120 items-center justify-between border-t border-stone-200 bg-white px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom))]">
        <div className="flex flex-col">
          <span className="text-[10px] text-stone-400">가격</span>
          <span className="text-[15px] font-extrabold text-stone-900">
            {service.price.toLocaleString()}원
          </span>
        </div>
        <Link
          href={`/booking/${id}/service?service=${service.id}`}
          className="rounded-lg bg-stone-900 px-5 py-3 text-[13px] font-bold text-white"
        >
          이 서비스로 예약하기
        </Link>
      </div>
    </main>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-stone-400">{k}</span>
      <span className="font-semibold text-stone-700">{v}</span>
    </div>
  );
}
