import Link from "next/link";
import Image from "next/image";
import { requireAuthUser } from "@/lib/supabase/auth";
import { getMyServices } from "@/lib/data/services";
import { EmptyState } from "@/components/common/empty-state";
import { ServiceRowActions } from "./service-row-actions";

export default async function PhotographerServicesPage() {
  const user = await requireAuthUser("/photographer/services");
  const services = await getMyServices(user.id);

  return (
    <main className="px-0 py-2">
      <div className="flex items-center justify-between px-4 pt-2">
        <h1 className="text-base font-bold text-stone-900">내 서비스</h1>
        <Link
          href="/photographer/services/new"
          className="rounded-full bg-stone-900 px-3 py-2 text-[11.5px] font-bold text-white"
        >
          + 새 서비스 등록
        </Link>
      </div>

      {services.length === 0 ? (
        <EmptyState
          icon="🗂️"
          title="등록된 서비스가 없어요"
          description="새 서비스를 등록하면 여기서 관리할 수 있어요"
        />
      ) : (
        <div className="mt-3 flex flex-col">
          {services.map((service) => (
            <div
              key={service.id}
              className="flex gap-3 border-b border-stone-100 px-4 py-3"
            >
              <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                {service.coverImageUrl ? (
                  <Image
                    src={service.coverImageUrl}
                    alt={service.title}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : null}
              </div>
              <div className="flex flex-1 min-w-0 flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      service.isPublished
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-stone-100 text-stone-400"
                    }`}
                  >
                    {service.isPublished ? "공개중" : "비공개"}
                  </span>
                </div>
                <span className="truncate text-[12.5px] font-bold text-stone-900">
                  {service.title}
                </span>
                <div className="text-[11px] text-stone-400">
                  {service.price.toLocaleString()}원 · {service.durationMinutes}분
                </div>
                <ServiceRowActions serviceId={service.id} isPublished={service.isPublished} />
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
