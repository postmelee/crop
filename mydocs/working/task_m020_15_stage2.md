# Task #15 Stage 2 보고서

GitHub Issue: [#15](https://github.com/postmelee/crop/issues/15)
구현계획서: [`task_m020_15_impl.md`](../plans/task_m020_15_impl.md)
Stage: 2

## 단계 목적

Stage 1에서 고정한 full page tile plan을 실제 scroll/capture loop로 실행할 수 있게 만든다. UI 버튼 연결은 Stage 3으로 남기고, 이번 단계에서는 capture 중 overlay 숨김, smooth scroll 비활성화 hook, tile별 scroll 이동, paint 대기, actual scroll 기반 source crop, 성공/실패 시 scroll restoration contract를 테스트로 고정한다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `src/content/overlay/full-page-capture.ts` | `captureFullPageTiles()` capture loop, actual scroll 기반 `createCapturedFullPageTile()`, overlay 숨김/scroll behavior hook, scroll restoration/finally 복구 경로 추가 |
| `tests/content/overlay/full-page-capture.test.ts` | captured tile source crop, 성공 시 전체 tile capture/복구 순서, 실패 시 scroll/overlay/scroll behavior 복구 테스트 추가 |
| `mydocs/orders/20260601.md` | 2026-06-01 오늘할일에 #15 Stage 2 완료 후 승인 대기 상태 추가 |

## 본문 변경 정도 / 본문 무손실 여부

기존 visible viewport capture와 selected crop runtime은 수정하지 않았다. `captureVisibleTab` message shape와 background service worker 책임도 그대로 유지했다. Stage 2 loop는 `full-page-capture.ts`에 독립 helper로 추가되어 Stage 3에서 UI/action pipeline에 연결할 수 있는 상태다.

## 검증 결과

실행 명령:

```bash
npm run build
npm run typecheck
npm run test
rg "captureVisibleTab|scrollTo|scrollBy|requestAnimationFrame|visibility|fullPage|full-page|restore" src tests
git diff --check
```

결과:

- OK: `npm run build` 통과. Vite production build 완료.
- OK: `npm run typecheck` 통과.
- OK: `npm test -- tests/content/overlay/full-page-capture.test.ts` 별도 실행, 9개 테스트 통과.
- OK: 전체 `npm test` 통과, 16개 파일 176개 테스트 통과.
- OK: Stage 2 grep 실행 결과 `captureVisibleTab`, `scrollTo`, `requestAnimationFrame`, `visibility`, `full-page`, restoration 관련 항목 확인.
- OK: `git diff --check` 통과.

## 잔여 위험

- Stage 2 loop는 아직 실제 `crop-overlay.ts` action pipeline에 연결하지 않았다. 사용자가 누르는 `전체 페이지 선택` 버튼 동작은 Stage 3에서 활성화한다.
- 실제 Chrome capture에서는 extension/browser rate limit과 scroll 후 paint 안정성 변수가 남아 있다. Stage 3/4에서 브라우저 smoke로 확인해야 한다.
- fixed/sticky element 중복 문제는 이번 단계에서 처리하지 않았다. Stage 4에서 fixture와 정책으로 확정한다.
- capture 중 layout shift가 심한 문서에서는 actual scroll 기반 crop이 viewport 밖으로 밀릴 수 있다. 현재는 명시 오류로 처리한다.

## 다음 단계 영향

- Stage 3에서 `captureFullPageTiles()`에 기존 `requestVisibleTabCapture()`, host visibility setter, wait-for-paint 함수를 연결하면 된다.
- Stage 3에서 `stitchCapturedTiles()`와 Copy/Save action pipeline을 붙일 때 `CapturedFullPageTile.viewportCropRect`와 `destinationCssRect`를 그대로 사용할 수 있다.
- `src/shared/messages.ts`와 `src/background/service-worker.ts`는 현재 message shape로 충분해서 Stage 2에서는 변경하지 않았다.

## 승인 요청

- Stage 2 산출물과 검증 결과를 승인하면 다음 단계인 Stage 3 `전체 페이지 선택 UI와 Copy/Save 연결`로 진행한다.
