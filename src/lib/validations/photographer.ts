import { z } from "zod";

export const onboardingStep1Schema = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, "활동명을 입력해주세요.")
    .max(40, "활동명은 40자 이하여야 합니다."),
  headline: z
    .string()
    .trim()
    .min(1, "한 줄 소개를 입력해주세요.")
    .max(60, "한 줄 소개는 60자 이하여야 합니다."),
});

export const onboardingStep2Schema = z.object({
  bio: z
    .string()
    .trim()
    .min(1, "상세 소개를 입력해주세요.")
    .max(2000, "상세 소개는 2000자 이하여야 합니다."),
  areas: z
    .array(z.string().trim().min(1))
    .min(1, "활동 지역을 1개 이상 입력해주세요.")
    .max(10, "활동 지역은 10개까지 등록할 수 있습니다."),
});

export const onboardingStep3Schema = z.object({
  contactInfo: z
    .string()
    .trim()
    .min(1, "촬영 안내사항을 입력해주세요.")
    .max(500, "촬영 안내사항은 500자 이하여야 합니다."),
  portfolioPaths: z
    .array(z.string().trim().min(1))
    .min(3, "포트폴리오 사진을 3장 이상 등록해주세요.")
    .max(30, "포트폴리오는 30장까지 등록할 수 있습니다."),
});

export const completeOnboardingSchema = onboardingStep1Schema
  .merge(onboardingStep2Schema)
  .merge(onboardingStep3Schema);

export type OnboardingInput = z.infer<typeof completeOnboardingSchema>;
