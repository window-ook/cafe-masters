-- 약관 준수 데이터 모델: 확장 (하위 호환, 코드 배포 전 적용)
-- 근거: terms-compliant-data-model.md DEC-08·11, RSK-03
begin;

-- 업로드 사진이 없는 카드를 허용 (DEC-08)
alter table public.collection alter column image drop not null;

-- 컬렉션은 소유자만 읽음 (RSK-03, POL-04)
drop policy "Authenticated users can view all collections" on public.collection;
create policy "Users can view their own collections" on public.collection
  for select to authenticated using (auth.uid() = user_id);

commit;
