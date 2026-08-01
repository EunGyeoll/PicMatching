import { requireAuthUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { AvailabilityForm } from "./availability-form";
import type { AvailabilityRuleInput } from "@/lib/validations/availability";

const DEFAULT_START = "10:00";
const DEFAULT_END = "19:00";

export default async function PhotographerAvailabilityPage() {
  const user = await requireAuthUser("/photographer/availability");

  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("availability_rules")
    .select("day_of_week, start_time, end_time")
    .eq("photographer_id", user.id);

  const byDay = new Map(
    (rows ?? []).map((r) => [r.day_of_week, r] as const),
  );

  const initialRules: AvailabilityRuleInput[] = Array.from({ length: 7 }, (_, dayOfWeek) => {
    const row = byDay.get(dayOfWeek);
    return {
      dayOfWeek,
      enabled: Boolean(row),
      startTime: row?.start_time.slice(0, 5) ?? DEFAULT_START,
      endTime: row?.end_time.slice(0, 5) ?? DEFAULT_END,
    };
  });

  return (
    <main className="mx-auto max-w-120 px-4 py-6 pb-28">
      <h1 className="text-base font-bold text-stone-900">예약 가능 일정</h1>
      <p className="mt-1 text-xs text-stone-500">
        요일을 켜고 운영 시간을 설정하면, 그 시간 안에서 고객이 예약할 수 있어요.
      </p>
      <AvailabilityForm initialRules={initialRules} />
    </main>
  );
}
