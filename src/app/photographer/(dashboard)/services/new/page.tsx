import { redirect } from "next/navigation";
import { requireAuthUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { getServiceTagOptions } from "@/lib/data/tags";
import { ServiceForm } from "../service-form";

export default async function PhotographerServiceNewPage() {
  const user = await requireAuthUser("/photographer/services/new");
  const supabase = await createClient();

  const { data: photographerProfile } = await supabase
    .from("photographer_profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!photographerProfile) {
    redirect("/photographer/onboarding");
  }

  const tagOptions = await getServiceTagOptions();

  return <ServiceForm photographerId={user.id} tagOptions={tagOptions} mode="create" />;
}
