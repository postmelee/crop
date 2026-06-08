# Task #50 Stage 3 보고서 - release note 작성 흐름 연결

GitHub Issue: [#50](https://github.com/postmelee/crop/issues/50)
구현계획서: [`task_m030_50_impl.md`](../plans/task_m030_50_impl.md)
Stage: 3

## 단계 목적

Stage 3은 Stage 2에서 작성한 `mydocs/_templates/github_release_note.md`를 반복 release runbook에 연결하는 단계다. `release_pipeline_guide.md`에 GitHub Release note 작성 절차와 `gh release create --notes-file` 사용 흐름을 추가하고, Stage 1 판단대로 `.github/release.yml`은 추가하지 않았다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `mydocs/manual/release_pipeline_guide.md` | GitHub Release body 템플릿 사용 규칙, release note 작성 전 확인값, `--notes-file` 예시, `.github/release.yml` 보류 기준 추가 |
| `mydocs/tech/task_m030_50_release_notes.md` | Stage 3 구현 결과와 `.github/release.yml` 보류 판단 기록 |
| `mydocs/working/task_m030_50_stage3.md` | Stage 3 목적, 산출물, 검증 결과, 다음 단계 영향 기록 |
| `mydocs/orders/20260608.md` | #50 비고를 Stage 3 완료 후 승인 대기로 갱신 |

## 본문 변경 정도 / 본문 무손실 여부

`release_pipeline_guide.md`는 기존 release PR, GitHub Release/tag, Chrome Web Store Dashboard 절차를 보존하고 다음 내용을 추가했다.

- 강제 규칙에 `github_release_note.md` 기준 작성과 `--notes-file` 전달 규칙 추가
- GitHub Release/tag 전 확인 항목에 asset, SHA-256 checksum, privacy URL, Chrome Web Store 상태, verification 결과 추가
- `GitHub Release note 작성` 섹션 신규 추가

기존 절차의 삭제나 재작성은 없다. `.github/release.yml`은 새로 만들지 않았다.

## 검증 결과

실행 명령:

```bash
rg -n "notes-file|github_release_note|release.yml|Chrome Web Store|privacy|checksum|SHA-256|verification|rollback" mydocs/manual/release_pipeline_guide.md mydocs/_templates .github
test ! -f .github/release.yml
git diff --check
```

결과:

- OK: `release_pipeline_guide.md`에서 `github_release_note.md`, `--notes-file`, Chrome Web Store 상태, privacy URL, asset checksum, SHA-256, verification, rollback 문맥이 확인됐다.
- OK: `mydocs/_templates/github_release_note.md`와 `_templates/README.md`의 템플릿 링크/검증 키워드가 유지됐다.
- OK: `.github/release.yml`은 추가하지 않았다.
- OK: `git diff --check`는 whitespace 경고 없이 통과했다.

## 잔여 위험

- `.github/release.yml`은 계속 보류 상태다. 자동 release notes category가 필요해지면 PR label taxonomy를 먼저 release-facing 기준으로 정리하는 별도 task가 필요하다.
- 실제 release notes file을 어디에 보관할지는 release 작업마다 결정해야 한다. 이번 task는 템플릿과 작성 흐름을 고정하고, 특정 release body 파일은 만들지 않는다.

## 다음 단계 영향

- Stage 4는 템플릿, `_templates/README.md`, release pipeline guide, 기술 노트, 단계 보고서가 서로 충돌하지 않는지 통합 검증한다.
- Stage 4 최종 보고서에는 기존 `v0.1.0` GitHub Release body, release 자동화 workflow, version bump 정책, Chrome Web Store Dashboard 상태를 변경하지 않았음을 명시해야 한다.

## 승인 요청

- Stage 3 산출물과 검증 결과를 승인하면 Stage 4 통합 검증과 최종 보고로 진행한다.
