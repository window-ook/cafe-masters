---
paths:
  - "actions/**"
  - "hooks/supabase/**"
  - "queries/**"
---

# Data Flow

## Supabase 읽기·쓰기

**Read**:

```
Component → useQuery 커스텀 훅 → Server Action → Supabase
```

**Create/Update/Delete**:

```
Component → useMutation 커스텀 훅 → Server Action → Supabase
```

- 커스텀 훅은 `hooks/supabase/<domain>/`, Server Action은 `actions/supabase/<domain>/`에 둡니다.
- 훅 이름은 기존 패턴을 따릅니다. (조회 `useBookmarkCafes`·`useBookmarkCounts`, 변경 `useCreateBookmarkCafe`)
- mutation 성공 시 `invalidateQueries`로 관련 query key를 무효화합니다.
- 모든 테이블은 RLS가 켜져 있고 `auth.users(id)`를 참조합니다. 스키마 타입은 `types_db.ts`가 기준입니다.

## Server Action

Early Return 패턴을 적용합니다.
절대 try catch를 사용하지 않습니다.
에러 발생 시 error를 throw합니다.

```typescript
'use server';

import { createServerSupabaseClient } from '@/utils/supabase/server';

/**
 * 북마크한 카페 삭제
 * @param id 북마크 ID
 */
export async function deleteBookmarkCafe(id: number): Promise<boolean> {
  if (!id) throw new Error('북마크 삭제를 위한 카페 ID가 유효하지 않습니다.');

  const supabase = await createServerSupabaseClient();
  const user = await supabase.auth.getUser();

  if (!user?.data?.user) throw new Error('로그인이 필요합니다.');

  const user_id = user.data.user.id;
  const { error } = await supabase
    .from('bookmark')
    .delete()
    .eq('id', id)
    .eq('user_id', user_id);

  if (error) throw new Error(`북마크 삭제에 실패했습니다: ${error.message}`);

  return true;
}
```

## Query key Factory

src: `queries/**`

React Query key도 타입 단언을 사용하여 중앙에서 관리합니다.
하위 디렉토리 트리는 도메인 중심으로 분류합니다.

- ex) `queries/supabase/**`, `queries/kakao-map/**`

```typescript
export const collectionCafeQuery = {
  all: (user_id: string) => ['collectionCafe', user_id],
  counts: (user_id: string) => ['collectionCafeCounts', user_id],
} as const;
```
