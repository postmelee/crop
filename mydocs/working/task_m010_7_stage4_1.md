# Task #7 Stage 4.1 보고서

GitHub Issue: [#7](https://github.com/postmelee/crop/issues/7)
구현계획서: [`task_m010_7_impl.md`](../plans/task_m010_7_impl.md)
Stage: 4.1

## 단계 목적

Stage 4.1은 작업지시자 manual smoke에서 발견된 Copy/Save 보정 단계다. Copy 자체는 붙여넣기까지 성공했으나, Save 다운로드 미동작과 Copy 클릭 시 overlay가 순간적으로 다시 보이는 깜빡임이 확인되어 Stage 5 진입 전 같은 선택 영역 action 흐름을 보정했다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `src/content/overlay/crop-overlay.ts` | Copy/Save action 처리 중 overlay를 계속 숨긴 상태로 유지하고, Save 다운로드를 Blob object URL 대신 PNG data URL 기반 `<a download>` 클릭으로 변경 |
| `mydocs/orders/20260528.md` | #7 상태를 Stage 4.1 smoke 보정 완료와 재검증 대기 상태로 갱신 |

## 본문 변경 정도 / 본문 무손실 여부

코드 작업이므로 문서 본문 무손실 대상은 없다. 기존 Copy 성공 경로, Save 성공 toast, 실패 fallback UI, visible viewport capture/crop 제약은 유지했다. `downloads`, `debugger`, `<all_urls>` 권한은 추가하지 않았다.

## 검증 결과

실행 명령:

```bash
npm run build
npm run typecheck
npm run test
rg "performCaptureAction|downloadPngDataUrl|captureVisibleTabWithoutOverlay|OBJECT_URL_REVOKE|cropDownloadStatus|cropClipboardStatus" src/content src/shared tests
git diff --check
```

결과:

- OK — `npm run build`: Vite production build 통과
- OK — `npm run typecheck`: `tsc --noEmit` 통과
- OK — `npm run test`: 10개 test file, 78개 test 통과
- OK — `rg ...`: 신규 `performCaptureAction`, `downloadPngDataUrl`, smoke status dataset 사용 위치 확인, 제거한 object URL helper 미검출 확인
- OK — `git diff --check`: whitespace 오류 없음

수동 smoke 반영:

- 확인됨 — 작업지시자 smoke에서 Copy 후 붙여넣기는 성공했다.
- 보정됨 — Save는 Blob object URL 대신 PNG data URL을 직접 다운로드 링크에 연결하도록 변경했다.
- 보정됨 — Copy/Save 처리 중 capture 직후 overlay가 다시 표시되지 않도록 action 전체가 끝날 때까지 overlay host를 숨긴다.
- 범위 제외 — 선택 테두리가 viewport 밖까지 이어져도 실제 PNG가 visible viewport 기준으로 잘리는 현상은 현재 MVP capture backend가 `chrome.tabs.captureVisibleTab()` 기반이기 때문에 발생한다. Full page/scroll stitching은 후속 이슈 범위이며 이번 #7에서는 권한과 backend 범위를 변경하지 않는다.

## 잔여 위험

- Save 다운로드는 Chrome 사용자 환경에서 재 smoke가 필요하다. data URL 방식도 브라우저 사용자 활성화 정책의 영향을 받을 수 있다.
- Save가 계속 실패하면 선택지는 두 가지다. 첫째, 별도 승인 후 `downloads` 권한과 background download API를 도입한다. 둘째, 권한 추가 없이 다운로드 전용 두 번째 클릭 fallback UI를 만든다.
- viewport 밖 영역까지 실제 이미지에 포함하는 기능은 #7 범위를 넘으며 후속 full page/scroll stitching 작업에서 처리해야 한다.

## 다음 단계 영향

- 작업지시자가 `npm run build` 후 extension reload, Save 클릭, Copy 깜빡임 재확인을 수행하면 결과를 Stage 5 최종 보고서에 반영한다.
- 재검증에서 Save가 다시 실패하면 Stage 5로 가지 않고 Stage 4.2 또는 구현계획서 변경 승인 절차로 전환한다.

## 승인 요청

- Stage 4.1 산출물과 검증 결과를 승인하면 Stage 5 README, 최종 보고서, 통합 검증으로 진행한다.
