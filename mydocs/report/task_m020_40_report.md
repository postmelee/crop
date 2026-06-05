# Task #40 최종 보고서

GitHub Issue: [#40](https://github.com/postmelee/crop/issues/40)
마일스톤: M020

## 작업 요약

- 대상 이슈: #40
- 마일스톤: M020
- 단계 수: 6
- 작업 목적: 전체 페이지 preview modal 스크롤 중 새로 노출되는 영역에 blank band가 순간 노출되는 문제의 원인을 저장 PNG와 preview 렌더링으로 분리해 판단한다.
- 최종 판단: 저장 PNG는 정상이며, 문제는 초대형 단일 `<img>` preview를 빠르게 스크롤할 때 Chrome이 edge paint를 따라오지 못해 preview surface 배경이 드러나는 렌더링 artifact다.
- 처리 결과: Stage 2/5의 제품 코드 보정은 근본 해결이 아니므로 되돌렸고, 실제 해결은 tiled preview renderer 후속 이슈로 분리한다.

## 변경 파일 목록과 영향 범위

| 경로 | 변경 요약 | 영향 범위 |
|---|---|---|
| `src/content/overlay/crop-overlay.css` | Stage 2의 `.crop-preview-image` background 완화를 되돌려 `#ffffff` fallback으로 복귀 | preview modal 표시 |
| `src/content/overlay/full-page-capture.ts` | Stage 5의 tile capture 2-frame wait 보정을 되돌려 기존 1-frame wait로 복귀 | full page/selected page rect stitching capture |
| `tests/content/overlay/phase6-regression.test.ts` | preview image `transparent`/`#ffffff` 금지 assertion 제거 | Phase 6 overlay regression |
| `tests/content/overlay/full-page-capture.test.ts` | Stage 5 tile wait contract test 제거 | full page capture regression |
| `mydocs/tech/task_m020_8_quality_matrix.md` | P6-41을 후속 이슈 필요 상태로 갱신 | 내부 품질 기준 |
| `mydocs/orders/20260604.md` | #40 기존 진행 기록 유지 | 오늘할일 |
| `mydocs/orders/20260605.md` | #40 보정 되돌림과 후속 이슈 분리 완료 기록 | 오늘할일 |
| `mydocs/feedback/task_m020_40_feedback.md` | Stage 5 이후 회색 band 재현과 최종 판단 기록 | 작업 산출물 |
| `mydocs/plans/task_m020_40.md` | 수행계획서 유지 | 작업 산출물 |
| `mydocs/plans/task_m020_40_impl.md` | Stage 6 rollback과 후속 이슈 분리 계획 추가 | 작업 산출물 |
| `mydocs/working/task_m020_40_stage1.md` | 영상 분석과 preview/stitching contract 고정 | 작업 산출물 |
| `mydocs/working/task_m020_40_stage2.md` | preview fallback 보정 시도 기록 | 작업 산출물 |
| `mydocs/working/task_m020_40_stage3.md` | 저장 PNG seam 방어 필요성 판단 기록 | 작업 산출물 |
| `mydocs/working/task_m020_40_stage4.md` | 품질 매트릭스와 통합 검증 결과 기록 | 작업 산출물 |
| `mydocs/working/task_m020_40_stage5.md` | 긴 페이지 tile paint settle 추가 보정 시도 기록 | 작업 산출물 |
| `mydocs/working/task_m020_40_stage6.md` | 보정 rollback과 tiled preview 후속 분리 기록 | 작업 산출물 |
| `mydocs/report/task_m020_40_report.md` | 최종 결과 보고 갱신 | 작업 산출물 |

## 문서 위치 검증

| 파일 | 계획된 위치 | 실제 위치 | 결과 | 근거 |
|---|---|---|---|---|
| `mydocs/tech/task_m020_8_quality_matrix.md` | `mydocs/tech/` | `mydocs/tech/task_m020_8_quality_matrix.md` | OK | 수행계획서의 내부 품질 기준 위치와 일치 |
| `mydocs/plans/task_m020_40.md` | `mydocs/plans/` | `mydocs/plans/task_m020_40.md` | OK | 수행계획서 위치와 일치 |
| `mydocs/plans/task_m020_40_impl.md` | `mydocs/plans/` | `mydocs/plans/task_m020_40_impl.md` | OK | 구현계획서 위치와 일치 |
| `mydocs/working/task_m020_40_stage{N}.md` | `mydocs/working/` | `mydocs/working/task_m020_40_stage1~6.md` | OK | 단계 보고서 위치와 일치 |
| `mydocs/feedback/task_m020_40_feedback.md` | `mydocs/feedback/` | `mydocs/feedback/task_m020_40_feedback.md` | OK | 작업지시자 피드백 위치와 일치 |
| `mydocs/report/task_m020_40_report.md` | `mydocs/report/` | `mydocs/report/task_m020_40_report.md` | OK | 최종 보고서 위치와 일치 |
| 공식 사용자 문서 | 생성하지 않음 | 해당 없음 | OK | 이번 task는 사용자-facing 공식 문서를 만들지 않기로 승인됨 |

## 변경 전·후 정량 비교

| 지표 | Stage 5 상태 | Stage 6 최종 상태 |
|---|---|---|
| preview image fallback background | `transparent` | `#ffffff` |
| tile capture 기본 paint wait | 2 animation frames + timeout | 1 animation frame + timeout |
| preview image fallback 회귀 테스트 | `#ffffff` 금지 | 제거 |
| tile capture wait 회귀 테스트 | 추가됨 | 제거 |
| 전체 자동 테스트 | `17` files, `209` tests passed | `17` files, `208` tests passed |
| 권한 변경 | 없음 | 없음, `debugger`/`<all_urls>` 미추가 |

## 검증 결과

| 수용 기준 | 결과 |
|---|---|
| full page preview modal을 빠르게 스크롤할 때 blank band가 저장 PNG 결함인지 preview 렌더링 결함인지 분리한다. | OK — 작업지시자가 저장 PNG는 수정 전부터 정상이라고 확인했고, 새 영상의 회색 band는 `.crop-preview-surface` 배경색이 edge paint fallback으로 드러나는 현상으로 판단했다. |
| 초대형 단일 `<img>` preview 구조에서 band를 안정적으로 제거하지 못하면 시각적 완화와 capture wait 보정을 되돌린다. | OK — Stage 2/5 제품 코드와 관련 테스트를 되돌렸다. |
| visible viewport preview는 내부 스크롤 없이 기존 맞춤 표시를 유지한다. | OK — visible mode `overflow: hidden`, `max-height: 100%`, `object-fit: contain` regression checks 유지. |
| full page preview는 기존처럼 내부 스크롤 가능하고 toolbar/image inline padding 정렬이 회귀하지 않는다. | OK — 기존 preview pipeline regression checks 유지. |
| selected/full page Copy/Save 결과에 crop overlay, preview, toolbar, action UI가 포함되지 않는다. | OK — 기존 full page/phase6 tests 유지. |
| 저장 PNG seam 가능성은 preview UI artifact와 분리해 판단한다. | OK — Stage 3에서 focused tests 통과, stitching 코드는 변경하지 않음. |
| 저장 PNG 변경은 transparent gap 또는 destination rounding gap이 테스트로 확인될 때만 적용한다. | OK — gap 근거가 없어 저장 PNG 경로 변경 없음. |
| `debugger`, `<all_urls>`, broad host permission은 추가하지 않는다. | OK — 권한 grep과 `phase6-regression.test.ts` 권한 테스트로 확인한다. |

### 단계별 검증 결과

- Stage 1: [`task_m020_40_stage1.md`](../working/task_m020_40_stage1.md) — 영상 분석, preview DOM/CSS/stitching contract 확인, `git diff --check` 통과.
- Stage 2: [`task_m020_40_stage2.md`](../working/task_m020_40_stage2.md) — preview fallback 보정을 시도했으나 Stage 6에서 제품 코드 되돌림.
- Stage 3: [`task_m020_40_stage3.md`](../working/task_m020_40_stage3.md) — 저장 PNG seam 근거 없음, stitching 변경 없음.
- Stage 4: [`task_m020_40_stage4.md`](../working/task_m020_40_stage4.md) — build/typecheck/full test 통과, 수동 smoke 한계 기록.
- Stage 5: [`task_m020_40_stage5.md`](../working/task_m020_40_stage5.md) — tile capture wait 보정을 시도했으나 Stage 6에서 제품 코드 되돌림.
- Stage 6: [`task_m020_40_stage6.md`](../working/task_m020_40_stage6.md) — 보정 rollback, 최종 판단, tiled preview 후속 이슈 분리, build/typecheck/full test 통과.

## 잔여 위험과 후속 작업

### 잔여 위험

- 현행 단일 `<img>` preview 구조에서는 엄청 긴 페이지를 빠르게 스크롤할 때 preview surface 배경이 band처럼 보일 수 있다.
- 이 현상은 저장 PNG 품질 문제로 확인되지 않았지만, 사용자에게는 preview가 깨진 것처럼 보일 수 있다.

### 후속 작업 후보

- 신규 이슈: [#41](https://github.com/postmelee/crop/issues/41) — `Full page preview를 tiled renderer로 전환해 긴 페이지 스크롤 paint artifact 제거`
- 범위: Save/Copy용 stitched PNG는 유지하고, modal preview만 capture tile dataUrl들을 작은 이미지 조각으로 표시한다.
- 제외: full page 저장 PNG 해상도 한계 개선, multi-part export, PDF export.

## 작업지시자 승인 요청

- Stage 6 보정 되돌림과 최종 판단을 승인하면 PR 게시 또는 #41 task-start 절차로 진행한다.
