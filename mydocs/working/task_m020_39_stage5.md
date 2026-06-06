# Task #39 Stage 5 완료 보고서

GitHub Issue: [#39](https://github.com/postmelee/crop/issues/39)
구현계획서: [`task_m020_39_impl.md`](../plans/task_m020_39_impl.md)
Stage: 5

## 단계 목적

작업지시자 수동 확인 결과, scroll이 없는 visible/current-page preview에서는 이미지 아래 bottom padding이 보존되어야 하고, full-page preview는 기존처럼 scroll 가능한 surface가 하단까지 보이는 상태를 유지해야 한다. 동시에 preview modal을 viewport 중앙에 배치한다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `src/content/overlay/crop-overlay.css` | backdrop block padding을 위/아래 동일 변수로 통일하고 `.crop-preview`를 center alignment로 변경했다. visible preview image max-height에서 footer height와 bottom padding을 제외해 bottom padding을 침범하지 않게 했다. full-page surface scroll 계약은 유지했다. |
| `tests/content/overlay/phase6-regression.test.ts` | centered preview, dialog available height 변수, footer block size, visible image max-height padding reserve 계약을 추가했다. |
| `mydocs/plans/task_m020_39_impl.md` | Stage 5 후속 보정 범위와 검증 명령을 추가했다. |
| `mydocs/tech/task_m020_8_quality_matrix.md` | P6-29b와 Task #39 결과에 visible padding reserve와 modal 중앙 정렬 기준을 반영했다. |
| `mydocs/report/task_m020_39_report.md` | 단계 수, 변경 파일, 정량 비교, 수용 기준, 검증 결과, 잔여 위험을 Stage 5 기준으로 갱신했다. |
| `mydocs/orders/20260605.md` | 2026-06-05 후속 보정 작업 기록을 추가했다. |
| `mydocs/working/task_m020_39_stage5.md` | Stage 5 산출물, 검증 결과, 잔여 위험을 기록했다. |

## 본문 변경 정도 / 본문 무손실 여부

CSS/test/내부 작업 문서 변경이다. Preview DOM 구조, event handling, Copy/Save/Retry/Cancel action path, full-page preview scroll 계약은 변경하지 않았다. Visible preview image sizing과 preview overlay alignment만 보정했다.

## 검증 결과

실행 명령:

```bash
npm test -- tests/content/overlay/phase6-regression.test.ts
rg -n "align-items: center|crop-preview-dialog-available-height|footer-block-size|crop-preview-inline-padding|object-fit|overflow: auto|overflow: hidden" src/content/overlay/crop-overlay.css tests/content/overlay/phase6-regression.test.ts
rg -n "P6-29b|Task #39|padding reserve|중앙 정렬|visible preview" mydocs/tech/task_m020_8_quality_matrix.md mydocs/report/task_m020_39_report.md
npm run typecheck
npm run build
git diff --check
```

결과:

- OK: `npm test -- tests/content/overlay/phase6-regression.test.ts` 통과. 27개 테스트 통과.
- OK: CSS/test grep에서 centered preview, dialog available height, footer block size, visible image max-height padding reserve, full-page/visible overflow 계약을 확인했다.
- OK: 문서 grep에서 P6-29b, Task #39 결과, visible preview padding reserve와 중앙 정렬 기준이 확인됐다.
- OK: `npm run typecheck` 통과 (`tsc --noEmit`).
- OK: `npm run build` 통과. Vite production build가 완료됐다.
- OK: `git diff --check` 경고 없음.

## 잔여 위험

- 실제 Chrome unpacked extension visual smoke는 수행하지 않았다. 자동 검증은 CSS 계약을 고정하지만, 사용자가 보는 visible preview bottom padding과 modal 중앙 정렬 체감은 작업지시자 재확인 대상이다.

## 다음 단계 영향

- PR #43은 새 head로 다시 push해야 한다.
- 작업지시자는 `npm run build` 후 `/Users/melee/Documents/Crop/dist`를 Chrome에서 reload해 visible/current-page preview와 full-page preview를 각각 확인하면 된다.

## 승인 요청

- Stage 5 산출물과 갱신된 최종 보고서를 승인하면 PR #43 업데이트 상태로 리뷰를 계속 진행한다.
