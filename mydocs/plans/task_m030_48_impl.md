# Task #48 구현계획서 - 첫 main 릴리즈와 Chrome Web Store 제출본 동기화

수행계획서: [`task_m030_48.md`](task_m030_48.md)
GitHub Issue: [#48](https://github.com/postmelee/crop/issues/48)
마일스톤: M030

## 단계 개요

| Stage | 제목 | 주요 산출 | 검증 |
|---|---|---|---|
| 1 | 첫 main 기준과 release 경로 확정 | `task_m030_48_stage1.md`, 원격 branch/tag/release 상태 기록 | `devel`, PR #47, 원격 `main`, Release 현황 확인 |
| 2 | release 기준 package 재생성과 검증 | `task_m030_48_stage2.md`, `/tmp/crop-0.1.0-cws.zip`, checksum | build/typecheck/test/package/verify, ZIP contents, checksum |
| 3 | GitHub Release asset과 privacy URL 동기화 | `task_m030_48_stage3.md`, tag/Release/asset 확인 기록 | tag/Release/asset, `PRIVACY.md` URL, checksum 대조 |
| 4 | 제출 전 최종 보고와 승인 대기 | `task_m030_48_report.md`, 오늘할일 완료 후보 | 최종 grep, status/diff, submit 미수행 명시 |

## 문서 위치 확인

수행계획서의 "문서 위치 판단"과 실제 Stage 산출물 경로는 다음과 같이 일치시킨다. 이번 task는 release 실행과 제출 증빙 기록이므로 공식 사용자 문서 루트를 새로 만들지 않는다.

| 파일 | 수행계획서상 선택 위치 | Stage 산출물 경로 | 일치 여부 | 비고 |
|---|---|---|---|---|
| `mydocs/working/task_m030_48_stage1.md` | `mydocs/working/` | `mydocs/working/task_m030_48_stage1.md` | OK | 첫 `main` bootstrap 판단 기록 |
| `mydocs/working/task_m030_48_stage2.md` | `mydocs/working/` | `mydocs/working/task_m030_48_stage2.md` | OK | package 검증과 checksum 기록 |
| `mydocs/working/task_m030_48_stage3.md` | `mydocs/working/` | `mydocs/working/task_m030_48_stage3.md` | OK | GitHub Release asset과 URL 확인 기록 |
| `mydocs/report/task_m030_48_report.md` | `mydocs/report/` | `mydocs/report/task_m030_48_report.md` | OK | Dashboard 제출 직전 최종 근거 |
| `mydocs/plans/task_m030_48_impl.md` | `mydocs/plans/` | `mydocs/plans/task_m030_48_impl.md` | OK | 구현계획서 |
| `mydocs/orders/20260607.md` | `mydocs/orders/` | `mydocs/orders/20260607.md` | OK | 진행 상태 보드 |

## 수용 기준 고정

- 원격 `main`이 없다는 현재 상태를 Stage 1에서 확인하고 첫 release bootstrap 방법을 확정한다.
- `main` 또는 release tag 기준 `PRIVACY.md` URL이 접근 가능한 제출 후보로 확인된다.
- release 기준에서 `/tmp/crop-0.1.0-cws.zip`이 fresh 생성되고 `npm run verify:cws`를 통과한다.
- ZIP root에 `manifest.json`이 있고 repository root 문서/config, `mydocs`, `node_modules`, `.DS_Store`, `__MACOSX`가 없다.
- manifest 권한이 `activeTab`, `scripting`, `clipboardWrite`, `downloads` 범위를 유지한다.
- GitHub Release asset과 Dashboard upload 후보 파일이 checksum으로 같은 파일임을 확인한다.
- Chrome Web Store `Submit for review`는 이번 task에서 수행하지 않는다.

## Stage 1 — 첫 main 기준과 release 경로 확정

### 산출물

신규:

- `mydocs/working/task_m030_48_stage1.md`

수정:

- 필요 시 `mydocs/orders/20260607.md`

### 변경 내용

- 현재 local branch와 working tree clean 여부를 확인한다.
- `origin/devel`, 원격 `main`, default branch, PR #47 merge 상태, tag/Release 현황을 확인한다.
- `main`이 없는 첫 release bootstrap 예외를 기록한다.
- 실행 후보를 다음 기준으로 비교한다.
  - 원격 `main` 브랜치를 `origin/devel`의 PR #47 merge commit에서 최초 생성
  - 이후 release에는 #46 runbook의 `devel -> main` PR 경로 사용
  - tag는 `manifest.json` version `0.1.0` 기준 `v0.1.0` 후보 사용
- Stage 1 완료 시점에는 원격 `main`, tag, GitHub Release 생성 같은 쓰기 작업을 수행하지 않고, 작업지시자에게 bootstrap 실행 승인을 요청한다.

### 검증

```bash
git status --short --branch
git branch -vv --all
git ls-remote --heads origin main devel
gh api repos/postmelee/crop --jq '.default_branch, .html_url'
gh pr view 47 --repo postmelee/crop --json number,title,state,baseRefName,headRefName,mergeCommit,url,statusCheckRollup
gh release list --repo postmelee/crop --limit 10
git show --no-patch --oneline origin/devel
git diff --check
```

### 커밋

```text
Task #48 Stage 1: 첫 main release 기준 확정
```

## Stage 2 — release 기준 package 재생성과 검증

### 산출물

신규:

- `mydocs/working/task_m030_48_stage2.md`

수정:

- 필요 시 `mydocs/orders/20260607.md`

외부 산출물:

- `/tmp/crop-0.1.0-cws.zip`

### 변경 내용

- 승인된 release 기준 checkout에서 package 검증을 수행한다.
- 원격 `main`이 Stage 1 승인 후 생성됐다면 `main` 기준으로 checkout/fetch 후 진행한다.
- `npm run build`, `npm run typecheck`, `npm test`, `npm run package:cws`, `npm run verify:cws`를 실행한다.
- ZIP contents를 `unzip -l`, `unzip -Z1`로 확인한다.
- `manifest.json` version과 permissions를 확인한다.
- `/tmp/crop-0.1.0-cws.zip`의 checksum과 파일 크기를 기록한다.

### 검증

```bash
git status --short --branch
npm run build
npm run typecheck
npm test
npm run package:cws
npm run verify:cws
unzip -l /tmp/crop-0.1.0-cws.zip
unzip -Z1 /tmp/crop-0.1.0-cws.zip
shasum -a 256 /tmp/crop-0.1.0-cws.zip
wc -c /tmp/crop-0.1.0-cws.zip
node -e 'const m=require("./dist/manifest.json"); console.log(JSON.stringify({version:m.version,permissions:m.permissions,host_permissions:m.host_permissions ?? []}))'
git diff --check
```

### 커밋

```text
Task #48 Stage 2: release package 재생성과 검증
```

## Stage 3 — GitHub Release asset과 privacy URL 동기화

### 산출물

신규:

- `mydocs/working/task_m030_48_stage3.md`

수정:

- 필요 시 `mydocs/orders/20260607.md`

GitHub 산출물:

- `main` branch
- `v0.1.0` tag 후보
- `v0.1.0` GitHub Release 후보
- Release asset `crop-0.1.0-cws.zip`

### 변경 내용

- Stage 2에서 검증한 ZIP과 checksum을 기준으로 GitHub Release asset 업로드를 수행한다.
- 아직 원격 `main`이 없으면 Stage 1 승인 내용에 따라 첫 `main` 브랜치를 생성한다.
- tag는 `v0.1.0` 후보를 사용하되, 기존 tag 또는 Release가 있으면 덮어쓰지 않고 작업지시자에게 재확인한다.
- GitHub Release에 `crop-0.1.0-cws.zip` asset을 업로드한다.
- `https://github.com/postmelee/crop/blob/main/PRIVACY.md`와 `https://github.com/postmelee/crop/blob/v0.1.0/PRIVACY.md` 중 실제 제출 후보 URL을 확인한다.
- Release asset checksum과 Stage 2 local ZIP checksum을 대조한다.

### 검증

```bash
git ls-remote --heads origin main devel
git ls-remote --tags origin v0.1.0
git tag --list 'v0.1.0'
gh release view v0.1.0 --repo postmelee/crop --json tagName,name,isDraft,isPrerelease,url,assets
gh release download v0.1.0 --repo postmelee/crop --pattern 'crop-0.1.0-cws.zip' --dir /tmp/crop-release-check
shasum -a 256 /tmp/crop-0.1.0-cws.zip /tmp/crop-release-check/crop-0.1.0-cws.zip
gh api repos/postmelee/crop/contents/PRIVACY.md?ref=main --jq '.html_url, .sha'
gh api repos/postmelee/crop/contents/PRIVACY.md?ref=v0.1.0 --jq '.html_url, .sha'
git diff --check
```

### 커밋

```text
Task #48 Stage 3: GitHub Release와 제출 URL 동기화
```

## Stage 4 — 제출 전 최종 보고와 승인 대기

### 산출물

신규:

- `mydocs/report/task_m030_48_report.md`

수정:

- `mydocs/orders/20260607.md`
- 필요 시 `mydocs/working/task_m030_48_stage3.md`

### 변경 내용

- Stage 1~3 결과를 최종 보고서로 정리한다.
- 최종 보고서에 다음 제출 근거를 적는다.
  - release 기준 commit
  - `main` URL과 tag URL 중 Dashboard privacy policy URL 후보
  - GitHub Release URL
  - Release asset 이름, 크기, SHA-256 checksum
  - Dashboard upload 후보 ZIP 경로
  - Chrome Web Store `Submit for review` 미수행 사실
  - 작업지시자가 Dashboard에서 직접 확인해야 할 항목
- 오늘할일을 완료 후보로 갱신한다.

### 검증

```bash
rg -n "Submit for review|PRIVACY.md|crop-0.1.0-cws.zip|v0.1.0|checksum|SHA-256|GitHub Release|Dashboard" mydocs/working/task_m030_48_stage*.md mydocs/report/task_m030_48_report.md
git diff --check
git status --short
```

### 커밋

```text
Task #48 Stage 4: 제출 전 최종 보고
```

## 승인 지점

- Stage 1 완료 후 첫 `main` bootstrap과 tag/Release 실행 방향을 작업지시자에게 승인받는다.
- Stage 2 완료 후 package checksum을 승인받는다.
- Stage 3 완료 후 GitHub Release asset과 privacy URL 동기화 결과를 승인받는다.
- Stage 4 완료 후 Chrome Web Store Dashboard 제출 직전 상태를 보고하고, `Submit for review`는 별도 명시 승인 없이는 수행하지 않는다.

## 최종 보고와 PR 준비

Stage 4 완료와 승인 후 `task-final-report` 절차로 진행한다.

예상 산출물:

- `mydocs/report/task_m030_48_report.md`
- `mydocs/orders/20260607.md`
- `publish/task48` 원격 브랜치
- `devel` 대상 PR

예상 검증:

```bash
git status --short --branch
git diff --check
rg -n "Submit for review|PRIVACY.md|crop-0.1.0-cws.zip|v0.1.0|checksum|GitHub Release" mydocs/working mydocs/report
```

## 검증

- 각 Stage 검증 명령은 단계 보고서 작성 전에 실행한다.
- 실패한 검증은 단계 완료로 처리하지 않는다.
- 구현 중 파일 위치나 범위가 이 계획과 달라지면 구현계획서를 갱신하고 작업지시자 승인을 다시 받는다.
- `main`, tag, GitHub Release, Release asset 생성은 GitHub 원격 상태를 변경하므로 각 승인 지점에서만 수행한다.
- Chrome Web Store Dashboard의 `Submit for review` 버튼 클릭은 이번 task 범위에서 제외한다.

## 커밋

- 구현계획서 자체는 `Task #48: 구현계획서 작성과 오늘할일 갱신` 커밋으로 별도 기록한다.
- 단계 커밋은 단계 산출물과 `mydocs/working/task_m030_48_stage{N}.md`를 함께 묶는다.
- 커밋 메시지는 `Task #48 Stage {N}: {핵심 내용 요약}` 형식을 따른다.
- 최종 보고와 PR 게시 커밋은 `task-final-report` 절차의 커밋 규칙을 따른다.
