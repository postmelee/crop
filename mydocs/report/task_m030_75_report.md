# Task #75 최종 보고서 - Privacy Policy 적용 버전과 업데이트일 갱신

GitHub Issue: [#75](https://github.com/postmelee/crop/issues/75)
마일스톤: M030

## 작업 요약

- 대상 이슈: #75
- 마일스톤: M030
- 단계 수: 3
- 작업 목적: Chrome Web Store Privacy URL로 사용하는 `main/PRIVACY.md`가 `v0.1.1` release 기준을 명확히 나타내도록 privacy policy 날짜와 적용 버전 문구를 갱신하고, 이후 release마다 같은 확인을 반복하도록 release runbook에 규칙을 추가한다.

## 변경 파일 목록과 영향 범위

| 경로 | 변경 요약 | 영향 범위 |
|---|---|---|
| `PRIVACY.md` | 4개 언어 섹션의 Last updated를 2026-06-14 기준으로 갱신하고 `crop` v0.1.1 및 이후 버전 적용 문구 추가 | Chrome Web Store Privacy URL, 사용자-facing privacy policy |
| `mydocs/manual/release_pipeline_guide.md` | Chrome Web Store Privacy URL 기본값을 `main/PRIVACY.md`로 명시하고 tag URL 역할, release마다 Last updated/적용 버전 확인 규칙 추가 | release 운영 매뉴얼 |
| `mydocs/orders/20260614.md` | #75 진행 상태와 최종 보고/PR 게시 승인 대기 상태 기록 | 내부 작업 보드 |
| `mydocs/plans/task_m030_75.md` | 수행계획서 작성 | 내부 작업 산출물 |
| `mydocs/plans/task_m030_75_impl.md` | 3단계 구현계획서 작성 | 내부 작업 산출물 |
| `mydocs/working/task_m030_75_stage1.md` | Privacy 문서 날짜/적용 버전 갱신 결과 기록 | 내부 작업 산출물 |
| `mydocs/working/task_m030_75_stage2.md` | release Privacy URL 운영 규칙 추가 결과 기록 | 내부 작업 산출물 |
| `mydocs/working/task_m030_75_stage3.md` | 통합 검증과 최종 보고 결과 기록 | 내부 작업 산출물 |
| `mydocs/report/task_m030_75_report.md` | 최종 결과 보고서 작성 | 내부 작업 산출물 |

## 문서 위치 검증

| 파일 | 계획된 위치 | 실제 위치 | 결과 | 근거 |
|---|---|---|---|---|
| `PRIVACY.md` | 저장소 루트 `PRIVACY.md` | `PRIVACY.md` | OK | 수행계획서에서 Chrome Web Store Privacy URL이 가리키는 공식 privacy policy로 선택 |
| `mydocs/manual/release_pipeline_guide.md` | `mydocs/manual/` | `mydocs/manual/release_pipeline_guide.md` | OK | 수행계획서에서 반복 release 절차의 운영 매뉴얼로 선택 |
| `mydocs/plans/task_m030_75.md` | `mydocs/plans/` | `mydocs/plans/task_m030_75.md` | OK | 수행계획서 산출물 |
| `mydocs/plans/task_m030_75_impl.md` | `mydocs/plans/` | `mydocs/plans/task_m030_75_impl.md` | OK | 구현계획서 산출물 |
| `mydocs/working/task_m030_75_stage{N}.md` | `mydocs/working/` | `task_m030_75_stage1.md`~`task_m030_75_stage3.md` | OK | 단계별 완료보고서 산출물 |
| `mydocs/report/task_m030_75_report.md` | `mydocs/report/` | `mydocs/report/task_m030_75_report.md` | OK | 최종 보고서 산출물 |

## 변경 전·후 정량 비교

| 지표 | 변경 전 | 변경 후 |
|---|---|---|
| `PRIVACY.md` 2026-06-14 날짜 표기 | 0개 | 4개 언어 섹션 |
| `PRIVACY.md` `v0.1.1` 적용 문구 | 0개 | 4개 언어 섹션 |
| Chrome Web Store Privacy URL 기본값 문서화 | `main` 또는 release tag 기준 stable URL | `main/PRIVACY.md` 기본값, tag URL은 별도 승인 예외 |
| package/version/source 변경 | 해당 없음 | 변경 없음 |
| Chrome Web Store 제출 작업 | 해당 없음 | 수행하지 않음 |
| release asset/tag 변경 | 해당 없음 | 수행하지 않음 |

## 검증 결과

| 수용 기준 | 결과 |
|---|---|
| Store Dashboard Privacy URL 기본값은 `https://github.com/postmelee/crop/blob/main/PRIVACY.md`로 유지한다. | OK — release runbook에 Chrome Web Store Privacy URL 기본값으로 `main/PRIVACY.md`를 명시했다. |
| `PRIVACY.md` 4개 언어 섹션의 업데이트 날짜가 2026-06-14 기준으로 맞춰진다. | OK — English, Korean, Japanese, Chinese 섹션에서 `June 14, 2026`, `2026년 6월 14일`, `2026年6月14日`을 확인했다. |
| `PRIVACY.md` 4개 언어 섹션에 `v0.1.1 and later` 의미의 적용 버전 문구가 추가된다. | OK — 4개 언어 섹션에서 `v0.1.1` 적용 문구를 확인했다. |
| privacy/data handling 의미는 기존과 동일하게 유지한다. | OK — no server upload, no telemetry/analytics, no `debugger`/`<all_urls>`/`host_permissions`, 권한 설명을 유지했다. |
| release마다 `PRIVACY.md`의 Last updated와 적용 버전 문구를 확인하도록 안내한다. | OK — `release_pipeline_guide.md`에 Last updated와 적용 version 확인 규칙을 추가했다. |
| GitHub Release/tag, release asset, `/tmp/crop-0.1.1-cws.zip`, `manifest.json`, `package.json`은 변경하지 않는다. | OK — 이번 task는 문서와 작업 산출물만 변경했다. release asset, tag, package/version 파일은 변경하지 않았다. |
| Chrome Web Store package upload와 `Submit for review`는 수행하지 않는다. | OK — Dashboard upload와 `Submit for review`는 수행하지 않았다. |

### 단계별 검증 결과

- Stage 1: [`task_m030_75_stage1.md`](../working/task_m030_75_stage1.md) — `PRIVACY.md` 4개 언어 섹션의 date/version 문구 갱신, privacy/permission 핵심 문구 유지, `git diff --check` 통과.
- Stage 2: [`task_m030_75_stage2.md`](../working/task_m030_75_stage2.md) — `release_pipeline_guide.md`에 `main/PRIVACY.md` 기본 Privacy URL, tag URL 역할, Last updated/적용 버전 확인 규칙 추가, `git diff --check` 통과.
- Stage 3: [`task_m030_75_stage3.md`](../working/task_m030_75_stage3.md) — `PRIVACY.md`와 release runbook 통합 grep, Chrome Web Store 제출 제외 범위, release asset/tag 불변 범위 확인.

## 잔여 위험과 후속 작업

### 잔여 위험

- 다국어 privacy policy 문구의 법무적 정밀성은 별도 전문 검토를 거치지 않았다. 이번 변경은 Last updated와 적용 버전 명시에 한정했고 privacy/data handling 의미는 변경하지 않았다.
- 기존 #37 Dashboard 기술 노트에는 release tag URL 후보 문구가 일부 남아 있다. 이번 task의 진실 원천은 반복 release 매뉴얼인 `release_pipeline_guide.md`로 정리했다.
- Task #75 커밋은 아직 `origin/devel`에 merge되지 않았다. 최종 보고서 승인 후 `publish/task75` 브랜치와 `devel` 대상 PR 게시 절차가 필요하다.

### 후속 작업 후보

- 최종 보고서 승인 후 `task-final-report` 절차로 `publish/task75` 브랜치 push와 `devel` 대상 PR 게시.
- Task #75 PR merge 후 필요하면 작업지시자가 Chrome Web Store Dashboard에서 `/tmp/crop-0.1.1-cws.zip` upload와 `Submit for review`를 직접 수행.
- 다음 release마다 `release_pipeline_guide.md` 기준으로 `PRIVACY.md`의 Last updated와 적용 버전 문구를 갱신.

## 작업지시자 승인 요청

- 최종 보고서와 수용 기준 검증 결과를 승인하면 Task #75 PR 게시 절차로 진행한다.
- Chrome Web Store Dashboard upload와 `Submit for review`는 이 승인과 별개로 작업지시자가 직접 수행한다.
