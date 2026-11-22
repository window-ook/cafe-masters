---
paths:
  - "actions/**"
  - "data/**"
  - "app/api/**"
  - "hooks/supabase/**"
  - "queries/**"
---

# Data Flow

## Supabase 읽기·쓰기

**Read**:

```
최초 진입: app/(app)/layout.tsx prefetch → data 함수 → Supabase → HydrationBoundary → Query 캐시
이후 갱신: Component → useQuery 커스텀 훅 → Route Handler(GET) → data 함수 → Supabase
```

**Create/Update/Delete**:

```
Component → useMutation 커스텀 훅 → Server Action → Supabase
```

- 조회 함수는 `data/supabase/<domain>/`에 두고 `import 'server-only'`로 시작합니다. `'use server'`를 붙이지 않습니다.
- 로그인 사용자가 필요한 조회는 `getAuthContext()`로 클라이언트와 사용자를 받습니다.
- Route Handler는 `app/api/<domain>/`에 두고 data 함수의 결과를 그대로 반환합니다. 경로는 `lib/paths.ts`의 `INTERNAL_PATHS`에 등록합니다.
- 레이아웃 prefetch의 `queryFn`과 훅의 `queryFn`은 같은 query key에 같은 모양의 값을 넣어야 합니다.
- 레이아웃은 prefetch를 기다렸다가 넘깁니다. `Suspense`로 스트리밍하면 셸의 훅이 먼저 마운트되어 같은 조회를 한 번 더 보냅니다.
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
