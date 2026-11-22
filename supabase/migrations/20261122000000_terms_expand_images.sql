-- 약관 준수 데이터 모델: 확장 2 (하위 호환, 코드 배포 전 적용)
-- 근거: terms-compliant-data-model.md DEC-08. 북마크·추천 사진은 전부 카카오 자료라 새 코드는 저장하지 않습니다.
-- 컬럼 자체는 축소 단계(TSK-12)에서 DROP합니다.
begin;

alter table public.bookmark alter column image drop not null;
alter table public.recommendation alter column image drop not null;

commit;
