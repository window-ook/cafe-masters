-- Storage 쓰기 권한을 본인 폴더로 한정 (RSK-02, terms-compliant-data-model.md TSK-14)
-- 전제: 업로드 Route가 로그인을 확인하고 collection/{user_id}/에 올리는 코드가 운영에 배포됨
-- 읽기(SELECT)는 공개로 둡니다. 버킷이 public이라 사진·앱 에셋은 공개 URL로 읽힙니다.
-- 앱 에셋(card_pack/, fallback_thumbnails/, 루트 파일)은 대시보드(서비스 역할)로만 바꿉니다.
begin;

drop policy "all_user_crud sjem6m_1" on storage.objects; -- INSERT (public)
drop policy "all_user_crud sjem6m_2" on storage.objects; -- UPDATE (public)
drop policy "all_user_crud sjem6m_3" on storage.objects; -- DELETE (public)

create policy "Users can upload to their own collection folder" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'cafe masters'
    and (storage.foldername(name))[1] = 'collection'
    and (storage.foldername(name))[2] = (select auth.uid()::text)
  );

create policy "Users can update their own uploads" on storage.objects
  for update to authenticated
  using (bucket_id = 'cafe masters' and owner_id = (select auth.uid()::text))
  with check (bucket_id = 'cafe masters' and owner_id = (select auth.uid()::text));

create policy "Users can delete their own uploads" on storage.objects
  for delete to authenticated
  using (bucket_id = 'cafe masters' and owner_id = (select auth.uid()::text));

commit;
