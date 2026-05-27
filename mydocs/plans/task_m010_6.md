# Task #6 수행계획서

GitHub Issue: [#6](https://github.com/postmelee/crop/issues/6)
마일스톤: M010

## 목적

`crop`의 selected rectangle을 실제 PNG crop 결과로 변환하는 capture/crop backend를 구현한다. 이번 task의 결과물은 content script가 background service worker에 capture를 요청하고, background가 `chrome.tabs.captureVisibleTab()`으로 visible viewport screenshot data URL을 받아 content script로 돌려주며, content script가 선택 영역을 canvas로 crop할 수 있는 내부 파이프라인이다.

완료 후에는 #5에서 만든 overlay UI의 Copy/Save button이 실제 동작을 연결할 수 있는 기반을 갖춰야 한다. 단, 이번 task는 capture와 crop backend에 한정하며 Clipboard write와 file download는 #7에서 구현한다.

## 배경

#5에서 Shadow DOM overlay, Firefox식 hover/click/drag selection, page-coordinate selected rect, scroll-follow highlight, Copy/Save/Cancel UI가 준비됐다. 현재 Copy/Save는 의도적으로 no-op UI이며, 선택 영역을 이미지로 만드는 기능은 없다.

원본 계획서 `/Users/melee/Downloads/crop_development_plan_prompt.md`의 Phase 4는 content script의 capture 요청, background의 `chrome.tabs.captureVisibleTab()` 호출, screenshot data URL 반환, canvas crop, viewport scale 보정, overlay 숨김 후 capture를 요구한다. Chrome MV3에서 `captureVisibleTab()`은 content script가 아니라 background/service worker에서 호출해야 하므로 message protocol과 crop helper 경계를 먼저 정해야 한다.

## 범위

### 포함

- content script와 background 사이 capture message protocol 정의
- `src/shared/messages.ts` 신규 작성
- `src/shared/rect.ts` 신규 작성 또는 기존 Firefox-derived rect helper와의 안전한 경계 정의
- `src/shared/crop-image.ts` 신규 작성
- background service worker의 capture request handler 구현
- `chrome.tabs.captureVisibleTab()` 호출과 data URL 반환
- content script selected rect를 visible viewport crop rect로 변환하는 흐름
- screenshot natural size와 viewport CSS size 비율 기반 scale 보정
- HiDPI/Retina 및 Chrome zoom 80%~150% 대응을 위한 helper 테스트
- viewport 밖으로 이어지는 selected rect는 visible intersection만 crop
- capture 직전 overlay/prompt/highlight/actions 숨김, capture 이후 복구 또는 teardown 정책 구현
- visible viewport 전체 capture를 수행할 수 있는 내부 action 경로
- capture/crop helper 단위 테스트와 CDP smoke용 검증 경로
- README의 개발 상태와 smoke 기대 결과를 capture backend 기준으로 갱신

### 제외

- Clipboard write 구현
- file download 구현
- Copy/Save button의 최종 사용자-facing 성공 동작
- toast, retry UX, filename sanitizer
- full page capture
- scroll stitching
- `debugger` 권한
- `<all_urls>` host 권한 추가
- server upload/telemetry
- resize/move handles
- iframe/nested context 내부 선택 고도화

## 설계 방향

- background/service worker는 Chrome extension API boundary만 담당한다. `captureVisibleTab()` 호출과 error formatting을 처리하고, crop 계산이나 canvas 처리는 content/shared helper 쪽에 둔다.
- content script는 selected rect와 viewport 정보를 CSS pixel 기준으로 전달하고, screenshot image natural size와 viewport CSS size의 비율로 scale을 계산한다. `devicePixelRatio`를 직접 신뢰하지 않는다.
- #5의 state는 page-coordinate rect를 저장한다. crop 직전에는 `pageRectToViewportRect()`와 viewport clipping을 거쳐 visible viewport 기준 rect만 사용한다.
- overlay 숨김은 capture 직전에 Shadow DOM host 또는 capture 대상 UI 전체를 임시로 숨기는 방식으로 구현한다. capture 실패 시 overlay가 복구되어 사용자가 재시도할 수 있어야 한다.
- Copy/Save button click에 최종 clipboard/download를 연결하지 않는다. 이번 task에서는 capture/crop pipeline을 호출 가능한 내부 함수 또는 no-op replacement까지 구현하고, #7에서 사용자-facing action으로 완성한다.
- shared helper는 DOM/Chrome API에 의존하지 않게 작성해 Vitest로 좌표 변환과 image crop parameter를 검증한다.
- Chrome 권한은 기존 MVP 원칙을 유지한다. `activeTab`, `scripting`, `clipboardWrite` 중심을 유지하고 `debugger`, `<all_urls>`는 추가하지 않는다.

## 문서 위치 판단

이번 task는 사용자-facing 제품 문서 루트를 새로 만들지 않는다. 다만 로컬 개발자가 Chrome unpacked extension으로 capture backend smoke를 확인할 수 있어야 하므로 루트 `README.md`의 개발 상태와 smoke 기대 결과를 갱신한다.

| 파일 | 분류 | 대상 독자 | 선택 위치 | 대안 위치 | 선택 이유 |
|---|---|---|---|---|---|
| `README.md` | 기여자 로컬 실행 문서 | 기여자/에이전트 | 루트 `README.md` | `docs/dev.md` | 이미 로컬 개발과 Chrome unpacked smoke 절차의 진실 원천으로 사용 중이며, 별도 docs 루트를 만들 필요가 없다. |
| 공식 제품 문서 루트 | 해당 없음 | 해당 없음 | 해당 없음 | `docs/` | 이번 task는 사용자용 제품 문서 사이트나 공식 문서 루트를 만들지 않는다. |

## 예상 변경 파일

신규:

- `src/shared/messages.ts`
- `src/shared/rect.ts`
- `src/shared/crop-image.ts`
- `tests/shared/rect.test.ts`
- `tests/shared/crop-image.test.ts`
- 필요 시 `tests/background/service-worker.test.ts`

수정:

- `src/background/service-worker.ts`
- `src/content/overlay/crop-overlay.ts`
- `src/content/overlay/crop-template.ts`
- `src/content/overlay/positioning.ts`
- `README.md`
- 필요 시 `vite.config.ts`
- 필요 시 `tsconfig.json`

이번 task 산출물:

- `mydocs/orders/20260527.md`
- `mydocs/plans/task_m010_6.md`
- `mydocs/plans/task_m010_6_impl.md`
- `mydocs/working/task_m010_6_stage{N}.md`
- `mydocs/report/task_m010_6_report.md`

## 잠정 단계

- **Stage 1 — capture message protocol과 background handler**
  - shared message type과 background `captureVisibleTab()` handler 구현
  - restricted tab injection 흐름과 기존 command/action listener 회귀 확인
- **Stage 2 — crop geometry와 image scale helper**
  - selected page rect를 visible viewport crop rect로 변환하는 helper 작성
  - screenshot natural size / viewport CSS size 비율 기반 scale test
- **Stage 3 — content overlay capture pipeline 연결**
  - selected rect에서 capture request를 보내고 data URL을 crop helper로 넘기는 내부 pipeline 구현
  - overlay hide/restore 또는 teardown 정책 구현
- **Stage 4 — visible viewport 전체 capture 경로와 smoke 검증**
  - visible viewport 전체 capture action 경로를 내부적으로 검증 가능하게 구성
  - CDP/manual smoke에서 overlay가 최종 image에 포함되지 않는지 확인
- **Stage 5 — README, 최종 보고서, 통합 검증**
  - README smoke 기대 결과 갱신
  - build/typecheck/test/CDP smoke 결과 정리
  - 최종 보고서 작성과 PR 준비

## 검증 계획

### 단계별 검증

- Stage 1
  - `npm run build`
  - `npm run typecheck`
  - `rg "captureVisibleTab|CAPTURE|chrome.runtime.onMessage|Capture" src/background src/shared`
  - `git diff --check`
- Stage 2
  - `npm run typecheck`
  - `npm run test`
  - crop rect scale/unit tests
  - `rg "naturalWidth|naturalHeight|viewport|scale|clip" src/shared tests/shared`
- Stage 3
  - `npm run build`
  - `npm run typecheck`
  - `npm run test`
  - `rg "hide|restore|capture|crop" src/content src/shared tests`
- Stage 4
  - `npm run build`
  - CDP 또는 manual smoke: selected crop output 생성 확인
  - CDP 또는 manual smoke: overlay/highlight/buttons가 output에 포함되지 않음 확인
  - zoom 80%, 100%, 125%, 150% 좌표 smoke 또는 helper 기반 대체 검증
- Stage 5
  - `npm run build`
  - `npm run typecheck`
  - `npm run test`
  - `git diff --check`
  - `git status --short`

### 통합 검증

- selected 영역을 PNG Blob 또는 data output으로 crop할 수 있다.
- 최종 PNG에 overlay, highlight, prompt, buttons가 포함되지 않는다.
- HiDPI/Retina 및 Chrome zoom 80%~150%에서 crop 좌표가 screenshot image scale에 맞게 계산된다.
- selected rect가 viewport 밖으로 이어지면 visible intersection만 crop된다.
- visible viewport 전체 capture가 현재 viewport 전체를 대상으로 동작한다.
- capture 실패 시 overlay가 복구되어 사용자가 재시도할 수 있다.
- `debugger` 권한과 `<all_urls>` 권한이 추가되지 않는다.
- Clipboard write와 file download는 실행되지 않는다.
- `npm run build`가 통과한다.
- `npm run typecheck`가 통과한다.
- `npm run test`가 통과한다.
- `git status --short`가 PR 준비 전 빈 출력이다.
- `git diff --check`가 경고 없이 통과한다.

## 리스크

- **overlay가 PNG에 포함될 위험**: capture 직전 host 숨김과 capture 이후 복구를 finally 경로로 묶고, CDP/manual smoke에서 output pixel 또는 screenshot 차이를 확인한다.
- **HiDPI/zoom 좌표 오차**: `devicePixelRatio` 직접 곱셈 대신 실제 image natural size와 viewport CSS size 비율을 사용하고, 80/100/125/150% fixture를 테스트한다.
- **page rect와 viewport rect 혼동**: #5 state는 page rect이므로 crop 직전에는 viewport projection과 clipping을 명시 helper로 통일한다.
- **message boundary 오류**: background가 tab/window context와 runtime error를 명확히 반환하고, content는 failure 시 overlay를 복구한다.
- **범위 초과**: Copy/Save 최종 동작, full page, scroll stitching, resize/move 요구는 #7/#13/#15 후속 이슈로 유지한다.
- **Chrome API 자동 검증 한계**: `captureVisibleTab()`은 실제 extension context가 필요하므로 일부 검증은 CDP/manual smoke로 보완한다.

## 승인 요청 사항

- Phase 4 범위를 capture message, `captureVisibleTab()`, selected/visible viewport crop, overlay 숨김 검증까지로 제한하는 것
- Clipboard write, file download, toast/retry UX, filename sanitizer를 #7로 유지하는 것
- full page capture와 scroll stitching을 #15로 유지하는 것
- `debugger` 권한과 `<all_urls>` 권한을 추가하지 않는 것
- `src/shared/`에 message/rect/crop-image helper를 두고 background/content가 공유하는 구조
- `README.md`를 이번 task에서 capture backend smoke 기대 결과 문서로 갱신하는 것

승인되면 `task_m010_6_impl.md`에서 단계별 산출물, 검증 명령, 커밋 메시지를 구체화한다.
