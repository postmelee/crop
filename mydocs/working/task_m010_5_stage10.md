# Task #5 Stage 10 보고서

GitHub Issue: [#5](https://github.com/postmelee/crop/issues/5)
구현계획서: [`task_m010_5_impl.md`](../plans/task_m010_5_impl.md)
Stage: 10

## 단계 목적

selected rectangle이 고정된 상태에서 박스 밖을 클릭하면 Firefox식 초기 overlay/prompt 상태로 돌아가야 한다. 현재 구현은 selected 상태의 pointerdown/click sequence가 새 drag/select 흐름으로 재사용되어 같은 클릭으로 다시 crop selection이 발생했다. 이번 Stage는 selected 상태의 문서 클릭을 먼저 소비하고, 박스 밖 클릭은 selection reset만 수행하도록 고정한다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `src/content/overlay/state-machine.ts` | selected 상태를 idle로 돌리는 `resetSelection` event 추가 |
| `src/content/overlay/crop-overlay.ts` | selected 상태 문서 pointerdown에서 action 외 click sequence를 suppress하고, selected rect 밖이면 idle로 reset |
| `tests/content/overlay/state-machine.test.ts` | selected reset과 selected 외 상태 reset no-op 테스트 추가 |
| `README.md` | selected 밖 클릭 smoke 기대 결과 추가 |
| `mydocs/plans/task_m010_5_impl.md` | Stage 10 계획과 검증 기준 기록 |
| `mydocs/report/task_m010_5_report.md` | 최종 보고서를 Stage 10 결과 기준으로 갱신 |
| `mydocs/orders/20260527.md` | #5 완료 메모를 Stage 10 bugfix 기준으로 갱신 |

## 본문 변경 정도 / 본문 무손실 여부

코드 작업이므로 본문 무손실 대상은 없다. 기존 action button click, Cancel/Escape teardown, hover click selection, drag selection, page-coordinate scroll-follow, panel flash cleanup 동작은 유지했다.

## 검증 결과

실행 명령:

```bash
npm run build
npm run typecheck
npm run test
rg "resetSelection|suppressNextDocumentClick|isPointInsidePageRect|selected outside" src/content tests README.md mydocs
git diff --check
node /private/tmp/crop_cdp_content_smoke.mjs
node /private/tmp/crop_cdp_scroll_follow_smoke.mjs
```

결과:

- OK — `npm run build`: Vite production build 성공, `dist/content/inject.js` 28.59 kB 생성
- OK — `npm run typecheck`: `tsc --noEmit` 성공
- OK — `npm run test`: Vitest 5개 test file, 50개 test 통과
- OK — grep: resetSelection event, click suppress guard, selected rect hit-test, README/report/stage 문서 갱신 확인
- OK — `git diff --check`: whitespace 경고 없음
- OK — CDP content-script smoke: selected 상태에서 박스 밖 클릭 후 `data-crop-state="idle"`, prompt `flex`, mode toolbar `flex`, highlight/actions hidden 확인
- OK — CDP content-script smoke: 같은 outside click sequence로 새 selected rect가 즉시 생성되지 않음 확인
- OK — CDP content-script smoke: 이후 hover click으로 재선택 가능, action Cancel, Escape, drag selection 회귀 없음
- OK — scroll-follow CDP smoke: 860px 높이 target의 selected rect가 scroll 이후에도 같은 page 영역을 따라감 확인

## 잔여 위험

- Drag 중 viewport edge auto-scroll은 #12로 분리했다.
- Selected region resize/move handles와 keyboard 조정은 #13으로 분리했다.
- iframe/nested context 내부 요소 선택 지원은 #14로 분리했다.
- full page capture와 scroll stitching은 #15로 분리했다.
- selected box 내부 click은 현재 selection 유지/no-op이다. move/resize 동작은 #13에서 별도 설계한다.

## 다음 단계 영향

- #13에서 resize/move handles를 구현할 때 selected 내부 pointerdown suppress 정책을 handle hit-test와 조정해야 한다.
- #6 capture backend에서는 selected outside click reset 후에는 capture action이 표시되지 않는다는 상태 전제를 유지하면 된다.

## 승인 요청

- Stage 10 산출물과 검증 결과를 승인하면 Task #5 PR 게시 절차로 진행한다.
