import { requireAuthUser } from "@/lib/supabase/auth";
import { getBookablePhotographer } from "@/lib/data/booking";
import { ServicePicker } from "./service-picker";

export default async function BookingServicePage({
  params,
  searchParams,
}: {
  params: Promise<{ photographerId: string }>;
  searchParams: Promise<{ service?: string }>;
}) {
  const { photographerId } = await params;
  const { service } = await searchParams;

  await requireAuthUser(
    `/booking/${photographerId}/service${service ? `?service=${service}` : ""}`,
  );

  const photographer = await getBookablePhotographer(photographerId);

  if (!photographer || photographer.services.length === 0) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-120 flex-col items-center justify-center gap-3 px-6 text-center">
        <h1 className="text-lg font-semibold text-stone-900">
          예약할 수 있는 서비스가 없어요
        </h1>
        <p className="text-sm text-stone-500">
          촬영자가 아직 공개한 촬영 서비스가 없습니다.
        </p>
      </main>
    );
  }

  return (
    <ServicePicker photographer={photographer} preselectedServiceId={service ?? null} />
  );
}
