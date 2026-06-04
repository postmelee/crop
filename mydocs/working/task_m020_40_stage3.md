# Task #40 Stage 3 보고서

GitHub Issue: [#40](https://github.com/postmelee/crop/issues/40)
구현계획서: [`task_m020_40_impl.md`](../plans/task_m020_40_impl.md)
Stage: 3

## 단계 목적

Stage 2 preview fallback 보정 이후에도 저장 PNG 자체에 transparent gap 또는 destination rounding gap을 방어하는 코드가 필요한지 판단한다. 이번 단계는 source inspection과 focused tests로 stitching 경로를 확인하고, 근거가 없으면 `stitch-image.ts`를 변경하지 않는 결론을 남기는 단계다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `mydocs/working/task_m020_40_stage3.md` | 저장 PNG seam 방어 필요성 판단, 검증 결과, Stage 4 인계 사항 기록 |

## 본문 변경 정도 / 본문 무손실 여부

소스 코드는 변경하지 않았다. Stage 2에서 바꾼 preview CSS fallback은 유지했고, `src/shared/stitch-image.ts`, `tests/shared/stitch-image.test.ts`, `tests/content/overlay/full-page-capture.test.ts`, `tests/content/overlay/phase6-regression.test.ts`는 Stage 3에서 추가 수정하지 않았다.

## 판단 결과

- `stitchCapturedTiles()`는 canvas를 생성하고 tile마다 `context.drawImage()`를 호출해 destination rect에 배치한 뒤 `canvas.toDataURL("image/png")`를 반환한다.
- destination rect는 `getStitchDestinationPixelRect()`에서 edge별 `Math.round()`를 적용한다.
- 기존 테스트가 adjacent destination tile edge alignment를 pixel snapping 상태와 downscale 상태에서 모두 확인한다.
- focused tests가 모두 통과했으므로 이번 시각 결함을 저장 PNG seam으로 볼 근거는 확인되지 않았다.
- `src/shared/stitch-image.ts`에는 `fillRect` 또는 `clearRect` 사용이 없다. 저장 PNG 배경을 임의 색으로 초기화하는 변경도 적용하지 않았다.
- 결론: 이번 문제는 Stage 2에서 처리한 preview paint fallback 문제로 유지하고, Stage 3에서는 stitching 코드를 변경하지 않는다.

## 검증 결과

실행 명령:

```bash
PATH=/private/tmp/node_modules/.bin:$PATH npm run typecheck
PATH=/private/tmp/node_modules/.bin:$PATH npm test -- tests/shared/stitch-image.test.ts tests/content/overlay/full-page-capture.test.ts tests/content/overlay/phase6-regression.test.ts
rg "stitchCapturedTiles|getStitchDestinationPixelRect|drawImage|fillRect|clearRect|downscaled|outputScale|sourceScale|crop-preview-image" src tests
rg -n "edge-aligned|destination|downscal|source scale|outputScale|sourceScale" tests/shared/stitch-image.test.ts tests/content/overlay/full-page-capture.test.ts tests/content/overlay/phase6-regression.test.ts
rg -n "fillRect|clearRect" src/shared/stitch-image.ts
git diff --check
```

결과:

- OK: `npm run typecheck` 통과.
- OK: `npm test -- tests/shared/stitch-image.test.ts tests/content/overlay/full-page-capture.test.ts tests/content/overlay/phase6-regression.test.ts` 통과.
- OK: focused test 결과 `3` files passed, `50` tests passed.
- OK: `tests/shared/stitch-image.test.ts`에 pixel snapping edge alignment와 downscale edge alignment 검증이 존재한다.
- OK: `src/shared/stitch-image.ts`에서 `fillRect|clearRect` grep은 match 없음으로 끝났다.
- OK: `git diff --check` 통과.

참고:

- Stage 2와 동일하게 `/private/tmp/crop-task40`에는 `node_modules`가 없어 `/private/tmp/node_modules` symlink를 PATH에 추가해 검증했다. cwd는 계속 `/private/tmp/crop-task40`로 유지했다.

## 잔여 위험

- 자동 테스트는 실제 Chrome compositor의 scroll paint timing을 재현하지 않는다. Stage 4에서 수동 smoke 절차와 품질 매트릭스에 이 한계를 기록해야 한다.
- 저장 PNG seam을 재현하는 별도 사용자 증거가 추가되면 후속 단계 또는 별도 task에서 stitching 경로를 다시 확인해야 한다.

## 다음 단계 영향

- Stage 4는 Phase 6 품질 매트릭스에 preview scroll blank 항목과 수동 smoke 절차를 추가한다.
- 최종 보고서에는 이번 task의 적용 범위를 preview-only fix로 명확히 기록한다.
- Stage 4 통합 검증에서 `debugger`, `<all_urls>`, broad host permission이 추가되지 않았음을 다시 확인한다.

## 승인 요청

- Stage 3 산출물과 검증 결과를 승인하면 Stage 4 품질 매트릭스와 통합 검증으로 진행한다.
