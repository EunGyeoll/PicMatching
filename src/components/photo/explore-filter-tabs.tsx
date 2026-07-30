"use client";

import { useState } from "react";
import { FilterChip } from "@/components/common/filter-chip";

export type ExploreFilterCategory = {
  key: string;
  label: string;
  hasActiveSelection: boolean;
  options: { label: string; href: string; active: boolean }[];
};

export function ExploreFilterTabs({
  categories,
}: {
  categories: ExploreFilterCategory[];
}) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const openCategory = categories.find((c) => c.key === openKey) ?? null;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1.5">
        {categories.map((category) => (
          <button
            key={category.key}
            type="button"
            onClick={() => setOpenKey(openKey === category.key ? null : category.key)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
              openKey === category.key
                ? "bg-stone-900 text-white"
                : category.hasActiveSelection
                  ? "bg-stone-100 text-stone-900"
                  : "text-stone-500"
            }`}
          >
            {category.label}
            {category.hasActiveSelection ? (
              <span className="size-1.5 rounded-full bg-amber-600" />
            ) : null}
          </button>
        ))}
      </div>

      {openCategory ? (
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {openCategory.options.map((option) => (
            <FilterChip key={option.label} href={option.href} active={option.active}>
              {option.label}
            </FilterChip>
          ))}
        </div>
      ) : null}
    </div>
  );
}
