import Link from "next/link";
import Image from "next/image";
import type { PhotographerSummary } from "@/types/domain";

export function PhotographerListItem({
  photographer,
}: {
  photographer: PhotographerSummary;
}) {
  return (
    <Link
      href={`/photographers/${photographer.id}`}
      className="flex gap-3 border-b border-stone-100 px-4 py-3"
    >
      <div className="relative size-19 shrink-0 overflow-hidden rounded-xl bg-stone-100">
        {photographer.coverImageUrl ? (
          <Image
            src={photographer.coverImageUrl}
            alt={photographer.displayName}
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : null}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="truncate text-[13px] font-bold text-stone-900">
          {photographer.displayName}
        </div>
        <div className="text-[11px] text-stone-400">
          {photographer.areas.join(" · ") || "활동 지역 미등록"}
        </div>
        {photographer.styleTags.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {photographer.styleTags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] text-stone-600"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
        <div className="text-[11px] text-stone-400">
          {photographer.startingPrice !== null
            ? `시작가 ${photographer.startingPrice.toLocaleString()}원`
            : "등록된 서비스 없음"}
          {" · 후기 아직 없음"}
        </div>
      </div>
    </Link>
  );
}
