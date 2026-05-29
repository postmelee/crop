# Task #7 구현계획서

수행계획서: [`task_m010_7.md`](task_m010_7.md)
GitHub Issue: [#7](https://github.com/postmelee/crop/issues/7)
마일스톤: M010

## 단계 개요

| Stage | 제목 | 주요 산출 | 검증 |
|---|---|---|---|
| 1 | clipboard/download helper와 filename sanitizer | `src/shared/clipboard.ts`, `src/shared/filename.ts`, `tests/shared/*` | `npm run typecheck`, `npm run test`, helper grep |
| 2 | Copy 성공 흐름과 toast | `src/content/overlay/crop-overlay.ts`, `src/content/overlay/crop-template.ts`, `src/content/overlay/crop-overlay.css` | `npm run build`, `npm run typecheck`, `npm run test` |
| 3 | Save 다운로드 흐름 | `src/content/overlay/crop-overlay.ts`, `src/shared/filename.ts` | `npm run build`, `npm run typecheck`, `npm run test` |
| 4 | 실패/fallback UX와 manual smoke | fallback UI, smoke fixture 또는 절차 | `npm run build`, Chrome manual smoke |
| 5 | README, 최종 보고서, 통합 검증 | `README.md`, `mydocs/report/task_m010_7_report.md` | `npm run build`, `npm run typecheck`, `npm run test`, `git diff --check` |

## 문서 위치 확인

수행계획서의 "문서 위치 판단"과 실제 Stage 산출물 경로를 다음과 같이 일치시킨다. 이번 task에서는 `docs/`, `specs/`, `site/`, `website/`, `adr` 같은 공식 제품 문서 루트를 만들지 않는다.

| 파일 | 수행계획서상 선택 위치 | Stage 산출물 경로 | 일치 여부 | 비고 |
|---|---|---|---|---|
| `README.md` | 루트 `README.md` | `README.md` | OK | Copy/Save 완료 상태와 Chrome unpacked extension smoke 기대 결과를 갱신 |
| 공식 제품 문서 루트 | 해당 없음 | 해당 없음 | OK | 이번 task는 제품 사용자 문서 루트를 생성하지 않음 |

## Stage 1 — clipboard/download helper와 filename sanitizer

### 산출물

신규:

- `src/shared/clipboard.ts`
- `src/shared/filename.ts`
- `tests/shared/clipboard.test.ts`
- `tests/shared/filename.test.ts`
- `mydocs/working/task_m010_7_stage1.md`

수정:

- 필요 시 `src/shared/crop-image.ts`
- 필요 시 `tests/shared/crop-image.test.ts`

### 변경 내용

- PNG data URL을 `Blob`으로 변환하는 helper를 `src/shared/clipboard.ts`에 둔다.
- `Blob`을 `ClipboardItem`으로 감싼 뒤 `navigator.clipboard.write()`에 넘기는 helper를 정의한다.
- DOM/Browser capability는 주입 가능한 interface로 분리해 unit test에서 mock할 수 있게 한다.
- helper는 clipboard API 부재, `ClipboardItem` 부재, data URL decode 실패, `navigator.clipboard.write()` reject를 명확한 error message로 normalize한다.
- Save 경로에서도 같은 PNG `Blob`을 재사용할 수 있도록 data URL to Blob helper는 action-neutral하게 유지한다.
- `src/shared/filename.ts`에는 문서 title 기반 파일명 sanitizer와 timestamp fallback helper를 둔다.
- sanitizer는 경로 구분자, 제어 문자, Windows 예약 문자, 앞뒤 공백/마침표, 중복 `.png`, 과도한 길이를 처리한다.
- 빈 title 또는 sanitize 후 빈 문자열은 `crop-screenshot-{timestamp}.png`로 fallback한다.
- 신규 helper는 Chrome API에 의존하지 않게 작성해 Vitest로 검증한다.

### 검증

```bash
npm run typecheck
npm run test
rg "ClipboardItem|clipboard|Blob|sanitize|filename|download" src/shared tests/shared
git diff --check
```

### 커밋

```text
Task #7 Stage 1: clipboard helper와 filename sanitizer 구현
```

## Stage 2 — Copy 성공 흐름과 toast

### 산출물

신규:

- 필요 시 `tests/content/overlay/copy-action.test.ts`
- `mydocs/working/task_m010_7_stage2.md`

수정:

- `src/content/overlay/crop-overlay.ts`
- `src/content/overlay/crop-template.ts`
- `src/content/overlay/crop-overlay.css`
- `src/shared/clipboard.ts`

### 변경 내용

- #6의 `captureSelectedRegion("copy", selectedRect)` 성공 결과를 `writePngBlobToClipboard()`에 연결한다.
- clipboard write가 성공한 뒤에만 기존 overlay root를 제거한다.
- overlay 제거 후에도 남아 있어야 하는 우측 상단 완료 toast는 별도 host/root로 생성한다.
- toast는 제품명 `crop`과 완료 상태만 표시하고, Mozilla/Firefox/Screenshots 브랜딩은 사용하지 않는다.
- toast는 fixed top-right 위치, Shadow DOM style isolation, 짧은 자동 제거 timeout을 가진다.
- Copy 성공 metadata는 smoke가 읽을 수 있도록 toast host 또는 document-level marker에 최소한으로 남긴다.
- Copy 실패 시에는 overlay를 제거하지 않고 `data-crop-capture-status="error"`와 error message를 남긴다.
- capture 직전 overlay 숨김은 #6 흐름을 그대로 유지해 toast나 overlay가 captured PNG에 들어가지 않게 한다. toast는 copy 완료 이후에만 생성한다.
- pending guard는 clipboard write 완료까지 유지해 중복 copy click이 중복 capture/write를 만들지 않게 한다.

### 검증

```bash
npm run build
npm run typecheck
npm run test
rg "writePng|ClipboardItem|toast|cropCaptureStatus|removeOverlay|captureSelectedRegion" src tests
git diff --check
```

시나리오 검증:

- Chrome unpacked extension에서 영역 선택 후 Copy 클릭
- 붙여넣기 대상 앱 또는 웹 입력면에서 PNG paste 가능 여부 확인
- Copy 성공 후 overlay root가 제거되고 우측 상단 toast가 표시되는지 확인

### 커밋

```text
Task #7 Stage 2: Copy 성공 흐름과 toast 구현
```

## Stage 3 — Save 다운로드 흐름

### 산출물

신규:

- 필요 시 `tests/content/overlay/save-action.test.ts`
- `mydocs/working/task_m010_7_stage3.md`

수정:

- `src/content/overlay/crop-overlay.ts`
- `src/shared/filename.ts`
- 필요 시 `src/shared/clipboard.ts`

### 변경 내용

- #6의 `captureSelectedRegion("save", selectedRect)` 성공 결과를 `Blob` 또는 data URL 기반 download action에 연결한다.
- `chrome.downloads.download()`와 `downloads` 권한은 사용하지 않는다.
- `document.createElement("a")`, `download`, `href = URL.createObjectURL(blob)` 또는 안전한 data URL을 사용해 브라우저 기본 다운로드를 시작한다.
- Blob URL을 사용하면 클릭 후 `URL.revokeObjectURL()`이 보장되도록 helper를 둔다.
- 파일명은 `document.title`과 현재 시각을 입력으로 `sanitizePngFilename()`을 거쳐 결정한다.
- Save 성공 시 overlay 제거 여부는 Copy와 동일한 완료 UX를 따르되, 사용자가 저장 결과를 확인할 수 있도록 dataset/status를 남긴다.
- Save 실패 시 overlay를 유지하고 재시도 가능 상태로 복구한다.
- pending guard는 download trigger 완료까지 유지한다.

### 검증

```bash
npm run build
npm run typecheck
npm run test
rg "download|revokeObjectURL|sanitize|crop-screenshot|downloads" src tests manifest.json README.md
git diff --check
```

시나리오 검증:

- Chrome unpacked extension에서 영역 선택 후 Save 클릭
- 다운로드된 PNG 파일명과 이미지 크기 확인
- `manifest.json`에 `downloads`, `debugger`, `<all_urls>` 권한이 추가되지 않았는지 확인

### 커밋

```text
Task #7 Stage 3: Save 다운로드 흐름 구현
```

## Stage 4 — 실패/fallback UX와 manual smoke

### 산출물

신규:

- 필요 시 `/private/tmp/crop_task7_smoke_notes.md` 같은 임시 smoke note
- `mydocs/working/task_m010_7_stage4.md`

수정:

- `src/content/overlay/crop-overlay.ts`
- `src/content/overlay/crop-template.ts`
- `src/content/overlay/crop-overlay.css`
- 필요 시 `src/shared/clipboard.ts`
- 필요 시 `README.md`

### 변경 내용

- Clipboard API capability가 없거나 write가 실패하면 selected overlay를 유지한다.
- 실패 상태에서는 action buttons 주변 또는 selected UI에 짧은 status message를 표시하고, Save가 fallback임을 안내한다.
- 실패 메시지는 사용자-facing detail을 과도하게 노출하지 않고, smoke/debug용 detail은 dataset 또는 console warning에 남긴다.
- pending 상태가 실패 이후 반드시 해제되는지 확인한다.
- Copy 실패 후 Save를 누르면 같은 selected rect에서 다시 capture/crop/download를 수행할 수 있어야 한다.
- 수동 smoke로 Copy 성공, Save 성공, 실패 fallback을 확인한다. 자동화가 어려운 경우 작업지시자가 직접 검증할 수 있는 짧은 지침을 Stage 보고서와 README 후보 문구에 남긴다.

### 검증

```bash
npm run build
npm run typecheck
npm run test
rg "fallback|error|clipboard|Save|toast|data-crop" src README.md mydocs
git diff --check
```

시나리오 검증:

- Chrome manual smoke: Copy 후 붙여넣기 가능한 PNG 확인
- Chrome manual smoke: Copy 성공 후 overlay 제거와 우측 상단 toast 확인
- Chrome manual smoke: Save 후 PNG 다운로드 확인
- Chrome manual smoke 또는 mock path: clipboard 실패 시 overlay 유지와 Save fallback 안내 확인

### 커밋

```text
Task #7 Stage 4: 실패 fallback UX와 smoke 검증
```

## Stage 4.2 — Save 다운로드 권한 보정

### 배경

Stage 4.1 manual smoke에서 Copy는 성공했으나 Save는 계속 다운로드가 시작되지 않았다. `<a download>` 방식은 capture/crop 비동기 처리 이후 합성 클릭으로 실행되어 Chrome 사용자 활성화 정책에 막힐 수 있으므로, 작업지시자 승인에 따라 `downloads` 권한과 background download API를 도입한다.

### 산출물

수정:

- `manifest.json`
- `src/shared/messages.ts`
- `tests/shared/messages.test.ts`
- `src/background/service-worker.ts`
- `src/content/overlay/crop-overlay.ts`
- `mydocs/working/task_m010_7_stage4_2.md`

### 변경 내용

- `manifest.json`에 `downloads` 권한을 추가한다.
- content script는 crop PNG data URL과 sanitizer를 거친 filename을 background로 전달한다.
- background service worker는 `chrome.downloads.download({ url, filename, saveAs: false, conflictAction: "uniquify" })`를 실행한다.
- Runtime message와 response validator는 `src/shared/messages.ts`에 정의해 content/background/test가 같은 계약을 사용한다.
- `debugger`, `<all_urls>` 권한은 추가하지 않는다.
- visible viewport capture/crop 제한은 유지하고, viewport 밖 이미지 포함은 후속 full page/scroll stitching 범위로 둔다.

### 검증

```bash
npm run build
npm run typecheck
npm run test
rg "downloads|downloadPng|CropDownload|chrome.downloads|<all_urls>|debugger" manifest.json src tests mydocs
git diff --check
```

시나리오 검증:

- Chrome unpacked extension에서 extension reload 후 Save 클릭
- PNG 파일이 다운로드되는지 확인
- Copy 성공과 overlay flicker 보정이 유지되는지 확인

### 커밋

```text
Task #7 [Stage 4.2]: downloads API로 Save 보정
```

## Stage 5 — README, 최종 보고서, 통합 검증

### 산출물

신규:

- `mydocs/report/task_m010_7_report.md`

수정:

- `README.md`
- `mydocs/orders/20260528.md`
- 필요 시 Stage 1~4 산출물의 작은 정정

### 변경 내용

- README의 개발 상태를 Phase 5 완료 기준으로 갱신한다.
- Chrome unpacked extension smoke 기대 결과에서 Copy는 clipboard write와 toast, Save는 PNG 다운로드까지 동작한다고 명시한다.
- README의 후속 범위에서 #7에 해당하던 미구현 항목을 제거하고, full page/scroll stitching/resize/iframe 고도화는 후속 범위로 유지한다.
- 최종 보고서에 수용 기준별 검증 결과, manual smoke 한계, 권한 범위 유지 여부, 후속 이슈 연결 지점을 기록한다.
- 오늘할일을 완료 상태로 갱신한다.

### 검증

```bash
npm run build
npm run typecheck
npm run test
rg "Copy|Save|clipboard|download|toast|downloads|debugger|<all_urls>" README.md mydocs src manifest.json
git diff --check
git status --short
```

### 커밋

```text
Task #7 Stage 5 + 최종 보고서: Copy/Save 완료
```

## 검증

- 각 Stage 검증 명령은 단계 보고서 작성 전에 실행한다.
- 실패한 검증은 단계 완료로 처리하지 않는다.
- 계획 변경이 필요하면 구현계획서를 먼저 갱신하고 작업지시자 승인을 받는다.
- Clipboard API 또는 download trigger가 Chrome 정책상 계획과 다르게 동작하면 Stage 보고서에 실패 근거를 남기고 fallback 또는 후속 이슈 분리 여부를 승인받는다.
- 문서 위치가 수행계획서 판단과 달라지면 구현 전에 수행계획서 또는 구현계획서를 갱신하고 작업지시자 승인을 받는다.

## 커밋

- 단계 커밋은 단계 산출물과 `mydocs/working/task_m010_7_stage{N}.md`를 함께 묶는다.
- 커밋 메시지는 `Task #7 Stage {N}: {핵심 내용 요약}` 형식을 따른다.
- 최종 보고서 커밋은 `Task #7 Stage 5 + 최종 보고서: Copy/Save 완료` 형식을 사용한다.

## 단계 의존성

- Stage 2는 Stage 1의 data URL to Blob, clipboard write helper, filename sanitizer가 테스트로 고정된 뒤 진행한다.
- Stage 3은 Stage 1의 filename sanitizer와 data URL to Blob helper가 준비된 뒤 진행한다.
- Stage 4는 Stage 2 Copy 흐름과 Stage 3 Save 흐름이 모두 build 가능한 상태가 된 뒤 진행한다.
- Stage 5는 Stage 4 manual smoke 또는 명시된 검증 한계가 정리된 뒤 진행한다.

## 위험과 대응

- **Clipboard 사용자 활성화 만료**: capture/crop 이후 clipboard write가 실패하면 overlay를 유지하고 Save fallback을 안내한다. 실패는 Stage 4에서 수동 또는 mock path로 검증한다.
- **Clipboard API surface 차이**: `ClipboardItem` 또는 image clipboard write가 content script context에서 제한될 수 있다. helper에서 capability와 write 실패를 분리하고, 실제 Chrome manual smoke로 최종 판단한다.
- **toast와 overlay capture 오염**: toast는 Copy 성공 이후에만 생성하고, capture 전 overlay 숨김은 #6의 `captureVisibleTabWithoutOverlay()` 흐름을 유지한다.
- **download 권한 범위 확대 위험**: Stage 4.2에서 작업지시자 승인에 따라 `downloads` 권한을 추가한다. `debugger`, `<all_urls>`는 계속 추가하지 않는다.
- **data URL download 크기 위험**: Save는 visible viewport crop PNG data URL을 background `chrome.downloads.download()`로 전달한다. 대용량 full page capture는 후속 이슈에서 별도 backend를 검토한다.
- **파일명 sanitizer 누락**: 예약 문자, 제어 문자, 빈 title, 긴 title, `.png` 중복을 Stage 1 unit test로 고정한다.
- **자동 smoke 한계**: Chrome extension clipboard/download는 자동화가 불안정할 수 있으므로 manual smoke 절차와 결과를 Stage 보고서에 남긴다.

## 승인 요청 사항

- 5단계 분할과 각 Stage 산출물/검증 명령 승인
- Stage 2에서 Copy 성공 시 overlay를 제거하고 별도 toast root를 표시하는 구조 승인
- Stage 3에서 `chrome.downloads` 권한 없이 `<a download>` 기반 Save를 구현하는 구조 승인
- Stage 4.2에서 manual smoke 실패에 따라 `downloads` 권한과 background `chrome.downloads.download()`를 도입하는 구조 승인 완료
- Stage 4에서 Clipboard API 실패를 fallback UX와 manual/mock smoke 조합으로 검증하는 것 승인
- `debugger`, `<all_urls>` 권한을 추가하지 않는 것 승인
