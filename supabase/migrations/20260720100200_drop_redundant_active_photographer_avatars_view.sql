-- (3/3) 이미 같은 목적의 profiles_public 뷰(id, nickname, avatar_url)가 존재하는 걸
-- 뒤늦게 발견해서, 방금 만든 active_photographer_avatars는 중복이라 삭제.
-- 앱 코드는 기존 profiles_public을 쓰도록 변경(decision-log.md 참고).

drop view if exists public.active_photographer_avatars;
