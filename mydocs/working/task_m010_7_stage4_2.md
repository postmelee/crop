# Task #7 Stage 4.2 보고서

GitHub Issue: [#7](https://github.com/postmelee/crop/issues/7)
수행계획서: [`task_m010_7.md`](../plans/task_m010_7.md)
구현계획서: [`task_m010_7_impl.md`](../plans/task_m010_7_impl.md)
Stage: 4.2

## 단계 목적

Stage 4.2는 작업지시자 manual smoke에서 확인된 Save 다운로드 미동작을 보정하는 단계다. Stage 4.1의 `<a download>` 방식은 capture/crop 비동기 처리 이후 합성 클릭이 Chrome 사용자 활성화 정책에 막힐 수 있어, 작업지시자 승인에 따라 `downloads` 권한과 background `chrome.downloads.download()` 경로로 Save를 이동했다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `manifest.json` | Save 안정화를 위해 `downloads` 권한 추가 |
| `src/shared/messages.ts` | `crop.downloadPng` request/response 타입과 validator 추가 |
| `tests/shared/messages.test.ts` | PNG download message 생성/검증 테스트 추가 |
| `src/background/service-worker.ts` | `chrome.downloads.download()` 기반 PNG download message handler 추가 |
| `src/content/overlay/crop-overlay.ts` | Save action이 crop PNG data URL과 sanitized filename을 background로 전달하도록 변경 |
| `mydocs/plans/task_m010_7.md` | Stage 4.2 권한 보정 승인 내용을 수행계획서에 반영 |
| `mydocs/plans/task_m010_7_impl.md` | Stage 4.2 세부 계획과 검증 명령 추가 |
| `mydocs/orders/20260528.md` | #7 상태를 Stage 4.2 보정 완료 및 manual smoke 대기로 갱신 |

## 본문 변경 정도 / 본문 무손실 여부

코드 작업이므로 문서 본문 무손실 대상은 없다. 기존 Copy 성공 흐름, overlay hide-before-capture, 실패 fallback, visible viewport crop 제한은 유지했다. 권한은 `downloads`만 추가했고 `debugger`, `<all_urls>`는 추가하지 않았다.

## 검증 결과

실행 명령:

```bash
npm run build
npm run typecheck
npm run test
rg "^import |\\.\\.\\/assets|crop\\.downloadPng|chrome\\.downloads|downloads|debugger|<all_urls>" dist/content/inject.js dist/background/service-worker.js dist/manifest.json manifest.json src tests mydocs/plans/task_m010_7.md mydocs/plans/task_m010_7_impl.md mydocs/orders/20260528.md
git diff --check
```

결과:

- OK — `npm run build`: Vite production build 통과, `dist/manifest.json`, `dist/background/service-worker.js`, `dist/content/inject.js` 생성
- OK — `npm run typecheck`: `tsc --noEmit` 통과
- OK — `npm run test`: 10개 test file, 80개 test 통과
- OK — `rg ...`: `dist/manifest.json`의 `downloads`, background의 `chrome.downloads.download()`, content의 `crop.downloadPng` message 확인. `dist/content/inject.js`에 shared chunk import가 남지 않는 것도 확인
- OK — `git diff --check`: whitespace 오류 없음

수동 smoke 반영:

- 확인됨 — 작업지시자 smoke에서 Copy 후 붙여넣기와 Copy 깜빡임 보정은 성공했다.
- 보정됨 — Save는 content `<a download>` 대신 background `chrome.downloads.download()`로 이동했다.
- 대기 — `downloads` 권한 추가 후 Chrome unpacked extension reload와 Save 다운로드 재 smoke가 필요하다.

## 잔여 위험

- Chrome에서 권한이 추가됐으므로 `chrome://extensions`에서 확장을 reload해야 한다. 기존 로드 상태가 새 권한을 반영하지 않으면 Save가 계속 실패할 수 있다.
- `chrome.downloads.download()`가 data URL 크기 제한에 걸릴 가능성은 낮지만, full page/scroll stitching 같은 대형 이미지는 후속 backend 작업에서 별도 검토가 필요하다.
- viewport 밖까지 이어지는 선택 테두리가 실제 PNG에서 잘리는 문제는 visible viewport capture backend 한계이며 이번 #7 범위에서 변경하지 않았다.

## 다음 단계 영향

- 작업지시자가 Save 재 smoke 결과를 공유하면 Stage 5 README/최종 보고서에 반영한다.
- Save가 이번에도 실패하면 background error message를 확인한 뒤 Stage 4.3 또는 다운로드 backend 대안을 승인받아야 한다.

## 승인 요청

- Stage 4.2 산출물과 검증 결과를 승인하면 Save manual smoke 결과 확인 후 Stage 5 README, 최종 보고서, 통합 검증으로 진행한다.
