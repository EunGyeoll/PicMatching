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
    .select("nickname, phone, avatar_url")
    .eq("id", user.id)
    .single();

  const avatarUrlPrefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/`;
  const defaultAvatar =
    profile?.avatar_url && profile.avatar_url.startsWith(avatarUrlPrefix)
      ? {
          // avatar_url엔 캐시 무효화용 `?v=...`가 붙어있을 수 있어 경로 추출 시 제거한다.
          path: profile.avatar_url.slice(avatarUrlPrefix.length).split("?")[0],
          url: profile.avatar_url,
        }
      : null;

  return (
    <main className="mx-auto min-h-dvh max-w-120 px-6 py-10">
      <h1 className="text-xl font-semibold text-stone-900">프로필 수정</h1>
      <EditProfileForm
        userId={user.id}
        defaultNickname={profile?.nickname ?? ""}
        defaultPhone={profile?.phone ?? ""}
        defaultAvatar={defaultAvatar}
      />
    </main>
  );
}
