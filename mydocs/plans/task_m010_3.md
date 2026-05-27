# Task #3 수행계획서

GitHub Issue: [#3](https://github.com/postmelee/crop/issues/3)
마일스톤: M010

## 목적

`crop`을 Chrome에서 unpacked extension으로 로드할 수 있는 MV3 확장 shell 상태로 만든다. 이번 task의 핵심은 `manifest.json`, background service worker, content script injection, 최소 overlay/stub 표시 흐름을 구현해 이후 Phase 2~5의 요소 선택, overlay UI, capture/crop, Copy/Save 구현이 연결될 수 있는 진입점을 마련하는 것이다.

완료 후에는 action icon 클릭과 `open-crop` 단축키가 같은 content script 주입 경로를 사용해야 한다. 단, 이번 task에서는 실제 Firefox-derived 요소 탐지, Firefox식 overlay UI, capture/crop, Copy/Save 기능은 구현하지 않는다.

## 배경

Phase 0 Task #1에서 TypeScript/Vite/npm 기반과 `src/` 경계가 준비됐다. 현재 Vite 설정은 실제 runtime entrypoint가 없는 Phase 0용 virtual no-op entry를 사용한다. Issue #3은 계획서의 Phase 1 — Chrome 확장 shell에 해당하며, 실제 MV3 산출물을 만들 수 있도록 Vite entrypoint와 manifest를 연결해야 한다.

첨부 계획서 `/Users/melee/Downloads/crop_development_plan_prompt.md`의 Phase 1 완료 조건은 아이콘 클릭 시 overlay 표시, 등록 가능한 환경에서 shortcut 동작, 단축키 등록 실패 감지다. 사용자 smoke 과정에서 기존 `Command+Shift+S` 후보가 자동 등록되지 않아 최종 suggested shortcut은 `Ctrl+Shift+P` / macOS `Command+Shift+P`로 조정한다.

## 범위

### 포함

- `manifest.json` 작성
- `src/background/service-worker.ts` 작성
- `src/content/inject.ts` 작성
- Vite build 설정을 실제 MV3 entrypoint 기준으로 조정
- `chrome.action.onClicked`와 `open-crop` 단축키가 동일한 주입 함수를 사용하도록 구성
- `chrome.scripting.executeScript()`로 content script 주입
- content script에서 최소 overlay/stub을 표시하고 중복 실행 시 기존 stub을 제거하거나 focus
- 제한 페이지나 주입 실패 시 background console warning 처리
- README에 unpacked extension 빌드/로드 smoke 절차 보강

### 제외

- Firefox-derived helper 포팅
- 실제 DOM 요소 hover 알고리즘
- Firefox식 overlay UI 완성
- capture/crop backend
- Copy/Save 동작
- full page capture
- Chrome Web Store 배포 준비

## 설계 방향

- `manifest.json`은 저장소 루트의 source manifest로 두고, Vite build 시 `dist/manifest.json`으로 복사한다.
- background entry는 `src/background/service-worker.ts`, content entry는 `src/content/inject.ts`로 둔다. build output은 manifest에서 참조하기 쉬운 `background/service-worker.js`, `content/inject.js` 형태를 목표로 한다.
- manifest 권한은 계획서의 MVP 원칙에 맞춰 `activeTab`, `scripting`, `clipboardWrite` 중심으로 유지한다. `debugger`, `<all_urls>`는 추가하지 않는다.
- `open-crop` command에는 기본 `Ctrl+Shift+P`, macOS `Command+Shift+P`를 제안한다.
- Phase 1 overlay는 기능 완성용 UI가 아니라 shell 검증용 stub이다. 이후 Phase 3에서 Shadow DOM overlay UI로 교체/확장될 수 있도록 host id와 cleanup 함수를 명확히 둔다.
- 제한 페이지 주입 실패는 사용자-facing UI가 아니라 console warning으로 처리한다. 옵션 페이지나 에러 UI는 이번 task에서 만들지 않는다.

## 문서 위치 판단

이번 task는 제품/사용자 문서 루트를 새로 만들지 않는다. 확장 개발자가 로컬에서 빌드하고 unpacked extension으로 로드하는 절차만 루트 `README.md`에 보강한다.

| 파일 | 분류 | 대상 독자 | 선택 위치 | 대안 위치 | 선택 이유 |
|---|---|---|---|---|---|
| `README.md` | 공식 문서 | 기여자/에이전트 | 루트 `README.md` | `docs/development.md` | 별도 공식 문서 루트를 만들 정도의 규모가 아니며, 첫 로컬 실행 절차는 저장소 첫 화면에 있어야 한다. |
| `manifest.json` | 제품 설정 | Chrome | 루트 `manifest.json` | `src/manifest.json` | Chrome extension source manifest로 식별이 쉽고, build copy 대상이 명확하다. |

## 예상 변경 파일

신규:

- `manifest.json`
- `src/background/service-worker.ts`
- `src/content/inject.ts`

수정:

- `README.md`
- `package.json` 또는 scripts 필요 시
- `vite.config.ts`

이번 task 산출물:

- `mydocs/orders/20260525.md`
- `mydocs/plans/task_m010_3.md`
- `mydocs/plans/task_m010_3_impl.md`
- `mydocs/working/task_m010_3_stage{N}.md`
- `mydocs/report/task_m010_3_report.md`

## 잠정 단계

- **Stage 1 — MV3 manifest와 Vite output 연결**
  - `manifest.json`, `vite.config.ts`, 필요 시 npm scripts
  - `dist/manifest.json`, background/content output 경로 검증
- **Stage 2 — background 주입 흐름 구현**
  - `src/background/service-worker.ts`
  - action click과 `open-crop` command가 동일 주입 함수 사용
- **Stage 3 — content overlay stub 구현**
  - `src/content/inject.ts`
  - 최소 overlay/stub 표시, 중복 실행 처리, teardown/focus 정책
- **Stage 4 — 로컬 로드 절차와 최종 검증**
  - `README.md` smoke 절차 보강
  - build/typecheck/manual Chrome smoke 결과 정리

## 검증 계획

### 단계별 검증

- Stage 1
  - `npm run build`
  - `test -f dist/manifest.json`
  - `find dist -maxdepth 3 -type f -print`
- Stage 2
  - `npm run typecheck`
  - `rg "chrome.action.onClicked|chrome.commands.onCommand|executeScript" src/background/service-worker.ts`
- Stage 3
  - `npm run build`
  - `rg "__crop_root__|crop" src/content/inject.ts`
- Stage 4
  - Chrome unpacked extension 수동 로드
  - action icon click smoke test
  - `open-crop` shortcut smoke test
  - 제한 페이지 주입 실패 console warning 확인

### 통합 검증

- `npm run build`가 통과한다.
- `npm run typecheck`가 통과한다.
- `dist/manifest.json`이 생성되고 manifest가 built background/content 파일을 참조한다.
- Chrome에서 `dist/`를 unpacked extension으로 로드할 수 있다.
- action icon 클릭 시 현재 탭에 최소 overlay/stub이 표시된다.
- 단축키가 등록 가능한 환경에서 같은 주입 흐름으로 동작한다.
- 중복 실행이 overlay/stub을 중복으로 쌓지 않는다.
- `git status --short`가 PR 준비 전 빈 출력이다.
- `git diff --check`가 경고 없이 통과한다.

## 리스크

- **Chrome 수동 검증 필요**: extension load와 action click은 브라우저 수동 검증이 필요하다. 자동화가 어려우면 검증 한계와 수동 확인 결과를 단계/최종 보고서에 명확히 기록한다.
- **단축키 충돌**: `Ctrl+Shift+P` 또는 `Command+Shift+P`가 환경에 따라 등록되지 않을 수 있다. Phase 1에서는 console warning으로 감지하고, 안내 UI는 후속 task 후보로 둔다.
- **Vite output 경로 불일치**: manifest가 참조하는 파일과 Vite 산출물 경로가 어긋나면 Chrome load가 실패한다. Stage 1에서 `dist` 파일 경로를 먼저 검증한다.
- **제한 페이지 주입 실패**: `chrome://`, Chrome Web Store 등에는 script injection이 실패할 수 있다. 실패를 삼키지 말고 console warning으로 남긴다.

## 승인 요청 사항

- Phase 1 범위를 MV3 shell과 최소 overlay/stub까지로 제한하는 것
- 루트 `manifest.json`을 source manifest로 두고 build 시 `dist/manifest.json`으로 복사하는 것
- Vite output을 `background/service-worker.js`, `content/inject.js` 형태로 맞추는 것
- 단축키 등록/주입 실패는 이번 task에서 console warning까지만 처리하는 것
- Firefox-derived helper, 실제 overlay UI, capture/crop, Copy/Save는 후속 Phase 이슈로 유지하는 것

승인되면 `task_m010_3_impl.md`에서 단계별 산출물, 검증 명령, 커밋 메시지를 구체화한다.
