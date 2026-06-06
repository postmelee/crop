# Task #41 최종 보고서

GitHub Issue: [#41](https://github.com/postmelee/crop/issues/41)
마일스톤: M020

## 작업 요약

- 대상 이슈: #41
- 마일스톤: M020
- 단계 수: 4
- 작업 목적: 매우 긴 페이지의 full page preview modal에서 scroll 중 흰색/회색 band가 보이는 문제를 tiled renderer로 해결한다.

## 변경 파일 목록과 영향 범위

| 경로 | 변경 요약 | 영향 범위 |
|---|---|---|
| `src/content/overlay/crop-template.ts` | preview template에 tiled layer와 surface 참조 추가 | preview DOM 구조 |
| `src/content/overlay/crop-overlay.ts` | full page 전용 tiled preview model/render branch, display scale, hidden image 정리 | full page preview 표시 |
| `src/content/overlay/crop-overlay.css` | tiled layer/tile/image 스타일, visible mode 분기, hidden image 표시 방지 | preview modal CSS |
| `src/shared/stitch-image.ts` | preview tile layout helper 추가 | stitching 좌표계 재사용 |
| `tests/content/overlay/phase6-regression.test.ts` | tiled preview, Save/Copy 책임 분리, visible mode 유지 regression 추가 | overlay 회귀 테스트 |
| `tests/shared/stitch-image.test.ts` | preview tile layout과 downscale edge alignment 테스트 추가 | stitching helper 회귀 테스트 |
| `mydocs/tech/task_m020_8_quality_matrix.md` | P6-41 상태를 OK로 갱신 | 내부 품질 기준 |
| `mydocs/working/task_m020_41_stage1.md` | preview renderer contract 고정 | 단계 보고 |
| `mydocs/working/task_m020_41_stage2.md` | tiled preview DOM/model 구현 보고 | 단계 보고 |
| `mydocs/working/task_m020_41_stage3.md` | scale/Save/Copy 검증 보고 | 단계 보고 |
| `mydocs/working/task_m020_41_stage4.md` | 통합 검증과 수동 smoke 보고 | 단계 보고 |
| `mydocs/orders/20260605.md` | #41 완료 처리 | 작업 추적 |

## 문서 위치 검증

공식 사용자 문서는 새로 만들지 않았다. 수행계획서의 문서 위치 판단대로 내부 품질 기준과 작업 산출물만 갱신했다.

| 파일 | 계획된 위치 | 실제 위치 | 결과 | 근거 |
|---|---|---|---|---|
| `mydocs/tech/task_m020_8_quality_matrix.md` | `mydocs/tech/` | `mydocs/tech/task_m020_8_quality_matrix.md` | OK | P6-41 내부 품질 기준 갱신 |
| `mydocs/working/task_m020_41_stage{N}.md` | `mydocs/working/` | `mydocs/working/` | OK | Stage 1~4 보고서 작성 |
| `mydocs/report/task_m020_41_report.md` | `mydocs/report/` | `mydocs/report/task_m020_41_report.md` | OK | 최종 보고서 작성 |

## 변경 전·후 정량 비교

| 지표 | 변경 전 | 변경 후 |
|---|---|---|
| full page preview renderer | stitched PNG 단일 `<img>` | capture tile 기반 tiled renderer |
| P6-41 상태 | 후속 | OK |
| focused regression | full page preview 단일 image pipeline 중심 | tiled layer, scale wrapper, Save/Copy 책임 분리, hidden image 방지 포함 |
| 전체 테스트 | 기존 suite | 17개 test file, 212개 test 통과 |

## 검증 결과

| 수용 기준 | 결과 |
|---|---|
| 긴 GitHub 페이지 full page preview scroll 중 흰색/회색 band 미노출 | OK — 작업지시자 2026-06-06 수동 smoke 통과 |
| Save/Copy 결과 PNG는 기존 stitched PNG `dataUrl` 사용 | OK — `performPreviewAction()` regression에서 `result.dataUrl`만 사용 확인 |
| visible viewport preview는 기존 단일 image path 유지 | OK — visible mode CSS/phase6 regression 확인 |
| full page preview toolbar, Copy/Save/Cancel/Retry 유지 | OK — 기존 preview action DOM 유지, phase6 regression 통과 |
| 저장 PNG 해상도 개선, multipart/PDF export, virtualization 제외 | OK — 이번 변경에 포함하지 않음 |
| `debugger`, `<all_urls>`, broad host permission 미추가 | OK — 권한 grep과 manifest regression 확인 |

### 단계별 검증 결과

- Stage 1: [`task_m020_41_stage1.md`](../working/task_m020_41_stage1.md) — preview/capture/stitching contract 문서화, `rg`, `git diff --check` 통과.
- Stage 2: [`task_m020_41_stage2.md`](../working/task_m020_41_stage2.md) — tiled DOM/model/CSS 구현, typecheck와 phase6 focused test 통과.
- Stage 3: [`task_m020_41_stage3.md`](../working/task_m020_41_stage3.md) — Save/Copy 책임 분리와 scale 정렬 검증, focused tests 54개 통과.
- Stage 4: [`task_m020_41_stage4.md`](../working/task_m020_41_stage4.md) — build/typecheck/full test/권한 grep/수동 smoke 통과.

## 잔여 위험과 후속 작업

### 잔여 위험

- tiled preview는 tile dataUrl과 stitched PNG dataUrl을 함께 보관하므로 메모리 사용량이 늘 수 있다.
- Chrome compositor artifact는 OS/GPU/Chrome 버전에 따라 달라질 수 있어, PR 이후 다른 환경 smoke가 필요할 수 있다.

### 후속 작업 후보

- 아주 긴 페이지 preview에서 메모리 사용량이 실제 blocker로 확인되면 tile virtualization 또는 preview lifecycle 축소를 별도 이슈로 분리한다.
- full page 저장 PNG 해상도 개선, multipart/PDF export는 이번 task 범위에서 제외했으며 별도 승인 후 다룬다.

## 작업지시자 승인 요청

- 최종 보고서와 수용 기준 검증 결과를 승인하면 PR 게시 절차로 진행한다.
