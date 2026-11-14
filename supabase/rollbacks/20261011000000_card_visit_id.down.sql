-- 전제: 마이그레이션 이후 새로 만든 카드가 없을 때만 무손실입니다 (RSK-02)
begin;

drop index if exists public.collection_daily_draw_key;

alter table public.collection drop constraint collection_material_check;
alter table public.collection
  add constraint collection_material_check check (
    material = any (array['mica', 'amber', 'gold', 'emerald', 'amethyst', 'obsidian', 'archive'])
  );

alter table public.collection drop constraint collection_drawn_at_check;

alter table public.collection
  drop column drawn_at,
  drop column place_id,
  drop column place_provider;

commit;
