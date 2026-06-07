# Task #46 최종 보고서 - 릴리즈 파이프라인과 PR CI/제출 지침 표준화

GitHub Issue: [#46](https://github.com/postmelee/crop/issues/46)
마일스톤: M030

## 작업 요약

- 대상 이슈: #46
- 마일스톤: M030
- 단계 수: 4
- 작업 목적: 첫 `main` 릴리즈와 Chrome Web Store 제출 전에 반복 가능한 release pipeline, PR CI, Store package 검증, 제출 runbook을 표준화한다.

## 변경 파일 목록과 영향 범위

| 경로 | 변경 요약 | 영향 범위 |
|---|---|---|
| `.github/workflows/ci.yml` | PR CI workflow 추가 | GitHub Actions PR 검증 |
| `scripts/package-cws.mjs` | Chrome Web Store ZIP 생성 script 추가 | release/package artifact 생성 |
| `scripts/verify-cws-zip.mjs` | ZIP contents와 manifest permission 검증 script 추가 | release/package artifact 검증 |
| `package.json` | `package:cws`, `verify:cws` scripts 추가 | 로컬/CI package 진입점 |
| `mydocs/manual/release_pipeline_guide.md` | release PR, tag/GitHub Release, Chrome Web Store 제출 runbook 추가 | 반복 운영 매뉴얼 |
| `mydocs/manual/README.md` | release pipeline guide entry 추가 | manual index |
| `mydocs/tech/task_m030_46_release_pipeline_ci.md` | 조사, 공식 문서 확인, Stage 2~4 판단과 검증 결과 기록 | task-specific 기술 노트 |
| `mydocs/plans/task_m030_46.md` | 수행계획서 작성 | 하이퍼-워터폴 계획 |
| `mydocs/plans/task_m030_46_impl.md` | 구현계획서 작성 | 단계/검증/커밋 계획 |
| `mydocs/working/task_m030_46_stage1.md` | 현행 release/CI 경계 조사 보고 | 단계 기록 |
| `mydocs/working/task_m030_46_stage2.md` | package artifact 생성/검증 보고 | 단계 기록 |
| `mydocs/working/task_m030_46_stage3.md` | PR CI와 release runbook 보고 | 단계 기록 |
| `mydocs/working/task_m030_46_stage4.md` | 통합 검증과 최종 보고 단계 기록 | 단계 기록 |
| `mydocs/report/task_m030_46_report.md` | 최종 보고서 작성 | PR 게시 전 승인 자료 |
| `mydocs/orders/20260607.md` | 오늘할일 #46 완료 처리 | 작업 보드 |

## 문서 위치 검증

| 파일 | 계획된 위치 | 실제 위치 | 결과 | 근거 |
|---|---|---|---|---|
| `mydocs/manual/release_pipeline_guide.md` | `mydocs/manual/` | `mydocs/manual/release_pipeline_guide.md` | OK | 반복 release/CI/Store 제출 runbook으로 수행계획서 판단과 일치 |
| `mydocs/tech/task_m030_46_release_pipeline_ci.md` | `mydocs/tech/` | `mydocs/tech/task_m030_46_release_pipeline_ci.md` | OK | task-specific 조사와 결정 근거 위치로 수행계획서 판단과 일치 |
| `.github/workflows/ci.yml` | `.github/workflows/` | `.github/workflows/ci.yml` | OK | GitHub Actions workflow 위치와 일치 |
| `scripts/package-cws.mjs` | `scripts/` | `scripts/package-cws.mjs` | OK | release 보조 script 위치와 일치 |
| `scripts/verify-cws-zip.mjs` | `scripts/` | `scripts/verify-cws-zip.mjs` | OK | release 보조 script 위치와 일치 |
| `mydocs/report/task_m030_46_report.md` | `mydocs/report/` | `mydocs/report/task_m030_46_report.md` | OK | 최종 보고서 표준 위치와 일치 |

## 변경 전·후 정량 비교

| 지표 | 변경 전 | 변경 후 |
|---|---|---|
| GitHub Actions workflow | 없음 | `.github/workflows/ci.yml` 1개 |
| package scripts | `build`, `test`, `typecheck` 3개 | `build`, `package:cws`, `test`, `typecheck`, `verify:cws` 5개 |
| package helper scripts | 없음 | `scripts/package-cws.mjs`, `scripts/verify-cws-zip.mjs` 2개 |
| Store ZIP 생성 방식 | #37 one-off Python command | `npm run package:cws` |
| Store ZIP 검증 방식 | manual `unzip` review 중심 | `npm run verify:cws` + `unzip` review |
| Stage 4 테스트 결과 | 해당 없음 | 17 files, 213 tests 통과 |
| Store ZIP contents | #37 기준 13 files | #46 기준 13 files, 436,898 bytes uncompressed |

## 검증 결과

| 수용 기준 | 결과 |
|---|---|
| release/main 반영 절차가 문서화된다 | OK — `release_pipeline_guide.md`에 task PR, `devel -> main` release PR, GitHub Release/tag 전 확인 작성 |
| package ZIP 검증 기준이 있다 | OK — `verify:cws`가 root `manifest.json`, forbidden entries, manifest permission boundary를 검증 |
| PR CI 실행 명령이 명확하다 | OK — `.github/workflows/ci.yml`이 `npm ci`, build/typecheck/test/package/verify를 실행 |
| Chrome Web Store 제출 전 runbook이 Dashboard 작업 순서와 연결된다 | OK — runbook이 #37 Dashboard guide를 참조하고 submit 중단 기준을 포함 |
| 첫 `main` 릴리즈와 Chrome Web Store 제출 전 순서가 분리된다 | OK — release PR, tag/GitHub Release, Dashboard draft, `Submit for review` 가능 조건을 분리 |
| 실제 Chrome Web Store 제출, Store asset 제작, 실제 `main` release PR, GitHub Release/tag는 수행하지 않는다 | OK — 이번 task에서 수행하지 않았고 문서에 명시 |
| PR #37의 privacy URL, package, submit blocker 판단과 충돌하지 않는다 | OK — `main`/tag 기준 `PRIVACY.md`, small promotional image, deferred publishing, submit 승인 blocker 유지 |

### 단계별 검증 결과

- Stage 1: [`task_m030_46_stage1.md`](../working/task_m030_46_stage1.md) — 현행 `.github/`, `package.json`, #37 산출물, GitHub Actions 공식 문서 대조와 `git diff --check` 통과.
- Stage 2: [`task_m030_46_stage2.md`](../working/task_m030_46_stage2.md) — `npm run build`, `npm run package:cws`, `npm run verify:cws`, `unzip`, script syntax, diff check 통과.
- Stage 3: [`task_m030_46_stage3.md`](../working/task_m030_46_stage3.md) — workflow/runbook/manual index grep과 diff check 통과.
- Stage 4: [`task_m030_46_stage4.md`](../working/task_m030_46_stage4.md) — build/typecheck/test/package/verify/unzip/grep/diff 통합 검증 통과.

## Stage 4 통합 검증 상세

| 검증 | 결과 |
|---|---|
| `npm run build` | OK — Vite build 통과 |
| `npm run typecheck` | OK — `tsc --noEmit` 통과 |
| `npm test` | OK — 17 files, 213 tests 통과 |
| `npm run package:cws` | OK — `/tmp/crop-0.1.0-cws.zip`, 13 files, 438,474 bytes 생성 |
| `npm run verify:cws` | OK — required entries와 permission boundary 통과 |
| `unzip -l /tmp/crop-0.1.0-cws.zip` | OK — 13 files, uncompressed total 436,898 bytes |
| `unzip -Z1 /tmp/crop-0.1.0-cws.zip` | OK — `.DS_Store`, `__MACOSX`, `node_modules`, `mydocs`, repository root 문서/config 없음 |
| workflow/package grep | OK — CI와 package scripts 명령 일치 |
| runbook/report grep | OK — `devel -> main`, GitHub Release/tag, Chrome Web Store, `Submit for review`, `PRIVACY.md`, package 검증 기준 확인 |
| `git diff --check` | OK — whitespace 경고 없음 |

## 잔여 위험과 후속 작업

### 잔여 위험

- GitHub Actions 원격 CI는 PR 생성 후에만 실제 run으로 확인할 수 있다.
- 실제 `devel -> main` release PR, GitHub Release/tag, Chrome Web Store upload/review submit은 수행하지 않았다.
- Chrome Web Store 제출 전에는 `main` 또는 release tag 기준 `PRIVACY.md` URL을 다시 확인해야 한다.
- global small promotional image 440x280, deferred publishing 선택, 제출 직전 smoke, 작업지시자 submit 승인이 계속 blocker다.
- release artifact upload를 GitHub Actions artifact로 보관하는 workflow는 이번 baseline에서 제외했다.

### 후속 작업 후보

- Stage 4 승인 후 `publish/task46` push와 `devel` 대상 PR 생성.
- PR 생성 후 GitHub Actions 원격 CI 확인.
- #46 PR merge 후 `devel -> main` release PR, tag/GitHub Release, Chrome Web Store Dashboard 제출 절차 진행.
- 필요 시 `packageManager` 또는 `engines` 고정을 별도 task로 검토.

## 작업지시자 승인 요청

- 최종 보고서와 수용 기준 검증 결과를 승인하면 PR 게시 절차로 진행한다.
