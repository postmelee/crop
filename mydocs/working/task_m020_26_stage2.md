# Task #26 Stage 2 완료 보고서

GitHub Issue: [#26](https://github.com/postmelee/crop/issues/26)
구현계획서: [`task_m020_26_impl.md`](../plans/task_m020_26_impl.md)
Stage: 2

## 단계 목적

Stage 1에서 고정한 선택 rect tile/stitch 계약을 실제 selected Save/Copy 경로에 연결한다. 현재 viewport 안에 완전히 들어온 선택 영역은 기존 단일 visible crop 경로를 유지하고, viewport를 벗어난 선택 영역만 선택 rect stitching 경로로 분기하는 것이 목적이다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `src/content/overlay/crop-overlay.ts` | `captureSelectedRegion()`에 viewport 완전 포함 판정을 추가하고, viewport 밖 선택 영역을 `captureSelectedPageRectRegion()` stitching 경로로 분기했다. |
| `src/content/overlay/full-page-capture.ts` | `capturePageRectTiles()`를 추가하고 full page/selected rect capture loop가 같은 내부 `captureTiles()`를 재사용하도록 정리했다. |
| `tests/content/overlay/full-page-capture.test.ts` | 선택 rect capture loop가 타일을 캡처하고 시작 scroll 위치를 복구하는 테스트를 추가했다. |
| `tests/content/overlay/phase6-regression.test.ts` | selected rect stitching runtime 연결 문자열 회귀를 추가했다. |

## 본문 변경 정도 / 본문 무손실 여부

코드 변경이다. 기존 full page capture와 현재 viewport 안 selected capture의 public 동작은 유지했다. 새 분기는 `clipPageRectToViewport()` 결과가 없거나 선택 page rect 전체가 현재 viewport에 완전히 포함되지 않는 경우에만 실행된다. selected stitching 결과는 기존 selected action pipeline과 호환되도록 `mode: "visible"`을 유지하고 `tileCount`만 추가 metadata로 남긴다.

## 검증 결과

실행 명령:

```bash
npm run build
npm run typecheck
npm test
rg "captureSelectedRegion|clipPageRectToViewport|captureFullPageTiles|stitchCapturedTiles|scrollTo|tileCount|Selected" src tests
git diff --check
```

결과:

- OK: `npm run build` 통과. Vite production build 완료.
- OK: `npm run typecheck` 통과 (`tsc --noEmit`).
- OK: `npm test` 통과. 16 files, 185 tests.
- OK: grep으로 selected capture 분기, full page capture loop, stitching, scroll 복구, tileCount metadata 경로를 확인했다.
- OK: `git diff --check` 경고 없음.

## 잔여 위험

- viewport 밖 selected capture는 `captureVisibleTab()` 제약 때문에 tile마다 scroll 이동이 보일 수 있다. 이번 단계에서는 선택 rect bounds로 tile 수를 제한하고 시작 scroll 위치 복구를 보장했다.
- fixed/sticky 요소의 픽셀 단위 일치성은 아직 수동 fixture smoke로 검증하지 않았다. Stage 3에서 fixture와 품질 매트릭스 기준으로 확인한다.
- 실제 저장 PNG dimension은 브라우저 runtime smoke가 필요하다. 자동 테스트는 tile plan/capture loop/metadata 경로를 검증했다.

## 다음 단계 영향

- Stage 3은 phase6 fixture에서 스크롤 후 선택 영역 저장 시나리오를 재현 가능하게 보강하고, 저장 결과 크기와 overlay 미포함 수동 smoke 기준을 품질 매트릭스에 반영해야 한다.
- selected stitching 경로는 `host.dataset.cropCaptureTileCount`를 남기므로 수동 검증 시 tile capture 여부를 함께 확인할 수 있다.

## 승인 요청

- Stage 2 산출물과 검증 결과를 승인하면 Stage 3 fixture 회귀와 품질 문서 보강으로 진행한다.
