# DB 캐싱 + BFF on Railway 통한 카카오맵 크롤링 최적화 계획

## 📋 현재 상황 분석

### 기존 라우트 핸들러 크롤링 문제점

src: `@app/api/cafe-detail/product/[id]/route.ts`

- Vercel에서 카페 상세정보 크롤링 시 30초 maxDuration 제한
- 브라우저 인스턴스 재사용은 구현되었으나 Vercel의 Serverless Function 한계와 DOM 로딩 대기 시간으로 인해 여전히 8초 정도의 응답 시간 소요

### 현재 크롤링 데이터

- 대표 이미지 1개
- 리뷰 이미지 2개
- 영업시간
- 메뉴 정보 4개

## 🚀 최적화 전략

### BFF에서 크롤링 + 백업 저장

POST /api/cafe-detail/crawl/[id]

- 크롤링 수행
- BFF 자체 캐시(Redis) 저장
- 클라이언트에 응답

### 클라이언트에서 수신 후

- Supabase DB 저장 (primary)
- React Query 캐시 업데이트
- UI 업데이트

## 🎯 핵심 구현 요소

### 1. Railway 인프라 활용

- 브라우저 인스턴스 풀링: 여러 브라우저 인스턴스를 미리 생성하여 대기
- 컨테이너 최적화: Railway의 빠른 네트워킹 활용

### 2. 크롤링 성능 최적화

- 캐싱 전략: Redis를 통한 크롤링 결과 캐싱 (TTL: 24시간)
- 프리로딩: 인기 카페들 사전 크롤링

### 3. API 설계(라우트 핸들러)

GET `/api/cafe-detail/[id]` - 개별 카페 상세정보
GET `/api/cafe-detail/preload` - 인기 카페 사전 로딩

### 4. 기술 스택

- 런타임: Node.js + Express
- 크롤링: Playwright with chromium
- 캐싱: Redis
- 배포: Railway
- 모니터링: Railway 내장 로깅

## 📝 구현 단계

1. Express 서버 + Playwright 설정
2. Railway 배포 환경 구성
3. 기본 API 엔드포인트 구현
4. 브라우저 인스턴스 풀링 구현
5. Redis 캐싱 시스템 도입
6. 에러 핸들링 및 재시도 로직
7. 모니터링 및 로깅 시스템

## 🎯 예상 성능 개선

- 목표: 2초 이내 응답
- 캐시 히트: 200ms 이내
- 신규 크롤링: 1-2초 내
- 배치 처리: 10개 카페 동시 처리 시 평균 500ms/카페
