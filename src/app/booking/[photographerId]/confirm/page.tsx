import { requireAuthUser } from "@/lib/supabase/auth";
import { ConfirmView } from "./confirm-view";

export default async function BookingConfirmPage({
  params,
}: {
  params: Promise<{ photographerId: string }>;
}) {
  const { photographerId } = await params;
  await requireAuthUser(`/booking/${photographerId}/confirm`);

  return <ConfirmView photographerId={photographerId} />;
}
