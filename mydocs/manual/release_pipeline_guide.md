# Release Pipeline 가이드

## 목적

`crop`의 반복 release, PR CI, Chrome Web Store 제출 package 검증, Dashboard 제출 중단 기준을 한곳에 고정한다. 일반 task PR은 `devel`에 누적하고, 실제 배포 후보는 `devel -> main` release PR과 tag/GitHub Release 이후 Chrome Web Store 제출로 승격한다.

## 범위

이 문서는 maintainer와 에이전트가 release/update 작업에서 따라야 할 운영 절차다.

포함:

- task PR과 release PR의 구분
- PR CI 통과 기준
- Store 제출 ZIP 생성/검증 기준
- `devel -> main` release PR 전 확인
- GitHub Release/tag 생성 전 확인
- Chrome Web Store Dashboard draft 가능 시점과 `Submit for review` 금지/가능 시점
- rollback 또는 제출 중단 기준

제외:

- 실제 version bump 정책
- Chrome Web Store Dashboard 입력값 상세 본문
- Store screenshot, video, small promotional image 제작
- GitHub Release/tag 실제 게시 승인

Dashboard 입력값 자체는 `mydocs/tech/task_m030_37_chrome_web_store_dashboard.md`를 기준으로 한다.

## 강제 규칙

- 일반 task PR은 `local/taskN` -> `publish/taskN` -> `devel` 흐름을 따른다.
- release PR은 `devel -> main`으로만 만든다.
- `main` merge, tag/GitHub Release, Chrome Web Store `Submit for review`는 각각 별도 승인 후 진행한다.
- Chrome Web Store에 올릴 ZIP은 `npm run build`, `npm run package:cws`, `npm run verify:cws`를 같은 기준 브랜치에서 다시 실행해 만든다.
- Chrome Web Store Privacy URL 기본값은 `https://github.com/postmelee/crop/blob/main/PRIVACY.md`다.
- release tag URL은 GitHub Release note, 감사 기록, 특정 version snapshot 확인용으로 사용한다. Store Dashboard Privacy URL을 tag URL로 바꾸려면 별도 승인을 받는다.
- release마다 `PRIVACY.md`의 Last updated와 적용 version 문구를 최신 release 기준으로 확인한다.
- GitHub Release body는 `mydocs/_templates/github_release_note.md`를 기준으로 작성하고, 검증된 notes file을 `gh release create --notes-file`에 전달한다.
- `devel` URL 또는 작업 브랜치 URL을 최종 `PRIVACY.md` URL로 제출하지 않는다.
- `Submit for review` 직전에는 #37 Dashboard guide와 이 문서의 중단 기준을 모두 확인한다.
- `debugger`, `<all_urls>`, broad `host_permissions`, `tabs` 같은 권한이 package 검증에서 나타나면 제출을 중단한다.

## PR CI

`.github/workflows/ci.yml`은 다음 trigger에서 실행된다.

- `pull_request` 대상 `devel`
- `pull_request` 대상 `main`
- `workflow_dispatch`

CI는 다음 순서를 통과해야 한다.

```bash
npm ci
npm run build
npm run typecheck
npm test
npm run package:cws
npm run verify:cws
```

PR 본문에는 CI/원격 검증 결과를 `.github/pull_request_template.md`의 `CI/원격 검증` 표에 기록한다. PR 생성 직후 아직 GitHub Actions run이 없거나 완료되지 않았다면 `SKIP` 또는 `대기`가 아니라 확인 시점을 적고, 완료 후 PR 본문을 갱신한다.

## Task PR 절차

1. 이슈 기준으로 `local/taskN`에서 하이퍼-워터폴 단계를 수행한다.
2. 각 Stage는 보고서와 함께 커밋한다.
3. 최종 보고 후 `publish/taskN`을 원격에 push한다.
4. `devel` 대상 PR을 만든다.
5. PR CI가 통과했는지 확인한다.
6. 리뷰와 승인 후 merge한다.
7. merge 확인 후 `pr-merge-cleanup` 절차로 issue, remote branch, local branch를 정리한다.

Task PR에서는 `main` merge, GitHub Release/tag, Chrome Web Store 제출을 수행하지 않는다.

## Release PR 전 확인

`devel -> main` release PR을 만들기 전에 다음을 확인한다.

```bash
git checkout devel
git pull --ff-only
npm ci
npm run build
npm run typecheck
npm test
npm run package:cws
npm run verify:cws
unzip -l /tmp/crop-0.1.0-cws.zip
unzip -Z1 /tmp/crop-0.1.0-cws.zip
```

확인할 기준:

- `devel`이 최신 원격 상태다.
- CI와 동일한 명령이 로컬에서 통과한다.
- `/tmp/crop-0.1.0-cws.zip` root에 `manifest.json`이 있다.
- ZIP에 `.DS_Store`, `__MACOSX`, `node_modules`, `mydocs`, repository root 문서/config가 없다.
- `manifest.json` 권한은 `activeTab`, `scripting`, `clipboardWrite`, `downloads` 범위를 유지한다.
- `PRIVACY.md`가 `main` 반영 후 `https://github.com/postmelee/crop/blob/main/PRIVACY.md`에서 제출 URL로 사용할 내용을 갖고 있다.
- `PRIVACY.md`의 Last updated와 적용 version 문구가 이번 release version 기준이다.
- `PRIVACY.md`의 privacy/data handling 설명이 실제 권한과 local processing/no server upload/no telemetry 기준과 충돌하지 않는다.
- Chrome Web Store Dashboard에서 필요한 screenshot, video, small promotional image 준비 상태가 확인됐다.

## Release PR 절차

Release PR은 다음 형태로 만든다.

```bash
gh pr create --base main --head devel --title "Release: v{version}"
```

Release PR에서는 다음을 PR 본문에 적는다.

- 포함된 task PR 목록
- PR CI 결과
- package 검증 결과
- privacy policy URL 후보
- Chrome Web Store 제출 가능 여부
- tag/GitHub Release 생성 보류 또는 승인 상태

Release PR이 merge되기 전에는 Chrome Web Store `Submit for review`를 누르지 않는다.

## GitHub Release/tag 전 확인

`main` merge 후 tag/GitHub Release를 만들기 전에 다음을 확인한다.

- `main`이 release PR merge commit을 포함한다.
- `npm run build`, `npm run package:cws`, `npm run verify:cws`를 `main` 기준으로 다시 실행했다.
- `/tmp/crop-0.1.0-cws.zip`가 `main` 기준으로 재생성됐다.
- `https://github.com/postmelee/crop/blob/main/PRIVACY.md`가 Dashboard에 제출할 Chrome Web Store Privacy URL로 유효하다.
- `PRIVACY.md`의 Last updated와 적용 version 문구가 release tag 기준과 일치한다.
- tag URL을 privacy policy URL로 쓰도록 별도 승인됐다면 tag 생성 후 `https://github.com/postmelee/crop/blob/{tag}/PRIVACY.md`가 유효한지 확인한다.
- release note에는 Store 제출 ZIP 생성 명령, asset, SHA-256 checksum, privacy URL, Chrome Web Store 상태, verification 결과를 적는다.

GitHub Release/tag 생성은 별도 승인된 release 단계에서 수행한다.

## GitHub Release note 작성

GitHub Release body는 `mydocs/_templates/github_release_note.md`를 복사해 release별 notes file로 채운다. 원본 템플릿을 직접 release 값으로 덮어쓰지 않는다.

작성 전 확인:

- release tag와 release commit이 확정됐다.
- release 기준에서 `npm run build`, `npm run typecheck`, `npm test`, `npm run package:cws`, `npm run verify:cws`가 통과했다.
- release asset 이름, URL 후보, byte size, SHA-256 checksum을 확인했다.
- Chrome Web Store Privacy URL 기본값인 `https://github.com/postmelee/crop/blob/main/PRIVACY.md`를 확인했다.
- release tag URL을 release note 또는 감사 기록에 적는 경우 `https://github.com/postmelee/crop/blob/{tag}/PRIVACY.md`가 유효한지 확인했다.
- `PRIVACY.md`의 Last updated와 적용 version 문구를 최신 release 기준으로 확인했다.
- Chrome Web Store 상태를 `published`, `submitted for review`, `draft only`, `not submitted` 중 하나로 기록할 수 있다.
- rollback 또는 follow-up 기준을 적을 수 있다.

작성 순서:

1. `mydocs/_templates/github_release_note.md`를 release별 notes file로 복사한다.
2. `user 안내`에는 설치/업데이트, 주요 변경점, 권한/privacy 변화, known limitations, Chrome Web Store 상태만 적는다.
3. `developer 검증 기록`에는 release 기준, 포함 PR/issue, package asset, verification 결과, rollback/follow-up을 적는다.
4. 모든 `{placeholder}`를 실제 값 또는 `해당 없음`으로 바꾼다.
5. 게시 전 `notes-file 작성 체크`를 수행하고, 체크박스 자체를 release body에 남길지 삭제할지 release 작업에서 결정한다.
6. release 생성 시 검증된 notes file을 `--notes-file`로 전달한다.

예시:

```bash
gh release create v{version} /tmp/crop-{version}-cws.zip --title "crop v{version}" --notes-file {filled_notes_file} --verify-tag
```

GitHub 자동 release notes와 `.github/release.yml`은 현재 baseline이 아니다. 자동 생성 notes는 merged PR과 contributor 목록을 보강할 때 쓸 수 있지만, Chrome Web Store 상태, privacy URL, asset checksum, verification 결과를 대체하지 않는다. PR label taxonomy를 release-facing category로 정리하는 별도 task가 생기면 `.github/release.yml` 추가를 다시 검토한다.

## Chrome Web Store Dashboard 절차

Dashboard draft 입력은 release PR 이전에도 준비할 수 있다. 단, 다음 값은 release 기준이 확정되기 전까지 최종 제출값으로 보지 않는다.

- package upload ZIP
- privacy policy URL. 기본값은 `https://github.com/postmelee/crop/blob/main/PRIVACY.md`이며, tag URL은 별도 승인 전까지 최종 Dashboard 값으로 보지 않는다.
- release/tag 기준 설명

`Submit for review` 가능 조건:

- `devel -> main` release PR이 merge됐다.
- `https://github.com/postmelee/crop/blob/main/PRIVACY.md`가 Dashboard의 Chrome Web Store Privacy URL로 입력됐다. tag URL을 쓰는 경우에는 별도 승인과 tag URL 유효성 확인이 끝났다.
- `PRIVACY.md`의 Last updated와 적용 version 문구가 이번 release 기준이다.
- `npm run build`, `npm run package:cws`, `npm run verify:cws`를 release 기준에서 통과했다.
- `/tmp/crop-0.1.0-cws.zip`를 Dashboard에 업로드했다.
- Store screenshot, localized screenshot/video, global fallback asset, small promotional image 준비 상태가 확인됐다.
- #37 Dashboard guide의 privacy disclosure, permission justification, distribution, deferred publishing 확인이 끝났다.
- 제출 직전 작업지시자 승인이 있다.

`deferred publishing` 선택 여부는 제출 전 Dashboard에서 확인한다. 즉시 공개를 원하지 않으면 review submit 과정에서 deferred publishing을 선택한다.

## 제출 중단 기준

아래 중 하나라도 해당하면 Chrome Web Store `Submit for review`를 누르지 않는다.

- `https://github.com/postmelee/crop/blob/main/PRIVACY.md`가 아직 유효하지 않다.
- tag URL을 Dashboard에 쓰도록 별도 승인됐지만 release tag 기준 `PRIVACY.md` URL이 아직 유효하지 않다.
- `PRIVACY.md`의 Last updated 또는 적용 version 문구가 이번 release 기준이 아니다.
- release 기준 ZIP을 재생성하지 않았다.
- `npm run verify:cws`가 실패했다.
- ZIP에 `.DS_Store`, `__MACOSX`, `node_modules`, `mydocs`, repository root 문서/config가 포함된다.
- `manifest.json`에 승인되지 않은 권한이 추가됐다.
- Dashboard package upload 후 표시되는 권한이 문서화된 권한과 다르다.
- Store screenshot, video, small promotional image 같은 필수 asset이 누락됐다.
- localized asset과 description이 기능 범위를 다르게 보이게 한다.
- privacy disclosure가 local processing/no server upload/no telemetry 기준과 충돌한다.
- deferred publishing 의도와 Dashboard 선택 상태가 다르다.
- 작업지시자 제출 승인이 없다.

## Rollback / 보정

Release PR 전 문제가 발견되면 release PR을 만들지 않고 `devel`에서 새 issue-backed task로 보정한다.

Release PR 중 문제가 발견되면 release PR을 merge하지 않는다. 필요한 수정은 새 task PR로 `devel`에 먼저 반영한 뒤 release PR을 갱신한다.

`main` merge 후 Chrome Web Store 제출 전 문제가 발견되면 다음 중 하나를 선택한다.

- 제출을 보류하고 `devel`에서 보정 task를 진행한 뒤 새 release PR을 만든다.
- 이미 tag/GitHub Release가 있으면 보정 release/tag를 별도 승인 후 만든다.
- Store Dashboard draft만 수정 가능한 문제면 Dashboard 값을 수정하고 제출 전 체크리스트를 다시 수행한다.

이미 Chrome Web Store review submit 후 문제가 발견되면 Dashboard에서 가능한 범위 내에서 review 취소 또는 새 version 제출 절차를 확인하고, 별도 incident/task로 추적한다.

## 예외

- hotfix라도 `main`에 직접 commit하지 않는다. 최소한 release PR 또는 승인된 hotfix PR을 사용한다.
- package artifact upload를 GitHub Actions artifact로 보관하는 release workflow는 현재 baseline이 아니다. 필요하면 별도 task에서 추가한다.
- source map 포함/제외 정책을 바꾸려면 Store package 검증 기준과 Dashboard 설명을 함께 갱신한다.

## 관련 매뉴얼

- [`git_workflow_guide.md`](git_workflow_guide.md): branch, task PR, release PR 기본 흐름.
- [`release_update_protocol.md`](release_update_protocol.md): Hyper-Waterfall release/tag와 update protocol.
- [`task_workflow_guide.md`](task_workflow_guide.md): issue-backed task와 단계 승인 절차.
- [`pr_command_guide.md`](pr_command_guide.md): PR 생성 명령과 문서 링크 규칙.
- [`../skills/pr-merge-cleanup/SKILL.md`](../skills/pr-merge-cleanup/SKILL.md): PR merge 후 정리 절차.
- [`../tech/task_m030_37_chrome_web_store_dashboard.md`](../tech/task_m030_37_chrome_web_store_dashboard.md): Chrome Web Store Dashboard 입력값과 제출 체크리스트.
