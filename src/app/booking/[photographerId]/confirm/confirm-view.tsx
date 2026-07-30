"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus } from "lucide-react";
import { useBookingStore } from "@/lib/stores/booking-store";
import { BookingStepHeader } from "@/components/booking/step-header";
import { addMinutesToTime, dayOfWeek, formatDateChip } from "@/lib/date-time";
import { createBookingAction } from "./actions";

export function ConfirmView({ photographerId }: { photographerId: string }) {
  const router = useRouter();
  const store = useBookingStore();
  const setParticipantCount = useBookingStore((s) => s.setParticipantCount);
  const setRequests = useBookingStore((s) => s.setRequests);
  const reset = useBookingStore((s) => s.reset);

  const [agreed, setAgreed] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!store.serviceId) {
      router.replace(`/booking/${photographerId}/service`);
    } else if (!store.date || !store.startTime) {
      router.replace(`/booking/${photographerId}/schedule`);
    } else if (!store.locationType) {
      router.replace(`/booking/${photographerId}/location`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (
    !store.serviceId ||
    !store.date ||
    !store.startTime ||
    !store.locationType ||
    store.basePrice === null ||
    store.durationMinutes === null
  ) {
    return null;
  }

  const endTime = addMinutesToTime(store.startTime, store.durationMinutes);
  const maxParticipants = store.maxParticipants ?? 10;

  let additionalFee = 0;
  if (store.weekendSurcharge && [0, 6].includes(dayOfWeek(store.date))) {
    additionalFee += store.weekendSurcharge;
  }
  if (store.nightSurcharge && Number(store.startTime.slice(0, 2)) >= 18) {
    additionalFee += store.nightSurcharge;
  }
  if (store.travelFee && store.locationType === "custom") {
    additionalFee += store.travelFee;
  }
  const totalPrice = store.basePrice + additionalFee;

  const { dow, day } = formatDateChip(store.date);
  const [, month] = store.date.split("-");

  async function handleSubmit() {
    if (!agreed || pending) return;
    setPending(true);
    setError(null);

    const result = await createBookingAction({
      photographerId,
      serviceId: store.serviceId!,
      date: store.date!,
      startTime: store.startTime!,
      locationType: store.locationType!,
      locationId: store.locationId,
      locationLabel: store.locationLabel,
      locationAddress: store.locationAddress,
      participantCount: store.participantCount,
      requests: store.requests,
    });

    if ("error" in result) {
      setError(result.error);
      setPending(false);
      return;
    }

    reset();
    router.push(`/booking/complete?bookingId=${result.bookingId}`);
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-120 flex-col pb-28">
      <BookingStepHeader title="예약 확인" step={4} />

      <div className="flex flex-col gap-1.5 border-b border-stone-100 p-4 text-[12.5px]">
        <Row k="촬영자" v={store.photographerName ?? ""} />
        <Row k="서비스" v={store.serviceTitle ?? ""} />
        <Row k="일시" v={`${Number(month)}/${day}(${dow}) ${store.startTime}–${endTime}`} />
        <Row k="장소" v={store.locationLabel ?? ""} />
      </div>

      <div className="flex flex-col gap-3 border-b border-stone-100 p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-stone-400">촬영 인원</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setParticipantCount(Math.max(1, store.participantCount - 1))}
              className="flex size-7 items-center justify-center rounded-full border border-stone-300 text-stone-600"
              aria-label="인원 줄이기"
            >
              <Minus className="size-3.5" />
            </button>
            <span className="w-4 text-center text-sm font-bold">
              {store.participantCount}
            </span>
            <button
              type="button"
              onClick={() =>
                setParticipantCount(Math.min(maxParticipants, store.participantCount + 1))
              }
              className="flex size-7 items-center justify-center rounded-full border border-stone-300 text-stone-600"
              aria-label="인원 늘리기"
            >
              <Plus className="size-3.5" />
            </button>
          </div>
        </div>
        <span className="text-[10.5px] text-stone-400">최대 {maxParticipants}인</span>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-bold text-stone-400">요청 사항 (선택)</span>
          <textarea
            value={store.requests}
            onChange={(e) => setRequests(e.target.value)}
            rows={3}
            placeholder="편안한 분위기로 촬영 부탁드려요"
            className="rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-stone-500"
          />
        </label>
      </div>

      <div className="flex flex-col gap-1.5 border-b border-stone-100 p-4 text-xs">
        <div className="flex justify-between text-stone-500">
          <span>서비스 금액</span>
          <span>{store.basePrice.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between text-stone-500">
          <span>추가 비용</span>
          <span>{additionalFee.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between border-t border-stone-200 pt-2 text-sm font-extrabold text-stone-900">
          <span>총 금액</span>
          <span>{totalPrice.toLocaleString()}원</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 p-4">
        <h2 className="text-xs font-bold text-stone-400">취소 정책</h2>
        <p className="text-[11.5px] leading-relaxed text-stone-600">
          {store.cancellationPolicy ?? "촬영자가 등록한 취소 정책이 없습니다."}
        </p>
        <label className="mt-2 flex items-start gap-2 text-[11px] text-stone-600">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 size-4"
          />
          취소 정책 및 예약 정보를 확인했으며 이에 동의합니다
        </label>
      </div>

      {error ? (
        <p className="px-4 pb-2 text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <div className="fixed inset-x-0 bottom-0 mx-auto max-w-120 border-t border-stone-200 bg-white p-4 pb-[max(16px,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!agreed || pending}
          className="w-full rounded-lg bg-stone-900 py-3.5 text-sm font-bold text-white disabled:opacity-40"
        >
          {pending ? "요청 중..." : "예약 요청하기"}
        </button>
      </div>
    </main>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-stone-400">{k}</span>
      <span className="font-semibold text-stone-900">{v}</span>
    </div>
  );
}
