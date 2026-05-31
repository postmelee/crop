# Task #13 Stage 1 보고서

GitHub Issue: [#13](https://github.com/postmelee/crop/issues/13)
구현계획서: [`task_m020_13_impl.md`](../plans/task_m020_13_impl.md)
Stage: 1

## 단계 목적

Stage 1은 selected rectangle resize/move 구현 전에 page-coordinate transform 기준과 상태 전이 기준을 고정하는 단계다. DOM pointer 연결, handle UI, action box 보정은 다음 단계로 넘기고, 이번 단계에서는 순수 helper와 state-machine 이벤트만 확정했다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `src/content/overlay/selection-transform.ts` | 8방향 resize handle 타입, handle type guard, move/resize helper, 최소 크기 clamp, keyboard step 상수를 추가했다. |
| `tests/content/overlay/selection-transform.test.ts` | handle 판정, pointer delta move, 명시 delta move, edge/corner resize, 최소 크기 clamp, custom minimum size 테스트를 추가했다. |
| `src/content/overlay/state-machine.ts` | `moving`/`resizing` 상태와 `selectionMoveStart`, `selectionResizeStart`, `selectionAdjustMove`, `selectionAdjustEnd` 이벤트를 추가했다. |
| `tests/content/overlay/state-machine.test.ts` | 기존 상태 기대값에 `selectionAdjustment`를 반영하고 selected move/resize 시작, 조정, 종료, 비활성 상태 무시 테스트를 추가했다. |

## 본문 변경 정도 / 본문 무손실 여부

코드 작업이므로 문서 본문 무손실 여부는 해당 없음. 기존 hover, drag selection, selected reset, cancel 전이는 유지했고 전체 테스트로 회귀를 확인했다. 새 조정 상태는 아직 DOM에 연결하지 않았으므로 사용자-facing 동작은 Stage 1에서 바뀌지 않는다.

## 검증 결과

실행 명령:

```bash
npm run typecheck
npm run test
rg "selected|resize|move|keyboard|handle|selection-transform" src/content/overlay tests/content/overlay mydocs/plans/task_m020_13.md mydocs/plans/task_m020_13_impl.md
git diff --check
```

결과:

- OK: `npm run typecheck` 통과.
- OK: `npm run test` 통과. 13개 test file, 113개 test가 모두 통과했다.
- OK: `rg "selected|resize|move|keyboard|handle|selection-transform" ...`에서 Stage 1 산출물과 계획서 참조를 확인했다.
- OK: `git diff --check` 경고 없이 통과.

## 잔여 위험

- DOM pointer hit-test와 render 처리는 아직 연결하지 않았다. Stage 2에서 `moving`/`resizing` 상태를 overlay rendering, pointerup, click suppression에 반영해야 한다.
- resize 최소 크기 기본값은 8px로 고정했다. 실제 handle UI에서 너무 작거나 크면 Stage 3에서 조정할 수 있다.

## 다음 단계 영향

- Stage 2는 `selectionMoveStart`, `selectionResizeStart`, `selectionAdjustMove`, `selectionAdjustEnd` 이벤트를 `crop-overlay.ts`의 pointer flow에 연결한다.
- Stage 2는 move/resize 중에도 selected highlight와 action box가 적절히 렌더링되도록 `renderOverlayState()` 조건을 확장해야 한다.
- Stage 2는 selected 내부 조정 이벤트가 outside reset click으로 이어지지 않도록 click suppression을 함께 검증해야 한다.

## 승인 요청

- Stage 1 산출물과 검증 결과를 승인하면 Stage 2 pointer 기반 move/resize interaction 연결로 진행한다.
