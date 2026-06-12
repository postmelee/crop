# Task #68 구현계획서

수행계획서: [`task_m020_68.md`](task_m020_68.md)
GitHub Issue: [#68](https://github.com/postmelee/crop/issues/68)
마일스톤: M020

## 단계 개요

| Stage | 제목 | 주요 산출 | 검증 |
|---|---|---|---|
| 1 | capture viewport source mapping 회귀 고정 | `task_m020_68_stage1.md`, crop/stitch/full-page tests | focused tests, diff |
| 2 | visible selected/viewport capture 보정 | `crop-overlay.ts`, phase6 regression | typecheck, crop/phase6 focused tests |
| 3 | tiled capture viewport 계약 분리 | `full-page-capture.ts`, `stitch-image.ts`, full-page/stitch tests | typecheck, full-page/stitch focused tests |
| 4 | 통합 검증과 Always scroll bars smoke | Stage 4 보고서, 최종 보고서, 오늘할일 | build, typecheck, full test, permission grep, manual smoke |

## 문서 위치 확인

수행계획서의 "문서 위치 판단"과 실제 Stage 산출물 경로를 다음과 같이 일치시킨다. 공식 사용자 문서는 만들지 않고, 작업 산출물만 `mydocs/` 아래에 둔다.

| 파일 | 수행계획서상 선택 위치 | Stage 산출물 경로 | 일치 여부 | 비고 |
|---|---|---|---|---|
| `mydocs/plans/task_m020_68.md` | `mydocs/plans/` | `mydocs/plans/task_m020_68.md` | OK | 수행계획서 |
| `mydocs/plans/task_m020_68_impl.md` | `mydocs/plans/` | `mydocs/plans/task_m020_68_impl.md` | OK | 구현계획서 |
| `mydocs/working/task_m020_68_stage{N}.md` | `mydocs/working/` | `mydocs/working/task_m020_68_stage{N}.md` | OK | 단계 보고서 |
| `mydocs/report/task_m020_68_report.md` | `mydocs/report/` | `mydocs/report/task_m020_68_report.md` | OK | 최종 보고서 |

## 수용 기준 고정

- macOS `Show scroll bars: Always`, Chrome zoom 100%에서 선택한 이미지 오른쪽에 scrollbar gutter 유래 여백이 포함되지 않는다.
- selected visible capture와 visible viewport preview는 콘텐츠 viewport rect를 선택하되, source pixel mapping은 capture viewport size 기준을 사용한다.
- viewport 밖 selected stitching과 full-page stitching은 tile segment 크기와 capture source mapping 크기를 분리한다.
- Copy와 Save는 같은 corrected PNG data URL을 사용한다.
- 흰 픽셀 trim, 이미지 wrapper 휴리스틱 변경, 권한 확대는 하지 않는다.
- `debugger`, `<all_urls>`, broad host permission은 추가하지 않는다.

## Stage 1 — capture viewport source mapping 회귀 고정

### 산출물

신규:

- `mydocs/working/task_m020_68_stage1.md`

수정:

- `tests/shared/crop-image.test.ts`
- `tests/shared/stitch-image.test.ts`
- `tests/content/overlay/full-page-capture.test.ts`
- `tests/content/overlay/phase6-regression.test.ts`

### 변경 내용

- `clientWidth=1440`, capture viewport width `1452`, selected rect `36..756` 같은 Always scroll bars 재현 수식을 테스트로 고정한다.
- 기존 `clientWidth` 기준이면 `720px` 선택이 `726px`처럼 과대 mapping되는 반례를 설명하고, capture viewport 기준 기대값을 `720px`로 둔다.
- `getSourceCropRect()`는 input contract를 유지하되, 테스트 이름과 fixture에서 `viewportCssSize`가 "capture viewport CSS size"임을 명확히 한다.
- `stitch-image` source crop 테스트에도 tile capture image natural size와 capture viewport size가 일치해야 함을 반영한다.
- full-page metrics 테스트에는 tile planning용 viewport와 capture source mapping용 viewport가 다를 수 있는 fixture를 추가한다.

### 검증

```bash
npm test -- tests/shared/crop-image.test.ts tests/shared/stitch-image.test.ts tests/content/overlay/full-page-capture.test.ts tests/content/overlay/phase6-regression.test.ts
rg -n "Always scroll|capture viewport|clientWidth|innerWidth|scrollbar" tests src mydocs/plans/task_m020_68_impl.md
git diff --check
```

### 커밋

```text
Task #68 Stage 1: capture viewport 회귀 테스트 고정
```

## Stage 2 — visible selected/viewport capture 보정

### 산출물

신규:

- `mydocs/working/task_m020_68_stage2.md`

수정:

- `src/content/overlay/crop-overlay.ts`
- `tests/content/overlay/phase6-regression.test.ts`

### 변경 내용

- `crop-overlay.ts`에 capture source mapping용 viewport size helper를 추가한다. 기본값은 `window.innerWidth/innerHeight`이고, 비정상 값이면 기존 `ViewportMetrics.clientWidth/clientHeight`로 fallback한다.
- `captureVisibleSelectedRegion()`에서 `viewportRect`는 기존처럼 콘텐츠 viewport 기준으로 clip하되, `cropPngDataUrl()`에는 capture viewport size를 전달한다.
- `captureVisibleViewportRegion()`도 선택 rect는 콘텐츠 viewport 전체로 유지하고, source mapping만 capture viewport size로 수행한다.
- `recordCaptureSuccess()` metadata는 output PNG size가 corrected source rect 기준임을 유지한다.
- overlay 숨김, prompt/action button 오염 방지, Copy/Save 공통 data URL 흐름은 변경하지 않는다.

### 검증

```bash
npm run typecheck
npm test -- tests/shared/crop-image.test.ts tests/content/overlay/phase6-regression.test.ts
rg -n "innerWidth|innerHeight|cropPngDataUrl|viewportCssSize|captureVisibleSelectedRegion|captureVisibleViewportRegion|captureVisibleTab" src/content/overlay/crop-overlay.ts tests/content/overlay/phase6-regression.test.ts
git diff --check
```

### 커밋

```text
Task #68 Stage 2: visible capture viewport 기준 보정
```

## Stage 3 — tiled capture viewport 계약 분리

### 산출물

신규:

- `mydocs/working/task_m020_68_stage3.md`

수정:

- `src/content/overlay/full-page-capture.ts`
- `src/shared/stitch-image.ts`
- `src/content/overlay/crop-overlay.ts`
- `tests/content/overlay/full-page-capture.test.ts`
- `tests/shared/stitch-image.test.ts`
- `tests/content/overlay/phase6-regression.test.ts`

### 변경 내용

- `FullPageMetrics`에 tile planning viewport와 별도로 capture viewport CSS size를 표현할 필드를 추가한다.
- `readFullPageMetrics()`는 `viewportWidth/viewportHeight`에는 콘텐츠 viewport 크기를 유지하고, capture viewport에는 `window.innerWidth/innerHeight`를 사용한다.
- `FullPageTilePlan.viewportCssSize`가 source mapping에 쓰이는 현재 계약을 `captureViewportCssSize`로 분리하거나 이름/역할을 명확히 정리한다.
- `capturePageRectTiles()`와 `captureFullPageTiles()`가 tile crop/destination rect는 콘텐츠 좌표계로 유지하고, `stitchCapturedTiles()`에는 capture viewport size를 전달하도록 보정한다.
- `stitch-image.ts`는 source crop rect 계산과 preview tile layout에서 capture viewport size와 output/destination scale을 혼동하지 않도록 테스트 가능한 helper 계약을 정리한다.
- full-page 및 viewport 밖 selected stitching에서 인접 tile edge alignment가 유지되는지 회귀 테스트를 추가한다.

### 검증

```bash
npm run typecheck
npm test -- tests/content/overlay/full-page-capture.test.ts tests/shared/stitch-image.test.ts tests/content/overlay/phase6-regression.test.ts
rg -n "captureViewport|viewportCssSize|destinationCssRect|viewportCropRect|stitchCapturedTiles|capturePageRectTiles|captureFullPageTiles" src tests
git diff --check
```

### 커밋

```text
Task #68 Stage 3: tiled capture viewport 계약 분리
```

## Stage 4 — 통합 검증과 Always scroll bars smoke

### 산출물

신규:

- `mydocs/working/task_m020_68_stage4.md`
- `mydocs/report/task_m020_68_report.md`

수정:

- `mydocs/orders/20260612.md`
- 필요 시 Stage 1~3에서 발견된 보정 대상 파일

### 변경 내용

- 전체 자동 검증을 수행한다.
- `/private/tmp/crop-task68/dist` 또는 현 브랜치 build output으로 Chrome unpacked extension smoke 기준을 정리한다.
- macOS `Show scroll bars: Always`, Chrome zoom 100%에서 LG CNS 재현 페이지 이미지 선택 후 Copy/Save 결과를 확인한다.
- 가능하면 작업지시자 smoke 결과와 자동 테스트 결과를 Stage 4 보고서와 최종 보고서에 분리 기록한다.
- 오늘할일을 완료 상태로 갱신하고 최종 보고서를 작성한다.

### 검증

```bash
npm run build
npm run typecheck
npm test
rg -n "debugger|<all_urls>|host_permissions|captureVisibleTab" manifest.json src tests
rg -n "#68|Always scroll|capture viewport|scrollbar|innerWidth|captureViewport" src tests mydocs/plans/task_m020_68.md mydocs/plans/task_m020_68_impl.md mydocs/report/task_m020_68_report.md
git diff --check
git status --short
```

수동 smoke:

- macOS `System Settings > Appearance > Show scroll bars`를 `Always`로 둔다.
- Chrome을 완전히 종료 후 재실행한다.
- Chrome zoom 100%에서 `https://www.lgcns.com/kr/service/biz-data/big-data-platform`를 연다.
- "고객 기업 환경에 맞게 구축" 이미지 선택 후 Copy와 Save를 각각 확인한다.
- 저장 PNG 오른쪽에 순백 gutter가 붙지 않고 원본 이미지 표시 비율과 일치하는지 확인한다.

### 커밋

```text
Task #68 Stage 4 + 최종 보고서: Always scroll bars 캡처 보정 완료
```

## 검증

- 각 Stage 검증 명령은 단계 보고서 작성 전에 실행한다.
- 실패한 검증은 단계 완료로 처리하지 않는다.
- 계획 변경이 필요하면 구현계획서를 먼저 갱신하고 작업지시자 승인을 받는다.
- 문서 위치가 수행계획서 판단과 달라지면 구현 전에 수행계획서 또는 구현계획서를 갱신하고 작업지시자 승인을 받는다.

## 커밋

- 구현계획서 자체는 `Task #68: 구현계획서 작성` 커밋으로 별도 기록한다.
- 단계 커밋은 단계 산출물과 `mydocs/working/task_m020_68_stage{N}.md`를 함께 묶는다.
- 커밋 메시지는 `Task #68 Stage {N}: {핵심 내용 요약}` 형식을 따른다.
- 마지막 단계가 최종 보고서를 포함하면 `Task #68 Stage 4 + 최종 보고서: Always scroll bars 캡처 보정 완료` 형식을 사용한다.

## 단계 의존성

- Stage 2는 Stage 1에서 capture viewport source mapping 기대값이 고정된 뒤 진행한다.
- Stage 3은 Stage 2의 visible selected/viewport capture 경로가 통과한 뒤 진행한다.
- Stage 4는 Stage 3의 tiled capture 계약과 focused regression이 통과한 뒤 진행한다.
- 최종 결과보고서와 PR 게시 절차는 Stage 4 완료보고서 승인 후 진행한다.

## 위험과 대응

- **tile planning 회귀**: full-page tile segment는 콘텐츠 viewport 기준을 유지하고, capture source mapping만 별도 viewport size를 사용한다.
- **source/destination scale 혼동**: source crop은 capture viewport size, destination rect는 output scale 기준으로 유지하고 tests로 edge alignment를 고정한다.
- **horizontal scrollbar 환경**: `innerHeight`와 `clientHeight` 차이도 같은 helper/metrics로 처리한다.
- **headless 환경 차이**: 자동 테스트는 수식 회귀를 고정하고, 실제 Chrome/macOS smoke는 별도 기록한다.
- **권한 확대 유혹**: `captureVisibleTab()` 기반 MV3 경계를 유지하고 `debugger`, `<all_urls>`, broad host permission을 추가하지 않는다.
- **정상 흰 콘텐츠 손상**: 색상 기반 trim을 사용하지 않고 좌표 변환만 보정한다.

## 승인 요청 사항

- Stage 1~4 분할과 각 Stage 산출물
- visible capture를 먼저 보정하고 tiled capture 계약 분리를 별도 Stage로 진행하는 순서
- capture source mapping에는 `window.innerWidth/innerHeight` 계열을 사용하고, DOM 선택/overlay/tile planning에는 콘텐츠 viewport 기준을 유지하는 설계
- 흰 픽셀 trim, 권한 확대, 이미지 wrapper 휴리스틱 변경을 제외하는 기준
- 구현계획서에 명시한 검증 명령과 단계별 커밋 메시지
