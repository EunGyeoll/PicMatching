"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useBookingStore } from "@/lib/stores/booking-store";
import { BookingStepHeader } from "@/components/booking/step-header";
import type { BookablePhotographer } from "@/types/domain";

export function ServicePicker({
  photographer,
  preselectedServiceId,
}: {
  photographer: BookablePhotographer;
  preselectedServiceId: string | null;
}) {
  const router = useRouter();
  const setService = useBookingStore((s) => s.setService);

  const initial =
    photographer.services.find((s) => s.id === preselectedServiceId) ??
    photographer.services[0];
  const [selectedId, setSelectedId] = useState(initial.id);
  const selected = photographer.services.find((s) => s.id === selectedId)!;

  function handleNext() {
    setService({
      photographerId: photographer.id,
      photographerName: photographer.displayName,
      cancellationPolicy: photographer.cancellationPolicy,
      serviceId: selected.id,
      serviceTitle: selected.title,
      serviceCoverImageUrl: selected.coverImageUrl,
      basePrice: selected.price,
      durationMinutes: selected.durationMinutes,
      bufferBeforeMinutes: selected.bufferBeforeMinutes,
      bufferAfterMinutes: selected.bufferAfterMinutes,
      maxParticipants: selected.maxParticipants,
      travelFee: selected.travelFee,
      nightSurcharge: selected.nightSurcharge,
      weekendSurcharge: selected.weekendSurcharge,
    });
    router.push(`/booking/${photographer.id}/schedule`);
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-120 flex-col pb-28">
      <BookingStepHeader title={photographer.displayName} step={1} />

      <div className="flex flex-col gap-3 p-4">
        <h2 className="text-xs font-bold text-stone-400">촬영 서비스 선택</h2>
        {photographer.services.map((service) => {
          const isSelected = service.id === selectedId;
          return (
            <button
              key={service.id}
              type="button"
              onClick={() => setSelectedId(service.id)}
              className={`flex gap-3 rounded-xl border p-3 text-left ${
                isSelected ? "border-stone-900 bg-stone-50" : "border-stone-200"
              }`}
            >
              <div className="relative size-15 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                {service.coverImageUrl ? (
                  <Image
                    src={service.coverImageUrl}
                    alt={service.title}
                    fill
                    sizes="60px"
                    className="object-cover"
                  />
                ) : null}
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <div className="text-[12.5px] font-bold text-stone-900">
                  {service.title}
                </div>
                <div className="text-[10.5px] text-stone-400">
                  {service.price.toLocaleString()}원 · {service.durationMinutes}분
                </div>
                {isSelected ? (
                  <dl className="mt-1.5 flex flex-col gap-1 text-[11px]">
                    <Row k="포함" v={service.inclusions ?? "안내 없음"} />
                    <Row
                      k="보정본"
                      v={
                        service.retouchedPhotoCount
                          ? `${service.retouchedPhotoCount}장`
                          : "안내 없음"
                      }
                    />
                    <Row
                      k="원본 제공"
                      v={
                        service.providesRawFiles === null
                          ? "안내 없음"
                          : service.providesRawFiles
                            ? "제공"
                            : "미제공"
                      }
                    />
                    <Row
                      k="전달 기간"
                      v={service.deliveryDays ? `${service.deliveryDays}일 이내` : "안내 없음"}
                    />
                    <Row
                      k="촬영 가능 인원"
                      v={
                        service.maxParticipants
                          ? `최대 ${service.maxParticipants}인`
                          : "제한 없음"
                      }
                    />
                    <Row k="추가 비용" v={service.extraFeeConditions ?? "없음"} />
                  </dl>
                ) : null}
              </div>
              <span
                className={`mt-0.5 size-4 shrink-0 rounded-full border-2 ${
                  isSelected ? "border-stone-900 bg-stone-900" : "border-stone-300"
                }`}
              />
            </button>
          );
        })}
      </div>

      <div className="fixed inset-x-0 bottom-0 mx-auto max-w-120 border-t border-stone-200 bg-white p-4 pb-[max(16px,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={handleNext}
          className="w-full rounded-lg bg-stone-900 py-3.5 text-sm font-bold text-white"
        >
          다음: 날짜 선택
        </button>
      </div>
    </main>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-stone-400">{k}</dt>
      <dd className="font-semibold text-stone-700">{v}</dd>
    </div>
  );
}
