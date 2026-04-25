# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ALWAYS REPLY IN KOREAN

- 항상 한국어로 대답합니다.

## Code Style Guidelines

### Single-Line Statements

단일 라인 실행문의 경우 중괄호를 사용하지 않습니다:

```typescript
// if statements
if (!res.ok) return { success: false, message: '에러가 발생했습니다.' };

// arrow functions
const yell = () => console.log('hi!');
```

### Server Actions

- Early Return 패턴을 사용합니다
- try-catch를 사용하지 않고 에러를 throw합니다
- 모든 함수에 JSDoc 주석을 작성합니다

### Interface Naming

- 항상 `I-` 접두사를 사용합니다 (예: `ICafe`, `IUser`)
- `-Props`와 같은 접미사는 절대 사용하지 않습니다
- 모든 인터페이스는 export해야 합니다

### Tailwind CSS Class Order

클래스명은 다음 순서대로 작성합니다:
1. 포지션 (absolute, relative, fixed, top, left)
2. 레이아웃 (w-, h-, size-, min-w-, min-h-, overflow-)
3. 공백 (m-, mx-, my-, p-, px-, py-)
4. 외곽 효과 (border-, shadow-)
5. 배경색 (bg-, opacity-)
6. Flex/Grid (flex, grid, gap-, justify-, items-)
7. 폰트 (text-, font-, whitespace-, leading-)
8. 애니메이션 (animate-)
9. 트랜지션 (transition-, duration-, ease-)
10. 조건부 스타일 (hover:, focus:, active:) - 해당 속성 바로 뒤에 위치

### Declarative Programming

- 페이지 로딩: `app/[page-name]/loading.tsx` 생성
- 컴포넌트 로딩: `React.Suspense`로 감싸기
- 에러 핸들링: `ErrorBoundaryWrapper` 컴포넌트 사용

## Commands

### Development

```bash
pnpm install           # Install dependencies
pnpm dev              # Start development server with Turbopack
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
```

### Testing

```bash
pnpm test:playwright     # Run Playwright E2E tests
pnpm test:playwright:ui  # Run Playwright tests with UI mode
```

### Database Types

```bash
pnpm generate-types      # Generate TypeScript types from Supabase schema
```

### Bundle Analysis

```bash
pnpm analyze            # Build with bundle analyzer enabled
```

## Architecture Overview

### Component Architecture: Shell Container-Presenter Pattern

This is a map-based service where UI containers dynamically render feature-specific components:

- **Shell Containers**: `SideBar.tsx` and `SlidingDrawer.tsx` handle layout and navigation
  - Conditionally render Presenter components based on current route
  - Managed by `usePathMatcher` hook which abstracts routing state

- **Presenters**: Feature components handle data fetching, state sync, and UI rendering
  - Located in feature-based directories: `components/search`, `components/collection`, `components/bookmark`, `components/recommendation`
  - Use abstracted async custom hooks from `hooks/` directory

### State Management (3 Layers)

1. **URL State**: Managed via `usePathMatcher` hook
   - Provides route-based state to Shell Containers

2. **Server State**: Tanstack Query
   - Custom hooks ending with `-Query` for data fetching and caching
   - `useMutation` for CRUD operations with `invalidateQueries` for cache invalidation

3. **Client State**: Zustand stores in `stores/`
   - Import individual state/actions for optimal re-render performance
   - Persistent state uses `persist` middleware
   - Always select specific state slices: `useUIStore(state => state.isDarkTheme)` NOT `useUIStore()`

### Data Flow Patterns

**Supabase Read**:

```
Component → useQuery custom hook → Server Action → Supabase
```

**Supabase Create/Update/Delete**:

```
Component → useMutation custom hook → Server Action → Supabase
```

**Cafe Detail Fetching**:

```
Component → useSearchCafeDetail → Route Handler → Playwright scraping → Kakao Map
```

## Directory Structure

```
├── app/                    # Next.js App Router pages and API routes
├── actions/supabase/       # Server actions for Supabase CRUD
├── components/
│   ├── bookmark/          # Bookmark cafe features
│   ├── collection/        # Collected cafe features
│   ├── recommendation/    # Recommended cafe features
│   ├── search/            # Search cafe features
│   ├── shared/            # Shared components (SideBar, SlidingDrawer, etc.)
│   ├── landing/           # Landing page sections
│   └── shadcn-ui/         # shadcn/ui components
├── hooks/
│   ├── kakao-map/         # Kakao Map API integration
│   ├── supabase/          # Supabase CRUD hooks (useQuery/useMutation wrappers)
│   └── ui/                # UI state management hooks
├── stores/                # Zustand global state stores
├── queries/               # Query key factories for React Query
├── schema/                # Zod validation schemas
├── lib/
│   ├── paths.ts           # Centralized internal/external API paths
│   └── data/              # Data fetching utilities
├── utils/
│   ├── constants/         # Constants (messages, categories)
│   ├── supabase/          # Supabase client utilities
│   └── shared/            # Shared utilities
└── types/                 # TypeScript type definitions
```

## Key Patterns & Practices

### Path Factory (`lib/paths.ts`)

All internal and external API paths are centralized to prevent hardcoding and enforce reference integrity. Always import paths from this file.

### Query Key Factory (`queries/**`)

Query keys are centralized by feature to prevent typos and incorrect parameter usage. Follow FSD (Feature-Sliced Design) recommendations.

### Error Handling

Use `ErrorBoundaryWrapper` component for declarative error boundaries:

```tsx
<ErrorBoundaryWrapper
  featureName="Feature Name"
  message="Error message to display"
>
  <YourComponent />
</ErrorBoundaryWrapper>
```

### Form Validation

All form schemas use Zod (`schema/`) with React Hook Form integration:

- Schemas provide type-safe validation with method chaining
- Use `@hookform/resolvers` for integration with useForm

### Message Constants

All toast messages and console logs are defined in `utils/constants/messages.ts`:

- `TOAST_SUCCESS`, `TOAST_ERROR`, `TOAST_WARN` for user-facing messages
- `CONSOLE_LOG`, `CONSOLE_ERROR` for developer debugging

### KakaoMap Integration

- Always use `useRef` for marker creation/deletion and InfoWindow management
- Compare previous data with current data to prevent unnecessary marker recreation
- Use `prevKeywordRef` to prevent duplicate searches

## Database Schema (Supabase)

Four main tables with RLS (Row Level Security) enabled:

- `bookmark`: Bookmarked cafes
- `collection`: Collected cafes with ratings and reviews
- `recommendation`: Admin-recommended cafes
- `user`: User profiles with admin flag
- `cafe_details`: Cafe's detail information for '/detail' pages.

All tables reference `auth.users(id)` for user relationships.

## Testing

- E2E tests located in `tests/e2e/`
- Use Playwright with baseURL `http://localhost:3000`
- CI runs chromium only; local dev includes firefox and webkit
- Tests run in parallel locally, sequential in CI

## Performance Optimizations

### Rendering

- `useMemo`: Complex filtering, cafe detail progressive rendering, pagination calculations
- `useCallback`: Event handlers with complex routing/state updates (e.g., `useCafeClick`)
- `React.forwardRef`: InputField for React Hook Form integration

### Assets

- Fonts: Pretendard Variable + DungGeunMo with `display: swap` and preload
- Images: CDN-hosted `.avif` format for reduced size
- Code splitting: Dynamic imports with `ssr: false` for off-screen components

## TypeScript Configuration

- **Path Alias**: Use `@/` for absolute imports (e.g., `import { X } from '@/components/Y'`)
- **Strict Mode**: Enabled with `noImplicitAny` and `noUnusedLocals`
- **React JSX**: Using `react-jsx` transform (no need to import React in components)

## Next.js Configuration

### PWA Support

- Progressive Web App enabled via `next-pwa`
- Service Worker automatically generated in production
- Disabled in development mode

### React Compiler

- React Compiler enabled for automatic optimization
- No need for manual memoization in many cases

### Turbopack

- Development server uses Turbopack for faster builds
- File system caching enabled for dev builds

### Image Optimization

- Allowed image domains: Kakao CDN, Daum CDN, Naver Blog, Supabase Storage
- Formats: AVIF (preferred), WebP fallback
- Quality levels: 75 (default), 100 (high quality)

## Environment Variables

Required environment variables:

- `NEXT_PUBLIC_KAKAO_MAP_KEY`: Kakao Map API key
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key (server-side only)
