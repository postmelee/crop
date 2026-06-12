# Task #65 최종 보고서 - 사용자 버그 제보용 Issue Form 추가

GitHub Issue: [#65](https://github.com/postmelee/crop/issues/65)
마일스톤: M030

## 작업 요약

- 대상 이슈: #65
- 마일스톤: M030
- 단계 수: 3
- 작업 목적: 사용자가 crop 버그를 GitHub Issue로 쉽게 제보할 수 있도록 사용자 버그 제보용 Issue Form을 추가한다.

## 변경 파일 목록과 영향 범위

| 경로 | 변경 요약 | 영향 범위 |
|---|---|---|
| `.github/ISSUE_TEMPLATE/bug_report.yml` | 사용자 버그 제보용 GitHub Issue Form 신규 추가. 버그 내용, 재현 절차, 기대 결과, 실제 결과, 사용 환경 및 버전, 스크린샷/녹화 자료 입력 항목 포함 | GitHub Issue 생성 UI |
| `mydocs/orders/20260612.md` | #65 진행 상태를 최종 보고서 작성 후 PR 게시 승인 대기 상태로 갱신 | 내부 작업 보드 |
| `mydocs/plans/task_m030_65.md` | 수행계획서 작성 | 내부 작업 산출물 |
| `mydocs/plans/task_m030_65_impl.md` | Stage 1~3 구현계획서 작성 | 내부 작업 산출물 |
| `mydocs/working/task_m030_65_stage1.md` | 사용자 버그 제보 Issue Form 추가 결과 기록 | 내부 작업 산출물 |
| `mydocs/working/task_m030_65_stage2.md` | 내부 task 템플릿과 사용자 버그 제보 템플릿 역할 분리 검증 기록 | 내부 작업 산출물 |
| `mydocs/working/task_m030_65_stage3.md` | 통합 검증과 최종 보고 준비 결과 기록 | 내부 작업 산출물 |
| `mydocs/report/task_m030_65_report.md` | 최종 결과 보고서 작성 | 내부 작업 산출물 |

## 문서 위치 검증

| 파일 | 계획된 위치 | 실제 위치 | 결과 | 근거 |
|---|---|---|---|---|
| `.github/ISSUE_TEMPLATE/bug_report.yml` | `.github/ISSUE_TEMPLATE/bug_report.yml` | `.github/ISSUE_TEMPLATE/bug_report.yml` | OK | GitHub Issue 생성 UI가 읽는 플랫폼 템플릿이므로 `.github/ISSUE_TEMPLATE/`에 배치 |
| `mydocs/plans/task_m030_65.md` | `mydocs/plans/task_m030_65.md` | `mydocs/plans/task_m030_65.md` | OK | 수행계획서 산출물 |
| `mydocs/plans/task_m030_65_impl.md` | `mydocs/plans/task_m030_65_impl.md` | `mydocs/plans/task_m030_65_impl.md` | OK | 구현계획서 산출물 |
| `mydocs/working/task_m030_65_stage{N}.md` | `mydocs/working/` | `mydocs/working/task_m030_65_stage1.md`, `task_m030_65_stage2.md`, `task_m030_65_stage3.md` | OK | 단계별 완료 보고서 산출물 |
| `mydocs/report/task_m030_65_report.md` | `mydocs/report/task_m030_65_report.md` | `mydocs/report/task_m030_65_report.md` | OK | 최종 보고서 산출물 |

## 변경 전·후 정량 비교

| 지표 | 변경 전 | 변경 후 |
|---|---|---|
| 사용자 버그 제보용 Issue Form | 없음 | `.github/ISSUE_TEMPLATE/bug_report.yml` 122 lines |
| `.github/ISSUE_TEMPLATE/`의 Issue Form | 내부 작업용 `task.yml` 중심 | 내부 작업용 `task.yml` + 사용자 버그 제보용 `bug_report.yml` |
| 필수 사용자 제보 항목 | 구조화된 사용자 버그 제보 항목 없음 | 버그 내용, 재현 절차, 기대 결과, 실제 결과, 문제가 발생한 동작, 사용 환경 및 버전, 확인 체크박스 |
| 선택 사용자 제보 항목 | 구조화된 사용자 버그 제보 항목 없음 | 스크린샷 또는 녹화 자료, 추가 정보 |

## 검증 결과

| 수용 기준 | 결과 |
|---|---|
| GitHub Issue 생성 화면에서 사용자 버그 제보 템플릿을 선택할 수 있다. | OK — `.github/ISSUE_TEMPLATE/bug_report.yml`을 GitHub Issue Form 형식으로 추가했다. |
| 템플릿은 사용자에게 버그 제보 목적이 드러나는 `name`, `description`, `title`을 가진다. | OK — `name: Bug Report`, bug report description, `[Bug]` title prefix를 사용했다. |
| 입력 항목에는 버그 내용, 재현 절차, 기대 결과, 실제 결과, 사용 환경 및 버전, 스크린샷/녹화 자료가 포함된다. | OK — `summary`, `steps_to_reproduce`, `expected_result`, `actual_result`, `environment`, `screenshots` 항목을 추가했다. |
| 사용 환경에는 OS, 브라우저, crop 버전, 설치 경로 또는 빌드 출처를 남길 수 있다. | OK — `environment` placeholder에 OS, Browser, crop 버전, 설치 경로 또는 빌드 출처 예시를 포함했다. |
| placeholder에는 macOS, Chrome, 복사/다운로드 이미지 오른쪽 흰색 마진 사례가 예시로 포함된다. | OK — macOS, Chrome, 복사/다운로드 결과의 오른쪽 흰색 마진 예시를 포함했다. |
| 내부 Hyper-Waterfall 작업용 `task.yml`과 사용자 버그 제보용 `bug_report.yml`의 역할이 혼동되지 않는다. | OK — Stage 2에서 내부 절차 문구가 `bug_report.yml`에 없음을 확인했고, `task.yml`과 `config.yml`은 수정하지 않았다. |
| 실제 흰색 마진 버그 수정, 캡처 백엔드 변경, 오버레이 UI 변경, 새 label/milestone 생성은 수행하지 않는다. | OK — 이번 task는 Issue Form 추가와 검증만 수행했다. 흰색 마진 버그 수정, 캡처 백엔드 변경, 오버레이 UI 변경, 새 label, 새 milestone 생성은 제외했다. |

### 단계별 검증 결과

- Stage 1: [`task_m030_65_stage1.md`](../working/task_m030_65_stage1.md) — `bug_report.yml` YAML 파싱, 필수 문구/placeholder grep, `git diff --check` 통과.
- Stage 2: [`task_m030_65_stage2.md`](../working/task_m030_65_stage2.md) — `task.yml`, `bug_report.yml`, `config.yml` YAML 파싱, 내부 절차 문구 부재, 사용자-facing 핵심 문구 확인.
- Stage 3: [`task_m030_65_stage3.md`](../working/task_m030_65_stage3.md) — 최종 수용 기준 grep, 제외 범위 기록, `git diff --check` 통과.

## 잔여 위험과 후속 작업

### 잔여 위험

- GitHub 웹 UI에서 실제 Issue Form 렌더링은 직접 확인하지 않았다. 로컬에서는 YAML 파싱과 구조 검토로 형식 오류를 확인했다.
- `labels: bug` 자동 적용은 기존 GitHub label에 의존한다. 해당 label은 task-register 단계에서 기존 label로 확인했다.

### 후속 작업 후보

- 사용자 제보의 실제 복사/다운로드 이미지 오른쪽 흰색 마진 버그 수정은 별도 이슈로 등록해 재현, 원인 분석, 수정, 회귀 검증을 진행한다.

## 작업지시자 승인 요청

- 최종 보고서와 수용 기준 검증 결과를 승인하면 PR 게시 절차로 진행한다.
