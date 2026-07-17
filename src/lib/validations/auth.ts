import { z } from "zod";

export const signUpSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "이메일을 입력해주세요.")
    .email("올바른 이메일 형식이 아닙니다."),
  // Supabase 프로젝트의 기본 최소 비밀번호 길이(6자)에 맞춥니다.
  password: z
    .string()
    .min(6, "비밀번호는 6자 이상이어야 합니다.")
    .max(72, "비밀번호는 72자 이하여야 합니다."),
});

export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "이메일을 입력해주세요.")
    .email("올바른 이메일 형식이 아닙니다."),
  password: z.string().min(1, "비밀번호를 입력해주세요."),
});
