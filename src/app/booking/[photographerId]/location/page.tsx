import { requireAuthUser } from "@/lib/supabase/auth";
import { getLocationOptions } from "@/lib/data/booking";
import { LocationPicker } from "./location-picker";

export default async function BookingLocationPage({
  params,
}: {
  params: Promise<{ photographerId: string }>;
}) {
  const { photographerId } = await params;
  await requireAuthUser(`/booking/${photographerId}/location`);

  const options = await getLocationOptions(photographerId);

  return <LocationPicker photographerId={photographerId} options={options} />;
}
