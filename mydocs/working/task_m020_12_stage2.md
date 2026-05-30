# Task #12 Stage 2 완료 보고서

GitHub Issue: [#12](https://github.com/postmelee/crop/issues/12)
구현계획서: [`task_m020_12_impl.md`](../plans/task_m020_12_impl.md)
Stage: 2

## 단계 목적

Stage 1에서 만든 edge auto-scroll helper를 실제 drag selection runtime에 연결했다. 이번 단계는 `crop-overlay.ts` 안에서 마지막 drag pointer를 유지하고, requestAnimationFrame loop로 edge scroll delta를 반복 적용하며, scroll 후 page-coordinate selected rectangle을 다시 계산하는 것이 목적이다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `src/content/overlay/crop-overlay.ts` | `getEdgeScrollDelta()` import, drag 중 마지막 pointer 저장, edge rAF loop, `window.scrollBy()` 호출, scroll 후 `dragMove` 재계산, pointerup/remove cleanup 추가. |
| `mydocs/working/task_m020_12_stage2.md` | Stage 2 완료 보고서 추가. |

## 본문 변경 정도 / 본문 무손실 여부

코드 변경은 overlay runtime controller에 한정했다. 기존 state machine API, Copy/Save capture backend, selected outside click reset, hover helper, README는 수정하지 않았다. State에는 계속 page 좌표만 저장하고, viewport 좌표는 기존처럼 render 직전에 계산한다.

## 검증 결과

실행 명령:

```bash
npm run build
npm run typecheck
npm run test
rg "requestAnimationFrame|cancelAnimationFrame|scrollBy|edge|dragging|dragMove" src/content/overlay tests/content/overlay
git diff --check
```

결과:

- OK: `npm run build` 통과. Vite build에서 16개 module이 변환됐고 `dist/content/inject.js`가 생성됐다.
- OK: `npm run typecheck` 통과.
- OK: `npm run test` 통과. 12개 test file, 94개 test가 모두 통과했다.
- OK: `rg`에서 requestAnimationFrame/cancelAnimationFrame, `scrollBy`, edge helper, dragging/dragMove 연결이 확인됐다.
- OK: `git diff --check`가 출력 없이 종료되어 whitespace 오류가 없었다.

## 잔여 위험

- 실제 Chrome에서 pointermove와 scroll event 순서, scroll clamping, 문서별 scroll container 차이는 아직 수동 smoke 전이다.
- 가로 auto-scroll은 window/document scroll이 가능한 fixture나 실제 페이지에서 Stage 3/4에 확인해야 한다.
- scroll 속도와 threshold는 Stage 1 기본값을 그대로 사용했다. 실제 UX가 과하거나 부족하면 Stage 4에서 좁게 조정한다.

## 다음 단계 영향

- Stage 3은 fixture와 회귀 테스트를 보강해 edge auto-scroll을 반복 확인할 수 있게 만든다.
- Stage 4에서 Chrome unpacked extension smoke를 수행해 bottom/top/left/right edge 동작과 pointerup/Escape/Cancel cleanup을 확인해야 한다.

## 승인 요청

- Stage 2 산출물과 검증 결과를 승인하면 Stage 3 회귀 테스트와 fixture/smoke 보강으로 진행한다.
