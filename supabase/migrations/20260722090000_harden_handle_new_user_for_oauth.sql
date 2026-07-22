-- 카카오 로그인 도입 준비: handle_new_user() 트리거가 이메일 기반 닉네임 생성에만 의존하고 있었음.
-- 카카오 OAuth 사용자는 이메일 동의(비즈앱 인증 필요)를 안 했으면 auth.users.email이 null일 수 있어서,
-- 기존 로직(coalesce(nickname 메타데이터, split_part(email, '@', 1)))이 NULL을 반환하면
-- profiles.nickname의 NOT NULL 제약에 걸려 가입 자체가 트리거 에러로 실패함.
-- OAuth 제공자별 메타데이터 키(name/full_name/user_name 등)를 추가로 확인하고,
-- 그마저 없으면 "사용자<8자리 id>" 형태의 안전한 기본값으로 대체.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$
begin
  insert into public.profiles (id, nickname)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data->>'nickname', ''),
      nullif(new.raw_user_meta_data->>'name', ''),
      nullif(new.raw_user_meta_data->>'full_name', ''),
      nullif(new.raw_user_meta_data->>'user_name', ''),
      nullif(split_part(new.email, '@', 1), ''),
      '사용자' || substr(new.id::text, 1, 8)
    )
  );
  return new;
end;
$function$;
