-- 약관 준수 데이터 모델: 축소 (새 코드 운영 배포 확인 후 적용)
-- 근거: terms-compliant-data-model.md DEC-03·07·08·11·12, POL-01
-- 전제: PR #146이 운영에 배포되어 아래 컬럼·테이블을 읽는 코드가 없음
-- 데이터는 되돌리지 않습니다(RSK-04). 롤백은 스키마만 복원합니다.
begin;

-- 업로드가 아닌 사진 참조 제거: 카카오·폴백 스톡·공용 썸네일 (DEC-08)
update public.collection
set image = null
where image is not null
  and image !~ '/storage/v1/object/public/[^/]+/collection/';

-- (c2) 장소 페이지 자료와 전화번호 (POL-01, DEC-03)
alter table public.collection
  drop column extra_images,
  drop column phone_number,
  drop column opening_time;

alter table public.bookmark
  drop column image,
  drop column extra_images,
  drop column phone_number,
  drop column opening_time,
  drop column menus;

alter table public.recommendation
  drop column image,
  drop column extra_images,
  drop column phone_number,
  drop column opening_time,
  drop column menus;

-- 스크랩 캐시는 덤프 없이 제거 (DEC-07)
drop table public.cafe_detail;

commit;
