---
paths:
  - "components/shared/KaKaoMap.tsx"
  - "hooks/kakao-map/**"
  - "components/shared/sliding-drawer/**"
---

# Kakao Map

## 마커·InfoWindow

- 마커 생성·삭제와 InfoWindow 관리는 항상 `useRef`를 사용합니다.
- 이전 데이터와 현재 데이터를 비교해 불필요한 마커 재생성을 막습니다.
- `prevKeywordRef`로 중복 검색을 막습니다.

## 장소 데이터

- 카카오 장소 페이지 자료(사진·메뉴·영업시간·후기)는 가져오지도 저장하지도 표시하지도 않습니다. 스크래핑은 이용 정책 위반입니다.
- 필요하면 `KakaoMapLink`로 카카오맵에 보냅니다. 링크는 `EXTERNAL_PATHS.KAKAO_MAP_PLACE`(공식 `/link/map/{장소ID}` 패턴)로 만듭니다.
- 수집 카드는 카드 ID와 장소 ID가 다릅니다. 링크에는 `place_id`를 씁니다.
- DB에 남기는 카카오 값은 사용자가 고른 카페의 `name`·`address`·`coordX`·`coordY`뿐입니다. 전화번호도 저장·표시하지 않습니다.
