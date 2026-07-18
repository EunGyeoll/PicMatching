import Link from "next/link";
import Image from "next/image";
import { getAuthUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { signOutAction } from "./actions";

export default async function MyPage() {
  const user = await getAuthUser();

  if (!user) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-120 flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-xl font-semibold text-stone-900">
          로그인이 필요합니다
        </h1>
        <p className="text-sm text-stone-500">
          마이페이지는 로그인 후 이용할 수 있습니다.
        </p>
        <Link
          href="/login?next=/mypage"
          className="mt-2 rounded-md bg-stone-900 px-5 py-2.5 text-sm font-medium text-white"
        >
          로그인하러 가기
        </Link>
      </main>
    );
  }

  const supabase = await createClient();
  const [{ data: profile }, { data: photographerProfile }] = await Promise.all([
    supabase.from("profiles").select("nickname, avatar_url").eq("id", user.id).single(),
    supabase.from("photographer_profiles").select("id").eq("id", user.id).maybeSingle(),
  ]);

  const menuItems = [
    { href: "/mypage/edit", label: "프로필 수정" },
    { href: "/favorites", label: "찜한 촬영자" },
    { href: "/bookings", label: "예약 내역" },
    photographerProfile
      ? { href: "/photographer/dashboard", label: "촬영자 모드로 전환" }
      : { href: "/photographer/onboarding", label: "촬영자로 활동하기" },
  ];

  return (
    <main className="mx-auto min-h-dvh max-w-120 px-6 py-10">
      <div className="flex items-center gap-3">
        <div className="relative size-14 shrink-0 overflow-hidden rounded-full bg-stone-100">
          {profile?.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt=""
              fill
              sizes="56px"
              className="object-cover"
            />
          ) : (
            <span className="flex size-full items-center justify-center text-lg font-semibold text-stone-400">
              {(profile?.nickname ?? "?").slice(0, 1)}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <h1 className="wrap-break-word text-xl font-semibold text-stone-900">
            {profile?.nickname ?? "내 정보"}
          </h1>
          <p className="mt-1 text-sm text-stone-500">{user.email}</p>
        </div>
      </div>

      <nav className="mt-8 flex flex-col divide-y divide-stone-200 border-y border-stone-200">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="py-4 text-sm text-stone-700"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <form action={signOutAction} className="mt-8">
        <button type="submit" className="text-sm text-stone-400 underline">
          로그아웃
        </button>
      </form>
    </main>
  );
}
