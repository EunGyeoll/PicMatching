import type { AuthError } from "@supabase/supabase-js";

// https://supabase.com/docs/guides/auth/debugging/error-codes 기준 주요 코드만 매핑합니다.
const MESSAGES: Record<string, string> = {
  invalid_credentials: "이메일 또는 비밀번호가 올바르지 않습니다.",
  user_not_found: "이메일 또는 비밀번호가 올바르지 않습니다.",
  email_not_confirmed: "이메일 인증이 완료되지 않았습니다. 메일함을 확인해주세요.",
  email_exists: "이미 가입된 이메일입니다.",
  user_already_exists: "이미 가입된 이메일입니다.",
  weak_password: "비밀번호가 너무 약합니다. 다른 비밀번호를 사용해주세요.",
  email_address_invalid: "올바른 이메일 주소를 입력해주세요.",
  over_email_send_rate_limit: "이메일 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.",
  over_request_rate_limit: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.",
  signup_disabled: "현재 회원가입을 이용할 수 없습니다.",
  same_password: "이전과 동일한 비밀번호로는 변경할 수 없습니다.",
};

export function toKoreanAuthError(error: AuthError): string {
  const code = error.code;
  if (code && MESSAGES[code]) {
    return MESSAGES[code];
  }
  return "문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
}
