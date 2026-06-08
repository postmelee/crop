# Task #50 Stage 2 보고서 - GitHub Release note 템플릿 작성

GitHub Issue: [#50](https://github.com/postmelee/crop/issues/50)
구현계획서: [`task_m030_50_impl.md`](../plans/task_m030_50_impl.md)
Stage: 2

## 단계 목적

Stage 2는 반복 release에서 복사해 채울 수 있는 GitHub Release note body 템플릿을 만들고, `_templates/README.md`에 새 템플릿의 사용 기준을 연결하는 단계다. Stage 1에서 `.github/release.yml` 도입을 보류하고 수동 body 템플릿을 우선하기로 판단했으므로, 이번 단계는 `mydocs/_templates/github_release_note.md` 작성에 집중했다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `mydocs/_templates/github_release_note.md` | `user 안내`, `developer 검증 기록`, `notes-file 작성 체크` 구조의 GitHub Release body 템플릿 신규 작성 |
| `mydocs/_templates/README.md` | 허용 파일명에 `github_release_note.md` 추가, 실제 위치/작성 시점/필수 섹션/검증 기준 기록 |
| `mydocs/working/task_m030_50_stage2.md` | Stage 2 목적, 산출물, 검증 결과, 다음 단계 영향 기록 |
| `mydocs/orders/20260608.md` | #50 비고를 Stage 2 완료 후 승인 대기로 갱신 |

## 본문 변경 정도 / 본문 무손실 여부

`github_release_note.md`는 신규 파일이다. `_templates/README.md`는 기존 폴더 규칙 본문을 유지하고, 허용 파일명 목록과 GitHub Release note 템플릿 설명 섹션만 추가했다. 기존 템플릿 규칙의 삭제나 재작성은 없다.

## 템플릿 구조

| 섹션 | 목적 |
|---|---|
| `user 안내` | 설치/업데이트, 주요 변경점, 권한/privacy, known limitations, Chrome Web Store 상태를 사용자 관점으로 분리 |
| `developer 검증 기록` | release commit/tag, 포함 PR/issue, package asset, SHA-256 checksum, verification 결과, rollback/follow-up을 maintainer 관점으로 분리 |
| `notes-file 작성 체크` | `gh release create --notes-file`에 전달하기 전 placeholder, 공개 범위, 필수 항목을 확인 |

## 검증 결과

실행 명령:

```bash
rg -n "user|developer|checksum|privacy|Chrome Web Store|asset|verification|rollback|known|SHA-256|notes-file" mydocs/_templates/github_release_note.md mydocs/_templates/README.md
git diff --check
```

결과:

- OK: `github_release_note.md`와 `_templates/README.md`에서 `user`, `developer`, `checksum`, `privacy`, `Chrome Web Store`, `asset`, `verification`, `rollback`, `known`, `SHA-256`, `notes-file` 키워드가 모두 확인됐다.
- OK: 템플릿에 설치/업데이트 안내, 주요 변경점, 권한/privacy 변화, 알려진 제한, Chrome Web Store 상태가 포함됐다.
- OK: 템플릿에 release commit/tag, 포함 PR/issue, package 생성 명령, asset 이름/크기/SHA-256 checksum, verification 결과, rollback/follow-up이 포함됐다.
- OK: `git diff --check`는 whitespace 경고 없이 통과했다.

## 잔여 위험

- 템플릿은 아직 `release_pipeline_guide.md`와 연결되지 않았다. 이 연결은 Stage 3 범위다.
- 실제 release body 언어와 공개 범위는 release 작업마다 승인된 기준에 맞춰 채워야 한다.

## 다음 단계 영향

- Stage 3은 `release_pipeline_guide.md`에 `mydocs/_templates/github_release_note.md`를 복사해 채운 뒤 `gh release create --notes-file`에 전달하는 절차를 추가한다.
- Stage 3은 Stage 1 판단대로 `.github/release.yml`을 추가하지 않고, 보류 사유를 보고서에 기록한다.

## 승인 요청

- Stage 2 산출물과 검증 결과를 승인하면 Stage 3 release pipeline guide 연결로 진행한다.
