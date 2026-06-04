# Task #39 Stage 4 완료 보고서

GitHub Issue: [#39](https://github.com/postmelee/crop/issues/39)
구현계획서: [`task_m020_39_impl.md`](../plans/task_m020_39_impl.md)
Stage: 4

## 단계 목적

작업지시자 수동 확인 결과, visible preview에서 이미지 아래 내부 여백이 양옆 padding보다 크게 보이는 문제를 후속 보정한다. Full page preview의 고정 높이와 내부 scroll 계약은 유지하면서 visible preview만 내용 높이에 맞춰 줄어들게 한다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `src/content/overlay/crop-overlay.css` | backdrop bottom padding을 inline backdrop padding과 같은 변수 기준으로 맞췄다. surface bottom padding은 `--crop-preview-inline-padding`을 사용하게 했고, visible preview dialog는 `height: auto`와 기존 max-height 상한을 함께 사용하게 했다. |
| `tests/content/overlay/phase6-regression.test.ts` | backdrop bottom/inline 변수 공유, surface bottom/shared inline padding, visible dialog `height: auto`, visible surface `flex: 0 1 auto` 계약을 추가했다. |
| `mydocs/plans/task_m020_39_impl.md` | 수동 확인 후 Stage 4 보정 범위와 검증 명령을 추가했다. |
| `mydocs/tech/task_m020_8_quality_matrix.md` | P6-29b와 Task #39 결과에 visible preview 하단 padding 보정 기준을 반영했다. |
| `mydocs/report/task_m020_39_report.md` | 단계 수, 변경 파일, 정량 비교, 수용 기준, 검증 결과, 잔여 위험을 Stage 4 기준으로 갱신했다. |
| `mydocs/orders/20260604.md` | #39 완료 비고를 후속 visible preview 하단 padding 보정 포함으로 갱신했다. |
| `mydocs/working/task_m020_39_stage4.md` | Stage 4 산출물, 검증 결과, 잔여 위험을 기록했다. |

## 본문 변경 정도 / 본문 무손실 여부

CSS/test/내부 작업 문서 변경이다. Preview DOM 구조, event handling, Copy/Save/Retry/Cancel action path, full page preview scroll 계약은 변경하지 않았다. Visible preview만 고정 dialog height에서 content height 기반으로 줄어들게 보정했다.

## 검증 결과

실행 명령:

```bash
npm test -- tests/content/overlay/phase6-regression.test.ts
rg -n "crop-preview|crop-preview-dialog|crop-preview-inline-padding|backdrop-block-end|height: auto|flex: 0 1 auto" src/content/overlay/crop-overlay.css tests/content/overlay/phase6-regression.test.ts
rg -n "P6-29b|Task #39|하단 padding|visible preview" mydocs/tech/task_m020_8_quality_matrix.md mydocs/report/task_m020_39_report.md
npm run build
npm run typecheck
git diff --check
```

결과:

- OK: `npm test -- tests/content/overlay/phase6-regression.test.ts` 통과. 27개 테스트 통과.
- OK: CSS/test grep에서 backdrop bottom/inline 변수 공유, surface bottom/shared inline padding, visible dialog `height: auto`, visible surface `flex: 0 1 auto` 계약을 확인했다.
- OK: 문서 grep에서 P6-29b, Task #39 결과, 하단 padding, visible preview 후속 보정 내용이 확인됐다.
- OK: `npm run build` 통과. Vite production build가 완료됐다.
- OK: `npm run typecheck` 통과 (`tsc --noEmit`).
- OK: `git diff --check` 경고 없음.

## 잔여 위험

- 실제 Chrome unpacked extension visual smoke는 수행하지 않았다. 자동 검증은 CSS 계약을 고정하지만, 사용자가 보는 visible preview 하단 padding 체감은 작업지시자 재확인 대상이다.

## 다음 단계 영향

- 최종 보고서 승인 후 PR 게시 절차로 진행할 수 있다.
- PR 또는 수동 smoke 중 추가 레이아웃 피드백이 나오면 visible preview height rule 또는 `--crop-preview-inline-padding` 기준만 좁게 재조정하면 된다.

## 승인 요청

- Stage 4 산출물과 갱신된 최종 보고서를 승인하면 PR 게시 절차로 진행한다.
