# Task #13 Stage 3 보고서

GitHub Issue: [#13](https://github.com/postmelee/crop/issues/13)
구현계획서: [`task_m020_13_impl.md`](../plans/task_m020_13_impl.md)
Stage: 3

## 단계 목적

Stage 3은 selected 상태에서 사용자가 볼 수 있는 resize/move controls와 Firefox식 action box parity를 보정하는 단계다. Stage 2에서 연결한 `data-crop-resize-handle`/move surface 경로를 실제 Shadow DOM template과 CSS에 반영하고, action toolbar가 viewport 밖 selected rect에도 화면 안에 남도록 placement 기준을 보강했다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `src/content/overlay/crop-template.ts` | `crop-selection-controls` 컨테이너, move surface, 8방향 resize handle button, action button group 구조를 추가했다. |
| `src/content/overlay/crop-overlay.css` | selected controls 위치/handle/cursor/focus 스타일과 action toolbar grouping, spacing, border radius, shadow, typography를 보정했다. |
| `src/content/overlay/crop-overlay.ts` | visible intersection 기준으로 controls를 렌더링하고, action box는 full projected selection rect 기준으로 viewport 안에 clamp되도록 연결했다. |
| `src/content/overlay/positioning.ts` | selection controls presentation helper와 viewport 밖 action box y-position clamp를 추가했다. |
| `tests/content/overlay/positioning.test.ts` | viewport 밖 selected rect, 작은 viewport clamp, selection controls presentation 테스트를 추가했다. |

## 본문 변경 정도 / 본문 무손실 여부

코드 작업이므로 문서 본문 무손실 여부는 해당 없음. 기존 Copy/Save/Cancel button의 `data-crop-action` 계약과 capture 전 overlay 숨김 흐름은 유지했다. action button DOM은 Copy/Save 그룹과 Cancel 그룹으로 감쌌지만 기존 event composed path 판정과 pending disabled query가 계속 동작하도록 button attributes는 유지했다.

## 검증 결과

실행 명령:

```bash
npm run build
npm run typecheck
npm run test
rg "crop-selection|crop-resize|crop-handle|crop-actions|cursor|border-radius|box-shadow" src/content/overlay tests/content/overlay
git diff --check
```

결과:

- OK: `npm run build` 통과. `dist/manifest.json`, `dist/background/service-worker.js`, `dist/content/inject.js` 빌드 완료.
- OK: `npm run typecheck` 통과.
- OK: `npm run test` 통과. 13개 test file, 124개 test가 모두 통과했다.
- OK: `rg "crop-selection|crop-resize|crop-handle|crop-actions|cursor|border-radius|box-shadow" ...`에서 selection controls, resize handles, action toolbar, cursor, shadow/border-radius selector를 확인했다.
- OK: `git diff --check` 경고 없이 통과.

## 잔여 위험

- 실제 Chrome extension pointer drag smoke는 Stage 5에서 수행한다. Stage 3에서는 DOM/CSS와 positioning 단위 기준까지만 검증했다.
- handle 시각 크기와 action toolbar 위치 감각은 실제 화면에서 조정이 필요할 수 있다. Stage 5 smoke에서 과도한 overlap이나 small viewport 문제를 확인한다.
- keyboard 조정과 size 표시 여부는 아직 구현하지 않았다. Stage 4에서 처리한다.

## 다음 단계 영향

- Stage 4는 현재 8방향 handle button과 move surface가 있는 상태에서 Arrow/Shift/Alt keyboard 조정을 연결한다.
- Stage 4에서 action button 또는 handle focus 상태의 keyboard 이벤트 우선순위를 명확히 해야 한다.
- Stage 5 smoke에서는 `data-crop-resize-handle` 기반 handle drag와 move surface drag가 모두 실제 Chrome에서 동작하는지 확인해야 한다.

## 승인 요청

- Stage 3 산출물과 검증 결과를 승인하면 Stage 4 keyboard 조정과 size 표시 결정으로 진행한다.
