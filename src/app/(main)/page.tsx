import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { getFeaturedServices } from "@/lib/data/services";
import { getServiceTagsByCategory } from "@/lib/data/tags";
import { getRecentlyActivePhotographers } from "@/lib/data/photographers";
import { ServiceCard } from "@/components/photo/service-card";
import { PhotographerStoryTray } from "@/components/photo/photographer-story-tray";

export default async function Home() {
  const [featuredServices, tags, recentPhotographers] = await Promise.all([
    getFeaturedServices(10),
    getServiceTagsByCategory(),
    getRecentlyActivePhotographers(12),
  ]);

  return (
    <main className="mx-auto max-w-120 pb-6">
      <div className="flex items-center justify-between px-4 py-3">
        <Image src="/logo.svg" alt="moodi" width={80} height={24} priority />
        <Link
          href="/explore"
          aria-label="탐색으로 이동"
          className="flex size-8 items-center justify-center rounded-full border border-stone-200 text-stone-500"
        >
          <Search className="size-4" />
        </Link>
      </div>

      <PhotographerStoryTray photographers={recentPhotographers} />

      <div className="flex gap-1.5 overflow-x-auto px-4 pb-1">
        <Link
          href="/explore"
          className="shrink-0 whitespace-nowrap rounded-full border border-stone-800 bg-stone-800 px-3 py-1.5 text-[11.5px] font-semibold text-white"
        >
          전체
        </Link>
        {tags.purpose.map((label) => (
          <Link
            key={label}
            href={`/explore?purpose=${encodeURIComponent(label)}`}
            className="shrink-0 whitespace-nowrap rounded-full border border-stone-200 px-3 py-1.5 text-[11.5px] text-stone-600"
          >
            {label}
          </Link>
        ))}
      </div>

      <section className="flex flex-col gap-2.5 px-4 py-5">
        <h2 className="text-sm font-bold text-stone-900">지금 만나볼 수 있는 촬영</h2>
        {featuredServices.length > 0 ? (
          <div className="flex gap-2.5 overflow-x-auto pb-1">
            {featuredServices.map((service) => (
              <ServiceCard key={service.id} service={service} variant="carousel" />
            ))}
            <Link
              href="/explore"
              className="flex w-42 shrink-0 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-stone-300 text-center text-xs text-stone-500"
            >
              <span>탐색에서</span>
              <span>더 보기 →</span>
            </Link>
          </div>
        ) : (
          <p className="py-6 text-center text-xs text-stone-400">
            아직 등록된 촬영 서비스가 없어요.
          </p>
        )}
      </section>

      <section className="flex flex-col gap-2.5 px-4 py-5">
        <h2 className="text-sm font-bold text-stone-900">무드로 찾기</h2>
        <div className="grid grid-cols-3 gap-2">
          {tags.mood.slice(0, 6).map((label) => (
            <Link
              key={label}
              href={`/explore?mood=${encodeURIComponent(label)}`}
              className="flex aspect-square items-end rounded-xl bg-stone-100 p-2.5 text-[11px] font-semibold text-stone-700"
            >
              {label}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
