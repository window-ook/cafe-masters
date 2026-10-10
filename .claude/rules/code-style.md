---
paths:
  - "**/*.{ts,tsx}"
---

# My Code Style

## Single Line if & function

if, 화살표 함수의 스코프 내부 실행문이 single-lint일 경우, {}를 절대 사용하지 않습니다.

```typescript
// if
if (!res.ok) return { success: false, message: '에러가 발생했습니다.' };

// arrow function
const yell = () => console.log('hi!');
```

## Declare Interface

- `I-`를 접두사로 항상 붙입니다.
- `-Props`와 같은 접미사는 절대 사용하지 않습니다.
- 반드시 export를 해야 합니다.

```typescript
export interface ICar {
  name: string;
  brnad: 'Chevolet';
}
```

## Tailwind CSS `className` order priority

| 순위 | 종류           | 속성                                                      |
| ---- | -------------- | --------------------------------------------------------- |
| 1    | 포지션         | absolute, relative, fixed, top, left…                     |
| 2    | 레이아웃       | w-, h-, size-, min-w-[], min-h-[], overflow-hiddden, …    |
| 3    | 공백           | m-, mx-, my-, p, px-, py-…                                |
| 4    | 외곽 효과      | border-[], border-color-[], shadow-[]…                    |
| 5    | 배경색         | bg-, opacity-                                             |
| 6    | Flex Box, Grid | flex, grid, flex-col, grid-cols-, gap-, justify-, items-… |
| 7    | 폰트           | text-, font-, whitespace-, leading-, …                    |
| 8    | 애니메이션     | animate-                                                  |
| 9    | 트랜지션       | transition-, duration-, ease-…                            |
| -    | 조건           | hover:, group-hover:, focus:                              |

- `hover:` `group-hover:` `focus:` `active:` 등은 해당 속성 바로 뒤에 위치
- w-와 h-가 동일하면 size- 사용

## Path Factory

src: `lib/paths.ts`

API 경로와 이미지 경로는 타입 단언을 사용하여 중앙에서 관리합니다. 경로를 하드코딩하지 않고 항상 이 파일에서 import합니다.
이미지는 Supabase Storage에 올리고 `IMAGE_PATHS`에 등록합니다. (`.avif` 우선)

```typescript
const INTERNAL_PATHS = {
  PRODUCT_DETAIL: `/api/product/detail/${id}`,
  // ...
} as const;

const EXTERNAL_PATHS = {
  USER_MANUAL: 'https://velog.io/@window-ook/cafe-masters',
  // ...
} as const;
```

```typescript
const IMAGE_PATHS = {
  LOGO_IMG:
    'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters//card_logo.avif',
  // ...
} as const;
```

## Path Alias

절대 경로 import는 `@/`를 사용합니다. (예: `import { X } from '@/components/Y'`)
`utils/...`처럼 `@/` 없이 시작하는 경로나 `'.'` 같은 상대 경로는 사용하지 않습니다.

## Message Constants

src: `utils/constants/messages.ts`

토스트 메시지와 콘솔 로그는 하드코딩하지 않고 이 파일의 상수를 사용합니다.

- `TOAST_SUCCESS`, `TOAST_ERROR`, `TOAST_WARN`: 사용자 노출 메시지
- `CONSOLE_LOG`, `CONSOLE_ERROR`: 개발자 디버깅

## Memoization

React Compiler가 켜져 있으므로 `useMemo`·`useCallback`·`memo`를 새로 추가하지 않습니다.

- 예외: effect 의존성으로 쓰여 참조가 유지되어야 하는 값. 커스텀 훅의 반환값은 사용처의 effect가 의존할 수 있습니다. (예: `usePathMatcher`, `useCafeClick`, `hooks/supabase`의 목록 훅은 `KaKaoMap.tsx`의 effect가 의존)
- 기존 메모이제이션을 제거할 때는 그 값이 다른 파일의 의존성 배열에 쓰이는지 먼저 확인합니다.
