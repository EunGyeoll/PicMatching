import { redirect } from "next/navigation";
import { requireAuthUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { getPublicStorageUrl } from "@/lib/supabase/storage";
import { PortfolioManager } from "./portfolio-manager";

export default async function PhotographerPortfolioPage() {
  const user = await requireAuthUser("/photographer/portfolio");
  const supabase = await createClient();

  const { data: photographerProfile } = await supabase
    .from("photographer_profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!photographerProfile) {
    redirect("/photographer/onboarding");
  }

  const { data: portfolio } = await supabase
    .from("portfolio_images")
    .select("id, storage_path")
    .eq("photographer_id", user.id)
    .order("sort_order");

  return (
    <PortfolioManager
      userId={user.id}
      initialImages={(portfolio ?? []).map((p) => ({
        path: p.storage_path,
        url: getPublicStorageUrl("portfolios", p.storage_path),
      }))}
    />
  );
}
