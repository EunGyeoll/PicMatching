import Link from "next/link";
import Image from "next/image";
import type { RecentlyActivePhotographer } from "@/types/domain";

export function PhotographerStoryTray({
  photographers,
}: {
  photographers: RecentlyActivePhotographer[];
}) {
  if (photographers.length === 0) return null;

  return (
    <section className="border-b border-stone-100 pb-3">
      <div className="flex gap-3.5 overflow-x-auto px-4">
        {photographers.map((photographer) => (
          <Link
            key={photographer.id}
            href={`/photographers/${photographer.id}`}
            className="flex w-14 shrink-0 flex-col items-center gap-1"
          >
            <div
              className={`rounded-full p-0.5 ${
                photographer.hasRecentUpdate ? "bg-amber-700" : "bg-stone-200"
              }`}
            >
              <div className="relative size-13 overflow-hidden rounded-full border-2 border-white bg-stone-100">
                {photographer.avatarUrl ? (
                  <Image
                    src={photographer.avatarUrl}
                    alt={photographer.displayName}
                    fill
                    sizes="52px"
                    className="object-cover"
                  />
                ) : (
                  <span className="flex size-full items-center justify-center text-sm font-semibold text-stone-400">
                    {photographer.displayName.slice(0, 1)}
                  </span>
                )}
              </div>
            </div>
            <span className="max-w-14 truncate text-[9.5px] text-stone-600">
              {photographer.displayName}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
