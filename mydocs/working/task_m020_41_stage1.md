# Task #41 Stage 1 보고서

GitHub Issue: [#41](https://github.com/postmelee/crop/issues/41)
구현계획서: [`task_m020_41_impl.md`](../plans/task_m020_41_impl.md)
Stage: 1

## 단계 목적

Full page preview를 tiled renderer로 바꾸기 전에 현재 preview result, DOM/CSS, capture tile metadata, stitching output scale 계약을 코드 기준으로 고정한다. 이번 단계는 구현계획서상 Stage 1이며, 제품 코드는 수정하지 않고 Stage 2/3 구현 기준만 문서화한다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `mydocs/working/task_m020_41_stage1.md` | preview/action 책임 분리, DOM 확장 기준, tile metadata와 output scale 좌표 계약, Stage 2/3 인계 사항 기록 |
| `mydocs/orders/20260605.md` | #41 상태 비고를 Stage 1 완료 후 승인 대기로 갱신 |

## 본문 변경 정도 / 본문 무손실 여부

소스 코드는 변경하지 않았다. 이번 단계의 본문 변경은 신규 Stage 보고서와 오늘할일 상태 갱신뿐이며, 기존 문서 원문은 필요한 상태 문구만 최소 수정했다.

## 현재 preview result와 action 계약

- `src/content/overlay/crop-overlay.ts`의 `CropCapturePipelineResult`는 현재 `action`, `mode`, `dataUrl`, output 크기, tile/downscale metadata를 함께 가진다.
- `startVisibleViewportPreview()`와 `startFullPagePreview()`는 각각 `captureVisibleViewportRegion("copy")`, `captureFullPageRegion("copy")` 결과를 `previewCaptureResult`에 저장하고 `setPreviewCaptureResult()`에 넘긴다.
- `setPreviewCaptureResult()`는 현재 모든 preview mode에서 `template.preview.image.src = result.dataUrl`만 수행한다. 즉 full page preview도 Save/Copy용 stitched PNG dataUrl 한 장을 `<img class="crop-preview-image">`로 표시한다.
- `performPreviewAction()`은 preview action 시 `previewResult`를 복사해 `action`만 바꾼 뒤 `result.dataUrl`을 clipboard/download 경로에 전달한다.
- Stage 2/3 contract: Save/Copy는 계속 `CropCapturePipelineResult.dataUrl`의 stitched PNG만 사용한다. tiled preview DOM과 tile image dataUrl은 표시 전용 model이어야 하며 action source가 되면 안 된다.

## 현재 preview DOM/CSS 계약

- `src/content/overlay/crop-template.ts`의 preview DOM은 `crop-preview` container, `crop-preview-dialog`, `crop-preview-surface`, `img.crop-preview-image`, footer/actions/status로 구성된다.
- `.crop-preview-dialog`는 `overflow: hidden`, `border-radius: 6px`, `background: #44414f`를 사용한다.
- `.crop-preview-surface`는 full page mode에서 `overflow: auto`, `overscroll-behavior: contain`, `padding: 0 var(--crop-preview-inline-padding) 24px`, `background: #44414f`를 사용한다.
- `.crop-preview-image`는 `display: block`, `max-width: 100%`, `height: auto`로 단일 이미지 표시를 담당한다.
- visible viewport mode는 `:host([data-crop-capture-mode="visible"]) .crop-preview-surface`에서 `overflow: hidden`을 적용하고, image에 `max-height: 100%`, `object-fit: contain`을 적용한다.
- Stage 2 contract: `CropPreviewTemplate`에는 full page tiled preview용 container/layer를 추가한다. visible mode는 기존 `.crop-preview-image` path를 유지하고, full page mode에서만 tiled layer를 표시한다.

## capture tile metadata 계약

- `src/content/overlay/full-page-capture.ts`의 `FullPageTile`은 `pageRect`, `viewportCropRect`, `destinationCssRect`, scroll 좌표를 가진다.
- `createFullPageTilePlan()`은 full page bounds 기준으로 tile을 만들고, `destinationCssRect`를 output CSS 좌표계에서 계산한다.
- `captureTiles()`는 각 tile 위치로 scroll한 뒤 `captureVisibleTab()` dataUrl을 수집한다.
- `createCapturedFullPageTile()`은 실제 scroll 결과를 기준으로 `viewportCropRect`를 다시 계산하고, `destinationCssRect`는 계획된 output 위치를 유지한다.
- Stage 2 contract: full page preview tile model은 `CapturedFullPageTile.dataUrl`, `viewportCropRect`, `destinationCssRect`, `plan.viewportCssSize`, `plan.outputCssSize`를 보존해야 한다.

## stitching/output scale 계약

- `src/shared/stitch-image.ts`의 `stitchCapturedTiles()`는 첫 tile image와 viewport CSS size로 `sourceScale`을 산출한다.
- `getStitchOutputPixelPlan()`은 output CSS size와 source scale을 기준으로 canvas 제한을 넘으면 `downscaleRatio`를 적용하고, 실제 배치에 사용할 `outputScale`을 만든다.
- `getStitchDestinationPixelRect()`는 `destinationCssRect` edge에 `outputScale`을 곱하고 `Math.round()`로 final canvas pixel rect를 만든다.
- `getStitchSourcePixelRect()`는 `viewportCropRect`, image natural size, viewport CSS size로 source crop pixel rect를 만든다.
- `stitchCapturedTiles()`는 `context.drawImage(image, sourceRect..., destinationRect...)`로 저장 PNG를 만들고 `dataUrl`, `outputWidth`, `outputHeight`, `sourceScale`, `outputScale`, `downscaleRatio`, `downscaled`를 반환한다.
- Stage 2/3 contract: full page preview tile wrapper는 stitched output 표시 좌표계에 배치한다. 좌표는 `destinationCssRect * outputScale`로 산출해 저장 PNG와 같은 edge snapping 기준을 따라야 한다. 내부 screenshot image는 `viewportCropRect * outputScale` offset을 적용해 wrapper 안에서 source crop만 보이게 한다.

## Stage 2 구현 기준

- `CropCapturePipelineResult`는 action용 `dataUrl`과 표시용 preview model을 분리한다. 권장 형태는 visible single image와 full page tiled preview를 구분하는 discriminated union이다.
- full page preview result는 stitched PNG `dataUrl`을 유지하면서, 표시용 tile model에 tile `dataUrl`, `viewportCropRect`, `destinationCssRect`, `viewportCssSize`, `outputWidth`, `outputHeight`, `outputScale`을 포함한다.
- tiled layer root는 `outputWidth`와 `outputHeight`를 기준으로 크기를 잡는다.
- 각 tile wrapper는 absolute positioning과 `overflow: hidden`을 사용한다.
- 각 inner image는 viewport screenshot 전체를 표시하되, `viewportCropRect` 기준 offset으로 실제 tile crop 영역만 wrapper에 보이게 한다.
- visible preview는 `.crop-preview-image.src = result.dataUrl` 경로를 유지하고, tiled layer는 비우거나 숨긴다.

## Stage 3 검증 기준

- preview tile 좌표 helper가 `getStitchDestinationPixelRect(destinationCssRect, outputScale)`와 같은 edge snapping 결과를 내는지 검증한다.
- downscale이 발생한 긴 페이지 조건에서 인접 tile wrapper의 right/left 또는 bottom/top edge가 맞는지 검증한다.
- Copy/Save action이 preview model을 읽지 않고 stitched PNG `dataUrl`만 쓰는지 regression으로 고정한다.
- selected page rect stitching과 visible viewport crop에는 tiled renderer가 적용되지 않는지 확인한다.

## 검증 결과

실행 명령:

```bash
rg "interface CropCapturePipelineResult|CropPreviewTemplate|setPreviewCaptureResult|crop-preview-image|captureFullPageTiles|stitchCapturedTiles|destinationCssRect|viewportCropRect|outputScale|downscale" src tests
rg "P6-41|tiled preview|preview renderer|#41" mydocs/plans/task_m020_41.md mydocs/plans/task_m020_41_impl.md mydocs/tech/task_m020_8_quality_matrix.md
git diff --check
```

결과:

- OK: `CropCapturePipelineResult`, `previewCaptureResult`, `setPreviewCaptureResult()`, `performPreviewAction()` 경로를 확인했다.
- OK: preview DOM은 현재 `dialog > footer/surface > img.crop-preview-image` 구조이고, tiled preview layer는 아직 없다.
- OK: full page capture는 `captureFullPageTiles()` 결과를 `stitchCapturedTiles()`에 전달해 stitched PNG dataUrl을 만든다.
- OK: tile metadata는 `viewportCropRect`, `destinationCssRect`, `viewportCssSize`를 이미 제공한다.
- OK: stitching은 `outputScale` 기준 destination pixel rect를 사용하고, downscale metadata를 result에 포함한다.
- OK: `git diff --check` 통과.

## 잔여 위험

- Stage 1은 contract 문서화만 수행했다. 실제 gray/white band 제거 여부는 Stage 2 구현 후 수동 smoke 전까지 확정할 수 없다.
- tile dataUrl과 stitched PNG dataUrl을 동시에 보관하면 메모리 사용량이 증가한다. 이번 task에서는 정확성을 우선하고 virtualization은 제외한다.
- preview tile DOM 좌표가 output pixel 좌표로 배치될 때 CSS pixel 표시 크기와 자연 이미지 pixel 비율을 혼동하면 scale 오차가 생길 수 있다. Stage 2 구현 시 helper를 작게 분리하고 Stage 3에서 focused test로 고정해야 한다.

## 다음 단계 영향

- Stage 2는 `crop-template.ts`에 tiled layer DOM을 추가하고, `crop-overlay.ts`에 full page 전용 preview model/render branch를 구현한다.
- Stage 2는 visible preview no-scroll/object-fit 경로를 그대로 유지해야 한다.
- Stage 3은 Save/Copy가 stitched PNG `dataUrl`만 쓰는 계약과 downscale edge alignment를 테스트로 고정해야 한다.

## 승인 요청

- Stage 1 산출물과 검증 결과를 승인하면 Stage 2 tiled preview model과 DOM 구조 구현으로 진행한다.
