# Task #13 구현계획서

수행계획서: [`task_m020_13.md`](task_m020_13.md)
GitHub Issue: [#13](https://github.com/postmelee/crop/issues/13)
마일스톤: M020

## 단계 개요

| Stage | 제목 | 주요 산출 | 검증 |
|---|---|---|---|
| 1 | selected transform helper와 상태 기준 작성 | `src/content/overlay/selection-transform.ts`, `tests/content/overlay/selection-transform.test.ts`, `state-machine` 테스트 | typecheck/test/grep/diff |
| 2 | pointer 기반 move/resize interaction 연결 | `crop-overlay.ts`, `state-machine.ts`, pointer hit-test 테스트 | build/typecheck/test/grep/diff |
| 3 | selected controls UI와 action box 보정 | `crop-template.ts`, `crop-overlay.css`, `positioning.ts`, placement 테스트 | build/typecheck/test/selector grep/diff |
| 4 | keyboard 조정과 size 표시 결정 | keydown 처리, keyboard transform 테스트, size label 또는 제외 기록 | build/typecheck/test/smoke/diff |
| 5 | 통합 회귀, smoke, 문서와 최종 보고 | `README.md`, fixture/test 보강, 최종 보고서, 오늘할일 | build/typecheck/test/smoke/grep/diff/status |

## 문서 위치 확인

수행계획서의 "문서 위치 판단"과 실제 Stage 산출물 경로를 다음과 같이 일치시킨다. 이번 task에서는 공식 제품 문서 루트(`docs/`, `specs/`, `site/`, `website/`, `adr`)를 새로 만들지 않는다.

| 파일 | 수행계획서상 선택 위치 | Stage 산출물 경로 | 일치 여부 | 비고 |
|---|---|---|---|---|
| `README.md` | 루트 `README.md` | `README.md` | OK | 로컬 smoke 기대 결과만 좁게 갱신 |
| `mydocs/plans/task_m020_13.md` | `mydocs/plans/` | `mydocs/plans/task_m020_13.md` | OK | 수행계획서 |
| `mydocs/plans/task_m020_13_impl.md` | `mydocs/plans/` | `mydocs/plans/task_m020_13_impl.md` | OK | 구현계획서 |
| `mydocs/working/task_m020_13_stage{N}.md` | `mydocs/working/` | `mydocs/working/task_m020_13_stage{N}.md` | OK | 단계 보고서 |
| `mydocs/report/task_m020_13_report.md` | `mydocs/report/` | `mydocs/report/task_m020_13_report.md` | OK | 최종 보고서 |

## Stage 1 — selected transform helper와 상태 기준 작성

### 산출물

신규:

- `src/content/overlay/selection-transform.ts`
- `tests/content/overlay/selection-transform.test.ts`
- `mydocs/working/task_m020_13_stage1.md`

수정:

- `src/content/overlay/state-machine.ts`
- `tests/content/overlay/state-machine.test.ts`

### 변경 내용

- selected rectangle 조정에 필요한 handle 방향 타입을 정의한다.
- resize handle은 `north`, `south`, `east`, `west`, `north-east`, `north-west`, `south-east`, `south-west` 8방향으로 고정한다.
- transform helper는 시작 `PageRect`, 시작 pointer page 좌표, 현재 pointer page 좌표, 최소 selection 크기 옵션을 받아 normalized `PageRect`를 반환한다.
- move helper는 시작 `PageRect`와 pointer delta를 page 좌표로 적용한다.
- resize helper는 반대편 edge를 anchor로 유지하고, 최소 크기보다 작아질 때 해당 방향 edge를 clamp한다. Stage 1 기본안은 edge 뒤집힘을 허용하지 않는다.
- keyboard 기본안은 수행계획서의 후보를 확정한다:
  - Arrow: 1px move
  - Shift+Arrow: 10px move
  - Alt/Option+Arrow: 해당 방향 edge 1px resize
  - Alt/Option+Shift+Arrow: 해당 방향 edge 10px resize
- state-machine에는 selected 조정을 표현할 수 있는 최소 상태/이벤트 구조를 추가하되, DOM pointer 연결은 Stage 2로 넘긴다.
- 기존 drag selection의 `draggingReady`/`dragging` 전이와 selected outside reset 전이를 깨지 않도록 회귀 테스트를 유지한다.

### 검증

```bash
npm run typecheck
npm run test
rg "selected|resize|move|keyboard|handle|selection-transform" src/content/overlay tests/content/overlay mydocs/plans/task_m020_13.md mydocs/plans/task_m020_13_impl.md
git diff --check
```

### 커밋

```text
Task #13 Stage 1: selected transform helper와 상태 기준 작성
```

## Stage 2 — pointer 기반 move/resize interaction 연결

### 산출물

신규:

- `mydocs/working/task_m020_13_stage2.md`

수정:

- `src/content/overlay/crop-overlay.ts`
- `src/content/overlay/state-machine.ts`
- `tests/content/overlay/state-machine.test.ts`
- 필요 시 `tests/content/overlay/phase6-regression.test.ts`

### 변경 내용

- selected 상태에서 pointerdown hit-test 순서를 action button, resize handle, selected highlight 내부, document outside 순서로 정리한다.
- handle pointerdown은 resize 상태를 시작하고, pointermove마다 Stage 1 helper로 selected rectangle을 갱신한다.
- selected highlight 내부 pointerdown은 move 상태를 시작하고, pointermove마다 Stage 1 helper로 selected rectangle을 이동한다.
- move/resize pointerup은 selected 상태로 확정한다.
- move/resize 시작 시 document click suppression을 걸어 pointerup 뒤 click이 outside reset으로 이어지지 않게 한다.
- selected 영역 밖 pointerdown/click은 기존 #5 Stage 10의 reset 동작을 유지한다.
- 초기 drag selection edge auto-scroll loop와 selected 조정 loop가 섞이지 않도록 `lastDragPointer`/edge scroll cleanup 조건을 확인한다.
- action button pointer/click은 기존 Copy/Save/Cancel 동작을 유지한다.

### 검증

```bash
npm run build
npm run typecheck
npm run test
rg "adjust|resize|move|pointerdown|pointermove|pointerup|resetSelection|suppress" src/content/overlay tests/content/overlay
git diff --check
```

### 커밋

```text
Task #13 Stage 2: selected pointer move와 resize 연결
```

## Stage 3 — selected controls UI와 action box 보정

### 산출물

신규:

- `mydocs/working/task_m020_13_stage3.md`

수정:

- `src/content/overlay/crop-template.ts`
- `src/content/overlay/crop-overlay.css`
- `src/content/overlay/crop-overlay.ts`
- `src/content/overlay/positioning.ts`
- `tests/content/overlay/positioning.test.ts`

### 변경 내용

- selected rectangle 위에 8방향 handle DOM을 추가한다.
- handle은 충분한 hit area를 가지되 시각적으로 과도하게 두드러지지 않게 selected border 주변에 배치한다.
- handle과 selected highlight에는 방향별 cursor를 지정한다.
- move 가능한 selected highlight 내부에는 move cursor를 적용한다.
- action box는 Firefox식 dark rounded toolbar에 가깝게 spacing, grouping, border radius, shadow, typography를 보정한다.
- Copy/Save와 Cancel grouping을 시각적으로 구분하되 button label은 현재 사용자-facing 동작과 일치시킨다.
- `positioning.ts`의 action box placement는 기존 below/above flip과 좌우 clamp를 유지하고, 작은 viewport에서 toolbar가 접근 가능한 위치로 남는지 테스트를 추가한다.
- selected rectangle이 viewport 일부만 보이는 경우에는 visible intersection 기준으로 controls/action box를 렌더링한다. viewport 밖 전체인 경우에는 controls를 숨기고 action box는 viewport edge margin 안에서 가능한 fallback 위치를 검토한다.

### 검증

```bash
npm run build
npm run typecheck
npm run test
rg "crop-selection|crop-resize|crop-handle|crop-actions|cursor|border-radius|box-shadow" src/content/overlay tests/content/overlay
git diff --check
```

### 커밋

```text
Task #13 Stage 3: selected controls UI와 action box 보정
```

## Stage 4 — keyboard 조정과 size 표시 결정

### 산출물

신규:

- `mydocs/working/task_m020_13_stage4.md`

수정:

- `src/content/overlay/crop-overlay.ts`
- `src/content/overlay/state-machine.ts`
- `src/content/overlay/crop-template.ts`
- `src/content/overlay/crop-overlay.css`
- `tests/content/overlay/state-machine.test.ts`
- 필요 시 `tests/content/overlay/selection-transform.test.ts`

### 변경 내용

- selected 상태에서 Arrow keyboard 조정을 구현한다.
- keyboard event target이 action button 또는 입력 가능한 element인 경우 버튼 사용성을 우선하고 selection 조정을 적용하지 않는다.
- move key는 selected rectangle 전체를 page 좌표에서 이동한다.
- Alt/Option resize key는 해당 방향 edge만 이동한다.
- Shift는 step을 10px로 키운다.
- keyboard 조정 후 action box와 handle 위치를 즉시 다시 렌더링한다.
- selection size 표시는 Stage 4에서 최종 결정한다.
  - 구현할 경우 selected rectangle 근처에 `width x height` badge를 추가하고 small viewport에서 action box와 겹치지 않게 한다.
  - 제외할 경우 README와 Stage 보고서에 "MVP에서는 controls 조작성 우선, size badge는 후속 parity 항목"으로 기록한다.
- keyboard 조정과 pointer 조정이 같은 helper를 공유하도록 중복 계산을 줄인다.

### 검증

```bash
npm run build
npm run typecheck
npm run test
rg "Arrow|shiftKey|altKey|keyboard|size|badge|selected" src/content/overlay tests/content/overlay mydocs/plans/task_m020_13_impl.md
git diff --check
```

수동 또는 자동 smoke:

- selected 상태에서 Arrow move
- selected 상태에서 Shift+Arrow 빠른 move
- selected 상태에서 Alt/Option+Arrow resize
- action button focus 상태에서 Enter/Space와 Tab 사용성 회귀 없음

### 커밋

```text
Task #13 Stage 4: keyboard 조정과 size 표시 결정
```

## Stage 5 — 통합 회귀, smoke, 문서와 최종 보고

### 산출물

신규:

- 필요 시 resize/move smoke fixture 또는 `/private/tmp/crop_task13_smoke_notes.md`
- `mydocs/report/task_m020_13_report.md`

수정:

- `README.md`
- `tests/fixtures/phase6_edge_cases.html`
- `tests/content/overlay/phase6-regression.test.ts`
- `mydocs/orders/20260530.md`
- 필요 시 Stage 1~4 산출물의 작은 정정

### 변경 내용

- click-selected-then-resize, selected move, keyboard 조정, action box placement smoke를 수행한다.
- 기존 Copy/Save capture 전 overlay 숨김 정책이 유지되는지 확인한다.
- selected outside reset, 일반 drag selection, edge auto-scroll, Escape/Cancel cleanup 회귀를 확인한다.
- `manifest.json` 권한이 `debugger`, `<all_urls>` 없이 유지되는지 확인한다.
- README의 MVP/후속 범위와 로컬 smoke 기대 결과를 #13 완료 상태에 맞게 갱신한다.
- 최종 보고서에 수용 기준별 결과, 자동 검증, 수동/시나리오 검증, 검증 한계, 후속 항목을 기록한다.
- 오늘할일을 완료 상태로 갱신한다.
- PR 본문에서 참조할 stage reports와 최종 보고서 링크를 정리한다.

### 검증

```bash
npm run build
npm run typecheck
npm run test
rg "resize|move|keyboard|Copy|Save|Cancel|debugger|<all_urls>|#13" README.md mydocs src tests manifest.json
git diff --check
git status --short
```

수동 또는 CDP smoke:

- selected 상태에서 8방향 resize
- selected highlight 내부 drag move
- click selection 직후 resize
- selected 영역 밖 클릭 reset
- action box 하단/좌우 flip/clamp
- keyboard move/resize
- Copy/Save 결과에 overlay controls가 포함되지 않음

### 커밋

```text
Task #13 Stage 5 + 최종 보고서: selected resize/move 구현 완료
```

## 검증

- 각 Stage 검증 명령은 단계 보고서 작성 전에 실행한다.
- 실패한 검증은 단계 완료로 처리하지 않는다.
- manual smoke가 현재 세션에서 자동화되지 않으면 작업지시자 직접 검증 지침과 결과를 Stage 보고서에 남긴다.
- 기능 추가가 필요한 실패는 구현계획서를 갱신하고 작업지시자 승인을 받거나 후속 이슈로 분리한다.
- 문서 위치가 수행계획서 판단과 달라지면 구현 전에 수행계획서 또는 구현계획서를 갱신하고 작업지시자 승인을 받는다.

## 커밋

- 단계 커밋은 단계 산출물과 `mydocs/working/task_m020_13_stage{N}.md`를 함께 묶는다.
- 커밋 메시지는 `Task #13 Stage {N}: {핵심 내용 요약}` 형식을 따른다.
- 최종 단계 커밋은 `Task #13 Stage 5 + 최종 보고서: selected resize/move 구현 완료` 형식을 사용한다.

## 단계 의존성

- Stage 2는 Stage 1의 transform helper, 상태 이벤트, keyboard 기본안이 확정된 뒤 진행한다.
- Stage 3은 Stage 2의 pointer hit-test와 상태 전이가 안정화된 뒤 진행한다.
- Stage 4는 Stage 1 helper와 Stage 3 controls 렌더링 구조가 확정된 뒤 진행한다.
- Stage 5는 Stage 1~4 검증과 단계 보고서 승인이 끝난 뒤 진행한다.

## 위험과 대응

- **pointer/click sequence 충돌**: Stage 2에서 hit-test 우선순위와 click suppression 회귀 테스트를 추가해 selected 내부 조정이 outside reset으로 이어지지 않게 한다.
- **좌표 drift**: Stage 1 helper는 page 좌표만 입력/출력하고, Stage 2 렌더링 직전에만 viewport 좌표로 변환한다.
- **작은 selection handle 충돌**: Stage 3에서 handle hit area와 action box placement를 함께 검증하고, 필요한 경우 최소 selection 크기를 helper 상수로 조정한다.
- **keyboard shortcut 충돌**: Stage 4에서 selected 상태와 비입력 target에만 keyboard 조정을 제한한다.
- **시각 parity 범위 초과**: Stage 3 변경 범위를 selected controls와 action toolbar로 제한하고, prompt/mode toolbar의 unrelated restyle은 하지 않는다.
- **자동화 한계**: helper/state/positioning은 자동 테스트로 고정하고, 실제 extension drag는 Stage 보고서에 수동 또는 CDP smoke 결과로 남긴다.

## 승인 요청 사항

- Stage 1에서 `selection-transform.ts` helper와 테스트를 먼저 만들고 상태 기준을 고정하는 것 승인
- Stage 2에서 pointer hit-test와 selected move/resize interaction을 연결하는 것 승인
- Stage 3에서 selected controls DOM/CSS와 action box parity 보정을 함께 처리하는 것 승인
- Stage 4에서 keyboard 기본안을 Arrow/Shift/Alt 조합으로 구현하고 size badge는 Stage 4에서 최종 결정하는 것 승인
- Stage 5에서 README, 최종 보고서, 오늘할일 완료, 통합 smoke를 묶어 마무리하는 것 승인
