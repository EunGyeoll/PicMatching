import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "./database.types";

/**
 * 요청마다 Supabase 세션 쿠키를 최신 상태로 갱신합니다.
 * 이 프로젝트는 비로그인 상태로도 대부분의 화면을 볼 수 있으므로(6.5, 9.3),
 * 여기서는 로그인 페이지로 강제 리다이렉트하지 않고 세션 갱신만 담당합니다.
 * 로그인이 필요한 화면의 접근 제어는 각 페이지에서 개별적으로 처리합니다.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value),
          );
        },
      },
    },
  );

  // createServerClient와 getClaims() 사이에는 다른 코드를 두지 않습니다.
  // 세션 만료 판단이 어긋나 사용자가 무작위로 로그아웃되는 문제를 방지하기 위함입니다.
  await supabase.auth.getClaims();

  return supabaseResponse;
}
