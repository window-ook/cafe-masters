-- 롤백: 축소. 스키마만 복원하고 데이터는 복원하지 않습니다(의도, RSK-04)
-- cafe_detail 정의는 types_db.ts의 Row 타입에서 거꾸로 만든 근사치이며 원래 기본값·RLS는 복원하지 않습니다
begin;

alter table public.collection
  add column extra_images text,
  add column phone_number text,
  add column opening_time text;

alter table public.bookmark
  add column image text,
  add column extra_images text,
  add column phone_number text,
  add column opening_time text,
  add column menus text;

alter table public.recommendation
  add column image text,
  add column extra_images text,
  add column phone_number text,
  add column opening_time text,
  add column menus text;

create table public.cafe_detail (
  id bigint primary key,
  created_at timestamptz not null default now(),
  image text,
  extra_images text,
  opening_time text
);

commit;
