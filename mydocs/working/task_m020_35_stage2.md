# Task #35 Stage 2 완료 보고서

GitHub Issue: [#35](https://github.com/postmelee/crop/issues/35)
구현계획서: [`task_m020_35_impl.md`](../plans/task_m020_35_impl.md)
Stage: 2

## 단계 목적

Stage 1에서 만든 stitching downscale helper가 실제 full page/selected capture 경로에서 쓰일 수 있도록, full page tile plan 단계의 oversized output 차단을 제거하고 stitch-time output plan으로 책임을 옮긴다. 또한 overlay action result에 downscale metadata가 유지되는지 회귀 테스트로 고정한다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `src/content/overlay/full-page-capture.ts` | `MAX_CAPTURE_*` 기반 estimated output preflight reject를 제거하고, viewport/document bounds의 non-empty 검증만 유지했다. |
| `src/content/overlay/crop-overlay.ts` | stitched selected/full page result의 `sourceScale`, `outputScale`, `downscaleRatio`, `downscaled` metadata를 capture result와 host dataset에 전달하도록 했다. |
| `tests/content/overlay/full-page-capture.test.ts` | oversized full page tile plan이 성공하고 `getStitchOutputPixelPlan()`에서 downscale되는지 검증하도록 테스트를 바꿨다. |
| `tests/content/overlay/phase6-regression.test.ts` | full page/selected capture runtime이 stitch metadata와 downscale dataset 계약을 유지하는지 grep 회귀를 추가했다. |

## 본문 변경 정도 / 본문 무손실 여부

코드 변경이다. full page/selected tile 생성, scroll restoration, overlay hiding, full page `index > 0` fixed/sticky suppression, selected 전체 tile suppression 정책은 유지했다. 변경된 동작은 oversized output을 tile plan 단계에서 실패시키지 않고, 실제 captured image scale을 아는 `stitchCapturedTiles()` 단계에서 downscale 여부를 결정하는 것이다.

## 검증 결과

실행 명령:

```bash
npm run typecheck
npm test -- tests/shared/stitch-image.test.ts tests/content/overlay/full-page-capture.test.ts tests/content/overlay/phase6-regression.test.ts
rg "MAX_CAPTURE|stitchCapturedTiles|captureFullPageTiles|capturePageRectTiles|setCapturePageChromeSuppressed" src tests
git diff --check
```

결과:

- OK: `npm run typecheck` 통과 (`tsc --noEmit`).
- OK: focused test 통과. `stitch-image.test.ts` 9개, `full-page-capture.test.ts` 15개, `phase6-regression.test.ts` 25개, 총 49개 통과.
- OK: grep으로 `MAX_CAPTURE` 정책이 `stitch-image` helper/test에 남고, full page/selected capture는 `stitchCapturedTiles()`와 기존 suppression hook을 유지하는 것을 확인했다.
- OK: `git diff --check` 경고 없음.

## 잔여 위험

- 실제 oversized full page browser smoke는 아직 수행하지 않았다. Stage 3 문서/품질 기준에서 수동 smoke 절차를 추가하고, Stage 4 최종 검증에서 한계를 기록한다.
- downscale metadata는 internal dataset과 `__cropLastCaptureResult`에 남지만, 사용자-facing UI 문구는 아직 추가하지 않았다. Stage 3에서 README/품질 문서만 좁게 갱신한다.
- full page/selected capture가 큰 페이지에서 단일 PNG를 만들 수 있어도, capture tile 수와 PNG encoding 비용은 남는다.

## 다음 단계 영향

- Stage 3은 README 계열의 “큰 canvas 오류” 제한 문구를 “자동 downscale 가능, layout shift 한계 유지” 기준으로 갱신해야 한다.
- Stage 3은 Phase 6 품질 매트릭스에 #35 oversized full page downscale fallback 기준과 수동 smoke 항목을 추가해야 한다.
- Stage 4에서 전체 `npm test`와 권한 grep을 다시 실행해 `debugger`, `<all_urls>`가 추가되지 않았음을 최종 보고에 남긴다.

## 승인 요청

- Stage 2 산출물과 검증 결과를 승인하면 Stage 3 문서와 품질 매트릭스 갱신으로 진행한다.
