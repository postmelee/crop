# Task #7 Stage 3 보고서

GitHub Issue: [#7](https://github.com/postmelee/crop/issues/7)
구현계획서: [`task_m010_7_impl.md`](../plans/task_m010_7_impl.md)
Stage: 3

## 단계 목적

Stage 3은 #6의 selected crop result를 Save action의 실제 파일 다운로드 흐름에 연결하는 단계다. `chrome.downloads` 권한 없이 Stage 1의 PNG Blob 변환과 filename sanitizer를 재사용해 `<a download>` 기반 저장을 시작하도록 구현했다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `src/content/overlay/crop-overlay.ts` | Save action에서 crop PNG data URL을 Blob URL로 변환하고 sanitized filename으로 `<a download>` 클릭, 완료 toast와 overlay 제거, download status metadata 추가 |

## 본문 변경 정도 / 본문 무손실 여부

코드 작업이므로 문서 본문 무손실 대상은 없다. 기존 Copy clipboard/toast 흐름은 유지했고, 공통 완료 toast helper로 Copy/Save를 함께 처리하도록 정리했다. `manifest.json`은 변경하지 않았으며 `downloads`, `debugger`, `<all_urls>` 권한은 추가하지 않았다.

## 검증 결과

실행 명령:

```bash
npm run build
npm run typecheck
npm run test
rg "download|revokeObjectURL|sanitize|crop-screenshot|downloads" src tests manifest.json README.md
git diff --check
sed -n '1,80p' manifest.json
```

결과:

- OK — `npm run build`: Vite production build 통과, `dist/content/inject.js` 생성 확인
- OK — `npm run typecheck`: `tsc --noEmit` 통과
- OK — `npm run test`: 10개 test file, 78개 test 통과
- OK — `rg "download|revokeObjectURL|sanitize|crop-screenshot|downloads" src tests manifest.json README.md`: Save download helper, filename sanitizer, object URL revoke 경계 확인. README에는 Stage 5에서 갱신할 기존 후속 #7 문구가 남아 있음
- OK — `git diff --check`: whitespace 오류 없음
- OK — `sed -n '1,80p' manifest.json`: permissions가 `activeTab`, `scripting`, `clipboardWrite`만 포함함을 확인

수동/시나리오 검증:

- 미실행 — 현재 세션에서 사용자의 기존 Chrome extension 프로필과 다운로드 폴더를 안정적으로 조작해 Save 결과 파일을 확인하는 도구가 노출되어 있지 않았다. Save 다운로드 파일명과 PNG 파일 확인은 Stage 4 manual smoke에서 작업지시자 지침과 함께 확정한다.

## 잔여 위험

- 실제 Chrome에서 `<a download>`가 content script user activation 범위 안에서 정상 다운로드를 시작하는지 Stage 4에서 확인해야 한다.
- 다운로드된 PNG 파일명과 이미지 크기 검증은 아직 수동으로 확인하지 않았다.
- Save 완료 toast의 시각적 위치와 Firefox 유사성은 실제 화면에서 추가 조정이 필요할 수 있다.

## 다음 단계 영향

- Stage 4는 Copy 성공, Save 성공, Copy 실패 fallback을 manual smoke 중심으로 확인해야 한다.
- Stage 4에서 Save 실패 path를 다룰 때 `data-crop-download-status="error"`를 smoke/debug 지표로 사용할 수 있다.
- Stage 5 README는 현재 남아 있는 "Copy/Save는 후속 #7" 문구를 Phase 5 완료 상태로 갱신해야 한다.

## 승인 요청

- Stage 3 산출물과 검증 결과를 승인하면 Stage 4 실패/fallback UX와 manual smoke로 진행한다.
