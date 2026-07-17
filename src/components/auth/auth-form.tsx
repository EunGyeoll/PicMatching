"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, Mail } from "lucide-react";

export type AuthFormState = {
  error?: string;
  sent?: boolean;
};

type AuthFormMode = "login" | "signup";

export function AuthForm({
  mode,
  action,
}: {
  mode: AuthFormMode;
  action: (
    state: AuthFormState,
    formData: FormData,
  ) => Promise<AuthFormState>;
}) {
  const [state, formAction, pending] = useActionState<AuthFormState, FormData>(
    action,
    {},
  );
  const [showPassword, setShowPassword] = useState(false);

  if (state.sent) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-stone-200 px-6 py-10 text-center">
        <Mail className="size-8 text-stone-400" />
        <p className="text-sm font-medium text-stone-900">
          가입 확인 이메일을 보냈습니다.
        </p>
        <p className="text-sm text-stone-500">
          메일함에서 인증 링크를 눌러 가입을 완료해주세요.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-stone-700">
          이메일
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full rounded-md border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-stone-500"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="password"
          className="text-sm font-medium text-stone-700"
        >
          비밀번호
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            required
            className="w-full rounded-md border border-stone-300 px-3 py-2.5 pr-11 text-sm outline-none focus:border-stone-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 표시"}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-stone-400"
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
      </div>

      {state.error ? (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 w-full rounded-md bg-stone-900 py-3 text-sm font-medium text-white transition-opacity disabled:opacity-50"
      >
        {pending
          ? "처리 중..."
          : mode === "signup"
            ? "이메일로 회원가입"
            : "이메일로 로그인"}
      </button>
    </form>
  );
}
