# `_templates/` 폴더 규칙

## 목적

하이퍼-워터폴 산출물의 출력 형식을 중앙에서 정의한다.

## 답하는 질문

"이 문서는 어떤 섹션과 제약으로 작성해야 하는가?"

## 작성 시점

새 산출물 종류가 추가되거나 기존 산출물 출력 형식을 바꿀 때.

## 허용 파일명

- `orders.md`
- `task_plan.md`
- `task_impl_plan.md`
- `stage_report.md`
- `final_report.md`
- `feedback.md`
- `tech_note.md`
- `troubleshooting.md`
- `external_pr_review.md`
- `external_pr_review_impl.md`
- `external_pr_report.md`
- `github_release_note.md`
- 그 밖에 산출물 종류가 드러나는 이름

## GitHub Release note 템플릿

`github_release_note.md`는 GitHub Release body를 작성할 때 사용하는 출력 템플릿이다.

| 항목 | 기준 |
|---|---|
| 실제 파일 위치 | `mydocs/_templates/github_release_note.md` |
| 작성 시점 | release tag/GitHub Release 생성 전, release 기준 commit과 Store package asset 검증이 끝난 뒤 |
| 작성 언어 | 템플릿 설명은 한국어. 실제 release body는 release 작업에서 승인된 공개 언어로 채우되 섹션 구조를 유지한다. |
| 필수 섹션 | `user 안내`, `developer 검증 기록`, `notes-file 작성 체크` |
| 필수 항목 | Chrome Web Store 상태, privacy URL, package asset, SHA-256 checksum, verification 결과, rollback/follow-up |
| 사용 명령 | `gh release create v{version} {asset_path} --notes-file {filled_notes_file}` |
| 검증 기준 | `user`, `developer`, `checksum`, `privacy`, `Chrome Web Store`, `asset`, `verification`, `rollback`, `known`, `SHA-256`, `notes-file` 키워드가 템플릿에 있어야 한다. |

## 사용 템플릿

해당 없음. 이 폴더 자체가 템플릿 진실 원천이다.

## 반드시 포함할 내용

- 실제 파일 위치
- 작성 시점
- 작성 언어
- 필수 섹션
- 선택 섹션
- 검증 또는 승인 기준

## 두면 안 되는 내용

- 특정 task의 실제 검증 로그
- 완료 보고
- 작업지시자 승인 기록

## 다음 세션 AI가 복원해야 할 맥락

산출물별 출력 형식과, 어느 폴더에 어떤 문서를 만들어야 하는지.
