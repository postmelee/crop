# Task #41 Stage 2 보고서

GitHub Issue: [#41](https://github.com/postmelee/crop/issues/41)
구현계획서: [`task_m020_41_impl.md`](../plans/task_m020_41_impl.md)
Stage: 2

## 단계 목적

Full page preview modal에서 단일 초대형 `<img>` 대신 capture tile 조각을 표시할 수 있도록 preview model, DOM 구조, CSS renderer를 추가한다. 이번 단계는 구현계획서상 Stage 2이며, Save/Copy 결과 PNG 경로는 변경하지 않고 full page preview 표시 경로만 tiled renderer로 분기한다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `src/content/overlay/crop-template.ts` | `CropPreviewTemplate`에 `surface`, `tiled` 요소를 추가하고 `.crop-preview-surface`에 기존 image와 tiled layer를 함께 배치 |
| `src/content/overlay/crop-overlay.ts` | `CropPreviewModel` discriminated union 추가, full page capture result에 tiled preview model 추가, `setPreviewCaptureResult()`를 single image/tiled renderer로 분기 |
| `src/content/overlay/crop-overlay.css` | `.crop-preview-tiled`, `.crop-preview-tile`, `.crop-preview-tile-image` 스타일 추가, visible mode에서는 tiled layer 숨김 |
| `tests/content/overlay/phase6-regression.test.ts` | full page preview pipeline regression에 tiled DOM/CSS/model/render branch 기대값 추가 |
| `mydocs/working/task_m020_41_stage2.md` | Stage 2 구현 내용, 검증 결과, 잔여 위험 기록 |
| `mydocs/orders/20260605.md` | #41 상태 비고를 Stage 2 완료 후 승인 대기로 갱신 |

## 본문 변경 정도 / 본문 무손실 여부

코드 변경이다. 기존 Save/Copy action은 `performPreviewAction()`에서 계속 `previewResult.dataUrl`을 clipboard/download 경로에 전달한다. `dataUrl`은 기존 stitched PNG 결과로 유지했고, tiled preview model은 `previewModel` 표시 전용 필드로 추가했다. visible viewport preview는 기존 `.crop-preview-image` 단일 image path를 유지한다.

## 구현 내용

- `CropCapturePipelineResult`에 `previewModel?: CropPreviewModel`을 추가했다.
- `CropPreviewModel`은 `kind: "single-image"`와 `kind: "tiled"`를 구분한다.
- visible viewport preview capture 결과에는 `single-image` preview model을 넣어 기존 image renderer로 표시한다.
- full page capture 결과에는 stitched PNG `dataUrl`과 별도로 tiled preview model을 넣었다.
- tiled preview model은 각 tile의 `dataUrl`, `viewportCropRect`, `destinationCssRect`, `viewportCssSize`, 그리고 stitching 결과의 `outputWidth`, `outputHeight`, `outputScale`을 가진다.
- `renderTiledPreviewModel()`은 tiled layer root 크기를 `outputWidth/outputHeight`로 잡고, 각 tile wrapper를 `getStitchDestinationPixelRect(destinationCssRect, outputScale)` 결과로 absolute 배치한다.
- 각 tile image는 viewport screenshot 전체를 `viewportCssSize * outputScale` 크기로 표시하고, `viewportCropRect * outputScale` offset을 적용해 wrapper 내부에 source crop만 보이게 했다.
- host에는 `data-crop-preview-renderer="image|tiled"`를 남겨 수동/자동 검증 시 renderer 분기를 확인할 수 있게 했다.

## 검증 결과

실행 명령:

```bash
npm run typecheck
npm test -- tests/content/overlay/phase6-regression.test.ts
rg "crop-preview-tiled|crop-preview-tile|crop-preview-image|CropPreviewTemplate|setPreviewCaptureResult|previewModel|data-crop-capture-mode" src tests
git diff --check
```

결과:

- OK: `npm run typecheck` 통과 (`tsc --noEmit`).
- OK: focused test 통과. `tests/content/overlay/phase6-regression.test.ts` 26개 테스트 통과.
- OK: DOM/CSS/runtime grep에서 tiled layer, tile wrapper, tile image, `previewModel`, visible mode override, `setPreviewCaptureResult()` 분기를 확인했다.
- OK: `git diff --check` 통과.

## 잔여 위험

- Stage 2는 DOM/model 구현과 focused regression까지만 다룬다. 실제 긴 페이지에서 gray/white band가 사라지는지는 Stage 4 수동 smoke 전까지 확정할 수 없다.
- tiled preview는 stitched PNG와 tile dataUrl을 동시에 보관하므로 메모리 사용량이 늘 수 있다. 구현계획서 기준대로 virtualization은 이번 task에서 제외했다.
- `viewportCropRect * outputScale` offset은 Stage 1 contract를 따른다. downscale edge alignment와 Save/Copy 책임 분리는 Stage 3 focused tests로 추가 고정해야 한다.

## 다음 단계 영향

- Stage 3은 Copy/Save가 preview model이 아니라 stitched PNG `dataUrl`만 사용하는 계약을 테스트로 고정해야 한다.
- Stage 3은 tiled preview tile 배치가 `stitch-image.ts`의 destination snapping과 같은 좌표계를 쓰는지 focused helper/test로 고정해야 한다.
- Stage 3은 selected page rect stitching과 visible viewport crop에 tiled preview model이 섞이지 않는지 회귀 범위를 확인해야 한다.

## 승인 요청

- Stage 2 산출물과 검증 결과를 승인하면 Stage 3 Save/Copy 책임 분리와 scale 정렬 검증으로 진행한다.
