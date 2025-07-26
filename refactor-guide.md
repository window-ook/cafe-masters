# Refactoring & Re-Structuring Guide

## ⚙️ React Query & Zustand 하이브리드 최적화

### 📌 Query Key Factory로 queryKey 중앙에서 관리

useSuspenseQuery, useSuspenseInfiniteQuery를 사용하는 queryKey를 별도로 정의합니다. 모든 queryKey는 하드코딩하지 않고 반드시 팩토리로부터 참조하여 사용해야 합니다.

**참고**
`@/queries/supabase/**`

### 📌 useSuspenseQuery, useSuspenseInfiniteQuery 사용

SideBar에서는 페이지 별로 보여주는 데이터의 리스트가 다르죠. 이때 데이터와 UI는 반드시 연결되어있으므로 Suspense를 통해 로딩 UI를 처리하도록 하는 방식이 모던 프론트엔드 트렌드입니다. ErrorBoundary는 하나로 상단에서 위치하여 위임되는 에러를 캐치하는 식으로 구현합니다.

### 📊 Zustand → React Query 마이그레이션

**✅ 즉시 마이그레이션 필요한 Store 데이터**

stores/cafe.ts - 모든 데이터 페칭 관련 상태

- searchResult: Kakao API 검색 결과 (외부 API 데이터)
- collectedCafe & filteredCollectedCafe: 수집된 카페 데이터 (Supabase)
- bookmarkedCafe & filteredBookmarkedCafe: 북마크 카페 데이터 (Supabase)
- recommendedCafe & filteredRecommendedCafe: 추천 카페 데이터 (Supabase)
- collectedCafeCount/bookmarkedCafeCount/recommendedCafeCount: 카운트 데이터
- cafeDetail/collectedCafeDetail/bookmarkedCafeDetail/recommendedCafeDetail: 상세 데이터

**✅ 유지할 Store (UI 상태만 관리)**

- stores/cafe-state.ts: 카페 상태 플래그 (isCollected, isBookmarked, isRecommended)
- stores/filter.ts: 검색/필터 UI 상태
- stores/map.ts: 지도 좌표 및 현재 카페 UI 상태
- stores/ui.ts: 다크모드, 사이드바, 로딩 등 UI 상태
- stores/user.ts: 사용자 세션 정보 (React Query와 별도 관리 필요)

**🔄 마이그레이션 단계별 실행 계획**

**Phase 1: 중복 제거 및 정리**

1. 중복 데이터 관리 제거
   - useRecommendedCafes.ts에서 setRecommendedCafe 호출 제거, useRecommendedCafes.ts에서 setRecommendedCafe 호출 제거
   - React Query가 이미 캐싱하는데 Zustand에 다시 저장하는 중복 패턴 해결,

**Phase 2: 새로운 React Query 훅 생성**

1. 검색 결과 훅: useKakaoSearchCafes.ts
2. 카운트 통합 훅: 기존 개별 카운트 훅들을 통합한 useCafeCounts.ts
3. 카페 상세 데이터 훅: useCafeDetails.ts

**Phase 3: 필터링 로직 개선**

1. 클라이언트 필터링을 React Query 내부로 이동
   - 현재 useBookmarkedCafes와 useCollectedCafes가 하는 필터링을 표준화
   - useMemo를 활용한 성능 최적화 유지

**Phase 4: Store 정리**

1. stores/cafe.ts 대폭 축소
   - 데이터 저장 로직 모두 제거데이터 저장 로직 모두 제거
   - UI 상태나 임시 상태만 남김UI 상태나 임시 상태만 남김

📈 예상 효과

✅ 개선되는 점

- 데이터 일관성: 단일 진실 소스로 데이터 동기화 문제 해결
- 캐싱 최적화: React Query의 지능적 캐싱으로 불필요한 API 호출 감소
- 성능 향상: 중복 상태 관리 제거로 리렌더링 최적화
- 코드 단순화: 복잡한 상태 동기화 로직 제거

✅ 유지되는 기능

- 무한 스크롤링 (useInfiniteQuery)
- 실시간 필터링 및 검색
- 낙관적 업데이트 (CUD 작업)
- 기존 UI/UX 동작 완전 보존

🚨 주의사항

- 사용자 세션 정보(stores/user.ts)는 인증 상태와 밀접하므로 별도 관리 유지
- 기존 컴포넌트 인터페이스 최대한 보존하여 변경 범위 최소화
- 단계적 마이그레이션으로 안정성 확보

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
