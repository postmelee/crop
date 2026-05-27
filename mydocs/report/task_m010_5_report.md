# Task #5 최종 보고서

GitHub Issue: [#5](https://github.com/postmelee/crop/issues/5)
마일스톤: M010

## 작업 요약

- 대상 이슈: #5
- 마일스톤: M010
- 단계 수: 8
- 작업 목적: Chrome MV3 content script 안에 Firefox식 overlay UI 기반을 구현하고 hover/click/drag select/cancel 흐름을 연결한다.

## 변경 파일 목록과 영향 범위

| 경로 | 변경 요약 | 영향 범위 |
|---|---|---|
| `src/content/inject.ts` | content script entry를 `mountCropOverlay()` bootstrap으로 축소 | content script entrypoint |
| `src/firefox-derived/screenshots-ui-assets.ts` | Firefox Screenshots preview face SVG와 visible/full page menu icon SVG를 Chrome-compatible factory로 분리하고 icon fill rule 보정 | MPL-derived UI asset boundary |
| `src/content/overlay/crop-overlay.ts` | overlay mount, 중복 실행 flash, hover helper 연결, 눈동자 pointer offset 갱신, page-coordinate click/drag selection, scroll-follow render, Cancel/Escape teardown 구현 | overlay runtime controller |
| `src/content/overlay/crop-template.ts` | Shadow DOM template, Firefox-derived mode icon/face, selection mask, highlight, Copy/Save/Cancel buttons 생성 | overlay DOM 구조 |
| `src/content/overlay/crop-overlay.css` | Firefox 원본 수치에 가까운 dark preview, prompt/face, toolbar, selection mask, hover/selected highlight 스타일과 Stage 7 prompt/panel 세부 보정 | overlay UI styling |
| `src/content/overlay/state-machine.ts` | `idle`, `hovering`, `draggingReady`, `dragging`, `selected`, `closing` 상태와 page rect 전이 구현 | overlay 상태 모델 |
| `src/content/overlay/positioning.ts` | highlight placement, selection mask, action buttons clamp/flip placement, eye offset helper 구현 | overlay layout helper |
| `src/firefox-derived/overlay-helpers.ts` | `getBestRectForElement()`의 page coordinate 반환 옵션 추가 | Firefox-derived geometry helper |
| `src/firefox-derived/window-dimensions.ts` | viewport/page rect projection helper 추가 | Firefox-derived geometry helper |
| `src/vite-env.d.ts` | `*.css?raw` import declaration 추가 | TypeScript build support |
| `vite.config.ts` | `content/inject` chunk IIFE wrapper plugin 추가 | content script repeated-injection safety |
| `tests/content/overlay/positioning.test.ts` | highlight, action buttons placement, eye offset 단위 테스트 추가 | 자동 테스트 |
| `tests/content/overlay/state-machine.test.ts` | hover/click/drag 상태 전이 단위 테스트 추가 | 자동 테스트 |
| `tests/firefox-derived/overlay-helpers.test.ts` | page-coordinate best rect 단위 테스트 추가 | 자동 테스트 |
| `tests/firefox-derived/window-dimensions.test.ts` | viewport/page rect projection 단위 테스트 추가 | 자동 테스트 |
| `NOTICE` | Stage 6 Firefox-derived UI asset 출처 추가 | 라이선스 고지 |
| `THIRD_PARTY.md` | Stage 6 local adaptation target과 upstream SVG 출처 추가 | third-party attribution |
| `src/firefox-derived/README.md` | Firefox-derived UI asset boundary 설명 추가 | 기여자 안내 |
| `README.md` | 개발 상태와 Chrome unpacked smoke 기대 결과를 Phase 3 Stage 8 기준으로 갱신 | 기여자 로컬 실행 문서 |
| `mydocs/plans/task_m010_5.md` | 수행계획서 작성 | Hyper-Waterfall 작업 추적 |
| `mydocs/plans/task_m010_5_impl.md` | 구현계획서 작성 | Hyper-Waterfall 작업 추적 |
| `mydocs/working/task_m010_5_stage1.md` | Stage 1 완료 보고서 작성 | 단계 검증 기록 |
| `mydocs/working/task_m010_5_stage2.md` | Stage 2 완료 보고서 작성 | 단계 검증 기록 |
| `mydocs/working/task_m010_5_stage3.md` | Stage 3 완료 보고서 작성 | 단계 검증 기록 |
| `mydocs/working/task_m010_5_stage5.md` | Stage 5 완료 보고서 작성 | 단계 검증 기록 |
| `mydocs/working/task_m010_5_stage6.md` | Stage 6 완료 보고서 작성 | 단계 검증 기록 |
| `mydocs/working/task_m010_5_stage7.md` | Stage 7 완료 보고서 작성 | 단계 검증 기록 |
| `mydocs/working/task_m010_5_stage8.md` | Stage 8 완료 보고서 작성 | 단계 검증 기록 |
| `mydocs/orders/20260527.md` | #5 오늘할일 완료 처리 | 작업 상태 기록 |

## 문서 위치 검증

| 파일 | 계획된 위치 | 실제 위치 | 결과 | 근거 |
|---|---|---|---|---|
| `README.md` | 루트 `README.md` | `README.md` | OK | 수행계획서와 구현계획서에서 Chrome unpacked smoke 기대 결과의 위치를 루트 README로 결정했다. |
| 공식 제품 문서 루트 | 해당 없음 | 해당 없음 | OK | 이번 task는 `docs/`, `specs/`, `site/`, `website/`, `adr/` 같은 제품 문서 루트를 만들지 않았다. |
| `task_m010_5_report.md` | `mydocs/report/` | `mydocs/report/task_m010_5_report.md` | OK | 최종 보고서 템플릿 위치 정책과 일치한다. |

## 변경 전·후 정량 비교

| 지표 | 변경 전 | 변경 후 |
|---|---|---|
| content overlay entry | `src/content/inject.ts` inline stub 207줄 | `inject.ts` 3줄 bootstrap + overlay/controller/assets로 분리, `dist/content/inject.js` 27.42 kB |
| overlay 상태 모델 | 없음 | `state-machine.ts`에 page-coordinate drag 상태 포함, 11개 상태 전이 테스트 |
| overlay placement helper | 없음 | `positioning.ts`에 highlight/action/eye/mask helper, 10개 placement/eye offset 테스트 |
| 전체 Vitest | 3개 test file, 25개 test | 5개 test file, 48개 test |
| 단계 보고서 | 없음 | Stage 1~3, Stage 5~8 보고서 7개 |
| README smoke 기대 결과 | overlay stub 기준 | 원본 face/icon, compact mode toolbar, 중앙 prompt, page-coordinate hover/click/drag selection, scroll-follow highlight, Copy/Save/Cancel buttons 기준 |

## 검증 결과

| 수용 기준 | 결과 |
|---|---|
| `npm run build` 통과 | OK — Vite v6.4.2 production build 성공, `dist/manifest.json`, `dist/background/service-worker.js`, `dist/content/inject.js` 생성 |
| `npm run typecheck` 통과 | OK — `tsc --noEmit` 성공 |
| `npm run test` 통과 | OK — Vitest v3.2.4, 5개 test file, 48개 test 통과 |
| Shadow DOM overlay 구조 구현 | OK — `#__crop_root__`, `data-crop-root`, `attachShadow`, raw CSS inline import 확인 |
| content script 반복 주입 안전성 | OK — `content/inject` bundle IIFE wrapper와 두 번째 content script 주입 후 root count 1 확인 |
| Firefox식 mode toolbar 표시 | OK — CDP content-script smoke에서 `보이는 영역 선택`, `전체 페이지 선택` 버튼과 full page disabled placeholder 확인 |
| Firefox-derived face/icon 표시 | OK — CDP content-script smoke에서 원본 기반 face SVG, visible icon, full page icon DOM 확인 |
| Firefox-derived icon fill 보정 | OK — CDP content-script smoke에서 visible/full page icon `fill-rule="evenodd"` 확인 |
| 중앙 preview prompt와 face 표시 | OK — CDP content-script smoke에서 안내 문구, Cancel button, face DOM, pupil DOM 2개 확인 |
| 중앙 preview prompt/panel 세부 보정 | OK — CDP content-script smoke에서 prompt transform `matrix(1, 0, 0, 1, 0, 0)`, prompt/cancel/mode button font weight `600`, mode button `91x80` 확인 |
| 눈동자 pointer 추적 | OK — CDP content-script smoke에서 pointermove 후 `--crop-eye-x`, `--crop-eye-y`와 SVG pupil transform 갱신 확인 |
| Task #4 helper hover 연결 | OK — `getElementFromPoint`, `getBestRectForElement`, `readWindowDimensions`, `pointermove` 연결 확인 |
| hover highlight 표시 | OK — CDP content-script smoke에서 hover 상태 `hidden: false`, transform/width/height style 적용 확인 |
| 화면 밖 요소 page-coordinate rect 유지 | OK — scroll-follow CDP smoke에서 `translate(120px, 300px)`, `360x640` hover/selected rect 확인 |
| click selection 고정 | OK — CDP content-script smoke에서 `data-crop-state="selected"`와 `crop-highlight--selected` 확인 |
| scroll-follow highlight | OK — selected 상태에서 `window.scrollTo(0, 180)` 후 highlight transform이 `translate(120px, 120px)`로 재투영되고 action buttons/mask 유지 확인 |
| drag selection 고정 | OK — CDP content-script smoke에서 pointerdown/move/up 후 `data-crop-state="selected"`, drag rect width/height, selection mask, action buttons 확인 |
| Copy/Save/Cancel buttons 표시 | OK — CDP content-script smoke에서 `data-crop-action` 값 `copy,save,cancel`과 button text `Copy/Save/Cancel` 확인 |
| Cancel button teardown | OK — CDP content-script smoke에서 Cancel click 후 `#__crop_root__` 제거 확인 |
| Escape teardown | OK — CDP content-script smoke에서 Escape key 후 `#__crop_root__` 제거 확인 |
| Copy/Save 실제 동작 제외 | OK — Copy/Save는 active-looking no-op UI만 제공하고 capture/crop/clipboard/download handler는 추가하지 않음 |
| README smoke 절차 갱신 | OK — 개발 상태와 Chrome unpacked extension 기대 결과를 overlay UI 기준으로 갱신 |
| `git diff --check` 통과 | OK — whitespace 경고 없음 |

### 단계별 검증 결과

- Stage 1: [`task_m010_5_stage1.md`](../working/task_m010_5_stage1.md) — overlay module shell과 Shadow DOM template 분리, build/typecheck/grep/diff 검증 통과
- Stage 2: [`task_m010_5_stage2.md`](../working/task_m010_5_stage2.md) — hover highlight와 Task #4 helper 연결, typecheck/test/grep/build 검증 통과
- Stage 3: [`task_m010_5_stage3.md`](../working/task_m010_5_stage3.md) — selection 상태와 action buttons 구현, typecheck/test/grep/build 검증 통과
- Stage 4: 통합 검증 — `npm run build`, `npm run typecheck`, `npm run test`, README/source grep, `git diff --check`, CDP content-script smoke 통과
- Stage 5: [`task_m010_5_stage5.md`](../working/task_m010_5_stage5.md) — Firefox식 mode toolbar, 중앙 prompt/face, 눈동자 pointer 추적 구현, build/typecheck/test/grep/diff/CDP smoke 통과
- Stage 6: [`task_m010_5_stage6.md`](../working/task_m010_5_stage6.md) — Firefox 원본 face/icon asset 분리, Firefox식 prompt 수치 보정, drag selection 구현, build/typecheck/test/grep/diff/CDP drag smoke 통과
- Stage 7: [`task_m010_5_stage7.md`](../working/task_m010_5_stage7.md) — icon fill rule, prompt 중앙 배치, prompt/panel typography와 compact toolbar 보정, build/typecheck/test/grep/diff/CDP smoke 통과
- Stage 8: [`task_m010_5_stage8.md`](../working/task_m010_5_stage8.md) — page-coordinate hover/click/drag selection, scroll-follow highlight, overlay-hidden hit-test 보정, build/typecheck/test/grep/diff/CDP smoke 통과

## 잔여 위험과 후속 작업

### 잔여 위험

- Chrome CDP의 `Input.dispatchKeyEvent`는 browser-level extension command를 트리거하지 않아 action icon 또는 `open-crop` shortcut 진입점 자동 smoke는 완료하지 못했다.
- Computer Use도 현재 Chrome URL에서 차단되어 OS-level 단축키 입력 검증은 진행하지 못했다.
- 별도 임시 Chrome 프로필에서 command-line `--load-extension` 로드는 환경 제약이 있어 extension registration이 안정적으로 유지되지 않았다. 최종 UI 흐름은 `dist/content/inject.js`를 CDP로 직접 주입해 검증했다.
- Copy/Save는 이번 task에서 의도적으로 no-op이다. 실제 capture/crop/clipboard/download 동작은 #6/#7에서 구현해야 한다.
- overlay가 최종 PNG에 포함되지 않는지 여부는 capture backend가 아직 없으므로 이번 task에서 검증하지 않았다.
- Firefox 원본 SVG path와 menu icon은 MPL-derived boundary 안에서만 사용했다. 제품명, 브랜드, privileged API는 사용하지 않았다.
- `전체 페이지 선택`은 toolbar에 placeholder로 표시되지만 MVP 범위 밖이라 비활성 상태다.
- Firefox resize mover 전체, keyboard resize, edge auto-scroll, iframe 내부 선택, full page capture는 각각 후속 이슈로 분리했다.

### 후속 작업 후보

- #6 Phase 4: `chrome.tabs.captureVisibleTab()` 기반 visible viewport capture/crop backend 구현
- #7 Phase 5: Copy/Save 동작과 UX polish 구현
- #12 Follow-up: 드래그 선택 edge auto-scroll 구현
- #13 Follow-up: 선택 영역 resize/move handles와 keyboard 조정 구현
- #14 Follow-up: iframe/nested context 요소 선택 지원
- #15 Follow-up: full page capture와 scroll stitching 구현
- Chrome 수동 smoke: 작업지시자 로컬 Chrome에서 `dist/` reload 후 action icon 또는 `Command+Shift+P`로 진입점 확인
- capture 직전 overlay 숨김과 최종 PNG exclusion 검증

## 작업지시자 승인 요청

- 최종 보고서와 수용 기준 검증 결과를 승인하면 PR 게시 절차로 진행한다.
