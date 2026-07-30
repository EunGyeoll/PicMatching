"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useBookingStore } from "@/lib/stores/booking-store";
import { BookingStepHeader } from "@/components/booking/step-header";
import { upcomingDates, formatDateChip, addMinutesToTime } from "@/lib/date-time";
import { fetchAvailableSlotsAction } from "./actions";

const DATES = upcomingDates(14);

export function SchedulePicker({ photographerId }: { photographerId: string }) {
  const router = useRouter();
  const store = useBookingStore();
  const setSchedule = useBookingStore((s) => s.setSchedule);

  const [selectedDate, setSelectedDate] = useState(DATES[0]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, startTransition] = useTransition();

  useEffect(() => {
    if (!store.photographerId || !store.serviceId) {
      router.replace(`/booking/${photographerId}/service`);
    }
  }, [store.photographerId, store.serviceId, photographerId, router]);

  useEffect(() => {
    if (!store.serviceId || !store.durationMinutes) return;

    const durationMinutes = store.durationMinutes;
    const bufferBeforeMinutes = store.bufferBeforeMinutes ?? 0;
    const bufferAfterMinutes = store.bufferAfterMinutes ?? 0;

    startTransition(async () => {
      const result = await fetchAvailableSlotsAction({
        photographerId,
        date: selectedDate,
        durationMinutes,
        bufferBeforeMinutes,
        bufferAfterMinutes,
      });
      setSlots(result);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, store.serviceId, store.durationMinutes]);

  if (!store.photographerId || !store.serviceId || !store.durationMinutes) {
    return null;
  }

  function handleNext() {
    if (!selectedTime) return;
    setSchedule(selectedDate, selectedTime);
    router.push(`/booking/${photographerId}/location`);
  }

  const endTime = selectedTime
    ? addMinutesToTime(selectedTime, store.durationMinutes ?? 0)
    : null;

  return (
    <main className="mx-auto flex min-h-dvh max-w-120 flex-col pb-28">
      <BookingStepHeader title="날짜와 시간" step={2} />

      <div className="flex flex-col gap-2.5 border-b border-stone-100 p-4">
        <h2 className="text-xs font-bold text-stone-400">날짜</h2>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {DATES.map((date) => {
            const { dow, day } = formatDateChip(date);
            const active = date === selectedDate;
            return (
              <button
                key={date}
                type="button"
                onClick={() => {
                  setSelectedDate(date);
                  setSelectedTime(null);
                }}
                className={`flex w-11.5 shrink-0 flex-col items-center rounded-lg border py-2 ${
                  active
                    ? "border-stone-900 bg-stone-50"
                    : "border-stone-200 text-stone-500"
                }`}
              >
                <span className="text-[9.5px] text-stone-400">{dow}</span>
                <span
                  className={`mt-0.5 text-sm font-bold ${active ? "text-stone-900" : "text-stone-600"}`}
                >
                  {day}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2.5 border-b border-stone-100 p-4">
        <h2 className="text-xs font-bold text-stone-400">시작 시간</h2>
        {loading ? (
          <p className="py-6 text-center text-xs text-stone-400">
            예약 가능한 시간을 확인하는 중...
          </p>
        ) : slots.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {slots.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => setSelectedTime(time)}
                className={`rounded-lg border py-2.5 text-center text-xs font-semibold ${
                  time === selectedTime
                    ? "border-stone-900 bg-stone-900 text-white"
                    : "border-stone-200 text-stone-700"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        ) : (
          <p className="py-6 text-center text-xs text-stone-400">
            이 날짜엔 예약 가능한 시간이 없어요. 다른 날짜를 선택해주세요.
          </p>
        )}
      </div>

      {selectedTime ? (
        <div className="flex flex-col gap-2 p-4">
          <div className="flex justify-between rounded-lg bg-stone-50 px-3 py-2.5 text-xs">
            <span className="text-stone-500">촬영 시간</span>
            <span className="font-bold text-stone-900">
              {store.durationMinutes}분
            </span>
          </div>
          <div className="flex justify-between rounded-lg bg-stone-50 px-3 py-2.5 text-xs">
            <span className="text-stone-500">예상 시간</span>
            <span className="font-bold text-stone-900">
              {selectedTime} – {endTime}
            </span>
          </div>
        </div>
      ) : null}

      <div className="fixed inset-x-0 bottom-0 mx-auto max-w-120 border-t border-stone-200 bg-white p-4 pb-[max(16px,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={handleNext}
          disabled={!selectedTime}
          className="w-full rounded-lg bg-stone-900 py-3.5 text-sm font-bold text-white disabled:opacity-40"
        >
          다음: 장소 선택
        </button>
      </div>
    </main>
  );
}
