import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
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
      <h1 className="text-xl font-semibold text-stone-900">회원가입</h1>

      <div className="mt-6">
        <AuthForm mode="signup" action={boundSignUp} />
      </div>

      <p className="mt-6 text-center text-sm text-stone-500">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="font-medium text-stone-900 underline">
          이메일로 로그인
        </Link>
      </p>

      <Link
        href="/"
        className="mt-4 text-center text-sm text-stone-400 underline-offset-2 hover:underline"
      >
        로그인하지 않고 둘러보기
      </Link>
    </main>
  );
}
