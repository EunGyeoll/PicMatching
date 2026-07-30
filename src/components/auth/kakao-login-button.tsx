"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function KakaoLoginButton({ next }: { next: string }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setPending(true);
    setError(null);

    const supabase = createClient();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });

    if (oauthError) {
      setError("카카오 로그인 연결 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="relative flex w-full items-center justify-center rounded-full bg-[#FEE500] py-3.5 text-sm font-medium text-[#191600] transition-opacity disabled:opacity-50"
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="absolute left-4 top-1/2 size-5 -translate-y-1/2 fill-[#191600]"
        >
          <path d="M12 3C6.477 3 2 6.58 2 11c0 2.83 1.84 5.32 4.6 6.74-.2.73-.73 2.68-.84 3.1-.13.52.19.5.4.36.17-.11 2.7-1.82 3.8-2.57.65.1 1.32.15 2.04.15 5.523 0 10-3.58 10-8s-4.477-8-10-8Z" />
        </svg>
        {pending ? "연결 중..." : "카카오로 3초 시작하기"}
      </button>
      {error ? (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
