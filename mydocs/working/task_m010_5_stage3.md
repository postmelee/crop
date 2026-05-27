# Task #5 Stage 3 보고서

GitHub Issue: [#5](https://github.com/postmelee/crop/issues/5)
구현계획서: [`task_m010_5_impl.md`](../plans/task_m010_5_impl.md)
Stage: 3

## 단계 목적

Stage 3은 Stage 2의 hover rect를 사용자가 클릭했을 때 selected 상태로 고정하고,
선택 영역 주변에 Copy/Save/Cancel action buttons를 배치하는 단계다. 실제
capture/crop/clipboard/download 동작은 후속 #6/#7 범위로 남기고, 이번
단계에서는 active-looking no-op 버튼과 Cancel/Escape teardown만 연결했다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `src/content/overlay/state-machine.ts` | `idle`, `hovering`, `selected`, `closing` 상태와 hover/select/cancel 전이 추가 |
| `src/content/overlay/crop-overlay.ts` | click selection 고정, selected 상태 hover 중단, Copy/Save no-op 처리, Cancel/Escape teardown 연결 |
| `src/content/overlay/crop-template.ts` | Shadow DOM template에 Copy/Save/Cancel action buttons toolbar 추가 |
| `src/content/overlay/crop-overlay.css` | selected highlight와 action buttons 스타일 추가 |
| `src/content/overlay/positioning.ts` | selected rect 기준 action buttons clamp/flip placement helper 추가 |
| `tests/content/overlay/state-machine.test.ts` | 상태 전이 단위 테스트 추가 |
| `tests/content/overlay/positioning.test.ts` | action buttons hide/below/above/clamp placement 테스트 추가 |
| `mydocs/orders/20260527.md` | 오늘할일 비고를 Stage 3 완료 후 승인 대기 상태로 갱신 |

## 본문 변경 정도 / 본문 무손실 여부

코드 기능 추가다. Stage 1~2의 overlay mount, 중복 실행 flash, hover highlight,
Escape teardown 동작은 유지했다. selected 상태에서는 hover 업데이트를 무시하고
selected rectangle을 유지한다. Copy/Save는 `data-crop-action`을 가진 버튼으로
표시되지만 이번 단계에서는 no-op이며, 실제 capture/crop/clipboard/download
handler는 후속 task에서 연결한다.

## 검증 결과

실행 명령:

```bash
npm run typecheck
npm run test
rg "selected|Copy|Save|Cancel|Escape|data-crop-action" src/content tests/content
git diff --check
npm run build
```

결과:

- OK: `npm run typecheck` 통과.
- OK: `npm run test` 통과. 5개 파일, 38개 테스트가 모두 통과했다.
- OK: grep에서 selected 상태, Copy/Save/Cancel buttons, Escape teardown, `data-crop-action` 연결을 확인했다.
- OK: `git diff --check` 경고 없이 통과.
- OK: 추가 확인으로 `npm run build` 통과. `dist/content/inject.js` 생성 확인.

## 잔여 위험

- Copy/Save는 이번 단계에서 의도적으로 no-op이다. 실제 동작은 #6/#7에서 연결해야 한다.
- action buttons 위치는 viewport 기준 clamp/flip 계산으로 보호하지만, 실제 Chrome 수동 smoke는 Stage 4에서 확인해야 한다.
- selected rect는 Stage 2 helper가 반환한 viewport rect를 그대로 사용한다. helper threshold 정책이 선택 영역 크기에 직접 반영된다.

## 다음 단계 영향

- Stage 4는 README smoke 절차를 현재 overlay UI 기준으로 갱신하고 통합 검증을 수행한다.
- README에는 Copy/Save가 아직 UI 표시까지만 된다는 제한을 명확히 적어야 한다.
- Chrome unpacked extension smoke에서는 hover, click selection, action buttons, Cancel/Escape teardown, 재실행 중복 방지를 확인해야 한다.

## 승인 요청

- Stage 3 산출물과 검증 결과를 승인하면 Stage 4로 진행한다.
