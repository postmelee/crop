# Task #66 Stage 2 보고서

GitHub Issue: [#66](https://github.com/postmelee/crop/issues/66)
구현계획서: [`task_m020_66_impl.md`](../plans/task_m020_66_impl.md)
Stage: 2

## 단계 목적

Stage 2는 Stage 1에서 추가한 selected page rect 최소 이동 scroll 정책을 실제 selected stitching runtime에 연결하는 단계다.

이번 단계에서는 `capturePageRectTiles()` 경로만 기본 `minimal-scroll`을 사용하도록 변경했다. full page capture와 `createPageRectTilePlan()` 기본 호출은 기존 `segment-start` 동작을 유지한다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `src/content/overlay/full-page-capture.ts` | `PageRectCaptureLoopOptions`에 `tilePlanOptions`를 추가하고, `capturePageRectTiles()`가 selected 경로에서 기본 `minimal-scroll`을 사용하도록 연결했다. |
| `tests/content/overlay/full-page-capture.test.ts` | selected runtime이 단일 tile 선택 영역을 최소 이동 scroll로 캡처하는지, 필요 시 `segment-start`로 되돌릴 수 있는지 테스트를 추가했다. |

## 본문 변경 정도 / 본문 무손실 여부

코드 작업이다. selected page rect capture runtime의 scroll planning만 변경했다.

`captureFullPageTiles()`와 `createFullPageTilePlan()`은 수정하지 않았다. `createPageRectTilePlan(metrics, pageRect)`의 기본 동작도 Stage 1과 동일하게 `segment-start`를 유지하므로, 일반 full page와 명시 옵션 없는 helper 계약에는 영향이 없다.

## 검증 결과

실행 명령:

```bash
npm test -- tests/content/overlay/full-page-capture.test.ts tests/shared/stitch-image.test.ts tests/shared/crop-image.test.ts
npm run typecheck
git diff --check
```

결과:

- OK — `npm test -- tests/content/overlay/full-page-capture.test.ts tests/shared/stitch-image.test.ts tests/shared/crop-image.test.ts`: `3` test files, `41` tests passed.
- OK — `npm run typecheck`: TypeScript typecheck 통과.
- OK — `git diff --check`: 경고 없음.
- 참고 — 분리 worktree에는 `node_modules`가 없어 원본 worktree의 `node_modules`를 임시 symlink로 연결해 테스트를 실행했고, 검증 후 symlink는 제거했다.

## 잔여 위험

- 검정 placeholder retry는 이번 단계에서 구현하지 않았다. pixel 분석 기반 retry는 실제 검정 콘텐츠 오탐, canvas 처리 비용, 외부 광고 렌더링 타이밍 의존성이 있어 selected runtime 연결 이후에도 문제가 남는지 먼저 확인하는 편이 안전하다.
- 실제 namu.wiki 광고 iframe/OOPIF 캡처는 외부 광고 상태에 의존하므로 자동 테스트만으로 최종 재현을 보장할 수 없다. Stage 3에서 수동 smoke 기준으로 보완한다.

## 다음 단계 영향

- Stage 3은 phase6 regression 또는 문자열 계약 테스트로 selected 경로의 `minimal-scroll` 연결과 권한 경계를 고정한다.
- Stage 3 수동 smoke 기준에는 같은 광고 영역이 viewport 안에 완전히 들어온 경우와 일부 밖에 있는 경우, 일반 본문 선택 영역이 viewport 밖에 있는 경우를 포함한다.
- Stage 3 또는 수동 smoke에서 검정 placeholder가 계속 재현되면 구현계획서를 갱신하고 selected stitching 한정 retry를 별도 보정으로 진행한다.

## 승인 요청

- Stage 2 산출물과 검증 결과를 승인하면 Stage 3 회귀 검증과 수동 smoke 기준 정리로 진행한다.
