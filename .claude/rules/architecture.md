# Architecture

## Shell Container-Presenter

지도 기반 서비스로, Shell Container가 현재 라우트에 맞는 기능별 Presenter를 렌더링합니다.

- **Shell Container**: `components/shared/sidebar/SideBar.tsx`, `components/shared/sliding-drawer/SlidingDrawer.tsx` — 레이아웃·내비게이션
  - 현재 라우트에 따라 Presenter를 조건부 렌더링합니다.
  - 라우트 판정은 `hooks/ui/usePathMatcher.ts`로 추상화합니다.
- **Presenter**: `components/{search,collection,bookmark,recommendation}/` — 데이터 페칭·상태 동기화·UI 렌더링
  - `hooks/`의 비동기 커스텀 훅을 사용합니다.

## State Management (3 Layers)

1. **URL State**: `usePathMatcher` — Shell Container에 라우트 기반 상태를 제공합니다.
2. **Server State**: TanStack Query — 흐름은 [`data-flow.md`](./data-flow.md)를 따릅니다.
3. **Client State**: Zustand (`stores/`)
   - 필요한 slice만 선택해 구독합니다: `useUIStore(state => state.isDarkTheme)` O, `useUIStore()` X
   - 영속 상태는 `persist` 미들웨어를 사용합니다.

## Directory Placement

| 경로                           | 두는 것                                                         |
| ------------------------------ | --------------------------------------------------------------- |
| `actions/supabase/<domain>/`   | Supabase CRUD Server Action                                     |
| `hooks/supabase/<domain>/`     | Server Action을 감싼 `useQuery`·`useMutation` 훅                |
| `hooks/kakao-map/`             | Kakao Map 연동 훅                                               |
| `hooks/ui/`                    | UI 상태 훅                                                      |
| `queries/<domain>/`            | Query Key Factory                                               |
| `components/<feature>/`        | 기능별 Presenter                                                |
| `components/shared/`           | 여러 기능이 공유하는 컴포넌트 (Shell Container 포함)            |
| `components/shadcn-ui/`        | shadcn/ui 컴포넌트                                              |
| `schema/`                      | Zod 폼 스키마 — React Hook Form에 `@hookform/resolvers`로 연결  |
| `lib/paths.ts`                 | 내부·외부·이미지 경로 ([`code-style.md`](./code-style.md))      |
| `utils/constants/`             | 메시지·카테고리 상수                                            |
| `tests/e2e/`                   | Playwright E2E 테스트                                           |
