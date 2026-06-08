# Task #29 Stage 3 보고서 - Issue template 인식 문제 수정

GitHub Issue: [#29](https://github.com/postmelee/crop/issues/29)
구현계획서: [`task_m030_29_impl.md`](../plans/task_m030_29_impl.md)
Stage: 3

## 단계 목적

`.github/ISSUE_TEMPLATE/task.yml`이 GitHub issue form schema와 Community Standards 인식 조건을 만족하는지 재확인하고, 실제 수정이 필요한 문제인지 판단했다.

Stage 1에서 확인한 API/UI 불일치가 계속 재현되는지 다시 대조하고, issue chooser 동작을 명시하기 위한 최소 설정만 추가했다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `.github/ISSUE_TEMPLATE/config.yml` | blank issue 허용 여부와 GitHub Discussions contact link를 명시 |
| `mydocs/working/task_m030_29_stage3.md` | issue form 검증 결과, API/UI 대조, 잔여 위험 기록 |
| `mydocs/orders/20260608.md` | #29 비고를 Stage 3 완료 후 Stage 4 승인 대기로 갱신 |

## 본문 변경 정도 / 본문 무손실 여부

기존 `.github/ISSUE_TEMPLATE/task.yml` 본문은 변경하지 않았다. YAML 파싱과 issue form 필수 키 확인 결과 현재 파일은 `name`, `description`, `body`를 갖춘 유효한 issue form 구조였고, GitHub Community Standards UI에서도 이미 `Issue templates`가 Added로 표시됐다.

따라서 schema 문제가 확인되지 않은 상태에서 기존 task template을 재작성하지 않았다. 대신 `.github/ISSUE_TEMPLATE/config.yml`을 추가해 blank issue를 명시적으로 허용하고, 질문과 아이디어는 GitHub Discussions로 안내할 수 있게 했다.

## 검증 결과

실행 명령:

```bash
git status --short --branch
sed -n '1,300p' .github/ISSUE_TEMPLATE/task.yml
test -f .github/ISSUE_TEMPLATE/config.yml && sed -n '1,200p' .github/ISSUE_TEMPLATE/config.yml || true
find .github/ISSUE_TEMPLATE -maxdepth 1 -type f -print
ruby -e 'require "psych"; y=Psych.load_file(".github/ISSUE_TEMPLATE/task.yml"); abort("not hash") unless y.is_a?(Hash); %w[name description body].each { |k| abort("missing #{k}") unless y.key?(k) }; abort("body not array") unless y["body"].is_a?(Array); puts "OK yaml issue form: #{y["name"]} body=#{y["body"].length}"'
gh api repos/postmelee/crop/community/profile
gh api repos/postmelee/crop --jq '{default_branch:.default_branch, has_issues:.has_issues, has_discussions:.has_discussions, html_url:.html_url}'
curl -L -s -o /private/tmp/crop-community-task29.html -w 'HTTP %{http_code} %{url_effective}\n' https://github.com/postmelee/crop/community
curl -L -s --max-time 20 -o /private/tmp/crop-issues-new-choose-task29.html -w 'HTTP %{http_code} %{url_effective}\n' https://github.com/postmelee/crop/issues/new/choose
rg -n "Issue templates|Code of conduct|Contributing|Security policy|Added|Not added" /private/tmp/crop-community-task29.html
rg -n "Hyper-Waterfall Task|Task:" /private/tmp/crop-issues-new-choose-task29.html || true
git diff --check
```

결과:

- OK: `task.yml`은 YAML 파싱에 성공했고 `name`, `description`, `body` 필수 키를 포함한다.
- OK: `task.yml`의 `body`는 배열이며 현재 항목 수는 10개다.
- OK: default branch `main`에도 `.github/ISSUE_TEMPLATE/task.yml`이 존재하고 로컬 파일과 같은 구조다.
- OK: 저장소는 issues와 discussions가 모두 활성화되어 있다.
- OK: `gh api repos/postmelee/crop/community/profile`은 여전히 `files.issue_template: null`을 반환했다.
- OK: `https://github.com/postmelee/crop/community`는 HTTP 200으로 조회됐고, HTML에서 `Issue templates`는 `Added`로 표시됐다.
- MISS: `https://github.com/postmelee/crop/issues/new/choose`는 비로그인 `curl` 접근에서 GitHub login page로 redirect되어 template chooser 화면의 `Hyper-Waterfall Task` 노출은 직접 확인하지 못했다.
- OK: `.github/ISSUE_TEMPLATE/config.yml`을 추가한 뒤 issue template 디렉터리에는 `config.yml`, `task.yml` 두 파일이 존재한다.
- OK: `git diff --check`는 경고 없이 통과했다.

## 잔여 위험

- Community Profile API의 `files.issue_template: null`은 계속 재현된다. 하지만 Community Standards UI가 `Issue templates`를 Added로 표시하고 `task.yml` schema가 유효하므로, 현재까지는 API 필드와 UI checklist의 표현 차이로 보는 것이 가장 타당하다.
- issue creation chooser는 비로그인 HTTP 접근에서 GitHub login page로 redirect되어 자동 검증하지 못했다. PR 병합 후 브라우저 로그인 세션에서 `https://github.com/postmelee/crop/issues/new/choose`를 한 번 더 눈으로 확인하는 것이 좋다.
- `.github/ISSUE_TEMPLATE/config.yml`은 이 브랜치가 default branch에 병합된 뒤 GitHub UI에 반영된다.

## 다음 단계 영향

- Stage 4에서는 `SECURITY.md`, `.github/FUNDING.yml`, Discussions 후보 문안, 필요 시 README community 링크를 처리한다.
- `SUPPORT.md` 독립 파일은 Stage 1 판단대로 기본 보류하되, Stage 4에서 README/CONTRIBUTING의 support 안내와 모순이 없는지 확인한다.
- Stage 4 최종 검증에서도 Community Profile API와 UI를 다시 대조한다. API의 `issue_template` null 자체를 PR 전 단계에서 완전히 제거하는 것은 보장하지 않는다.

## 승인 요청

- Stage 3 산출물과 검증 결과를 승인하면 Stage 4로 진행한다.
