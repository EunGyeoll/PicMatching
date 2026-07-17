import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./database.types";

/**
 * 서버(Server Component, Route Handler, Server Action)에서 사용하는
 * Supabase 클라이언트입니다. 요청마다 새로 생성해야 합니다.
 *
 * Server Component 렌더링 중에는 쿠키를 쓸 수 없으므로 setAll 호출이
 * 실패할 수 있습니다. 이 경우는 세션 갱신을 담당하는 proxy(미들웨어)가
 * 대신 처리하므로 여기서는 에러를 무시합니다.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Component에서 호출된 경우 무시합니다.
          }
        },
      },
    },
  );
}
