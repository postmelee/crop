# Task #40 Stage 5 보고서

GitHub Issue: [#40](https://github.com/postmelee/crop/issues/40)
구현계획서: [`task_m020_40_impl.md`](../plans/task_m020_40_impl.md)
Stage: 5

## 단계 목적

Stage 4 산출물을 `/private/tmp/crop-task40/dist`로 직접 로드한 작업지시자 수동 검증에서, 짧은 페이지에서는 보이지 않지만 매우 긴 페이지의 full page preview scroll 중 흰 band가 아직 재현된다는 피드백을 받았다. Stage 5는 이 피드백을 별도로 기록하고, 긴 페이지 tile capture가 scroll 직후 흰 compositor placeholder tile을 캡처할 가능성을 줄이기 위해 기본 tile capture paint settle을 한 프레임 강화한다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `src/content/overlay/full-page-capture.ts` | `TILE_CAPTURE_SETTLE_FRAME_COUNT = 2`를 추가하고, 기본 tile capture wait가 `requestAnimationFrame` 2회와 `setTimeout(0)` 뒤 settle되도록 변경 |
| `tests/content/overlay/full-page-capture.test.ts` | 기본 tile capture wait가 여러 animation frame을 기다리는지 검증하는 회귀 테스트 추가 |
| `mydocs/feedback/task_m020_40_feedback.md` | Stage 4 이후 작업지시자 수동 검증 피드백과 Stage 5 처리 방향 기록 |
| `mydocs/plans/task_m020_40_impl.md` | Stage 5 산출물, 검증, 위험 대응 추가 |
| `mydocs/tech/task_m020_8_quality_matrix.md` | P6-41 기준과 Task #40 결과를 Stage 5 기준으로 갱신 |
| `mydocs/report/task_m020_40_report.md` | 최종 보고서에 Stage 5 변경, 검증, 잔여 위험 반영 |
| `mydocs/orders/20260605.md` | #40 추가 보정 완료 기록 |
| `mydocs/working/task_m020_40_stage5.md` | Stage 5 완료 보고서 작성 |

## 본문 변경 정도 / 본문 무손실 여부

코드 변경은 tile stitching capture 경로의 기본 대기 함수에 한정했다. `captureFullPageTiles()`와 `capturePageRectTiles()`가 사용하는 기본 `waitForTile`은 영향을 받지만, visible viewport capture와 viewport 안 selected crop의 별도 wait 경로는 변경하지 않았다. Chrome 권한, manifest, 저장 PNG stitch 해상도 제한 상수도 변경하지 않았다.

문서 변경은 Stage 4 이후 새로 확인된 피드백과 Stage 5 조치 내용을 추가하는 범위이며, 기존 Stage 1~4 기록은 유지했다.

## 검증 결과

실행 명령:

```bash
npm run build
npm run typecheck
npm test
npm test -- tests/content/overlay/full-page-capture.test.ts tests/content/overlay/phase6-regression.test.ts
rg "debugger|<all_urls>|host_permissions|captureVisibleTab" manifest.json src tests
rg "TILE_CAPTURE_SETTLE_FRAME_COUNT|waitForNextPaint|Stage 5|preview scroll|흰 band|P6-41" src tests mydocs
git diff --check
git status --short
```

결과:

- OK — `npm run build` 통과. Vite build는 `21` modules transformed, `dist/content/inject.js` 생성, `484ms`.
- OK — `npm run typecheck` 통과.
- OK — focused test 통과. `tests/content/overlay/full-page-capture.test.ts`, `tests/content/overlay/phase6-regression.test.ts` 기준 `42` tests passed.
- OK — full test 통과. `17` files, `209` tests passed.
- OK — permission grep에서 `debugger`, `<all_urls>`, `host_permissions` 추가 없음. 기존 `captureVisibleTab` 사용과 테스트 assertion만 확인.
- OK — Stage 5 키워드 grep으로 코드, 테스트, 문서 반영 확인.
- OK — `git diff --check` 통과.

## 잔여 위험

- 실제 Chrome compositor의 매우 긴 페이지 scroll/paint 타이밍은 자동 테스트로 완전 재현하지 못한다.
- 2 animation frame settle로도 작업지시자 환경에서 흰 band가 다시 보이면, 더 긴 bounded delay 또는 tile retry 정책은 별도 판단이 필요하다.
- Stage 5는 tile stitching 경로에서 capture 전 대기 frame을 늘리므로 매우 긴 full page capture는 소폭 느려질 수 있다.

## 다음 단계 영향

- 작업지시자가 `/private/tmp/crop-task40/dist`를 다시 로드해 동일한 긴 페이지에서 수동 검증한다.
- 만족스럽지 않으면 Stage 5 단일 커밋을 revert해 Stage 4 상태로 되돌릴 수 있다.
- 수동 검증이 통과하면 PR 게시 전 최종 보고 절차로 이어갈 수 있다.

## 승인 요청

- Stage 5 산출물과 검증 결과를 승인하면 PR 게시 준비 단계로 진행한다.
