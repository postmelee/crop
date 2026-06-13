# Task #72 구현계획서 - 다음 릴리즈 후보 정리와 devel -> main 승격 준비

수행계획서: [`task_m030_72.md`](task_m030_72.md)
GitHub Issue: [#72](https://github.com/postmelee/crop/issues/72)
마일스톤: M030

## 단계 개요

| Stage | 제목 | 주요 산출 | 검증 |
|---|---|---|---|
| 1 | release 후보 범위와 version 판단 | `mydocs/tech/task_m030_72_release_candidate.md`, `mydocs/working/task_m030_72_stage1.md` | branch/tag/version, 포함 PR/Issue, 권한 경계, version 후보 근거 확인 |
| 2 | version bump와 release candidate 초안 작성 | `package.json`, `manifest.json`, `mydocs/tech/task_m030_72_release_candidate.md`, `mydocs/working/task_m030_72_stage2.md` | 승인된 version 반영, release body 후보와 release PR 본문 후보 placeholder 제거 |
| 3 | release package 검증 | `mydocs/tech/task_m030_72_release_candidate.md`, `mydocs/working/task_m030_72_stage3.md` | build/typecheck/test/package/verify, ZIP contents, permission, checksum 확인 |
| 4 | 최종 release PR 준비 보고 | `mydocs/working/task_m030_72_stage4.md`, `mydocs/report/task_m030_72_report.md`, `mydocs/orders/20260613.md` | release PR 준비 상태, 남은 승인 항목, Chrome Web Store 제외 범위 확인 |

## 문서 위치 확인

수행계획서의 "문서 위치 판단"과 실제 Stage 산출물 경로를 다음과 같이 일치시킨다. 이번 task는 공식 사용자 문서 루트를 새로 만들지 않고, release 후보 판단과 공개 body 후보를 task-specific 기술 노트에 둔다.

| 파일 | 수행계획서상 선택 위치 | Stage 산출물 경로 | 일치 여부 | 비고 |
|---|---|---|---|---|
| `mydocs/tech/task_m030_72_release_candidate.md` | `mydocs/tech/` | `mydocs/tech/task_m030_72_release_candidate.md` | OK | version 판단, 포함 PR/Issue, release body 후보, release PR 본문 후보, package 검증값 |
| `mydocs/plans/task_m030_72_impl.md` | `mydocs/plans/` | `mydocs/plans/task_m030_72_impl.md` | OK | 구현계획서 |
| `mydocs/working/task_m030_72_stage{N}.md` | `mydocs/working/` | `mydocs/working/task_m030_72_stage{N}.md` | OK | 단계별 완료보고서 |
| `mydocs/report/task_m030_72_report.md` | `mydocs/report/` | `mydocs/report/task_m030_72_report.md` | OK | 최종 보고서 |
| GitHub Release body 후보 | `mydocs/tech/` | `mydocs/tech/task_m030_72_release_candidate.md` | OK | 실제 GitHub Release는 별도 승인 전 수정하지 않음 |
| release PR 본문 후보 | `mydocs/tech/` | `mydocs/tech/task_m030_72_release_candidate.md` | OK | 실제 `devel -> main` PR은 별도 승인 전 생성하지 않음 |

## 수용 기준 고정

- release version이 승인되어 있고 version 파일이 그 기준과 일치한다.
- release body 후보에 placeholder가 남아 있지 않다.
- 사용자 안내에는 실제 사용자-facing 변경과 known limitations만 들어간다.
- developer 검증 기록에는 포함 PR/Issue, commit 후보, asset 후보, checksum, verification 결과가 들어간다.
- `devel -> main` release PR 전에 필요한 로컬 검증이 통과한다.
- `debugger`, `<all_urls>`, broad `host_permissions`, `tabs` 권한이 추가되지 않는다.
- Chrome Web Store package upload와 `Submit for review`를 수행하지 않는다.
- `main` merge, tag 생성, GitHub Release 생성은 별도 명시 승인 전 수행하지 않는다.

## Stage 1 - release 후보 범위와 version 판단

### 산출물

신규:

- `mydocs/tech/task_m030_72_release_candidate.md`
- `mydocs/working/task_m030_72_stage1.md`

수정:

- 필요 시 `mydocs/orders/20260613.md`

### 변경 내용

- `origin/main`, `origin/devel`, tag 목록, 현재 branch 상태를 확인한다.
- `v0.1.0..origin/main`, `v0.1.0..origin/devel`, `origin/main..origin/devel` 변경을 수집한다.
- 포함 PR/Issue와 사용자-facing 변경 후보를 정리한다.
- `package.json`, `manifest.json`의 현재 version과 release package script의 출력 이름 기준을 확인한다.
- `debugger`, `<all_urls>`, `host_permissions`, `tabs` 권한이 추가되어 있는지 확인한다.
- `v0.1.1`을 우선 후보로 두되, 변경 성격상 다른 version이 필요하면 근거를 기술 노트에 기록한다.
- Stage 1 완료보고서에서 Stage 2에 적용할 release version 승인을 요청한다.
- version 파일, release body, package artifact, GitHub 원격 상태는 수정하지 않는다.

### 검증

```bash
git fetch --all --tags --prune
git status --short --branch
git tag --sort=-creatordate
git log --oneline v0.1.0..origin/main
git log --oneline v0.1.0..origin/devel
git log --merges --first-parent --oneline v0.1.0..origin/devel
git diff --name-status origin/main..origin/devel
node -p "require('./package.json').version"
rg -n '"version"|debugger|<all_urls>|host_permissions|tabs' package.json manifest.json src tests
rg -n "v0.1.0|v0.1.1|origin/main|origin/devel|#66|#68|version|권한|Chrome Web Store" mydocs/tech/task_m030_72_release_candidate.md mydocs/working/task_m030_72_stage1.md
git diff --check
```

### 승인 게이트

Stage 1 완료보고서 승인 전에는 version 파일을 수정하지 않는다. Stage 2에서 사용할 release version은 Stage 1 보고서 승인으로 확정한다.

### 커밋

```text
Task #72 Stage 1: release 후보와 version 판단
```

## Stage 2 - version bump와 release candidate 초안 작성

### 산출물

신규:

- `mydocs/working/task_m030_72_stage2.md`

수정:

- `package.json`
- `manifest.json`
- `mydocs/tech/task_m030_72_release_candidate.md`
- 필요 시 `mydocs/orders/20260613.md`

### 변경 내용

- Stage 1에서 승인된 release version을 `package.json`과 `manifest.json`에 반영한다.
- `mydocs/_templates/github_release_note.md` 구조를 기준으로 GitHub Release body 후보를 작성한다.
- 사용자 안내에는 설치/업데이트, 주요 변경점, 권한/privacy 변화, known limitations, Chrome Web Store 상태를 기록한다.
- developer 검증 기록에는 release 기준, 포함 PR/Issue, package asset 후보, verification 결과 자리, rollback/follow-up을 기록한다.
- Store 상태는 작업지시자가 직접 제출한다는 전제에 맞춰 `not submitted` 또는 작업지시자가 승인한 표현으로 둔다.
- `devel -> main` release PR 본문 후보를 작성한다.
- GitHub Release, tag, release PR은 생성하지 않는다.

### 검증

승인 version이 `v0.1.1`인 경우:

```bash
rg -n '"version": "0.1.1"' package.json manifest.json
rg -n "v0.1.1|Release|Chrome Web Store|checksum|privacy|verification|rollback|follow-up|not submitted|Release PR" mydocs/tech/task_m030_72_release_candidate.md mydocs/working/task_m030_72_stage2.md
rg -n "\\{[a-zA-Z0-9_ -]+\\}|TODO|미확인|placeholder" mydocs/tech/task_m030_72_release_candidate.md
git diff --check
```

다른 version이 승인되면 위 version grep을 승인 version으로 바꿔 실행한다. placeholder grep은 출력이 없어야 한다.

### 커밋

```text
Task #72 Stage 2: release candidate 초안 작성
```

## Stage 3 - release package 검증

### 산출물

신규:

- `mydocs/working/task_m030_72_stage3.md`

수정:

- `mydocs/tech/task_m030_72_release_candidate.md`
- 필요 시 `mydocs/orders/20260613.md`

### 변경 내용

- 승인 version 기준으로 build, typecheck, test, package, verify를 실행한다.
- `/tmp/crop-{version}-cws.zip`의 파일 크기와 SHA-256 checksum을 기록한다.
- ZIP root에 `manifest.json`이 있는지 확인한다.
- ZIP에 `.DS_Store`, `__MACOSX`, `node_modules`, `mydocs`, repository root 문서/config가 없는지 확인한다.
- manifest 권한이 승인된 범위인지 확인한다.
- package 검증 결과와 asset 후보 정보를 release body 후보의 developer 검증 기록에 반영한다.
- Chrome Web Store upload는 수행하지 않는다.

### 검증

```bash
npm run build
npm run typecheck
npm test
npm run package:cws
npm run verify:cws
unzip -l /tmp/crop-{version}-cws.zip
unzip -Z1 /tmp/crop-{version}-cws.zip
shasum -a 256 /tmp/crop-{version}-cws.zip
rg -n "debugger|<all_urls>|host_permissions|tabs" manifest.json dist/manifest.json
rg -n "npm run build|npm run typecheck|npm test|npm run package:cws|npm run verify:cws|SHA-256|manifest.json|forbidden|Chrome Web Store" mydocs/tech/task_m030_72_release_candidate.md mydocs/working/task_m030_72_stage3.md
git diff --check
```

`rg -n "debugger|<all_urls>|host_permissions|tabs" manifest.json dist/manifest.json`는 `tabs` 같은 승인되지 않은 permission이 manifest permission으로 추가됐는지 해석해 기록한다. `chrome.tabs.captureVisibleTab()` API 명칭과 manifest permission을 혼동하지 않는다.

### 커밋

```text
Task #72 Stage 3: release package 검증
```

## Stage 4 - 최종 release PR 준비 보고

### 산출물

신규:

- `mydocs/working/task_m030_72_stage4.md`
- `mydocs/report/task_m030_72_report.md`

수정:

- `mydocs/tech/task_m030_72_release_candidate.md`
- `mydocs/orders/20260613.md`

### 변경 내용

- Stage 1~3 산출물을 통합 대조한다.
- release version, 포함 PR/Issue, release body 후보, release PR 본문 후보, package checksum, privacy URL 후보를 최종 보고서에 요약한다.
- `devel -> main` release PR 생성 가능 조건과 보류 항목을 정리한다.
- `main` merge, tag 생성, GitHub Release 생성, Chrome Web Store 제출은 수행하지 않고 별도 승인 항목으로 남긴다.
- 오늘할일을 완료 후보 상태로 갱신한다.

### 검증

```bash
rg -n "Release PR|GitHub Release|Submit for review|Chrome Web Store|checksum|SHA-256|privacy|승인|보류|생성하지|수행하지" mydocs/tech/task_m030_72_release_candidate.md mydocs/working/task_m030_72_stage4.md mydocs/report/task_m030_72_report.md
rg -n "v0.1.1|version|package.json|manifest.json|npm run build|npm run typecheck|npm test|npm run package:cws|npm run verify:cws" mydocs/report/task_m030_72_report.md mydocs/tech/task_m030_72_release_candidate.md
git diff --check
git status --short
```

다른 version이 승인되면 `v0.1.1` grep을 승인 version으로 바꿔 실행한다.

### 커밋

```text
Task #72 Stage 4: release PR 준비 보고
```

## 최종 보고와 PR 준비

Stage 4 완료와 승인 후 `task-final-report` 절차로 진행한다.

예상 산출물:

- `mydocs/report/task_m030_72_report.md`
- `publish/task72` 원격 브랜치
- `devel` 대상 PR

예상 검증:

```bash
rg -n "Release PR|GitHub Release|Chrome Web Store|checksum|SHA-256|privacy|Submit for review|수행하지|승인" mydocs/tech mydocs/report
git diff --check
git status --short
```

`task-final-report` 이후에도 `devel -> main` release PR, `main` merge, tag/GitHub Release 생성은 별도 명시 승인 전 수행하지 않는다.

## 승인 지점

- Stage 1 완료 후 release version 후보와 Stage 2 version bump 진행 여부를 승인받는다.
- Stage 2 완료 후 version bump, release body 후보, release PR 본문 후보를 승인받는다.
- Stage 3 완료 후 package 검증 결과와 checksum을 승인받는다.
- Stage 4 완료 후 최종 보고서와 PR 게시 진행 여부를 승인받는다.
- `devel -> main` release PR 생성, `main` merge, tag/GitHub Release 생성은 이 task의 각 단계 승인과 별개로 명시 승인을 받는다.

## 검증

- 각 Stage 검증 명령은 단계 보고서 작성 전에 실행한다.
- 실패한 검증은 단계 완료로 처리하지 않는다.
- 구현 중 파일 위치나 범위가 이 계획과 달라지면 구현계획서를 갱신하고 작업지시자 승인을 다시 받는다.
- 문서 위치가 수행계획서 판단과 달라지면 수행계획서 또는 구현계획서를 갱신하고 작업지시자 승인을 다시 받는다.
- GitHub 원격 상태와 release/tag 정보는 Stage 1에서 live 기준으로 확인한다.

## 커밋

- 구현계획서 자체는 `Task #72: 구현계획서 작성과 오늘할일 갱신` 커밋으로 별도 기록한다.
- 단계 커밋은 단계 산출물과 `mydocs/working/task_m030_72_stage{N}.md`를 함께 묶는다.
- 커밋 메시지는 `Task #72 Stage {N}: {핵심 내용 요약}` 형식을 따른다.
- 최종 보고와 PR 게시 커밋은 `task-final-report` 절차의 커밋 규칙을 따른다.

## 위험과 대응

- **version 승인 누락**: Stage 1 완료 후 release version 승인 전에는 `package.json`과 `manifest.json`을 수정하지 않는다.
- **release PR과 task PR 혼동**: #72 산출물을 반영하는 PR은 `devel` 대상 일반 task PR이고, 실제 release PR은 `devel -> main` 별도 승인 작업으로 구분한다.
- **GitHub Release body 조기 공개**: Stage 2에서는 후보 문서만 만들고, 실제 GitHub Release 생성/수정은 별도 승인 전 수행하지 않는다.
- **권한 grep 오해**: 코드의 `chrome.tabs.captureVisibleTab()`와 manifest `tabs` permission을 구분해 해석한다. 금지 대상은 승인되지 않은 manifest permission 추가다.
- **Chrome Web Store 상태 불일치**: 이번 task는 Store 제출을 하지 않으므로 release body 후보의 Store 상태를 실제 진행 상태와 맞춰 보수적으로 적는다.
