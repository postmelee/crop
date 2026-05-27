# Task #5 Stage 9 보고서

GitHub Issue: [#5](https://github.com/postmelee/crop/issues/5)
구현계획서: [`task_m010_5_impl.md`](../plans/task_m010_5_impl.md)
Stage: 9

## 단계 목적

작업지시자 smoke에서 확인된 두 가지 회귀를 현재 작업 안에서 보정한다. 첫째, 우측 상단 mode toolbar의 flash animation이 반복되는 문제를 제거한다. 둘째, Firefox와 달리 viewport 밖으로 이어지는 큰 요소의 hover/selected rect가 잘려 보이는 문제를 Firefox식 detect threshold 기준으로 완화한다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `src/content/overlay/crop-template.ts` | initial mount 시 `crop-panel--flash` class를 붙이지 않도록 제거 |
| `src/content/overlay/crop-overlay.ts` | 중복 실행 때만 panel flash를 one-shot으로 실행하고 `animationend`/`animationcancel`에서 class와 dataset 정리, flash debounce 추가, hover rect 탐지 threshold를 viewport+100 기준으로 전달 |
| `README.md` | Stage 9 개발 상태와 smoke 기대 결과 갱신 |
| `mydocs/plans/task_m010_5_impl.md` | Stage 9 계획과 검증 기준 기록 |
| `mydocs/report/task_m010_5_report.md` | 최종 보고서를 Stage 9 결과 기준으로 갱신 |
| `mydocs/orders/20260527.md` | #5 완료 메모를 Stage 9 bugfix 기준으로 갱신 |

## 본문 변경 정도 / 본문 무손실 여부

코드 작업이므로 본문 무손실 대상은 없다. 기존 action icon/shortcut 진입점, Shadow DOM root id, 중복 실행 guard, prompt/toolbar UI, hover/click/drag selection, page-coordinate scroll-follow, Cancel/Escape teardown 동작은 유지했다.

Firefox 원본은 다음 방식으로 참고했다.

- 초기 toolbar는 별도 반복 animation 없이 정적 표시한다.
- 이미 overlay가 열린 상태의 재실행 피드백은 짧은 시각 효과로만 제한한다.
- `updateWindowDimensions()`의 `clientHeight + 100`, `clientWidth + 100` detect max 조정 방식처럼 hover 후보 탐지 threshold를 viewport 크기 기반으로 보정한다.

## 검증 결과

실행 명령:

```bash
npm run build
npm run typecheck
npm run test
rg "PANEL_FLASH_DEBOUNCE_MS|getHoverDetectionThresholds|animationend|animationcancel|crop-panel--flash" src/content README.md mydocs
git diff --check
node /private/tmp/crop_cdp_content_smoke.mjs
node /private/tmp/crop_cdp_scroll_follow_smoke.mjs
```

결과:

- OK — `npm run build`: Vite production build 성공, `dist/content/inject.js` 28.07 kB 생성
- OK — `npm run typecheck`: `tsc --noEmit` 성공
- OK — `npm run test`: Vitest 5개 test file, 48개 test 통과
- OK — grep: flash debounce 상수, flash cleanup listener, hover detect threshold, README/report/stage 문서 갱신 확인
- OK — `git diff --check`: whitespace 경고 없음
- OK — CDP content-script smoke: 첫 주입 후 `crop-panel--flash` 없음, 두 번째 주입 후 root count 1 유지, flash 종료 후 class/dataset 정리, hover click selection, drag selection, Cancel/Escape teardown 회귀 없음
- OK — scroll-follow CDP smoke: 900px viewport에서 860px 높이 target이 `translate(120px, 300px)`, `360x860`으로 선택되고, `window.scrollTo(0, 180)` 후 `translate(120px, 120px)`로 재투영됨

## 잔여 위험

- Drag 중 viewport edge auto-scroll은 #12로 분리했다.
- Selected region resize/move handles와 keyboard 조정은 #13으로 분리했다.
- iframe/nested context 내부 요소 선택 지원은 #14로 분리했다.
- full page capture와 scroll stitching은 #15로 분리했다.
- nested scroll container 내부 content가 스크롤되는 경우는 이번 Stage에서 window scroll-follow만 검증했다.

## 다음 단계 영향

- #6 capture backend에서는 선택 rect가 page 좌표로 저장된다는 점과 large element hover threshold가 viewport 크기 기반이라는 점을 기준으로 visible viewport crop 영역을 계산해야 한다.
- capture 직전 overlay 숨김은 toolbar flash 상태와 무관하게 prompt, toolbar, selection mask, selected highlight, action buttons 전체를 대상으로 해야 한다.

## 승인 요청

- Stage 9 산출물과 검증 결과를 승인하면 Task #5 PR 게시 절차로 진행한다.
