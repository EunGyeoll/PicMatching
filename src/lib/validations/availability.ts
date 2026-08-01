import { z } from "zod";

export const availabilityRuleSchema = z
  .object({
    dayOfWeek: z.number().int().min(0).max(6),
    enabled: z.boolean(),
    startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "시간 형식을 확인해주세요."),
    endTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "시간 형식을 확인해주세요."),
  })
  .refine((r) => !r.enabled || r.endTime > r.startTime, {
    message: "종료 시간은 시작 시간보다 늦어야 해요.",
  });

export const availabilityFormSchema = z.array(availabilityRuleSchema).length(7);

export type AvailabilityRuleInput = z.infer<typeof availabilityRuleSchema>;
