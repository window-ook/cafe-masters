# CLAUDE.md

## Rules Index (`.claude/rules/`)

| 파일                                         | 내용                                                                            | 로드 조건                                                                                       |
| -------------------------------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| [`architecture.md`](./rules/architecture.md) | Shell Container-Presenter, 상태 3계층, 디렉토리 배치                            | 항상                                                                                            |
| [`code-style.md`](./rules/code-style.md)     | 공통 코드 스타일 (중괄호, Interface, Tailwind 순서, 경로, 메시지, 메모이제이션) | `**/*.{ts,tsx}`                                                                                 |
| [`data-flow.md`](./rules/data-flow.md)       | Supabase 읽기·쓰기 흐름, Server Action, Query Key Factory                       | `actions/**`, `hooks/supabase/**`, `queries/**`                                                 |
| [`declarative.md`](./rules/declarative.md)   | 선언형 로딩·에러 처리 (loading.tsx, Suspense, ErrorBoundaryWrapper)             | `components/**/*.tsx`, `app/**/*.tsx`                                                           |
| [`kakao-map.md`](./rules/kakao-map.md)       | 마커·InfoWindow 관리, 카페 상세 조회 흐름                                       | `components/shared/KaKaoMap.tsx`, `hooks/kakao-map/**`, `app/api/cafe-detail/**`, `lib/data/**` |

## Database Types

```bash
pnpm generate-types      # Generate TypeScript types from Supabase schema
```
