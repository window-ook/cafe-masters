# E2E 테스트 코어플로우 추가

## 현재 상태 분석

### 기존 테스트 구조

```
tests/
├── e2e/
│   ├── core-flow/
│   │   └── signup-to-collect.spec.ts  # 회원가입 → 카페 수집 (유일한 코어플로우)
│   ├── page-objects/
│   │   ├── SignUpPage.ts
│   │   ├── SignInPage.ts
│   │   ├── VerifyPage.ts
│   │   ├── MainPage.ts
│   │   └── OnboardingPage.ts
│   └── utils/
│       └── constants.ts
└── seed.spec.ts  # 미구현
```

### 기존 코어플로우 (1개)

1. **회원가입 → 카페 수집**: 회원가입 → 이메일 인증 → 메인 → 검색 → 카페 선택 → 수집

---

## 제안: 추가할 E2E 코어플로우 (7개)

### 1. 북마크 플로우 (`bookmark-flow.spec.ts`)

**시나리오**: 로그인 → 검색 → 북마크 추가 → 북마크 목록 확인 → 북마크 삭제

**테스트 케이스**:

- ✅ 카페 북마크 추가 성공
- ✅ 북마크 목록에서 카페 확인
- ✅ 북마크 삭제 성공
- ❌ 비로그인 상태에서 북마크 시도 (로그인 유도 확인)

**필요한 Page Object**:

- `BookmarkPage.ts` (신규)

---

### 2. 수집 카페 수정 플로우 (`collection-update-flow.spec.ts`)

**시나리오**: 로그인 → 수집 카페 목록 → 상세 → 수정 → 변경 확인

**테스트 케이스**:

- ✅ 수집 카페 별점 수정 성공
- ✅ 수집 카페 코멘트 수정 성공
- ✅ 수집 카페 먹은 메뉴 수정 성공
- ❌ 필수 정보 삭제 후 저장 시 에러 표시

**필요한 Page Object**:

- `CollectionPage.ts` (신규)

---

### 3. 추천 카페 탐색 플로우 (`recommendation-flow.spec.ts`)

**시나리오**: 비로그인 → 추천 카페 목록 → 카테고리 필터링 → 상세 보기 → 로그인 → 수집

**테스트 케이스**:

- ✅ 비로그인 상태에서 추천 카페 조회 성공
- ✅ 카테고리 필터링 동작 확인
- ✅ 추천 카페 상세 정보 확인
- ✅ 로그인 후 추천 카페 수집 성공

**필요한 Page Object**:

- `RecommendationPage.ts` (신규)

---

### 4. 로그인/로그아웃 플로우 (`auth-flow.spec.ts`)

**시나리오**: 로그인 → 메인 진입 → 로그아웃 → 랜딩 이동

**테스트 케이스**:

- ✅ 올바른 자격 증명으로 로그인 성공
- ❌ 잘못된 이메일로 로그인 실패
- ❌ 잘못된 비밀번호로 로그인 실패
- ✅ 로그아웃 후 랜딩 페이지 이동 확인
- ✅ 로그아웃 후 보호된 페이지 접근 시 리다이렉트

---

### 5. 비밀번호 재설정 플로우 (`reset-password-flow.spec.ts`)

**시나리오**: 로그인 페이지 → 비밀번호 찾기 → 이메일 입력 → 재설정 완료

**테스트 케이스**:

- ✅ 비밀번호 재설정 이메일 요청 성공
- ✅ 새 비밀번호 설정 성공
- ❌ 존재하지 않는 이메일로 요청 시 에러
- ❌ 비밀번호 조건 미충족 시 에러

**필요한 Page Object**:

- `ResetPasswordPage.ts` (신규)

---

### 6. 비로그인 검색 플로우 (`guest-search-flow.spec.ts`)

**시나리오**: 랜딩 → 메인 → 검색 → 결과 확인 → 수집 시도 → 로그인 유도

**테스트 케이스**:

- ✅ 비로그인 상태에서 카페 검색 성공
- ✅ 검색 결과 페이지네이션 동작
- ✅ 카페 상세 정보 확인
- ✅ 수집하기 클릭 시 로그인 페이지로 이동

---

### 7. 필터링 및 페이지네이션 플로우 (`filter-pagination-flow.spec.ts`)

**시나리오**: 로그인 → 수집/북마크 목록 → 지역 필터 → 별점 필터 → 검색어 → 페이지네이션

**테스트 케이스**:

- ✅ 지역 필터 적용 시 결과 변화 확인
- ✅ 별점 필터 적용 시 결과 변화 확인 (수집 카페)
- ✅ 검색어 필터 적용 시 결과 변화 확인
- ✅ 필터 조합 시 정확한 결과 표시
- ✅ 다음/이전 페이지 이동 동작

---

## 우선순위별 구현 순서

| 순위 | 플로우              | 이유                         |
| ---- | ------------------- | ---------------------------- |
| 1    | 로그인/로그아웃     | 모든 인증 플로우의 기반      |
| 2    | 북마크 플로우       | 수집과 함께 핵심 사용자 기능 |
| 3    | 수집 카페 수정      | 기존 수집 플로우의 확장      |
| 4    | 비로그인 검색       | 신규 사용자 진입 경로        |
| 5    | 추천 카페 탐색      | 공개 콘텐츠 + 전환 유도      |
| 6    | 필터링/페이지네이션 | UX 품질 보장                 |
| 7    | 비밀번호 재설정     | 보조 기능                    |

---

## 구현 시 필요한 작업

### 1. 신규 Page Object 생성

```
tests/e2e/page-objects/
├── BookmarkPage.ts       # 북마크 관련 액션
├── CollectionPage.ts     # 수집 카페 관련 액션
├── RecommendationPage.ts # 추천 카페 관련 액션
└── ResetPasswordPage.ts  # 비밀번호 재설정 액션
```

### 2. constants.ts 확장

- 북마크/수집/추천 페이지용 테스트 셀렉터 추가
- 필터 관련 셀렉터 추가
- 추가 에러 메시지 정의

### 3. Mock 데이터 확장

- 북마크 CRUD Mock 응답
- 수집 카페 업데이트 Mock 응답
- 추천 카페 조회 Mock 응답

---

## 병렬 실행을 위한 테스트 그룹화

### 의존성 분석

| 테스트 파일            | 인증 상태         | 데이터 도메인                    | 데이터 변경   |
| ---------------------- | ----------------- | -------------------------------- | ------------- |
| signup-to-collect      | 회원가입 → 로그인 | Collection                       | Create        |
| auth-flow              | 로그인/로그아웃   | -                                | -             |
| bookmark-flow          | 로그인 필요       | Bookmark                         | Create/Delete |
| collection-update-flow | 로그인 필요       | Collection                       | Update        |
| guest-search-flow      | 비로그인          | -                                | -             |
| recommendation-flow    | 비로그인 → 로그인 | Recommendation(R), Collection(C) | Create        |
| filter-pagination-flow | 로그인 필요       | Bookmark, Collection             | - (읽기만)    |
| reset-password-flow    | 비로그인          | Auth                             | -             |

### 병렬 실행 그룹 (4개)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         병렬 실행 가능 그룹                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────┐ │
│  │    Group A      │  │    Group B      │  │    Group C      │  │ Group D │ │
│  │  비인증 테스트   │  │  북마크 도메인   │  │  수집 도메인     │  │ 복합    │ │
│  ├─────────────────┤  ├─────────────────┤  ├─────────────────┤  ├─────────┤ │
│  │ guest-search    │  │ auth-flow       │  │ signup-collect  │  │ filter  │ │
│  │ reset-password  │  │ bookmark-flow   │  │ collection-upd  │  │ recomm  │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────┘ │
│         ↓                    ↓                    ↓                  ↓      │
│    독립 실행 가능        독립 실행 가능        독립 실행 가능      독립 가능   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### Group A: 비인증 테스트 (완전 독립)

**특징**: 로그인 없이 실행, 데이터 변경 없음

| 파일                          | 설명                            | 의존성          |
| ----------------------------- | ------------------------------- | --------------- |
| `guest-search-flow.spec.ts`   | 비로그인 검색, 로그인 유도 확인 | 없음            |
| `reset-password-flow.spec.ts` | 비밀번호 재설정 플로우          | Auth API 모킹만 |

**병렬 가능 이유**:

- 인증 상태를 사용하지 않음
- 데이터 CRUD 없음 (읽기/모킹만)

---

### Group B: 인증 + 북마크 도메인

**특징**: 로그인 필요, Bookmark 테이블 사용

| 파일                    | 설명                   | 의존성          |
| ----------------------- | ---------------------- | --------------- |
| `auth-flow.spec.ts`     | 로그인/로그아웃 테스트 | Auth 상태       |
| `bookmark-flow.spec.ts` | 북마크 CRUD            | Bookmark 테이블 |

**병렬 가능 이유**:

- 각 파일이 독립적인 mock 세션 사용
- Bookmark와 Collection은 서로 다른 테이블
- 같은 그룹 내에서도 병렬 가능 (서로 다른 기능 테스트)

---

### Group C: 수집 도메인

**특징**: 로그인 필요, Collection 테이블 사용

| 파일                             | 설명                   | 의존성            |
| -------------------------------- | ---------------------- | ----------------- |
| `signup-to-collect.spec.ts`      | 회원가입 → 수집 (기존) | Collection Create |
| `collection-update-flow.spec.ts` | 수집 카페 수정         | Collection Update |

**병렬 가능 이유**:

- 각 파일이 서로 다른 mock 데이터 사용
- Create와 Update는 서로 다른 카페 ID 대상
- 독립적인 인증 세션

---

### Group D: 복합 테스트

**특징**: 여러 도메인 조회 또는 복합 플로우

| 파일                             | 설명                      | 의존성                           |
| -------------------------------- | ------------------------- | -------------------------------- |
| `recommendation-flow.spec.ts`    | 추천 조회 → 로그인 → 수집 | Recommendation(R), Collection(C) |
| `filter-pagination-flow.spec.ts` | 필터링/페이지네이션       | Bookmark, Collection (읽기만)    |

**병렬 가능 이유**:

- 주로 읽기 작업
- recommendation의 수집은 별도 mock 사용자
- 필터 테스트는 기존 mock 데이터 조회만

---

### Playwright 설정 권장사항

```typescript
// playwright.config.ts
export default defineConfig({
  // 파일 단위 병렬 실행 (기본값)
  fullyParallel: true,

  // 각 테스트 파일은 독립적인 브라우저 컨텍스트 사용
  use: {
    // 각 테스트마다 새로운 컨텍스트
    contextOptions: {
      storageState: undefined, // 세션 공유 안 함
    },
  },

  // Worker 수 설정 (그룹 수에 맞춤)
  workers: process.env.CI ? 1 : 4, // 로컬에서 4개 병렬
});
```

---

### 테스트 파일 구조 (병렬 그룹 반영)

```
tests/e2e/core-flow/
├── group-a-unauthenticated/     # 비인증 (병렬 가능)
│   ├── guest-search.spec.ts
│   └── reset-password.spec.ts
│
├── group-b-bookmark/            # 북마크 도메인 (병렬 가능)
│   ├── auth-flow.spec.ts
│   └── bookmark-crud.spec.ts
│
├── group-c-collection/          # 수집 도메인 (병렬 가능)
│   ├── signup-to-collect.spec.ts  # 기존
│   └── collection-update.spec.ts
│
└── group-d-composite/           # 복합 테스트 (병렬 가능)
    ├── recommendation.spec.ts
    └── filter-pagination.spec.ts
```

---

## 요약

- **현재**: 1개 코어플로우 (회원가입 → 수집)
- **제안**: 7개 코어플로우 추가
- **총**: 8개 코어플로우로 주요 사용자 여정 커버
- **예상 테스트 케이스**: 약 30개 이상
- **병렬 그룹**: 4개 그룹으로 분류, 모든 그룹 병렬 실행 가능
