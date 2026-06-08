# Task #50 구현계획서 - GitHub Release note 템플릿 표준화

수행계획서: [`task_m030_50.md`](task_m030_50.md)
GitHub Issue: [#50](https://github.com/postmelee/crop/issues/50)
마일스톤: M030

## 단계 개요

| Stage | 제목 | 주요 산출 | 검증 |
|---|---|---|---|
| 1 | 공식 기능과 기존 release 흐름 조사 | `mydocs/working/task_m030_50_stage1.md`, 필요 시 `mydocs/tech/task_m030_50_release_notes.md` | GitHub 공식 문서와 기존 release runbook 대조, `.github/release.yml` 채택 여부 판단 |
| 2 | release note 템플릿 작성 | `mydocs/_templates/github_release_note.md`, `_templates/README.md` | 필수 섹션과 키워드 grep, 템플릿 사용 기준 확인 |
| 3 | release pipeline guide 연결과 선택 설정 반영 | `mydocs/manual/release_pipeline_guide.md`, 필요 시 `.github/release.yml` | `--notes-file` 흐름, 템플릿 링크, 자동 release notes category 설정 확인 |
| 4 | 통합 검증과 최종 보고 | `mydocs/working/task_m030_50_stage4.md`, `mydocs/report/task_m030_50_report.md` | 템플릿/매뉴얼/선택 설정 상호 링크, 수용 기준 grep, status/diff |

## 문서 위치 확인

수행계획서의 "문서 위치 판단"과 실제 Stage 산출물 경로는 다음과 같이 일치시킨다. 이번 task는 공식 사용자 문서 루트를 새로 만들지 않고, release body 작성 형식은 `_templates/`, 반복 release 절차는 `manual/`, task-specific 판단 근거는 필요 시 `tech/`에 둔다.

| 파일 | 수행계획서상 선택 위치 | Stage 산출물 경로 | 일치 여부 | 비고 |
|---|---|---|---|---|
| `mydocs/_templates/github_release_note.md` | `mydocs/_templates/` | `mydocs/_templates/github_release_note.md` | OK | GitHub Release body 작성 템플릿 |
| `mydocs/manual/release_pipeline_guide.md` | `mydocs/manual/` | `mydocs/manual/release_pipeline_guide.md` | OK | 반복 release 절차와 `--notes-file` 사용 흐름 |
| `mydocs/tech/task_m030_50_release_notes.md` | `mydocs/tech/` | `mydocs/tech/task_m030_50_release_notes.md` | OK | 공식 문서 확인과 `.github/release.yml` 채택/보류 판단. Stage 1에서 필요성을 확정한다. |
| `.github/release.yml` | `.github/` | `.github/release.yml` | OK | 자동 release notes category 설정이 실효성 있을 때만 추가 |
| `mydocs/_templates/README.md` | `mydocs/_templates/` | `mydocs/_templates/README.md` | OK | 신규 템플릿 목록과 작성 기준 연결 |
| `mydocs/plans/task_m030_50_impl.md` | `mydocs/plans/` | `mydocs/plans/task_m030_50_impl.md` | OK | 구현계획서 |
| `mydocs/working/task_m030_50_stage{N}.md` | `mydocs/working/` | `mydocs/working/task_m030_50_stage{N}.md` | OK | 단계 보고서 |
| `mydocs/report/task_m030_50_report.md` | `mydocs/report/` | `mydocs/report/task_m030_50_report.md` | OK | 최종 보고서 |

## 수용 기준 고정

- release note 템플릿의 위치와 작성 규칙이 승인된 문서에 남는다.
- 사용자 안내와 개발자 검증 정보가 분리된 형식으로 확정된다.
- asset checksum, privacy URL, Store 상태, 검증 결과 항목이 포함된다.
- 다음 release에서 수동 작성 또는 `gh release create --notes-file`로 바로 재사용 가능한 수준이다.
- release pipeline guide 또는 template 문서와 상호 링크가 존재한다.
- 기존 `v0.1.0` GitHub Release body, release 자동화 workflow, version bump 정책, Chrome Web Store Dashboard 상태는 변경하지 않는다.

## Stage 1 — 공식 기능과 기존 release 흐름 조사

### 산출물

신규:

- `mydocs/working/task_m030_50_stage1.md`
- 필요 시 `mydocs/tech/task_m030_50_release_notes.md`

수정:

- 필요 시 `mydocs/orders/20260608.md`

### 변경 내용

- GitHub 공식 자동 release notes 문서에서 `.github/release.yml` category 설정의 역할과 한계를 확인한다.
- GitHub CLI `gh release create` manual에서 `--notes-file`, `--generate-notes`, `--notes-start-tag` 사용 가능성을 확인한다.
- 기존 `.github/`, `mydocs/manual/release_pipeline_guide.md`, `mydocs/report/task_m030_48_report.md`를 대조한다.
- `.github/release.yml`을 이번 task에서 추가할지, release body 템플릿만 먼저 둘지 판단한다.
- 조사와 판단이 재사용 가능한 근거로 남을 필요가 있으면 `mydocs/tech/task_m030_50_release_notes.md`에 분리한다. 판단 범위가 작으면 Stage 1 보고서에만 기록하고 tech 문서는 만들지 않는다.

### 검증

```bash
rg --files .github mydocs/manual mydocs/report mydocs/_templates
rg -n "Release|release note|gh release|notes-file|Chrome Web Store|checksum|privacy|asset|verification" mydocs/manual mydocs/report .github
git diff --check
```

추가 확인:

- GitHub 공식 release notes 문서 확인일과 URL을 Stage 1 보고서에 기록한다.
- GitHub CLI `gh release create` manual 확인일과 URL을 Stage 1 보고서에 기록한다.

### 커밋

```text
Task #50 Stage 1: release note 공식 기능 조사
```

## Stage 2 — release note 템플릿 작성

### 산출물

신규:

- `mydocs/_templates/github_release_note.md`
- `mydocs/working/task_m030_50_stage2.md`

수정:

- `mydocs/_templates/README.md`
- 필요 시 `mydocs/tech/task_m030_50_release_notes.md`
- 필요 시 `mydocs/orders/20260608.md`

### 변경 내용

- `mydocs/_templates/github_release_note.md`를 신규 작성한다.
- 템플릿은 실제 release마다 복사해 채울 수 있도록 placeholder와 삭제/보류 기준을 포함한다.
- 사용자 측면 섹션은 다음 항목을 포함한다.
  - 설치/업데이트 안내
  - 주요 변경점
  - 권한/privacy 변화
  - 알려진 제한
  - Chrome Web Store 상태
- 개발자 측면 섹션은 다음 항목을 포함한다.
  - release commit/tag
  - 포함 PR/issue
  - package 생성 명령
  - asset 이름, 크기, SHA-256 checksum
  - 검증 결과
  - rollback 또는 후속 작업
- `mydocs/_templates/README.md`에 신규 템플릿의 실제 파일 위치, 작성 시점, 작성 언어, 필수 섹션, 검증 기준을 추가한다.

### 검증

```bash
rg -n "user|developer|checksum|privacy|Chrome Web Store|asset|verification|rollback|known|SHA-256|notes-file" mydocs/_templates/github_release_note.md mydocs/_templates/README.md
git diff --check
```

### 커밋

```text
Task #50 Stage 2: GitHub Release note 템플릿 작성
```

## Stage 3 — release pipeline guide 연결과 선택 설정 반영

### 산출물

신규:

- 필요 시 `.github/release.yml`
- `mydocs/working/task_m030_50_stage3.md`

수정:

- `mydocs/manual/release_pipeline_guide.md`
- 필요 시 `mydocs/tech/task_m030_50_release_notes.md`
- 필요 시 `mydocs/orders/20260608.md`

### 변경 내용

- `release_pipeline_guide.md`에 GitHub Release note 작성 절차를 추가한다.
- `mydocs/_templates/github_release_note.md`를 release마다 복사해 채운 뒤 `gh release create --notes-file`에 전달하는 흐름을 문서화한다.
- release note 작성 전에 확인할 값을 정리한다.
  - release tag와 commit
  - Store upload 후보 asset과 checksum
  - privacy URL
  - Chrome Web Store 상태
  - 검증 결과와 rollback/follow-up
- Stage 1 판단 결과 `.github/release.yml`이 필요하면 자동 release notes category 설정을 추가한다.
- `.github/release.yml`을 추가하지 않는 경우 그 보류 사유를 Stage 3 보고서에 기록한다.
- manual 본문에는 반복 절차만 남기고 특정 release의 실제 checksum, Store 상태, 검증 로그는 넣지 않는다.

### 검증

```bash
rg -n "notes-file|github_release_note|release.yml|Chrome Web Store|privacy|checksum|SHA-256|verification|rollback" mydocs/manual/release_pipeline_guide.md mydocs/_templates .github
git diff --check
```

`.github/release.yml`을 추가한 경우 추가 검증:

```bash
rg -n "categories|exclude|labels|change-template|template" .github/release.yml
```

### 커밋

```text
Task #50 Stage 3: release note 작성 흐름 연결
```

## Stage 4 — 통합 검증과 최종 보고

### 산출물

신규:

- `mydocs/working/task_m030_50_stage4.md`
- `mydocs/report/task_m030_50_report.md`

수정:

- `mydocs/orders/20260608.md`
- 필요 시 `mydocs/tech/task_m030_50_release_notes.md`
- 필요 시 `mydocs/manual/release_pipeline_guide.md`
- 필요 시 `mydocs/_templates/github_release_note.md`

### 변경 내용

- Stage 1~3 산출물을 통합 대조한다.
- 템플릿, `_templates/README.md`, release pipeline guide, 선택 설정이 서로 링크되는지 확인한다.
- Issue #50의 검증 기준 키워드가 실제 산출물에 들어갔는지 확인한다.
- 기존 `v0.1.0` GitHub Release body, release 자동화 workflow, version bump 정책, Chrome Web Store Dashboard 상태를 변경하지 않았음을 최종 보고서에 명시한다.
- 오늘할일을 완료 후보로 갱신한다.

### 검증

```bash
rg -n "user|developer|checksum|privacy|Chrome Web Store|asset|verification|SHA-256|notes-file|github_release_note" mydocs/_templates mydocs/manual .github mydocs/working mydocs/report
rg -n "v0.1.0|release 자동화 workflow|version bump|Chrome Web Store Dashboard|제외|변경하지" mydocs/report/task_m030_50_report.md mydocs/working/task_m030_50_stage4.md
git diff --check
git status --short
```

### 커밋

```text
Task #50 Stage 4: release note 표준 통합 검증
```

## 최종 보고와 PR 준비

Stage 4 완료와 승인 후 `task-final-report` 절차로 진행한다.

예상 산출물:

- `mydocs/report/task_m030_50_report.md`
- `mydocs/orders/20260608.md`
- `publish/task50` 원격 브랜치
- `devel` 대상 PR

예상 검증:

```bash
rg -n "user|developer|checksum|privacy|Chrome Web Store|asset|verification|notes-file|github_release_note" mydocs/_templates mydocs/manual .github mydocs/report
git diff --check
git status --short
```

## 승인 지점

- Stage 1 완료 후 `.github/release.yml` 채택/보류 판단을 승인받는다.
- Stage 2 완료 후 release note 템플릿 형식과 `_templates/README.md` 갱신 결과를 승인받는다.
- Stage 3 완료 후 release pipeline guide 연결과 선택 설정 반영 결과를 승인받는다.
- Stage 4 완료 후 최종 보고서와 PR 준비 진행 여부를 승인받는다.

## 검증

- 각 Stage 검증 명령은 단계 보고서 작성 전에 실행한다.
- 실패한 검증은 단계 완료로 처리하지 않는다.
- 구현 중 파일 위치나 범위가 이 계획과 달라지면 구현계획서를 갱신하고 작업지시자 승인을 다시 받는다.
- 문서 위치가 수행계획서 판단과 달라지면 수행계획서 또는 구현계획서를 갱신하고 작업지시자 승인을 다시 받는다.
- GitHub 공식 release notes와 GitHub CLI manual은 Stage 1에서 확인일과 URL을 기록한다.

## 커밋

- 구현계획서 자체는 `Task #50: 구현계획서 작성과 오늘할일 갱신` 커밋으로 별도 기록한다.
- 단계 커밋은 단계 산출물과 `mydocs/working/task_m030_50_stage{N}.md`를 함께 묶는다.
- 커밋 메시지는 `Task #50 Stage {N}: {핵심 내용 요약}` 형식을 따른다.
- 최종 보고와 PR 게시 커밋은 `task-final-report` 절차의 커밋 규칙을 따른다.

## 위험과 대응

- **`.github/release.yml` 과잉 도입**: 자동 release notes category가 실제 PR label 운영과 맞지 않으면 설정 파일을 추가하지 않고 보류 사유만 기록한다.
- **템플릿의 공개/내부 정보 혼합**: 사용자 측면과 개발자 측면을 분리하고, 실제 release마다 공개해도 되는 값인지 확인하는 작성 체크를 둔다.
- **검증 로그의 manual 누적**: manual에는 반복 절차만 기록하고 특정 release의 checksum이나 검증 결과는 실제 release 작업의 보고서 또는 release note에만 둔다.
- **Store 상태 변동성**: Chrome Web Store 상태는 release마다 입력하게 하고, 템플릿에는 상태값과 확인일을 적는 칸을 둔다.

## 승인 요청 사항

- 위 Stage 1~4 분할, 산출물, 검증 명령, 커밋 메시지를 승인한다.
- Stage 1에서 GitHub 공식 문서 확인 후 `.github/release.yml` 채택/보류를 판단하는 절차를 승인한다.
- Stage 2~3에서 `mydocs/_templates/github_release_note.md`, `mydocs/_templates/README.md`, `mydocs/manual/release_pipeline_guide.md`를 수정하는 범위를 승인한다.
- 기존 `v0.1.0` GitHub Release body, release 자동화 workflow, version bump 정책, Chrome Web Store Dashboard 상태는 변경하지 않는 범위를 승인한다.
