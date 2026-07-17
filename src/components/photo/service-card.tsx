import Link from "next/link";
import Image from "next/image";
import type { ServiceCard as ServiceCardType } from "@/types/domain";

export function ServiceCard({
  service,
  variant = "carousel",
}: {
  service: ServiceCardType;
  variant?: "carousel" | "grid";
}) {
  return (
    <Link
      href={`/photographers/${service.photographerId}/services/${service.id}`}
      className={`flex flex-col gap-1.5 ${variant === "carousel" ? "w-42 shrink-0" : ""}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-stone-100">
        {service.coverImageUrl ? (
          <Image
            src={service.coverImageUrl}
            alt={service.title}
            fill
            sizes="200px"
            className="object-cover"
          />
        ) : null}
      </div>
      <div className="line-clamp-1 text-xs font-semibold text-stone-900">
        {service.title}
      </div>
      {variant === "grid" ? (
        <div className="text-[11px] text-stone-400">
          {service.photographerName}
          {service.areas[0] ? ` · ${service.areas[0]}` : ""} · 후기 아직 없음
        </div>
      ) : (
        <div className="text-[11px] text-stone-400">
          {service.durationMinutes}분
        </div>
      )}
      <div className="text-sm font-bold text-stone-900">
        {service.price.toLocaleString()}원
      </div>
    </Link>
  );
}
