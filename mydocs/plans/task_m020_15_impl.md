# Task #15 구현계획서

수행계획서: [`task_m020_15.md`](task_m020_15.md)
GitHub Issue: [#15](https://github.com/postmelee/crop/issues/15)
마일스톤: M020

## 단계 개요

| Stage | 제목 | 주요 산출 | 검증 |
|---|---|---|---|
| 1 | Firefox reference contract와 tile/stitch helper 작성 | `full-page-capture.ts`, `stitch-image.ts`, helper 테스트 | typecheck/test/grep/diff |
| 2 | scroll capture loop와 runtime 복구 구현 | overlay capture loop, overlay 숨김, scroll restoration | build/typecheck/test/grep/diff |
| 3 | `전체 페이지 선택` UI와 Copy/Save 연결 | mode button 활성화, action pipeline 통합 | build/typecheck/test/grep/diff |
| 4 | fixture, sticky/fixed 정책, stitching 품질 회귀 | full-page fixture, seam/dimension 회귀, smoke 기준 | build/typecheck/test/smoke/diff |
| 5 | 문서, 품질 매트릭스, 최종 smoke와 보고 | README, quality matrix, 최종 보고서, 오늘할일 | build/typecheck/test/smoke/grep/diff/status |

## 문서 위치 확인

수행계획서의 "문서 위치 판단"과 실제 Stage 산출물 경로를 다음과 같이 일치시킨다. 이번 task에서는 공식 제품 문서 루트(`docs/`, `specs/`, `site/`, `website/`, `adr`)를 새로 만들지 않는다.

| 파일 | 수행계획서상 선택 위치 | Stage 산출물 경로 | 일치 여부 | 비고 |
|---|---|---|---|---|
| `README.md` | 루트 `README.md` | `README.md` | OK | full page 지원 상태와 smoke 기대 결과만 좁게 갱신 |
| `mydocs/tech/task_m020_8_quality_matrix.md` | `mydocs/tech/` | `mydocs/tech/task_m020_8_quality_matrix.md` | OK | full page/stitching 품질 기준 갱신 |
| `mydocs/plans/task_m020_15.md` | `mydocs/plans/` | `mydocs/plans/task_m020_15.md` | OK | 수행계획서 |
| `mydocs/plans/task_m020_15_impl.md` | `mydocs/plans/` | `mydocs/plans/task_m020_15_impl.md` | OK | 구현계획서 |
| `mydocs/working/task_m020_15_stage{N}.md` | `mydocs/working/` | `mydocs/working/task_m020_15_stage{N}.md` | OK | 단계 보고서 |
| `mydocs/report/task_m020_15_report.md` | `mydocs/report/` | `mydocs/report/task_m020_15_report.md` | OK | 최종 보고서 |

## 수용 기준 고정

- `전체 페이지 선택`은 현재 top-level document의 full page PNG를 생성한다.
- full page capture는 `chrome.tabs.captureVisibleTab()`와 content script scroll orchestration으로 구현한다.
- `debugger`, `<all_urls>`, broad host permission은 추가하지 않는다.
- capture 결과에 crop overlay, toolbar, selection handles, action buttons가 포함되지 않는다.
- capture 완료/실패와 무관하게 시작 scroll position을 복구한다.
- visible viewport selection/crop, same-origin iframe selection, open shadow selection은 회귀하지 않는다.
- 매우 큰 문서는 max canvas dimension/area 정책에 따라 제한하거나 명시 오류로 처리한다.
- Firefox `drawSnapshot`/actor/privileged API는 사용하지 않는다.

## Firefox reference contract

- Firefox의 full page path는 `takeScreenshot(..., "FullPage") -> fetchFullPageBounds() -> createCanvas(region)` 구조로 이해하고, 우리 구현은 `full-page-capture` helper에서 같은 contract만 재현한다.
- bounds contract는 `left`, `top`, `right`, `bottom`, `width`, `height`, `devicePixelRatio`, `viewportWidth`, `viewportHeight`를 포함한다.
- Firefox의 max capture dimension/area와 snapshot tile size는 named constant로 둔다. 실제 값은 Stage 1에서 Chrome canvas 동작과 테스트 안정성을 기준으로 확정한다.
- Firefox가 `drawSnapshot()`으로 임의 rect를 그리는 부분은 Chrome에서 불가능하므로, 우리 구현은 scroll target별 visible screenshot을 source tile로 사용한다.
- stitching은 실제 captured image natural size와 viewport CSS size 비율을 사용하고, source/destination rect는 정수 pixel로 snap한다.
- Firefox MPL 코드를 복사하지 않는다. 참고 구현을 넘어 실질 복사가 필요하면 구현계획서를 갱신하고 별도 승인을 받는다.

## Stage 1 — Firefox reference contract와 tile/stitch helper 작성

### 산출물

신규:

- `src/content/overlay/full-page-capture.ts`
- `src/shared/stitch-image.ts`
- `tests/content/overlay/full-page-capture.test.ts`
- `tests/shared/stitch-image.test.ts`
- `mydocs/working/task_m020_15_stage1.md`

수정:

- 필요 시 `tests/content/overlay/phase6-regression.test.ts`

### 변경 내용

- full page capture에 필요한 순수 데이터 contract를 먼저 고정한다.
  - full page bounds
  - viewport CSS size
  - scroll target
  - tile source crop rect
  - final canvas destination rect
  - output pixel size
- `readFullPageMetrics()` 또는 동등 helper는 `documentElement`, `body`, `window.innerWidth/innerHeight`, scroll position, `devicePixelRatio`를 Chrome-safe 방식으로 읽는다.
- `planFullPageTiles()`는 page 좌표 기준 tile 배열을 만든다.
  - 마지막 bottom/right tile은 문서 끝에 맞춰 source crop을 줄인다.
  - horizontal scroll이 있는 문서도 최소 1개 이상의 x tile을 계산한다.
  - scrollMinX/Y는 기본 0으로 시작하되 helper contract에 필드로 남긴다.
- `stitchCapturedTiles()`는 tile image data URL 배열과 tile plan을 받아 하나의 PNG data URL을 만든다.
- source crop은 실제 image natural size와 viewport CSS size의 비율로 계산한다.
- Firefox 조사에서 확인한 edge rounding/gap 방지 원칙을 반영해 source/destination rect를 정수 pixel로 snap한다.
- max canvas dimension/area와 tile size 정책을 constant로 두고 테스트로 고정한다.
- Stage 1은 runtime scroll/capture 연결 없이 순수 helper와 테스트까지만 다룬다.

### 검증

```bash
npm run typecheck
npm test -- tests/shared/stitch-image.test.ts tests/content/overlay/full-page-capture.test.ts
rg "full page|full-page|stitch|tile|devicePixelRatio|MAX_CAPTURE|captureVisibleTab|drawSnapshot" src tests mydocs/plans/task_m020_15.md mydocs/plans/task_m020_15_impl.md
git diff --check
```

### 커밋

```text
Task #15 Stage 1: full page tile/stitch helper 작성
```

## Stage 2 — scroll capture loop와 runtime 복구 구현

### 산출물

신규:

- `mydocs/working/task_m020_15_stage2.md`

수정:

- `src/content/overlay/full-page-capture.ts`
- `src/content/overlay/crop-overlay.ts`
- `src/shared/messages.ts`
- `src/background/service-worker.ts`
- `tests/content/overlay/full-page-capture.test.ts`
- 필요 시 `tests/content/overlay/phase6-regression.test.ts`

### 변경 내용

- content overlay에서 full page capture loop를 구현한다.
- 각 tile마다 target scroll position으로 이동하고, 다음 paint 이후 `crop.captureVisibleTab` message로 visible PNG를 요청한다.
- background service worker는 기존 `chrome.tabs.captureVisibleTab()` 책임을 유지한다. message shape 확장이 필요하면 최소 필드만 추가한다.
- capture loop 동안 crop root와 toast/action UI가 screenshot에 포함되지 않도록 숨김 상태를 적용한다.
- capture 시작 전 scroll position, scroll behavior 관련 inline state, overlay visibility state를 저장한다.
- 성공, 실패, 예외, 취소 경로 모두에서 overlay visibility와 scroll position을 복구한다.
- scroll 이동 후 실제 `window.scrollX/Y`가 target과 다를 수 있으므로 captured tile의 실제 offset을 기록해 stitching에 사용한다.
- capture 중 layout shift가 발생하면 helper가 반환하는 mismatch 상태를 오류 또는 잔여 위험으로 분리한다.
- visible viewport selection/crop 경로의 `captureSelectedRegion()`은 기존 동작을 유지한다.

### 검증

```bash
npm run build
npm run typecheck
npm run test
rg "captureVisibleTab|scrollTo|scrollBy|requestAnimationFrame|visibility|fullPage|full-page|restore" src tests
git diff --check
```

### 커밋

```text
Task #15 Stage 2: full page scroll capture loop 구현
```

## Stage 3 — `전체 페이지 선택` UI와 Copy/Save 연결

### 산출물

신규:

- `mydocs/working/task_m020_15_stage3.md`

수정:

- `src/content/overlay/crop-template.ts`
- `src/content/overlay/crop-overlay.ts`
- `src/content/overlay/crop-overlay.css`
- `tests/content/overlay/phase6-regression.test.ts`
- 필요 시 `tests/content/overlay/full-page-capture.test.ts`

### 변경 내용

- `전체 페이지 선택` 버튼의 disabled 상태를 제거하고 실제 full page capture action으로 연결한다.
- Firefox 버튼 경로처럼 visible/full page mode는 같은 overlay action pipeline에서 capture backend만 분기한다.
- full page capture 실행 중 Copy/Save action pending 상태와 aria busy 상태를 기존 selected action과 일관되게 유지한다.
- full page Copy는 기존 copy 완료 toast를 표시하고, Save는 toast를 표시하지 않는 현재 정책을 유지한다.
- full page 결과 metadata를 `data-crop-*` dataset에 남겨 smoke와 디버깅이 가능하게 한다.
- full page mode 실행 후 overlay 종료/유지 정책을 확정한다. 기본은 action 완료 후 기존 Copy/Save 흐름과 동일하게 종료한다.
- visible mode, drag selection, click selection, same-origin iframe, open shadow selection의 UI 회귀를 테스트한다.

### 검증

```bash
npm run build
npm run typecheck
npm run test
rg "전체 페이지 선택|data-crop-mode|full-page|aria-disabled|Copy|Save|toast|capture backend" src tests
git diff --check
```

수동 또는 CDP smoke:

- `전체 페이지 선택` 클릭 후 Copy
- `전체 페이지 선택` 클릭 후 Save
- full page Copy 완료 toast 표시
- full page Save 완료 toast 미표시
- visible viewport selection Copy/Save 회귀 없음

### 커밋

```text
Task #15 Stage 3: full page UI와 Copy/Save 연결
```

## Stage 4 — fixture, sticky/fixed 정책, stitching 품질 회귀

### 산출물

신규:

- 필요 시 `tests/fixtures/full_page_capture.html`
- `mydocs/working/task_m020_15_stage4.md`

수정:

- `tests/fixtures/phase6_edge_cases.html`
- `tests/content/overlay/phase6-regression.test.ts`
- `tests/shared/stitch-image.test.ts`
- `tests/content/overlay/full-page-capture.test.ts`
- 필요 시 `src/content/overlay/full-page-capture.ts`
- 필요 시 `src/shared/stitch-image.ts`

### 변경 내용

- 긴 문서 fixture를 보강하거나 신규 fixture를 추가한다.
- full page smoke 대상은 다음 케이스를 포함한다.
  - 긴 일반 문서
  - 마지막 partial bottom tile
  - horizontal overflow가 있는 문서
  - sticky header
  - fixed element
  - large element
  - browser zoom-like image ratio mapping
- sticky/fixed element 정책을 Stage 4에서 확정한다.
  - 기본 정책은 Firefox `drawSnapshot()`과 완전 동일하지 않음을 명시한다.
  - 중복이 심한 경우 capture 중 임시 style 보정 또는 제한 문서화 중 하나를 선택한다.
- stitching seam 회귀를 dimension/pixel 검사로 보강한다.
- overlay, handles, action box가 저장 PNG에 포함되지 않는지 fixture smoke로 확인한다.
- 권한이 `debugger`, `<all_urls>` 없이 유지되는지 grep으로 확인한다.

### 검증

```bash
npm run build
npm run typecheck
npm run test
rg "fixed|sticky|full page|full-page|stitch|seam|debugger|<all_urls>|captureVisibleTab" src tests manifest.json README.md mydocs
git diff --check
```

수동 또는 CDP smoke:

- full page fixture Save 결과 PNG dimension 확인
- full page fixture Copy 결과 clipboard 이미지 확인
- bottom partial tile seam 확인
- sticky/fixed 중복 정책 확인
- visible/iframe/shadow selection 회귀 확인

### 커밋

```text
Task #15 Stage 4: full page fixture와 stitching 품질 회귀 보강
```

## Stage 5 — 문서, 품질 매트릭스, 최종 smoke와 보고

### 산출물

신규:

- `mydocs/report/task_m020_15_report.md`

수정:

- `README.md`
- `mydocs/tech/task_m020_8_quality_matrix.md`
- `mydocs/orders/20260531.md`
- 필요 시 Stage 1~4 산출물의 작은 정정

### 변경 내용

- README의 지원 기능/제한 사항을 #15 완료 상태에 맞게 갱신한다.
- 품질 매트릭스에 full page capture와 scroll stitching smoke 기준을 추가한다.
- 최종 보고서에 수용 기준별 결과, 자동 검증, 수동 smoke, 검증 한계, 후속 리스크를 기록한다.
- 오늘할일을 완료 또는 PR 준비 상태로 갱신한다.
- PR 본문에서 사용할 검증 요약과 stage report 링크를 정리한다.
- `manifest.json` 권한 추가가 없음을 최종 확인한다.

### 검증

```bash
npm run build
npm run typecheck
npm run test
rg "full page|scroll stitching|전체 페이지|debugger|<all_urls>|#15" README.md mydocs src tests manifest.json
git diff --check
git status --short
```

수동 smoke:

- `tests/fixtures/phase6_edge_cases.html`에서 full page Copy
- `tests/fixtures/phase6_edge_cases.html`에서 full page Save
- 저장 PNG의 상단/하단/중간 seam 확인
- 원래 scroll position restoration 확인
- visible selected capture 회귀 확인

### 커밋

```text
Task #15 Stage 5 + 최종 보고서: full page capture 구현 완료
```

## 검증 운영

- 각 Stage 검증 명령은 단계 보고서 작성 전에 실행한다.
- 실패한 검증은 단계 완료로 처리하지 않는다.
- manual smoke가 현재 세션에서 자동화되지 않으면 작업지시자 직접 검증 지침과 결과를 Stage 보고서에 남긴다.
- 기능 추가가 필요한 실패는 구현계획서를 갱신하고 작업지시자 승인을 받거나 후속 이슈로 분리한다.
- 문서 위치가 수행계획서 판단과 달라지면 구현 전에 수행계획서 또는 구현계획서를 갱신하고 작업지시자 승인을 받는다.
- 권한 추가가 필요한 방향으로 구현이 흔들리면 즉시 중단하고 별도 task로 분리한다.

## 커밋

- 단계 커밋은 단계 산출물과 `mydocs/working/task_m020_15_stage{N}.md`를 함께 묶는다.
- 커밋 메시지는 `Task #15 Stage {N}: {핵심 내용 요약}` 형식을 따른다.
- 최종 단계 커밋은 `Task #15 Stage 5 + 최종 보고서: full page capture 구현 완료` 형식을 사용한다.

## 단계 의존성

- Stage 2는 Stage 1의 tile/stitch contract와 max canvas 정책이 확정된 뒤 진행한다.
- Stage 3은 Stage 2의 capture loop와 restoration 검증이 끝난 뒤 진행한다.
- Stage 4는 Stage 3의 UI/action 연결이 안정화된 뒤 진행한다.
- Stage 5는 Stage 1~4 검증과 단계 보고서 승인이 끝난 뒤 진행한다.

## 위험과 대응

- **Chrome capture 제약**: Firefox `drawSnapshot()`처럼 임의 rect를 직접 그릴 수 없다. scroll orchestration + `captureVisibleTab()`으로 구현하고 잔여 차이는 문서화한다.
- **stitching seam**: fractional DPR/zoom과 마지막 tile crop에서 seam이 생길 수 있다. Stage 1에서 source/destination rect snapping을 테스트로 먼저 고정한다.
- **큰 canvas 한계**: 매우 긴 페이지는 canvas limit에 걸릴 수 있다. max dimension/area 정책을 helper 상수와 오류 경로로 고정한다.
- **sticky/fixed 중복**: scroll capture 방식은 fixed/sticky element가 tile마다 반복될 수 있다. Stage 4에서 보정 또는 제한 문서화를 확정한다.
- **scroll restoration 실패**: capture 중 예외가 발생해도 `finally`에서 scroll/overlay state를 복구한다.
- **layout shift/lazy loading**: 실제 웹 페이지는 capture 중 레이아웃이 바뀔 수 있다. fixture에서는 안정 문서를 우선 검증하고 잔여 위험으로 기록한다.
- **권한 범위 확대**: `debugger`, `<all_urls>` 없이 진행한다. 필요성이 생기면 즉시 중단하고 별도 승인 task로 분리한다.
- **MPL boundary 혼선**: Firefox 코드는 reference로만 사용한다. 복사가 필요하면 `src/firefox-derived/` boundary와 라이선스 문서를 먼저 갱신 승인받는다.

## 승인 요청 사항

- 위 Stage 1~5 분할, 산출물, 검증 명령, 커밋 메시지 기준으로 Task #15 구현을 시작하는 것
- Stage 1에서 Firefox reference contract를 Chrome-safe helper와 테스트로 먼저 고정하는 것
- Stage 2에서 `captureVisibleTab()` + content script scroll orchestration으로 full page backend를 구현하는 것
- Stage 3에서 `전체 페이지 선택` 버튼을 활성화하고 기존 Copy/Save action pipeline에 연결하는 것
- Stage 4에서 sticky/fixed parity 한계를 smoke와 문서로 명확히 고정하는 것
- README와 품질 매트릭스는 기존 위치에서 필요한 문구만 좁게 갱신하는 것
