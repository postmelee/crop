# Task #3 구현계획서

수행계획서: [`task_m010_3.md`](task_m010_3.md)
GitHub Issue: [#3](https://github.com/postmelee/crop/issues/3)
마일스톤: M010

## 단계 개요

| Stage | 제목 | 주요 산출 | 검증 |
|---|---|---|---|
| 1 | MV3 manifest와 Vite output 연결 | `manifest.json`, `vite.config.ts` | `npm run build`, `test -f dist/manifest.json`, `find dist -maxdepth 3 -type f -print` |
| 2 | background 주입 흐름 구현 | `src/background/service-worker.ts` | `npm run typecheck`, `rg "chrome.action.onClicked|chrome.commands.onCommand|executeScript"` |
| 3 | content overlay stub 구현 | `src/content/inject.ts` | `npm run build`, `rg "__crop_root__|crop"` |
| 4 | 로컬 로드 절차와 최종 검증 | `README.md`, final report | `npm run build`, `npm run typecheck`, Chrome smoke test, `git diff --check` |

## 문서 위치 확인

수행계획서의 "문서 위치 판단"과 실제 Stage 산출물 경로를 다음과 같이 일치시킨다. 이번 task에서는 `docs/`, `specs/`, `site/`, `website/`, `adr/` 같은 공식 문서 루트를 만들지 않는다.

| 파일 | 수행계획서상 선택 위치 | Stage 산출물 경로 | 일치 여부 | 비고 |
|---|---|---|---|---|
| `README.md` | 루트 `README.md` | `README.md` | OK | unpacked extension 로드 절차만 보강 |
| `manifest.json` | 루트 `manifest.json` | `manifest.json` | OK | source manifest로 관리하고 build 시 `dist/manifest.json`으로 복사 |

## Stage 1 — MV3 manifest와 Vite output 연결

### 산출물

신규:

- `manifest.json`
- `mydocs/working/task_m010_3_stage1.md`

수정:

- `vite.config.ts`
- 필요 시 `package.json`

### 변경 내용

- 루트 `manifest.json`을 source manifest로 추가한다.
- manifest는 MV3, 제품명 `crop`, version `0.1.0`, `activeTab`, `scripting`, `clipboardWrite`, background service worker, action, `_execute_action` command를 정의한다.
- `debugger`와 `<all_urls>` 권한은 추가하지 않는다.
- Vite 설정을 Phase 0 virtual no-op entry에서 실제 extension entrypoint output 구조로 변경한다.
- build 시 `dist/manifest.json`, `dist/background/service-worker.js`, `dist/content/inject.js`가 생성되도록 output 경로를 맞춘다.
- Stage 1에서는 entrypoint 파일이 필요한 경우 최소 placeholder만 둘 수 있으나, 실제 background 주입 로직은 Stage 2에서 구현한다.

### 검증

```bash
npm run build
test -f dist/manifest.json
find dist -maxdepth 3 -type f -print
git diff --check
```

### 커밋

```text
Task #3 Stage 1: MV3 manifest와 Vite output 연결
```

## Stage 2 — background 주입 흐름 구현

### 산출물

신규 또는 수정:

- `src/background/service-worker.ts`
- `mydocs/working/task_m010_3_stage2.md`

### 변경 내용

- action icon click handler를 추가한다.
- `_execute_action` command handler를 추가한다.
- 두 entrypoint가 동일한 `injectCrop(tab)` 흐름을 사용하도록 구성한다.
- `chrome.scripting.executeScript()`로 `content/inject.js`를 주입한다.
- 제한 페이지, tab id 부재, script injection 실패를 console warning으로 남긴다.
- `chrome.commands.getAll()`로 shortcut registration 상태를 확인하고 미등록 시 warning을 남긴다.

### 검증

```bash
npm run typecheck
rg "chrome.action.onClicked|chrome.commands.onCommand|executeScript|commands.getAll" src/background/service-worker.ts
npm run build
git diff --check
```

### 커밋

```text
Task #3 Stage 2: background 주입 흐름 구현
```

## Stage 3 — content overlay stub 구현

### 산출물

신규 또는 수정:

- `src/content/inject.ts`
- `mydocs/working/task_m010_3_stage3.md`

### 변경 내용

- content script 실행 시 `__crop_root__` host를 생성한다.
- Shadow DOM 또는 isolated host 기반으로 최소 overlay/stub을 표시한다.
- 중복 실행 시 기존 host를 제거하거나 focus/flash 처리해 overlay/stub이 중복으로 쌓이지 않게 한다.
- Escape 또는 close button으로 stub을 제거할 수 있게 한다.
- 이 단계의 UI는 shell 검증용이며 실제 Firefox식 hover/select UI는 Phase 3 이슈로 남긴다.

### 검증

```bash
npm run build
npm run typecheck
rg "__crop_root__|crop|attachShadow|Escape" src/content/inject.ts
git diff --check
```

### 커밋

```text
Task #3 Stage 3: content overlay stub 구현
```

## Stage 4 — 로컬 로드 절차와 최종 검증

### 산출물

신규:

- `mydocs/report/task_m010_3_report.md`

수정:

- `README.md`
- `mydocs/orders/20260525.md`
- 필요 시 Stage 1~3 산출물의 작은 정정

### 변경 내용

- README에 `npm run build` 후 `dist/`를 Chrome unpacked extension으로 로드하는 smoke 절차를 추가한다.
- action icon click, shortcut, 중복 실행, 제한 페이지 실패를 확인하는 수동 검증 절차를 문서화한다.
- 가능한 범위에서 Chrome 수동 smoke test를 수행하고 결과를 최종 보고서에 기록한다.
- 로컬 Chrome 검증을 수행하지 못하면 검증 한계로 명시한다.
- 오늘할일을 완료 상태로 갱신한다.

### 검증

```bash
npm run build
npm run typecheck
test -f dist/manifest.json
find dist -maxdepth 3 -type f -print
git diff --check
git status --short
```

수동 검증:

- Chrome에서 `dist/` unpacked extension 로드
- action icon click smoke test
- `_execute_action` shortcut smoke test
- 중복 실행 smoke test
- 제한 페이지 주입 실패 warning 확인

### 커밋

```text
Task #3 Stage 4 + 최종 보고서: Chrome MV3 shell 완료
```

## 검증

- 각 Stage 검증 명령은 단계 보고서 작성 전에 실행한다.
- 실패한 검증은 단계 완료로 처리하지 않는다.
- 계획 변경이 필요하면 구현계획서를 먼저 갱신하고 작업지시자 승인을 받는다.
- 문서 위치가 수행계획서 판단과 달라지면 구현 전에 수행계획서 또는 구현계획서를 갱신하고 작업지시자 승인을 받는다.

## 커밋

- 단계 커밋은 단계 산출물과 `mydocs/working/task_m010_3_stage{N}.md`를 함께 묶는다.
- 커밋 메시지는 `Task #3 Stage {N}: {핵심 내용 요약}` 형식을 따른다.
- 최종 보고서 커밋은 `Task #3 Stage 4 + 최종 보고서: Chrome MV3 shell 완료` 형식을 따른다.

## 단계 의존성

- Stage 2는 Stage 1에서 manifest와 built output 경로가 확정된 후 진행한다.
- Stage 3은 Stage 2의 script injection target path가 확정된 후 진행한다.
- Stage 4는 Stage 1~3 검증과 단계 보고서 승인이 끝난 후 진행한다.

## 위험과 대응

- **Vite output과 manifest 경로 불일치**: Stage 1에서 `dist` 파일 목록을 검증하고, mismatch가 있으면 manifest 또는 output naming을 즉시 보정한다.
- **Chrome API type 부재**: `chrome` global type이 필요하면 `@types/chrome` 추가를 Stage 2에서 다루되, 의존성 변경과 lockfile을 함께 커밋한다.
- **수동 Chrome 검증 제약**: 로컬 GUI/Chrome 접근이 제한되면 자동 검증 결과와 함께 검증 한계를 최종 보고서에 명시한다.
- **단축키 충돌**: shortcut이 등록되지 않을 수 있으므로 Phase 1에서는 console warning만 보장하고 사용자 안내 UI는 후속 task로 분리한다.
- **범위 초과**: 실제 hover/select overlay, capture/crop, Copy/Save 요구가 생기면 #4~#7 후속 이슈로 유지한다.

## 승인 요청 사항

- 위 4개 Stage 분할과 산출물 경로 승인
- 루트 `manifest.json`을 source manifest로 두고 `dist/manifest.json`으로 복사하는 구조 승인
- Stage 1에서 build output 경로 확정을 먼저 하고 Stage 2~3에서 실제 entrypoint 로직을 채우는 순서 승인
- Chrome 수동 검증을 가능한 범위에서 수행하고, 불가능한 항목은 검증 한계로 기록하는 방식 승인
- Phase 1 범위를 MV3 shell과 최소 overlay/stub까지로 제한하는 것 승인
