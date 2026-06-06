# Task #46 Stage 1 보고서 - 현행 release/CI 경계와 요구사항 조사

GitHub Issue: [#46](https://github.com/postmelee/crop/issues/46)
구현계획서: [`task_m030_46_impl.md`](../plans/task_m030_46_impl.md)
Stage: 1

## 단계 목적

현재 저장소의 release/CI/package 상태와 #37 Chrome Web Store Dashboard 산출물을 대조하고, GitHub Actions 공식 문서와 action README 기준으로 Stage 2~3에서 구현할 package script, PR CI, release runbook의 경계를 확정한다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `mydocs/tech/task_m030_46_release_pipeline_ci.md` | 현행 `.github/`, `package.json`, #37 산출물, 공식 GitHub Actions 문서 확인 결과와 Stage 2~3 구현 결정을 기록 |
| `mydocs/working/task_m030_46_stage1.md` | Stage 1 목적, 검증, 잔여 위험, 다음 단계 승인 요청 기록 |
| `mydocs/orders/20260607.md` | #46 상태를 Stage 1 완료 후 Stage 2 승인 대기로 갱신 |

## 본문 변경 정도 / 본문 무손실 여부

신규 조사 문서와 단계 보고서를 추가했다. 기존 매뉴얼, #37 이력 문서, package scripts는 변경하지 않았다. 오늘할일은 #46 한 행의 비고만 현재 단계에 맞게 갱신한다.

## 검증 결과

실행 명령:

```bash
rg --files .github mydocs/manual mydocs/tech mydocs/report package.json
find .github -maxdepth 3 -type f -print
rg -n "release|main|tag|Chrome Web Store|package|zip|CI|workflow|artifact|privacy" mydocs/manual mydocs/tech mydocs/report package.json .github
rg -n "workflow_dispatch|pull_request|actions/checkout|actions/setup-node|actions/upload-artifact|package:cws|verify:cws|PRIVACY.md|Chrome Web Store" mydocs/tech/task_m030_46_release_pipeline_ci.md
find . -maxdepth 1 -type d -name scripts -print
git diff --check
```

결과:

- OK: `.github`에는 `pull_request_template.md`, `ISSUE_TEMPLATE/task.yml`만 있고 `.github/workflows/`는 아직 없다.
- OK: repository root에는 `scripts/` directory가 아직 없음을 확인했다.
- OK: 구현계획서의 `rg --files ... scripts ...` 확인 의도는 유지하되, `rg`가 없는 경로를 실패로 처리하므로 `scripts/` 부재 확인은 `find . -maxdepth 1 -type d -name scripts -print`로 분리했다.
- OK: `package.json`의 현재 scripts는 `build`, `test`, `typecheck`뿐이다.
- OK: #37 산출물의 `main` 기준 `PRIVACY.md` URL, Store ZIP dotfile 제외 기준, `Submit for review` 보류 기준을 #46 기술 노트에 반영했다.
- OK: GitHub Actions 공식 문서와 공식 action README 확인일 및 URL을 기술 노트에 기록했다.
- OK: `git diff --check` 통과.

## 잔여 위험

- 실제 GitHub Actions run은 Stage 3에서 workflow를 추가하고 PR을 만든 뒤 원격에서만 확인할 수 있다.
- Stage 1은 조사 단계라 Store ZIP 생성/검증 script와 CI workflow를 아직 추가하지 않았다.
- `actions/checkout`, `actions/setup-node`, `actions/upload-artifact` major version은 Stage 3 구현 직전에 다시 확인해야 한다.

## 다음 단계 영향

- Stage 2에서는 `scripts/package-cws.mjs`, `scripts/verify-cws-zip.mjs`, `package:cws`, `verify:cws`를 추가한다.
- Stage 2 검증은 `/tmp/crop-0.1.0-cws.zip` fresh 생성, `unzip -l`, `unzip -Z1`, manifest/권한/금지 entry 검증을 포함한다.
- Stage 3 PR CI는 Stage 2에서 만든 package scripts를 그대로 호출해야 한다.

## 승인 요청

- Stage 1 산출물과 검증 결과를 승인하면 Stage 2 package artifact 생성/검증 표준화로 진행한다.
