# Task #13 Stage 2 보고서

GitHub Issue: [#13](https://github.com/postmelee/crop/issues/13)
구현계획서: [`task_m020_13_impl.md`](../plans/task_m020_13_impl.md)
Stage: 2

## 단계 목적

Stage 2는 Stage 1에서 추가한 selected move/resize 상태와 transform helper를 실제 overlay pointer flow에 연결하는 단계다. selected 내부 pointer drag는 move로, selected edge/corner pointer drag는 resize로 전이하고, pointerup 후 selected 상태로 확정되도록 했다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `src/content/overlay/crop-overlay.ts` | selected 상태의 pointerdown hit-test 순서를 action button, resize handle, overlay 내부, document 영역 순서로 정리하고 move/resize pointermove/pointerup 전이를 연결했다. |
| `src/content/overlay/selection-transform.ts` | selected rectangle 내부 move와 edge/corner resize를 판정하는 `getSelectionInteractionAtPoint()`와 resize hit area 상수를 추가했다. |
| `tests/content/overlay/selection-transform.test.ts` | selected 내부 move, corner 우선순위, edge resize, hit area 밖 null, custom hit area 테스트를 추가했다. |
| `src/content/overlay/crop-overlay.css` | `moving`/`resizing` 상태에서도 dim, prompt, mode toolbar가 다시 보이지 않도록 기존 상태 숨김 규칙을 확장했다. |

## 본문 변경 정도 / 본문 무손실 여부

코드 작업이므로 문서 본문 무손실 여부는 해당 없음. 기존 drag selection, selected outside reset, Copy/Save/Cancel click 흐름을 유지하면서 selected 상태의 내부/edge pointerdown만 move/resize로 분기했다. Stage 3의 실제 handle DOM은 아직 없지만, 향후 `data-crop-resize-handle`을 가진 overlay 요소가 들어오면 같은 resize 경로를 재사용할 수 있게 했다.

## 검증 결과

실행 명령:

```bash
npm run build
npm run typecheck
npm run test
rg "adjust|resize|move|pointerdown|pointermove|pointerup|resetSelection|suppress" src/content/overlay tests/content/overlay
git diff --check
```

결과:

- OK: `npm run build` 통과. `dist/manifest.json`, `dist/background/service-worker.js`, `dist/content/inject.js` 빌드 완료.
- OK: `npm run typecheck` 통과.
- OK: `npm run test` 통과. 13개 test file, 119개 test가 모두 통과했다.
- OK: `rg "adjust|resize|move|pointerdown|pointermove|pointerup|resetSelection|suppress" ...`에서 pointer 조정 경로, reset, suppression, 테스트 참조를 확인했다.
- OK: `git diff --check` 경고 없이 통과.

## 잔여 위험

- Stage 3에서 실제 8방향 handle DOM과 cursor가 추가되기 전까지는 명시적인 시각 handle 없이 selection border/edge hit area로 resize가 동작한다.
- move/resize는 page-coordinate state 기준으로 연결됐지만, 실제 Chrome 수동 smoke는 Stage 5에서 수행한다.
- action box는 moving/resizing 중에도 보이도록 렌더링된다. Stage 3에서 toolbar 시각과 placement를 보정하며 필요하면 조정한다.

## 다음 단계 영향

- Stage 3은 `data-crop-resize-handle` 속성을 가진 8방향 handle DOM을 추가하면 Stage 2의 explicit handle 경로를 그대로 사용할 수 있다.
- Stage 3은 `moving`/`resizing` 상태의 selected visual, cursor, action box styling을 CSS에서 정리해야 한다.
- Stage 3은 작은 selection에서 hit area와 handle UI가 겹치는지 확인해야 한다.

## 승인 요청

- Stage 2 산출물과 검증 결과를 승인하면 Stage 3 selected controls UI와 action box 보정으로 진행한다.
