-- 롤백: 확장 2. image가 null인 행이 없을 때만 NOT NULL을 복원할 수 있습니다
begin;

alter table public.bookmark alter column image set not null;
alter table public.recommendation alter column image set not null;

commit;
