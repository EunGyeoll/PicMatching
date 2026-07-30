"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export function BookingStepHeader({
  title,
  step,
}: {
  title: string;
  step: 1 | 2 | 3 | 4;
}) {
  const router = useRouter();

  return (
    <div className="border-b border-stone-200 px-4 py-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="이전으로"
          className="-ml-2 flex size-11 items-center justify-center text-stone-400"
        >
          <ChevronLeft className="size-5" />
        </button>
        <span className="text-sm font-bold text-stone-900">{title}</span>
      </div>
      <div className="mt-2.5 flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={`h-[3px] flex-1 rounded-full ${
              i <= step ? "bg-stone-900" : "bg-stone-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
