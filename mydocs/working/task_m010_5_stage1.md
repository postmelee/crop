# Task #5 Stage 1 보고서

GitHub Issue: [#5](https://github.com/postmelee/crop/issues/5)
구현계획서: [`task_m010_5_impl.md`](../plans/task_m010_5_impl.md)
Stage: 1

## 단계 목적

Stage 1은 기존 `src/content/inject.ts`의 inline overlay stub을 모듈 구조로
분리하고, Shadow DOM template과 CSS를 후속 hover/selection 구현이 이어받을
수 있는 shell로 정리하는 단계다. import 기반 content bundle로 바뀌면서 반복
주입 시 top-level lexical declaration 충돌이 생기지 않도록 Vite 출력 래퍼도
함께 적용했다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `src/content/inject.ts` | content script entry를 `mountCropOverlay()` 호출만 남긴 bootstrap으로 축소 |
| `src/content/overlay/crop-overlay.ts` | root mount, 중복 실행 flash, Escape teardown, close/reopen 동작을 담당하는 overlay controller 추가 |
| `src/content/overlay/crop-template.ts` | Shadow DOM 내부 DOM template, root/panel 속성 상수, close button wiring 분리 |
| `src/content/overlay/crop-overlay.css` | Shadow DOM에 inline 주입할 dim layer, viewport frame, top-right panel, flash animation CSS 분리 |
| `src/content/overlay/state-machine.ts` | 후속 Stage에서 확장할 `idle` 초기 상태 shell 추가 |
| `src/vite-env.d.ts` | `*.css?raw` import type declaration 추가 |
| `vite.config.ts` | `content/inject` chunk만 IIFE로 감싸는 `contentScriptWrapper()` 플러그인 추가 |
| `mydocs/orders/20260527.md` | 오늘할일 비고를 Stage 1 완료 후 승인 대기 상태로 갱신 |

## 본문 변경 정도 / 본문 무손실 여부

코드 구조 변경이다. 기존 overlay의 `#__crop_root__`, `data-crop-root`,
`data-crop-panel`, 중복 실행 flash, close button, Escape teardown 동작은
유지했다. Stage 1 범위에 맞춰 hover helper 연결, selected rectangle,
Copy/Save/Cancel buttons 동작은 아직 구현하지 않았다.

UI shell에는 후속 Firefox식 overlay UX를 위한 dim layer가 추가됐다. 이 변경은
구현계획서 Stage 1 범위의 `dim layer` shell에 해당하며, 실제 요소 hover와
selection은 Stage 2~3에서 연결한다.

## 검증 결과

실행 명령:

```bash
npm run build
npm run typecheck
rg "__crop_root__|attachShadow|Escape|crop-overlay|data-crop-root" src/content vite.config.ts
rg "content/inject|\\(\\(\\) =>" dist/content/inject.js
git diff --check
npm run test
```

결과:

- OK: `npm run build` 통과. `dist/content/inject.js`와 `dist/background/service-worker.js` 생성 확인.
- OK: `npm run typecheck` 통과.
- OK: source grep에서 `__crop_root__`, `data-crop-root`, `attachShadow`, `Escape`, `crop-overlay` 참조 확인.
- OK: dist grep에서 minified content bundle 내부의 `"content/inject"` marker 확인. `content/inject` chunk가 IIFE wrapper 안에 들어간 것을 확인했다.
- OK: `git diff --check` 경고 없이 통과.
- OK: `npm run test` 통과. 3개 파일, 25개 테스트가 모두 통과했다.

## 잔여 위험

- Stage 1은 shell 분리 단계이므로 hover highlight와 selection UI는 아직 동작하지 않는다.
- `content/inject` chunk에 shared chunk가 생기는 구조로 확장되면 wrapper 정책을 다시 검토해야 한다. 현재 Stage 1 산출물은 정적 import가 단일 content chunk로 번들되는 것을 `dist/content/inject.js`로 확인했다.
- 수동 Chrome smoke는 Stage 4 계획에 배치되어 있어 이번 Stage에서는 자동 검증과 dist 출력 확인까지만 수행했다.

## 다음 단계 영향

- Stage 2는 `crop-overlay.ts`에 pointermove 처리와 Task #4 helper 연결을 추가하면 된다.
- hover target 계산 시 `#__crop_root__` 및 Shadow DOM 내부 crop UI를 후보에서 제외해야 한다.
- `state-machine.ts`는 Stage 3에서 `hovering`, `selected`, `closing` 전이로 확장한다.

## 승인 요청

- Stage 1 산출물과 검증 결과를 승인하면 Stage 2로 진행한다.
