"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { toKoreanAuthError } from "@/lib/supabase/auth-errors";
import { signInSchema } from "@/lib/validations/auth";
import type { AuthFormState } from "@/components/auth/auth-form";

export async function signInAction(
  next: string,
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: toKoreanAuthError(error) };
  }

  redirect(next);
}
