import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { AuthForm } from "@/components/auth/auth-form";
import { KakaoLoginButton } from "@/components/auth/kakao-login-button";
import { signUpAction } from "./actions";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const safeNext = next && next.startsWith("/") ? next : "/mypage";
  const boundSignUp = signUpAction.bind(null, safeNext);

  return (
    <main className="mx-auto flex min-h-dvh max-w-120 flex-col justify-center px-6 py-10">
      <div className="flex flex-col items-center gap-2">
        <Image src="/logo.svg" alt="moodi" width={180} height={48} priority />
        <p className="text-sm text-stone-500">
          원하는 분위기의 촬영자를 만나보세요.
        </p>
      </div>

      <div className="mt-8">
        <KakaoLoginButton next={safeNext} />
      </div>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-stone-200" />
        <span className="text-xs text-stone-400">또는</span>
        <div className="h-px flex-1 bg-stone-200" />
      </div>

      <AuthForm mode="signup" action={boundSignUp} />

      <p className="mt-6 text-center text-sm text-stone-500">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="font-bold text-stone-900 underline">
          로그인
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
