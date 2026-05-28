# Task #6 Stage 1 보고서

GitHub Issue: [#6](https://github.com/postmelee/crop/issues/6)
구현계획서: [`task_m010_6_impl.md`](../plans/task_m010_6_impl.md)
Stage: 1

## 단계 목적

Capture/crop backend의 첫 경계로 content script와 background service worker 사이의 capture message protocol을 정의하고, background에서 `chrome.tabs.captureVisibleTab()`을 호출해 PNG data URL을 반환하는 handler를 구현한다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `src/shared/messages.ts` | `crop.captureVisibleTab` request/response type, request factory, runtime message type guard 추가 |
| `src/background/service-worker.ts` | `runtime.onMessage`와 `tabs.captureVisibleTab()` local Chrome API type 추가, capture request handler와 error-normalized response 구현 |

## 본문 변경 정도 / 본문 무손실 여부

코드 작업이므로 본문 무손실 대상은 없다. 기존 action icon/shortcut 기반 content script injection, restricted URL guard, shortcut warning 흐름은 유지했다. Manifest 권한은 변경하지 않았고 `debugger`, `<all_urls>` 권한을 추가하지 않았다.

## 검증 결과

실행 명령:

```bash
npm run build
npm run typecheck
rg "captureVisibleTab|CAPTURE|CropCapture|onMessage|tabs" src/background src/shared manifest.json
git diff --check
```

결과:

- OK — `npm run build`: Vite production build 성공, `dist/background/service-worker.js` 1.69 kB 생성
- OK — `npm run typecheck`: `tsc --noEmit` 성공
- OK — grep: `CropCaptureVisibleTabRequest/Response`, `runtime.onMessage`, `tabs.captureVisibleTab()` 연결 확인
- OK — `git diff --check`: whitespace 경고 없음

## 잔여 위험

- `captureVisibleTab()`은 실제 Chrome extension context에서만 동작하므로 Stage 1에서는 build/typecheck와 source grep까지만 검증했다.
- content script에서 message를 보내고 crop helper로 연결하는 동작은 Stage 3 이후 검증한다.

## 다음 단계 영향

- Stage 2는 `CropCaptureVisibleTabResponse`의 성공 data URL을 crop source로 사용할 수 있도록 viewport/image scale helper를 구현한다.
- Stage 3은 `createCaptureVisibleTabRequest()`를 content overlay pipeline에서 사용해 background capture handler를 호출한다.

## 승인 요청

- Stage 1 산출물과 검증 결과를 승인하면 Stage 2로 진행한다.
