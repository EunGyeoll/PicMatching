import { z } from "zod";

export const profileUpdateSchema = z.object({
  nickname: z
    .string()
    .trim()
    .min(1, "닉네임을 입력해주세요.")
    .max(30, "닉네임은 30자 이하여야 합니다."),
  phone: z
    .string()
    .trim()
    .max(20, "연락처는 20자 이하여야 합니다.")
    .optional()
    .or(z.literal("")),
});
