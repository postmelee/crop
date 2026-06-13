# Task #68 Stage 2 보고서

GitHub Issue: [#68](https://github.com/postmelee/crop/issues/68)
구현계획서: [`task_m020_68_impl.md`](../plans/task_m020_68_impl.md)
Stage: 2

## 단계 목적

Always scroll bars 환경에서 visible viewport 기반 Copy/Save 결과가 우측으로 넓어지는 문제를 visible capture 경로에서 보정했다. 이번 단계의 목적은 선택 영역과 viewport clipping은 기존 콘텐츠 viewport 기준을 유지하되, `captureVisibleTab()` PNG의 source pixel mapping에는 실제 캡처 viewport 크기인 `window.innerWidth/window.innerHeight`를 사용하도록 분리하는 것이다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `src/content/overlay/crop-overlay.ts` | `ViewportCssSize` 타입을 가져오고 `getCaptureViewportCssSize()` helper를 추가했다. `captureVisibleSelectedRegion()`과 `captureVisibleViewportRegion()`의 `cropPngDataUrl()` 호출에서 source mapping용 viewport size를 `window.innerWidth/window.innerHeight` 기준으로 전달하도록 변경했다. |
| `tests/content/overlay/phase6-regression.test.ts` | visible crop source mapping에 capture viewport helper와 두 호출부가 사용되는지 고정하는 source regression test를 추가했다. |

## 본문 변경 정도 / 본문 무손실 여부

visible capture의 source pixel mapping 기준만 변경했다. 선택 영역 계산, viewport clipping, overlay 숨김 처리, Copy/Save data URL 흐름, preview/action metadata는 유지했다. `window.innerWidth/window.innerHeight`가 유효하지 않은 경우에는 기존 `ViewportMetrics.clientWidth/clientHeight`로 fallback한다.

## 검증 결과

실행 명령:

```bash
npm run typecheck
npm test -- tests/shared/crop-image.test.ts tests/content/overlay/phase6-regression.test.ts
rg -n "innerWidth|innerHeight|cropPngDataUrl|viewportCssSize|captureVisibleSelectedRegion|captureVisibleViewportRegion|captureVisibleTab" src/content/overlay/crop-overlay.ts tests/content/overlay/phase6-regression.test.ts
git diff --check
```

결과:

- OK: `npm run typecheck` 통과. `tsc --noEmit` 오류 없음.
- OK: focused test 2개 파일이 모두 통과했다. `tests/shared/crop-image.test.ts` 12 tests, `tests/content/overlay/phase6-regression.test.ts` 31 tests, 총 43 tests 통과.
- OK: grep에서 `captureVisibleSelectedRegion()`과 `captureVisibleViewportRegion()`의 `cropPngDataUrl()` 호출이 `viewportCssSize: captureViewportCssSize`를 사용하고, helper가 `window.innerWidth/window.innerHeight`를 참조함을 확인했다.
- OK: `git diff --check` 경고 없음.

## 잔여 위험

- viewport 밖 선택 영역과 full-page preview의 tiled capture 경로는 아직 `captureResult.plan.viewportCssSize`를 source mapping에 사용한다. Stage 3에서 tile planning viewport와 capture source viewport를 분리해야 한다.
- macOS Always scroll bars 실제 브라우저 수동 smoke는 Stage 4에서 수행한다.

## 다음 단계 영향

- Stage 3에서는 `full-page-capture.ts`의 tile plan 계약을 확장해 layout/planning은 콘텐츠 viewport 기준으로 유지하고, tile image source mapping은 capture viewport 기준을 쓰도록 분리한다.
- Stage 3 테스트는 Stage 1에서 추가한 tiled source mapping fixture와 연결해 viewport 밖 selected capture와 full-page capture 모두를 확인해야 한다.

## 승인 요청

- Stage 2 산출물과 검증 결과를 승인하면 Stage 3으로 진행한다.
