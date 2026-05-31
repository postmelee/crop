# Task #15 Stage 1 보고서

GitHub Issue: [#15](https://github.com/postmelee/crop/issues/15)
구현계획서: [`task_m020_15_impl.md`](../plans/task_m020_15_impl.md)
Stage: 1

## 단계 목적

Firefox Screenshots의 full page bounds, DPR 반올림, tile stitching reference를 Chrome MV3에서 사용할 수 있는 순수 helper contract로 고정한다. Runtime scroll/capture 연결 전에 full page metrics, tile plan, source/destination pixel snapping, max canvas 방어 정책을 테스트로 검증하는 단계다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `src/content/overlay/full-page-capture.ts` | full page metrics 읽기, Firefox식 bounds contract, page 좌표 기준 tile plan, bottom/right partial tile source crop, estimated max canvas 방어 helper 추가 |
| `src/shared/stitch-image.ts` | capture tile stitching용 source/destination pixel snapping, output size validation, data URL tile stitching helper 추가 |
| `tests/content/overlay/full-page-capture.test.ts` | document/body metrics, scroll clamp, full page bounds, vertical/horizontal tile plan, oversized output 방어 테스트 추가 |
| `tests/shared/stitch-image.test.ts` | output pixel size rounding, source crop snapping, destination rect snapping, max dimension/area 방어 테스트 추가 |
| `mydocs/orders/20260531.md` | #15 상태를 Stage 1 완료 후 승인 대기로 갱신 |

## 본문 변경 정도 / 본문 무손실 여부

코드 신규 추가만 수행했다. 기존 visible viewport capture, selected crop, iframe/shadow selection, Copy/Save runtime 경로는 수정하지 않았다. Firefox 코드는 직접 복사하지 않고 조사한 동작 contract를 Chrome-safe TypeScript helper로 새로 작성했다.

## 검증 결과

실행 명령:

```bash
npm run typecheck
npm test -- tests/shared/stitch-image.test.ts tests/content/overlay/full-page-capture.test.ts
rg "full page|full-page|stitch|tile|devicePixelRatio|MAX_CAPTURE|captureVisibleTab|drawSnapshot" src tests mydocs/plans/task_m020_15.md mydocs/plans/task_m020_15_impl.md
git diff --check
npm test
```

결과:

- OK: `npm run typecheck` 통과.
- OK: Stage 1 지정 테스트 2개 파일, 10개 테스트 통과.
- OK: Stage 1 reference grep 실행 결과 full page/tile/stitch/capture 관련 항목 확인.
- OK: `git diff --check` 통과.
- OK: 추가 통합 확인으로 전체 `npm test` 실행, 16개 파일 173개 테스트 통과.

## 잔여 위험

- 실제 browser capture loop는 아직 연결하지 않았다. Stage 2에서 `window.scrollTo()` 후 `captureVisibleTab()` 타이밍과 scroll restoration을 별도로 검증해야 한다.
- max canvas 정책은 Chrome canvas 안정성을 우선한 상수로 시작했다. 실제 긴 페이지 smoke에서 더 보수적인 제한이 필요하면 Stage 4에서 조정한다.
- sticky/fixed 중복 문제는 이번 단계에서 해결하지 않았다. Stage 4에서 fixture와 정책으로 확정한다.

## 다음 단계 영향

- Stage 2는 `createFullPageTilePlan()`의 `scrollX`, `scrollY`, `viewportCropRect`, `destinationCssRect`를 그대로 사용해 scroll capture loop를 구현하면 된다.
- Stage 2 stitching 연결 시 `stitchCapturedTiles()`에 각 captured visible PNG와 tile rect를 전달하면 source/destination pixel snapping을 공유할 수 있다.
- runtime에서 scroll 후 실제 scroll position이 tile target과 다르면 Stage 2에서 actual offset 기반 tile 보정 또는 오류 처리를 추가해야 한다.

## 승인 요청

- Stage 1 산출물과 검증 결과를 승인하면 다음 단계인 Stage 2 `scroll capture loop와 runtime 복구 구현`으로 진행한다.
