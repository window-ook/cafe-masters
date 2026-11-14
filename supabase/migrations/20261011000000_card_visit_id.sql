-- 방문별 카드 ID 전환 + 발행 한도
-- 근거: r3f-s2-opening-entry.md DEC-12·DEC-13, card-visit-id-migration.md DEC-01~06
begin;

-- 장소 식별 분리 (DEC-02)
alter table public.collection
  add column place_provider text,
  add column place_id text;

update public.collection
set place_provider = 'kakao', place_id = id::text;

alter table public.collection
  alter column place_provider set not null,
  alter column place_id set not null;

-- 카드 ID는 identity가 생성. 기존 장소 ID 뒤에서 시작 (DEC-01)
select setval(pg_get_serial_sequence('public.collection', 'id'), (select max(id) from public.collection));

-- 추첨 시각 (DEC-03)
alter table public.collection add column drawn_at timestamptz;

update public.collection set drawn_at = created_at where material is not null;

alter table public.collection
  add constraint collection_drawn_at_check check ((material is null) = (drawn_at is null));

-- 라브라도라이트 허용 (DEC-06)
alter table public.collection drop constraint collection_material_check;
alter table public.collection
  add constraint collection_material_check check (
    material = any (array['mica', 'amber', 'gold', 'emerald', 'amethyst', 'obsidian', 'labradorite', 'archive'])
  );

-- KST 하루 1회 추첨 (DEC-04)
create unique index collection_daily_draw_key
  on public.collection (user_id, place_provider, place_id, ((drawn_at at time zone 'Asia/Seoul')::date))
  where drawn_at is not null;

commit;
