# Task #5 수행계획서

GitHub Issue: [#5](https://github.com/postmelee/crop/issues/5)
마일스톤: M010

## 목적

Firefox Screenshots와 유사한 페이지 overlay UI를 Chrome MV3 content script 안에 구현한다. 이번 task의 결과물은 사용자가 확장 아이콘 또는 `open-crop` 단축키로 overlay를 열고, DOM 요소 hover 시 선택 후보 rect를 확인하며, 클릭으로 selection을 고정하고, Cancel/Escape로 정리할 수 있는 UI 기반이다.

완료 후에는 Task #4에서 포팅한 `getElementFromPoint()`와 `getBestRectForElement()` helper가 실제 overlay hover 흐름에 연결되어야 한다. 단, 이번 task는 UI와 상태 전환에 한정하며 실제 `captureVisibleTab()` 호출, PNG crop, Clipboard write, file download는 구현하지 않는다.

## 배경

Task #3에서 Chrome MV3 shell, background script injection, content overlay stub, action icon/shortcut 진입점이 준비됐다. Task #4에서는 Firefox-derived element selection helper, viewport geometry helper, rect 휴리스틱과 테스트가 준비됐다. 다음 단계는 stub panel을 실제 사용자-facing overlay UI로 교체해 hover/select/cancel 흐름을 만드는 것이다.

원본 계획서 `/Users/melee/Downloads/crop_development_plan_prompt.md`의 Phase 3은 Shadow DOM overlay, dim layer, hover dashed rectangle, selected rectangle, Copy/Save/Cancel button 위치 계산, 우측 상단 visible capture action 위치, Escape/Cancel teardown을 요구한다. Firefox 원본의 `overlay.css`와 `ScreenshotsOverlayChild.sys.mjs`는 UI 구조와 상태 흐름 참고 자료로 사용하되, 이번 task에서 새로 importing하는 MPL-derived source 범위는 만들지 않는다.

## 범위

### 포함

- `src/content/inject.ts`의 inline overlay stub을 모듈형 overlay mount 흐름으로 교체
- `src/content/overlay/crop-overlay.ts` 신규 작성
- `src/content/overlay/crop-overlay.css` 신규 작성
- `src/content/overlay/crop-template.ts` 신규 작성
- `src/content/overlay/state-machine.ts` 신규 작성
- Shadow DOM 기반 dim layer, hover highlight, selected rectangle UI 구현
- Task #4 helper 기반 일반 DOM/open shadow hover 후보 계산 연결
- click으로 selected 상태 고정
- Copy/Save/Cancel button container 표시와 선택 영역 기준 위치 계산
- Escape key와 Cancel button으로 overlay teardown
- 중복 실행 시 기존 overlay가 중복 생성되지 않는 기존 동작 유지
- overlay UI가 page CSS 영향을 받지 않도록 Shadow DOM/style boundary 유지
- state machine과 rect/button positioning의 단위 테스트 추가
- README의 Chrome unpacked smoke 기대 결과를 overlay UI 기준으로 갱신

### 제외

- 실제 capture/crop backend 구현
- `chrome.tabs.captureVisibleTab()` 호출
- Clipboard write 구현
- file download 구현
- Copy/Save button의 실제 성공 동작
- full page capture button 활성화
- advanced resize handles
- drag selection
- same-origin iframe 내부 선택 고도화
- cross-origin iframe 내부 접근
- closed shadow root 내부 접근
- overlay/selection이 최종 PNG에 포함되지 않는지 검증하는 capture smoke
- Firefox/Mozilla 사용자-facing 브랜딩 또는 아이콘 도입

## 설계 방향

- Chrome runtime code는 `src/content/` 아래에 두고, Task #4의 Firefox-derived helper는 public API만 import한다. `src/content/`에 MPL-derived code를 직접 복사하지 않는다.
- `src/content/inject.ts`는 중복 root 처리와 bootstrap만 담당하고, overlay UI 본문은 `src/content/overlay/` 모듈로 분리한다.
- CSS는 Shadow DOM 내부 `<style>`로 주입한다. bundler 산출물이 content script 하나로 로드되는 구조를 유지하기 위해 `crop-overlay.css`를 raw text로 가져오거나 build 단계에서 동등한 방식으로 inline한다.
- overlay host는 기존 `#__crop_root__`와 `data-crop-root` 경계를 유지해 Task #3 smoke에서 확인한 중복 실행/close/reopen 흐름을 깨지 않는다.
- overlay dim/highlight layer는 page pointer hit-test를 막지 않아야 한다. pointer target 계산은 page 좌표 기준으로 수행하고, overlay 자체와 action button hit area는 선택 후보에서 제외한다.
- state machine은 `idle`, `hovering`, `selected`, `closing`처럼 명시적 상태를 두고 pointer/keyboard 이벤트별 전이를 테스트 가능하게 둔다.
- Copy/Save button은 이번 task에서 UI로만 표시한다. 실제 action은 후속 #6/#7에서 연결하며, 이번 task에서는 disabled 처리 또는 no-op 이벤트 기록 중 구현계획서에서 하나를 선택한다.
- visible/full page 상단 action 구조는 MVP 범위에 맞춰 visible 영역만 활성 UI로 두고 full page는 숨김 또는 disabled placeholder로 둔다.
- 자동 검증은 TypeScript/Vitest 중심으로 하고, 실제 hover/select/cancel은 Chrome unpacked extension 수동 smoke test로 확인한다.

## 문서 위치 판단

이번 task는 사용자-facing 제품 문서 루트를 새로 만들지 않는다. 다만 로컬 개발자가 Chrome unpacked extension으로 smoke할 때 기대 결과가 바뀌므로 루트 `README.md`의 로컬 로드 절차와 현재 개발 상태를 갱신한다.

| 파일 | 분류 | 대상 독자 | 선택 위치 | 대안 위치 | 선택 이유 |
|---|---|---|---|---|---|
| `README.md` | 기여자 로컬 실행 문서 | 기여자/에이전트 | 루트 `README.md` | `docs/dev.md` | 이미 로컬 개발과 Chrome unpacked smoke 절차의 진실 원천으로 사용 중이며, 별도 docs 루트를 만들 필요가 없다. |
| 공식 제품 문서 루트 | 해당 없음 | 해당 없음 | 해당 없음 | `docs/` | 이번 task는 사용자용 제품 문서 사이트나 공식 문서 루트를 만들지 않는다. |

## 예상 변경 파일

신규:

- `src/content/overlay/crop-overlay.ts`
- `src/content/overlay/crop-overlay.css`
- `src/content/overlay/crop-template.ts`
- `src/content/overlay/state-machine.ts`
- `tests/content/overlay/state-machine.test.ts`
- `tests/content/overlay/positioning.test.ts`
- 필요 시 CSS raw import type declaration 파일

수정:

- `src/content/inject.ts`
- `README.md`
- 필요 시 `vite.config.ts`
- 필요 시 `tsconfig.json`
- 필요 시 기존 `tests/` fixture 또는 test setup 파일

이번 task 산출물:

- `mydocs/orders/20260527.md`
- `mydocs/plans/task_m010_5.md`
- `mydocs/plans/task_m010_5_impl.md`
- `mydocs/working/task_m010_5_stage{N}.md`
- `mydocs/report/task_m010_5_report.md`

## 잠정 단계

- **Stage 1 — overlay 모듈 구조와 Shadow DOM template 분리**
  - `inject.ts` bootstrap 정리
  - `crop-overlay.ts`, `crop-template.ts`, `crop-overlay.css` 기본 구조
  - 기존 close/Escape/reopen/중복 실행 동작 유지 검증
- **Stage 2 — hover highlight와 helper 연결**
  - pointermove 기반 hover target 계산
  - `getElementFromPoint()`와 `getBestRectForElement()` 연결
  - hover dashed rectangle 표시와 overlay 자체 제외 정책 검증
- **Stage 3 — selection 상태와 action buttons 배치**
  - click으로 selected rectangle 고정
  - Copy/Save/Cancel button container 위치 계산
  - Cancel/Escape teardown과 기본 keyboard flow 검증
- **Stage 4 — smoke 절차, README, 통합 검증**
  - README smoke 기대 결과 갱신
  - build/typecheck/test 통합 검증
  - Chrome unpacked extension manual smoke test
  - 최종 보고서 작성과 PR 준비

## 검증 계획

### 단계별 검증

- Stage 1
  - `npm run build`
  - `npm run typecheck`
  - `rg "__crop_root__|attachShadow|Escape|crop-overlay" src/content`
  - `git diff --check`
- Stage 2
  - `npm run typecheck`
  - `npm run test`
  - `rg "getElementFromPoint|getBestRectForElement|pointermove|hover" src/content tests`
  - hover rect positioning unit test 또는 fixture 검증
- Stage 3
  - `npm run typecheck`
  - `npm run test`
  - `rg "selected|Copy|Save|Cancel|Escape" src/content tests`
  - state machine/button positioning test
- Stage 4
  - `npm run build`
  - `npm run typecheck`
  - `npm run test`
  - Chrome unpacked extension manual smoke test
  - `git diff --check`

### 통합 검증

- 확장 실행 시 페이지 위에 dim overlay가 표시된다.
- 일반 DOM 요소 hover 시 dashed highlight가 표시된다.
- 클릭하면 selected rectangle이 고정된다.
- selected rectangle 기준으로 Copy/Save/Cancel buttons가 표시된다.
- Cancel button 또는 Escape key로 overlay가 정리된다.
- 같은 탭에서 다시 실행해도 overlay가 중복으로 쌓이지 않는다.
- overlay UI가 기본 페이지 CSS 영향을 받지 않는다.
- actual capture/crop/clipboard/download는 실행되지 않는다.
- `npm run build`가 통과한다.
- `npm run typecheck`가 통과한다.
- `npm run test`가 통과한다.
- `git status --short`가 PR 준비 전 빈 출력이다.
- `git diff --check`가 경고 없이 통과한다.

## 리스크

- **overlay가 hit-test를 가로막음**: dim/highlight layer는 `pointer-events: none`을 기본으로 하고, action buttons만 pointer interaction을 받게 설계한다.
- **페이지 CSS 충돌**: Shadow DOM과 `:host { all: initial; }` 경계를 유지하고, smoke용 CSS 충돌 샘플에서 확인한다.
- **Copy/Save 기대치 혼선**: 이번 task에서는 button 표시와 layout까지만 완료한다. 실제 Copy/Save 동작은 #6/#7로 남긴다는 점을 README와 최종 보고서에 명시한다.
- **CSS bundling 불일치**: content script가 runtime injection 되는 구조이므로 CSS 파일이 별도 asset으로만 떨어지지 않게 inline 주입 방식을 구현계획서에서 확정한다.
- **브라우저 fixture와 실제 layout 차이**: state/positioning은 unit test로 검증하고, 실제 hover/select는 Chrome unpacked extension manual smoke로 보완한다.
- **범위 초과**: capture/crop, full page, resize handles, iframe 고도화 요구가 생기면 후속 이슈로 유지한다.

## 승인 요청 사항

- Phase 3 범위를 Shadow DOM overlay UI, hover highlight, selected rectangle, Copy/Save/Cancel button 표시와 cancel flow까지로 제한하는 것
- 실제 capture/crop, Clipboard write, file download, full page, drag resize, iframe 고도화를 이번 task에서 제외하는 것
- `src/content/overlay/`에 Chrome 전용 overlay 모듈을 두고 Firefox-derived helper는 import만 하는 구조 승인
- `README.md`를 이번 task에서 로컬 smoke 기대 결과 문서로 갱신하는 것
- Chrome unpacked extension manual smoke test를 Stage 4 수용 기준에 포함하는 것

승인되면 `task_m010_5_impl.md`에서 단계별 산출물, 검증 명령, 커밋 메시지를 구체화한다.
