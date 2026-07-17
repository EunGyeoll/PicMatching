"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/supabase/auth";

export async function addPortfolioImageAction(storagePath: string) {
  const user = await getAuthUser();
  if (!user) return { error: "로그인이 필요합니다." };

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("portfolio_images")
    .select("sort_order")
    .eq("photographer_id", user.id)
    .order("sort_order", { ascending: false })
    .limit(1);

  const nextOrder = existing && existing[0] ? existing[0].sort_order + 1 : 0;

  const { error } = await supabase
    .from("portfolio_images")
    .insert({ photographer_id: user.id, storage_path: storagePath, sort_order: nextOrder });

  if (error) return { error: "저장 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요." };

  revalidatePath("/photographer/portfolio");
  return {};
}

export async function deletePortfolioImageAction(storagePath: string) {
  const user = await getAuthUser();
  if (!user) return { error: "로그인이 필요합니다." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("portfolio_images")
    .delete()
    .eq("photographer_id", user.id)
    .eq("storage_path", storagePath);

  if (error) return { error: "삭제 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요." };

  revalidatePath("/photographer/portfolio");
  return {};
}
