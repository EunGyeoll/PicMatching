import type { BookingStatus } from "@/types/domain";

export const STATUS_LABEL: Record<BookingStatus, string> = {
  requested: "예약 요청중",
  confirmed: "예정된 예약",
  completed: "촬영 완료",
  rejected: "예약 거절됨",
  cancelled: "취소된 예약",
};

export const STATUS_TONE: Record<BookingStatus, string> = {
  requested: "bg-amber-50 text-amber-700",
  confirmed: "bg-stone-900 text-white",
  completed: "bg-emerald-50 text-emerald-700",
  rejected: "bg-stone-100 text-stone-400",
  cancelled: "bg-stone-100 text-stone-400",
};
