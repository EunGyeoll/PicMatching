import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
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
      <h1 className="text-xl font-semibold text-stone-900">로그인</h1>

      {error === "auth_callback_failed" ? (
        <p className="mt-3 text-sm text-red-600">
          인증 처리 중 문제가 발생했습니다. 다시 시도해주세요.
        </p>
      ) : null}

      <div className="mt-6">
        <AuthForm mode="login" action={boundSignIn} />
      </div>

      <p className="mt-6 text-center text-sm text-stone-500">
        아직 계정이 없으신가요?{" "}
        <Link href="/signup" className="font-medium text-stone-900 underline">
          이메일로 회원가입
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
