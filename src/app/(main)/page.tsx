import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { getFeaturedServices } from "@/lib/data/services";
import { getMoodDiscoveryTiles } from "@/lib/data/tags";
import { getRecentlyActivePhotographers } from "@/lib/data/photographers";
import { ServiceCard } from "@/components/photo/service-card";
import { PhotographerStoryTray } from "@/components/photo/photographer-story-tray";

export default async function Home() {
  const [featuredServices, recentPhotographers, moodTiles] = await Promise.all([
    getFeaturedServices(10),
    getRecentlyActivePhotographers(12),
    getMoodDiscoveryTiles(6),
  ]);

  return (
    <main className="mx-auto max-w-120 pb-6">
      <div className="flex items-center justify-between px-4 py-3">
        <Image src="/logo.svg" alt="moodi" width={100} height={27} priority />
        <Link
          href="/explore"
          aria-label="탐색으로 이동"
          className="flex size-8 items-center justify-center rounded-full border border-stone-200 text-stone-500"
        >
          <Search className="size-4" />
        </Link>
      </div>

      <PhotographerStoryTray photographers={recentPhotographers} />

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

      {moodTiles.length > 0 && (
        <section className="flex flex-col gap-2.5 px-4 py-5">
          <h2 className="text-sm font-bold text-stone-900">무드로 찾기</h2>
          <div className="grid grid-cols-3 gap-2">
            {moodTiles.map((tile) => (
              <Link key={tile.label} href={`/explore?mood=${encodeURIComponent(tile.label)}`}>
                <div className="relative aspect-4/5 overflow-hidden rounded-xl bg-stone-100">
                  <Image
                    src={tile.photoUrl}
                    alt=""
                    fill
                    sizes="(max-width: 480px) 33vw, 160px"
                    className="object-cover"
                  />
                </div>
                <p className="mt-1 truncate text-[11.5px] font-semibold text-stone-700">
                  {tile.label}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
