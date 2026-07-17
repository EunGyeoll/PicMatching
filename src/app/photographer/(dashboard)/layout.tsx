import Link from "next/link";
import { requireAuthUser } from "@/lib/supabase/auth";

const NAV_ITEMS = [
  { href: "/photographer/dashboard", label: "대시보드" },
  { href: "/photographer/bookings", label: "예약" },
  { href: "/photographer/availability", label: "일정" },
  { href: "/photographer/portfolio", label: "포트폴리오" },
  { href: "/photographer/services", label: "서비스" },
  { href: "/mypage", label: "프로필" },
];

export default async function PhotographerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuthUser("/photographer/dashboard");

  return (
    <div className="mx-auto max-w-120">
      <nav className="flex overflow-x-auto border-b border-stone-200 px-2">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="shrink-0 px-3 py-3 text-xs font-semibold text-stone-500"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      {children}
    </div>
  );
}
