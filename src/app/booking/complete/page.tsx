import Link from "next/link";
import { getBookingDetail } from "@/lib/data/bookings";
import { formatBookingSchedule } from "@/lib/date-time";

export default async function BookingCompletePage({
  searchParams,
}: {
  searchParams: Promise<{ bookingId?: string }>;
}) {
  const { bookingId } = await searchParams;
  const booking = bookingId ? await getBookingDetail(bookingId) : null;

  if (!booking) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-120 flex-col items-center justify-center gap-3 px-6 text-center">
        <h1 className="text-lg font-semibold text-stone-900">예약 정보를 찾을 수 없어요</h1>
        <Link href="/bookings" className="text-sm text-stone-900 underline">
          내 예약으로 이동
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-120 flex-col pb-6">
      <div className="flex flex-col items-center gap-2 px-6 pt-14 pb-6 text-center">
        <div className="flex size-13 items-center justify-center rounded-full bg-stone-100 text-2xl text-stone-700">
          ✓
        </div>
        <h1 className="text-[14.5px] font-bold text-stone-900">
          예약 요청이 완료됐어요
        </h1>
        <p className="text-xs text-stone-500">
          촬영자가 예약을 확인하면 내 예약에서 상태가 바뀌어요
        </p>
        <p className="font-mono text-[11px] text-stone-400">
          예약번호 {booking.id.slice(0, 8).toUpperCase()}
        </p>
      </div>

      <div className="mx-4 flex flex-col gap-2 rounded-xl border border-stone-200 p-4 text-[12.5px]">
        <Row k="촬영 일정" v={formatBookingSchedule(booking.startsAt, booking.endsAt)} />
        <Row k="촬영자" v={booking.photographerName} />
        <Row k="촬영 서비스" v={booking.serviceTitle} />
        <Row k="장소" v={booking.locationLabel ?? "추후 협의"} />
      </div>

      <div className="flex flex-col gap-1.5 px-6 py-5">
        <h2 className="text-xs font-bold text-stone-400">준비 사항</h2>
        <p className="text-[12px] leading-relaxed text-stone-600">
          {booking.photographerGuidance ??
            "약속 시간 10분 전까지 도착해주세요. 촬영자가 예약을 확정하면 추가 안내를 받을 수 있어요."}
        </p>
      </div>

      <div className="mt-auto flex gap-2 px-4 pt-4">
        <Link
          href="/"
          className="flex-1 rounded-lg border border-stone-300 py-3 text-center text-sm font-semibold text-stone-700"
        >
          홈으로
        </Link>
        <Link
          href="/bookings"
          className="flex-1 rounded-lg bg-stone-900 py-3 text-center text-sm font-bold text-white"
        >
          내 예약 보기
        </Link>
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
