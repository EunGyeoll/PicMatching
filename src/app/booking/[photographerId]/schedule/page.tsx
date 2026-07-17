import { requireAuthUser } from "@/lib/supabase/auth";
import { SchedulePicker } from "./schedule-picker";

export default async function BookingSchedulePage({
  params,
}: {
  params: Promise<{ photographerId: string }>;
}) {
  const { photographerId } = await params;
  await requireAuthUser(`/booking/${photographerId}/schedule`);

  return <SchedulePicker photographerId={photographerId} />;
}
