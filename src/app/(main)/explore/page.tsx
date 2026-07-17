import Link from "next/link";
import { getExploreServices } from "@/lib/data/services";
import { getExplorePhotographers } from "@/lib/data/photographers";
import { getServiceTagsByCategory } from "@/lib/data/tags";
import { ServiceCard } from "@/components/photo/service-card";
import { PhotographerListItem } from "@/components/photo/photographer-list-item";
import { FilterChip } from "@/components/common/filter-chip";
import { EmptyState } from "@/components/common/empty-state";

type ExploreSearchParams = {
  view?: string;
  purpose?: string;
  mood?: string;
};

function buildHref(params: ExploreSearchParams, overrides: ExploreSearchParams) {
  const merged = { ...params, ...overrides };
  const query = new URLSearchParams();
  if (merged.view && merged.view !== "photos") query.set("view", merged.view);
  if (merged.purpose) query.set("purpose", merged.purpose);
  if (merged.mood) query.set("mood", merged.mood);
  const qs = query.toString();
  return qs ? `/explore?${qs}` : "/explore";
}

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<ExploreSearchParams>;
}) {
  const params = await searchParams;
  const view = params.view === "photographers" ? "photographers" : "photos";
  const filters = { purpose: params.purpose, mood: params.mood };

  const [services, photographers, tags] = await Promise.all([
    view === "photos" ? getExploreServices(filters) : Promise.resolve([]),
    view === "photographers" ? getExplorePhotographers(filters) : Promise.resolve([]),
    getServiceTagsByCategory(),
  ]);

  const hasResults = view === "photos" ? services.length > 0 : photographers.length > 0;
  const hasActiveFilter = Boolean(params.purpose || params.mood);

  return (
    <main className="mx-auto max-w-120">
      <div className="flex flex-col gap-2.5 border-b border-stone-100 px-4 py-3">
        <div className="flex gap-1 rounded-full bg-stone-100 p-1">
          <Link
            href={buildHref(params, { view: "photos" })}
            className={`flex-1 rounded-full py-1.5 text-center text-xs font-semibold ${
              view === "photos" ? "bg-white text-stone-900 shadow-sm" : "text-stone-400"
            }`}
          >
            사진
          </Link>
          <Link
            href={buildHref(params, { view: "photographers" })}
            className={`flex-1 rounded-full py-1.5 text-center text-xs font-semibold ${
              view === "photographers" ? "bg-white text-stone-900 shadow-sm" : "text-stone-400"
            }`}
          >
            촬영자
          </Link>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1">
          <FilterChip href={buildHref(params, { purpose: undefined })} active={!params.purpose}>
            목적 전체
          </FilterChip>
          {tags.purpose.map((label) => (
            <FilterChip
              key={label}
              href={buildHref(params, { purpose: params.purpose === label ? undefined : label })}
              active={params.purpose === label}
            >
              {label}
            </FilterChip>
          ))}
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1">
          <FilterChip href={buildHref(params, { mood: undefined })} active={!params.mood}>
            무드 전체
          </FilterChip>
          {tags.mood.map((label) => (
            <FilterChip
              key={label}
              href={buildHref(params, { mood: params.mood === label ? undefined : label })}
              active={params.mood === label}
            >
              {label}
            </FilterChip>
          ))}
        </div>
      </div>

      {!hasResults ? (
        <EmptyState
          icon="🔍"
          title="검색 결과가 없어요"
          description="다른 필터로 다시 찾아보세요"
          action={
            hasActiveFilter ? (
              <Link
                href={buildHref(params, { purpose: undefined, mood: undefined })}
                className="mt-1 rounded-full border border-stone-300 px-3 py-1.5 text-xs text-stone-600"
              >
                필터 초기화
              </Link>
            ) : undefined
          }
        />
      ) : view === "photos" ? (
        <div className="grid grid-cols-2 gap-3 p-4">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} variant="grid" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col">
          {photographers.map((photographer) => (
            <PhotographerListItem key={photographer.id} photographer={photographer} />
          ))}
        </div>
      )}
    </main>
  );
}
