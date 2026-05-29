# Task #7 Stage 2 보고서

GitHub Issue: [#7](https://github.com/postmelee/crop/issues/7)
구현계획서: [`task_m010_7_impl.md`](../plans/task_m010_7_impl.md)
Stage: 2

## 단계 목적

Stage 2는 #6의 selected crop result를 Stage 1 clipboard helper에 연결해 Copy 성공 흐름을 구현하는 단계다. Copy 성공 시 기존 selection overlay를 제거하고, overlay와 분리된 우측 상단 toast를 표시하는 구조를 추가했다. Save의 실제 다운로드 연결은 Stage 3 범위로 유지했다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `src/content/overlay/crop-overlay.ts` | Copy action에서 crop result를 `writePngDataUrlToClipboard()`에 연결, 성공 시 overlay 제거와 toast 표시, pending 중 취소 guard 추가 |
| `src/content/overlay/crop-template.ts` | overlay root와 분리된 toast Shadow DOM template, toast root id/attribute, close button 추가 |
| `src/content/overlay/crop-overlay.css` | 우측 상단 copy 완료 toast layout, close button, responsive/reduced-motion 스타일 추가 |

## 본문 변경 정도 / 본문 무손실 여부

코드 작업이므로 문서 본문 무손실 대상은 없다. 기존 hover/click/drag selection, capture/crop backend, Save capture-only 동작은 유지했다. Copy 성공 경로만 clipboard write와 toast/overlay teardown으로 확장했다.

## 검증 결과

실행 명령:

```bash
npm run build
npm run typecheck
npm run test
rg "writePng|ClipboardItem|toast|cropCaptureStatus|removeOverlay|captureSelectedRegion" src tests
git diff --check
```

결과:

- OK — `npm run build`: Vite production build 통과, `dist/content/inject.js` 생성 확인
- OK — `npm run typecheck`: `tsc --noEmit` 통과
- OK — `npm run test`: 10개 test file, 78개 test 통과
- OK — `rg "writePng|ClipboardItem|toast|cropCaptureStatus|removeOverlay|captureSelectedRegion" src tests`: Copy clipboard 연결, toast template/style, capture status 경계 확인
- OK — `git diff --check`: whitespace 오류 없음

수동/시나리오 검증:

- 미실행 — 현재 세션에서 사용자의 기존 Chrome extension 프로필을 안정적으로 조작해 Copy 후 붙여넣기를 확인하는 도구가 노출되어 있지 않았다. Copy/paste와 toast의 실제 Chrome smoke는 Stage 4에서 작업지시자 수동 검증 지침과 함께 확정한다.

## 잔여 위험

- Chrome이 capture/crop 비동기 처리 이후 `navigator.clipboard.write()`를 사용자 활성화가 만료된 동작으로 판단할 수 있다. 이 경우 Stage 4 fallback UX에서 overlay 유지와 Save 안내를 확정해야 한다.
- 실제 clipboard에 들어간 PNG pixel 검증은 아직 수행하지 않았다.
- Toast의 시각적 위치와 Firefox 유사성은 실제 Chrome 화면에서 추가 조정이 필요할 수 있다.

## 다음 단계 영향

- Stage 3은 Save action만 실제 `<a download>` 흐름에 연결하면 된다. Copy toast root와 helper는 그대로 재사용하지 않아도 된다.
- Stage 4는 Copy 실패 path, Copy 성공 후 toast, 실제 paste 가능 여부를 manual smoke로 확인해야 한다.
- Stage 5 README에는 Copy 성공 시 overlay 제거와 toast 표시가 실제 smoke로 확인된 경우에만 완료 상태로 기록한다.

## 승인 요청

- Stage 2 산출물과 검증 결과를 승인하면 Stage 3 Save 다운로드 흐름 구현으로 진행한다.
