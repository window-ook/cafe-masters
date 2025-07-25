# Component Re-Structuring Guide

## 🫙 SideBar 개편

**역할**
SideBar는 여러 페이지에서 데이터를 페이지별로 다르게 보여주는 핵심 레이아웃입니다.
따라서 경로별로 보여줄 컨텐츠의 기준이 확실하게 존재합니다.

**경로별 컨텐츠 렌더 분기**
| 경로 | 포함할 컨텐츠 |
| ----------------------- | ---------------------------------------------------------------- |
| **`/main`** | Header, ThemeToggleButton, SearchBar, TabsForLink, Footer |
| **`/search/**`\*\*      | Header, ThemeToggleButton, SearchBar, SearchCafes, PageConverter |
| **`/collected/**`\*\* | Header, ThemeToggleButton, SearchBar, CollectedCafes |
| **`/bookmarked/**`\*\* | Header, ThemeToggleButton, SearchBar, BookmarkedCafes |
| **`/recommended/**`\*\* | Header, ThemeToggleButton, SearchBar, RecommendCafes |

### ⭐️ 신규로 만들어야 할 컴포넌트

- **SearchedCafes.tsx**
  - 검색 결과로 나오는 카페 리스트입니다. 이미 구현되어있는 'SearchedResult`를 이름 변경하고 최적화하면 됩니다.
- **CollectedCafes.tsx**
  - `getCollectedCafes`로 조회한 수집한 카페를 무한 스크롤로 나타내는 리스트입니다.
  - 각 카페는 디자인 해둔 카드의 UI대로 보여집니다.
  - fetch 및 캐싱: hooks/supabase/useCollectedCafes (based with useSuspenseInfiniteQuery)
  - Suspense Fallback: CardSkeleton.tsx
  - 다음 페이지 로딩 중일 때 UI: PulseDot.tsx
- **BookmarkedCafes.tsx**
  - `getBookmarkedCafes`로 조회한 북마크 카페를 페이지네이션으로 나타내는 리스트입니다.
  - fetch 및 캐싱: hooks/supabase/useBookmarkedCafes (based with useSuspenseQuery)
  - Suspense Fallback: Skeleton.tsx
- **RecommendCafes.tsx**
  - `getRecommendedCafes`로 조회한 추천 카페를 페이지네이션으로 나타내는 리스트입니다.
  - fetch 및 캐싱: hooks/supabase/useRecommendedCafes (based with useSuspenseQuery)
  - Suspense Fallback: Skeleton.tsx

각 페이지에서 '-Cafes'로 된 컴포넌트를 바로 보여주고, `useSuspenseInfiniteQuery`를 활용해서 fetch한
데이터를 카드 UI에 바인딩하는 비즈니스 로직은 '-Cafes'에 선언해야 합니다.

## 🪟 Sliding-Drawer 개편

| 경로                           | 포함할 컨텐츠         |
| ------------------------------ | --------------------- |
| **`/search/detail/[id]`**      | CafeDetail            |
| **`/collected/detail/[id]`**   | CollectedCafeDetail   |
| **`/bookmarked/detail/[id]`**  | BookmarkedCafeDetail  |
| **`/recommended/detail/[id]`** | RecommendedCafeDetail |

수집한 카페, 북마크 카페, 추천 카페의 상세 정보 페이지에서 상세 정보를 담은 컴포넌트는 기본적으로 캐시된 데이터를 UI 바인딩합니다. 이들은 supabase로부터 이미 React Query 훅을 통해 캐시를 한 상태입니다. 이와 달리 검색 결과 카페의 상세 정보 페이지는 puppeteer를 사용하여 크롤링을 하여 데이터를 fetch합니다.

### ⭐️ 신규로 만들어야 할 컴포넌트

- **CafeDetail.tsx**
- **BookmarkedCafeDetail.tsx**
- **RecommendedCafeDetail.tsx**

### 🛠️ 로직 변경이 필요한 컴포넌트

- CollectedCafeDetail.tsx

신규 생성 및 로직 변경 컴포넌트의 레이아웃은 기존의 NormalCafeDetail, CollectedCafeDetali을 참고하면 됩니다.
props로 데이터를 받는 방식에서 이제 직접 React Query 훅을 사용하는 방식으로 변경하면 됩니다.

## ⚙️ 상태 관리 최적화

### 📌 Query Key Factory로 queryKey 중앙에서 관리

useSuspenseQuery, useSuspenseInfiniteQuery를 사용하는 queryKey를 별도로 정의합니다. 모든 queryKey는 하드코딩하지 않고 반드시 팩토리로부터 참조하여 사용해야 합니다.

**참고**
`@/queries/supabase/**`

### 📌 useSuspenseQuery, useSuspenseInfiniteQuery 사용

SideBar에서는 페이지 별로 보여주는 데이터의 리스트가 다르죠. 이때 데이터와 UI는 반드시 연결되어있으므로 Suspense를 통해 로딩 UI를 처리하도록 하는 방식이 모던 프론트엔드 트렌드입니다. ErrorBoundary는 하나로 상단에서 위치하여 위임되는 에러를 캐치하는 식으로 구현합니다.

### 📌 Zustand Store 점검

기존 로직이 React Query에서 캐시한 데이터와 Zustand state의 동기화로 인한 불필요한 중복과 Store 안에 상당히 많은 상태의 수가 성능 저하를 야기했습니다.
지역 상태로 관리할 수 있는 상태는 useState로 관리하는 것으로 변경하고, 전역 상태로 존재해야 하는 테마 boolean이나 UI 관련 상태는 최적화된 전역 상태로 컴팩트하게 관리해야 합니다.

## 🎨 Tailwind CSS v4 커스텀 클래스 네임 및 지시어 활용하여 개선

### globals.css 정의

**커스텀 클래스 네임 정의**

```tsx
@theme {
	/* 브레이크 포인트 */
  --breakpoint-sm: 401px;
  --breakpoint-md: 801px;
  --breakpoint-lg: 1201px;

  /* 폰트 */
  --font-pretendard: var(--font-pretendard);
  --font-dpixel: var(--font-dunggeunmo);

  /* 폰트 사이즈 */
  --text-2xs: 0.3rem;

  /* 컬러 */
  --color-main-100: #F7B3A8;
  --color-main-200: #E59487;
  --color-main-300: #D37566;
  --color-main-400: #C15645;
  ...
}
```

**지시어 정의**

```tsx
@layer components {

  /* 페이지 컨테이너: 폭 및 중앙 정렬 */
  .contents-container {
    @apply w-full max-w-6xl mx-auto;
  }

  /* 버튼 padding */
  .layout-button {
    @apply px-4 py-2 rounded-md;
  }

  /* 버튼 hover */
  .hover-button {
    @apply cursor-pointer transition duration-150 ease-in;
  }

}
```

**공식문서 참고 및 MCP 사용하기**
v3와 달리 v4는 global.css에 configure를 정의합니다. 이 문법을 모르시겠다면, 공식문서 페이지를 검색하여 참고하고 context 7 mcp server를 사용하여 학습하세요.

## 📋 FormForCollect를 React-Hook-Form과 Zod로 관리

useForm, Controller, zodResolver를 사용하여 Form의 input 상태와 value를 관리합니다. supabase에 저장되어야 할 값이므로 null이면 안 되는 컬럼에 해당하는 input에는 `@/types/supabase/collection.ts`를 참고하여 zod로 `collectionSchema.ts` 를 생성해서 유효성 검사를 적용합니다.
생성한 스키마는 React-Hook-Form의 zodResolver에 할당합니다.
