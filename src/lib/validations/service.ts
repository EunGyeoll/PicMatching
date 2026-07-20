import { z } from "zod";
import { AREA_OPTIONS } from "@/lib/constants/areas";

export const DURATION_OPTIONS = [30, 45, 60, 75, 90, 120] as const;

export const serviceFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "서비스명을 입력해주세요.")
    .max(60, "서비스명은 60자 이하여야 합니다."),
  coverImagePath: z.string().trim().min(1, "대표 이미지를 등록해주세요."),
  price: z
    .number({ error: "가격을 입력해주세요." })
    .int("가격은 정수로 입력해주세요.")
    .min(0, "가격은 0원 이상이어야 합니다.")
    .max(100_000_000, "가격이 너무 큽니다."),
  durationMinutes: z
    .number({ error: "촬영 시간을 입력해주세요." })
    .int()
    .min(10, "촬영 시간은 10분 이상이어야 합니다.")
    .max(600, "촬영 시간은 600분 이하여야 합니다."),
  bufferAfterMinutes: z.number().int().min(0).max(240),
  description: z
    .string()
    .trim()
    .min(1, "상세 설명을 입력해주세요.")
    .max(4000, "상세 설명은 4000자 이하여야 합니다."),
  inclusions: z.string().trim().max(2000, "포함 사항은 2000자 이하여야 합니다.").optional(),
  areas: z
    .array(z.enum(AREA_OPTIONS))
    .min(1, "활동 가능 지역을 1개 이상 선택해주세요.")
    .max(10, "활동 가능 지역은 10개까지 선택할 수 있습니다."),
  purposeTagIds: z.array(z.number().int()).max(9),
  moodTagIds: z.array(z.number().int()).max(9),
  isPublished: z.boolean(),

  // 선택 정보 (11.2)
  retouchedPhotoCount: z.number().int().min(0).max(1000).optional(),
  providesRawFiles: z.boolean().optional(),
  providesAllRawFiles: z.boolean().optional(),
  deliveryDays: z.number().int().min(0).max(365).optional(),
  maxParticipants: z.number().int().min(1).max(100).optional(),
  allowsOutfitChange: z.boolean().optional(),
  recommendedFor: z.string().trim().max(200).optional(),
  extraFeeConditions: z.string().trim().max(1000).optional(),
  travelFee: z.number().int().min(0).max(1_000_000).optional(),
  nightSurcharge: z.number().int().min(0).max(1_000_000).optional(),
  weekendSurcharge: z.number().int().min(0).max(1_000_000).optional(),
  notes: z.string().trim().max(1000).optional(),
});

export type ServiceFormInput = z.infer<typeof serviceFormSchema>;

function textOrUndefined(value: FormDataEntryValue | null): string | undefined {
  if (value === null) return undefined;
  const trimmed = value.toString().trim();
  return trimmed === "" ? undefined : trimmed;
}

function numberOrUndefined(value: FormDataEntryValue | null): number | undefined {
  const text = textOrUndefined(value);
  if (text === undefined) return undefined;
  const parsed = Number(text);
  return Number.isNaN(parsed) ? undefined : parsed;
}

/**
 * FormData는 모든 값이 문자열이고, 체크되지 않은 체크박스는 아예 키가 없습니다.
 * Zod가 기대하는 타입(number, boolean, optional)으로 먼저 변환한 뒤 검증합니다.
 */
export function parseServiceFormData(formData: FormData): unknown {
  return {
    title: textOrUndefined(formData.get("title")) ?? "",
    coverImagePath: textOrUndefined(formData.get("coverImagePath")) ?? "",
    price: numberOrUndefined(formData.get("price")),
    durationMinutes: numberOrUndefined(formData.get("durationMinutes")),
    bufferAfterMinutes: numberOrUndefined(formData.get("bufferAfterMinutes")) ?? 0,
    description: textOrUndefined(formData.get("description")) ?? "",
    inclusions: textOrUndefined(formData.get("inclusions")),
    areas: formData.getAll("areas").map((v) => v.toString()),
    purposeTagIds: formData.getAll("purposeTagIds").map((v) => Number(v)),
    moodTagIds: formData.getAll("moodTagIds").map((v) => Number(v)),
    isPublished: formData.get("isPublished") === "on",

    retouchedPhotoCount: numberOrUndefined(formData.get("retouchedPhotoCount")),
    providesRawFiles: formData.get("providesRawFiles") === "on",
    providesAllRawFiles: formData.get("providesAllRawFiles") === "on",
    deliveryDays: numberOrUndefined(formData.get("deliveryDays")),
    maxParticipants: numberOrUndefined(formData.get("maxParticipants")),
    allowsOutfitChange: formData.get("allowsOutfitChange") === "on",
    recommendedFor: textOrUndefined(formData.get("recommendedFor")),
    extraFeeConditions: textOrUndefined(formData.get("extraFeeConditions")),
    travelFee: numberOrUndefined(formData.get("travelFee")),
    nightSurcharge: numberOrUndefined(formData.get("nightSurcharge")),
    weekendSurcharge: numberOrUndefined(formData.get("weekendSurcharge")),
    notes: textOrUndefined(formData.get("notes")),
  };
}
