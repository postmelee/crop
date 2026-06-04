# Task #35 Stage 1 완료 보고서

GitHub Issue: [#35](https://github.com/postmelee/crop/issues/35)
구현계획서: [`task_m020_35_impl.md`](../plans/task_m020_35_impl.md)
Stage: 1

## 단계 목적

전체 페이지/선택 영역 stitching이 browser canvas 제한을 넘을 때 바로 실패하지 않고 단일 PNG로 축소할 수 있도록, 최종 output pixel size 계산 계약을 먼저 고정한다. 이번 단계는 runtime full page preflight와 overlay action 연결 전, `stitch-image` 순수 helper와 focused 테스트만 다룬다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `src/shared/stitch-image.ts` | `getStitchOutputPixelPlan()`을 추가해 source scale과 effective output scale을 분리하고, dimension/area 제한 초과 시 종횡비 유지 downscale ratio를 적용하도록 했다. |
| `tests/shared/stitch-image.test.ts` | 제한 이하 output 유지, dimension 초과 downscale, area 초과 downscale, downscale 후 destination edge alignment, empty output 방어 테스트를 추가했다. |

## 본문 변경 정도 / 본문 무손실 여부

코드 변경이다. 기존 `validateOutputPixelSize()`는 명시 검증 helper로 남겨 기존 over-limit reject 테스트를 유지했다. `StitchCapturedTilesResult.scale`은 기존 의미에 맞춰 captured image source scale로 보존하고, 실제 canvas/destination 배치에는 새 `outputScale`을 사용하도록 분리했다.

## 검증 결과

실행 명령:

```bash
npm run typecheck
npm test -- tests/shared/stitch-image.test.ts
git diff --check
```

결과:

- OK: `npm run typecheck` 통과 (`tsc --noEmit`).
- OK: focused test 통과. `tests/shared/stitch-image.test.ts` 9개 테스트 통과.
- OK: `git diff --check` 경고 없음.

## 잔여 위험

- Stage 1은 `stitchCapturedTiles()`의 최종 canvas helper만 보정했다. `full-page-capture.ts`의 oversized preflight reject는 Stage 2에서 제거하거나 옵션화해야 실제 전체 페이지 fallback이 동작한다.
- 다운스케일은 원본 DPR 해상도를 낮추므로 이미지 선명도 저하는 남는다. Stage 3 문서에서 사용자-facing 제한으로 정리한다.
- 큰 페이지는 downscale 후에도 tile capture와 PNG encoding 비용이 남는다. 이번 단계에서는 기존 max area 정책 안의 단일 canvas 생성만 보장한다.

## 다음 단계 영향

- Stage 2는 `createFullPageTilePlan()`이 oversized document를 계획 단계에서 throw하지 않도록 보정해야 한다.
- Stage 2는 full page/selected stitching이 `stitchCapturedTiles()`의 `outputWidth`, `outputHeight`, `downscaled`, `sourceScale`, `outputScale` metadata를 기존 action pipeline에 안전하게 전달하는지 확인해야 한다.
- selected page rect capture는 제한 이하 출력 크기 회귀 테스트를 함께 유지해야 한다.

## 승인 요청

- Stage 1 산출물과 검증 결과를 승인하면 Stage 2 full page/selected stitching 경로 통합으로 진행한다.
