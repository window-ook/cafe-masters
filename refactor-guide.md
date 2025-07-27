# 카페 마스터즈 리팩토링 계획 (ErrorBoundary 포함)

## 📋 현재 상황 분석

기존 refactor-guide.md를 바탕으로 코드베이스를 분석한 결과, ErrorBoundary가 전혀 구현되어 있지 않아 런타임 에러에 대한 방어막이 부족한 상황입니다.

## 🔴 HIGH 우선순위 문제점

1. **과도한 Persist 사용: 모든 store에 persist가 적용되어 메모리 낭비 발생**
2. **상태 중복 저장: useCafeStore에 필터링된 데이터가 저장되지만 실제로는 React Query에서 필터링 재수행**
3. **비효율적 Cache Invalidation: invalidateQueries + refetchQueries 중복 호출로 성능 저하**
4. **에러 처리 부족: 7개 파일에서 onError: error => console.error(error) 패턴 사용 (사용자 피드백 없음)**
5. **❌ ErrorBoundary 부재: 컴포넌트 레벨 에러 처리 시스템 없음**

## 🟡 MEDIUM 우선순위 문제점

1. **성능 최적화 부족: React.memo, useMemo, useCallback 활용 미흡 (11건만 발견)**
2. **타입 안전성 개선 필요: 일부 컴포넌트에서 타입 검증 강화 필요**

## 🎯 리팩토링 계획

### Phase 1: 핵심 성능 개선 + ErrorBoundary 구축 (HIGH 우선순위)

**1.1 ErrorBoundary 시스템 구축 ⭐ 새로 추가**

- 대상 파일: 새로 생성할 파일들
  - components/shared/ErrorBoundary.tsx - 메인 ErrorBoundary 컴포넌트
  - components/shared/ErrorFallback.tsx - 에러 폴백 UI 컴포넌트
  - hooks/shared/useErrorHandler.ts - 에러 핸들링 로직 훅
  - providers/ErrorBoundaryProvider.tsx - 글로벌 ErrorBoundary 래퍼
- 작업 내용
  - 글로벌 ErrorBoundary: 앱 전체를 감싸는 최상위 에러 경계글로벌 ErrorBoundary: 앱 전체를 감싸는 최상위 에러 경계
  - 페이지별 ErrorBoundary: 각 주요 페이지(/main, /search, /collected 등)별 에러 경계
  - 컴포넌트별 ErrorBoundary: 복잡한 컴포넌트(KakaoMap, SlidingDrawer 등)별 에러 경계
  - 에러 로깅 시스템: 에러 발생 시 상세 정보 수집 및 로깅
  - 사용자 친화적 폴백 UI: 에러 발생 시 보여줄 아름다운 에러 화면
  - 에러 복구 기능: 사용자가 에러에서 복구할 수 있는 액션 버튼들

**1.2 Persist 전략 재정의**

- 대상 파일: stores/cafe.ts, stores/ui.ts, stores/map.ts, stores/filter.ts
- 작업 내용
  - UI 일시적 상태 persist 제거 (검색 결과, 필터링된 데이터)
  - 중요한 사용자 설정만 선택적 persist (다크테마, 사용자 위치 등)
  - partialize 옵션 활용하여 필요한 상태만 저장

**1.3 상태 중복 제거**

- 대상 파일: stores/cafe.ts
- 작업 내용
  - filteredCollectedCafe, filteredBookmarkedCafe, filteredRecommendedCafe 제거
  - React Query 훅에서만 필터링 처리하도록 통합
  - 불필요한 setter 함수들 제거

**1.4 통합 에러 처리 시스템 구축**

- 대상 파일: hooks/supabase/ 폴더 내 mutation 훅들 (7개 파일)
- 작업 내용
  - console.error 대신 통합 에러 핸들러 사용
  - 토스트 메시지 + ErrorBoundary 조합으로 계층적 에러 처리
  - 에러 타입별 맞춤형 메시지 및 복구 액션 제공
  - 네트워크 에러, 권한 에러, 서버 에러 등 타입별 처리

**1.5 Cache Invalidation 최적화**

- 대상 파일: hooks/supabase/ 폴더 내 mutation 훅들 (7개 파일)
- 작업 내용
  - invalidateQueries 후 refetchQueries 중복 호출 제거
  - 낙관적 업데이트 구현으로 사용자 경험 개선
  - 적절한 staleTime, gcTime 설정으로 캐시 최적화

### Phase 2: 성능 최적화 + ErrorBoundary 세분화 (MEDIUM 우선순위)

**2.1 컴포넌트 최적화 + ErrorBoundary 적용**

- 대상 파일: 사이드바 컴포넌트들 (CollectedCafes.tsx, BookmarkedCafes.tsx 등)
- 작업 내용
  - React.memo로 불필요한 리렌더링 방지
  - useCallback으로 이벤트 핸들러 최적화
  - useMemo로 계산 비용이 높은 연산 최적화
  - 각 컴포넌트별 ErrorBoundary 래핑 ⭐

**2.2 카페 클릭 핸들러 최적화 + 에러 처리**

- 대상 파일: hooks/shared/useCafeClickHandler.ts
- 작업 내용
  - 의존성 배열 최적화
  - 메모이제이션 개선
  - 중복 클릭 방지 로직 강화
  - 라우팅 에러 처리 추가 ⭐

**2.3 특수 컴포넌트 ErrorBoundary 적용**

- 대상 컴포넌트
  - KakaoMap.tsx - 지도 API 에러 처리
  - SlidingDrawer.tsx - 드로어 관련 에러 처리
  - UserForm.tsx - 폼 검증 에러 처리
- 작업 내용
  - 각 컴포넌트별 특화된 에러 폴백 UI
  - API 실패, 네트워크 에러 등에 대한 복구 메커니즘

### Phase 3: 고도화 + 모니터링 (LOW 우선순위)

**3.1 에러 모니터링 시스템**

- 작업 내용
  - 에러 발생 패턴 분석을 위한 로깅
  - 성능 지표 수집 (에러율, 복구율 등)
  - 사용자 피드백 수집 시스템

**3.2 타입 안전성 강화**

- 작업 내용
  - 더 엄격한 타입 정의
  - ErrorBoundary props 타입 안전성
  - 에러 객체 타입 정의

**3.3 테스트 커버리지 개선**

- 작업 내용
  - ErrorBoundary 관련 테스트 케이스
  - 에러 시나리오 E2E 테스트
  - 핵심 비즈니스 로직에 대한 단위 테스트

## 🛡️ ErrorBoundary 아키텍처 설계

### 계층적 ErrorBoundary 구조

```tsx
앱 전체 (GlobalErrorBoundary)
├── 페이지 레벨 (PageErrorBoundary)
│   ├── 사이드바 (SidebarErrorBoundary)
│   ├── 메인 컨텐츠 (ContentErrorBoundary)
│   └── 카카오맵 (MapErrorBoundary)
└── 컴포넌트 레벨 (ComponentErrorBoundary)
```

### 에러 타입별 처리 전략

- 네트워크 에러: 재시도 버튼 + 오프라인 모드 안내
- 권한 에러: 로그인 유도 + 리다이렉트
- 데이터 에러: 새로고침 + 고객센터 연결
- 렌더링 에러: 폴백 UI + 개발팀 신고

## 📊 예상 효과

- 안정성: 95% 이상의 에러 상황에서 앱 크래시 방지
- 사용자 경험: 에러 발생 시에도 우아한 사용자 안내
- 메모리 사용량: 30-50% 감소 (persist 최적화)
- API 호출 최적화: 20-30% 감소 (cache invalidation 개선)
- 렌더링 성능: 15-25% 향상 (React 최적화)
- 개발자 경험: 에러 디버깅 및 모니터링 개선

## 🎯 작업 순서

1. ErrorBoundary 시스템 구축 + Persist 전략 재정의
2. 통합 에러 처리 + 상태 중복 제거
3. Cache Invalidation 최적화 + 컴포넌트 성능 최적화
4. 특수 컴포넌트 ErrorBoundary 적용 + 테스트 추가
5. 에러 모니터링 시스템 + 최종 검증
