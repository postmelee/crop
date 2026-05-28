# Task #7 수행계획서

GitHub Issue: [#7](https://github.com/postmelee/crop/issues/7)
마일스톤: M010

## 목적

`crop`의 selected rectangle crop 결과를 실제 사용자-facing Copy/Save 동작으로 완성한다. 이번 task의 결과물은 #6에서 만든 capture/crop backend의 PNG data URL을 받아, Copy는 시스템 클립보드에 PNG를 쓰고 Save는 PNG 파일 다운로드를 시작하는 흐름이다.

완료 후에는 사용자가 Chrome unpacked extension에서 영역을 선택한 뒤 `Copy`를 누르면 Firefox 원본처럼 overlay가 사라지고 우측 상단에 복사 완료 toast가 표시되어야 한다. `Save`는 Stage 4.1 manual smoke에서 `<a download>` 방식이 실패한 뒤 작업지시자 승인에 따라 Stage 4.2부터 `downloads` 권한과 background download API를 사용한다.

## 배경

#5에서 Firefox식 overlay UI와 Copy/Save/Cancel buttons가 준비됐고, #6에서 Copy/Save buttons가 `chrome.tabs.captureVisibleTab()` 기반 capture/crop backend를 호출해 crop PNG data URL과 output size metadata를 생성하도록 연결됐다. 다만 #6은 의도적으로 실제 clipboard write, file download, 성공 toast, filename sanitizer를 제외했다.

원본 계획서 `/Users/melee/Downloads/crop_development_plan_prompt.md`의 Phase 5는 Copy/Save 구현, clipboard 실패 fallback, 파일명 sanitizer, 성공/실패 UX 정리를 요구한다. 최근 수동 smoke에서도 crop backend 자체는 성공했으므로 이번 task는 그 결과를 사용자-visible action으로 이어붙이는 단계다.

## 범위

### 포함

- PNG data URL을 `Blob` 또는 `ClipboardItem` 입력으로 변환하는 helper
- `navigator.clipboard.write()`와 `ClipboardItem` 기반 Copy 동작
- Copy 성공 시 기존 selection overlay 제거
- Copy 성공 후 우측 상단 완료 toast 표시
- clipboard 실패 시 재시도 가능한 상태 유지와 Save fallback 안내
- background `chrome.downloads.download()` 기반 Save 동작
- 다운로드 파일명 sanitizer와 기본 파일명 정책
- Copy/Save action 중복 클릭 방지와 pending 상태 정리
- 실패/성공 상태를 smoke에서 확인할 수 있는 DOM metadata
- 관련 unit test와 Chrome manual smoke 절차 갱신
- README의 개발 상태와 Chrome unpacked smoke 기대 결과 갱신

### 제외

- full page capture
- scroll stitching
- `debugger` 권한
- `<all_urls>` host 권한 추가
- resize/move handles
- iframe/nested context 내부 선택 고도화
- Chrome Web Store 배포 문구
- 서버 업로드 또는 telemetry

## 설계 방향

- Copy/Save는 #6의 `CropCapturePipelineResult`를 입력 경계로 삼는다. capture/crop 자체 계산은 다시 구현하지 않고, 성공 결과를 clipboard/download에 전달하는 후처리만 추가한다.
- Clipboard write는 content script에서 사용자 action의 비동기 흐름 안에서 실행한다. `ClipboardItem` 또는 `navigator.clipboard.write()`가 없거나 실패하면 overlay를 닫지 않고 사용자가 Save를 선택할 수 있게 한다.
- Copy 성공 toast는 selection overlay와 분리된 가벼운 Shadow DOM host로 구현한다. Copy 성공 시 overlay root를 제거해도 toast는 일정 시간 유지되어야 한다.
- Save는 Stage 4.2부터 content script가 crop PNG data URL과 sanitized filename을 background service worker로 보내고, background가 `chrome.downloads.download()`로 다운로드를 시작하는 방식으로 구현한다.
- 파일명은 문서 title을 보조 입력으로 사용하되, 경로 구분자/제어문자/예약 문자/과도한 길이를 제거하고 빈 값이면 timestamp 기반 `crop-screenshot-{timestamp}.png`로 fallback한다.
- 성공/실패 UX는 Firefox 원본 흐름에 가깝게 맞추되, 제품명과 사용자-facing 브랜딩은 `crop`만 사용한다.
- Chrome MV3 MVP 권한 정책은 `activeTab`, `scripting`, `clipboardWrite` 중심을 유지하되, 작업지시자 승인에 따라 Save 안정화를 위한 `downloads` 권한만 Stage 4.2에서 추가한다. `debugger`, `<all_urls>`는 추가하지 않는다.

## 문서 위치 판단

이번 task는 별도 공식 제품 문서 루트를 만들지 않는다. 다만 로컬 개발자와 작업자가 Copy/Save smoke를 재현할 수 있어야 하므로 루트 `README.md`의 개발 상태와 Chrome unpacked smoke 기대 결과를 갱신한다.

| 파일 | 분류 | 대상 독자 | 선택 위치 | 대안 위치 | 선택 이유 |
|---|---|---|---|---|---|
| `README.md` | 기여자 로컬 실행 문서 | 기여자/에이전트 | 루트 `README.md` | `docs/dev.md` | 이미 unpacked extension 로드와 smoke 기대 결과의 진실 원천으로 사용 중이며, #7만을 위해 새 공식 docs 루트를 만들 필요가 없다. |
| 공식 제품 문서 루트 | 해당 없음 | 해당 없음 | 해당 없음 | `docs/` | 이번 task는 사용자용 문서 사이트나 배포 문구를 만들지 않는다. |

## 예상 변경 파일

신규:

- `src/shared/clipboard.ts`
- `src/shared/filename.ts`
- `tests/shared/clipboard.test.ts`
- `tests/shared/filename.test.ts`

수정:

- `src/content/overlay/crop-overlay.ts`
- `src/content/overlay/crop-template.ts`
- `src/content/overlay/positioning.ts`
- `src/content/overlay/styles.ts` 또는 overlay template/style 정의 파일
- `src/background/service-worker.ts`
- `src/shared/messages.ts`
- `tests/shared/messages.test.ts`
- `manifest.json`
- `README.md`
- 필요 시 `src/shared/crop-image.ts`
- 필요 시 `tests/shared/crop-image.test.ts`

이번 task 산출물:

- `mydocs/orders/20260528.md`
- `mydocs/plans/task_m010_7.md`
- `mydocs/plans/task_m010_7_impl.md`
- `mydocs/working/task_m010_7_stage{N}.md`
- `mydocs/report/task_m010_7_report.md`

## 잠정 단계

- **Stage 1 — clipboard/download helper와 filename sanitizer**
  - PNG data URL to Blob helper, clipboard capability helper, filename sanitizer 작성
  - sanitizer와 data conversion 단위 테스트
- **Stage 2 — Copy 성공 흐름과 toast**
  - Copy button을 clipboard write에 연결
  - Copy 성공 시 overlay 제거와 우측 상단 완료 toast 표시
  - clipboard 성공 metadata와 실패 경계 검증
- **Stage 3 — Save 다운로드 흐름**
  - Save button을 PNG download action에 연결
  - sanitized filename과 download trigger 경계 검증
- **Stage 4 — 실패/fallback UX와 manual smoke**
  - clipboard 실패 시 overlay 유지, 상태 표시, Save fallback 안내 구현
  - Chrome manual smoke로 Copy paste, Save PNG 확인, 실패 fallback 확인
- **Stage 4.2 — Save 다운로드 권한 보정**
  - Stage 4.1 manual smoke에서 Save 미동작 확인 후 `downloads` 권한과 background download API 도입
  - Chrome manual smoke로 Save 다운로드 재확인
- **Stage 5 — README, 최종 보고서, 통합 검증**
  - README smoke 기대 결과 갱신
  - build/typecheck/test/manual smoke 결과 정리
  - 최종 보고서 작성과 PR 준비

## 검증 계획

### 단계별 검증

- Stage 1
  - `npm run typecheck`
  - `npm run test`
  - `rg "ClipboardItem|clipboard|download|sanitize|filename" src tests`
  - `git diff --check`
- Stage 2
  - `npm run build`
  - `npm run typecheck`
  - `npm run test`
  - Chrome manual smoke: Copy 후 붙여넣기 가능한 PNG 확인
  - Chrome manual smoke: Copy 성공 후 overlay 제거와 우측 상단 toast 확인
- Stage 3
  - `npm run build`
  - `npm run typecheck`
  - `npm run test`
  - Chrome manual smoke: Save 후 PNG 파일 다운로드와 파일명 확인
- Stage 4
  - `npm run build`
  - Chrome manual smoke: clipboard 실패 또는 mock 실패 상태에서 overlay 유지와 Save fallback 안내 확인
  - `rg "data-crop|fallback|toast|download" src README.md mydocs`
- Stage 4.2
  - `npm run build`
  - `npm run typecheck`
  - `npm run test`
  - `rg "downloads|downloadPng|CropDownload|chrome.downloads|<all_urls>|debugger" manifest.json src tests mydocs`
  - Chrome manual smoke: Save 후 PNG 파일 다운로드 확인
- Stage 5
  - `npm run build`
  - `npm run typecheck`
  - `npm run test`
  - `git diff --check`
  - `git status --short`

### 통합 검증

- Copy 버튼이 selected crop PNG를 시스템 클립보드에 쓴다.
- Copy 성공 후 selection overlay가 제거되고 우측 상단 완료 toast가 표시된다.
- Copy 실패 시 overlay가 유지되고 사용자가 Save를 선택할 수 있는 fallback 안내가 보인다.
- Save 버튼이 selected crop PNG 다운로드를 시작한다.
- 다운로드 파일명이 안전하게 sanitize된다.
- Copy/Save 중복 클릭이 중복 capture/download를 만들지 않는다.
- 최종 PNG에 overlay, highlight, prompt, buttons, toast가 포함되지 않는다.
- `downloads` 권한은 Stage 4.2 승인에 따라 추가되고, `debugger`, `<all_urls>` 권한은 추가되지 않는다.
- `npm run build`가 통과한다.
- `npm run typecheck`가 통과한다.
- `npm run test`가 통과한다.
- `git status --short`가 PR 준비 전 빈 출력이다.
- `git diff --check`가 경고 없이 통과한다.

## 리스크

- **Clipboard 사용자 활성화 만료**: capture/crop 비동기 처리 뒤 clipboard write가 브라우저 정책에 따라 실패할 수 있다. 실패 시 overlay를 유지하고 Save fallback을 안내한다.
- **Clipboard API 호환성**: `ClipboardItem` 또는 image clipboard write가 제한될 수 있다. capability check와 실패 메시지를 분리하고 manual smoke에서 실제 Chrome 동작을 확인한다.
- **toast가 capture에 포함될 위험**: toast는 Copy 성공 이후에만 띄우고, capture 직전에는 #6의 overlay 숨김 흐름을 유지한다.
- **download 권한 확대**: Stage 4.2에서 `downloads` 권한을 추가한다. 범위 확대는 Save 안정화를 위한 단일 권한으로 제한하고 `debugger`, `<all_urls>`는 추가하지 않는다.
- **파일명 edge case**: 문서 title이 비어 있거나 매우 길거나 금지 문자를 포함할 수 있다. sanitizer 단위 테스트로 빈 값, 예약 문자, 긴 문자열, 확장자 중복을 검증한다.
- **범위 초과**: full page, scroll stitching, resize/move, iframe 고도화 요구는 #12~#15 후속 이슈로 유지한다.
- **자동 smoke 한계**: Chrome extension clipboard/download 동작은 자동화 제약이 있으므로 핵심 성공 기준은 manual smoke 절차로 보완한다.

## 승인 요청 사항

- Phase 5 범위를 Copy clipboard write, Save file download, filename sanitizer, 성공/실패 UX, README smoke 갱신까지로 제한하는 것
- Copy 성공 시 overlay를 제거하고 별도 toast root로 우측 상단 완료 toast를 표시하는 것
- Copy 실패 시 overlay를 유지하고 Save fallback을 안내하는 것
- Save는 Stage 4.2부터 `downloads` 권한과 background `chrome.downloads.download()` 기반으로 보정하는 것
- `debugger`, `<all_urls>` 권한을 추가하지 않는 것
- full page capture, scroll stitching, resize/move handles, iframe/nested context 지원을 후속 이슈로 유지하는 것

승인되면 `task_m010_7_impl.md`에서 단계별 산출물, 검증 명령, 커밋 메시지를 구체화한다.
