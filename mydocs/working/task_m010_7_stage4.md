# Task #7 Stage 4 보고서

GitHub Issue: [#7](https://github.com/postmelee/crop/issues/7)
구현계획서: [`task_m010_7_impl.md`](../plans/task_m010_7_impl.md)
Stage: 4

## 단계 목적

Stage 4는 Copy/Save 실패 시 사용자가 같은 선택 영역에서 재시도할 수 있도록 overlay를 유지하고, 짧은 fallback 안내를 표시하는 단계다. 실제 Chrome clipboard/download smoke는 현재 세션에서 안정적으로 자동 조작할 수 없어, 자동 검증과 함께 작업지시자가 직접 확인할 수 있는 manual smoke 지침을 정리했다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `src/content/overlay/crop-template.ts` | action toolbar 안에 `role="status"`와 `aria-live="polite"`를 가진 실패 안내 영역 추가 |
| `src/content/overlay/crop-overlay.ts` | Copy 실패 시 Save fallback 안내, Save 실패 시 재시도 안내, action status reset과 smoke용 `data-crop-action-status` 기록 추가 |
| `src/content/overlay/crop-overlay.css` | action toolbar wrap, disabled button opacity, 실패 안내 텍스트 스타일 추가 |

## 본문 변경 정도 / 본문 무손실 여부

코드 작업이므로 문서 본문 무손실 대상은 없다. Copy/Save 성공 경로, capture/crop backend, overlay hide-before-capture 경계는 유지했다. 실패 시 raw error는 기존처럼 `data-crop-capture-error`와 console warning에 남기고, 사용자-facing 영역에는 짧은 fallback 문구만 표시한다.

## 검증 결과

실행 명령:

```bash
npm run build
npm run typecheck
npm run test
rg "fallback|error|clipboard|Save|toast|data-crop|cropActionStatus|복사 실패|저장 실패" src README.md mydocs
git diff --check
```

결과:

- OK — `npm run build`: Vite production build 통과, `dist/content/inject.js` 생성 확인
- OK — `npm run typecheck`: `tsc --noEmit` 통과
- OK — `npm run test`: 10개 test file, 78개 test 통과
- OK — `rg "fallback|error|clipboard|Save|toast|data-crop|cropActionStatus|복사 실패|저장 실패" src README.md mydocs`: 실패 안내 문구, `data-crop-action-status`, clipboard/download status, 기존 계획/보고서 경계 확인
- OK — `git diff --check`: whitespace 오류 없음

수동/시나리오 검증:

- 미실행 — 현재 세션에서 사용자의 기존 Chrome extension 프로필, clipboard paste target, 다운로드 폴더를 안정적으로 조작하는 도구가 노출되어 있지 않았다.
- 작업지시자 manual smoke 지침:
  1. `npm run build` 후 Chrome `chrome://extensions`에서 `dist/`를 다시 로드한다.
  2. 일반 웹 페이지에서 `crop`을 실행하고 영역을 선택한다.
  3. `Copy` 클릭 후 overlay가 사라지고 우측 상단 `crop / 복사 완료` toast가 보이는지 확인한다.
  4. 이미지 붙여넣기가 가능한 앱 또는 웹 입력면에 paste해 PNG가 들어가는지 확인한다.
  5. 다시 `crop`을 실행하고 영역을 선택한 뒤 `Save`를 클릭한다.
  6. 다운로드된 PNG 파일이 열리는지, 파일명이 페이지 title 기반으로 안전하게 생성되는지 확인한다.
  7. Copy 실패 fallback 확인이 필요하면 DevTools console에서 `navigator.clipboard.write`를 임시로 reject하는 방식은 페이지 보안 정책에 따라 제한될 수 있으므로, 실패가 자연 발생했을 때 overlay가 유지되고 action toolbar에 `복사 실패. Save로 저장할 수 있습니다.`가 표시되는지 확인한다.

## 잔여 위험

- 실제 Chrome에서 Copy 후 붙여넣기 가능한 PNG인지와 Save 다운로드 파일의 pixel/크기는 아직 수동 검증 전이다.
- Clipboard API가 사용자 활성화 만료로 실패할 가능성은 남아 있다. 실패가 발생하면 이번 Stage의 fallback 안내가 표시되어야 한다.
- 실패 UI가 Firefox 원본과 완전히 같은 형태인지는 실제 화면 smoke 후 조정이 필요할 수 있다.

## 다음 단계 영향

- Stage 5는 README를 Phase 5 완료 상태로 갱신하되, manual smoke가 아직 작업지시자 확인 전이면 최종 보고서에 그 한계를 명시해야 한다.
- Stage 5 최종 보고서에는 `downloads`, `debugger`, `<all_urls>` 권한 미추가 상태와 Copy/Save manual smoke 지침을 포함한다.
- 작업지시자가 manual smoke 결과를 공유하면 Stage 5에서 성공/실패 결과를 최종 보고서에 반영한다.

## 승인 요청

- Stage 4 산출물과 검증 결과를 승인하면 Stage 5 README, 최종 보고서, 통합 검증으로 진행한다.
