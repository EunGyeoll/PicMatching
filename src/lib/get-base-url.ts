import { headers } from "next/headers";

/**
 * 이메일 인증 콜백 등 절대 URL이 필요한 곳에서 사용하는 현재 요청의 origin입니다.
 * Vercel 등 프록시 뒤에서도 올바른 값을 얻기 위해 x-forwarded-* 헤더를 우선합니다.
 */
export async function getBaseUrl() {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  const protocol =
    headerList.get("x-forwarded-proto") ??
    (process.env.NODE_ENV === "development" ? "http" : "https");

  return `${protocol}://${host}`;
}
