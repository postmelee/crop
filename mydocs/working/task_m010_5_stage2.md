# Task #5 Stage 2 보고서

GitHub Issue: [#5](https://github.com/postmelee/crop/issues/5)
구현계획서: [`task_m010_5_impl.md`](../plans/task_m010_5_impl.md)
Stage: 2

## 단계 목적

Stage 2는 Stage 1에서 분리한 overlay shell에 hover highlight 동작을 연결하는
단계다. pointermove 이벤트를 viewport-local 좌표로 읽고, Task #4에서 포팅한
Firefox-derived helper로 hover 후보 요소와 선택 rect를 계산한 뒤 Shadow DOM
내부 dashed rectangle에 표시한다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `src/content/overlay/crop-overlay.ts` | `pointermove` listener, `requestAnimationFrame` 기반 hover update, Task #4 helper 연결, crop UI event 제외 처리 추가 |
| `src/content/overlay/crop-template.ts` | Shadow DOM template에 hidden highlight element 추가 |
| `src/content/overlay/crop-overlay.css` | dashed hover highlight 스타일과 hidden 상태 CSS 추가 |
| `src/content/overlay/positioning.ts` | viewport rect를 highlight CSS placement로 변환하고 element style에 적용하는 helper 추가 |
| `tests/content/overlay/positioning.test.ts` | highlight placement 변환과 hidden 상태 단위 테스트 추가 |
| `mydocs/orders/20260527.md` | 오늘할일 비고를 Stage 2 완료 후 승인 대기 상태로 갱신 |

## 본문 변경 정도 / 본문 무손실 여부

코드 기능 추가다. Stage 1의 root mount, 중복 실행 flash, close button, Escape
teardown 동작은 유지했다. 이번 단계에서는 hover 표시까지만 구현했고, 클릭으로
selection을 고정하거나 Copy/Save/Cancel buttons를 표시하는 동작은 Stage 3
범위로 남겼다.

## 검증 결과

실행 명령:

```bash
npm run typecheck
npm run test
rg "getElementFromPoint|getBestRectForElement|readWindowDimensions|pointermove|hover" src/content tests/content
git diff --check
npm run build
```

결과:

- OK: `npm run typecheck` 통과.
- OK: `npm run test` 통과. 4개 파일, 28개 테스트가 모두 통과했다.
- OK: grep에서 `getElementFromPoint`, `getBestRectForElement`, `readWindowDimensions`, `pointermove`, `hover` 연결을 확인했다.
- OK: `git diff --check` 경고 없이 통과.
- OK: 추가 확인으로 `npm run build` 통과. `dist/content/inject.js` 생성 확인.

## 잔여 위험

- Codex 환경에서 Chrome unpacked extension 수동 smoke는 아직 수행하지 않았다. 계획대로 Stage 4에서 수행하거나 작업지시자 smoke 확인을 받는다.
- hover 후보가 문서의 `body` 또는 큰 container로 확장될 수 있다. 이는 Task #4 helper threshold 정책을 그대로 따른 결과이며, selection UX는 Stage 3에서 이어서 조정한다.
- iframe hit-test는 iframe 내부 진입 대신 host element fallback 정책에 의존한다.

## 다음 단계 영향

- Stage 3은 현재 hover rect를 클릭 시 selected rect로 고정하고 action buttons container를 배치해야 한다.
- `src/content/overlay/positioning.ts`는 Stage 3에서 button clamp/flip 계산 helper를 추가하기 좋은 위치다.
- crop UI event는 `event.composedPath()`로 제외하고 있으므로 Stage 3의 action buttons는 Shadow DOM 내부 event 흐름을 유지해야 한다.

## 승인 요청

- Stage 2 산출물과 검증 결과를 승인하면 Stage 3으로 진행한다.
