# Task #66 최종 보고서

GitHub Issue: [#66](https://github.com/postmelee/crop/issues/66)
마일스톤: M020

## 작업 요약

- 대상 이슈: #66
- 마일스톤: M020
- 단계 수: 4
- 작업 목적: viewport 밖으로 일부 벗어난 selected stitching 캡처에서 광고 영역이 검정 placeholder로 저장되는 문제를 selected 경로 한정 scroll planning 보정으로 해결한다.

## 변경 파일 목록과 영향 범위

| 경로 | 변경 요약 | 영향 범위 |
|---|---|---|
| `src/content/overlay/full-page-capture.ts` | selected page rect capture용 `minimal-scroll` planning 옵션과 `capturePageRectTiles()` 기본 연결 추가 | selected stitching tile scroll planning |
| `tests/content/overlay/full-page-capture.test.ts` | `minimal-scroll` helper 계약, selected runtime 연결, `segment-start` opt-back 테스트 추가 | capture helper 회귀 테스트 |
| `tests/content/overlay/phase6-regression.test.ts` | selected stitching은 `minimal-scroll`, full page planning은 기존 경로를 유지한다는 regression 추가 | phase6 회귀 테스트 |
| `mydocs/tech/task_m020_8_quality_matrix.md` | P6-39 selected scroll capture 근거에 Task #66 보정 추가 | 내부 품질 기준 |
| `mydocs/plans/task_m020_66.md` | 수행계획서 작성 | 작업 계획 |
| `mydocs/plans/task_m020_66_impl.md` | 단계별 구현계획서 작성 | 작업 계획 |
| `mydocs/working/task_m020_66_stage1.md` | Stage 1 보고서 작성 | 단계 보고 |
| `mydocs/working/task_m020_66_stage2.md` | Stage 2 보고서 작성 | 단계 보고 |
| `mydocs/working/task_m020_66_stage3.md` | Stage 3 보고서 작성 | 단계 보고 |
| `mydocs/report/task_m020_66_report.md` | 최종 보고서 작성 | 최종 보고 |
| `mydocs/orders/20260612.md`, `mydocs/orders/20260613.md` | 오늘할일 등록과 완료 처리 | 작업 추적 |

## 문서 위치 검증

공식 사용자 문서는 새로 만들거나 수정하지 않았다. 수행계획서의 문서 위치 판단대로 내부 작업 계획, 단계 보고, 최종 보고, 품질 기준만 갱신했다.

| 파일 | 계획된 위치 | 실제 위치 | 결과 | 근거 |
|---|---|---|---|---|
| `mydocs/plans/task_m020_66.md` | `mydocs/plans/` | `mydocs/plans/task_m020_66.md` | OK | 수행계획서 |
| `mydocs/plans/task_m020_66_impl.md` | `mydocs/plans/` | `mydocs/plans/task_m020_66_impl.md` | OK | 구현계획서 |
| `mydocs/working/task_m020_66_stage{N}.md` | `mydocs/working/` | `mydocs/working/` | OK | Stage 1~3 보고서 |
| `mydocs/report/task_m020_66_report.md` | `mydocs/report/` | `mydocs/report/task_m020_66_report.md` | OK | 최종 보고서 |
| `mydocs/tech/task_m020_8_quality_matrix.md` | `mydocs/tech/` | `mydocs/tech/task_m020_8_quality_matrix.md` | OK | P6-39 내부 품질 기준 갱신 |
| 공식 사용자 문서 | 생성하지 않음 | 해당 없음 | OK | 사용자-facing 문서 변경 없음 |

## 변경 전·후 정량 비교

| 지표 | 변경 전 | 변경 후 |
|---|---|---|
| selected page rect 단일 tile scroll planning | segment start 기준으로 선택 rect 시작점에 맞춰 scroll | 현재 scroll을 최대한 유지하고 필요한 만큼만 이동하는 `minimal-scroll` |
| full page capture scroll planning | segment start | 변경 없음 |
| focused full-page-capture 테스트 | 18개 통과 | 20개 통과 |
| 전체 테스트 | 기존 suite | 17개 test file, 219개 test 통과 |
| Chrome MV3 권한 | `activeTab`, `scripting`, `clipboardWrite` 중심 | `debugger`, `<all_urls>`, host permission 추가 없음 |

## 검증 결과

| 수용 기준 | 결과 |
|---|---|
| viewport 밖으로 일부 벗어난 selected 광고 캡처가 검정 placeholder가 아닌 실제 이미지로 저장됨 | OK — 작업지시자 2026-06-13 수동 smoke에서 수정 확인 |
| 광고가 viewport 안에 완전히 들어온 경우 기존처럼 정상 캡처 | OK — 작업지시자 2026-06-13 수동 smoke에서 수정 확인 |
| 일반 본문 영역은 viewport 밖으로 일부 벗어나도 기존처럼 정상 캡처 | OK — 작업지시자 2026-06-13 수동 smoke에서 수정 확인 |
| selected 경로만 `minimal-scroll`을 사용하고 full page planning은 기존 동작 유지 | OK — `full-page-capture.test.ts`, `phase6-regression.test.ts` 통과 |
| 결과 크기와 scroll 복구 계약 유지 | OK — `full-page-capture.test.ts` 통과 |
| `debugger`, `<all_urls>`, broad host permission 미추가 | OK — 권한 grep과 phase6 regression 확인 |
| 최종 통합 테스트 통과 | OK — `npm test`: 17개 test file, 219개 test 통과 |

### 단계별 검증 결과

- Stage 1: [`task_m020_66_stage1.md`](../working/task_m020_66_stage1.md) — selected page rect 최소 이동 scroll planning 계약 추가, focused test 18개와 `git diff --check` 통과.
- Stage 2: [`task_m020_66_stage2.md`](../working/task_m020_66_stage2.md) — `capturePageRectTiles()` selected runtime 연결, focused test 41개와 typecheck 통과.
- Stage 3: [`task_m020_66_stage3.md`](../working/task_m020_66_stage3.md) — phase6 regression과 수동 smoke 기준 정리, phase6 test 30개와 권한 grep 통과.
- Stage 4: 최종 통합 검증 — `npm run typecheck`, `npm test`, 권한 grep, `git diff --check`, 작업지시자 수동 smoke 통과.

## 잔여 위험과 후속 작업

### 잔여 위험

- 실제 광고 iframe/OOPIF 렌더링은 외부 광고 로딩, Chrome compositor, OS/GPU 상태에 영향을 받을 수 있다. 이번 수동 smoke에서는 수정이 확인됐지만, 다른 광고 소재나 환경에서 재현될 가능성은 완전히 배제할 수 없다.
- pixel 분석 기반 retry는 이번 task에서 구현하지 않았다. selected `minimal-scroll` 보정으로 실제 문제가 해소되어, 오탐과 비용이 있는 retry는 보류했다.

### 후속 작업 후보

- 다른 광고/환경에서 검정 placeholder가 다시 재현되면 selected stitching 경로에 한정한 최대 1회 retry를 별도 이슈로 분리한다.

## 작업지시자 승인 요청

- 최종 보고서와 수용 기준 검증 결과를 승인하면 PR 게시 절차로 진행한다.
