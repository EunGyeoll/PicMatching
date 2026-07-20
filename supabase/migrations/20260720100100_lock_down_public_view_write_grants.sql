-- 보안 취약점 수정(2/3): profiles_public / active_photographer_avatars 뷰는
-- postgres 소유(rolbypassrls=true)로 생성돼 RLS를 우회하는 "security definer view"였고,
-- Supabase 프로젝트의 public 스키마 기본 권한 설정(ALTER DEFAULT PRIVILEGES) 때문에
-- anon/authenticated에게 SELECT뿐 아니라 INSERT/UPDATE/DELETE까지 자동으로 부여돼 있었음.
-- 실제로 로그인한 일반 사용자 계정으로 다른 사용자의 nickname을 이 뷰를 통해
-- 변경할 수 있는 것까지 확인됨(테스트 후 즉시 원복). 쓰기 권한을 회수해 조회 전용으로 잠금.

revoke insert, update, delete, truncate, references, trigger
  on public.profiles_public
  from anon, authenticated;

revoke insert, update, delete, truncate, references, trigger
  on public.active_photographer_avatars
  from anon, authenticated;
