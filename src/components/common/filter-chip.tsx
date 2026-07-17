import Link from "next/link";
import type { ReactNode } from "react";

export function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-[11.5px] ${
        active
          ? "border-stone-800 bg-stone-800 font-semibold text-white"
          : "border-stone-200 text-stone-600"
      }`}
    >
      {children}
    </Link>
  );
}
