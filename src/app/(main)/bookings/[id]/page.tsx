import Link from "next/link";
import { requireAuthUser } from "@/lib/supabase/auth";
import { getBookingDetail } from "@/lib/data/bookings";
import { formatBookingSchedule } from "@/lib/date-time";
import { STATUS_LABEL, STATUS_TONE } from "@/lib/booking-status";

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireAuthUser(`/bookings/${id}`);

  const booking = await getBookingDetail(id);

  if (!booking) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-120 flex-col items-center justify-center gap-3 px-6 text-center">
        <h1 className="text-lg font-semibold text-stone-900">
          예약을 찾을 수 없습니다
        </h1>
        <Link href="/bookings" className="text-sm text-stone-900 underline">
          내 예약으로 돌아가기
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-120 px-4 py-6">
      <span
        className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-bold ${STATUS_TONE[booking.status]}`}
      >
        {STATUS_LABEL[booking.status]}
      </span>
      <h1 className="mt-2 text-base font-bold text-stone-900">
        {booking.serviceTitle}
      </h1>

      <div className="mt-4 flex flex-col gap-2 rounded-xl border border-stone-200 p-4 text-[12.5px]">
        <Row k="촬영자" v={booking.photographerName} />
        <Row k="일시" v={formatBookingSchedule(booking.startsAt, booking.endsAt)} />
        <Row k="장소" v={booking.locationLabel ?? "추후 협의"} />
        {booking.locationAddress ? <Row k="상세 위치" v={booking.locationAddress} /> : null}
        <Row k="촬영 인원" v={`${booking.participantCount}명`} />
        {booking.requests ? <Row k="요청 사항" v={booking.requests} /> : null}
      </div>

      <div className="mt-4 flex flex-col gap-1.5 rounded-xl border border-stone-200 p-4 text-[12.5px]">
        <div className="flex justify-between text-stone-500">
          <span>서비스 금액</span>
          <span>{booking.basePrice.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between text-stone-500">
          <span>추가 비용</span>
          <span>{booking.additionalFee.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between border-t border-stone-200 pt-2 text-sm font-extrabold text-stone-900">
          <span>총 금액</span>
          <span>{booking.totalPrice.toLocaleString()}원</span>
        </div>
      </div>

      <p className="mt-4 text-center font-mono text-[11px] text-stone-400">
        예약번호 {booking.id.slice(0, 8).toUpperCase()}
      </p>
    </main>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="shrink-0 text-stone-400">{k}</span>
      <span className="text-right font-semibold text-stone-900">{v}</span>
    </div>
  );
}
