# Task #15 Stage 3 보고서

GitHub Issue: [#15](https://github.com/postmelee/crop/issues/15)
구현계획서: [`task_m020_15_impl.md`](../plans/task_m020_15_impl.md)
Stage: 3

## 단계 목적

`전체 페이지 선택` 버튼을 실제 full page capture mode로 활성화하고, 기존 Copy/Save action pipeline에서 capture backend만 full-page loop + stitching으로 분기한다. visible selection capture는 기존 경로를 유지하고, full page Copy는 기존 복사 완료 toast를 재사용하며 Save는 toast를 띄우지 않는 정책을 유지한다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `src/content/overlay/crop-template.ts` | `전체 페이지 선택` 버튼의 disabled placeholder 설정 제거 |
| `src/content/overlay/crop-overlay.ts` | mode button click 처리, full page bounds 선택, `captureFullPageTiles()` + `stitchCapturedTiles()` action pipeline 연결, capture mode/tile count dataset 기록, full page mode controls 숨김 처리 추가 |
| `tests/content/overlay/phase6-regression.test.ts` | full page mode가 Copy/Save pipeline, toast 정책, capture mode metadata와 연결되는지 regression coverage 추가 |
| `mydocs/orders/20260601.md` | #15 상태를 Stage 3 완료 후 승인 대기로 갱신 |

## 본문 변경 정도 / 본문 무손실 여부

기존 visible viewport selection/crop 경로는 `captureSelectedRegion()` 내부로 유지했고, overlay 숨김 처리는 공통 helper로만 감쌌다. background service worker와 runtime message shape는 변경하지 않았다. full page mode는 기존 action buttons를 공유하되 selection resize/move controls를 숨겨 action box 클릭이 crop box move layer에 가로막히지 않게 했다.

## 검증 결과

실행 명령:

```bash
npm run build
npm run typecheck
npm run test
rg "전체 페이지 선택|data-crop-mode|full-page|aria-disabled|Copy|Save|toast|capture backend" src tests
git diff --check
```

결과:

- OK: `npm run build` 통과. Vite production build 완료.
- OK: `npm run typecheck` 통과.
- OK: 관련 테스트 `tests/content/overlay/phase6-regression.test.ts`, `tests/content/overlay/full-page-capture.test.ts`, `tests/shared/stitch-image.test.ts` 별도 실행 통과.
- OK: 전체 `npm test` 통과, 16개 파일 177개 테스트 통과.
- OK: Stage 3 grep 실행 결과 full page mode, Copy/Save, toast, metadata wiring 항목 확인.
- OK: `git diff --check` 통과.

## 잔여 위험

- 실제 extension UI에서 full page Copy/Save smoke는 아직 수행하지 않았다. Stage 4에서 fixture/stitching 품질 검증과 함께 브라우저 smoke로 확인한다.
- sticky/fixed element 중복과 seam 품질은 Stage 4 범위로 남아 있다.
- 매우 긴 페이지의 canvas 한계는 helper에서 방어하지만, 실제 Chrome 캡처 rate/paint 타이밍은 Stage 4 smoke에서 추가 확인해야 한다.

## 다음 단계 영향

- Stage 4는 `전체 페이지 선택 -> Copy/Save` 실제 fixture smoke를 우선 확인해야 한다.
- Stage 4에서 저장 PNG dimension, bottom partial tile, seam, sticky/fixed 중복 정책을 검증한다.
- full page capture result에는 `data-crop-capture-mode="full-page"`와 `data-crop-capture-tile-count`가 남으므로 smoke 디버깅에 사용할 수 있다.

## 승인 요청

- Stage 3 산출물과 검증 결과를 승인하면 다음 단계인 Stage 4 `fixture, sticky/fixed 정책, stitching 품질 회귀`로 진행한다.
