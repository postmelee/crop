# Task #66 Stage 1 보고서

GitHub Issue: [#66](https://github.com/postmelee/crop/issues/66)
구현계획서: [`task_m020_66_impl.md`](../plans/task_m020_66_impl.md)
Stage: 1

## 단계 목적

Stage 1은 viewport 밖 selected stitching 문제의 첫 보정으로, 선택 영역이 한 viewport 안에 들어갈 수 있을 때 current scroll을 최대한 유지하는 scroll planning 계약을 고정하는 단계다.

이번 단계에서는 runtime 연결을 강제하지 않고 `createPageRectTilePlan()`에 옵션 기반 `minimal-scroll` 정책을 추가했다. 기본 호출은 기존 `segment-start` 동작을 유지한다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `src/content/overlay/full-page-capture.ts` | `PageRectTileScrollStrategy`, `PageRectTilePlanOptions`를 추가하고 `createPageRectTilePlan()`에 옵션 기반 축별 scroll 계산을 연결했다. |
| `tests/content/overlay/full-page-capture.test.ts` | `minimal-scroll` 옵션이 bottom/right 노출에 필요한 만큼만 이동하는지, 기본 호출과 oversized selected bounds는 기존 segment-start planning을 유지하는지 테스트를 추가했다. |

## 본문 변경 정도 / 본문 무손실 여부

코드 작업이다. 기존 public 기본 동작은 유지했다. `createPageRectTilePlan(metrics, pageRect)` 호출은 기존처럼 segment start 기준 scroll을 계산하고, 새 동작은 `scrollStrategy: "minimal-scroll"` 옵션을 명시한 경우에만 적용된다.

## 검증 결과

실행 명령:

```bash
npm test -- tests/content/overlay/full-page-capture.test.ts
git diff --check
```

결과:

- OK — `npm test -- tests/content/overlay/full-page-capture.test.ts`: `18` tests passed.
- OK — `git diff --check`: 경고 없음.
- 참고 — 분리 worktree에는 `node_modules`가 없어 원본 worktree의 `node_modules`를 임시 symlink로 연결해 테스트를 실행했고, 검증 후 symlink는 제거했다.

## 잔여 위험

- Stage 1은 scroll planning 계약만 고정했다. 실제 selected stitching runtime은 아직 새 `minimal-scroll` 옵션을 사용하지 않는다.
- 검정 placeholder retry는 아직 구현하지 않았다. Stage 2에서 selected stitching 경로에만 좁게 적용할지 최종 결정한다.

## 다음 단계 영향

- Stage 2는 `capturePageRectTiles()` selected 경로에서 `scrollStrategy: "minimal-scroll"`을 사용하도록 연결한다.
- Stage 2에서 retry를 적용한다면 이번 단계의 scroll planning과 충돌하지 않도록 selected stitching 경로에만 제한해야 한다.

## 승인 요청

- Stage 1 산출물과 검증 결과를 승인하면 Stage 2 selected stitching runtime 보정으로 진행한다.
