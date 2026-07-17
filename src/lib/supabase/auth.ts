import { redirect } from "next/navigation";
import { createClient } from "./server";

/**
 * 현재 요청의 인증된 사용자를 반환합니다. 로그인하지 않았으면 null입니다.
 * getUser() 대신 getClaims()를 사용해 매 호출마다 Auth 서버를 왕복하지 않습니다.
 */
export async function getAuthUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data) {
    return null;
  }

  return { id: data.claims.sub, email: data.claims.email };
}

/** 로그인하지 않았으면 현재 경로로 돌아올 수 있게 /login으로 리다이렉트합니다. */
export async function requireAuthUser(nextPath: string) {
  const user = await getAuthUser();
  if (!user) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }
  return user;
}
