# Task #54 구현계획서 - v0.1.0 GitHub Release body 소급 표준화

수행계획서: [`task_m030_54.md`](task_m030_54.md)
GitHub Issue: [#54](https://github.com/postmelee/crop/issues/54)
마일스톤: M030

## 단계 개요

| Stage | 제목 | 주요 산출 | 검증 |
|---|---|---|---|
| 1 | 현재 release 상태와 기준값 확인 | `mydocs/tech/task_m030_54_v010_release_body.md`, `mydocs/working/task_m030_54_stage1.md` | GitHub Release metadata/body, asset checksum, privacy URL, #48/#50 근거 대조 |
| 2 | v0.1.0 release body 초안 작성 | `mydocs/tech/task_m030_54_v010_release_body.md`, `mydocs/working/task_m030_54_stage2.md` | #50 템플릿 필수 섹션과 실제 기준값 반영 여부 확인 |
| 3 | 승인된 body를 GitHub Release에 반영 | GitHub Release `v0.1.0` body, `mydocs/tech/task_m030_54_v010_release_body.md`, `mydocs/working/task_m030_54_stage3.md` | 원격 body 업데이트 확인, tag/title/asset/draft/prerelease 상태 불변 확인 |
| 4 | 통합 검증과 최종 보고 | `mydocs/working/task_m030_54_stage4.md`, `mydocs/report/task_m030_54_report.md`, `mydocs/orders/20260608.md` | 최종 grep, 원격 release 재조회, status/diff 확인 |

## 문서 위치 확인

수행계획서의 "문서 위치 판단"과 실제 Stage 산출물 경로를 다음과 같이 일치시킨다. 이번 task는 공식 사용자 문서 루트를 새로 만들지 않고, 공개 GitHub Release body의 현재 상태와 승인 초안, update 전후 비교, 검증 근거를 task-specific 기술 노트에 둔다.

| 파일 | 수행계획서상 선택 위치 | Stage 산출물 경로 | 일치 여부 | 비고 |
|---|---|---|---|---|
| GitHub Release `v0.1.0` body | GitHub Release | GitHub Release `v0.1.0` | OK | Stage 3에서 별도 승인 후 body만 수정 |
| `mydocs/tech/task_m030_54_v010_release_body.md` | `mydocs/tech/` | `mydocs/tech/task_m030_54_v010_release_body.md` | OK | 현재 body, 기준값, 승인 초안, 전후 비교, 검증 근거 |
| `mydocs/plans/task_m030_54_impl.md` | `mydocs/plans/` | `mydocs/plans/task_m030_54_impl.md` | OK | 구현계획서 |
| `mydocs/working/task_m030_54_stage{N}.md` | `mydocs/working/` | `mydocs/working/task_m030_54_stage{N}.md` | OK | 단계별 완료 보고서 |
| `mydocs/report/task_m030_54_report.md` | `mydocs/report/` | `mydocs/report/task_m030_54_report.md` | OK | 최종 보고서 |

## 수용 기준 고정

- `v0.1.0` GitHub Release body가 #50 템플릿의 `user 안내`와 `developer 검증 기록` 분리 구조를 따른다.
- Chrome Web Store 상태, privacy URL, release asset, SHA-256 checksum, verification 결과가 body에 포함된다.
- release tag, title, asset URL, asset size, draft/prerelease 상태는 변경하지 않는다.
- release body 수정 전후 차이와 검증 결과가 task 산출물에 남는다.
- 새 tag, 새 GitHub Release, asset 교체/삭제/재업로드, version bump, Chrome Web Store Dashboard 작업은 수행하지 않는다.
- 공개 body에는 내부 승인 로그, 미확인 추정, 템플릿 작성 체크박스를 남기지 않는다.

## Stage 1 - 현재 release 상태와 기준값 확인

### 산출물

신규:

- `mydocs/tech/task_m030_54_v010_release_body.md`
- `mydocs/working/task_m030_54_stage1.md`

수정:

- 필요 시 `mydocs/orders/20260608.md`

### 변경 내용

- `gh release view`로 현재 `v0.1.0` Release metadata, title, draft/prerelease 상태, asset 목록, body를 확인한다.
- Release asset `crop-0.1.0-cws.zip`을 임시 경로에 다운로드해 size와 SHA-256 checksum을 확인한다.
- `PRIVACY.md`의 `v0.1.0` tag 기준 URL과 contents SHA를 GitHub API로 확인한다.
- #48 최종 보고서의 release 기준값과 #50 템플릿/최종 보고서의 요구 항목을 대조한다.
- 원격 GitHub Release는 수정하지 않는다.
- 확인한 현재 body와 기준값을 `mydocs/tech/task_m030_54_v010_release_body.md`에 기록한다.

### 검증

```bash
gh release view v0.1.0 --repo postmelee/crop --json tagName,name,url,isDraft,isPrerelease,assets,body
gh release download v0.1.0 --repo postmelee/crop --pattern 'crop-0.1.0-cws.zip' --dir /tmp/crop-task54-release-check-stage1
shasum -a 256 /tmp/crop-task54-release-check-stage1/crop-0.1.0-cws.zip
wc -c /tmp/crop-task54-release-check-stage1/crop-0.1.0-cws.zip
gh api repos/postmelee/crop/contents/PRIVACY.md?ref=v0.1.0 --jq '.html_url, .sha'
rg -n "v0.1.0|crop-0.1.0-cws.zip|SHA-256|privacy|Chrome Web Store|현재 body|변경하지" mydocs/tech/task_m030_54_v010_release_body.md mydocs/working/task_m030_54_stage1.md
git diff --check
```

### 커밋

```text
Task #54 Stage 1: v0.1.0 release 기준값 확인
```

## Stage 2 - v0.1.0 release body 초안 작성

### 산출물

신규:

- `mydocs/working/task_m030_54_stage2.md`

수정:

- `mydocs/tech/task_m030_54_v010_release_body.md`
- 필요 시 `mydocs/orders/20260608.md`

### 변경 내용

- `mydocs/_templates/github_release_note.md` 구조를 기준으로 `v0.1.0`용 공개 body 초안을 작성한다.
- `{placeholder}`를 Stage 1에서 확인한 실제 값 또는 `해당 없음`으로 치환한다.
- 공개 body에는 템플릿 주석과 `notes-file 작성 체크` 체크박스를 남기지 않는다.
- `user 안내`에는 설치/업데이트, 주요 변경점, 권한과 privacy, known limitations, Chrome Web Store 상태를 둔다.
- `developer 검증 기록`에는 release 기준, package asset, verification 결과, rollback/follow-up을 둔다.
- 원격 GitHub Release update 전에 초안을 보고하고 작업지시자 승인을 요청한다.

### 검증

```bash
rg -n "user 안내|developer 검증 기록|Chrome Web Store|privacy|asset|SHA-256|verification|rollback|follow-up" mydocs/tech/task_m030_54_v010_release_body.md
rg -n "\\{[a-zA-Z0-9_ -]+\\}|notes-file 작성 체크|미확인|TODO" mydocs/tech/task_m030_54_v010_release_body.md
git diff --check
```

두 번째 `rg`는 남으면 실패로 본다. 공개 body 초안에 placeholder, 체크박스, 미확인 추정, TODO가 남아 있지 않아야 한다.

### 승인 게이트

Stage 2 완료보고서 승인 전에는 Stage 3을 시작하지 않는다. 원격 GitHub Release body update는 Stage 2 초안 승인 후에만 수행한다.

### 커밋

```text
Task #54 Stage 2: v0.1.0 release body 초안 작성
```

## Stage 3 - 승인된 body를 GitHub Release에 반영

### 산출물

신규:

- `mydocs/working/task_m030_54_stage3.md`

수정:

- GitHub Release `v0.1.0` body
- `mydocs/tech/task_m030_54_v010_release_body.md`
- 필요 시 `mydocs/orders/20260608.md`

### 변경 내용

- Stage 2에서 승인된 body만 임시 notes file로 저장한다.
- `gh release edit v0.1.0 --repo postmelee/crop --notes-file {승인된_notes_file}`로 원격 Release body만 수정한다.
- release tag, title, asset, draft/prerelease 상태 변경 옵션은 사용하지 않는다.
- update 직후 `gh release view`로 body와 metadata를 재조회한다.
- update 전후 body 요약과 asset/tag/title/draft/prerelease 불변 확인을 기술 노트와 Stage 3 보고서에 기록한다.

### 검증

```bash
gh release view v0.1.0 --repo postmelee/crop --json tagName,name,url,isDraft,isPrerelease,assets,body
gh release download v0.1.0 --repo postmelee/crop --pattern 'crop-0.1.0-cws.zip' --dir /tmp/crop-task54-release-check-stage3
shasum -a 256 /tmp/crop-task54-release-check-stage3/crop-0.1.0-cws.zip
wc -c /tmp/crop-task54-release-check-stage3/crop-0.1.0-cws.zip
rg -n "user 안내|developer 검증 기록|Chrome Web Store|privacy|asset|SHA-256|verification" mydocs/tech/task_m030_54_v010_release_body.md mydocs/working/task_m030_54_stage3.md
rg -n "tag|title|asset|draft|prerelease|변경하지|불변" mydocs/tech/task_m030_54_v010_release_body.md mydocs/working/task_m030_54_stage3.md
git diff --check
```

### 커밋

```text
Task #54 Stage 3: v0.1.0 release body 반영
```

## Stage 4 - 통합 검증과 최종 보고

### 산출물

신규:

- `mydocs/working/task_m030_54_stage4.md`
- `mydocs/report/task_m030_54_report.md`

수정:

- `mydocs/orders/20260608.md`
- 필요 시 `mydocs/tech/task_m030_54_v010_release_body.md`

### 변경 내용

- Stage 1~3 산출물과 원격 `v0.1.0` Release 상태를 통합 대조한다.
- #54 수용 기준과 제외 범위를 최종 보고서에 정리한다.
- 원격 Release body가 #50 템플릿 구조를 따르는지 확인한다.
- release asset, tag, version, Chrome Web Store Dashboard 상태가 변경되지 않았음을 기록한다.
- 오늘할일을 완료 후보로 갱신한다.

### 검증

```bash
gh release view v0.1.0 --repo postmelee/crop --json tagName,name,url,isDraft,isPrerelease,assets,body
rg -n "v0.1.0|checksum|privacy|Chrome Web Store|asset|verification|SHA-256|user 안내|developer 검증 기록|#54" mydocs/tech mydocs/working mydocs/report
rg -n "새 tag|새 GitHub Release|asset 교체|version bump|Chrome Web Store Dashboard|변경하지|제외" mydocs/working/task_m030_54_stage4.md mydocs/report/task_m030_54_report.md
git diff --check
git status --short
```

### 커밋

```text
Task #54 Stage 4: release body 소급 표준화 검증
```

## 최종 보고와 PR 준비

Stage 4 완료와 승인 후 `task-final-report` 절차로 진행한다.

예상 산출물:

- `mydocs/report/task_m030_54_report.md`
- `publish/task54` 원격 브랜치
- `devel` 대상 PR

## 승인 요청 사항

- 위 Stage 1~4 구현계획과 산출물 경계를 승인한다.
- Stage 2 완료 후 승인된 초안만 Stage 3에서 원격 GitHub Release body에 반영하는 절차를 승인한다.
- Stage 1은 읽기 전용으로 진행하고, Stage 3 전에는 원격 Release 수정 작업을 수행하지 않는 경계를 승인한다.
