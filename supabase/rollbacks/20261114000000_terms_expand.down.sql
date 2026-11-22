-- 롤백: 확장. image가 null인 행이 없을 때만 NOT NULL을 복원할 수 있습니다
begin;

drop policy "Users can view their own collections" on public.collection;
create policy "Authenticated users can view all collections" on public.collection
  for select to anon, authenticated using (true);

alter table public.collection alter column image set not null;

commit;
