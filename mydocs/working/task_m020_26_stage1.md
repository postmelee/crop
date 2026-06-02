# Task #26 Stage 1 완료 보고서

GitHub Issue: [#26](https://github.com/postmelee/crop/issues/26)
구현계획서: [`task_m020_26_impl.md`](../plans/task_m020_26_impl.md)
Stage: 1

## 단계 목적

선택 영역이 현재 viewport를 벗어난 경우에도 선택한 page rect 전체를 tile/stitching 대상으로 삼을 수 있도록, runtime 연결 전 순수 tile plan 계약을 고정한다. 기존 full page capture 계약은 유지하면서 page bounds 입력을 받는 helper를 추가하는 것이 이번 단계의 목적이다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `src/content/overlay/full-page-capture.ts` | `createPageRectTilePlan()`을 추가하고 기존 `createFullPageTilePlan()`이 full page bounds를 넘겨 같은 tile plan 경로를 쓰도록 정리했다. |
| `tests/content/overlay/full-page-capture.test.ts` | selected page rect multi-tile, scrollMax clamp, reversed bounds normalization 회귀 테스트를 추가했다. |

## 본문 변경 정도 / 본문 무손실 여부

코드 변경이다. 기존 full page public helper와 capture loop 동작은 유지했고, full page plan은 새 bounds 기반 helper를 호출하는 구조로만 바뀌었다. `src/shared/stitch-image.ts`는 변경하지 않았으며, 기존 stitch helper가 새 destination/source rect 계약과 함께 계속 사용되는지 관련 테스트를 함께 실행했다.

## 검증 결과

실행 명령:

```bash
npm run typecheck
npm test -- tests/content/overlay/full-page-capture.test.ts tests/shared/stitch-image.test.ts
rg "bounds|tile|stitch|destinationCssRect|viewportCropRect|full-page|selected" src/content/overlay/full-page-capture.ts src/shared/stitch-image.ts tests/content/overlay/full-page-capture.test.ts tests/shared/stitch-image.test.ts
git diff --check
```

결과:

- OK: `npm run typecheck` 통과 (`tsc --noEmit`).
- OK: 대상 테스트 통과. `tests/shared/stitch-image.test.ts` 5개, `tests/content/overlay/full-page-capture.test.ts` 13개, 총 18개 통과.
- OK: grep으로 새 selected tile plan 테스트와 기존 stitch/destination/source rect 경로를 확인했다.
- OK: `git diff --check` 경고 없음.

## 잔여 위험

- Stage 1은 runtime 연결 전 순수 helper 계약만 고정했다. 실제 Save/Copy에서 선택 rect가 viewport 밖으로 나갈 때의 분기는 Stage 2에서 구현해야 한다.
- `FullPageTilePlan` 타입명을 그대로 사용한다. 선택 rect plan도 같은 tile/stitch contract를 쓰지만, 이름은 기존 full page API와의 호환을 우선해 이번 단계에서 바꾸지 않았다.

## 다음 단계 영향

- Stage 2는 `createPageRectTilePlan()`을 `captureSelectedRegion()`의 viewport 밖 분기에서 사용하면 된다.
- 선택 rect의 output CSS size는 `plan.outputCssSize`, stitch destination은 selected rect 좌상단 기준 `destinationCssRect`로 얻는다.
- 현재 viewport 안에 완전히 들어온 selected rect는 기존 단일 visible crop 경로를 유지해야 한다.

## 승인 요청

- Stage 1 산출물과 검증 결과를 승인하면 Stage 2 selected Save/Copy capture 경로 통합으로 진행한다.
