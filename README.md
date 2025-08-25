# Cafe Masters

<img src='https://github.com/user-attachments/assets/e042eb80-164e-4031-ba76-b3c129eea431' width='550' height='390' />

### 카페에 대한 평가를 카드로 수집하고 북마크, 추천 등록하는 지도 기반 플랫폼

평소에 카페를 자주 다니는 분들을 위해 만들었습니다!<br>
방문한 카페에 대한 정보를 메모장에 따로 저장하지 말고 카페 마스터즈에서 쉽게 관리해보세요😊<br>
뿐만 아니라 방문할 카페를 북마크 하실 수 있어요ㅎㅎ 개발자가 말아드리는 카페 추천도 있으니 놓치지 마세요!<br><br>

카페 마스터즈는 카페를 많이 모아 마스터가 되는 세계입니다. 카드를 많이 모아서 마스터가 되어보세요-v-<br>

## 📋 목차

- [🗓️ 개발 기간](#-개발-기간)
- [👤 체험 계정](#-체험-계정)
- [🎧 앱 다운로드 및 실행](#-앱-다운로드-및-실행)
- [🛠 기술 스택](#-기술-스택)
- [✨ 주요 기능](#-주요-기능)
- [📁 프로젝트 구조](#-프로젝트-구조)
- [🏗️ 시스템 설계](#️-시스템-설계)
- [🤺 스킬 포커스](#-스킬-포커스)
- [🤖 컨텍스트 엔지니어링](#-컨텍스트-엔지니어링)
- [⚡ 성능 최적화](#-성능-최적화)
- [📈 회고](#-회고)

## 🗓️ 개발 기간

### 2025.07.27 ~ 2025.08.08

지속적으로 코드 및 UI 개선 예정

## 👤 체험 계정

### Email, PW

- demouser@test.com
- 1234uio!

### 접속 링크

https://app.cafe-masters.co

## 🎧 앱 다운로드 및 로컬 실행

### Repository Clone
```
git clone https://github.com/window-ook/cafe-masters.git
```
### Execution Commands
```
pnpm install
pnpm dev
```

## 🛠 기술 스택

### Front-End

<div style='display:flex; align-items:center'>
    <img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=Next.js&logoColor=white"> 
    <img src="https://img.shields.io/badge/React.js-61DAFB?style=flat-square&logo=React&logoColor=black">
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white">
</div>
<div style='display:flex; align-items:center'>
    <img src="https://img.shields.io/badge/React Query-FF4154?style=flat-square&logo=reactquery&logoColor=white">
    <img src="https://img.shields.io/badge/Zustand-4a2c2a?style=flat-square&logo=zustand&logoColor=white">
    <img src="https://img.shields.io/badge/React Hook Form-EC5990?style=flat-square&logo=react-hook-form&logoColor=white">
    <img src="https://img.shields.io/badge/zod-3E67B1?style=flat-square&logo=zod&logoColor=white">
</div>
<div style='display:flex; align-items:center'>
    <img src="https://img.shields.io/badge/tailwindcss-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white">
    <img src="https://img.shields.io/badge/shadcn/ui-000000?style=flat-square&logo=shadcn/ui&logoColor=white">
    <img src="https://img.shields.io/badge/ReactToastify-FFFFFF?style=flat-square&logo=reacttoastify&logoColor=white">
    <img src="https://img.shields.io/badge/Lucide-F56565?style=flat-square&logo=lucide&logoColor=white">
</div>
<div style='display:flex; align-items:center'>
    <img src="https://img.shields.io/badge/PlayWright-1D8D22?style=flat-square&logo=playwright&logoColor=white">
</div>
<div style='display:flex; align-items:center'>
    <img src="https://img.shields.io/badge/ESLint-4B32C3?style=flat-square&logo=eslint&logoColor=white">
    <img src="https://img.shields.io/badge/Prettier-F7B93E?style=flat-square&logo=prettier&logoColor=red">
</div>

### BFF

<div style='display:flex; align-items:center'>
    <img src="https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white">
    <img src="https://img.shields.io/badge/Resend-000000?style=flat-square&logo=resend&logoColor=white">
</div>

### 외부 데이터
<div style='display:flex; align-items:center'>
    <img src="https://img.shields.io/badge/Kakao Map API-FFCD00?style=flat-square&logo=kakao&logoColor=black"> 
</div>

### CI/CD
<div style='display:flex; align-items:center'>
    <img src="https://img.shields.io/badge/Git Actions-2088FF?style=flat-square&logo=github&logoColor=white"> 
    <img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white"> 
</div>

## ✨ 주요 기능

### 📌 카페 검색

<div style='display:flex; flex-direction:column; gap:2px;'>
    <img src="https://github.com/user-attachments/assets/fe97c541-6354-45dd-84ad-5e46fe8ee0b4" width="700" height="364" />
    <img src="https://github.com/user-attachments/assets/85ed1823-42d0-4491-972d-5880b92c6202" width="700" height="364" />
</div>

원하는 카페를 찾으시나요? 카페의 이름을 검색해보세요.<br>
특정 카페가 아닌, 지역만 검색해도 안의 카페를 찾을 수 있어요.<br>
썸네일 이미지를 클릭하면 카카오 플레이스에서 제공하는 페이지로 이동할 수 있어요.<br>

<img src="https://github.com/user-attachments/assets/2490b05f-50b2-48e4-a964-edb58e637257" width="700" height="364" />

지인과 가기로 한 카페인가요? 북마크 해두시고 잊지 마세요!

<img  src="https://github.com/user-attachments/assets/54c9beb4-adce-4f02-9a7d-425894f303fb" width="700" height="364" />

카페를 갔다오셨나요? 카드로 수집하세요-V- 별점을 매겨주시면 별점에 따라 카드의 등급이 적용됩니다.
- 2점 이하: 노말, 3점: 실버, 4점: 골드, 5점: 에메랄드, 히든: ??

### 🗂️ 수집한 카페 모아보기

<img src="https://github.com/user-attachments/assets/fca1eec2-d81e-4eae-960e-56a4af616142" width="700" height="364" />

내가 여태 수집한 카드를 볼 수 있어요.<br>

<img src="https://github.com/user-attachments/assets/a75f872a-6cb4-4f54-a4ab-f48bd987216f" width="700" height="364" />

수집하면서 저장했던 메모의 내용이 담겨있으니, 필요할 때 기억해내기 좋겠죠?<br>

<img src="https://github.com/user-attachments/assets/f9833f3c-e31f-4745-848f-8f2253a45d5a" width="700" height="364" />

혹시 히든 카드를 찾으셨나요..? 히든 카드는 카페 이름 오른쪽에 'HIDDEN' 라벨이 표시되어있습니다:)

### 🔖 북마크 카페 모아보기

<img src="https://github.com/user-attachments/assets/f48e724e-ceeb-400a-89b4-bb17c093f4e1" width="700" height="364"/>

북마크 해뒀던 카페를 확인할 수 있어요.<br>
갈 마음이 사라진 곳이면 삭제하시면 됩니다.<br>
당연히 바로 수집할 수도 있습니다!

### 😁 추천 카페 모아보기

<img src="https://github.com/user-attachments/assets/046e3458-634c-4cba-b913-206ca1001e5f" width="700" height="364"/>

개발자가 특별히 추천하는 카페입니다! 제가 직접 방문했던 곳을 추천드려요.<br>

<img src="https://github.com/user-attachments/assets/9cab86a8-e247-4213-a232-b82db5287247" width="700" height="364"/>

카테고리 필터링을 사용해서 원하는 카페를 찾아서 구경해보세요.

### 🎖️ 콜렉션 티어 

<img src="https://github.com/user-attachments/assets/ed23ccfa-8c66-4d3f-b189-e805b6cc4fc8" width="600" height="420"/>

티어는 여러분이 모은 카드의 수에 따라 상승합니다.<br>
카페를 좋아하시는 분들은 금방 마스터가 되실 수 있을거에요😁

## 📁 프로젝트 구조
### 아키텍처 다이어그램

<img src="https://github.com/user-attachments/assets/fa8d23b6-0752-4b2c-8cd9-58068db78e34" width="798" height="436" />

### 왜 이렇게 설계했는지?

**카페 상세 정보 추출을 위한 BFF 구축**<br>
Kakao Map API에서 기본적으로 주어지는 정보는 극히 제한적이었습니다.<br>
따라서 썸네일, 영업 시간, 메뉴 등의 정보는 Playwright을 사용하여 추출했습니다.<br>
Next.js의 라우트 핸들러에서 바로 헤드리스 모드로 카카오 플레이스에 접속하는 접근법을 사용했습니다.<br>
dev 모드(로컬호스트)에서는 평균 1.67초로 데이터 조회가 가능했지만, Serverless 환경의 Vercel에서는 제한된 메모리 크기에 의해 평균 8.8초나 소요되었습니다.<br>
사용자 경험 실패에 가까운 응답 속도를 극복하기 위해, Express.js로 브라우저를 항시 열어두고 클라이언트에서 요청을 보내면 즉시 접속하여 데이터를 조회할 수 있도록 하여 시간을 2.5초까지 단축하였습니다.<br>

**최적화된 렌더링 구조**<br>
UI 컨테이너에서 동적으로 컴포넌트를 렌더링하는 컴포넌트 아키텍처를 설계했습니다.<br>
Tanstack Query의 훅을 사용하는 로직은 커스텀 훅으로 추상화했습니다. 비동기 로직을 컴포넌트의 비즈니스 로직과 격리시키고, 확장성과 유지보수성을 높였습니다.<br>
그리고 React Hook Form의 useForm으로 폼에서 input에 의한 상태 변경이 불필요한 컴포넌트 리렌더링을 일으키는 것을 방지했습니다.<br>
또한, zod로 타입 안전성과 코드 효율성이 높은 유효성 검증 스키마를 설계했습니다.<br>

### 디렉토리 구조: Feature Based

```
├── components/
│   ├── bookmark    # 북마크 카페
│   ├── collection  # 수집한 카페
│   ├── landing     # 랜딩페이지 하위 섹션
│   └── ...
│
├── hooks                 # 커스텀 훅
│   ├── kakao-map   # 카카오 플레이스 카페 상세 정보 조회
│   ├── supabase    # Supabase CRUD
│   └── ui          # UI 관련 상태 관리 (Zustand store)
│
└── ...
```

디렉토리는 역할 기반으로 분류되어 있습니다.<br>
이 방식은 컴포넌트나 훅, 함수, 타입 등 어떤 파일이든지 위치가 직관적이기 때문에 안정성과 확장성 면에서 매우 유리하고,<br>
Shell Container에서 Presenter만 조건부로 렌더링을 바꿔서 하게 되는 카페 마스터즈의 아키텍처와도 잘 맞는다고 생각했습니다.

## 🏗️ 시스템 설계

### Supabase 스키마(PostgreSQL)

```sql
-- 북마크 카페
bookmark {
    id: SERIAL PRIMARY KEY,
    user_id: UUID NOT NULL REFERENCES auth.users(id),
    name: VARCHAR NOT NULL,
    address: VARCHAR NOT NULL,
    phone_number: VARCHAR,
    image: VARCHAR NOT NULL,
    extra_images: TEXT,
    menus: TEXT,
    opening_time: VARCHAR,
    coordX: DECIMAL NOT NULL,
    coordY: DECIMAL NOT NULL,
    created_at: TIMESTAMPTZ DEFAULT NOW()
};

-- 수집한 카페
collection {
    id: SERIAL PRIMARY KEY,
    user_id: UUID NOT NULL REFERENCES auth.users(id),
    name: VARCHAR NOT NULL,
    address: VARCHAR NOT NULL,
    phone_number: VARCHAR,
    image: VARCHAR NOT NULL,
    extra_images: TEXT,
    opening_time: VARCHAR,
    coordX: DECIMAL NOT NULL,
    coordY: DECIMAL NOT NULL,
    categories: TEXT,
    ratings: INTEGER NOT NULL CHECK (ratings >= 1 AND ratings <= 5),
    comment: VARCHAR NOT NULL,
    pros: VARCHAR NOT NULL,
    cons: VARCHAR NOT NULL,
    eaten_menus: VARCHAR NOT NULL,
    created_at: TIMESTAMPTZ DEFAULT NOW(),
    updated_at: TIMESTAMPTZ
};

-- 추천 카페
recommendation {
    id: SERIAL PRIMARY KEY,
    name: VARCHAR NOT NULL,
    address: VARCHAR NOT NULL,
    phone_number: VARCHAR,
    image: VARCHAR NOT NULL,
    extra_images: TEXT,
    menus: TEXT,
    opening_time: VARCHAR,
    coordX: DECIMAL NOT NULL,
    coordY: DECIMAL NOT NULL,
    categories: VARCHAR NOT NULL,
    created_at: TIMESTAMPTZ DEFAULT NOW()
};

--사용자 정보
user {
    user_id: UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    admin: BOOLEAN NOT NULL DEFAULT false,
    created_at: TIMESTAMPTZ DEFAULT NOW()
};
```

총 4개의 테이블로 구성했습니다.<br>
모든 테이블은 RLS(Row Level Security) 정책을 적용하여, 모든 CRUD에 대한 외부의 비인가 요청을 방어합니다.

### 비동기 데이터 플로우

**Supabase Read**
```
컴포넌트 → useQuery 커스텀 훅 → 서버 액션 → Supabase
```

**Supabase Create, Update, Delete**

```
컴포넌트 → useMutation 커스텀 훅 → 서버 액션 → Supabase
```

**카페 상세 정보 조회**

```
컴포넌트 → useQuery 커스텀 훅 → 서버 액션 → Express.js
```

## 🤺 스킬 포커스

### 1. Shell Container-Presenter 컴포넌트 아키텍처

<img width="434" height="305" src="https://github.com/user-attachments/assets/87037119-e35a-460c-b790-896b06e8f018" />

> 지도 기반 서비스에 최적화된 컴포넌트 아키텍처

카페 마스터즈는 직관적이고 몰입감 있는 UX를 제공하는 것이 중요한 지도 기반 서비스입니다.
따라서 SideBar와 SlidingDrawer가 UI 컨테이너를 전담하는 구조가 목적에 매우 적합하다고 생각했습니다. 
두 컴포넌트는 경로별 동적 렌더링을 담당하는 Shell Container로서의 역할을 하고, 각 경로의 Feature을 책임지는 Presenter 컴포넌트가 조건부로 활성화되어 렌더링하는 구조로 아키텍처를 설계했습니다.<br>

- Shell Container: UI 레이아웃과 네비게이션을 담당하는 SideBar, SlidingDrawer
    - 일관된 레이아웃으로 Presenter를 표시하는 것에 집중
- Presenter: 비동기 데이터 페칭, 서버/클라이언트 상태 동기화, UI 렌더링에 집중
    - 추상화된 비동기 커스텀 훅을 사용하는 비즈니스 로직 컴포넌트

결론적으로 유지보수성과 확장성이 높은 구조를 구현했습니다.

### 2. State on 3 Layers

<img width="383" height="227" src="https://github.com/user-attachments/assets/f3f8f7d2-8c73-4089-bb5d-ba44495c0124" />

> 컴포넌트 아키텍처에 맞춘 상태의 계층적 관리

서버 데이터 동기화와 UI 상태 관리의 관심사를 분리하면서, 경로별 동적 렌더링에 최적화된
상태 관리 구조를 설계하여 관리 복잡성을 낮추고 성능 문제를 방지하고자 했습니다.<br>

- URL 상태
    - usePathMatcher 훅으로 경로를 상태로 추상화하여 Shell Container에 제공합니다.

- 서버 상태
    - Tanstack Query의 '-Query'로 끝나는 훅으로 fetch와 데이터 캐싱을 합니다. useMutation으로 CRUD 작업 시 invalidateQueries로 캐시를 무효화하고 refetch합니다.

- 클라이언트 상태
    - Zustand는 보일러 플레이트 코드를 줄이고, 전역에서 동기화가 쉽게 이루어지게 했습니다. 영속성이 필요한 상태(UI 유지)는 persist 미들웨어로 부여했습니다.

### 3. ErrorBoundary를 이용한 선언적 에러 처리

`@components/shared/ErrorBoundaryWrapper.tsx`

```tsx
'use client';

import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '@/components/shared/ErrorFallback';
import { ReactNode } from 'react';

interface IErrorBoundaryWrapper {
    featureName: string;
    message: string;
    children: ReactNode;
    onError?: (error: Error) => void;
}

export function ErrorBoundaryWrapper({
    featureName,
    message,
    children,
    onError
}: IErrorBoundaryWrapper) {
    return (
        <ErrorBoundary
            FallbackComponent={(props) => (
                <ErrorFallback
                    {...props}
                    featureName={featureName}
                    message={message}
                />
            )}
            onError={onError || ((error, errorInfo) => {
                console.error(`${featureName} 에러:`, error, errorInfo);
            })}
        >
            {children}
        </ErrorBoundary>
    );
}
```

`ErrorBoundaryWrapper`는 에러가 터진 기능과, 맞춤 메세지를 나타내는 커스텀 Wrapper Component입니다. <br>
선언형 프로그래밍을 사용하여 Shell Container에 에러 UI를 제공하기 위해 구현했습니다.<br>

```tsx
// @providers/Providers.tsx
{!shouldHideComponents && (
    <ErrorBoundaryWrapper
        featureName="사이드바"
        message="사이드바를 불러오는 중 에러가 발생했습니다."
    >
      <SideBar />
    </ErrorBoundaryWrapper>
)}

// @components/shared/SideBar.tsx
<ErrorBoundaryWrapper
    featureName="상세 정보"
    message="상세 정보를 불러오는 중 에러가 발생했습니다."
>
    <SlidingDrawer />
</ErrorBoundaryWrapper>
```

### 4. zod를 활용한 유효성 검사

`@schema/**`

ex) `@schema/auth.ts`

```tsx

/**
 * 로그인 폼 스키마
 * @description 이메일 형식과 비밀번호 최소 길이 검증
 */
export const signInFormSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요.')
    .email('유효하지 않은 이메일 형식입니다.'),
  password: z
    .string()
    .min(6, '비밀번호는 최소 6자 이상 입력해야 합니다.'),
});

/**
 * 회원가입 폼 스키마
 * @description 이메일 형식과 비밀번호 최소 길이 및 포함 문자 검증
 */
export const signUpFormSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요.')
    .email('유효하지 않은 이메일 형식입니다.'),
  password: z
    .string()
    .min(6, '비밀번호는 최소 6자 이상 입력해야 합니다.')
    .regex(
      /^(?=.*[a-zA-Z])(?=.*\d).*$/,
      '비밀번호는 영문과 숫자를 포함해야 합니다.'
    ),
});

/**
 * OTP 인증 폼 스키마
 * @description 6자리 인증 코드 검증
 */
export const otpFormSchema = z.object({
  otp: z
    .string()
    .min(6, '인증 코드는 6자리여야 합니다.')
    .max(6, '인증 코드는 6자리여야 합니다.')
    .regex(/^\d{6}$/, '인증 코드는 숫자만 입력 가능합니다.'),
});

/** 비밀번호 재설정 요청 폼 스키마
 * @description 이메일 형식 검증
 */
export const resetPasswordRequestSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요')
    .email('올바른 이메일 형식을 입력해주세요'),
});

...
```

zod의 메서드 체이닝으로 직관적이고 효율적인 유효성 검증 로직을 구현했습니다.<br>
React Hook Form의 useForm과 함께 조합하여 폼의 상태 관리와 유효성 검증, 에러 핸들링까지 담당합니다.

### 5. Async Surf 패턴 일부 적용

**경로 팩토리** `@lib/paths.ts`<br>
하드코딩을 배제하고 참조를 강제하는 의도로 외부/내부 API 경로를 중앙화하여 응집성을 높여, 가독성과 유지보수성 및 보안을 높인 팩토리입니다.<br><br>

**쿼리 팩토리** `@queries/**`<br>
React Query를 사용하면서 queryKey 또한 하드코딩으로 관리하지 않고 Feature별로 중앙화하였습니다.<br>
FSD에서 추천하는 queryKey 관리 방식입니다. queryKey를 오타로 추가하거나, 파라미터를 올바르지 않게 사용하는 실수를 방지합니다.<br><br>

**비동기 로직 추상화 커스텀 훅** `@hooks/**`<br>
컴포넌트에서 비동기 로직을 격리하여 추상화하는 목적으로 만들어진 커스텀 훅입니다.<br>

## 🤖 컨텍스트 엔지니어링

LLM 에이전트를 개발 어시스트에 활용했습니다.<br>
Claude Code와 Gemini CLI를 사용했으며, 주 용도는 아래와 같습니다.

### Claude Code

- 컨텍스트 기반 컴포넌트 구현 및 리팩토링
- Markdown으로 만들어진 서브 에이전트, 커스텀 커맨드를 활용
- 테스트 시나리오 작성

### Gemini CLI

- 코드 패턴 적합성, 보안 수준 점검, 컴포넌트 응집도 & 결합도 평가
- Google AI Studio 리포지토리 연결(PR 생성시 코드 리뷰 및 개선 포인트 제공)

## ⚡ 성능 최적화

### 렌더링 최적화

- **계산 최적화 (useMemo)**
    - 카페 상세 정보 점진적 렌더링 (`SearchCafeDetail.tsx`)
    - 추천 카페 카테고리 필터링 (`useRecommendationCafes.ts`)
    - 수집한 카페 복합 필터링 및 무한 스크롤 데이터 합성 (`useCollectionCafes.ts`)
    - 북마크 카페 필터링 및 페이지네이션 계산 (`useBookmarkCafes.ts`)
    - 경로 매칭 결과 캐싱 (`usePathMatcher.ts`)

- **이벤트 핸들러 최적화 (useCallback)**
    - 카페 클릭 핸들러 재사용 최적화 (`useCafeClick.ts`)
    - 복잡한 라우팅 로직과 상태 업데이트를 포함한 핸들러 메모이제이션

- **컴포넌트 최적화 (React.forwardRef)**
    - InputField 컴포넌트에서 ref 전달 최적화로 React Hook Form과의 원활한 통합   

- **카카오맵 최적화 (useRef) `KakaoMap.tsx`**
    - 이전 데이터와 현재 데이터 비교로 불필요한 마커 재생성 방지, 지도 위 불필요한 마커 누적 방지
    - prevKeywordRef로 이전 키워드와 비교하여 중복 검색 방지
    - 새 InfoWindow 생성 전 이전 것을 확실히 정리

### 폰트 로딩 최적화

- **next/font/local 사용**: Pretendard Variable + DungGeunMo
- **Display Swap**: 폰트 로딩 중 시스템 폰트로 대체하여 FOUT 방지(시스템 폰트가 Fallback)
- **Preload**: 중요 폰트 우선 로딩으로 CLS 최소화

### 번들 최적화

- **dynamic import**: 당장 보이지 않는 컴포넌트는 `ssr: false`와 함께 레이지 로드

### 이미지 최적화

- **캐싱과 저용량 확장자**CDN 업로드, `.avif` 파일 사용

## 📑 회고

### 1. 새로운 시도 & 새롭게 알게 된 것

>**새로운 시도**

Shell Container-Presenter 패턴<br>
CSS 3D 효과 구현<br>
웹 크롤링 최적화<br>

>**새롭게 알게 된 것**

- Zustand의 state를 불러서 사용할 때는 개별 상태/액션을 선택하는 것이 더 효율적
    - 스토어의 다른 상태가 아무리 많이 변경되어도, 참조한 상태/액션 자체의 참조값이 바뀌지 않으면 컴포넌트가 리렌더링되지 않습니다.
- KakaoMap에서 마커 생성과 삭제, InfoWindow 생성과 삭제는 useRef를 사용해서 제어가 필수적
- Serverless 환경의 한계는 명확
    - Puppeteer, Playwright의 headless 브라우저를 사용하여 카페 상세 정보를 추출하는 것은 Vercel에서 매우 느림
    - dev: 평균 1.5초, Vercel: 평균 8.8초

### 2. 앞으로 더 도전해 볼만한 것들

- 마커 클릭시 상세 정보가 표시되게 만들기
- 3D 카드 고도화, 인터랙티브 애니메이션을 갖춘 쇼룸 기능 만들기
- 카드 획득시 안내 다이얼로그 플로팅
