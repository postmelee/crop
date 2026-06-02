# Task #26 구현계획서

수행계획서: [`task_m020_26.md`](task_m020_26.md)
GitHub Issue: [#26](https://github.com/postmelee/crop/issues/26)
마일스톤: M020

## 단계 개요

| Stage | 제목 | 주요 산출 | 검증 |
|---|---|---|---|
| 1 | 선택 rect tile/stitch 계약 작성 | `full-page-capture.ts`, `stitch-image.ts`, helper 테스트 | typecheck/test/grep/diff |
| 2 | selected Save/Copy capture 경로 통합 | `crop-overlay.ts`, capture 분기, scroll 복구 테스트 | build/typecheck/test/grep/diff |
| 3 | fixture 회귀와 품질 문서 보강 | phase6 fixture/test, quality matrix | build/typecheck/test/smoke/diff |
| 4 | 통합 검증과 최종 보고 | 최종 보고서, 오늘할일, 전체 검증 로그 | build/typecheck/test/grep/diff/status |
| 5 | selected sticky/fixed chrome 오염 보정 | selected capture suppression, 회귀 테스트, 최종 보고서 갱신 | build/typecheck/test/grep/diff/status |

## 문서 위치 확인

수행계획서의 "문서 위치 판단"과 실제 Stage 산출물 경로를 다음과 같이 일치시킨다. 이번 task에서는 공식 제품 문서 루트(`docs/`, `specs/`, `site/`, `website/`, `adr`)를 새로 만들지 않는다.

| 파일 | 수행계획서상 선택 위치 | Stage 산출물 경로 | 일치 여부 | 비고 |
|---|---|---|---|---|
| `mydocs/tech/task_m020_8_quality_matrix.md` | `mydocs/tech/` | `mydocs/tech/task_m020_8_quality_matrix.md` | OK | #26 selected scroll capture 회귀 기준만 좁게 추가 |
| `mydocs/plans/task_m020_26.md` | `mydocs/plans/` | `mydocs/plans/task_m020_26.md` | OK | 수행계획서 |
| `mydocs/plans/task_m020_26_impl.md` | `mydocs/plans/` | `mydocs/plans/task_m020_26_impl.md` | OK | 구현계획서 |
| `mydocs/working/task_m020_26_stage{N}.md` | `mydocs/working/` | `mydocs/working/task_m020_26_stage{N}.md` | OK | 단계 보고서 |
| `mydocs/report/task_m020_26_report.md` | `mydocs/report/` | `mydocs/report/task_m020_26_report.md` | OK | 최종 보고서 |

## 수용 기준 고정

- 선택 영역이 현재 viewport 안에 완전히 들어오면 기존 단일 `captureVisibleTab()` crop 경로를 유지한다.
- 선택 영역이 현재 viewport를 벗어나면 선택 page rect 전체를 기준으로 tile capture/stitching을 수행한다.
- 스크롤 후 Save/Copy해도 출력 이미지의 CSS 기준 크기는 선택 rect 크기와 일치한다.
- 출력 픽셀 크기는 캡처 이미지 natural size와 viewport CSS size에서 계산한 scale을 따른다.
- 선택 영역의 offscreen 부분이 현재 viewport 교집합으로 잘리지 않는다.
- overlay, toolbar, selection outline, handles, action buttons는 최종 PNG에 포함되지 않는다.
- capture 성공/실패와 무관하게 시작 scroll position을 복구한다.
- full page capture, visible viewport capture, iframe/shadow selection은 회귀하지 않는다.
- `debugger`, `<all_urls>`, broad host permission은 추가하지 않는다.

## Stage 1 — 선택 rect tile/stitch 계약 작성

### 산출물

신규:

- 필요 시 `tests/content/overlay/selected-region-capture.test.ts`
- `mydocs/working/task_m020_26_stage1.md`

수정:

- `src/content/overlay/full-page-capture.ts`
- `src/shared/stitch-image.ts`
- `tests/content/overlay/full-page-capture.test.ts`
- `tests/shared/stitch-image.test.ts`

### 변경 내용

- full page 전용으로 고정된 tile plan 생성부를 page bounds 입력 기반으로 재사용할 수 있는 구조로 좁게 일반화한다.
- 선택 rect bounds를 입력하면 선택 rect 좌상단을 destination `(0, 0)`으로 갖는 tile plan을 만든다.
- 기존 full page plan은 일반화된 bounds helper를 호출하되 public contract와 동작은 유지한다.
- 마지막 right/bottom partial tile, 현재 scroll min/max clamp, viewport crop rect, destination rect 계산을 테스트로 고정한다.
- `stitchCapturedTiles()`가 선택 rect tile plan에도 같은 방식으로 동작하는지 scale/destination 검증을 추가한다.
- 선택 rect가 viewport보다 작지만 현재 viewport 밖으로 일부 나간 경우와 viewport보다 큰 경우를 모두 테스트한다.
- Stage 1은 runtime overlay action 연결 없이 순수 contract와 helper 테스트까지만 다룬다.

### 검증

```bash
npm run typecheck
npm test -- tests/content/overlay/full-page-capture.test.ts tests/shared/stitch-image.test.ts
rg "bounds|tile|stitch|destinationCssRect|viewportCropRect|full-page|selected" src/content/overlay/full-page-capture.ts src/shared/stitch-image.ts tests/content/overlay/full-page-capture.test.ts tests/shared/stitch-image.test.ts
git diff --check
```

### 커밋

```text
Task #26 Stage 1: 선택 영역 tile/stitch 계약 작성
```

## Stage 2 — selected Save/Copy capture 경로 통합

### 산출물

신규:

- `mydocs/working/task_m020_26_stage2.md`

수정:

- `src/content/overlay/crop-overlay.ts`
- `src/content/overlay/full-page-capture.ts`
- `tests/content/overlay/full-page-capture.test.ts`
- 필요 시 `tests/content/overlay/phase6-regression.test.ts`

### 변경 내용

- `captureSelectedRegion()`에서 selected page rect가 현재 viewport에 완전히 포함되는지 판정한다.
- 완전히 포함되는 경우 기존 단일 visible crop 경로를 그대로 사용한다.
- 일부라도 viewport 밖으로 벗어난 경우 Stage 1의 선택 rect tile plan과 capture loop를 사용해 선택 rect 전체를 stitch한다.
- capture loop는 기존 full page 경로의 다음 책임을 재사용한다.
  - scroll behavior 임시 비활성
  - tile별 `scrollTo()`
  - paint 대기
  - overlay 숨김 후 `captureVisibleTab()`
  - overlay 복구
  - 시작 scroll position 복구
- action result metadata는 기존 selected capture와 호환되도록 `mode`, `dataUrl`, `outputWidth`, `outputHeight`, `tileCount`를 채운다.
- 실패 시 status 메시지는 기존 selected capture 실패 흐름을 유지한다.
- full page capture 경로가 선택 rect 분기 때문에 회귀하지 않도록 full page 테스트를 같이 보강한다.

### 검증

```bash
npm run build
npm run typecheck
npm test
rg "captureSelectedRegion|clipPageRectToViewport|captureFullPageTiles|stitchCapturedTiles|scrollTo|tileCount|Selected" src tests
git diff --check
```

### 커밋

```text
Task #26 Stage 2: selected capture stitching 경로 통합
```

## Stage 3 — fixture 회귀와 품질 문서 보강

### 산출물

신규:

- `mydocs/working/task_m020_26_stage3.md`

수정:

- `tests/fixtures/phase6_edge_cases.html`
- `tests/content/overlay/phase6-regression.test.ts`
- `mydocs/tech/task_m020_8_quality_matrix.md`
- 필요 시 `tests/content/overlay/full-page-capture.test.ts`

### 변경 내용

- phase6 edge fixture에 스크롤 후 선택 영역 저장 검증이 쉬운 anchor, label, size marker, 기대값 설명을 보강한다.
- 자동 테스트에서 선택 rect가 스크롤 후 viewport를 벗어나도 selection state와 action placement가 유지되는지 확인한다.
- 가능한 범위에서 선택 rect tile plan 또는 capture result dimension을 테스트로 검증한다.
- 수동 smoke 기준을 품질 매트릭스에 추가한다.
  - 선택 rect 표시 크기 기록
  - 스크롤 후 Save 실행
  - 저장 PNG 픽셀 크기와 DPR 대응 확인
  - overlay/action UI 미포함 확인
  - 완료 후 scroll restoration 확인
- Firefox 비교는 제품명/브랜딩에 쓰지 않고 내부 검증 참고로만 기록한다.

### 검증

```bash
npm run build
npm run typecheck
npm test
rg "#26|selected|selection|scroll|viewport|stitch|tile|quality" tests mydocs/tech/task_m020_8_quality_matrix.md
git diff --check
```

수동 smoke:

- `tests/fixtures/phase6_edge_cases.html`에서 큰 선택 영역을 만든다.
- 선택 후 스크롤해 rect 일부가 viewport 밖으로 나간 상태에서 Save를 실행한다.
- 저장 PNG 크기가 선택 박스 CSS 크기 x DPR과 일치하는지 확인한다.
- 저장 PNG에 overlay, selection outline, handles, action buttons가 포함되지 않는지 확인한다.
- capture 완료 후 시작 scroll 위치로 복구되는지 확인한다.

### 커밋

```text
Task #26 Stage 3: 선택 영역 스크롤 fixture 회귀 보강
```

## Stage 4 — 통합 검증과 최종 보고

### 산출물

신규:

- `mydocs/working/task_m020_26_stage4.md`
- `mydocs/report/task_m020_26_report.md`

수정:

- `mydocs/orders/20260602.md`
- 필요 시 앞 단계에서 발견된 문서 보정 파일

### 변경 내용

- 전체 자동 검증을 실행하고 결과를 최종 보고서에 정리한다.
- 권한 경계를 grep으로 확인해 `debugger`, `<all_urls>`, broad host permission이 추가되지 않았음을 기록한다.
- fixture 기반 수동 smoke 결과와 남은 한계를 보고서에 기록한다.
- 화면 이동 노출, sticky/fixed 픽셀 차이, 큰 선택 영역 canvas 한계를 잔여 위험으로 정리한다.
- 오늘할일 상태를 완료로 갱신한다.

### 검증

```bash
npm run build
npm run typecheck
npm test
rg "debugger|<all_urls>|host_permissions|captureVisibleTab" manifest.json src tests
rg "#26|selected|scroll|viewport|stitch|tile" mydocs src tests
git diff --check
git status --short
```

### 커밋

```text
Task #26 Stage 4 + 최종 보고서: 선택 영역 스크롤 캡처 보정 완료
```

## Stage 5 — selected sticky/fixed chrome 오염 보정

### 산출물

신규:

- `mydocs/working/task_m020_26_stage5.md`

수정:

- `src/content/overlay/crop-overlay.ts`
- `tests/content/overlay/phase6-regression.test.ts`
- `mydocs/tech/task_m020_8_quality_matrix.md`
- `mydocs/report/task_m020_26_report.md`
- `mydocs/orders/20260602.md`

### 변경 내용

- Stage 4 후 수동 검증에서 selected stitching 첫 tile에 선택 박스 밖 sticky header가 포함되는 문제가 확인됐다.
- full page capture는 첫 tile의 page chrome을 보존하고 이후 tile에서만 fixed/sticky chrome을 숨기는 기존 정책을 유지한다.
- selected page rect stitching은 선택한 rect 자체가 출력 범위이므로 모든 tile에서 fixed/sticky page chrome을 숨긴다.
- selected capture block과 full page capture block의 서로 다른 suppression 정책을 회귀 테스트로 고정한다.
- 품질 매트릭스와 최종 보고서에 selected rect 밖 sticky/fixed page chrome 미포함 기준과 검증 한계를 갱신한다.

### 검증

```bash
npm run build
npm run typecheck
npm test
rg "setCapturePageChromeSuppressed\\(true\\)|setCapturePageChromeSuppressed\\(index > 0\\)|selected-scroll-capture|P6-37" src tests mydocs
git diff --check
git status --short
```

수동 smoke:

- `selected-scroll-capture-target` 전체 panel을 선택한다.
- 선택 상태에서 sticky header가 선택 영역 위쪽과 겹치도록 스크롤한 뒤 Save한다.
- 저장 PNG 크기가 선택 CSS 크기 x DPR과 일치하는지 확인한다.
- 저장 PNG에 선택 박스 밖 sticky header, overlay, handles, action buttons가 포함되지 않는지 확인한다.

### 커밋

```text
Task #26 Stage 5: selected sticky chrome 오염 보정
```

## 검증

- 각 Stage 검증 명령은 단계 보고서 작성 전에 실행한다.
- 실패한 검증은 단계 완료로 처리하지 않는다.
- 계획 변경이 필요하면 구현계획서를 먼저 갱신하고 작업지시자 승인을 받는다.
- 문서 위치가 수행계획서 판단과 달라지면 구현 전에 수행계획서 또는 구현계획서를 갱신하고 작업지시자 승인을 받는다.
- full page capture와 selected capture가 같은 helper를 공유하므로 Stage 1 이후 모든 단계에서 관련 테스트를 함께 실행한다.

## 커밋

- 단계 커밋은 단계 산출물과 `mydocs/working/task_m020_26_stage{N}.md`를 함께 묶는다.
- 커밋 메시지는 `Task #26 Stage {N}: {핵심 내용 요약}` 형식을 따른다.
- 최종 보고서 커밋은 `Task #26 Stage 4 + 최종 보고서: 선택 영역 스크롤 캡처 보정 완료`를 사용했다.
- Stage 5 보정 커밋은 `Task #26 Stage 5: selected sticky chrome 오염 보정`을 사용한다.

## 단계 의존성

- Stage 2는 Stage 1의 선택 rect tile/stitch 계약과 테스트 확정 후 진행한다.
- Stage 3은 Stage 2의 runtime selected capture 경로가 동작한 뒤 진행한다.
- Stage 4는 Stage 1~3 검증과 보고서 승인 후 진행한다.
- Stage 5는 Stage 4 후 수동 검증에서 확인된 selected-only sticky/fixed page chrome 오염 보정으로 진행한다.

## 위험과 대응

- **화면 이동 노출**: viewport 밖 선택 rect는 `captureVisibleTab()` 제약 때문에 scroll 이동이 필요하다. 선택 rect bounds만 캡처해 tile 수를 줄이고 완료/실패 후 복구를 보장한다.
- **full page 회귀**: full page helper를 일반화하면서 기존 전체 페이지 캡처가 흔들릴 수 있다. full page 테스트를 Stage 1부터 계속 실행한다.
- **sticky/fixed 차이**: Chrome MV3 visible tab stitching은 Firefox privileged snapshot과 픽셀 단위 동일성을 보장하지 않는다. 출력 rect 크기와 offscreen clipping 방지를 우선한다.
- **layout shift**: capture 중 문서가 움직이면 tile seam이나 픽셀 차이가 생길 수 있다. fixture smoke와 보고서 잔여 위험으로 분리한다.
- **큰 선택 영역**: 매우 큰 rect는 기존 max canvas 제한에 걸릴 수 있다. full page capture의 제한 정책을 재사용하고 명시 오류를 유지한다.

## 승인 요청 사항

- 위 Stage 1~4 분할, 산출물, 검증 명령, 커밋 메시지를 승인 요청한다.
- Stage 1에서 full page helper를 선택 rect bounds 입력에도 쓸 수 있도록 좁게 일반화하는 것을 승인 요청한다.
- Stage 2에서 viewport 밖 selected capture에만 tile/stitching 경로로 분기하는 것을 승인 요청한다.
- Stage 3에서 공식 사용자 문서가 아니라 내부 품질 매트릭스에만 수동 smoke 기준을 추가하는 것을 승인 요청한다.
