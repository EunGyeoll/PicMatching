import { requireAuthUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { getPublicStorageUrl } from "@/lib/supabase/storage";
import { OnboardingWizard } from "./onboarding-wizard";

export default async function PhotographerOnboardingPage() {
  const user = await requireAuthUser("/photographer/onboarding");
  const supabase = await createClient();

  const [{ data: profile }, { data: photographerProfile }, { data: areas }, { data: portfolio }] =
    await Promise.all([
      supabase.from("profiles").select("avatar_url").eq("id", user.id).single(),
      supabase
        .from("photographer_profiles")
        .select("display_name, headline, bio, contact_info")
        .eq("id", user.id)
        .maybeSingle(),
      supabase.from("photographer_areas").select("area").eq("photographer_id", user.id),
      supabase
        .from("portfolio_images")
        .select("id, storage_path")
        .eq("photographer_id", user.id)
        .order("sort_order"),
    ]);

  return (
    <OnboardingWizard
      userId={user.id}
      initialAvatarUrl={profile?.avatar_url ?? null}
      initialDisplayName={photographerProfile?.display_name ?? ""}
      initialHeadline={photographerProfile?.headline ?? ""}
      initialBio={photographerProfile?.bio ?? ""}
      initialAreas={(areas ?? []).map((a) => a.area)}
      initialContactInfo={photographerProfile?.contact_info ?? ""}
      initialPortfolio={(portfolio ?? []).map((p) => ({
        path: p.storage_path,
        url: getPublicStorageUrl("portfolios", p.storage_path),
      }))}
    />
  );
}
