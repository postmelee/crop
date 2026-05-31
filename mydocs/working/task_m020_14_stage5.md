# Task #14 Stage 5 보고서

GitHub Issue: [#14](https://github.com/postmelee/crop/issues/14)
구현계획서: [`task_m020_14_impl.md`](../plans/task_m020_14_impl.md)
Stage: 5

## 단계 목적

Stage 5는 Stage 4 이후 수동 smoke에서 확인된 저장 PNG 상단 1px급 오차를 보정하는 후속 단계다. Firefox 원본은 region edge를 `Math.round`로 정수화한 뒤 snapshot을 그리므로, Chrome MV3의 `captureVisibleTab()` 후처리 crop 단계에서도 source pixel edge를 nearest pixel로 snap하도록 맞췄다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `src/shared/crop-image.ts` | source crop rect 변환을 `floor/ceil` 바깥쪽 확장에서 `Math.round` nearest-pixel snapping으로 변경했다. |
| `tests/shared/crop-image.test.ts` | 125% zoom-like 기대값을 snapping 정책에 맞게 보정하고, shadow button fractional rect 회귀 테스트를 추가했다. |
| `tests/content/overlay/phase6-regression.test.ts` | fractional CSS crop edge 기대값을 Firefox식 snapping 결과로 보정했다. |
| `mydocs/plans/task_m020_14_impl.md` | Stage 5 후속 보정 단계와 검증 명령을 추가했다. |
| `mydocs/report/task_m020_14_report.md` | Stage 5 결과와 전체 테스트 수를 반영한다. |
| `mydocs/orders/20260531.md` | #14 상태를 Stage 5 완료 후 승인 대기로 갱신했다. |

## 본문 변경 정도 / 본문 무손실 여부

제품 문서 루트는 변경하지 않았다. 코드 변경은 저장 PNG의 source pixel 정수화 정책만 좁게 바꾸며, iframe/shadow hit-test와 overlay UI 동작은 변경하지 않는다.

## 검증 결과

실행 명령:

```bash
npm test -- tests/shared/crop-image.test.ts tests/content/overlay/phase6-regression.test.ts
npm run build
npm run typecheck
npm run test
git diff --check
git status --short
```

결과:

- OK: targeted test 통과. 2개 test file, 25개 test가 모두 통과했다.
- OK: `npm run build` 통과.
- OK: `npm run typecheck` 통과.
- OK: `npm run test` 통과. 14개 test file, 163개 test가 모두 통과했다.
- OK: `git diff --check` 경고 없이 통과.

## 잔여 위험

- 실제 브라우저 저장 smoke는 사용자가 확장 reload 후 재확인해야 한다. 자동 테스트는 source pixel snapping과 기존 overlay 회귀를 검증한다.
- Firefox의 privileged `drawSnapshot` 자체는 Chrome MV3에서 사용할 수 없으므로, 동일 동작은 `captureVisibleTab()` 후처리 crop 단계의 rounding 정책으로 맞춘다.

## 다음 단계 영향

- Stage 5 승인 후 최종 보고서 기준으로 PR 게시 절차를 진행할 수 있다.
- 수동 smoke에서는 shadow button과 srcdoc iframe card 저장 PNG의 상단 배경 1px 포함 여부를 우선 확인한다.

## 승인 요청

- Stage 5 산출물과 검증 결과를 승인하면 PR 게시 절차로 진행한다.
