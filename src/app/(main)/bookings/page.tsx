import Link from "next/link";
import { requireAuthUser } from "@/lib/supabase/auth";
import { getMyBookings } from "@/lib/data/bookings";
import { formatBookingSchedule } from "@/lib/date-time";
import { EmptyState } from "@/components/common/empty-state";
import { STATUS_LABEL, STATUS_TONE } from "@/lib/booking-status";
import type { BookingStatus } from "@/types/domain";

const TABS: { key: string; label: string; statuses: BookingStatus[] }[] = [
  { key: "requested", label: "요청중", statuses: ["requested"] },
  { key: "confirmed", label: "예정", statuses: ["confirmed"] },
  { key: "completed", label: "완료", statuses: ["completed"] },
  { key: "cancelled", label: "취소", statuses: ["cancelled", "rejected"] },
];

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const user = await requireAuthUser("/bookings");
  const { status } = await searchParams;
  const activeTab = TABS.find((t) => t.key === status) ?? TABS[0];

  const bookings = await getMyBookings(user.id);
  const filtered = bookings.filter((b) => activeTab.statuses.includes(b.status));

  return (
    <main className="mx-auto max-w-120">
      <h1 className="px-4 pt-4 text-base font-bold text-stone-900">내 예약</h1>

      <div className="mt-3 flex border-b border-stone-200 px-2">
        {TABS.map((tab) => (
          <Link
            key={tab.key}
            href={`/bookings?status=${tab.key}`}
            className={`flex-1 border-b-2 py-2.5 text-center text-[12px] font-bold ${
              activeTab.key === tab.key
                ? "border-stone-900 text-stone-900"
                : "border-transparent text-stone-400"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="📅" title={`${activeTab.label} 예약이 없어요`} />
      ) : (
        <div className="flex flex-col">
          {filtered.map((booking) => (
            <Link
              key={booking.id}
              href={`/bookings/${booking.id}`}
              className="flex flex-col gap-1 border-b border-stone-100 px-4 py-3"
            >
              <span
                className={`self-start rounded-full px-2 py-0.5 text-[10px] font-bold ${STATUS_TONE[booking.status]}`}
              >
                {STATUS_LABEL[booking.status]}
              </span>
              <span className="text-[12.5px] font-bold text-stone-900">
                {booking.serviceTitle}
              </span>
              <span className="text-[11px] text-stone-400">
                {booking.photographerName} ·{" "}
                {formatBookingSchedule(booking.startsAt, booking.endsAt)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
