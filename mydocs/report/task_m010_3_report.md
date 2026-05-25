# Task #3 최종 보고서

GitHub Issue: [#3](https://github.com/postmelee/crop/issues/3)
마일스톤: M010

## 작업 요약

- 대상 이슈: #3
- 마일스톤: M010
- 단계 수: 4
- 작업 목적: Chrome에서 unpacked extension으로 로드 가능한 MV3 shell과 최소 overlay stub 진입점을 마련한다.

## 변경 파일 목록과 영향 범위

| 경로 | 변경 요약 | 영향 범위 |
|---|---|---|
| `manifest.json` | MV3 source manifest, `crop` metadata, action, `_execute_action`, `activeTab`/`scripting`/`clipboardWrite` 권한 정의 | Chrome extension 로드 설정 |
| `vite.config.ts` | source manifest emit과 background/content entrypoint output 경로 구성 | build 산출물 구조 |
| `tsconfig.json` | Vite config에서 JSON manifest import를 허용하도록 `resolveJsonModule` 추가 | TypeScript build 설정 |
| `src/background/service-worker.ts` | action click과 command를 공통 `injectCrop()` 흐름으로 연결하고 주입 실패/shortcut warning 처리 | MV3 background runtime |
| `src/content/inject.ts` | `__crop_root__` Shadow DOM overlay stub, 중복 실행 flash, Escape/close 제거 구현, 반복 주입 시 top-level 선언 충돌이 나지 않도록 IIFE로 격리 | content script runtime |
| `README.md` | Phase 1 상태와 Chrome unpacked extension 로드 smoke 절차 문서화 | 기여자 로컬 실행 문서 |
| `mydocs/plans/task_m010_3.md` | 수행계획서 작성 | Hyper-Waterfall 작업 추적 |
| `mydocs/plans/task_m010_3_impl.md` | 단계별 구현계획서 작성 | Hyper-Waterfall 작업 추적 |
| `mydocs/working/task_m010_3_stage1.md` | Stage 1 완료 보고서 작성 | 단계 검증 기록 |
| `mydocs/working/task_m010_3_stage2.md` | Stage 2 완료 보고서 작성 | 단계 검증 기록 |
| `mydocs/working/task_m010_3_stage3.md` | Stage 3 완료 보고서 작성 | 단계 검증 기록 |
| `mydocs/orders/20260525.md` | #3 오늘할일 완료 처리 | 작업 상태 기록 |

## 문서 위치 검증

| 파일 | 계획된 위치 | 실제 위치 | 결과 | 근거 |
|---|---|---|---|---|
| `README.md` | 루트 `README.md` | `README.md` | OK | 수행계획서의 문서 위치 판단과 일치한다. 별도 공식 문서 루트는 만들지 않았다. |
| `manifest.json` | 루트 `manifest.json` | `manifest.json` | OK | 수행계획서의 source manifest 위치와 일치한다. |
| `task_m010_3_report.md` | `mydocs/report/` | `mydocs/report/task_m010_3_report.md` | OK | 최종 보고서 템플릿 위치 정책과 일치한다. |

## 변경 전·후 정량 비교

| 지표 | 변경 전 | 변경 후 |
|---|---|---|
| runtime source entrypoint | Phase 0 virtual no-op | `src/background/service-worker.ts` 132줄, `src/content/inject.ts` 207줄 |
| build output | virtual probe 중심 | `dist/manifest.json`, `dist/background/service-worker.js`, `dist/content/inject.js` |
| manifest 권한 | 없음 | `activeTab`, `scripting`, `clipboardWrite` |
| 단계 보고서 | 없음 | Stage 1~3 보고서 3개, 총 166줄 |
| README | Phase 0 상태 설명 94줄 | Phase 1 상태와 로드 절차 114줄 |

## 검증 결과

| 수용 기준 | 결과 |
|---|---|
| `npm run build` 통과 | OK — Vite v6.4.2 build 성공, background/content/manifest 산출 |
| `npm run typecheck` 통과 | OK — `tsc --noEmit` 성공 |
| `dist/manifest.json` 생성 | OK — `test -f dist/manifest.json` 성공 |
| manifest가 built background/content 파일을 참조 | OK — `background/service-worker.js`, `content/inject.js` 산출 확인 |
| manifest 권한 범위 유지 | OK — `activeTab,scripting,clipboardWrite` 확인, `debugger`와 `<all_urls>` 매치 없음 |
| Chrome package manifest 유효성 | OK — Google Chrome `--pack-extension=/Users/melee/Documents/Crop/dist` 성공 |
| content overlay stub DOM 동작 | OK — headless Chrome DOM smoke에서 중복 실행 후 `#__crop_root__` 1개, Shadow DOM 있음, close 후 제거 확인 |
| 사용자 unpacked smoke 후속 수정 | OK — 첫 실행 후 재클릭 강조 실패, close 후 재실행 실패 증상을 content script IIFE 격리로 수정했다. headless Chrome DOM smoke에서 반복 실행, close, 재실행을 확인했다. |
| Chrome unpacked extension action icon smoke | 제한 — 이 환경의 Chrome `--load-extension` 임시 프로필 smoke에서 crop extension이 Preferences에 등록되지 않아 action icon 클릭 자동 검증은 수행하지 못했다. README에 수동 절차를 남겼다. |
| `_execute_action` shortcut smoke | 제한 — 위와 같은 `--load-extension` 제약으로 실제 extension command smoke는 수행하지 못했다. manifest와 background handler, content script DOM smoke로 부분 확인했다. |
| 중복 실행이 overlay를 중복으로 쌓지 않음 | OK — content script DOM smoke에서 script 2회 실행 후 `rootCount=1` 확인 |
| `git diff --check` 통과 | OK — whitespace 경고 없음 |
| PR 준비 전 `git status --short` 빈 출력 | 최종 커밋 후 확인 예정 |

### 단계별 검증 결과

- Stage 1: [`task_m010_3_stage1.md`](../working/task_m010_3_stage1.md) — MV3 manifest와 Vite output 연결, build/typecheck/manifest 검증 통과
- Stage 2: [`task_m010_3_stage2.md`](../working/task_m010_3_stage2.md) — background action/command 주입 흐름, typecheck/build/API 검색 검증 통과
- Stage 3: [`task_m010_3_stage3.md`](../working/task_m010_3_stage3.md) — content overlay stub, build/typecheck/필수 문자열 검색 검증 통과

## 잔여 위험과 후속 작업

### 잔여 위험

- 현재 환경에서는 Chrome `--load-extension` 기반 자동 smoke가 crop extension을 실제 unpacked extension으로 등록하지 못했다. PR 리뷰 또는 merge 전 로컬 Chrome UI에서 README 절차로 action icon과 shortcut을 한 번 더 확인해야 한다.
- `Ctrl+Shift+S` 또는 `Command+Shift+S`는 환경이나 Chrome shortcut 충돌에 따라 미등록될 수 있다. Phase 1은 `chrome.commands.getAll()` warning까지만 처리한다. [Chrome commands 공식 문서](https://developer.chrome.com/docs/extensions/reference/api/commands)상 `_execute_action`은 action을 트리거하지만 `commands.onCommand` 이벤트를 dispatch하지 않으므로, 단축키는 `chrome://extensions/shortcuts`에서 등록 상태를 직접 확인해야 한다.
- overlay는 shell 검증용 stub이다. 실제 hover/select/capture/Copy/Save UX는 후속 Phase 이슈에서 구현한다.

### 후속 작업 후보

- #4 Phase 2: Firefox Screenshots 핵심 선택 로직 포팅
- #5 Phase 3: Shadow DOM overlay UI 구현
- #6 Phase 4: 캡처/크롭 backend 구현
- #7 Phase 5: Copy/Save/UX polish

## 작업지시자 승인 요청

- 최종 보고서와 수용 기준 검증 결과를 승인하면 PR 게시 절차로 진행한다.
