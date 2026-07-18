import { notFound } from "next/navigation";
import { requireAuthUser } from "@/lib/supabase/auth";
import { getServiceForEdit } from "@/lib/data/services";
import { getServiceTagOptions } from "@/lib/data/tags";
import { ServiceForm } from "../../service-form";

export default async function PhotographerServiceEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireAuthUser(`/photographer/services/${id}/edit`);

  const [service, tagOptions] = await Promise.all([
    getServiceForEdit(user.id, id),
    getServiceTagOptions(),
  ]);

  if (!service) {
    notFound();
  }

  return (
    <ServiceForm
      photographerId={user.id}
      tagOptions={tagOptions}
      mode="edit"
      initial={service}
    />
  );
}
