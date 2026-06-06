# Task #41 Stage 3 보고서

GitHub Issue: [#41](https://github.com/postmelee/crop/issues/41)
구현계획서: [`task_m020_41_impl.md`](../plans/task_m020_41_impl.md)
Stage: 3

## 단계 목적

Stage 2에서 추가한 full page tiled preview가 Save/Copy 결과 경로를 침범하지 않도록 책임을 분리하고, tile preview 배치가 stitching의 output scale/downscale 좌표계와 같은 기준을 쓰는지 focused regression으로 고정한다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `src/shared/stitch-image.ts` | `getStitchPreviewTileLayout()` helper 추가. preview tile wrapper와 inner image rect를 stitching output scale 기준으로 계산 |
| `src/content/overlay/crop-overlay.ts` | tiled preview renderer가 새 helper를 사용하도록 변경. 직접 선택 visible capture action에는 표시 전용 `previewModel`을 붙이지 않도록 보정 |
| `tests/shared/stitch-image.test.ts` | preview tile wrapper가 stitched destination rect와 일치하고 downscale 후 인접 edge가 유지되는지 테스트 추가 |
| `tests/content/overlay/phase6-regression.test.ts` | preview Copy/Save가 stitched PNG `dataUrl`만 사용하고 selected capture action에 tiled preview model이 섞이지 않는지 regression 추가 |
| `mydocs/working/task_m020_41_stage3.md` | Stage 3 구현 내용, 검증 결과, 잔여 위험 기록 |
| `mydocs/orders/20260605.md` | #41 상태 비고를 Stage 3 완료 후 승인 대기로 갱신 |

## 본문 변경 정도 / 본문 무손실 여부

코드 변경이다. `stitchCapturedTiles()`의 저장 PNG draw algorithm은 변경하지 않았다. 새 helper는 이미 존재하는 `getStitchDestinationPixelRect()`와 같은 edge snapping 기준을 preview DOM 계산에 재사용하도록 분리한 것이다. Save/Copy action 경로는 기존처럼 `result.dataUrl`만 사용한다.

## 구현 내용

- `getStitchPreviewTileLayout()`을 추가해 preview tile wrapper rect와 inner image rect 계산을 순수 함수로 분리했다.
- tile wrapper rect는 `getStitchDestinationPixelRect(destinationCssRect, outputScale)` 결과를 그대로 사용한다.
- inner image rect는 `viewportCropRect`와 `viewportCssSize`를 `outputScale`로 변환해 wrapper 내부에 source crop만 보이도록 한다.
- `renderTiledPreviewModel()`은 직접 좌표 계산 대신 `getStitchPreviewTileLayout()` 결과만 CSS style로 반영한다.
- 직접 선택 visible capture action은 preview 표시 경로가 아니므로 `previewModel`을 제거했다.
- preview Copy/Save block이 `previewModel`이나 `template.preview`를 읽지 않고 `result.dataUrl`만 쓰는지 phase6 regression으로 고정했다.
- selected visible/page rect capture action block에 tiled preview model이 없는지 phase6 regression으로 고정했다.

## 검증 결과

실행 명령:

```bash
npm run typecheck
npm test -- tests/content/overlay/full-page-capture.test.ts tests/shared/stitch-image.test.ts tests/content/overlay/phase6-regression.test.ts
rg "stitchCapturedTiles|destinationCssRect|viewportCropRect|outputScale|downscaleRatio|previewModel|tileCount|dataUrl" src tests
git diff --check
```

결과:

- OK: `npm run typecheck` 통과 (`tsc --noEmit`).
- OK: focused test 통과. `full-page-capture`, `stitch-image`, `phase6-regression` 3개 파일 총 54개 테스트 통과.
- OK: grep으로 `stitchCapturedTiles`, `destinationCssRect`, `viewportCropRect`, `outputScale`, `downscaleRatio`, `previewModel`, `tileCount`, `dataUrl` 경로를 확인했다.
- OK: `git diff --check` 통과.

## 잔여 위험

- Stage 3은 좌표와 책임 분리를 자동 테스트로 고정했지만, 실제 Chrome compositor의 scroll paint artifact 제거 여부는 Stage 4의 긴 페이지 수동 smoke 전까지 확정할 수 없다.
- tiled preview가 초대형 DOM과 여러 dataUrl을 동시에 보관하는 메모리 비용은 남아 있다. 구현계획서 기준대로 virtualization은 이번 task에서 제외했다.
- full page preview의 시각적 기본 확대/축소 체감은 실제 긴 페이지 smoke에서 확인해야 한다.

## 다음 단계 영향

- Stage 4는 `npm run build`, `npm run typecheck`, `npm test`, 권한 grep, 실제 긴 GitHub 페이지 full page preview scroll smoke를 수행해야 한다.
- Stage 4는 P6-41 품질 매트릭스와 최종 보고서에 tiled preview smoke 결과와 저장 PNG Save smoke 결과를 분리해 기록해야 한다.

## 승인 요청

- Stage 3 산출물과 검증 결과를 승인하면 Stage 4 통합 검증과 실제 긴 페이지 smoke로 진행한다.
