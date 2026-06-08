# Task #50 최종 보고서 - GitHub Release note 템플릿 표준화

GitHub Issue: [#50](https://github.com/postmelee/crop/issues/50)
마일스톤: M030

## 작업 요약

- 대상 이슈: #50
- 마일스톤: M030
- 단계 수: 4
- 작업 목적: 반복 release에서 재사용할 GitHub Release note body 템플릿과 `gh release create --notes-file` 기반 작성 흐름을 표준화한다.

## 변경 파일 목록과 영향 범위

| 경로 | 변경 요약 | 영향 범위 |
|---|---|---|
| `mydocs/_templates/github_release_note.md` | user 안내와 developer 검증 기록을 분리한 GitHub Release body 템플릿 추가 | release note 작성 템플릿 |
| `mydocs/_templates/README.md` | `github_release_note.md` 허용 파일명과 사용 기준 추가 | 템플릿 폴더 규칙 |
| `mydocs/manual/release_pipeline_guide.md` | release note 작성 전 확인값, `--notes-file` 사용 절차, `.github/release.yml` 보류 기준 추가 | 반복 release runbook |
| `mydocs/tech/task_m030_50_release_notes.md` | GitHub 공식 문서 조사, `.github/release.yml` 보류 판단, Stage 3 구현 결과 기록 | task-specific 조사와 결정 근거 |
| `mydocs/plans/task_m030_50.md` | 수행계획서 작성 | task 범위와 승인 기준 |
| `mydocs/plans/task_m030_50_impl.md` | 구현계획서 작성 | Stage별 산출물/검증/커밋 경계 |
| `mydocs/working/task_m030_50_stage1.md` | 공식 기능과 기존 release 흐름 조사 보고 | 단계 기록 |
| `mydocs/working/task_m030_50_stage2.md` | release note 템플릿 작성 보고 | 단계 기록 |
| `mydocs/working/task_m030_50_stage3.md` | release pipeline guide 연결 보고 | 단계 기록 |
| `mydocs/working/task_m030_50_stage4.md` | 통합 검증과 최종 보고 단계 기록 | 단계 기록 |
| `mydocs/report/task_m030_50_report.md` | 최종 보고서 작성 | PR 게시 전 승인 자료 |
| `mydocs/orders/20260608.md` | #50 진행 상태 기록 | 오늘할일 보드 |

## 문서 위치 검증

이번 task는 GitHub Release body라는 공개 표면에 쓰일 수 있는 형식을 만들었지만, 저장소 안에 남기는 산출물은 release 운영 템플릿과 maintainer 절차다. 수행계획서의 문서 위치 판단대로 공식 사용자 문서 루트는 새로 만들지 않았다.

| 파일 | 계획된 위치 | 실제 위치 | 결과 | 근거 |
|---|---|---|---|---|
| `mydocs/_templates/github_release_note.md` | `mydocs/_templates/` | `mydocs/_templates/github_release_note.md` | OK | 실제 release body를 작성할 때 복사해 채우는 출력 템플릿 |
| `mydocs/manual/release_pipeline_guide.md` | `mydocs/manual/` | `mydocs/manual/release_pipeline_guide.md` | OK | 반복 release 절차와 `--notes-file` 사용 흐름 |
| `mydocs/tech/task_m030_50_release_notes.md` | `mydocs/tech/` | `mydocs/tech/task_m030_50_release_notes.md` | OK | 공식 문서 확인과 `.github/release.yml` 채택/보류 판단 |
| `.github/release.yml` | 필요 시 `.github/` | 생성하지 않음 | OK | Stage 1~3 판단상 이번 task baseline이 아니므로 보류 |
| `mydocs/report/task_m030_50_report.md` | `mydocs/report/` | `mydocs/report/task_m030_50_report.md` | OK | 최종 보고서 표준 위치 |

## 변경 전·후 정량 비교

| 지표 | 변경 전 | 변경 후 |
|---|---|---|
| GitHub Release note 템플릿 | 없음 | `mydocs/_templates/github_release_note.md` 97 lines |
| `_templates/README.md`의 release note 규칙 | 없음 | 위치/작성 시점/필수 섹션/검증 기준 추가 |
| release pipeline guide의 release note 절차 | Store ZIP 생성 명령과 검증 결과 기록만 언급 | `github_release_note.md` 복사, 필수 확인값, `--notes-file` 예시, 자동 notes 보류 기준 추가 |
| `.github/release.yml` | 없음 | 없음, 보류 판단 기록 |
| Stage 보고서 | 없음 | Stage 1~4 보고서 4개 |
| GitHub Release body 변경 | `v0.1.0` 기존 body 유지 | 변경 없음 |

## 검증 결과

| 수용 기준 | 결과 |
|---|---|
| release note 템플릿의 위치와 작성 규칙이 승인된 문서에 남는다 | OK — `mydocs/_templates/github_release_note.md`, `_templates/README.md`, `release_pipeline_guide.md`에 위치와 작성 절차 기록 |
| 사용자 안내와 개발자 검증 정보가 분리된 형식으로 확정된다 | OK — 템플릿이 `user 안내`와 `developer 검증 기록`을 분리 |
| asset checksum, privacy URL, Store 상태, 검증 결과 항목이 포함된다 | OK — 템플릿과 guide에 asset, SHA-256 checksum, privacy URL, Chrome Web Store 상태, verification 결과 포함 |
| 다음 release에서 수동 작성 또는 `--notes-file`로 바로 재사용 가능한 수준이다 | OK — `gh release create v{version} ... --notes-file {filled_notes_file}` 예시와 notes-file 작성 체크 추가 |
| release pipeline guide 또는 template 문서와 상호 링크가 존재한다 | OK — guide가 `mydocs/_templates/github_release_note.md`를 참조하고 `_templates/README.md`가 사용 명령을 기록 |
| 기존 `v0.1.0` GitHub Release body, version bump 정책, Chrome Web Store Dashboard 상태는 변경하지 않는다 | OK — 해당 원격 release body, version bump 정책, Dashboard 상태 변경 작업을 수행하지 않음 |
| `.github/release.yml` 적용 여부를 검토한다 | OK — Stage 1 기술 노트와 Stage 3 보고서에서 보류 판단 기록 |

### 단계별 검증 결과

- Stage 1: [`task_m030_50_stage1.md`](../working/task_m030_50_stage1.md) — GitHub 공식 자동 release notes와 `gh release create` manual 확인, `.github/release.yml` 보류 판단, `git diff --check` 통과.
- Stage 2: [`task_m030_50_stage2.md`](../working/task_m030_50_stage2.md) — release note 템플릿과 `_templates/README.md` 작성, 필수 키워드 grep과 `git diff --check` 통과.
- Stage 3: [`task_m030_50_stage3.md`](../working/task_m030_50_stage3.md) — release pipeline guide에 `--notes-file` 흐름 연결, `.github/release.yml` 미생성 확인, `git diff --check` 통과.
- Stage 4: [`task_m030_50_stage4.md`](../working/task_m030_50_stage4.md) — 통합 grep, 제외 범위 grep, `git diff --check`, `git status --short` 확인.

## Stage 4 통합 검증 상세

| 검증 | 결과 |
|---|---|
| `rg -n "user|developer|checksum|privacy|Chrome Web Store|asset|verification|SHA-256|notes-file|github_release_note" mydocs/_templates mydocs/manual .github mydocs/working mydocs/report` | OK — 템플릿, guide, 보고서에서 필수 문맥 확인 |
| `rg -n "v0.1.0|release 자동화 workflow|version bump|Chrome Web Store Dashboard|제외|변경하지" mydocs/report/task_m030_50_report.md mydocs/working/task_m030_50_stage4.md` | OK — 제외 범위와 변경하지 않은 항목 확인 |
| `git diff --check` | OK — whitespace 경고 없음 |
| `git status --short` | OK — Stage 4 산출물만 미커밋 변경으로 확인 후 단계 커밋 예정 |

## 제외 범위 확인

- 기존 `v0.1.0` GitHub Release body는 수정하지 않았다.
- release 자동화 workflow는 도입하지 않았다.
- version bump 정책은 변경하지 않았다.
- Chrome Web Store Dashboard 제출, upload, 상태 변경은 수행하지 않았다.
- `.github/release.yml`은 추가하지 않았다.

## 잔여 위험과 후속 작업

### 잔여 위험

- 실제 release notes file의 공개 언어, 보관 위치, 체크박스 삭제 여부는 다음 release 작업에서 결정해야 한다.
- `.github/release.yml` 자동 category 설정은 보류됐다. PR label taxonomy가 release-facing으로 정리되기 전에는 자동 category가 수동 body 템플릿을 대체하지 못한다.
- PR 생성 후 GitHub Actions 원격 CI는 별도로 확인해야 한다.

### 후속 작업 후보

- 다음 release task에서 `mydocs/_templates/github_release_note.md`를 복사해 실제 notes file을 작성하고 `gh release create --notes-file`로 사용한다.
- release PR label taxonomy가 필요해지면 `.github/release.yml` 추가 여부를 별도 issue로 검토한다.
- Stage 4 승인 후 `task-final-report` 절차로 `publish/task50` push와 `devel` 대상 PR 생성을 진행한다.

## 작업지시자 승인 요청

- 최종 보고서와 수용 기준 검증 결과를 승인하면 PR 게시 절차로 진행한다.
