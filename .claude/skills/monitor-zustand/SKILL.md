---
name: monitor-zustand
description: Zustand store 사용 현황을 프로젝트 전체에서 자동 분석하여, store별 상세 분석 + 상태 의존관계 맵 + 리렌더 최적화 감사 + 미들웨어 사용 분석 + 리팩토링 계획서를 Markdown 리포트로 생성하는 스킬. "zustand 분석", "store 분석", "상태 관리 분석", "zustand 리뷰", "전역 상태 관리 현황", "zustand 리팩토링", "store 의존성 추적", "리렌더 최적화 점검" 등의 요청 시 사용. Zustand 관련 코드가 있는 프로젝트에서 코드 품질 점검, 리팩토링 전 현황 파악, store 구조 리뷰 시에도 반드시 사용.
---

# Monitor Zustand

Zustand store 사용 현황을 프로젝트 단위로 정밀 분석하고, 정형화된 Markdown 리포트를 생성하는 스킬.

## 스킬이 하는 일

1. **자동 탐색**: 프로젝트에서 Zustand store 파일과 소비자 컴포넌트를 자동으로 찾음
2. **Store 분석**: 각 store의 상태/액션 구조, 미들웨어 사용, 타입 정의를 파싱
3. **소비자 추적**: 어떤 컴포넌트가 어떤 store의 어떤 슬라이스를 구독하는지 추적
4. **리렌더 최적화 감사**: 전체 구독, 누락된 슬라이스 선택 등 성능 안티패턴 탐지
5. **Cross-store 의존성 분석**: store 간 `getState()` 호출 등 암묵적 커플링 탐지
6. **리팩토링 계획서**: 우선순위별 개선 항목 + before/after 코드 예시

## 출력물

- `.claude/reports/zustand-report.md` — 정형화된 분석 리포트 (`references/TEMPLATE.md` 템플릿 사용)

## 사전 조건

리포트를 저장하기 전에 출력 디렉토리가 존재하는지 확인한다.
없으면 생성한다:

```bash
mkdir -p .claude/reports
```

---

## 실행 절차

### Phase 1: 탐색 및 데이터 수집

이 Phase는 분석에 필요한 파일을 빠르게 수집하는 단계다.
Glob과 Grep 도구를 적극 활용하여 효율적으로 탐색한다.

#### Step 1.1 — 파일 탐색

프로젝트 루트에서 Zustand 관련 파일을 자동 탐색한다.

```
탐색 전략 (이 순서대로 실행하면 가장 효율적):

1단계 — Store 정의 파일 찾기:
   Glob: **/stores/**/*.ts, **/store/**/*.ts
   → create( 또는 createStore( 가 있는 파일이 store 정의

2단계 — 소비자 찾기:
   Grep: store의 export 이름 (예: useUIStore, useFilterStore)을 검색
   → import하는 모든 .ts/.tsx 파일이 소비자

3단계 — 외부 접근 찾기:
   Grep: .getState() 또는 .setState( 패턴 검색
   → store 외부에서의 직접 접근을 포착

탐색 대상 import 패턴:
- zustand
- zustand/middleware (persist, devtools, immer 등)
- zustand/shallow (deprecated) 또는 useShallow
```

> **주의**: 소비자 파일 탐색 시 Supabase, TanStack Query 등 다른 라이브러리의 import가 함께 보여도
> 이 스킬의 분석 범위는 Zustand에 한정한다. 다른 라이브러리 관련 스킬을 트리거하지 않는다.

#### Step 1.2 — 분류

탐색된 파일을 아래 카테고리로 분류한다:

| 카테고리 | 판별 기준 |
|----------|-----------|
| `STORE_DEFINITION` | `create(` 또는 `createStore(` 사용 |
| `BARREL_EXPORT` | 여러 store를 re-export하는 index 파일 |
| `CONSUMER_COMPONENT` | store 훅을 import하여 JSX에서 사용하는 `.tsx` 파일 |
| `CONSUMER_HOOK` | store 훅을 import하여 사용하는 커스텀 훅 `.ts` 파일 |
| `MIDDLEWARE_CONFIG` | persist, devtools, immer 등 미들웨어 설정 포함 |
| `TYPE_DEFINITION` | store의 interface/type만 별도 정의한 파일 |

### Phase 2: 정밀 분석

#### Step 2.1 — Store 구조 분석

각 store를 읽고 아래 정보를 추출한다:

```
추출 항목:
1. Store 이름 및 export 방식 (named export, default export)
2. Interface/Type 이름과 정의 위치
3. 상태(State) 필드 목록 — 이름, 타입, 초기값
4. 액션(Action) 목록 — 이름, 파라미터, 내부 로직 요약
5. 미들웨어 스택 — 적용 순서 (바깥→안쪽)
6. persist 설정: name, partialize, storage, version, migrate
7. Cross-store 참조: 다른 store의 getState() 호출 여부
8. 복합 액션: 여러 상태를 동시에 변경하는 액션 식별
```

#### Step 2.2 — 소비자 분석

store를 소비하는 모든 파일에서 아래 정보를 추출한다:

```
추출 항목:
1. 어떤 store의 어떤 필드/액션을 가져오는지
2. 구독 방식:
   - ✅ 슬라이스 선택: useStore(state => state.field) — 최적
   - ⚠️ 다중 슬라이스: useStore(state => ({ a: state.a, b: state.b })) — useShallow 필요
   - ❌ 전체 구독: useStore() 또는 const { a, b } = useStore() — 리렌더 위험
   - ℹ️ 외부 접근: useStore.getState() — React 렌더 사이클 외부 (이벤트 핸들러 등)
3. import 경로: barrel(index.ts) 경유 vs 직접 import
```

#### Step 2.3 — 의존관계 맵 구축

store 간, 그리고 store→소비자 간 의존관계를 정리한다:

```
의존관계 유형:
1. Store → Store: store A의 액션에서 storeB.getState() 호출
2. Store → Consumer: component/hook에서 store를 import하여 구독
3. Consumer → Store (역방향 쓰기): component에서 store.setState() 또는 액션 호출
4. Middleware chain: persist → devtools → immer 등 미들웨어 적용 순서
```

### Phase 3: 베스트 프랙티스 감사

`references/analysis-checklist.md` 체크리스트를 순서대로 실행한다.
각 항목에 PASS / WARN / FAIL 판정을 내린다.

zustand 스킬이 설치되어 있으면 `Skill` 도구로 호출하여 최신 베스트 프랙티스를 참조 문서로 활용한다.
설치되어 있지 않으면 `references/analysis-checklist.md`의 내장 체크리스트만으로 감사를 진행한다.

### Phase 4: 리포트 생성

> **중요**: Phase 1~3의 분석이 모두 완료된 후에 리포트를 생성한다.
> 분석 도중에 리포트를 쓰기 시작하지 않는다.

#### Step 4.1 — 리포트 작성

`references/TEMPLATE.md`를 읽고, 그 구조를 그대로 따라 `.claude/reports/zustand-report.md`를 생성한다.

작성 규칙:
- `{{변수}}`를 Phase 1~3의 분석 결과로 치환한다
- 해당 없는 섹션은 "해당 없음"으로 표기한다
- Mermaid 다이어그램의 노드 이름은 실제 store/component 이름을 사용한다
- 리팩토링 계획서의 before/after 코드는 실제 프로젝트 코드를 기반으로 작성한다

리포트 구조 (TEMPLATE.md 순서):
1. 요약 대시보드 (정량 지표)
2. Store별 상세 분석
3. 소비자 구독 맵 (Mermaid 다이어그램)
4. 미들웨어 사용 현황
5. 베스트 프랙티스 감사 결과
6. 리팩토링 계획서 (우선순위, before/after 코드)

#### Step 4.2 — 리포트 저장 확인

리포트 저장 후 사용자에게 요약을 제공한다:
- BP 감사 PASS/WARN/FAIL 카운트
- 가장 우선순위 높은 리팩토링 항목 1~2개
- 리포트 파일 경로

---

## 레퍼런스 파일 가이드

| 파일 | 용도 | 언제 읽는가 |
|------|------|-------------|
| `references/TEMPLATE.md` | 리포트 출력 템플릿 | Phase 4 — 리포트 작성 시 |
| `references/analysis-checklist.md` | 분석/감사 체크리스트 | Phase 2, 3 — 분석 및 감사 시 |

---

## 주의사항

- 분석 대상 파일을 **읽기만** 한다. 절대 수정하지 않는다.
- 리팩토링 계획서의 코드 예시는 제안일 뿐, 자동 적용하지 않는다.
- 대규모 프로젝트(store 10개 이상)에서는 Explore 에이전트를 활용하여 병렬 탐색한다.
- 이전 리포트가 존재하면 덮어쓰기 전에 사용자에게 확인한다.
- store의 `persist` name과 실제 localStorage key를 대조하여 불일치가 있으면 경고한다.
- 이 스킬은 Zustand 분석에만 집중한다. 소비자 파일에서 다른 라이브러리(TanStack Query, Supabase 등)의 코드가 보여도 해당 라이브러리의 분석 스킬을 추가로 트리거하지 않는다.
- 프로젝트에 CLAUDE.md가 있으면 네이밍 컨벤션, 코드 스타일 규칙을 읽어서 감사 기준에 반영한다.
