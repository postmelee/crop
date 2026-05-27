# Task #5 구현계획서

수행계획서: [`task_m010_5.md`](task_m010_5.md)
GitHub Issue: [#5](https://github.com/postmelee/crop/issues/5)
마일스톤: M010

## 단계 개요

| Stage | 제목 | 주요 산출 | 검증 |
|---|---|---|---|
| 1 | overlay module shell과 Shadow DOM template 분리 | `src/content/inject.ts`, `src/content/overlay/crop-overlay.ts` | `npm run build`, `npm run typecheck` |
| 2 | hover highlight와 Firefox-derived helper 연결 | `src/content/overlay/crop-overlay.ts`, `tests/content/overlay/positioning.test.ts` | `npm run test`, hover helper grep |
| 3 | selection 상태와 action buttons 배치 | `src/content/overlay/state-machine.ts`, `src/content/overlay/crop-template.ts` | `npm run test`, selection/buttons grep |
| 4 | README smoke 절차와 통합 검증 | `README.md`, `mydocs/report/task_m010_5_report.md` | `npm run build`, `npm run typecheck`, `npm run test`, Chrome smoke |
| 5 | Firefox식 시각 정렬과 눈동자 포인터 추적 | `src/content/overlay/crop-template.ts`, `src/content/overlay/crop-overlay.css`, `src/content/overlay/positioning.ts` | `npm run build`, `npm run typecheck`, `npm run test`, CDP smoke |
| 6 | Firefox 원본 UI 자산과 drag selection 포팅 | `src/firefox-derived/screenshots-ui-assets.ts`, `src/content/overlay/state-machine.ts`, `src/content/overlay/crop-overlay.ts` | `npm run build`, `npm run typecheck`, `npm run test`, CDP drag smoke |
| 7 | Firefox UI parity 세부 보정 | `src/firefox-derived/screenshots-ui-assets.ts`, `src/content/overlay/crop-overlay.css` | `npm run build`, `npm run typecheck`, `npm run test`, CDP smoke |

## 문서 위치 확인

수행계획서의 "문서 위치 판단"과 실제 Stage 산출물 경로를 다음과 같이 일치시킨다. 이번 task에서는 `docs/`, `specs/`, `site/`, `website/`, `adr/` 같은 공식 제품 문서 루트를 만들지 않는다.

| 파일 | 수행계획서상 선택 위치 | Stage 산출물 경로 | 일치 여부 | 비고 |
|---|---|---|---|---|
| `README.md` | 루트 `README.md` | `README.md` | OK | Chrome unpacked extension smoke 기대 결과를 overlay UI 기준으로 갱신 |
| 공식 제품 문서 루트 | 해당 없음 | 해당 없음 | OK | 이번 task는 제품 사용자 문서 루트를 생성하지 않음 |

## Stage 1 — overlay module shell과 Shadow DOM template 분리

### 산출물

신규:

- `src/content/overlay/crop-overlay.ts`
- `src/content/overlay/crop-template.ts`
- `src/content/overlay/crop-overlay.css`
- `src/content/overlay/state-machine.ts`
- `src/vite-env.d.ts` 또는 CSS raw import를 위한 동등한 type declaration
- `mydocs/working/task_m010_5_stage1.md`

수정:

- `src/content/inject.ts`
- `vite.config.ts`
- 필요 시 `tsconfig.json`

### 변경 내용

- 기존 `src/content/inject.ts`의 inline overlay stub을 bootstrap으로 축소한다.
- overlay host id `__crop_root__`, `data-crop-root`, 중복 실행 flash, Escape teardown, close/reopen 동작은 유지한다.
- Shadow DOM 내부 DOM 구조와 CSS를 `src/content/overlay/`로 분리한다.
- CSS는 `crop-overlay.css?raw` import 또는 동등한 방식으로 content bundle에 inline한다.
- import 기반 content bundle이 반복 주입 시 top-level lexical declaration 충돌을 만들지 않도록 `vite.config.ts`에 content script output wrapper plugin을 추가하거나 동등한 bundling 방식을 적용한다.
- Stage 1 UI는 dim layer, top-right visible action placeholder, cancel/close affordance까지의 shell에 한정한다. hover helper 연결과 selected buttons는 Stage 2~3에서 구현한다.

### 검증

```bash
npm run build
npm run typecheck
rg "__crop_root__|attachShadow|Escape|crop-overlay|data-crop-root" src/content vite.config.ts
rg "content/inject|\\(\\(\\) =>" dist/content/inject.js
git diff --check
```

### 커밋

```text
Task #5 Stage 1: overlay module shell 분리
```

## Stage 2 — hover highlight와 Firefox-derived helper 연결

### 산출물

신규:

- `tests/content/overlay/positioning.test.ts`
- 필요 시 `tests/content/overlay/dom-fixtures.ts`
- `mydocs/working/task_m010_5_stage2.md`

수정:

- `src/content/overlay/crop-overlay.ts`
- `src/content/overlay/crop-template.ts`
- `src/content/overlay/crop-overlay.css`
- 필요 시 `src/content/overlay/state-machine.ts`

### 변경 내용

- pointermove 이벤트로 viewport-local pointer 좌표를 읽는다.
- Task #4의 `getElementFromPoint()`, `getBestRectForElement()`, `readWindowDimensions()` helper를 연결한다.
- overlay host, highlight, selected rect, action buttons 같은 crop UI 자체는 hover 후보에서 제외한다.
- hover 후보 rect를 Shadow DOM 내부 dashed rectangle으로 표시한다.
- hover rect가 없거나 iframe unsupported fallback인 경우 highlight를 숨기거나 host fallback 정책을 적용한다.
- pointermove 처리는 `requestAnimationFrame` 또는 동등한 방식으로 과도한 layout read/write를 줄인다.
- Stage 2에서는 hover 표시까지만 구현하고 click selection 고정과 action buttons 표시 UX는 Stage 3에서 구현한다.

### 검증

```bash
npm run typecheck
npm run test
rg "getElementFromPoint|getBestRectForElement|readWindowDimensions|pointermove|hover" src/content tests/content
git diff --check
```

### 커밋

```text
Task #5 Stage 2: hover highlight helper 연결
```

## Stage 3 — selection 상태와 action buttons 배치

### 산출물

신규:

- `tests/content/overlay/state-machine.test.ts`
- 필요 시 `tests/content/overlay/button-position.test.ts`
- `mydocs/working/task_m010_5_stage3.md`

수정:

- `src/content/overlay/state-machine.ts`
- `src/content/overlay/crop-overlay.ts`
- `src/content/overlay/crop-template.ts`
- `src/content/overlay/crop-overlay.css`

### 변경 내용

- `idle`, `hovering`, `selected`, `closing` 상태와 이벤트 전이를 구현한다.
- click 이벤트로 현재 hover rect를 selected rect로 고정한다.
- selected 상태에서는 selected rectangle을 유지하고 hover 업데이트를 중단하거나 selection 유지 정책을 적용한다.
- Copy/Save/Cancel buttons container를 selected rect 기준으로 배치한다.
- button container가 viewport 밖으로 나가지 않도록 clamp/flip 정책을 구현한다.
- Cancel button과 Escape key는 overlay를 teardown한다.
- Copy/Save button은 이번 task에서 UI만 제공하며 실제 capture/crop/clipboard/download는 실행하지 않는다. 구현 방식은 disabled placeholder가 아니라 active-looking no-op button에 `data-crop-action`을 달고 후속 task에서 handler를 연결할 수 있게 둔다.

### 검증

```bash
npm run typecheck
npm run test
rg "selected|Copy|Save|Cancel|Escape|data-crop-action" src/content tests/content
git diff --check
```

### 커밋

```text
Task #5 Stage 3: selection과 action buttons 구현
```

## Stage 4 — README smoke 절차와 통합 검증

### 산출물

신규:

- `mydocs/report/task_m010_5_report.md`

수정:

- `README.md`
- `mydocs/orders/20260527.md`
- 필요 시 Stage 1~3 산출물의 작은 정정

### 변경 내용

- README의 개발 상태와 Chrome unpacked extension smoke 기대 결과를 실제 overlay UI 기준으로 갱신한다.
- Copy/Save는 이번 task에서 UI 표시까지만 되고 실제 capture/crop/clipboard/download는 후속 #6/#7 범위임을 문서화한다.
- 가능한 범위에서 Chrome unpacked extension manual smoke test를 수행한다.
- 수동 smoke가 Codex 환경에서 불가능하면 작업지시자 smoke 확인 요청 또는 검증 한계를 최종 보고서에 명시한다.
- 오늘할일을 완료 상태로 갱신하고 최종 보고서를 작성한다.

### 검증

```bash
npm run build
npm run typecheck
npm run test
rg "__crop_root__|crop-overlay|hover|selected|Copy|Save|Cancel" src/content README.md
git diff --check
git status --short
```

수동 검증:

- Chrome에서 `dist/` unpacked extension 로드
- action icon 또는 `open-crop` shortcut으로 overlay 열기
- 일반 DOM 요소 hover 시 dashed highlight 표시 확인
- click 후 selected rectangle과 Copy/Save/Cancel buttons 표시 확인
- Cancel button과 Escape key로 overlay 제거 확인
- 재실행 시 overlay가 중복으로 쌓이지 않는지 확인
- 페이지 CSS 충돌 샘플에서 Shadow DOM 격리 확인

### 커밋

```text
Task #5 Stage 4 + 최종 보고서: Firefox식 overlay UI 완료
```

## Stage 5 — Firefox식 시각 정렬과 눈동자 포인터 추적

### 산출물

신규:

- `mydocs/working/task_m010_5_stage5.md`

수정:

- `src/content/overlay/crop-template.ts`
- `src/content/overlay/crop-overlay.ts`
- `src/content/overlay/crop-overlay.css`
- `src/content/overlay/positioning.ts`
- `tests/content/overlay/positioning.test.ts`
- `README.md`
- `mydocs/report/task_m010_5_report.md`
- `mydocs/orders/20260527.md`

### Firefox 원본 분석 기준

아래 Mozilla Firefox 원본 구현은 구조와 동작 방식만 참고한다. 제품명, 아이콘, SVG path, XUL/Mozilla 전용 API, localization id, CSS token은 복사하지 않는다.

- `browser/components/screenshots/ScreenshotsOverlayChild.sys.mjs`: 초기 preview container, cancel button, hover/selection 상태 전환, 눈동자 이동식
- `browser/components/screenshots/overlay/overlay.css`: dark preview overlay, centered instructions, dashed hover/selection outline
- `browser/components/screenshots/screenshots-buttons.js`: visible page/full page 버튼 패널 구조
- `browser/components/screenshots/screenshots-buttons.css`: top-right 버튼 패널 배치와 icon-above-label button 형태

### 변경 내용

- 기존 작은 `crop` panel을 Firefox식 top-right mode toolbar로 교체한다.
- toolbar는 `보이는 영역 선택`을 활성 상태로 표시하고, `전체 페이지 선택`은 MVP 범위 밖이므로 비활성 placeholder로 둔다.
- 초기 상태에서 중앙 preview prompt를 표시한다.
- prompt에는 `crop` 자체 CSS/DOM으로 만든 face mark를 사용하고, 포인터 위치에 따라 두 눈동자가 같은 방향으로 이동하도록 구현한다.
- 눈동자 이동은 Firefox 원본과 같은 개념으로 viewport 중심 대비 pointer 좌표를 `translate(x, y)`로 변환하되, 현재 CSS custom property 구조에 맞춰 적용한다.
- selected 상태에서는 prompt를 숨기고 기존 Copy/Save/Cancel action buttons는 유지한다.
- Firefox 또는 Mozilla 제품명, 원본 SVG path, 원본 아이콘 asset은 UI에 사용하지 않는다.

### 검증

```bash
npm run build
npm run typecheck
npm run test
rg "crop-mode-toolbar|crop-prompt|crop-eye|보이는 영역 선택|전체 페이지 선택" src/content README.md
git diff --check
```

자동 smoke:

- `dist/content/inject.js`를 CDP로 직접 주입한다.
- overlay root, mode toolbar, prompt, face/eye DOM이 생성되는지 확인한다.
- pointermove 후 눈동자 CSS custom property가 바뀌는지 확인한다.
- DOM 요소 hover, click selected, Cancel/Escape teardown 회귀가 없는지 확인한다.

### 커밋

```text
Task #5 Stage 5: Firefox식 overlay 시각 정렬
```

## Stage 6 — Firefox 원본 UI 자산과 drag selection 포팅

### 산출물

신규:

- `src/firefox-derived/screenshots-ui-assets.ts`
- `mydocs/working/task_m010_5_stage6.md`

수정:

- `src/content/overlay/crop-template.ts`
- `src/content/overlay/crop-overlay.ts`
- `src/content/overlay/crop-overlay.css`
- `src/content/overlay/positioning.ts`
- `src/content/overlay/state-machine.ts`
- `tests/content/overlay/positioning.test.ts`
- `tests/content/overlay/state-machine.test.ts`
- `NOTICE`
- `THIRD_PARTY.md`
- `README.md`
- `mydocs/report/task_m010_5_report.md`
- `mydocs/orders/20260527.md`

### Firefox 원본 분석 기준

아래 Mozilla Firefox 원본 구현은 MPL 2.0 출처를 유지해 필요한 UI 자산과 상태 전환을 포팅한다. Chrome에서 직접 실행할 수 없는 Firefox privileged API는 포팅하지 않는다.

- `browser/components/screenshots/ScreenshotsOverlayChild.sys.mjs`: preview face SVG, `crosshairs -> draggingReady -> dragging -> selected` drag selection 흐름, selection container 구조
- `browser/components/screenshots/overlay/overlay.css`: `preview-container`, `hover-highlight`, `selection-container`, selection background, instruction typography
- `browser/components/screenshots/screenshots-buttons.css`: top-right visible/full page button 크기와 icon-above-label 구조
- `browser/components/screenshots/content/menu-visible.svg`
- `browser/components/screenshots/content/menu-fullpage.svg`

### 변경 내용

- 원본 preview face SVG path와 visible/full page menu SVG를 `src/firefox-derived/screenshots-ui-assets.ts`로 분리하고 MPL 2.0 헤더를 유지한다.
- `crop-template.ts`는 Firefox-derived asset factory를 통해 face와 mode icon SVG를 생성한다.
- CSS는 원본 `overlay.css`의 주요 수치에 맞춰 prompt font `24px`, line-height `32px`, instruction width `400px`, face `64px`, button min-width `90px`, icon `46px` 기준으로 조정한다.
- Firefox 원본처럼 pointerdown에서 `draggingReady`, 40px 이상 이동 시 `dragging`, pointerup에서 `selected`로 전환하는 drag selection을 구현한다.
- drag/selected 상태에서는 preview prompt와 top-right mode toolbar를 숨기고, selection background와 selected highlight를 표시한다.
- click만 하는 경우에는 기존 hover element selection을 유지한다.
- full page capture 동작, Firefox resize mover 전체, privileged iframe traversal, telemetry, localization id는 이번 Stage에서 제외한다.

### 검증

```bash
npm run build
npm run typecheck
npm run test
rg "draggingReady|dragging|screenshots-ui-assets|menu-visible|menu-fullpage|leftPupil|rightPupil" src tests NOTICE THIRD_PARTY.md README.md
git diff --check
```

자동 smoke:

- `dist/content/inject.js`를 CDP로 직접 주입한다.
- 원본 face SVG와 mode icon SVG가 Shadow DOM에 생성되는지 확인한다.
- pointermove 후 SVG pupil transform이 갱신되는지 확인한다.
- hover 상태에서 click하면 기존 element selection이 유지되는지 확인한다.
- pointerdown/move/up drag로 임의 region이 selected 상태가 되는지 확인한다.
- selected 상태에서 action buttons와 Cancel/Escape teardown이 유지되는지 확인한다.

### 커밋

```text
Task #5 Stage 6: Firefox 원본 UI와 drag selection 포팅
```

## Stage 7 — Firefox UI parity 세부 보정

### 산출물

신규:

- `mydocs/working/task_m010_5_stage7.md`

수정:

- `src/firefox-derived/screenshots-ui-assets.ts`
- `src/content/overlay/crop-overlay.css`
- `README.md`
- `mydocs/report/task_m010_5_report.md`
- `mydocs/orders/20260527.md`

### 변경 내용

- `crop-frame` 상시 표시와 hover highlight 색/opacity는 작업지시자 요청에 따라 변경하지 않는다.
- visible/full page SVG icon의 `context-fill/context-stroke` 변환을 보정해 visible icon이 흰 사각형처럼 채워지지 않도록 한다.
- prompt가 viewport 중앙에 더 가깝게 배치되도록 수직 offset을 제거한다.
- prompt instruction과 cancel button font weight를 낮춰 Firefox 원본 렌더링에 가깝게 보정한다.
- top-right mode panel button 폭, 높이, font weight, radius를 줄여 Firefox panel에 더 가깝게 맞춘다.

### 검증

```bash
npm run build
npm run typecheck
npm run test
rg "fill-rule|crop-mode-button|crop-prompt-instructions|font-weight: 600|translateY\\(0\\)" src/content src/firefox-derived
git diff --check
```

자동 smoke:

- `dist/content/inject.js`를 CDP로 직접 주입한다.
- visible/full page icon SVG가 생성되고 frame path가 `fill-rule="evenodd"`를 갖는지 확인한다.
- prompt CSS가 `translateY(0)`과 낮아진 font weight를 반영하는지 확인한다.
- 기존 hover click selection, drag selection, Cancel/Escape teardown 회귀가 없는지 확인한다.

### 커밋

```text
Task #5 Stage 7: Firefox UI parity 세부 보정
```

## 검증

- 각 Stage 검증 명령은 단계 보고서 작성 전에 실행한다.
- 실패한 검증은 단계 완료로 처리하지 않는다.
- 계획 변경이 필요하면 구현계획서를 먼저 갱신하고 작업지시자 승인을 받는다.
- 문서 위치가 수행계획서 판단과 달라지면 구현 전에 수행계획서 또는 구현계획서를 갱신하고 작업지시자 승인을 받는다.
- Chrome smoke가 환경 제약으로 불가능하면 Stage 4 보고서와 최종 보고서에 정확한 한계와 작업지시자 확인 필요 항목을 남긴다.

## 커밋

- 단계 커밋은 단계 산출물과 `mydocs/working/task_m010_5_stage{N}.md`를 함께 묶는다.
- 커밋 메시지는 `Task #5 Stage {N}: {핵심 내용 요약}` 형식을 따른다.
- 최종 보고서 커밋은 `Task #5 Stage 4 + 최종 보고서: Firefox식 overlay UI 완료` 형식을 따른다.

## 단계 의존성

- Stage 2는 Stage 1에서 overlay module shell, CSS inline 방식, 반복 주입 안전성이 검증된 후 진행한다.
- Stage 3은 Stage 2에서 hover rect 표시와 helper 연결이 검증된 후 진행한다.
- Stage 4는 Stage 1~3 검증과 단계 보고서 승인이 끝난 후 진행한다.
- Stage 5는 작업지시자의 추가 UI parity 요청 승인 이후 진행한다.
- Stage 6은 작업지시자의 원본에 최대한 가까운 포팅 요청 승인 이후 진행한다.
- Stage 7은 작업지시자의 frame/hover 제외 UI parity 보정 요청 승인 이후 진행한다.
- capture/crop backend는 Task #5 final report와 PR merge 이후 #6에서 진행한다.

## 위험과 대응

- **반복 주입 top-level 충돌**: import 기반 bundle로 바뀌면 기존 IIFE 안전성이 깨질 수 있다. Stage 1에서 `dist/content/inject.js` wrapper와 재실행 smoke를 검증한다.
- **overlay가 page hit-test를 가로막음**: dim/highlight layer는 `pointer-events: none`, action buttons는 `pointer-events: auto`로 분리한다.
- **페이지 CSS 충돌**: Shadow DOM 내부 style과 `:host { all: initial; }` 경계를 유지한다.
- **Copy/Save 오해**: 이번 task에서는 UI만 구현하고 action은 후속 #6/#7에서 연결한다는 점을 README와 보고서에 명시한다.
- **CSS raw import type 문제**: `?raw` declaration을 추가하거나 동등한 inline CSS 방식을 Stage 1에서 검증한다.
- **수동 smoke 제약**: 로컬 Chrome 검증이 제한되면 자동 검증 결과와 함께 검증 한계를 보고서에 남기고 작업지시자 확인을 요청한다.
- **Firefox 동일성 한계**: Firefox 제품명, 원본 아이콘/SVG, full page capture 동작은 이번 task에서 복제하지 않고 `crop` 브랜딩과 MVP visible viewport 범위를 유지한다.
- **MPL 자산 혼입 위험**: Firefox 원본 SVG path와 menu icon은 `src/firefox-derived/`로 분리하고 `NOTICE`, `THIRD_PARTY.md`에 출처를 기록한다.
- **drag와 click 이벤트 충돌**: pointerdown/up drag 흐름과 click selection 흐름이 중복 실행되지 않도록 selected 상태에서는 click 후속 처리를 no-op으로 둔다.

## 승인 요청 사항

- 위 4개 Stage 분할과 산출물 경로 승인
- Stage 1에서 content script 반복 주입 안전성을 보장하기 위해 `vite.config.ts` output wrapper 또는 동등한 bundling 조정을 포함하는 것 승인
- `crop-overlay.css`를 Shadow DOM에 inline 주입하기 위해 CSS raw import declaration 또는 동등한 방식을 추가하는 것 승인
- Copy/Save buttons는 이번 task에서 active-looking no-op UI로 두고 실제 동작은 #6/#7에서 연결하는 것 승인
- Chrome unpacked extension manual smoke를 Stage 4에서 수행하고, 불가능한 항목은 검증 한계로 기록하는 방식 승인
