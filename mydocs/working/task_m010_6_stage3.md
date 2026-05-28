# Task #6 Stage 3 보고서

GitHub Issue: [#6](https://github.com/postmelee/crop/issues/6)
구현계획서: [`task_m010_6_impl.md`](../plans/task_m010_6_impl.md)
Stage: 3

## 단계 목적

선택 완료 상태의 Copy/Save 버튼을 visible viewport capture backend와 crop image 생성 경로에 연결한다. 이번 Stage는 후속 #7에서 clipboard/download로 이어받을 수 있는 내부 crop 결과 경계를 만들며, 사용자-facing 복사/저장은 아직 실행하지 않는다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `src/content/overlay/crop-overlay.ts` | Copy/Save action guard, overlay 숨김 후 capture 요청, selected page rect의 viewport clipping, cropped PNG data URL 생성, pending 중복 클릭 방지, 내부 결과 보관 추가 |
| `src/shared/crop-image.ts` | capture data URL을 이미지로 decode하고 canvas로 source rect를 crop하는 `cropPngDataUrl()` 추가 |
| `src/shared/messages.ts` | background capture response 구조를 검증하는 type guard 추가 |
| `tests/shared/messages.test.ts` | capture request/response message contract 테스트 추가 |
| `mydocs/orders/20260528.md` | 날짜 변경에 따른 오늘할일 보드 생성 및 #6 진행 상태 반영 |

## 본문 변경 정도 / 본문 무손실 여부

코드 작업이므로 본문 무손실 대상은 없다. 기존 overlay 선택, hover, drag, ESC close, outside click reset 흐름은 유지했고, selected 상태의 Copy/Save 버튼 동작만 capture pipeline trigger로 확장했다. Chrome content script는 shared chunk import가 생기면 classic script build가 깨지므로 content bundle 안에 capture request/response의 최소 local type guard를 유지했다.

## 검증 결과

실행 명령:

```bash
npm run build
npm run typecheck
npm run test
rg "hide|restore|capture|crop|sendMessage|CropCapture" src/content src/shared tests
git diff --check
```

결과:

- OK — `npm run build`: `dist/background/service-worker.js`, `dist/content/inject.js`, `dist/manifest.json` 생성 성공
- OK — `npm run typecheck`: `tsc --noEmit` 성공
- OK — `npm run test`: Vitest 8개 test file, 67개 test 통과
- OK — grep: overlay hide/capture/sendMessage/crop pipeline, shared crop helper, message contract 확인
- OK — `git diff --check`: whitespace 경고 없음

## 잔여 위험

- 실제 Chrome extension context에서 `chrome.tabs.captureVisibleTab()`이 overlay 숨김 뒤 prompt/highlight/actions 없이 캡처되는지는 Stage 4 smoke에서 확인해야 한다.
- Copy/Save는 내부 crop result 생성까지만 수행한다. clipboard write, file download, filename/toast UX는 #7 범위로 유지한다.
- content bundle 제약 때문에 capture request 문자열은 `src/shared/messages.ts`와 content overlay 양쪽에 존재한다. Stage 4 또는 이후 bundling 개선 전까지는 message contract 테스트로 shared 쪽 계약을 고정한다.

## 다음 단계 영향

- Stage 4는 `data-crop-capture-status="ok"`와 `data-crop-capture-width/height` 메타데이터 또는 내부 capture result를 기준으로 실제 smoke를 확인한다.
- Stage 4는 선택 영역이 viewport 밖으로 이어질 때 visible intersection만 crop되는지 확인해야 한다.
- Stage 4에서 overlay 제외 검증이 실패하면 `waitForNextPaint()` 또는 hide 범위를 조정한다.

## 승인 요청

- Stage 3 산출물과 검증 결과를 승인하면 Stage 4로 진행한다.
