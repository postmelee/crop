# Task #12 구현계획서

수행계획서: [`task_m020_12.md`](task_m020_12.md)
GitHub Issue: [#12](https://github.com/postmelee/crop/issues/12)
마일스톤: M020

## 단계 개요

| Stage | 제목 | 주요 산출 | 검증 |
|---|---|---|---|
| 1 | edge auto-scroll helper 기준 작성 | `src/content/overlay/edge-scroll.ts`, `tests/content/overlay/edge-scroll.test.ts` | typecheck/test/grep/diff |
| 2 | drag selection scroll loop 구현 | `src/content/overlay/crop-overlay.ts`, 필요 시 `src/content/overlay/state-machine.ts` | build/typecheck/test/grep/diff |
| 3 | 회귀 테스트와 fixture/smoke 보강 | 관련 `tests/**/*.test.ts`, `tests/fixtures/phase6_edge_cases.html`, smoke note | build/typecheck/test/fixture grep/diff |
| 4 | Chrome smoke와 UX 보정 | 코드/테스트 보정, `mydocs/working/task_m020_12_stage4.md` | manual 또는 CDP smoke/build/test/diff |
| 5 | README, 최종 보고서, 통합 검증 | `README.md`, `mydocs/report/task_m020_12_report.md`, `mydocs/orders/20260529.md` | build/typecheck/test/grep/diff/status |

## 문서 위치 확인

수행계획서의 "문서 위치 판단"과 실제 Stage 산출물 경로를 다음과 같이 일치시킨다. 이번 task에서는 공식 제품 문서 루트(`docs/`, `specs/`, `site/`, `website/`, `adr`)를 새로 만들지 않는다.

| 파일 | 수행계획서상 선택 위치 | Stage 산출물 경로 | 일치 여부 | 비고 |
|---|---|---|---|---|
| `README.md` | 루트 `README.md` | `README.md` | OK | 로컬 smoke 기대 결과만 좁게 갱신 |
| `mydocs/plans/task_m020_12.md` | `mydocs/plans/` | `mydocs/plans/task_m020_12.md` | OK | 수행계획서 |
| `mydocs/plans/task_m020_12_impl.md` | `mydocs/plans/` | `mydocs/plans/task_m020_12_impl.md` | OK | 구현계획서 |
| `mydocs/working/task_m020_12_stage{N}.md` | `mydocs/working/` | `mydocs/working/task_m020_12_stage{N}.md` | OK | 단계 보고서 |
| `mydocs/report/task_m020_12_report.md` | `mydocs/report/` | `mydocs/report/task_m020_12_report.md` | OK | 최종 보고서 |

## Stage 1 — edge auto-scroll helper 기준 작성

### 산출물

신규:

- `src/content/overlay/edge-scroll.ts`
- `tests/content/overlay/edge-scroll.test.ts`
- `mydocs/working/task_m020_12_stage1.md`

수정:

- 필요 시 `src/content/overlay/crop-overlay.ts` import 후보만 준비하지 않는다. Stage 1은 helper와 테스트 기준에 한정한다.

### 변경 내용

- viewport edge 근처 pointer 위치를 scroll delta로 변환하는 순수 helper를 작성한다.
- helper 입력은 pointer client 좌표, viewport 크기, edge threshold, max step 또는 speed 계열 상수로 제한한다.
- helper 출력은 `{ x, y }` scroll delta와 활성 여부를 명시한다.
- viewport 내부 안전 영역에서는 `0,0`을 반환하고, 상/하/좌/우 edge 근처에서는 방향별 delta를 반환한다.
- 모서리 근처에서는 x/y delta가 동시에 나올 수 있게 한다.
- 0 또는 음수 viewport, edge threshold가 지나치게 큰 경우 등 방어 테스트를 작성한다.
- Firefox 원본 감각은 참고하되 Chrome content script에서 안정적인 작은 정수 step으로 시작한다.

### 검증

```bash
npm run typecheck
npm run test
rg "edge|scroll|drag|viewport|page|delta" src/content/overlay tests/content/overlay mydocs/plans/task_m020_12.md
git diff --check
```

### 커밋

```text
Task #12 Stage 1: edge auto-scroll helper 기준 작성
```

## Stage 2 — drag selection scroll loop 구현

### 산출물

신규:

- `mydocs/working/task_m020_12_stage2.md`

수정:

- `src/content/overlay/crop-overlay.ts`
- 필요 시 `src/content/overlay/state-machine.ts`
- 필요 시 `tests/content/overlay/state-machine.test.ts`
- `tests/content/overlay/edge-scroll.test.ts`

### 변경 내용

- drag selection 중 마지막 pointer client 좌표를 유지한다.
- pointer가 viewport edge 근처에 있으면 requestAnimationFrame 기반 auto-scroll loop를 시작한다.
- loop는 매 frame 다음 순서로 동작한다:
  - 최신 viewport 크기와 scroll 위치를 읽는다.
  - helper로 scroll delta를 계산한다.
  - delta가 있으면 `window.scrollBy(delta.x, delta.y)`를 호출한다.
  - scroll 이후 최신 `scrollX`/`scrollY` 기준으로 마지막 pointer를 page 좌표로 변환한다.
  - `dragMove` 전이를 다시 적용해 selected rect를 page 좌표로 확장한다.
  - render를 호출해 highlight/mask를 갱신한다.
- delta가 0이면 loop를 중단한다.
- pointerup, Escape, Cancel, overlay remove, selected 상태 진입 시 loop를 중단한다.
- pointer가 edge에서 벗어나면 다음 pointermove 또는 loop frame에서 scroll이 멈추도록 한다.
- 기존 selected outside click reset suppression과 capture action 흐름은 변경하지 않는다.

### 검증

```bash
npm run build
npm run typecheck
npm run test
rg "requestAnimationFrame|cancelAnimationFrame|scrollBy|edge|dragging|dragMove" src/content/overlay tests/content/overlay
git diff --check
```

### 커밋

```text
Task #12 Stage 2: drag selection edge scroll loop 구현
```

## Stage 3 — 회귀 테스트와 fixture/smoke 보강

### 산출물

신규:

- 필요 시 `tests/content/overlay/edge-scroll-integration.test.ts`
- 필요 시 `/private/tmp/crop_task12_smoke_notes.md`
- `mydocs/working/task_m020_12_stage3.md`

수정:

- `tests/content/overlay/state-machine.test.ts`
- `tests/content/overlay/phase6-regression.test.ts`
- `tests/fixtures/phase6_edge_cases.html`

### 변경 내용

- 자동으로 검증 가능한 회귀 조건을 보강한다.
- 우선순위는 다음 순서다:
  - edge helper가 상/하/좌/우와 모서리 delta를 계산하는지
  - auto-scroll frame에서 마지막 pointer와 최신 scroll 위치로 page 좌표가 재계산되는지
  - 역방향 drag와 일반 drag rect 정규화가 깨지지 않는지
  - scroll loop cleanup 함수가 pointerup/cancel/remove에서 호출 가능한 구조인지
- 실제 Chrome scroll은 자동화가 불안정할 수 있으므로, fixture는 최소한 긴 세로 문서와 가로 overflow 대상이 확실히 보이도록 보강한다.
- 수동 smoke 절차에는 아래 시나리오를 포함한다:
  - 아래 edge로 드래그해 문서가 내려가는지
  - 위 edge로 드래그해 문서가 올라가는지
  - 오른쪽/왼쪽 edge로 드래그해 가로 overflow 영역이 움직이는지
  - pointerup 후 자동 스크롤이 멈추는지
  - Escape/Cancel 후 자동 스크롤이 남지 않는지

### 검증

```bash
npm run build
npm run typecheck
npm run test
rg "edge auto-scroll|scrollBy|horizontal|vertical|pointerup|Escape|Cancel|data-crop-fixture" tests/fixtures tests/content mydocs/working
git diff --check
```

### 커밋

```text
Task #12 Stage 3: edge auto-scroll 회귀 검증 보강
```

## Stage 4 — Chrome smoke와 UX 보정

### 산출물

신규:

- `mydocs/working/task_m020_12_stage4.md`

수정:

- 필요 시 `src/content/overlay/crop-overlay.ts`
- 필요 시 `src/content/overlay/edge-scroll.ts`
- 필요 시 관련 테스트 또는 fixture

### 변경 내용

- `npm run build` 후 Chrome unpacked extension에서 `dist/`를 reload한다.
- fixture 또는 대표 긴 문서에서 edge auto-scroll을 확인한다.
- 확인 항목:
  - bottom edge: 아래로 자동 스크롤
  - top edge: 위로 자동 스크롤
  - right/left edge: 가능한 fixture에서 가로 자동 스크롤
  - selected rectangle이 문서 page 좌표 기준으로 유지
  - pointerup 후 scroll loop 중단
  - Escape/Cancel 후 scroll loop 중단
  - click selection, 일반 drag selection, Copy/Save 기본 흐름 회귀 없음
- 자동화가 불안정하면 작업지시자에게 직접 smoke 지침을 제공하고 결과를 Stage 보고서에 반영한다.
- UX 보정은 속도/threshold/cleanup 같은 작은 조정에 한정한다. resize handles, full page, iframe 내부 스크롤은 구현하지 않는다.

### 검증

```bash
npm run build
npm run typecheck
npm run test
rg "edge|scroll|drag|Escape|Cancel|Copy|Save|debugger|<all_urls>" src tests README.md mydocs manifest.json
git diff --check
```

수동 시나리오:

- Chrome fixture smoke: bottom/top edge auto-scroll
- Chrome fixture smoke: left/right edge auto-scroll 가능 여부
- Chrome fixture smoke: pointerup/Escape/Cancel cleanup
- Chrome fixture smoke: Copy/Save 기본 흐름 회귀 확인

### 커밋

```text
Task #12 Stage 4: edge auto-scroll smoke와 UX 보정
```

## Stage 5 — README, 최종 보고서, 통합 검증

### 산출물

신규:

- `mydocs/report/task_m020_12_report.md`

수정:

- `README.md`
- `mydocs/orders/20260529.md`
- 필요 시 Stage 1~4 산출물의 작은 정정

### 변경 내용

- README의 Chrome unpacked extension 기대 결과에 drag selection edge auto-scroll 동작을 반영한다.
- 최종 보고서에 수용 기준별 검증 결과, 자동/수동 검증, 확인하지 못한 조합, 후속 항목을 기록한다.
- 오늘할일을 완료 상태로 갱신한다.
- PR 본문에서 참조할 수 있게 stage reports와 최종 보고서 링크를 정리한다.

### 검증

```bash
npm run build
npm run typecheck
npm run test
rg "edge auto-scroll|drag selection|Copy|Save|debugger|<all_urls>|#12" README.md mydocs src tests manifest.json
git diff --check
git status --short
```

### 커밋

```text
Task #12 Stage 5 + 최종 보고서: edge auto-scroll 구현 완료
```

## 검증

- 각 Stage 검증 명령은 단계 보고서 작성 전에 실행한다.
- 실패한 검증은 단계 완료로 처리하지 않는다.
- manual smoke가 현재 세션에서 자동화되지 않으면 작업지시자 직접 검증 지침과 결과를 Stage 보고서에 남긴다.
- 기능 추가가 필요한 실패는 구현계획서를 갱신하고 작업지시자 승인을 받거나 후속 이슈로 분리한다.
- 문서 위치가 수행계획서 판단과 달라지면 구현 전에 수행계획서 또는 구현계획서를 갱신하고 작업지시자 승인을 받는다.

## 커밋

- 단계 커밋은 단계 산출물과 `mydocs/working/task_m020_12_stage{N}.md`를 함께 묶는다.
- 커밋 메시지는 `Task #12 Stage {N}: {핵심 내용 요약}` 형식을 따른다.
- 최종 보고서 커밋은 `Task #12 Stage 5 + 최종 보고서: edge auto-scroll 구현 완료` 형식을 사용한다.

## 단계 의존성

- Stage 2는 Stage 1 helper API와 테스트가 고정된 뒤 진행한다.
- Stage 3은 Stage 2 scroll loop 구현과 기본 테스트가 통과한 뒤 진행한다.
- Stage 4는 Stage 3 회귀 테스트와 smoke 절차가 준비된 뒤 진행한다.
- Stage 5는 Stage 4 smoke 결과와 필요한 UX 보정이 완료된 뒤 진행한다.

## 위험과 대응

- **scroll loop 잔존**: pointerup/cancel/remove cleanup을 명시 함수로 모으고 Stage 2/3에서 grep과 테스트로 확인한다.
- **좌표 drift**: state에는 page 좌표만 저장하고, viewport 좌표는 render 직전에만 계산한다.
- **과도한 scroll 속도**: Stage 1에서 작은 step을 기본값으로 정하고 Stage 4 smoke에서 threshold/speed만 좁게 조정한다.
- **자동화 한계**: Chrome extension drag/scroll smoke가 불안정하면 작업지시자 수동 검증 절차와 결과를 Stage 보고서에 남긴다.
- **범위 초과**: full page capture, scroll stitching, resize handles, iframe 내부 스크롤은 이번 task에서 구현하지 않는다.
- **권한 회귀**: `debugger`, `<all_urls>` 권한은 추가하지 않는다. Stage 4/5 grep에서 확인한다.

## 승인 요청 사항

- 5단계 분할과 각 Stage 산출물/검증 명령 승인
- Stage 1에서 `edge-scroll.ts` helper를 먼저 만들고 테스트로 고정하는 것 승인
- Stage 2에서 drag 중 requestAnimationFrame 기반 scroll loop를 연결하는 것 승인
- Stage 4에서 Chrome smoke가 자동화되지 않으면 작업지시자 직접 확인 지침으로 보완하는 것 승인
- README 갱신은 Stage 5까지 보류하고 최종 동작 기준으로만 반영하는 것 승인
- `debugger`, `<all_urls>` 권한을 추가하지 않는 것 승인
