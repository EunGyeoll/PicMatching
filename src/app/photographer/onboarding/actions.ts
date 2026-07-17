"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/supabase/auth";
import { completeOnboardingSchema } from "@/lib/validations/photographer";

export type OnboardingFormState = { error?: string };

export async function completeOnboardingAction(input: {
  displayName: string;
  headline: string;
  bio: string;
  areas: string[];
  contactInfo: string;
  portfolioPaths: string[];
  avatarUrl: string | null;
}): Promise<OnboardingFormState> {
  const user = await getAuthUser();
  if (!user) {
    return { error: "로그인이 필요합니다." };
  }

  const parsed = completeOnboardingSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." };
  }

  const supabase = await createClient();

  if (input.avatarUrl) {
    await supabase
      .from("profiles")
      .update({ avatar_url: input.avatarUrl })
      .eq("id", user.id);
  }

  const { error } = await supabase.rpc("complete_photographer_onboarding", {
    p_display_name: parsed.data.displayName,
    p_headline: parsed.data.headline,
    p_bio: parsed.data.bio,
    p_contact_info: parsed.data.contactInfo,
    p_areas: parsed.data.areas,
    p_portfolio_paths: parsed.data.portfolioPaths,
  });

  if (error) {
    return { error: "저장 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요." };
  }

  redirect("/photographer/dashboard");
}
