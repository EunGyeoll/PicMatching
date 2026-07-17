import { createClient } from "@/lib/supabase/server";
import {
  dayOfWeek,
  startOfDayUTC,
  endOfDayUTC,
  timeToMinutes,
  minutesToTime,
} from "@/lib/date-time";

export async function getAvailableSlots(params: {
  photographerId: string;
  date: string;
  durationMinutes: number;
  bufferBeforeMinutes: number;
  bufferAfterMinutes: number;
}): Promise<string[]> {
  const supabase = await createClient();
  const {
    photographerId,
    date,
    durationMinutes,
    bufferBeforeMinutes,
    bufferAfterMinutes,
  } = params;

  const dow = dayOfWeek(date);

  const { data: rules } = await supabase
    .from("availability_rules")
    .select("start_time, end_time")
    .eq("photographer_id", photographerId)
    .eq("day_of_week", dow);

  if (!rules || rules.length === 0) return [];

  const dayStart = startOfDayUTC(date);
  const dayEnd = endOfDayUTC(date);
  const dayStartIso = dayStart.toISOString();
  const dayEndIso = dayEnd.toISOString();

  const [{ data: blocked }, { data: bookings }] = await Promise.all([
    supabase
      .from("blocked_times")
      .select("starts_at, ends_at")
      .eq("photographer_id", photographerId)
      .lt("starts_at", dayEndIso)
      .gt("ends_at", dayStartIso),
    supabase
      .from("bookings")
      .select("starts_at, ends_at, buffer_before_minutes, buffer_after_minutes")
      .eq("photographer_id", photographerId)
      .in("status", ["requested", "confirmed"])
      .lt("starts_at", dayEndIso)
      .gt("ends_at", dayStartIso),
  ]);

  const occupied: { start: number; end: number }[] = [
    ...(blocked ?? []).map((b) => ({
      start: new Date(b.starts_at).getTime(),
      end: new Date(b.ends_at).getTime(),
    })),
    ...(bookings ?? []).map((b) => ({
      start: new Date(b.starts_at).getTime() - b.buffer_before_minutes * 60_000,
      end: new Date(b.ends_at).getTime() + b.buffer_after_minutes * 60_000,
    })),
  ];

  const now = Date.now();
  const slots = new Set<string>();

  for (const rule of rules) {
    const windowStart = timeToMinutes(rule.start_time);
    const windowEnd = timeToMinutes(rule.end_time);

    for (let m = windowStart; m + durationMinutes <= windowEnd; m += 30) {
      const candidateStartMs = dayStart.getTime() + m * 60_000;
      const occupiedStartMs = candidateStartMs - bufferBeforeMinutes * 60_000;
      const occupiedEndMs =
        candidateStartMs + durationMinutes * 60_000 + bufferAfterMinutes * 60_000;

      if (occupiedStartMs <= now) continue;

      const conflict = occupied.some(
        (r) => occupiedStartMs < r.end && occupiedEndMs > r.start,
      );
      if (conflict) continue;

      slots.add(minutesToTime(m));
    }
  }

  return [...slots].sort();
}
