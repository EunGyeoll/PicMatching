"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBaseUrl } from "@/lib/get-base-url";
import { toKoreanAuthError } from "@/lib/supabase/auth-errors";
import { signUpSchema } from "@/lib/validations/auth";
import type { AuthFormState } from "@/components/auth/auth-form";

export async function signUpAction(
  next: string,
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = signUpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." };
  }

  const supabase = await createClient();
  const baseUrl = await getBaseUrl();

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${baseUrl}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error) {
    return { error: toKoreanAuthError(error) };
  }

  // 프로젝트의 "이메일 확인" 설정이 꺼져 있으면 가입과 동시에 세션이 생깁니다.
  // 이 경우 안내 메시지 대신 바로 로그인 상태로 이동시킵니다.
  if (data.session) {
    redirect(next);
  }

  return { sent: true };
}
