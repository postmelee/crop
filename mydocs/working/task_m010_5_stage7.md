# Task #5 Stage 7 보고서

GitHub Issue: [#5](https://github.com/postmelee/crop/issues/5)
구현계획서: [`task_m010_5_impl.md`](../plans/task_m010_5_impl.md)
Stage: 7

## 단계 목적

작업지시자가 지정한 제외 범위인 `crop-frame` 상시 표시 제거 또는 조건부 표시, hover highlight 색/opacity 조정은 건드리지 않고, Firefox 원본 UI와 차이가 큰 세부 항목만 보정한다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `src/firefox-derived/screenshots-ui-assets.ts` | `context-fill` 아이콘 path에 `fill-rule="evenodd"`와 `clip-rule="evenodd"`를 적용해 visible icon 내부가 흰 사각형처럼 막히지 않도록 보정 |
| `src/content/overlay/crop-overlay.css` | prompt 수직 offset 제거, prompt/cancel/mode button font weight 축소, top-right mode toolbar와 button 크기 축소 |
| `README.md` | 개발 상태를 Stage 7 기준으로 갱신 |
| `mydocs/plans/task_m010_5_impl.md` | Stage 7 범위, 산출물, 검증 계획 추가 |
| `mydocs/report/task_m010_5_report.md` | 최종 보고서를 Stage 7 결과 기준으로 갱신 |
| `mydocs/orders/20260527.md` | #5 완료 메모를 Stage 7 기준으로 갱신 |

## 본문 변경 정도 / 본문 무손실 여부

코드 작업이므로 본문 무손실 대상은 없다. 기존 action icon/shortcut 진입점, Shadow DOM root id, 중복 실행 guard, hover element selection, drag selection, selected action buttons, Cancel/Escape teardown 동작은 유지했다.

요청에 따라 다음 항목은 변경하지 않았다.

- `.crop-frame` 상시 표시 방식
- `.crop-highlight`와 `.crop-highlight--selected`의 색상, opacity, background, box-shadow

## 검증 결과

실행 명령:

```bash
npm run build
npm run typecheck
npm run test
rg "fill-rule|crop-mode-button|crop-prompt-instructions|font-weight: 600|translateY\\(0\\)" src/content src/firefox-derived
git diff --check
node /private/tmp/crop_cdp_content_smoke.mjs
```

결과:

- OK — `npm run build`: Vite production build 성공, `dist/content/inject.js` 26.44 kB 생성
- OK — `npm run typecheck`: `tsc --noEmit` 성공
- OK — `npm run test`: Vitest 5개 test file, 46개 test 통과
- OK — grep: `fill-rule`, `translateY(0)`, `font-weight: 600`, mode button/prompt selector 확인
- OK — `git diff --check`: whitespace 경고 없음
- OK — CDP smoke: visible/full page icon `fill-rule="evenodd"`, prompt transform `matrix(1, 0, 0, 1, 0, 0)`, prompt/cancel/mode button font weight `600`, mode button `91x80`, hover click selection, drag selection, Cancel/Escape teardown 확인

## 잔여 위험

- Firefox의 브라우저 chrome UI 크기, toolbar theme, page zoom, OS font rendering 차이는 Chrome 확장에서 완전히 동일하게 재현할 수 없다.
- 이번 Stage는 시각 보정만 수행했다. Firefox resize mover 전체, keyboard resize, edge auto-scroll, full page capture는 여전히 후속 별도 task 범위다.
- Copy/Save 실제 동작과 capture 직전 overlay 숨김 검증은 #6/#7 범위다.

## 다음 단계 영향

- Task #5 PR 게시 전에 Stage 7 결과 기준 최종 보고서 승인이 필요하다.
- #6 capture backend에서는 Stage 7에서 보정한 prompt, toolbar, action buttons, selection mask까지 capture 직전에 숨겨야 한다.

## 승인 요청

- Stage 7 산출물과 검증 결과를 승인하면 Task #5 PR 게시 절차로 진행한다.
