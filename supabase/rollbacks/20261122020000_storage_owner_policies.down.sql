-- 롤백: 이전의 공개 쓰기 정책으로 되돌립니다(보안상 권장하지 않음, 장애 대응용)
begin;

drop policy "Users can upload to their own collection folder" on storage.objects;
drop policy "Users can update their own uploads" on storage.objects;
drop policy "Users can delete their own uploads" on storage.objects;

create policy "all_user_crud sjem6m_1" on storage.objects
  for insert to public with check (bucket_id = 'cafe masters');
create policy "all_user_crud sjem6m_2" on storage.objects
  for update to public using (bucket_id = 'cafe masters');
create policy "all_user_crud sjem6m_3" on storage.objects
  for delete to public using (bucket_id = 'cafe masters');

commit;
