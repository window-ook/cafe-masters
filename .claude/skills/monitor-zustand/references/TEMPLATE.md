# Zustand 분석 리포트 템플릿

아래 템플릿을 그대로 따라 `.claude/reports/zustand-report.md`를 생성한다.
`{{변수}}`는 분석 결과로 치환한다. 섹션이 해당 없으면 "해당 없음"으로 표기한다.

---

```markdown
# Zustand 분석 리포트

> 프로젝트: {{프로젝트명}} | 분석일: {{YYYY-MM-DD}} | 브랜치: {{브랜치명}}

---

## 1. 요약 대시보드

| 지표 | 값 |
|------|-----|
| Store 총 수 | {{store_count}} |
| 상태 필드 총 수 | {{total_state_fields}} |
| 액션 총 수 | {{total_actions}} |
| persist 사용 Store | {{persist_count}} / {{store_count}} |
| partialize 사용 Store | {{partialize_count}} / {{persist_count}} |
| 소비자 (컴포넌트 + 훅) | {{consumer_count}} |
| 슬라이스 선택 비율 | {{slice_select_ratio}}% ({{slice_select_count}} / {{total_subscriptions}}) |
| Cross-store 참조 | {{cross_store_count}}건 |
| BP 감사 결과 | PASS: {{pass}} / WARN: {{warn}} / FAIL: {{fail}} |

### 상태 관리 레이어 개요

> 이 섹션은 프로젝트의 전체 상태 관리 전략에서 Zustand의 위치를 보여준다.
> 다른 상태 관리 레이어(Server State, URL State)가 존재하면 함께 기술한다.

| 레이어 | 담당 도구 | 역할 |
|--------|-----------|------|
| Client State | Zustand | {{역할 요약}} |
| Server State | {{TanStack Query / SWR / 기타}} | {{역할 요약, 없으면 "사용하지 않음"}} |
| URL State | {{Next.js Router / React Router / 기타}} | {{역할 요약, 없으면 "사용하지 않음"}} |

---

## 2. Store별 상세 분석

{{각 store에 대해 아래 블록을 반복}}

### 2.{{N}}. `{{store명}}`

| 항목 | 내용 |
|------|------|
| **파일** | `{{경로}}` |
| **Interface** | `{{인터페이스명}}` |
| **미들웨어** | {{미들웨어 스택, 없으면 "없음"}} |
| **persist name** | `{{localStorage key}}` {{없으면 "persist 미사용"}} |
| **partialize** | {{저장 대상 필드, 없으면 "전체 저장" 또는 "persist 미사용"}} |
| **Cross-store 참조** | {{참조 대상 store 목록, 없으면 "없음"}} |

#### 상태 필드

| 필드명 | 타입 | 초기값 | 비고 |
|--------|------|--------|------|
| {{field}} | `{{type}}` | `{{initialValue}}` | {{비고, 예: "persist 제외", "보안 민감"}} |

#### 액션

| 액션명 | 파라미터 | 동작 요약 | 복합 액션 여부 |
|--------|----------|-----------|---------------|
| {{action}} | `{{params}}` | {{설명}} | {{yes/no}} |

#### 소비자 맵

| 소비자 | 타입 | 구독 방식 | 구독 필드/액션 |
|--------|------|-----------|---------------|
| `{{파일:라인}}` | Component / Hook | ✅ 슬라이스 / ⚠️ 다중 / ❌ 전체 / ℹ️ getState | {{필드 목록}} |

#### 잠재적 문제

{{문제가 있으면 bullet으로 나열, 없으면 "발견되지 않음"}}

---

## 3. 소비자 구독 맵

### 3.1 Store → Consumer 의존관계

\```mermaid
graph LR
    subgraph "Stores"
        {{store 노드들}}
    end
    subgraph "Hooks"
        {{hook 노드들}}
    end
    subgraph "Components"
        {{component 노드들}}
    end

    {{store}} -->|"field: 구독방식"| {{consumer}}
\```

### 3.2 Cross-store 의존관계

\```mermaid
graph LR
    {{storeA}} -->|"getState()"| {{storeB}}
\```

> {{cross-store 패턴에 대한 평가 코멘트. 해당 없으면 이 섹션 생략}}

### 3.3 구독 상세 테이블

| Consumer | Store | 구독 방식 | 필드/액션 | 리렌더 리스크 |
|----------|-------|-----------|-----------|--------------|
| {{consumer}} | {{store}} | {{방식}} | {{필드}} | {{높음/중간/낮음/없음}} |

---

## 4. 미들웨어 사용 현황

### 4.1 미들웨어 매트릭스

| Store | persist | devtools | immer | subscribeWithSelector | 기타 |
|-------|---------|----------|-------|-----------------------|------|
| {{store}} | {{✅/❌}} | {{✅/❌}} | {{✅/❌}} | {{✅/❌}} | {{기타 미들웨어}} |

### 4.2 persist 상세

| Store | localStorage key | partialize 대상 | 제외 필드 | version | migrate |
|-------|-----------------|----------------|-----------|---------|---------|
| {{store}} | `{{key}}` | {{필드 목록}} | {{제외 필드}} | {{버전, 없으면 "-"}} | {{있음/없음}} |

### 4.3 persist 보안 점검

{{보안 관련 발견사항. 예: Session/token 등 민감 데이터의 localStorage 저장 여부}}

---

## 5. 베스트 프랙티스 감사 결과

### 5.1 체크리스트

| # | 카테고리 | 항목 | 판정 | 상세 |
|---|----------|------|------|------|
| 1 | 구독 최적화 | 슬라이스 선택 패턴 사용 | {{PASS/WARN/FAIL}} | {{상세}} |
| 2 | 구독 최적화 | 다중 슬라이스 시 useShallow 사용 | {{PASS/WARN/FAIL}} | {{상세}} |
| 3 | 구독 최적화 | 전체 구독 (useStore()) 금지 | {{PASS/WARN/FAIL}} | {{상세}} |
| 4 | Store 설계 | 단일 책임 원칙 (SRP) | {{PASS/WARN/FAIL}} | {{상세}} |
| 5 | Store 설계 | 상태 vs 파생값 분리 | {{PASS/WARN/FAIL}} | {{상세}} |
| 6 | Store 설계 | 불필요한 전역 상태 없음 | {{PASS/WARN/FAIL}} | {{상세}} |
| 7 | 미들웨어 | persist partialize 적절성 | {{PASS/WARN/FAIL}} | {{상세}} |
| 8 | 미들웨어 | 민감 데이터 persist 제외 | {{PASS/WARN/FAIL}} | {{상세}} |
| 9 | 타입 안전성 | Interface 정의 및 export | {{PASS/WARN/FAIL}} | {{상세}} |
| 10 | 타입 안전성 | 액션 파라미터 타입 명시 | {{PASS/WARN/FAIL}} | {{상세}} |
| 11 | 아키텍처 | Client/Server State 경계 명확 | {{PASS/WARN/FAIL}} | {{상세}} |
| 12 | 아키텍처 | Cross-store 커플링 최소화 | {{PASS/WARN/FAIL}} | {{상세}} |
| 13 | 네이밍 | Store 훅 네이밍 컨벤션 (use[Domain]Store) | {{PASS/WARN/FAIL}} | {{상세}} |
| 14 | 네이밍 | Interface I- 접두사 및 export | {{PASS/WARN/FAIL}} | {{상세}} |

### 5.2 감사 요약

- **PASS**: {{count}}개 — 베스트 프랙티스 준수
- **WARN**: {{count}}개 — 개선 권장
- **FAIL**: {{count}}개 — 즉시 수정 필요

---

## 6. 리팩토링 계획서

### 우선순위: 높음 (즉시 수정)

#### 6.1 {{제목}}

- **카테고리**: {{구독 최적화 / Store 설계 / 미들웨어 / 타입 / 아키텍처}}
- **영향도**: {{높음/중간/낮음}}
- **관련 파일**: {{경로 목록}}

**Before:**
\```typescript
{{현재 코드}}
\```

**After:**
\```typescript
{{개선 코드}}
\```

**Why:** {{이 변경이 필요한 이유. 리렌더 횟수 감소, 보안 강화, 유지보수성 향상 등 구체적 근거}}

---

### 우선순위: 중간 (1-2주 내)

#### 6.{{N}} {{제목}}
{{동일 형식 반복}}

---

### 우선순위: 낮음 (장기 개선)

#### 6.{{N}} {{제목}}
{{동일 형식 반복}}

---

## 부록

### A. 분석 대상 파일 목록

| # | 파일 경로 | 카테고리 | 비고 |
|---|-----------|----------|------|
| 1 | {{경로}} | {{카테고리}} | {{비고}} |

### B. 용어 정의

| 용어 | 의미 |
|------|------|
| 슬라이스 선택 | `useStore(state => state.field)` — 해당 필드 변경 시에만 리렌더 |
| 전체 구독 | `useStore()` — store 내 어떤 상태가 바뀌어도 리렌더 |
| Cross-store | store A에서 store B의 `getState()` 직접 호출 |
| partialize | persist 시 일부 필드만 localStorage에 저장 |

```
