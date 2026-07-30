"use client";

import { useState, useTransition } from "react";
import { confirmBookingAction, rejectBookingAction, completeBookingAction } from "./actions";
import type { BookingActionResult } from "./actions";
import type { BookingStatus } from "@/types/domain";

export function BookingActions({
  bookingId,
  status,
  canComplete,
}: {
  bookingId: string;
  status: BookingStatus;
  canComplete: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function run(action: (id: string) => Promise<BookingActionResult>) {
    setError(null);
    startTransition(async () => {
      const result = await action(bookingId);
      if (result.error) setError(result.error);
    });
  }

  let buttons: React.ReactNode = null;

  if (status === "requested") {
    buttons = (
      <div className="flex gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={() => run(confirmBookingAction)}
          className="min-h-11 rounded-full bg-stone-900 px-3 text-[11px] font-bold text-white disabled:opacity-40"
        >
          승인
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => run(rejectBookingAction)}
          className="min-h-11 rounded-full border border-stone-300 px-3 text-[11px] font-semibold text-stone-600 disabled:opacity-40"
        >
          거절
        </button>
      </div>
    );
  } else if (status === "confirmed" && canComplete) {
    buttons = (
      <button
        type="button"
        disabled={pending}
        onClick={() => run(completeBookingAction)}
        className="min-h-11 self-start rounded-full border border-stone-300 px-3 text-[11px] font-semibold text-stone-600 disabled:opacity-40"
      >
        촬영 완료로 표시
      </button>
    );
  }

  if (!buttons) return null;

  return (
    <div className="mt-2 flex flex-col gap-1">
      {buttons}
      {error ? <p className="text-[10.5px] text-red-600">{error}</p> : null}
    </div>
  );
}
