-- 다른 사용자로 로그인했을 때 촬영자 프로필 사진이 안 보이는 문제 대응(1/3).
-- profiles 테이블은 RLS가 auth.uid() = id로만 걸려 있어 본인 행만 조회 가능 —
-- 홈 스토리 바 등에서 다른 촬영자의 avatar_url을 조회하면 항상 빈 값이 돌아왔음.
-- (참고: 뒤이어 발견된 기존 profiles_public 뷰로 대체되어 이 뷰는 곧바로 삭제됨.
--  자세한 내용은 decision-log.md 참고.)

create or replace view public.active_photographer_avatars as
select p.id, p.avatar_url
from public.profiles p
join public.photographer_profiles pp on pp.id = p.id
where pp.status = 'active';

grant select on public.active_photographer_avatars to anon, authenticated;
