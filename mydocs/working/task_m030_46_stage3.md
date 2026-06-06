# Task #46 Stage 3 보고서 - PR CI와 release runbook 작성

GitHub Issue: [#46](https://github.com/postmelee/crop/issues/46)
구현계획서: [`task_m030_46_impl.md`](../plans/task_m030_46_impl.md)
Stage: 3

## 단계 목적

Stage 2에서 표준화한 package artifact 생성/검증 명령을 PR CI에 연결하고, `devel -> main` release PR, GitHub Release/tag, Chrome Web Store Dashboard 제출 전 확인 절차를 반복 가능한 runbook으로 고정한다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `.github/workflows/ci.yml` | PR 대상 `devel`/`main`과 `workflow_dispatch`에서 build/typecheck/test/package/verify를 실행하는 GitHub Actions workflow 추가 |
| `mydocs/manual/release_pipeline_guide.md` | task PR, release PR, PR CI, package 재생성/검증, Store submit 중단 기준, rollback 기준 작성 |
| `mydocs/manual/README.md` | `release_pipeline_guide.md` runbook entry 추가 |
| `mydocs/tech/task_m030_46_release_pipeline_ci.md` | Stage 3 구현 결과, 공식 action README 재확인, artifact upload 제외 판단 기록 |
| `mydocs/working/task_m030_46_stage3.md` | Stage 3 검증 결과와 다음 단계 영향 기록 |
| `mydocs/orders/20260607.md` | #46 상태를 Stage 3 완료 후 Stage 4 승인 대기로 갱신 |

## 본문 변경 정도 / 본문 무손실 여부

신규 workflow와 신규 manual runbook을 추가했다. PR template은 기존에 `CI/원격 검증` 표가 있어 수정하지 않았다. Chrome extension runtime 코드와 Store Dashboard #37 이력 문서는 변경하지 않았다.

## 검증 결과

실행 명령:

```bash
rg -n "npm ci|npm run build|npm run typecheck|npm test|npm run package:cws|npm run verify:cws|pull_request|workflow_dispatch|devel|main" .github/workflows/ci.yml
rg -n "devel -> main|GitHub Release|tag|Chrome Web Store|Submit for review|PRIVACY.md|package:cws|verify:cws|deferred|small promotional" mydocs/manual/release_pipeline_guide.md mydocs/tech/task_m030_46_release_pipeline_ci.md
rg -n "release_pipeline_guide.md" mydocs/manual/README.md
git diff --check
```

결과:

- OK: workflow trigger는 `pull_request` 대상 `devel`, `main`과 `workflow_dispatch`를 포함한다.
- OK: workflow는 `npm ci`, `npm run build`, `npm run typecheck`, `npm test`, `npm run package:cws`, `npm run verify:cws`를 실행한다.
- OK: release runbook은 `devel -> main`, GitHub Release/tag, Chrome Web Store, `Submit for review`, `PRIVACY.md`, `package:cws`, `verify:cws`, `deferred publishing`, `small promotional image` 기준을 포함한다.
- OK: `mydocs/manual/README.md`에 `release_pipeline_guide.md` entry가 있다.
- OK: `git diff --check` 통과.

## 잔여 위험

- GitHub Actions workflow의 실제 원격 실행은 #46 PR 생성 이후 확인할 수 있다.
- `workflow_dispatch`는 workflow file이 default branch에 반영된 뒤 수동 실행 event를 받는다.
- Store 제출용 ZIP을 GitHub Actions artifact로 upload하는 release workflow는 이번 baseline에서 제외했다.

## 다음 단계 영향

- Stage 4에서는 build/typecheck/test/package/verify를 통합 재실행한다.
- Stage 4에서는 CI workflow, package scripts, release runbook, #37 Dashboard guide의 값이 충돌하지 않는지 대조한다.
- 최종 보고서에는 실제 release PR, GitHub Release/tag, Chrome Web Store upload/review submit을 수행하지 않았음을 명시한다.

## 승인 요청

- Stage 3 산출물과 검증 결과를 승인하면 Stage 4 통합 검증과 최종 보고로 진행한다.
