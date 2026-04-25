# Zustand 분석 체크리스트

Phase 2(정밀 분석)와 Phase 3(베스트 프랙티스 감사)에서 이 체크리스트를 순서대로 실행한다.
각 항목에 PASS / WARN / FAIL 판정을 내리고, 근거를 구체적으로 기술한다.

---

## Section 1: 구독 최적화

리렌더 성능에 가장 직접적인 영향을 미치는 영역이다. Zustand에서 성능 문제의 대부분은 불필요한 리렌더에서 비롯된다.

### 1.1 슬라이스 선택 패턴 사용 여부

```
검사 방법:
1. store 훅의 모든 호출부를 검색한다
2. 각 호출이 selector 함수를 전달하는지 확인한다

판정:
- PASS: 모든 컴포넌트에서 슬라이스 선택 사용
- WARN: 80% 이상 슬라이스 선택, 일부 전체 구독 존재
- FAIL: 50% 미만 슬라이스 선택, 또는 핵심 컴포넌트에서 전체 구독

감사 포인트:
✅ useStore(state => state.field) — 최적
✅ useStore(state => state.action) — 액션 선택도 OK
⚠️ const { a, b } = useStore() — 구조분해지만 전체 구독 (위험!)
⚠️ useStore(state => ({ a: state.a, b: state.b })) — 매 렌더마다 새 객체 생성
❌ useStore() — 전체 구독, 리렌더 폭탄
❌ const store = useStore(); store.field — 전체 구독 후 필드 접근
```

### 1.2 다중 슬라이스 구독 시 useShallow 사용 여부

```
검사 방법:
1. selector가 객체/배열을 반환하는 호출을 찾는다
2. useShallow로 감싸고 있는지 확인한다

판정:
- PASS: 다중 슬라이스 구독 시 모두 useShallow 사용, 또는 다중 슬라이스 구독 없음
- WARN: 일부 다중 슬라이스에서 useShallow 미사용
- FAIL: 다수의 다중 슬라이스에서 useShallow 미사용

참고:
- useShallow import 출처: 'zustand/react/shallow' (v5+) 또는 'zustand/shallow' (v4)
- 대안: 각 필드를 개별 selector로 분리하는 것도 유효한 해결책
```

### 1.3 getState() 외부 접근 패턴

```
검사 방법:
1. useStore.getState() 호출을 찾는다
2. 호출 위치가 React 렌더 사이클 외부인지 확인한다

판정:
- PASS: getState()가 이벤트 핸들러, 유틸 함수, 다른 store 액션 내부에서만 사용
- WARN: getState()가 컴포넌트 본문(render path)에서 사용
- FAIL: getState()가 useEffect 내에서 구독 없이 사용 (stale 데이터 위험)

이유:
getState()는 호출 시점의 스냅샷을 반환할 뿐 구독하지 않는다.
렌더 사이클 내에서 사용하면 최신 상태를 반영하지 못할 수 있다.
```

---

## Section 2: Store 설계

### 2.1 단일 책임 원칙 (SRP)

```
검사 방법:
1. 각 store의 상태 필드를 의미적 그룹으로 분류한다
2. 서로 다른 도메인의 상태가 한 store에 섞여 있는지 확인한다

판정:
- PASS: 각 store가 하나의 명확한 도메인을 담당
- WARN: 일부 store에 2개 이상의 도메인이 혼재하나, 소규모
- FAIL: 하나의 store가 3개 이상의 무관한 도메인을 포함 (God Store)

예시:
- 좋음: useAuthStore (인증), useUIStore (UI 상태), useCartStore (장바구니)
- 나쁨: useAppStore (인증 + UI + 장바구니 + 설정 + ...)
```

### 2.2 상태 vs 파생값 분리

```
검사 방법:
1. store에 다른 필드로부터 계산 가능한 값이 저장되어 있는지 찾는다
2. 예: items[]가 있는데 itemCount도 별도 저장

판정:
- PASS: 파생 가능한 값이 store에 저장되지 않음
- WARN: 파생값이 1-2개 있으나 성능상 이유(비싼 계산)가 있음
- FAIL: 불필요하게 파생값을 store에 동기화하여 관리

권장:
파생값은 selector에서 계산하거나 useMemo로 처리한다.
```

### 2.3 불필요한 전역 상태

```
검사 방법:
1. store의 각 상태를 소비하는 컴포넌트 수를 확인한다
2. 단 하나의 컴포넌트에서만 사용되는 상태를 식별한다

판정:
- PASS: 모든 전역 상태가 2개 이상의 컴포넌트에서 공유됨
- WARN: 일부 상태가 1개 컴포넌트에서만 사용되나, persist 등 이유가 있음
- FAIL: 여러 상태가 1개 컴포넌트 전용이며, 로컬 state로 충분함

이유:
전역 store는 모든 구독자에게 영향을 미치므로, 공유되지 않는 상태는
컴포넌트 로컬 state(useState)로 관리하는 것이 렌더 범위를 줄인다.
```

---

## Section 3: 미들웨어

### 3.1 persist partialize 적절성

```
검사 방법:
1. persist를 사용하는 store에서 partialize 옵션을 확인한다
2. 모든 상태가 localStorage에 저장될 필요가 있는지 검토한다

판정:
- PASS: persist 사용 store가 partialize로 필요한 필드만 저장
- WARN: persist를 사용하나 partialize 미설정 (전체 상태 저장)
- FAIL: persist + 전체 저장 + 불필요하거나 민감한 데이터 포함

점검 포인트:
- 임시 UI 상태 (모달 열림, 로딩 중)가 persist되고 있지 않은가?
- 큰 배열/객체가 불필요하게 persist되어 localStorage 용량을 소모하지 않는가?
```

### 3.2 민감 데이터 persist 제외

```
검사 방법:
1. persist 대상에 아래 민감 데이터가 포함되는지 확인한다:
   - Session / Token (access_token, refresh_token)
   - 비밀번호
   - API Key
   - 개인정보 (PII)

판정:
- PASS: 민감 데이터가 persist에서 명시적으로 제외됨 (partialize)
- WARN: persist를 사용하나 민감 데이터 포함 여부가 불분명
- FAIL: 민감 데이터가 localStorage에 평문으로 저장됨

보안 참고:
localStorage는 XSS 공격 시 쉽게 읽을 수 있다.
Session, token은 httpOnly cookie로 관리하거나, store에 저장 시 persist 제외 필수.
```

### 3.3 미들웨어 스택 순서

```
검사 방법:
1. create()() 에 전달된 미들웨어의 중첩 순서를 확인한다
2. 올바른 순서인지 검증한다

올바른 순서 (바깥→안쪽):
persist(devtools(immer(store)))

판정:
- PASS: 미들웨어 순서가 올바름
- WARN: 미들웨어를 1개만 사용하여 순서 문제 없음
- FAIL: immer가 persist보다 바깥에 위치하는 등 순서 오류
```

---

## Section 4: 타입 안전성

### 4.1 Interface 정의 및 export

```
검사 방법:
1. 각 store에 TypeScript interface/type이 정의되어 있는지 확인한다
2. create<T>()에 제네릭이 전달되는지 확인한다
3. interface가 export되는지 확인한다

판정:
- PASS: 모든 store에 interface 정의 + export + create<T> 적용
- WARN: interface는 있으나 일부 export 누락
- FAIL: interface 없이 create() 사용 (타입 추론에만 의존)
```

### 4.2 액션 파라미터 타입

```
검사 방법:
1. 액션 함수의 파라미터에 명시적 타입이 있는지 확인한다
2. any 타입 사용 여부를 검사한다

판정:
- PASS: 모든 액션 파라미터에 명시적 타입 지정
- WARN: 일부 간단한 setter에서 타입 추론 의존 (큰 문제 아님)
- FAIL: any 타입 사용, 또는 복잡한 파라미터에 타입 누락
```

---

## Section 5: 아키텍처

### 5.1 Client/Server State 경계

```
검사 방법:
1. Zustand store에 서버 데이터(API 응답)가 직접 저장되는 경우를 찾는다
2. TanStack Query 등 서버 상태 관리 도구와의 역할 중복을 확인한다

판정:
- PASS: Zustand는 클라이언트 상태만 관리, 서버 데이터는 별도 도구 사용
- WARN: 일부 서버 데이터가 Zustand에 저장되나, 캐시 목적으로 합리적
- FAIL: 서버 데이터를 Zustand에 저장하고 수동 동기화 (stale 위험)

이유:
서버 데이터는 캐시/무효화/재검증이 필요하다. 이는 TanStack Query 같은
서버 상태 도구의 영역이며, Zustand에서 수동으로 관리하면 데이터 불일치가 발생한다.
```

### 5.2 Cross-store 커플링

```
검사 방법:
1. store A의 액션에서 storeB.getState() 또는 storeB.setState()를 호출하는지 확인
2. 순환 참조 여부를 확인 (A→B→A)
3. 커플링의 깊이를 측정 (직접 vs 체인)

판정:
- PASS: cross-store 참조 없음, 또는 1-2건의 합리적인 통합 액션
- WARN: 3-5건의 cross-store 참조, 리팩토링으로 줄일 여지 있음
- FAIL: 순환 참조 발생, 또는 과도한 cross-store 커플링 (6건 이상)

대안:
- 통합 액션이 필요하면 별도의 orchestration 함수로 분리
- 또는 관련 상태를 하나의 store로 병합 검토
```

---

## Section 6: 네이밍 컨벤션

### 6.1 Store 훅 네이밍

```
검사 방법:
1. store export 이름이 use[Domain]Store 패턴을 따르는지 확인한다

판정:
- PASS: 모든 store가 use[Domain]Store 패턴
- WARN: 대부분 일관되나 1-2개 예외
- FAIL: 네이밍 패턴이 불일치하거나 도메인을 유추할 수 없음
```

### 6.2 Interface 네이밍 (프로젝트 컨벤션)

```
검사 방법:
1. store interface가 프로젝트의 네이밍 컨벤션을 따르는지 확인한다
2. 프로젝트 CLAUDE.md 또는 .eslintrc에 정의된 규칙 참조

판정:
- PASS: 프로젝트 컨벤션 (예: I- 접두사) 일관 적용
- WARN: 대부분 일관되나 1-2개 예외
- FAIL: 컨벤션 미적용
```
