# Task #50 기술 노트 - GitHub Release note 표준화 조사

GitHub Issue: [#50](https://github.com/postmelee/crop/issues/50)
마일스톤: M030
확인일: 2026-06-08 KST
기준 브랜치: `local/task50`

## 조사 배경

첫 `v0.1.0` GitHub Release와 Chrome Web Store 게시가 완료된 뒤, 다음 반복 release부터는 사용자 안내와 개발자 검증 정보를 분리한 release body가 필요하다. 이번 조사는 GitHub 자동 release notes, GitHub CLI `gh release create`, `.github/release.yml`의 역할을 확인하고, #50에서 어떤 산출물을 우선 만들지 결정하기 위한 것이다.

## 조사 질문

- `gh release create --notes-file`을 다음 release의 표준 수동 작성 흐름으로 쓸 수 있는가?
- GitHub 자동 release notes와 `.github/release.yml`이 사용자/개발자 분리 템플릿을 대체할 수 있는가?
- 이번 task에서 `.github/release.yml`을 추가해야 하는가, 아니면 수동 body 템플릿을 먼저 확정해야 하는가?

## 조사 대상

| 대상 | 이유 | 위치 |
|---|---|---|
| GitHub Docs - Automatically generated release notes | 자동 release notes와 `.github/release.yml` 설정 범위 확인 | <https://docs.github.com/en/repositories/releasing-projects-on-github/automatically-generated-release-notes> |
| GitHub CLI manual - `gh release create` | `--notes-file`, `--generate-notes`, asset upload option 확인 | <https://cli.github.com/manual/gh_release_create> |
| `mydocs/manual/release_pipeline_guide.md` | 기존 release/tag/Store package runbook 경계 확인 | `mydocs/manual/release_pipeline_guide.md` |
| `mydocs/report/task_m030_48_report.md` | `v0.1.0` release 기준 commit, asset, checksum, privacy URL 기록 확인 | `mydocs/report/task_m030_48_report.md` |
| `.github/` | 현재 GitHub platform 설정 파일 확인 | `.github/workflows/ci.yml`, `.github/pull_request_template.md`, `.github/ISSUE_TEMPLATE/task.yml` |

## 발견 내용

### GitHub 자동 release notes

- GitHub 자동 release notes는 release 간 변경 개요를 자동으로 만들기 위한 기능이다.
- 기본 출력은 merged pull requests, contributors, full changelog link 중심이다.
- `.github/release.yml`은 자동 notes의 PR category와 제외 rule을 label/author 기준으로 조정한다.
- category는 `changelog.categories[*].title`과 `labels`를 사용하며, catch-all category에는 `*` label을 둘 수 있다.
- 이 기능은 PR/label 기반 변경 목록을 정리하는 데 유용하지만, Chrome Web Store 상태, privacy URL, package command, asset checksum, verification 결과 같은 release 운영 증빙을 자동으로 채우지는 않는다.

### GitHub CLI `gh release create`

- `gh release create <tag> <asset...>` 형태로 release와 asset upload를 함께 수행할 수 있다.
- `-F` 또는 `--notes-file`은 release notes를 파일에서 읽는다. `-`를 사용하면 standard input에서 읽을 수 있다.
- `--generate-notes`는 GitHub Release Notes API로 title/notes를 자동 생성한다.
- `--notes`는 자동 생성 notes 앞에 추가 notes를 붙일 때 사용할 수 있다.
- `--notes-start-tag`는 자동 생성 notes의 시작 tag를 지정한다.
- `--notes-from-tag`는 annotated tag나 관련 commit message에서 notes를 가져온다.
- `--verify-tag`는 원격 tag가 이미 없으면 release 생성을 중단하는 guardrail로 쓸 수 있다.

### 기존 release runbook 상태

- `mydocs/manual/release_pipeline_guide.md`는 tag/GitHub Release 전 확인 항목에 Store 제출 ZIP 생성 명령과 검증 결과를 release note에 적으라고만 한다.
- 현재 문서에는 release note body의 섹션 구조, 필수 항목, `--notes-file` 작성 순서가 없다.
- #48 최종 보고서는 `v0.1.0` 기준 commit, Release URL, asset URL, ZIP SHA-256, privacy URL 후보를 기록했지만, 이는 특정 release 실행 기록이지 반복 템플릿이 아니다.
- `.github/release.yml`은 현재 없다.

## 결정

- #50의 우선 산출물은 `mydocs/_templates/github_release_note.md` 수동 body 템플릿으로 둔다.
- 다음 release baseline은 `gh release create v{version} {asset} --notes-file {filled-note}` 형태로 정리한다.
- GitHub 자동 release notes는 보조 기능으로만 다룬다. PR/issue 목록을 자동으로 보강하고 싶을 때 사용할 수 있지만, 사용자/개발자 분리 body 템플릿과 Store 검증 증빙을 대체하지 않는다.
- 이번 task에서는 `.github/release.yml`을 추가하지 않는 방향을 기본 판단으로 둔다. 현재 필요한 것은 label category 자동화가 아니라 release body의 필수 섹션과 수동 검증 항목 고정이다.

## 비결정 / 보류

- `.github/release.yml`은 보류한다. 이유는 다음과 같다.
  - 현재 #50 수용 기준의 핵심은 사용자 안내/개발자 검증 정보 분리와 checksum/privacy/Store 상태 항목 고정이다.
  - 자동 release notes category는 PR label taxonomy가 release-facing으로 정리된 뒤에 실효성이 커진다.
  - 자동 category를 지금 추가하면 수동 body 템플릿과 generated notes의 책임 경계가 흐려질 수 있다.
- `--generate-notes`와 `--notes-file`을 함께 쓰는 hybrid 흐름은 이번 task의 baseline으로 두지 않는다. 필요하면 후속 task에서 release PR label 운영과 함께 검토한다.

## 적용 영향

- Stage 2는 `mydocs/_templates/github_release_note.md`에 사용자 측면과 개발자 측면을 분리한 template를 작성한다.
- Stage 2는 `_templates/README.md`에 신규 template 사용 위치, 작성 시점, 필수 섹션, 검증 기준을 추가한다.
- Stage 3은 `mydocs/manual/release_pipeline_guide.md`에 `--notes-file` 기반 작성 흐름을 연결한다.
- Stage 3에서 `.github/release.yml`은 추가하지 않고, 보류 판단을 단계 보고서에 기록한다. 작업지시자가 Stage 1 판단을 변경 승인하면 구현계획서를 갱신한 뒤 진행한다.

## 참고 링크

- [GitHub Docs - Automatically generated release notes](https://docs.github.com/en/repositories/releasing-projects-on-github/automatically-generated-release-notes)
- [GitHub CLI manual - gh release create](https://cli.github.com/manual/gh_release_create)
- [`release_pipeline_guide.md`](../manual/release_pipeline_guide.md)
- [`task_m030_48_report.md`](../report/task_m030_48_report.md)
