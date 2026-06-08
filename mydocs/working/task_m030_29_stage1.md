# Task #29 Stage 1 보고서 - Community Profile 감사와 문서 범위 확정

GitHub Issue: [#29](https://github.com/postmelee/crop/issues/29)
구현계획서: [`task_m030_29_impl.md`](../plans/task_m030_29_impl.md)
Stage: 1

## 단계 목적

GitHub Community Standards 보강을 시작하기 전에 현재 저장소의 community profile 상태, default branch 기준 community health file, `.github` 템플릿 구조, README/PR template 상태를 확인했다.

이번 단계는 감사와 범위 확정 단계다. 공식 community health file 생성이나 `.github/ISSUE_TEMPLATE/task.yml` 수정은 아직 수행하지 않았다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `mydocs/working/task_m030_29_stage1.md` | Community Profile 감사 결과, 범위 확정, 검증 결과 기록 |
| `mydocs/orders/20260608.md` | #29 비고를 Stage 1 완료 후 Stage 2 승인 대기로 갱신 |

## 본문 변경 정도 / 본문 무손실 여부

공식 문서와 제품 문서는 변경하지 않았다. 기존 `.github/ISSUE_TEMPLATE/task.yml`, `.github/pull_request_template.md`, `README.md`는 읽기 전용으로 확인했고 본문 손실은 없다.

## 감사 결과

### Community Profile API

`gh api repos/postmelee/crop/community/profile` 결과:

- `health_percentage`: 57
- `documentation`: Chrome Web Store URL로 인식됨
- `readme`: `README.md` 인식됨
- `license`: `LICENSE` 인식됨
- `pull_request_template`: `.github/pull_request_template.md` 인식됨
- `code_of_conduct`: `null`
- `contributing`: `null`
- `issue_template`: `null`

### GitHub Community Standards page

`curl -L https://github.com/postmelee/crop/community`로 HTML을 확인했다.

- `Description`: Added
- `README`: Added
- `Code of conduct`: Not added yet
- `Contributing`: Not added yet
- `License`: Added
- `Security policy`: Not added yet
- `Issue templates`: Added
- `Pull request template`: Added

중요한 관찰: API의 `files.issue_template`은 `null`이지만 Community Standards page HTML은 `Issue templates`를 Added로 표시한다. 따라서 이슈 #29의 "issue template 미인식"은 GitHub UI 기준 미인식이라기보다 Community Profile API 필드와 Community Standards UI 표시의 불일치로 보는 것이 맞다.

### Default branch와 원격 기준

- 저장소 default branch는 `main`이다.
- `origin/main`: `53808a2 Merge pull request #47 from postmelee/publish/task46`
- `origin/devel`: `83c4c96 Merge pull request #49 from postmelee/publish/task48`
- 원격 `main`에는 `.github/ISSUE_TEMPLATE/task.yml`이 존재한다.
- `origin/main..origin/devel` 사이에서 `.github`, README, community health file 후보(`CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `SUPPORT.md`) 차이는 없다.

### Issue template 상태

로컬과 default branch의 `.github/ISSUE_TEMPLATE/task.yml`은 다음 조건을 갖춘 GitHub issue form이다.

- `.github/ISSUE_TEMPLATE/` 아래 `.yml` 파일
- top-level `name`
- top-level `description`
- top-level `body`

GitHub 공식 문서는 issue form을 `.github/ISSUE_TEMPLATE` 아래 YAML 파일로 만들며, community profile checklist 표시는 issue form이 유효한 `name`과 `description`을 가져야 한다고 설명한다.

참고:

- https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/about-issue-and-pull-request-templates
- https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms

`https://github.com/postmelee/crop/issues/new/choose`는 비로그인 HTTP 접근에서 GitHub login page로 redirect되어 template chooser 내용은 직접 확인하지 못했다. 대신 Community Standards page HTML에서 `Issue templates` Added 상태를 확인했다.

## 범위 확정

| 항목 | Stage 1 판단 | 후속 처리 |
|---|---|---|
| `CONTRIBUTING.md` | 추가 | Stage 2에서 작성 |
| `CODE_OF_CONDUCT.md` | 추가 | Stage 2에서 작성 |
| `.github/ISSUE_TEMPLATE/task.yml` | 현 schema는 기본 조건 충족. API null과 UI Added 불일치가 핵심 | Stage 3에서 파일 본문 최소 정리 필요 여부만 재검토 |
| `.github/ISSUE_TEMPLATE/config.yml` | 필수 아님 | Stage 3에서 blank issue 정책이나 chooser 안내가 필요할 때만 추가 |
| 추가 issue form | 이번 task 기본 범위에서는 보류 | bug/feature/security 분리 필요가 커지면 별도 승인 필요 |
| `SECURITY.md` | 추가 후보 | Stage 4에서 짧은 보안 제보 정책으로 작성 |
| `SUPPORT.md` | 독립 파일은 보류 | README/CONTRIBUTING에서 GitHub Issues 중심 지원 안내로 처리 |
| `README.md` | 링크 정리 후보 | #51 병합 결과를 우선한 뒤 Stage 4에서 최소 링크만 추가 |

## 검증 결과

실행 명령:

```bash
git status --short --branch
gh api repos/postmelee/crop/community/profile
gh api repos/postmelee/crop --jq '{default_branch:.default_branch, homepage:.homepage, description:.description, has_issues:.has_issues, html_url:.html_url}'
sed -n '1,260p' .github/ISSUE_TEMPLATE/task.yml
sed -n '1,220p' .github/pull_request_template.md
sed -n '1,220p' README.md
find .github -maxdepth 3 -type f | sort
git ls-remote --heads origin main devel
git show --no-patch --oneline origin/devel
gh api 'repos/postmelee/crop/contents/.github/ISSUE_TEMPLATE/task.yml?ref=main' --jq '{name:.name, path:.path, sha:.sha, html_url:.html_url, size:.size}'
curl -L https://github.com/postmelee/crop/community
curl -L https://github.com/postmelee/crop/issues/new/choose
git diff --check
```

결과:

- OK: `git status --short --branch`는 `local/task29...origin/devel [ahead 2]`에서 시작했다.
- OK: Community Profile API는 현재 health percentage 57과 누락 항목을 확인했다.
- OK: 저장소 default branch가 `main`, homepage가 Chrome Web Store URL임을 확인했다.
- OK: `.github/ISSUE_TEMPLATE/task.yml`은 GitHub issue form의 기본 top-level key를 갖고 있다.
- OK: `.github/pull_request_template.md`는 default branch 기준 Community Profile API에서 인식된다.
- OK: `.github` 파일은 `.github/ISSUE_TEMPLATE/task.yml`, `.github/pull_request_template.md`, `.github/workflows/ci.yml`로 확인된다.
- OK: 원격 `main`과 `devel` head를 확인했다.
- OK: default branch `main`에 `.github/ISSUE_TEMPLATE/task.yml`이 존재한다.
- OK: Community Standards page HTML에서 `Issue templates`는 Added, `Code of conduct`, `Contributing`, `Security policy`는 Not added yet으로 확인했다.
- MISS: issue creation chooser는 비로그인 HTTP 접근에서 GitHub login page로 redirect되어 직접 template 목록을 확인하지 못했다.
- OK: `git diff --check`는 경고 없이 통과했다.

## 잔여 위험

- Community Profile API의 `files.issue_template`은 계속 `null`이지만 UI는 `Issue templates` Added로 표시한다. Stage 3에서 이 불일치를 다시 확인하되, schema 변경으로 해결할 수 없는 GitHub API 표시 문제일 가능성이 있다.
- `SECURITY.md`는 추가 가치가 있지만, 저장소의 private vulnerability reporting 활성화 여부는 현재 API 출력만으로 확정하지 못했다. Stage 4에서는 민감한 취약점은 공개 issue로 올리지 말라는 최소 정책과 maintainer 연락 경로를 보수적으로 작성해야 한다.
- #51이 README를 동시에 수정 중이므로 Stage 4 README 링크 정리는 #51 병합 또는 rebase 이후로 미룬다.

## 다음 단계 영향

- Stage 2는 `CONTRIBUTING.md`와 `CODE_OF_CONDUCT.md` 작성으로 진행한다.
- `CONTRIBUTING.md`는 외부 기여자가 내부 하이퍼-워터폴 산출물을 직접 작성해야 한다고 요구하지 않고, issue/PR 기반 기대사항과 maintainer 전환 원칙을 설명해야 한다.
- `CODE_OF_CONDUCT.md`는 공개 저장소의 최소 행동 기준과 신고/연락 경로를 포함하되, 법률 자문이 필요한 조직 정책처럼 확장하지 않는다.

## 승인 요청

- Stage 1 산출물과 검증 결과를 승인하면 Stage 2로 진행한다.
