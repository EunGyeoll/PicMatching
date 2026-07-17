"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useBookingStore, type BookingLocationType } from "@/lib/stores/booking-store";
import { BookingStepHeader } from "@/components/booking/step-header";
import type { LocationOption } from "@/types/domain";

type Tab = "recommended" | "popular" | "custom" | "tbd";

export function LocationPicker({
  photographerId,
  options,
}: {
  photographerId: string;
  options: { recommended: LocationOption[]; popular: LocationOption[] };
}) {
  const router = useRouter();
  const store = useBookingStore();
  const setLocation = useBookingStore((s) => s.setLocation);

  const [tab, setTab] = useState<Tab>("custom");
  const [selectedCatalogId, setSelectedCatalogId] = useState<string | null>(null);
  const [placeName, setPlaceName] = useState("");
  const [placeDetail, setPlaceDetail] = useState("");

  useEffect(() => {
    if (!store.serviceId) {
      router.replace(`/booking/${photographerId}/service`);
    } else if (!store.date || !store.startTime) {
      router.replace(`/booking/${photographerId}/schedule`);
    }
  }, [store.serviceId, store.date, store.startTime, photographerId, router]);

  if (!store.serviceId || !store.date || !store.startTime) {
    return null;
  }

  const catalogList = tab === "recommended" ? options.recommended : options.popular;

  const canProceed =
    (tab === "recommended" || tab === "popular")
      ? Boolean(selectedCatalogId)
      : tab === "custom"
        ? placeName.trim().length > 0
        : true;

  function handleNext() {
    if (tab === "recommended" || tab === "popular") {
      const picked = catalogList.find((l) => l.id === selectedCatalogId);
      if (!picked) return;
      setLocation({
        locationType: "catalog" as BookingLocationType,
        locationId: picked.id,
        locationLabel: picked.name,
        locationAddress: picked.address,
      });
    } else if (tab === "custom") {
      setLocation({
        locationType: "custom" as BookingLocationType,
        locationId: null,
        locationLabel: placeName.trim(),
        locationAddress: placeDetail.trim() || null,
      });
    } else {
      setLocation({
        locationType: "tbd" as BookingLocationType,
        locationId: null,
        locationLabel: "촬영자와 추후 협의",
        locationAddress: null,
      });
    }
    router.push(`/booking/${photographerId}/confirm`);
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-120 flex-col pb-28">
      <BookingStepHeader title="촬영 장소" step={3} />

      <div className="flex gap-1.5 overflow-x-auto p-4 pb-2">
        {(
          [
            ["recommended", "촬영자 추천"],
            ["popular", "인기 장소"],
            ["custom", "직접 입력"],
            ["tbd", "추후 협의"],
          ] as [Tab, string][]
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setTab(value)}
            className={`shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-[11.5px] ${
              tab === value
                ? "border-stone-800 bg-stone-800 font-semibold text-white"
                : "border-stone-200 text-stone-600"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 px-4 pb-4">
        {(tab === "recommended" || tab === "popular") &&
          (catalogList.length > 0 ? (
            catalogList.map((location) => (
              <button
                key={location.id}
                type="button"
                onClick={() => setSelectedCatalogId(location.id)}
                className={`flex gap-3 rounded-xl border p-3 text-left ${
                  selectedCatalogId === location.id
                    ? "border-stone-900 bg-stone-50"
                    : "border-stone-200"
                }`}
              >
                <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                  {location.coverImageUrl ? (
                    <Image
                      src={location.coverImageUrl}
                      alt={location.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[12.5px] font-bold text-stone-900">
                    {location.name}
                  </span>
                  <span className="text-[10.5px] text-stone-400">
                    {location.area}
                    {location.hasTravelFee ? " · 이동비 발생" : ""}
                  </span>
                  {location.description ? (
                    <span className="text-[10.5px] text-stone-500">
                      {location.description}
                    </span>
                  ) : null}
                </div>
              </button>
            ))
          ) : (
            <p className="py-10 text-center text-xs text-stone-400">
              {tab === "recommended"
                ? "촬영자가 등록한 추천 장소가 아직 없어요."
                : "등록된 인기 장소가 아직 없어요."}
            </p>
          ))}

        {tab === "custom" ? (
          <div className="flex flex-col gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-stone-400">장소명</span>
              <input
                value={placeName}
                onChange={(e) => setPlaceName(e.target.value)}
                placeholder="예: 서울숲 갤러리아포레 앞"
                className="rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-stone-500"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-stone-400">
                상세 위치 / 만남 안내
              </span>
              <textarea
                value={placeDetail}
                onChange={(e) => setPlaceDetail(e.target.value)}
                placeholder="예: 지하철 2호선 뚝섬역 8번 출구"
                rows={3}
                className="rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-stone-500"
              />
            </label>
          </div>
        ) : null}

        {tab === "tbd" ? (
          <p className="py-10 text-center text-xs text-stone-400">
            예약 요청 후 촬영자와 채팅 또는 연락처로 장소를 협의해주세요.
          </p>
        ) : null}
      </div>

      <div className="fixed inset-x-0 bottom-0 mx-auto max-w-120 border-t border-stone-200 bg-white p-4 pb-[max(16px,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={handleNext}
          disabled={!canProceed}
          className="w-full rounded-lg bg-stone-900 py-3.5 text-sm font-bold text-white disabled:opacity-40"
        >
          다음: 예약 확인
        </button>
      </div>
    </main>
  );
}
