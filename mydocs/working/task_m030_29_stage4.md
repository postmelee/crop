# Task #29 Stage 4 보고서 - community 문서 링크와 funding 정리

GitHub Issue: [#29](https://github.com/postmelee/crop/issues/29)
구현계획서: [`task_m030_29_impl.md`](../plans/task_m030_29_impl.md)
Stage: 4

## 단계 목적

GitHub Community Standards 보강의 마지막 구현 단계로 보안 정책, GitHub Sponsors 설정, GitHub Discussions 게시글을 준비하고 게시했다.

GitHub Discussions category 설정 변경, GitHub 저장소 설정 변경, GitHub Sponsors profile 변경은 수행하지 않았다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `SECURITY.md` | 보안 취약점 제보 경로, 지원 범위, 응답 기대치를 English canonical 문서로 추가 |
| `.github/FUNDING.yml` | GitHub Sponsors 계정 `postmelee`를 Funding 설정에 추가 |
| GitHub Discussions #57~#61 | `crop` 소개, 첫 사용 안내, 피드백 요청, 제약/로드맵, 후원 안내 Discussion 5개 게시 |
| GitHub Discussion #63 | 다음 언어 지원 조사를 위한 Polls category Discussion 게시 |
| `mydocs/working/task_m030_29_stage4.md` | Stage 4 검증 결과와 잔여 위험 기록 |
| `mydocs/orders/20260608.md` | #29 비고를 Stage 4 완료 후 최종 보고 승인 대기로 갱신 |

## 본문 변경 정도 / 본문 무손실 여부

기존 community 문서와 README 본문은 수정하지 않았다.

- `SUPPORT.md`는 Stage 1 판단대로 독립 파일을 만들지 않았다. 질문과 사용 지원은 `CONTRIBUTING.md`의 Questions and discussions 안내와 Stage 3에서 추가한 issue template contact link로 처리한다.
- README 링크 추가는 보류했다. 현재 README는 다국어 파일(`README.ko.md`, `README.zh-CN.md`, `README.ja.md`)을 함께 운영하므로, root README만 community 링크를 추가하면 번역 README와 차이가 생긴다. 이번 Stage의 승인된 문서 위치를 넘기지 않기 위해 README는 변경하지 않았다.
- `SECURITY.md`는 GitHub가 인식하는 root security policy로 작성했다. 민감한 보안 정보는 public Issue/Discussion에 쓰지 말고, 가능한 경우 private vulnerability reporting 또는 maintainer private follow-up 경로를 쓰도록 안내한다.
- `.github/FUNDING.yml`은 GitHub Sponsors 설정만 추가했다. 후원은 선택 사항이며 issue/PR 우선순위를 바꾸지 않는다는 문구는 GitHub Discussion #61에 둔다.
- 초안 본문 파일은 `mydocs/working/`에서 제거했다. 실제 게시글 본문은 GitHub Discussions에 있고, 보고서에는 URL만 기록한다.
- #57~#61 본문은 heading, list, table 중심 Markdown으로 재편집했다. #59는 Ideas category를 유지하면서 reaction voting 표를 추가했다.
- #63은 다음 언어 지원 우선순위를 조사하는 Polls category Discussion으로 추가했다.

## 게시된 Discussions

| 번호 | 카테고리 | 제목 | URL |
|---|---|---|---|
| #57 | Announcements | Introducing crop: precise page screenshots for Chrome | https://github.com/postmelee/crop/discussions/57 |
| #58 | Q&A | Getting started with crop | https://github.com/postmelee/crop/discussions/58 |
| #59 | Ideas | What should crop handle better? | https://github.com/postmelee/crop/discussions/59 |
| #60 | Announcements | Known limits and near-term direction for crop | https://github.com/postmelee/crop/discussions/60 |
| #61 | General | Supporting crop development | https://github.com/postmelee/crop/discussions/61 |
| #63 | Polls | Which language should crop support next? | https://github.com/postmelee/crop/discussions/63 |

## 검증 결과

실행 명령:

```bash
ls CONTRIBUTING.md CODE_OF_CONDUCT.md
sed -n '1,120p' .github/FUNDING.yml
test -f SECURITY.md && sed -n '1,260p' SECURITY.md || true
test -f SUPPORT.md && sed -n '1,240p' SUPPORT.md || true
gh api graphql -f query='query { repository(owner:"postmelee", name:"crop") { discussions(first: 10, orderBy: {field: CREATED_AT, direction: DESC}) { nodes { number title url category { name } } } } }'
ruby -e 'require "psych"; p Psych.load_file(".github/FUNDING.yml")'
rg -n "CONTRIBUTING|CODE_OF_CONDUCT|SECURITY|SUPPORT|FUNDING|Sponsor|Sponsors|Issue|Pull Request|security|conduct" README.md CONTRIBUTING.md CODE_OF_CONDUCT.md .github mydocs/working SECURITY.md
gh api repos/postmelee/crop/community/profile
gh api user --jq .login
curl -L -s -o /private/tmp/crop-community-task29-stage4.html -w 'HTTP %{http_code} %{url_effective}\n' https://github.com/postmelee/crop/community
curl -L -s -o /private/tmp/crop-sponsors-task29.html -w 'HTTP %{http_code} %{url_effective}\n' https://github.com/sponsors/postmelee
rg -n "Issue templates|Code of conduct|Contributing|Security policy|Added|Not added" /private/tmp/crop-community-task29-stage4.html
rg -n "affiliated|endorsed|sponsored|official|Mozilla|Firefox|debugger|<all_urls>|telemetry|upload|Sponsors|sponsor" SECURITY.md mydocs/working/task_m030_29_stage4.md .github/FUNDING.yml
find .github -maxdepth 3 -type f -print | sort
git diff --check
git status --short
```

결과:

- OK: `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`가 존재한다.
- OK: `.github/FUNDING.yml`은 `github: [postmelee]`로 작성됐다.
- OK: `.github/FUNDING.yml`은 YAML 파싱 결과 `{"github"=>["postmelee"]}`로 읽힌다.
- OK: `SECURITY.md`가 존재하며 공개 이슈에 민감 정보를 쓰지 말라는 안내, 지원 범위, 응답 기대치를 포함한다.
- OK: `SUPPORT.md`는 존재하지 않는다. Stage 1 판단대로 독립 support file은 보류했다.
- OK: GitHub Discussions #57~#61이 생성됐고 각 URL, 제목, 카테고리를 GraphQL 조회로 확인했다.
- OK: GitHub Discussions #57~#61 본문을 heading 기반 Markdown 구조로 업데이트했다.
- OK: #59는 Ideas category를 유지하고 reaction voting 표를 포함한다.
- OK: #63 언어 지원 조사는 Polls category로 생성됐고 reaction voting 표를 포함한다.
- OK: GitHub API의 현재 인증 사용자 login은 `postmelee`다.
- OK: `https://github.com/sponsors/postmelee`는 HTTP 200으로 조회됐다.
- OK: `https://github.com/postmelee/crop/community`는 HTTP 200으로 조회됐다.
- OK: Community Standards UI HTML에서 `Issue templates`는 `Added`로 표시된다.
- MISS: Community Profile API는 default branch 기준이라 이 브랜치의 `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `.github/FUNDING.yml`을 아직 반영하지 않는다. 현재 API 값은 `health_percentage: 57`, `code_of_conduct: null`, `contributing: null`, `issue_template: null`이다.
- MISS: Community Standards UI도 default branch 기준이라 `Code of conduct`, `Contributing`, `Security policy`는 아직 `Not added yet`으로 표시된다.
- OK: 새 문서에서 Mozilla/Firefox 언급은 출처·기술 맥락 또는 제휴 부정 원칙에 한정된다.
- OK: 새 문서에서 `debugger`, `<all_urls>`, screenshot upload, telemetry는 금지·비사용 맥락으로만 언급된다.
- OK: `.github`에는 `FUNDING.yml`, issue template files, PR template, CI workflow가 존재한다.
- OK: `git diff --check`는 경고 없이 통과했다.

## 잔여 위험

- Community Profile API와 Community Standards UI는 default branch 기준이라 PR merge 전에는 이번 브랜치의 community health file을 확인할 수 없다.
- GitHub sponsor button 표시 여부도 `.github/FUNDING.yml`이 default branch에 병합된 뒤 최종 확인해야 한다.
- README community 링크는 이번 Stage에서 보류했다. 다국어 README까지 함께 정리하는 별도 승인 또는 후속 작업이 있으면 root README와 번역 README를 동시에 갱신하는 편이 좋다.
- 게시된 Discussions 본문은 GitHub 원격 객체이므로 이후 수정이 필요하면 GitHub Discussions에서 직접 편집해야 한다.

## 다음 단계 영향

- 모든 구현 Stage가 완료됐다. 다음 단계는 `task-final-report` 절차로 최종 보고서 작성, 오늘할일 완료 처리, 최종 커밋, `publish/task29` 원격 브랜치 push, `devel` 대상 PR 생성이다.
- 최종 보고서에는 Community Profile API/UI가 default branch 기준으로만 확인됐다는 제한을 반드시 남긴다.
- PR merge 후에는 GitHub Community Standards page, Sponsor button, issue chooser를 default branch 기준으로 다시 확인한다.

## 승인 요청

- Stage 4 산출물과 검증 결과를 승인하면 최종 보고와 PR 준비 단계로 진행한다.
