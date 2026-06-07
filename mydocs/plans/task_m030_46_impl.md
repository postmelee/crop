# Task #46 구현계획서 - 릴리즈 파이프라인과 PR CI/제출 지침 표준화

수행계획서: [`task_m030_46.md`](task_m030_46.md)
GitHub Issue: [#46](https://github.com/postmelee/crop/issues/46)
마일스톤: M030

## 단계 개요

| Stage | 제목 | 주요 산출 | 검증 |
|---|---|---|---|
| 1 | 현행 release/CI 경계와 요구사항 조사 | `mydocs/tech/task_m030_46_release_pipeline_ci.md` 초안 | 현행 문서/스크립트/공식 문서 대조, package/CI 결정 기록 |
| 2 | package artifact 생성/검증 표준화 | `scripts/package-cws.mjs`, `scripts/verify-cws-zip.mjs`, `package.json` scripts | build 후 ZIP 생성/검증 dry-run, dotfile/문서/개발 파일 제외 확인 |
| 3 | PR CI와 release runbook 작성 | `.github/workflows/ci.yml`, `mydocs/manual/release_pipeline_guide.md` | workflow 구조, CI 명령, release/store runbook grep |
| 4 | 통합 검증과 최종 보고 | Stage 4 보고서, 최종 보고서, 오늘할일 완료 후보 | build/typecheck/test/package verify, workflow/runbook/package grep, status/diff |

## 문서 위치 확인

수행계획서의 "문서 위치 판단"과 실제 Stage 산출물 경로는 다음과 같이 일치시킨다. 반복 운영 지침은 `mydocs/manual/`에 두고, #46의 조사와 판단 근거는 `mydocs/tech/`에 둔다.

| 파일 | 수행계획서상 선택 위치 | Stage 산출물 경로 | 일치 여부 | 비고 |
|---|---|---|---|---|
| `mydocs/manual/release_pipeline_guide.md` | `mydocs/manual/` | `mydocs/manual/release_pipeline_guide.md` | OK | 반복 release/CI/Store 제출 runbook |
| `mydocs/tech/task_m030_46_release_pipeline_ci.md` | `mydocs/tech/` | `mydocs/tech/task_m030_46_release_pipeline_ci.md` | OK | 조사, 대안 비교, 결정 근거 |
| `.github/workflows/ci.yml` | `.github/workflows/` | `.github/workflows/ci.yml` | OK | GitHub Actions PR CI |
| `scripts/package-cws.mjs` | `scripts/` | `scripts/package-cws.mjs` | OK | Chrome Web Store ZIP 생성 스크립트 |
| `scripts/verify-cws-zip.mjs` | `scripts/` | `scripts/verify-cws-zip.mjs` | OK | Chrome Web Store ZIP contents 검증 스크립트 |
| `package.json` | 저장소 루트 기존 위치 | `package.json` | OK | CI와 로컬 release command 진입점 |
| `mydocs/plans/task_m030_46_impl.md` | `mydocs/plans/` | `mydocs/plans/task_m030_46_impl.md` | OK | 구현계획서 |
| `mydocs/working/task_m030_46_stage{N}.md` | `mydocs/working/` | `mydocs/working/task_m030_46_stage{N}.md` | OK | 단계 보고서 |
| `mydocs/report/task_m030_46_report.md` | `mydocs/report/` | `mydocs/report/task_m030_46_report.md` | OK | 최종 보고서 |

## 수용 기준 고정

- release/main 반영 절차가 문서화된다.
- package ZIP에 `.DS_Store`, `__MACOSX`, repo 문서, `node_modules`가 들어가지 않는 검증 기준이 있다.
- PR CI가 어떤 명령을 실행해야 하는지 명확하다.
- Chrome Web Store 제출 전 runbook이 Dashboard 작업 순서와 연결된다.
- 첫 `main` 릴리즈와 Chrome Web Store 제출 전에 따라야 할 순서가 명확히 분리된다.
- 실제 Chrome Web Store 제출, Store asset 제작, 실제 `main` 릴리즈 PR, GitHub Release/tag는 수행하지 않는다.

## Stage 1 — 현행 release/CI 경계와 요구사항 조사

### 산출물

신규:

- `mydocs/tech/task_m030_46_release_pipeline_ci.md`
- `mydocs/working/task_m030_46_stage1.md`

수정:

- 필요 시 `mydocs/orders/20260607.md`

### 변경 내용

- 현재 `.github/`, `package.json`, #37 산출물, release 관련 manual을 대조한다.
- `.github/workflows/` 부재와 현재 package scripts를 기록한다.
- GitHub Actions workflow, checkout/setup-node, artifact upload/cache 정책의 primary source를 확인한다.
- package artifact 검증을 script로 둘지, package script만 둘지, CI workflow를 실제 추가할지 판단한다.
- `main` privacy URL, release tag, Store Dashboard submit timing이 #37 판단과 충돌하지 않는지 기술 노트에 기록한다.

### 검증

```bash
rg --files .github mydocs/manual mydocs/tech scripts package.json
rg -n "release|main|tag|Chrome Web Store|package|zip|CI|workflow|artifact|privacy" mydocs/manual mydocs/tech mydocs/report package.json .github
git diff --check
```

추가 확인:

- GitHub Actions 공식 문서 또는 action README 확인일과 URL을 `mydocs/tech/task_m030_46_release_pipeline_ci.md`에 기록한다.

### 커밋

```text
Task #46 Stage 1: release와 CI 요구사항 조사
```

## Stage 2 — package artifact 생성/검증 표준화

### 산출물

신규:

- `scripts/package-cws.mjs`
- `scripts/verify-cws-zip.mjs`
- `mydocs/working/task_m030_46_stage2.md`

수정:

- `package.json`
- `mydocs/tech/task_m030_46_release_pipeline_ci.md`

### 변경 내용

- `npm run build` 이후 `dist/`를 ZIP root로 삼아 `/tmp/crop-0.1.0-cws.zip`을 생성하는 Node script를 추가한다.
- ZIP 생성 스크립트는 `.DS_Store`, `__MACOSX` entry를 제외한다.
- ZIP 검증 스크립트는 다음 조건을 실패 기준으로 삼는다.
  - root `manifest.json` 없음
  - `.DS_Store`, `__MACOSX`, `node_modules/`, `mydocs/` 포함
  - README/PRIVACY/NOTICE/THIRD_PARTY/LICENSE/package/config 파일 포함
  - `debugger`, `<all_urls>`, broad `host_permissions`, `tabs` 같은 예상 밖 권한
- `package.json`에 반복 실행 가능한 scripts를 추가한다.
  - `package:cws`
  - `verify:cws`
  - 필요 시 `check`
- #37 기술 노트에 남은 one-off command와 새 script의 관계를 #46 기술 노트에 기록한다. #37 이력 문서는 직접 덮어쓰지 않는다.

### 검증

```bash
npm run build
npm run package:cws
npm run verify:cws
unzip -l /tmp/crop-0.1.0-cws.zip
unzip -Z1 /tmp/crop-0.1.0-cws.zip
rg -n "package:cws|verify:cws|scripts/package-cws.mjs|scripts/verify-cws-zip.mjs" package.json mydocs/tech/task_m030_46_release_pipeline_ci.md
git diff --check
```

### 커밋

```text
Task #46 Stage 2: Store package 생성과 검증 표준화
```

## Stage 3 — PR CI와 release runbook 작성

### 산출물

신규:

- `.github/workflows/ci.yml`
- `mydocs/manual/release_pipeline_guide.md`
- `mydocs/working/task_m030_46_stage3.md`

수정:

- `mydocs/manual/README.md`
- `mydocs/tech/task_m030_46_release_pipeline_ci.md`
- 필요 시 `.github/pull_request_template.md`

### 변경 내용

- GitHub Actions workflow를 추가한다.
  - PR 대상: `devel`
  - release PR 대상: `main`
  - 수동 실행: `workflow_dispatch`
  - 검증: `npm ci`, `npm run build`, `npm run typecheck`, `npm test`, `npm run package:cws`, `npm run verify:cws`
- release pipeline guide를 작성한다.
  - task PR과 release PR 구분
  - PR CI 통과 기준
  - `devel -> main` release PR 전 확인
  - GitHub Release/tag 생성 전 확인
  - Chrome Web Store Dashboard draft 가능/submit 금지/submit 가능 시점
  - `main` privacy URL과 release/tag artifact 확인
  - package artifact 재생성/검증 절차
  - rollback 또는 제출 중단 기준
- `mydocs/manual/README.md`에 새 runbook entry를 추가한다.
- PR template 수정이 필요하면 CI/remote 검증 표기만 최소 보정한다.

### 검증

```bash
rg -n "npm ci|npm run build|npm run typecheck|npm test|npm run package:cws|npm run verify:cws|pull_request|workflow_dispatch|devel|main" .github/workflows/ci.yml
rg -n "devel -> main|GitHub Release|tag|Chrome Web Store|Submit for review|PRIVACY.md|package:cws|verify:cws|deferred|small promotional" mydocs/manual/release_pipeline_guide.md mydocs/tech/task_m030_46_release_pipeline_ci.md
rg -n "release_pipeline_guide.md" mydocs/manual/README.md
git diff --check
```

### 커밋

```text
Task #46 Stage 3: PR CI와 release runbook 작성
```

## Stage 4 — 통합 검증과 최종 보고

### 산출물

신규:

- `mydocs/working/task_m030_46_stage4.md`
- `mydocs/report/task_m030_46_report.md`

수정:

- `mydocs/orders/20260607.md`
- 필요 시 `mydocs/tech/task_m030_46_release_pipeline_ci.md`
- 필요 시 `mydocs/manual/release_pipeline_guide.md`

### 변경 내용

- Stage 1~3 산출물을 통합 대조한다.
- CI workflow, package scripts, release runbook, #37 Dashboard guide의 값이 서로 충돌하지 않는지 확인한다.
- build/typecheck/test/package dry-run을 최종 실행한다.
- 실제 release PR, GitHub Release/tag, Chrome Web Store upload/review submit은 수행하지 않았음을 최종 보고서에 명시한다.
- 첫 `main` 릴리즈와 Chrome Web Store 제출 전에 남은 blocker를 분리한다.
- 오늘할일을 완료 처리한다.

### 검증

```bash
npm run build
npm run typecheck
npm test
npm run package:cws
npm run verify:cws
unzip -l /tmp/crop-0.1.0-cws.zip
unzip -Z1 /tmp/crop-0.1.0-cws.zip
rg -n "npm run build|npm run typecheck|npm test|npm run package:cws|npm run verify:cws|pull_request|workflow_dispatch" .github/workflows/ci.yml package.json
rg -n "devel -> main|GitHub Release|tag|Chrome Web Store|Submit for review|PRIVACY.md|package:cws|verify:cws|main" mydocs/manual/release_pipeline_guide.md mydocs/tech/task_m030_46_release_pipeline_ci.md mydocs/report/task_m030_46_report.md
git diff --check
git status --short
```

### 커밋

```text
Task #46 Stage 4: release pipeline 통합 검증과 최종 보고
```

## 최종 보고와 PR 준비

Stage 4 완료와 승인 후 `task-final-report` 절차로 진행한다.

예상 산출물:

- `mydocs/report/task_m030_46_report.md`
- `mydocs/orders/20260607.md`
- `publish/task46` 원격 브랜치
- `devel` 대상 PR

예상 검증:

```bash
npm run build
npm run typecheck
npm test
npm run package:cws
npm run verify:cws
git diff --check
git status --short
```

## 검증

- 각 Stage 검증 명령은 단계 보고서 작성 전에 실행한다.
- 실패한 검증은 단계 완료로 처리하지 않는다.
- 구현 중 파일 위치나 범위가 이 계획과 달라지면 구현계획서를 갱신하고 작업지시자 승인을 다시 받는다.
- 문서 위치가 수행계획서 판단과 달라지면 수행계획서 또는 구현계획서를 갱신하고 작업지시자 승인을 다시 받는다.
- GitHub Actions 또는 action version 관련 항목은 Stage 1에서 primary source 확인일과 URL을 기록한다.

## 커밋

- 구현계획서 자체는 `Task #46: 구현계획서 작성과 오늘할일 갱신` 커밋으로 별도 기록한다.
- 단계 커밋은 단계 산출물과 `mydocs/working/task_m030_46_stage{N}.md`를 함께 묶는다.
- 커밋 메시지는 `Task #46 Stage {N}: {핵심 내용 요약}` 형식을 따른다.
- 최종 보고와 PR 게시 커밋은 `task-final-report` 절차의 커밋 규칙을 따른다.

## 단계 의존성

- Stage 1은 구현계획서 승인 후 진행한다.
- Stage 2는 Stage 1의 현행 release/CI 경계와 요구사항 조사 보고서 승인 후 진행한다.
- Stage 3은 Stage 2의 package artifact 생성/검증 표준화 승인 후 진행한다.
- Stage 4는 Stage 3의 PR CI와 release runbook 승인 후 진행한다.
- 최종 보고와 PR 준비는 Stage 4 단계 보고서 승인 후 진행한다.

## 위험과 대응

- **GitHub Actions 문법 오류**: workflow는 로컬에서 완전히 실행할 수 없으므로, Stage 3에서 YAML 구조와 핵심 command grep을 검증하고 PR 생성 후 GitHub Checks를 확인한다.
- **CI 범위 과다**: release artifact upload는 초기 PR CI에 넣지 않는다. PR CI는 build/typecheck/test/package dry-run/verify에 제한한다.
- **스크립트 유지보수 증가**: Node script는 외부 dependency 없이 표준 라이브러리만 사용한다. 복잡한 옵션 파서를 만들지 않고 CWS ZIP 생성/검증 목적에 제한한다.
- **Store 제출과 release 순서 혼동**: runbook에서 Dashboard draft 가능, submit 금지, submit 가능 시점을 분리한다.
- **공식 문서 변동성**: Stage 1에서 확인일과 URL을 남기고, 실제 release/submit 직전 재확인 항목을 runbook에 둔다.

## 승인 요청 사항

- Stage 1~4 산출물, 검증 명령, 커밋 메시지 구성을 승인한다.
- CWS package 생성/검증을 `scripts/package-cws.mjs`, `scripts/verify-cws-zip.mjs`와 package scripts로 고정하는 방향을 승인한다.
- PR CI workflow를 `.github/workflows/ci.yml`에 추가하는 방향을 승인한다.
- release/CI/Store 제출 runbook을 `mydocs/manual/release_pipeline_guide.md`에 작성하는 방향을 승인한다.
- 실제 `main` 릴리즈 PR, GitHub Release/tag, Chrome Web Store 제출은 이번 task에서 수행하지 않는 범위를 승인한다.
