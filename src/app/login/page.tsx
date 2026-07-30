import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { AuthForm } from "@/components/auth/auth-form";
import { KakaoLoginButton } from "@/components/auth/kakao-login-button";
import { signInAction } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  const safeNext = next && next.startsWith("/") ? next : "/mypage";
  const boundSignIn = signInAction.bind(null, safeNext);

  return (
    <main className="mx-auto flex min-h-dvh max-w-120 flex-col justify-center px-6 py-10">
      <div className="flex flex-col items-center gap-2">
        <Image src="/logo.svg" alt="moodi" width={180} height={48} priority />
        <p className="text-sm text-stone-500">
          원하는 분위기의 촬영자를 만나보세요.
        </p>
      </div>

      {error === "auth_callback_failed" ? (
        <p className="mt-4 text-center text-sm text-red-600">
          인증 처리 중 문제가 발생했습니다. 다시 시도해주세요.
        </p>
      ) : null}

      <div className="mt-8">
        <KakaoLoginButton next={safeNext} />
      </div>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-stone-200" />
        <span className="text-xs text-stone-400">또는</span>
        <div className="h-px flex-1 bg-stone-200" />
      </div>

      <AuthForm mode="login" action={boundSignIn} />

      <p className="mt-6 text-center text-sm text-stone-500">
        처음이신가요?{" "}
        <Link href="/signup" className="font-bold text-stone-900 underline">
          회원가입
        </Link>
      </p>

      <Link
        href="/"
        className="mt-4 flex items-center justify-center gap-1 text-center text-sm text-stone-400 underline-offset-2 hover:underline"
      >
        로그인하지 않고 둘러보기
        <ArrowRight className="size-4" />
      </Link>
    </main>
  );
}
