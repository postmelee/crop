# Task #5 Stage 6 보고서

GitHub Issue: [#5](https://github.com/postmelee/crop/issues/5)
구현계획서: [`task_m010_5_impl.md`](../plans/task_m010_5_impl.md)
Stage: 6

## 단계 목적

작업지시자의 "원본에 최대한 가깝게 포팅" 요청에 따라 Firefox Screenshots 원본 UI 자산과 drag selection 흐름을 Chrome MV3 overlay에 맞춰 이식한다. Firefox privileged API는 직접 사용하지 않고, 원본 SVG 자산은 `src/firefox-derived/`에 MPL 2.0 경계를 유지해 분리한다.

참고한 원본:

- <https://github.com/mozilla-firefox/firefox/blob/main/browser/components/screenshots/ScreenshotsOverlayChild.sys.mjs>
- <https://github.com/mozilla-firefox/firefox/blob/main/browser/components/screenshots/overlay/overlay.css>
- <https://github.com/mozilla-firefox/firefox/blob/main/browser/components/screenshots/screenshots-buttons.css>
- <https://github.com/mozilla-firefox/firefox/blob/main/browser/components/screenshots/content/menu-visible.svg>
- <https://github.com/mozilla-firefox/firefox/blob/main/browser/components/screenshots/content/menu-fullpage.svg>

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `src/firefox-derived/screenshots-ui-assets.ts` | Firefox Screenshots preview face SVG와 visible/full page icon SVG를 MPL-derived factory로 추가 |
| `src/content/overlay/crop-template.ts` | 원본 기반 face/icon SVG 연결, selection mask DOM 추가 |
| `src/content/overlay/crop-overlay.ts` | pointerdown/move/up 기반 drag selection 연결 |
| `src/content/overlay/crop-overlay.css` | prompt font/width, face/icon 크기, toolbar 크기, selected mask를 원본에 가깝게 보정 |
| `src/content/overlay/state-machine.ts` | `draggingReady`, `dragging` 상태와 40px threshold 전이 추가 |
| `src/content/overlay/positioning.ts` | selected 영역 바깥 dim 처리를 위한 selection mask placement 추가 |
| `tests/content/overlay/state-machine.test.ts` | drag 상태 전이 테스트 5개 추가 |
| `NOTICE` | Stage 6 Firefox-derived UI asset 출처 추가 |
| `THIRD_PARTY.md` | Stage 6 local adaptation target과 upstream SVG 출처 추가 |
| `src/firefox-derived/README.md` | Firefox-derived UI asset boundary 설명 추가 |
| `README.md` | drag selection과 원본 기반 face/icon 상태 갱신 |
| `mydocs/report/task_m010_5_report.md` | 최종 보고서를 Stage 6 결과 기준으로 갱신 |
| `mydocs/orders/20260527.md` | #5 완료 메모를 Stage 6 기준으로 갱신 |

## 본문 변경 정도 / 본문 무손실 여부

코드 작업이므로 본문 무손실 대상은 없다. 기존 action icon/shortcut 진입점, Shadow DOM root id, 중복 실행 guard, hover element selection, selected action buttons, Cancel/Escape teardown 동작은 유지했다.

Firefox 원본은 다음처럼 적용했다.

- preview face SVG path와 pupil id를 `screenshots-ui-assets.ts`에 보존했다.
- visible/full page menu icon SVG를 같은 파일에 보존하고 Chrome에서 동작하도록 `context-fill/context-stroke`를 `currentColor`와 CSS variable로 정규화했다.
- prompt typography는 원본 `overlay.css`에 가까운 `24px / 32px`, width `400px`, face `64px` 기준으로 보정했다.
- drag selection은 원본의 `draggingReady -> dragging -> selected` 흐름과 40px threshold를 반영했다.
- selected 상태에서는 원본 selection container처럼 선택 영역 바깥만 dim 처리하는 mask를 추가했다.

## 검증 결과

실행 명령:

```bash
npm run build
npm run typecheck
npm run test
rg "draggingReady|dragging|screenshots-ui-assets|menu-visible|menu-fullpage|leftPupil|rightPupil" src tests NOTICE THIRD_PARTY.md README.md
git diff --check
node /private/tmp/crop_cdp_content_smoke.mjs
```

결과:

- OK — `npm run build`: Vite production build 성공, `dist/content/inject.js` 26.37 kB 생성
- OK — `npm run typecheck`: `tsc --noEmit` 성공
- OK — `npm run test`: Vitest 5개 test file, 46개 test 통과
- OK — grep: drag 상태, Firefox-derived asset, 원본 pupil id, 라이선스 고지 확인
- OK — `git diff --check`: whitespace 경고 없음
- OK — CDP smoke: face SVG, visible/full page icon SVG, pupil transform, hover click selection, drag selection, selection mask, action buttons, Cancel/Escape teardown 확인

## 잔여 위험

- Firefox의 `ChromeUtils`, `Services`, `AnonymousContent`, `windowUtils`, `browsingContext` 의존 코드는 Chrome 확장에 직접 포팅하지 않았다.
- Firefox resize mover 전체, keyboard resize, edge auto-scroll, full page capture는 이번 Stage에서 제외했다.
- `전체 페이지 선택`은 UI placeholder이며 실제 full page capture는 후속 별도 task가 필요하다.
- Copy/Save 실제 동작과 capture 직전 overlay 숨김 검증은 #6/#7 범위다.

## 다음 단계 영향

- Task #5 PR 게시 전에 Stage 6 결과 기준 최종 보고서 승인이 필요하다.
- #6 capture backend에서는 selection mask, prompt, toolbar, action buttons까지 capture 직전에 숨겨야 한다.

## 승인 요청

- Stage 6 산출물과 검증 결과를 승인하면 Task #5 PR 게시 절차로 진행한다.
