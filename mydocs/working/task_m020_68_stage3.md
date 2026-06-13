# Task #68 Stage 3 보고서

GitHub Issue: [#68](https://github.com/postmelee/crop/issues/68)
구현계획서: [`task_m020_68_impl.md`](../plans/task_m020_68_impl.md)
Stage: 3

## 단계 목적

Always scroll bars 환경에서 viewport 밖 selected stitching과 full-page stitching이 캡처 PNG의 실제 viewport 크기를 source mapping에 사용하도록 tiled capture 계약을 분리했다. 이번 단계의 목적은 tile planning과 destination rect는 콘텐츠 viewport 기준으로 유지하고, stitching source crop 및 tiled preview image sizing은 capture viewport 기준으로 수행하도록 명확히 나누는 것이다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `src/content/overlay/full-page-capture.ts` | `FullPageMetrics`와 `FullPageTilePlan`에 `captureViewportCssSize`를 추가했다. `readFullPageMetrics()`는 `window.innerWidth/window.innerHeight`를 capture viewport로 기록하고, captured tile은 실제 캡처 시점 metrics의 capture viewport size를 보존한다. |
| `src/shared/stitch-image.ts` | `StitchCapturedTileInput`과 `StitchPreviewTileLayoutInput`의 source mapping 기준 필드를 `captureViewportCssSize`로 분리했다. stitching scale/source crop과 preview image size가 capture viewport 기준을 사용하도록 변경했다. |
| `src/content/overlay/crop-overlay.ts` | selected page rect stitching, full-page stitching, tiled preview model, tiled preview render 호출이 captured tile의 `captureViewportCssSize`를 전달하도록 변경했다. |
| `tests/content/overlay/full-page-capture.test.ts` | classic scrollbar 환경에서 planning viewport `1440px`와 capture viewport `1452px`가 분리되어 plan과 captured tile에 유지되는지 확인하는 회귀 테스트를 추가했다. |
| `tests/shared/stitch-image.test.ts` | preview tile wrapper는 destination 기준으로 edge-aligned 상태를 유지하고, preview image size는 capture viewport 기준으로 커지는 회귀 테스트를 추가했다. |
| `tests/content/overlay/phase6-regression.test.ts` | tiled stitching/preview 경로가 더 이상 `captureResult.plan.viewportCssSize`를 source mapping에 쓰지 않도록 source regression을 추가했다. |

## 본문 변경 정도 / 본문 무손실 여부

tiled capture 내부 계약만 변경했다. tile segment 생성, scroll 위치 계산, destination CSS rect, Copy/Save 공통 data URL 흐름, overlay 숨김 및 page chrome suppression 순서는 유지했다. `viewportCssSize`는 planning viewport 의미로 남기고, source mapping에는 `captureViewportCssSize`를 사용하도록 분리했다.

## 검증 결과

실행 명령:

```bash
npm run typecheck
npm test -- tests/content/overlay/full-page-capture.test.ts tests/shared/stitch-image.test.ts tests/content/overlay/phase6-regression.test.ts
rg -n "captureViewport|viewportCssSize|destinationCssRect|viewportCropRect|stitchCapturedTiles|capturePageRectTiles|captureFullPageTiles" src tests
git diff --check
```

결과:

- OK: `npm run typecheck` 통과. `tsc --noEmit` 오류 없음.
- OK: focused test 3개 파일이 모두 통과했다. `tests/content/overlay/full-page-capture.test.ts` 17 tests, `tests/shared/stitch-image.test.ts` 13 tests, `tests/content/overlay/phase6-regression.test.ts` 32 tests, 총 62 tests 통과.
- OK: grep에서 `captureViewportCssSize`가 full-page metrics, captured tile, stitching input, preview layout, overlay 전달 경로에 반영되었고, 기존 planning `viewportCssSize`는 tile plan에 남아 있음을 확인했다.
- OK: `git diff --check` 경고 없음.

## 잔여 위험

- 자동 테스트는 좌표 변환 계약을 고정하지만, 실제 macOS Always scroll bars + Chrome unpacked extension smoke는 아직 수행하지 않았다.
- full-page 및 selected stitching이 실제 페이지에서 overlay/page chrome suppression 순서를 유지하는지는 Stage 4 통합 검증과 smoke에서 확인해야 한다.

## 다음 단계 영향

- Stage 4에서 `npm run build`, 전체 `npm test`, 권한 grep, macOS Always scroll bars 수동 smoke를 수행한다.
- 수동 smoke에서는 visible selected Copy/Save뿐 아니라 full-page preview 또는 viewport 밖 selected stitching이 가능한 경우도 함께 확인하면 Stage 3 계약까지 검증할 수 있다.

## 승인 요청

- Stage 3 산출물과 검증 결과를 승인하면 Stage 4로 진행한다.
