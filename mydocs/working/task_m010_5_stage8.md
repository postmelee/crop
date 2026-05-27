# Task #5 Stage 8 보고서

GitHub Issue: [#5](https://github.com/postmelee/crop/issues/5)
구현계획서: [`task_m010_5_impl.md`](../plans/task_m010_5_impl.md)
Stage: 8

## 단계 목적

Firefox Screenshots처럼 화면 밖으로 이어지는 요소의 전체 선택 영역을 page/document 좌표로 유지하고, window scroll 이후에도 선택 테두리가 같은 문서 영역을 따라가도록 보정한다. Drag edge auto-scroll, resize handles, iframe 내부 선택, full page capture는 후속 이슈로 분리한다.

## 후속 이슈 등록

| Issue | 제목 | Milestone | Label |
|---|---|---|---|
| [#12](https://github.com/postmelee/crop/issues/12) | Follow-up: 드래그 선택 edge auto-scroll 구현 | M020 — MVP Stabilization | enhancement |
| [#13](https://github.com/postmelee/crop/issues/13) | Follow-up: 선택 영역 resize/move handles와 keyboard 조정 구현 | M020 — MVP Stabilization | enhancement |
| [#14](https://github.com/postmelee/crop/issues/14) | Follow-up: iframe/nested context 요소 선택 지원 | M020 — MVP Stabilization | enhancement |
| [#15](https://github.com/postmelee/crop/issues/15) | Follow-up: full page capture와 scroll stitching 구현 | M020 — MVP Stabilization | enhancement |

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `src/firefox-derived/window-dimensions.ts` | `viewportRectToPageRect()`, `pageRectToViewportRect()` projection helper 추가 |
| `src/firefox-derived/overlay-helpers.ts` | `getBestRectForElement()`에 `coordinateSpace: "page"` 옵션 추가 |
| `src/content/overlay/crop-overlay.ts` | hover/click/drag rect를 page 좌표로 저장하고 render 시 viewport 좌표로 투영, scroll/resize listener 추가, overlay-hidden hit-test 보정 |
| `src/content/overlay/state-machine.ts` | overlay 상태 rect 타입을 page rect로 명확화 |
| `tests/firefox-derived/window-dimensions.test.ts` | viewport/page rect projection 테스트 추가 |
| `tests/firefox-derived/overlay-helpers.test.ts` | partially visible element page-coordinate rect 테스트 추가 |
| `README.md` | Stage 8 개발 상태와 scroll-follow smoke 기대 결과 추가 |
| `mydocs/plans/task_m010_5_impl.md` | Stage 8 계획과 후속 이슈 분리 기록 |
| `mydocs/report/task_m010_5_report.md` | 최종 보고서를 Stage 8 결과 기준으로 갱신 |
| `mydocs/orders/20260527.md` | #5 완료 메모와 후속 이슈 대기 항목 갱신 |

## 본문 변경 정도 / 본문 무손실 여부

코드 작업이므로 본문 무손실 대상은 없다. 기존 action icon/shortcut 진입점, Shadow DOM root id, 중복 실행 guard, prompt/toolbar UI, hover/click/drag selection, Cancel/Escape teardown 동작은 유지했다.

Firefox 원본은 다음 방식으로 참고했다.

- `Region`처럼 state에는 page/document 좌표 rect를 저장한다.
- `WindowDimensions`처럼 scroll offset을 읽고 render 직전에 viewport 좌표로 투영한다.
- `updateScreenshotsOverlayDimensions("scroll")`와 유사하게 scroll/resize 이벤트에서 selection presentation을 다시 계산한다.
- Firefox privileged iframe traversal, edge auto-scroll, resize mover 전체는 직접 포팅하지 않고 후속 이슈로 분리했다.

## 검증 결과

실행 명령:

```bash
npm run build
npm run typecheck
npm run test
rg "coordinateSpace|pageRectToViewportRect|viewportRectToPageRect|handleViewportChange|getPageElementFromPoint|Follow-up: 드래그 선택 edge auto-scroll" src tests README.md mydocs /private/tmp/crop_followup_edge_auto_scroll.md
git diff --check
node /private/tmp/crop_cdp_content_smoke.mjs
node /private/tmp/crop_cdp_scroll_follow_smoke.mjs
```

결과:

- OK — `npm run build`: Vite production build 성공, `dist/content/inject.js` 27.42 kB 생성
- OK — `npm run typecheck`: `tsc --noEmit` 성공
- OK — `npm run test`: Vitest 5개 test file, 48개 test 통과
- OK — grep: page/viewport projection helper, coordinateSpace option, scroll handler, 후속 이슈 본문 확인
- OK — `git diff --check`: whitespace 경고 없음
- OK — 기존 CDP smoke: duplicate guard, icon/prompt, hover click selection, drag selection, Cancel/Escape teardown 확인
- OK — scroll-follow CDP smoke: partially visible target hover/selected rect `translate(120px, 300px)`, `360x640`; `window.scrollTo(0, 180)` 후 `translate(120px, 120px)`로 재투영; action buttons와 selection mask 유지 확인

## 잔여 위험

- Drag 중 viewport edge auto-scroll은 #12로 분리했다.
- Selected region resize/move handles와 keyboard 조정은 #13으로 분리했다.
- iframe/nested context 내부 요소 선택 지원은 Chrome MV3 권한 제약 검토가 필요해 #14로 분리했다.
- full page capture와 scroll stitching은 #15로 분리했다.
- nested scroll container 내부 content가 스크롤되는 경우는 이번 Stage에서 window scroll-follow만 검증했다.

## 다음 단계 영향

- #6 capture backend에서는 선택 rect가 page 좌표로 저장된다는 점을 기준으로 visible viewport crop 영역을 계산해야 한다.
- capture 직전 overlay 숨김은 기존 prompt, toolbar, selection mask, selected highlight, action buttons 전체를 대상으로 해야 한다.

## 승인 요청

- Stage 8 산출물과 검증 결과를 승인하면 Task #5 PR 게시 절차로 진행한다.
