# Task #41 구현계획서

수행계획서: [`task_m020_41.md`](task_m020_41.md)
GitHub Issue: [#41](https://github.com/postmelee/crop/issues/41)
마일스톤: M020

## 단계 개요

| Stage | 제목 | 주요 산출 | 검증 |
|---|---|---|---|
| 1 | preview renderer contract 고정 | `task_m020_41_stage1.md`, preview/capture/stitching source 분석 | source grep, 관련 파일 확인, diff |
| 2 | tiled preview model과 DOM 구조 구현 | `crop-template.ts`, `crop-overlay.ts`, `crop-overlay.css`, phase6 regression | typecheck, phase6 focused test, DOM/CSS grep |
| 3 | Save/Copy 책임 분리와 scale 정렬 검증 | `crop-overlay.ts`, `stitch-image.ts`, full-page/stitch tests, phase6 regression | typecheck, full-page/stitch/phase6 focused tests, metadata grep |
| 4 | 통합 검증과 실제 긴 페이지 smoke | 품질 매트릭스, Stage 4 보고서, 최종 보고서, 오늘할일 | build, typecheck, full test, permission grep, manual smoke |

## 문서 위치 확인

수행계획서의 "문서 위치 판단"과 실제 Stage 산출물 경로를 다음과 같이 일치시킨다. 공식 사용자 문서 루트는 만들지 않고, 내부 품질 기준과 작업 산출물만 갱신한다.

| 파일 | 수행계획서상 선택 위치 | Stage 산출물 경로 | 일치 여부 | 비고 |
|---|---|---|---|---|
| `mydocs/tech/task_m020_8_quality_matrix.md` | `mydocs/tech/` | `mydocs/tech/task_m020_8_quality_matrix.md` | OK | P6-41 품질 기준과 수동 smoke 결과 갱신 |
| `mydocs/plans/task_m020_41.md` | `mydocs/plans/` | `mydocs/plans/task_m020_41.md` | OK | 수행계획서 |
| `mydocs/plans/task_m020_41_impl.md` | `mydocs/plans/` | `mydocs/plans/task_m020_41_impl.md` | OK | 구현계획서 |
| `mydocs/working/task_m020_41_stage{N}.md` | `mydocs/working/` | `mydocs/working/task_m020_41_stage{N}.md` | OK | 단계 보고서 |
| `mydocs/report/task_m020_41_report.md` | `mydocs/report/` | `mydocs/report/task_m020_41_report.md` | OK | 최종 보고서 |

## 수용 기준 고정

- 매우 긴 실제 GitHub 페이지에서 full page preview modal을 빠르게 스크롤해도 새로 노출되는 edge에 흰색 또는 회색 blank band가 보이지 않는다.
- Save/Copy 결과 PNG는 기존 stitched PNG dataUrl을 사용하고 preview tile DOM이 저장 결과에 섞이지 않는다.
- Visible viewport preview는 기존 단일 image preview, 내부 스크롤 없음, `object-fit: contain` 동작을 유지한다.
- Full page preview toolbar, Copy/Save/Cancel/Retry button, keyboard shortcut 동작을 유지한다.
- Full page 저장 PNG 해상도 개선, multi-part/PDF export, tile virtualization은 이번 task에서 제외한다.
- `debugger`, `<all_urls>`, broad host permission은 추가하지 않는다.

## Stage 1 — preview renderer contract 고정

### 산출물

신규:

- `mydocs/working/task_m020_41_stage1.md`

수정:

- 없음

### 변경 내용

- `CropCapturePipelineResult`의 현재 역할을 사용자 action용 결과와 preview 표시용 결과로 분리할 설계 contract를 고정한다.
- `crop-template.ts`의 `CropPreviewTemplate`, `.crop-preview-image`, `.crop-preview-surface` DOM 구조를 분석하고 tiled preview에 필요한 wrapper/layer 요소를 정의한다.
- `captureFullPageRegion()`의 `captureFullPageTiles()` 결과와 `stitchCapturedTiles()` 결과 사이에서 보존해야 할 tile metadata를 정리한다.
- Preview tile은 외부 wrapper를 `outputScale`이 적용된 destination rect에 배치하고, 내부 screenshot image를 `viewportCropRect` offset으로 이동시키는 방식으로 고정한다.
- Visible preview는 단일 image path를 유지하고 full page mode만 tiled renderer를 사용한다는 분기 조건을 고정한다.

### 검증

```bash
rg "interface CropCapturePipelineResult|CropPreviewTemplate|setPreviewCaptureResult|crop-preview-image|captureFullPageTiles|stitchCapturedTiles|destinationCssRect|viewportCropRect|outputScale|downscale" src tests
rg "P6-41|tiled preview|preview renderer|#41" mydocs/plans/task_m020_41.md mydocs/plans/task_m020_41_impl.md mydocs/tech/task_m020_8_quality_matrix.md
git diff --check
```

### 커밋

```text
Task #41 Stage 1: tiled preview contract 고정
```

## Stage 2 — tiled preview model과 DOM 구조 구현

### 산출물

신규:

- `mydocs/working/task_m020_41_stage2.md`

수정:

- `src/content/overlay/crop-template.ts`
- `src/content/overlay/crop-overlay.ts`
- `src/content/overlay/crop-overlay.css`
- `tests/content/overlay/phase6-regression.test.ts`

### 변경 내용

- `CropPreviewTemplate`에 full page tiled preview container/layer를 추가한다.
- `CropCapturePipelineResult`에 preview 표시 모델을 추가한다. 권장 형태는 단일 이미지 preview와 tiled preview를 구분하는 discriminated union이다.
- Full page capture result에는 stitched PNG dataUrl과 별도로 preview tile dataUrl, `viewportCssSize`, `viewportCropRect`, `destinationCssRect`, `outputScale`, `outputWidth`, `outputHeight`를 전달한다.
- `setPreviewCaptureResult()`를 단일 image renderer와 tiled renderer로 분기한다.
- Tiled renderer는 wrapper width/height를 stitched output 표시 크기로 설정하고, 각 tile wrapper를 absolute 배치한다.
- 각 tile wrapper는 `overflow: hidden`으로 source crop 영역만 보여주고, 내부 image는 `viewportCropRect`와 `outputScale` 기준으로 offset/size를 설정한다.
- Full page mode에서는 `.crop-preview-image`를 숨기거나 src를 비우고 tiled layer를 표시한다. Visible mode에서는 기존 image path를 유지한다.
- Phase 6 regression에 preview template이 tiled layer를 갖고, visible preview no-scroll contract가 유지되는지 확인하는 조건을 추가한다.

### 검증

```bash
npm run typecheck
npm test -- tests/content/overlay/phase6-regression.test.ts
rg "crop-preview-tiled|crop-preview-tile|crop-preview-image|CropPreviewTemplate|setPreviewCaptureResult|previewModel|data-crop-capture-mode" src tests
git diff --check
```

### 커밋

```text
Task #41 Stage 2: full page tiled preview DOM 구현
```

## Stage 3 — Save/Copy 책임 분리와 scale 정렬 검증

### 산출물

신규:

- `mydocs/working/task_m020_41_stage3.md`

수정:

- `src/content/overlay/crop-overlay.ts`
- `src/content/overlay/full-page-capture.ts`
- `src/shared/stitch-image.ts`
- `tests/content/overlay/full-page-capture.test.ts`
- `tests/shared/stitch-image.test.ts`
- `tests/content/overlay/phase6-regression.test.ts`

### 변경 내용

- Copy/Save action은 preview model이 아니라 기존 stitched PNG `dataUrl`만 사용한다는 contract를 테스트로 고정한다.
- Full page preview tile model이 `stitchCapturedTiles()`의 output scale/downscale 결과와 같은 좌표계로 배치되는지 helper 또는 테스트 fixture를 추가한다.
- Downscale이 발생하는 긴 페이지 조건에서 tile display rect가 adjacent edge를 유지하는지 검증한다.
- `captureFullPageTiles()`의 tile metadata가 preview에 필요한 최소 정보만 전달되는지 확인한다.
- Selected page rect stitching과 visible viewport crop에는 tiled preview model이 적용되지 않는지 regression을 둔다.
- 필요 시 `stitch-image.ts`의 기존 helper를 export하거나 테스트 가능한 helper를 추가하되, 저장 PNG draw algorithm 자체는 변경하지 않는다.

### 검증

```bash
npm run typecheck
npm test -- tests/content/overlay/full-page-capture.test.ts tests/shared/stitch-image.test.ts tests/content/overlay/phase6-regression.test.ts
rg "stitchCapturedTiles|destinationCssRect|viewportCropRect|outputScale|downscaleRatio|previewModel|tileCount|dataUrl" src tests
git diff --check
```

### 커밋

```text
Task #41 Stage 3: preview tile scale 정렬 검증
```

## Stage 4 — 통합 검증과 실제 긴 페이지 smoke

### 산출물

신규:

- `mydocs/working/task_m020_41_stage4.md`
- `mydocs/report/task_m020_41_report.md`

수정:

- `mydocs/tech/task_m020_8_quality_matrix.md`
- `mydocs/orders/20260605.md`
- 필요 시 앞 단계에서 발견된 보정 파일

### 변경 내용

- P6-41을 #41 결과 기준으로 갱신한다.
- 긴 실제 GitHub 페이지에서 full page preview scroll 수동 smoke를 수행하고 결과를 Stage 4 보고서와 최종 보고서에 기록한다.
- 저장 PNG Save smoke 결과를 preview smoke와 분리해 기록한다.
- 전체 자동 검증과 권한 grep을 실행한다.
- 오늘할일을 완료 상태로 갱신하고 최종 보고서를 작성한다.

### 검증

```bash
npm run build
npm run typecheck
npm test
rg "debugger|<all_urls>|host_permissions|captureVisibleTab" manifest.json src tests
rg "P6-41|#41|tiled preview|crop-preview-tile|crop-preview-tiled|full page preview" src tests mydocs/tech/task_m020_8_quality_matrix.md mydocs/report/task_m020_41_report.md
git diff --check
git status --short
```

수동 smoke:

- `/private/tmp/crop-task41/dist`를 Chrome 확장으로 load한다.
- 긴 GitHub 페이지에서 full page preview를 열고 빠르게 위/아래로 스크롤한다.
- preview edge에 흰색/회색 blank band가 보이지 않는지 확인한다.
- 같은 preview에서 Save를 실행해 저장 PNG가 정상이고 preview tile DOM이 섞이지 않는지 확인한다.

### 커밋

```text
Task #41 Stage 4 + 최종 보고서: tiled preview 구현 완료
```

## 검증

- 각 Stage 검증 명령은 단계 보고서 작성 전에 실행한다.
- 실패한 검증은 단계 완료로 처리하지 않는다.
- 계획 변경이 필요하면 구현계획서를 먼저 갱신하고 작업지시자 승인을 받는다.
- 문서 위치가 수행계획서 판단과 달라지면 구현 전에 수행계획서 또는 구현계획서를 갱신하고 작업지시자 승인을 받는다.

## 커밋

- 구현계획서 자체는 `Task #41: 구현계획서 작성` 커밋으로 별도 기록한다.
- 단계 커밋은 단계 산출물과 `mydocs/working/task_m020_41_stage{N}.md`를 함께 묶는다.
- 커밋 메시지는 `Task #41 Stage {N}: {핵심 내용 요약}` 형식을 따른다.
- 마지막 단계가 최종 보고서를 포함하면 `Task #41 Stage 4 + 최종 보고서: tiled preview 구현 완료` 형식을 사용한다.

## 단계 의존성

- Stage 2는 Stage 1의 preview model, output coordinate, visible/full page 분기 contract가 확정된 뒤 진행한다.
- Stage 3은 Stage 2의 DOM/CSS 구조와 focused regression이 통과한 뒤 진행한다.
- Stage 4는 Stage 3에서 Save/Copy 책임 분리와 scale 정렬 검증이 통과한 뒤 진행한다.
- 최종 결과보고서와 PR 게시 절차는 Stage 4 완료보고서 승인 후 진행한다.

## 위험과 대응

- **메모리 사용량 증가**: tile dataUrl과 stitched PNG dataUrl을 함께 보관한다. 초기 구현은 정확성을 우선하고, 실제 blocker가 되면 virtualization 또는 tile lifecycle 축소를 별도 승인으로 다룬다.
- **tile source crop 누락**: viewport screenshot 전체를 tile rect에 단순 표시하면 잘못된 영역이 보인다. 반드시 `viewportCropRect` wrapper crop과 image offset을 적용한다.
- **downscale 좌표 오차**: 긴 페이지 downscale 조건에서는 `destinationCssRect`에 `outputScale`을 곱한 표시 좌표를 사용한다. adjacent edge tests로 고정한다.
- **Save/Copy 오염**: preview DOM은 사용자가 보는 UI일 뿐 저장 PNG source가 아니다. action 경로는 stitched PNG `dataUrl`만 쓰도록 regression을 둔다.
- **visible preview 회귀**: visible mode는 기존 `.crop-preview-image` path를 유지하고, full page mode만 tiled renderer로 분기한다.
- **권한 확대**: `debugger`, `<all_urls>`, host permission 추가 없이 현재 MV3 경계를 유지한다.
- **#37/#39 작업 충돌**: #41은 `/private/tmp/crop-task41` worktree와 `local/task41` 브랜치에서만 진행한다.

## 승인 요청 사항

- Stage 1~4 분할과 각 Stage 산출물
- Full page mode만 tiled preview를 쓰고 visible mode는 기존 단일 image path를 유지하는 기준
- Tiled preview 좌표계를 `outputScale` 적용 stitched output 표시 좌표로 잡는 기준
- Copy/Save는 기존 stitched PNG dataUrl만 사용하고 preview tile DOM을 저장 source로 쓰지 않는 기준
- Tile virtualization을 이번 task에서 제외하는 기준
- 구현계획서에 명시한 검증 명령과 단계별 커밋 메시지
