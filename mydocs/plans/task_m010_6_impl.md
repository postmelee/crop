# Task #6 구현계획서

수행계획서: [`task_m010_6.md`](task_m010_6.md)
GitHub Issue: [#6](https://github.com/postmelee/crop/issues/6)
마일스톤: M010

## 단계 개요

| Stage | 제목 | 주요 산출 | 검증 |
|---|---|---|---|
| 1 | capture message protocol과 background handler | `src/shared/messages.ts`, `src/background/service-worker.ts` | `npm run build`, `npm run typecheck`, capture message grep |
| 2 | crop geometry와 image scale helper | `src/shared/rect.ts`, `src/shared/crop-image.ts`, `tests/shared/*` | `npm run test`, crop scale helper grep |
| 3 | content overlay capture pipeline 연결 | `src/content/overlay/crop-overlay.ts`, `src/content/overlay/crop-template.ts` | `npm run build`, `npm run typecheck`, `npm run test` |
| 4 | visible viewport capture smoke와 overlay 제외 검증 | CDP smoke script, 필요 시 test fixture | `npm run build`, CDP/manual smoke |
| 5 | README, 최종 보고서, 통합 검증 | `README.md`, `mydocs/report/task_m010_6_report.md` | `npm run build`, `npm run typecheck`, `npm run test`, `git diff --check` |

## 문서 위치 확인

수행계획서의 "문서 위치 판단"과 실제 Stage 산출물 경로를 다음과 같이 일치시킨다. 이번 task에서는 `docs/`, `specs/`, `site/`, `website/`, `adr` 같은 공식 제품 문서 루트를 만들지 않는다.

| 파일 | 수행계획서상 선택 위치 | Stage 산출물 경로 | 일치 여부 | 비고 |
|---|---|---|---|---|
| `README.md` | 루트 `README.md` | `README.md` | OK | Chrome unpacked extension smoke 기대 결과를 capture backend 기준으로 갱신 |
| 공식 제품 문서 루트 | 해당 없음 | 해당 없음 | OK | 이번 task는 제품 사용자 문서 루트를 생성하지 않음 |

## Stage 1 — capture message protocol과 background handler

### 산출물

신규:

- `src/shared/messages.ts`
- `mydocs/working/task_m010_6_stage1.md`

수정:

- `src/background/service-worker.ts`
- 필요 시 `src/vite-env.d.ts`

### 변경 내용

- content script가 background로 보낼 capture message type을 `src/shared/messages.ts`에 정의한다.
- message는 visible viewport PNG data URL 요청에 한정하고, 응답은 성공 data URL 또는 normalized error 문자열을 명확히 구분한다.
- background `ChromeApi` local type에 `runtime.onMessage`, `tabs.captureVisibleTab()`에 필요한 최소 surface를 추가한다.
- `chrome.runtime.onMessage` listener에서 capture request를 받고, sender tab/window id를 기준으로 `chrome.tabs.captureVisibleTab(windowId, { format: "png" })`를 호출한다.
- Chrome runtime error와 thrown error는 기존 `formatError()` 정책과 같은 방향으로 normalize한다.
- 기존 action icon/shortcut injection 흐름과 restricted URL guard는 유지한다.
- `debugger` 권한과 `<all_urls>` host 권한은 추가하지 않는다.

### 검증

```bash
npm run build
npm run typecheck
rg "captureVisibleTab|CAPTURE|CropCapture|onMessage|tabs" src/background src/shared manifest.json
git diff --check
```

### 커밋

```text
Task #6 Stage 1: capture message와 background handler 구현
```

## Stage 2 — crop geometry와 image scale helper

### 산출물

신규:

- `src/shared/rect.ts`
- `src/shared/crop-image.ts`
- `tests/shared/rect.test.ts`
- `tests/shared/crop-image.test.ts`
- `mydocs/working/task_m010_6_stage2.md`

수정:

- 필요 시 `tests/firefox-derived/window-dimensions.test.ts`

### 변경 내용

- DOM/Chrome API에 의존하지 않는 crop geometry helper를 `src/shared/rect.ts`에 둔다.
- page-coordinate selected rect를 viewport rect로 투영하는 것은 #5 helper를 사용하되, selected rect와 viewport rect의 intersection이 없으면 crop 불가 상태를 반환한다.
- `src/shared/crop-image.ts`에는 image natural size와 viewport CSS size를 받아 source crop rect를 계산하는 순수 함수를 둔다.
- scale 계산은 `scaleX = imageNaturalWidth / viewportCssWidth`, `scaleY = imageNaturalHeight / viewportCssHeight`를 기준으로 한다.
- `devicePixelRatio`를 직접 곱하지 않는다는 정책을 테스트명과 케이스로 고정한다.
- 80%, 100%, 125%, 150% zoom에 해당하는 viewport/image ratio fixture를 둔다.
- viewport 밖으로 이어지는 selection은 visible intersection만 crop source rect로 산출한다.
- canvas/image decoding 자체는 Stage 3에서 DOM API를 통해 연결하되, Stage 2에서는 crop source math를 검증한다.

### 검증

```bash
npm run typecheck
npm run test
rg "naturalWidth|naturalHeight|viewport|scale|clip|intersect" src/shared tests/shared
git diff --check
```

### 커밋

```text
Task #6 Stage 2: crop geometry와 scale helper 구현
```

## Stage 3 — content overlay capture pipeline 연결

### 산출물

신규:

- 필요 시 `tests/content/overlay/capture-pipeline.test.ts`
- `mydocs/working/task_m010_6_stage3.md`

수정:

- `src/content/overlay/crop-overlay.ts`
- `src/content/overlay/crop-template.ts`
- `src/content/overlay/positioning.ts`
- `src/shared/crop-image.ts`
- 필요 시 `src/vite-env.d.ts`

### 변경 내용

- selected 상태의 Copy/Save button click을 capture pipeline trigger로 연결하되, 최종 clipboard/download는 실행하지 않는다.
- `copy`와 `save` action 모두 같은 capture/crop backend를 호출하고, Stage 3에서는 crop result를 내부적으로 생성한 뒤 후속 #7이 사용할 수 있는 boundary를 남긴다.
- capture 전에는 overlay host 또는 capture 대상 UI를 임시로 숨기고, `requestAnimationFrame` 1회 이상 기다린 뒤 background capture request를 보낸다.
- capture 성공 후에는 cropped PNG Blob 또는 data URL을 반환 가능한 내부 함수로 만든다. 이번 task에서 사용자-facing 다운로드/클립보드 쓰기는 하지 않는다.
- capture 실패 또는 crop 실패 시 `finally`에서 overlay visibility를 복구해 사용자가 재시도할 수 있게 한다.
- selected page rect는 `pageRectToViewportRect()` 후 viewport clipping을 거쳐 crop rect로 넘긴다.
- visible viewport 전체 capture 경로가 필요하면 mode toolbar의 visible button 또는 내부 helper에서 selected rect 없이 viewport rect를 넘길 수 있게 한다.
- pending capture 중 중복 action click은 무시하거나 guard한다.

### 검증

```bash
npm run build
npm run typecheck
npm run test
rg "hide|restore|capture|crop|sendMessage|CropCapture" src/content src/shared tests
git diff --check
```

### 커밋

```text
Task #6 Stage 3: overlay capture pipeline 연결
```

## Stage 4 — visible viewport capture smoke와 overlay 제외 검증

### 산출물

신규:

- 필요 시 `/private/tmp/crop_cdp_capture_smoke.mjs` 같은 임시 smoke script
- `mydocs/working/task_m010_6_stage4.md`

수정:

- `src/content/overlay/crop-overlay.ts`
- `src/shared/crop-image.ts`
- 필요 시 `README.md`

### 변경 내용

- `dist/` build 산출물을 Chrome에 로드하거나, 가능한 범위에서 CDP로 content/background 흐름을 검증한다.
- selected 영역 capture/crop output이 생성되는지 확인한다.
- capture 전 overlay hide가 적용되어 output에 prompt/highlight/actions가 포함되지 않는지 확인한다.
- viewport 밖으로 이어지는 selected rect는 visible intersection 기준으로 crop되는지 확인한다.
- visible viewport 전체 capture 경로가 현재 viewport 전체를 대상으로 동작하는지 확인한다.
- zoom 80%, 100%, 125%, 150%는 실제 Chrome smoke가 불안정하면 Stage 2 helper tests와 최소 1개 실제 smoke 조합으로 근거를 남긴다.
- Chrome extension API 자동화가 제한되면 검증 한계를 Stage 보고서에 명시하고 작업지시자 수동 smoke 절차를 README/보고서에 남긴다.

### 검증

```bash
npm run build
npm run typecheck
npm run test
rg "captureVisibleTab|hide|restore|naturalWidth|naturalHeight|viewport" src README.md mydocs
git diff --check
```

시나리오 검증:

- Chrome unpacked extension 또는 CDP smoke로 selected crop output 생성 확인
- output image에 overlay/prompt/highlight/actions 미포함 확인
- partially visible selection의 visible intersection crop 확인
- visible viewport 전체 capture 경로 확인

### 커밋

```text
Task #6 Stage 4: capture smoke와 overlay 제외 검증
```

## Stage 5 — README, 최종 보고서, 통합 검증

### 산출물

신규:

- `mydocs/report/task_m010_6_report.md`

수정:

- `README.md`
- `mydocs/orders/20260527.md`
- 필요 시 Stage 1~4 산출물의 작은 정정

### 변경 내용

- README의 개발 상태와 Chrome unpacked extension smoke 기대 결과를 capture backend 기준으로 갱신한다.
- Copy/Save는 crop backend를 호출할 수 있지만 clipboard write/file download는 #7 범위임을 명시한다.
- 최종 보고서에 수용 기준별 검증 결과, CDP/manual smoke 한계, 후속 #7 연결 지점을 기록한다.
- 오늘할일을 완료 상태로 갱신한다.

### 검증

```bash
npm run build
npm run typecheck
npm run test
rg "captureVisibleTab|crop backend|overlay|Copy|Save|#7" README.md mydocs src
git diff --check
git status --short
```

### 커밋

```text
Task #6 Stage 5 + 최종 보고서: capture/crop backend 완료
```

## 검증

- 각 Stage 검증 명령은 단계 보고서 작성 전에 실행한다.
- 실패한 검증은 단계 완료로 처리하지 않는다.
- 계획 변경이 필요하면 구현계획서를 먼저 갱신하고 작업지시자 승인을 받는다.
- 문서 위치가 수행계획서 판단과 달라지면 구현 전에 수행계획서 또는 구현계획서를 갱신하고 작업지시자 승인을 받는다.

## 커밋

- 단계 커밋은 단계 산출물과 `mydocs/working/task_m010_6_stage{N}.md`를 함께 묶는다.
- 커밋 메시지는 `Task #6 Stage {N}: {핵심 내용 요약}` 형식을 따른다.
- 최종 보고서 커밋은 `Task #6 Stage 5 + 최종 보고서: capture/crop backend 완료` 형식을 사용한다.

## 단계 의존성

- Stage 2는 Stage 1의 message protocol이 확정된 뒤 진행한다.
- Stage 3은 Stage 2의 crop source rect와 scale helper가 테스트로 고정된 뒤 진행한다.
- Stage 4는 Stage 3의 content pipeline이 build 가능한 상태가 된 뒤 진행한다.
- Stage 5는 Stage 4 smoke 또는 명시된 검증 한계가 정리된 뒤 진행한다.

## 위험과 대응

- **overlay가 PNG에 포함될 위험**: capture 직전 host 숨김과 `finally` 복구를 Stage 3에 넣고, Stage 4 smoke에서 output을 확인한다.
- **HiDPI/zoom 좌표 오차**: natural image size와 viewport CSS size ratio를 기준으로 source rect를 계산하고 Stage 2 fixture로 고정한다.
- **Chrome extension API 자동화 한계**: background `captureVisibleTab()`은 실제 extension context가 필요하므로 CDP/manual smoke와 helper tests를 병행한다.
- **Copy/Save 범위 혼선**: 이번 task는 crop result 생성까지만 구현하고, clipboard/download/toast/filename은 #7로 문서와 보고서에 명시한다.
- **권한 범위 확대 위험**: `debugger`, `<all_urls>` 권한을 추가하지 않고 `activeTab` 기반 visible viewport capture만 사용한다.
- **page/viewport 좌표 혼동**: selected page rect는 crop 직전 projection + clipping helper를 통해서만 screenshot crop source로 변환한다.

## 승인 요청 사항

- 5단계 분할과 각 Stage 산출물/검증 명령 승인
- Stage 3에서 Copy/Save click을 capture backend trigger로 연결하되 최종 clipboard/download는 #7로 유지하는 것 승인
- Stage 4에서 Chrome API 자동화 한계가 있으면 CDP/manual smoke와 helper tests의 조합으로 검증 근거를 남기는 것 승인
- `src/shared/messages.ts`, `src/shared/rect.ts`, `src/shared/crop-image.ts`를 신규 boundary로 두는 것 승인
- `debugger`, `<all_urls>` 권한을 추가하지 않는 것 승인
