---
paths:
  - "components/shared/KaKaoMap.tsx"
  - "hooks/kakao-map/**"
  - "app/api/cafe-detail/**"
  - "lib/data/**"
---

# Kakao Map

## 마커·InfoWindow

- 마커 생성·삭제와 InfoWindow 관리는 항상 `useRef`를 사용합니다.
- 이전 데이터와 현재 데이터를 비교해 불필요한 마커 재생성을 막습니다.
- `prevKeywordRef`로 중복 검색을 막습니다.

## 카페 상세 조회

`hooks/kakao-map/useSearchCafeDetail.ts`가 환경별로 다르게 동작합니다.

```
Component → useSearchCafeDetail → Server Action getCafeDetail → Supabase cafe_detail
  └ DB에 없으면
    - 로컬: Route Handler(/api/cafe-detail/[id]) → Playwright 스크래핑 → createCafeDetail로 DB 저장
    - Vercel: 스크래핑하지 않고 IMAGE_PATHS.FALLBACK_THUMBNAILS 중 하나를 반환
```
