---
paths:
  - "components/**/*.tsx"
  - "app/**/*.tsx"
---

# Declarative Programming

- 페이지 단위 로딩 상태는 `app/[page-name]/loading.tsx`를 생성하여 핸들링합니다.
- 컴포넌트 단위 로딩 상태는 `React.Suspense`를 감싸서 핸들링합니다.
- 컴포넌트 단위 에러 핸들링은 컴포넌트 내부 처리 혹은 `ErrorBoundaryWrapper`로 감쌉니다.
  - `components/shared/ErrorBoundaryWrapper.tsx` — react-error-boundary의 `ErrorBoundary`에 공통 `ErrorFallback`을 연결한 래퍼

```tsx
<ErrorBoundaryWrapper
  featureName="Feature Name"
  message="Error message to display"
>
  <YourComponent />
</ErrorBoundaryWrapper>
```
