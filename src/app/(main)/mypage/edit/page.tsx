import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { EditProfileForm } from "./edit-profile-form";

export default async function MyPageEditPage() {
  const user = await getAuthUser();
  if (!user) {
    redirect("/login?next=/mypage/edit");
  }

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("nickname, phone")
    .eq("id", user.id)
    .single();

  return (
    <main className="mx-auto min-h-dvh max-w-120 px-6 py-10">
      <h1 className="text-xl font-semibold text-stone-900">프로필 수정</h1>
      <EditProfileForm
        defaultNickname={profile?.nickname ?? ""}
        defaultPhone={profile?.phone ?? ""}
      />
    </main>
  );
}
