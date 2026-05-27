# Task #5 Stage 5 보고서

GitHub Issue: [#5](https://github.com/postmelee/crop/issues/5)
구현계획서: [`task_m010_5_impl.md`](../plans/task_m010_5_impl.md)
Stage: 5

## 단계 목적

작업지시자가 확인한 Firefox 원본 화면과 현재 `crop` overlay 사이의 시각 차이를 줄인다. Firefox Screenshots 원본의 초기 preview overlay, top-right visible/full page 버튼 패널, pointer 위치를 따라 움직이는 눈동자 동작을 분석하고, 제품명과 원본 asset은 복사하지 않은 채 `crop`의 Shadow DOM overlay 구조로 재구현한다.

참고한 원본:

- <https://github.com/mozilla-firefox/firefox/blob/main/browser/components/screenshots/ScreenshotsOverlayChild.sys.mjs>
- <https://github.com/mozilla-firefox/firefox/blob/main/browser/components/screenshots/overlay/overlay.css>
- <https://github.com/mozilla-firefox/firefox/blob/main/browser/components/screenshots/screenshots-buttons.js>
- <https://github.com/mozilla-firefox/firefox/blob/main/browser/components/screenshots/screenshots-buttons.css>

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `src/content/overlay/crop-template.ts` | top-right mode toolbar, 중앙 prompt, CSS 기반 face/eyes DOM 추가 |
| `src/content/overlay/crop-overlay.ts` | pointermove에서 preview face 눈동자 offset 갱신 연결 |
| `src/content/overlay/crop-overlay.css` | Firefox식 dark overlay, dashed boundary, toolbar, prompt, face/eyes 스타일 추가 |
| `src/content/overlay/positioning.ts` | viewport 중심 기준 eye offset 계산 helper 추가 |
| `tests/content/overlay/positioning.test.ts` | eye offset 단위 테스트 3개 추가 |
| `README.md` | Chrome unpacked smoke 기대 결과를 Stage 5 UI 기준으로 갱신 |
| `mydocs/plans/task_m010_5_impl.md` | Stage 5 범위와 검증 항목 추가 |
| `mydocs/report/task_m010_5_report.md` | 최종 보고서를 Stage 5 결과 기준으로 갱신 |
| `mydocs/orders/20260527.md` | #5 완료 메모를 Stage 5 기준으로 갱신 |

## 본문 변경 정도 / 본문 무손실 여부

코드 작업이므로 본문 무손실 대상은 없다. 기존 action icon/shortcut 진입점, Shadow DOM root id, 중복 실행 guard, hover helper, selected rectangle, Copy/Save/Cancel no-op UI, Cancel/Escape teardown 동작은 유지했다.

Firefox 원본 분석은 다음처럼 적용했다.

- 초기 preview container는 `crop-prompt`로 재구현했다.
- 원본 face SVG path는 복사하지 않고 CSS box/border 기반의 `crop-face`로 대체했다.
- 원본 눈동자 이동식의 핵심인 viewport 중심 대비 pointer 좌표 변환은 `getEyeOffsetPresentation()`으로 분리했다.
- 원본 visible/full page 버튼 패널 구조는 `crop-mode-toolbar`로 재구현했다.
- full page capture는 MVP 범위 밖이므로 `전체 페이지 선택`은 disabled placeholder로 표시했다.

## 검증 결과

실행 명령:

```bash
npm run build
npm run typecheck
npm run test
rg "crop-mode-toolbar|crop-prompt|crop-eye|보이는 영역 선택|전체 페이지 선택" src/content README.md
git diff --check
node /private/tmp/crop_cdp_content_smoke.mjs
```

결과:

- OK — `npm run build`: Vite production build 성공, `dist/content/inject.js` 생성
- OK — `npm run typecheck`: `tsc --noEmit` 성공
- OK — `npm run test`: Vitest 5개 test file, 41개 test 통과
- OK — grep: toolbar/prompt/eye DOM과 한국어 mode label 확인
- OK — `git diff --check`: whitespace 경고 없음
- OK — CDP smoke: overlay root 1개, mode toolbar 2개 버튼, 중앙 prompt, face, eye 2개, pointermove 후 `--crop-eye-x/-y` 갱신, hover highlight, selected actions, Cancel/Escape teardown 확인

## 잔여 위험

- Firefox 제품명, 원본 SVG path, 원본 icon asset은 사용하지 않았으므로 픽셀 단위 완전 복제는 의도적으로 제외했다.
- `전체 페이지 선택`은 UI placeholder로만 보이며 full page capture는 후속 별도 task 범위다.
- prompt 문구는 Firefox식으로 맞췄지만 drag-to-region selection 자체는 아직 구현하지 않았다.
- Copy/Save 실제 동작과 capture 직전 overlay 숨김 검증은 #6/#7 범위다.

## 다음 단계 영향

- Task #5 PR 게시 전에 최종 보고서가 Stage 5 기준으로 승인되어야 한다.
- #6 capture backend에서는 toolbar/prompt/highlight/actions를 capture 직전에 숨기는 처리가 필요하다.

## 승인 요청

- Stage 5 산출물과 검증 결과를 승인하면 Task #5 PR 게시 절차로 진행한다.
