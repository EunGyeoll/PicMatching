-- 온보딩(§16)의 complete_photographer_onboarding RPC가 photographer_areas는
-- delete-then-insert로 멱등하게 처리하면서 portfolio_images는 매번 insert만 하고 있어서,
-- 온보딩 화면을 편집용으로 재제출할 때마다(§32) 기존 포트폴리오 사진이 중복 저장되던 버그 수정.
-- 상세 배경: docs/decision-log.md §33

CREATE OR REPLACE FUNCTION public.complete_photographer_onboarding(p_display_name text, p_headline text, p_bio text, p_contact_info text, p_areas text[], p_portfolio_paths text[])
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;

  insert into public.photographer_profiles (id, display_name, headline, bio, contact_info, status)
  values (v_uid, p_display_name, p_headline, p_bio, p_contact_info, 'active')
  on conflict (id) do update set
    display_name = excluded.display_name,
    headline = excluded.headline,
    bio = excluded.bio,
    contact_info = excluded.contact_info,
    status = 'active';

  delete from public.photographer_areas where photographer_id = v_uid;
  insert into public.photographer_areas (photographer_id, area)
  select v_uid, unnest(p_areas);

  delete from public.portfolio_images where photographer_id = v_uid;
  insert into public.portfolio_images (photographer_id, storage_path, sort_order)
  select v_uid, path, ord - 1
  from unnest(p_portfolio_paths) with ordinality as t(path, ord);
end;
$function$
