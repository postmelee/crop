# Task #50 Stage 1 보고서 - release note 공식 기능 조사

GitHub Issue: [#50](https://github.com/postmelee/crop/issues/50)
구현계획서: [`task_m030_50_impl.md`](../plans/task_m030_50_impl.md)
Stage: 1

## 단계 목적

Stage 1은 GitHub 공식 자동 release notes와 GitHub CLI `gh release create` 기능을 확인하고, 기존 `crop` release runbook과 대조해 #50의 구현 방향을 고정하는 단계다. 특히 `.github/release.yml`을 이번 task에서 추가할지, 수동 release body 템플릿을 먼저 확정할지 판단한다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `mydocs/tech/task_m030_50_release_notes.md` | 공식 문서 확인 결과, 기존 release runbook 대조, `.github/release.yml` 보류 판단 작성 |
| `mydocs/working/task_m030_50_stage1.md` | Stage 1 목적, 산출물, 검증 결과, 다음 단계 영향 기록 |
| `mydocs/orders/20260608.md` | #50 비고를 Stage 1 완료 후 승인 대기로 갱신 |

## 본문 변경 정도 / 본문 무손실 여부

신규 조사/보고 문서만 작성했다. 기존 release pipeline guide, `_templates/README.md`, `.github/` 설정 파일은 Stage 1에서 수정하지 않았으므로 기존 본문 손실은 없다.

## 조사 결과 요약

| 항목 | 확인 결과 | Stage 1 판단 |
|---|---|---|
| GitHub 자동 release notes | merged PR, contributors, full changelog link 중심이며 `.github/release.yml`로 label category와 제외 rule을 조정할 수 있다. | PR/label 목록 정리에는 유용하지만 Store 상태, privacy URL, checksum, verification 결과를 대체하지 못한다. |
| `gh release create --notes-file` | release notes를 파일에서 읽는 옵션이 있다. asset upload와 함께 사용할 수 있다. | #50 템플릿을 release마다 채운 뒤 `--notes-file`로 전달하는 수동 흐름을 baseline으로 둔다. |
| `--generate-notes` | GitHub Release Notes API로 title/notes를 자동 생성할 수 있다. | 이번 baseline에서는 보조 기능으로만 기록한다. |
| `.github/release.yml` | 현재 저장소에 없다. GitHub가 자동 notes category 설정으로 읽는 위치다. | 이번 task에서는 추가하지 않는 판단을 제안한다. release-facing label taxonomy 정리 후 별도 검토가 맞다. |
| 기존 runbook | release note에 Store ZIP 생성 명령과 검증 결과를 적으라는 기준만 있다. | Stage 3에서 `--notes-file` 작성 흐름과 템플릿 링크를 추가해야 한다. |

공식 문서 확인:

- GitHub Docs - Automatically generated release notes, 확인일 2026-06-08 KST: <https://docs.github.com/en/repositories/releasing-projects-on-github/automatically-generated-release-notes>
- GitHub CLI manual - `gh release create`, 확인일 2026-06-08 KST: <https://cli.github.com/manual/gh_release_create>

## 검증 결과

실행 명령:

```bash
rg --files .github mydocs/manual mydocs/report mydocs/_templates
rg -n "Release|release note|gh release|notes-file|Chrome Web Store|checksum|privacy|asset|verification" mydocs/manual mydocs/report .github
git diff --check
```

결과:

- OK: `.github`에는 현재 `.github/workflows/ci.yml`, `.github/pull_request_template.md`, `.github/ISSUE_TEMPLATE/task.yml`만 있고 `.github/release.yml`은 없다.
- OK: `release_pipeline_guide.md`에는 GitHub Release/tag 전 확인과 Store ZIP 생성/검증 결과 기록 기준이 있으나, `--notes-file` 흐름과 release note template 링크는 아직 없다.
- OK: #48 최종 보고서에는 `v0.1.0` release 기준 commit, asset URL, ZIP SHA-256, privacy URL 후보가 기록돼 있어 Stage 2 template의 개발자 측면 항목 근거로 쓸 수 있다.
- OK: `git diff --check`는 whitespace 경고 없이 통과했다.

## 잔여 위험

- `.github/release.yml` 보류 판단은 Stage 1 승인 지점에서 확정되어야 한다. 작업지시자가 자동 category 설정 추가를 원하면 구현계획서와 Stage 3 산출물을 갱신해야 한다.
- GitHub 자동 release notes 출력 형식은 GitHub 플랫폼이 생성하는 결과라 수동 템플릿처럼 모든 항목을 고정할 수 없다.

## 다음 단계 영향

- Stage 2는 `mydocs/_templates/github_release_note.md`를 작성하고, 사용자 측면과 개발자 측면 섹션을 분리한다.
- Stage 2 template에는 `user`, `developer`, `checksum`, `privacy`, `Chrome Web Store`, `asset`, `verification`, `rollback`, `known`, `SHA-256`, `notes-file` 검증 키워드가 들어가야 한다.
- Stage 3은 `.github/release.yml`을 추가하지 않는 경로로 `release_pipeline_guide.md`에 `--notes-file` 흐름을 연결한다.

## 승인 요청

- Stage 1 산출물과 `.github/release.yml` 보류 판단을 승인하면 Stage 2 release note 템플릿 작성으로 진행한다.
