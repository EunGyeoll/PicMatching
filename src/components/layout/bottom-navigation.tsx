"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, CalendarCheck, CircleUserRound } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "홈", icon: Home },
  { href: "/explore", label: "탐색", icon: Search },
  { href: "/bookings", label: "내 예약", icon: CalendarCheck },
  { href: "/mypage", label: "마이", icon: CircleUserRound },
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 mx-auto flex max-w-120 border-t border-stone-200 bg-white/95 pb-[max(8px,env(safe-area-inset-bottom))] backdrop-blur">
      {NAV_ITEMS.map((item) => {
        const active =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] ${
              active ? "font-semibold text-stone-900" : "text-stone-400"
            }`}
          >
            <Icon className="size-5" strokeWidth={active ? 2.4 : 1.8} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
