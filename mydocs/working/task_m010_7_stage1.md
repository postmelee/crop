# Task #7 Stage 1 보고서

GitHub Issue: [#7](https://github.com/postmelee/crop/issues/7)
구현계획서: [`task_m010_7_impl.md`](../plans/task_m010_7_impl.md)
Stage: 1

## 단계 목적

Stage 1은 후속 Copy/Save action이 공통으로 사용할 PNG data URL 처리, clipboard write 경계, 다운로드 파일명 sanitizer를 먼저 고정하는 단계다. Chrome content script의 실제 UI 연결은 Stage 2 이후로 남기고, 이번 단계에서는 DOM/Chrome API 의존을 최소화한 shared helper와 단위 테스트를 작성했다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `src/shared/clipboard.ts` | PNG/data URL to Blob 변환, ClipboardItem 기반 PNG clipboard write helper, capability/write error normalization 추가 |
| `src/shared/filename.ts` | 문서 title 기반 PNG filename 생성, unsafe 문자 제거, Windows 예약어 처리, UTC timestamp fallback 추가 |
| `tests/shared/clipboard.test.ts` | data URL decode, non-PNG rejection, ClipboardItem write, API 부재/write 실패 normalization 검증 |
| `tests/shared/filename.test.ts` | safe name 유지, `.png` 정규화, unsafe 문자 제거, 예약어, timestamp fallback, 길이 제한 검증 |

## 본문 변경 정도 / 본문 무손실 여부

코드 작업이므로 문서 본문 무손실 대상은 없다. 기존 capture/crop backend와 overlay 동작은 수정하지 않았고, Stage 2/3에서 연결할 shared helper만 신규 추가했다. `manifest.json` 권한도 변경하지 않았다.

## 검증 결과

실행 명령:

```bash
npm run typecheck
npm run test
rg "ClipboardItem|clipboard|Blob|sanitize|filename|download" src/shared tests/shared
git diff --check
```

결과:

- OK — `npm run typecheck`: `tsc --noEmit` 통과
- OK — `npm run test`: 10개 test file, 78개 test 통과
- OK — `rg "ClipboardItem|clipboard|Blob|sanitize|filename|download" src/shared tests/shared`: 신규 helper와 테스트의 clipboard/filename/download 경계 확인
- OK — `git diff --check`: whitespace 오류 없음

## 잔여 위험

- Clipboard API 실제 동작은 브라우저 사용자 활성화와 권한 정책의 영향을 받으므로 Stage 2/4에서 Chrome manual smoke로 확인해야 한다.
- Save 다운로드는 아직 UI에 연결되지 않았다. Stage 3에서 object URL revoke와 `<a download>` 동작을 검증해야 한다.

## 다음 단계 영향

- Stage 2는 `writePngDataUrlToClipboard()` 또는 `writePngBlobToClipboard()`를 #6의 crop result와 연결하면 된다.
- Stage 3은 `createPngFilename()`과 `pngDataUrlToBlob()`을 사용해 Save filename과 Blob URL download를 구현하면 된다.
- 실패 UX는 helper error message를 그대로 사용자에게 노출하지 말고 Stage 4에서 짧은 fallback 안내로 정리한다.

## 승인 요청

- Stage 1 산출물과 검증 결과를 승인하면 Stage 2 Copy 성공 흐름과 toast 구현으로 진행한다.
