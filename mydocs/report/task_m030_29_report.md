# Task #29 최종 보고서 - GitHub Community Standards 보강

GitHub Issue: [#29](https://github.com/postmelee/crop/issues/29)
마일스톤: M030

## 작업 요약

- 대상 이슈: #29
- 마일스톤: M030
- 단계 수: 4개 Stage + Stage 2.1 보정
- 작업 목적: `crop` 공개 저장소의 GitHub Community Standards 관련 문서, funding 설정, GitHub Discussions 게시글을 보강한다.

## 변경 파일 목록과 영향 범위

| 경로 | 변경 요약 | 영향 범위 |
|---|---|---|
| `CONTRIBUTING.md` | English canonical 기여 안내 추가 | 공개 기여자 안내, GitHub community health file |
| `CONTRIBUTING.ko.md` | 한국어 기여 안내 추가 | 다국어 기여자 안내 |
| `CONTRIBUTING.zh-CN.md` | Simplified Chinese 기여 안내 추가 | 다국어 기여자 안내 |
| `CONTRIBUTING.ja.md` | Japanese 기여 안내 추가 | 다국어 기여자 안내 |
| `CODE_OF_CONDUCT.md` | English canonical 행동 강령 추가 | 공개 협업 기준, GitHub community health file |
| `CODE_OF_CONDUCT.ko.md` | 한국어 행동 강령 추가 | 다국어 행동 강령 |
| `CODE_OF_CONDUCT.zh-CN.md` | Simplified Chinese 행동 강령 추가 | 다국어 행동 강령 |
| `CODE_OF_CONDUCT.ja.md` | Japanese 행동 강령 추가 | 다국어 행동 강령 |
| `SECURITY.md` | 보안 취약점 제보 정책 추가 | GitHub security policy, 민감 정보 공개 방지 |
| `.github/FUNDING.yml` | GitHub Sponsors 계정 `postmelee` 설정 | Sponsor button 표시 준비 |
| `.github/ISSUE_TEMPLATE/config.yml` | blank issue 허용과 Discussions contact link 추가 | issue chooser 안내 |
| GitHub Discussions #57~#61 | Discussions 게시글 5개 직접 생성 후 heading 기반 Markdown으로 본문 개선 | 공개 커뮤니티 게시글 |
| GitHub Discussion #63 | 다음 언어 지원 조사를 위한 Polls category Discussion 생성 | 공개 커뮤니티 조사 |
| `mydocs/plans/task_m030_29.md` | 수행계획서 작성 및 범위 보정 | 작업 추적 문서 |
| `mydocs/plans/task_m030_29_impl.md` | 구현계획서 작성 및 다국어/Funding/Discussions 범위 반영 | 작업 추적 문서 |
| `mydocs/working/task_m030_29_stage1.md` | Community Profile 감사와 범위 확정 보고 | 단계 보고서 |
| `mydocs/working/task_m030_29_stage2.md` | 기여자 안내와 행동 강령 작성 보고 | 단계 보고서 |
| `mydocs/working/task_m030_29_stage2_1.md` | 다국어 community 문서 보정 보고 | 단계 보고서 |
| `mydocs/working/task_m030_29_stage3.md` | issue template API/UI 불일치와 config 추가 보고 | 단계 보고서 |
| `mydocs/working/task_m030_29_stage4.md` | 보안/Funding/Discussions 게시 검증 보고 | 단계 보고서 |
| `mydocs/orders/20260608.md` | #29 상태를 완료로 갱신 | 오늘할일 보드 |

## 게시된 Discussions

| 번호 | 카테고리 | 제목 | URL |
|---|---|---|---|
| #57 | Announcements | Introducing crop: precise page screenshots for Chrome | https://github.com/postmelee/crop/discussions/57 |
| #58 | Q&A | Getting started with crop | https://github.com/postmelee/crop/discussions/58 |
| #59 | Ideas | What should crop handle better? | https://github.com/postmelee/crop/discussions/59 |
| #60 | Announcements | Known limits and near-term direction for crop | https://github.com/postmelee/crop/discussions/60 |
| #61 | General | Supporting crop development | https://github.com/postmelee/crop/discussions/61 |
| #63 | Polls | Which language should crop support next? | https://github.com/postmelee/crop/discussions/63 |

## 문서 위치 검증

| 파일 | 계획된 위치 | 실제 위치 | 결과 | 근거 |
|---|---|---|---|---|
| `CONTRIBUTING.md` | repository root | `CONTRIBUTING.md` | OK | GitHub 인식용 canonical 위치 |
| `CONTRIBUTING.ko.md` | repository root | `CONTRIBUTING.ko.md` | OK | root canonical에서 언어 링크 제공 |
| `CONTRIBUTING.zh-CN.md` | repository root | `CONTRIBUTING.zh-CN.md` | OK | root canonical에서 언어 링크 제공 |
| `CONTRIBUTING.ja.md` | repository root | `CONTRIBUTING.ja.md` | OK | root canonical에서 언어 링크 제공 |
| `CODE_OF_CONDUCT.md` | repository root | `CODE_OF_CONDUCT.md` | OK | GitHub 인식용 canonical 위치 |
| `CODE_OF_CONDUCT.ko.md` | repository root | `CODE_OF_CONDUCT.ko.md` | OK | root canonical에서 언어 링크 제공 |
| `CODE_OF_CONDUCT.zh-CN.md` | repository root | `CODE_OF_CONDUCT.zh-CN.md` | OK | root canonical에서 언어 링크 제공 |
| `CODE_OF_CONDUCT.ja.md` | repository root | `CODE_OF_CONDUCT.ja.md` | OK | root canonical에서 언어 링크 제공 |
| `SECURITY.md` | repository root | `SECURITY.md` | OK | GitHub security policy 인식 위치 |
| `SUPPORT.md` | repository root, 필요 시 | 해당 없음 | OK | Stage 1/4에서 독립 파일 보류로 판단 |
| `.github/FUNDING.yml` | `.github/FUNDING.yml` | `.github/FUNDING.yml` | OK | GitHub Sponsors 인식 위치 |
| `.github/ISSUE_TEMPLATE/config.yml` | `.github/ISSUE_TEMPLATE/config.yml`, 필요 시 | `.github/ISSUE_TEMPLATE/config.yml` | OK | Stage 3에서 contact link 필요로 추가 |
| GitHub Discussions 게시글 | GitHub Discussions | #57~#61, #63 | OK | 작업지시자 추가 지시에 따라 실제 게시하고 URL을 보고서에 기록 |
| `README.md` | 필요 시 최소 수정 | 변경 없음 | OK | 다국어 README 동시 정리가 필요해 이번 Stage에서는 보류 |

## 변경 전·후 정량 비교

| 지표 | 변경 전 | 변경 후 |
|---|---|---|
| GitHub 인식 후보 community health file | `LICENSE`, `README.md`, PR template 중심 | `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `.github/FUNDING.yml`, issue template config 추가 |
| 기여 안내 언어 수 | 없음 | 영어 canonical + 한국어 + Simplified Chinese + Japanese |
| 행동 강령 언어 수 | 없음 | 영어 canonical + 한국어 + Simplified Chinese + Japanese |
| GitHub Discussions 게시글 | 없음 | 6개 게시글 |
| 구현 산출물 diff | 0 | Discussions Markdown/Poll 보정 후 기준 20 files, 1717 insertions |

## 검증 결과

| 수용 기준 | 결과 |
|---|---|
| GitHub Community Standards checklist에서 현재 저장소가 지원 가능한 누락 항목을 보강한다 | OK — `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `.github/FUNDING.yml`, `.github/ISSUE_TEMPLATE/config.yml` 추가 |
| `CONTRIBUTING.md`는 English canonical이며 다국어 번역을 연결한다 | OK — root canonical과 `ko`, `zh-CN`, `ja` 문서 존재, 언어 링크 확인 |
| `CODE_OF_CONDUCT.md`는 English canonical이며 다국어 번역을 연결한다 | OK — root canonical과 `ko`, `zh-CN`, `ja` 문서 존재, 언어 링크 확인 |
| `.github/ISSUE_TEMPLATE/task.yml` 인식 문제를 확인하고 가능한 수정은 반영한다 | OK — YAML schema 확인, UI Added/API null 불일치 기록, `config.yml` 추가 |
| `SECURITY.md`, `SUPPORT.md`, 추가 issue form, `config.yml` 추가/보류 사유를 기록한다 | OK — `SECURITY.md` 추가, `SUPPORT.md` 독립 파일 보류, 추가 issue form 보류, `config.yml` 추가 사유 기록 |
| `.github/FUNDING.yml`은 GitHub Sponsors 계정 `postmelee`를 가리킨다 | OK — `github: [postmelee]`, YAML 파싱 결과 `{"github"=>["postmelee"]}` |
| GitHub Discussions에 `crop` 소개 및 글을 게시하고 URL을 기록한다 | OK — `crop` 소개, 첫 사용 안내, 피드백 요청, 제약/로드맵, 후원 안내 글 #57~#61 생성 |
| GitHub Discussions 본문을 Markdown heading 중심으로 가독성 있게 정리한다 | OK — #57~#61 본문을 heading/list/table 구조로 업데이트 |
| 다음 언어 지원 조사를 위한 Polls category Discussion을 추가한다 | OK — #63 생성 |
| GitHub Discussions category, Wiki, Pages 설정 변경, 법률 자문이 필요한 정책 확정, 라이선스 변경, 새 label/milestone 생성은 수행하지 않는다 | OK — 게시글 생성 외 플랫폼 설정 변경 없음 |
| #51 README 변경과 충돌하면 #51 병합 결과를 우선한다 | OK — #51/#50 merge 이후 `origin/devel` 위로 rebase했고 README는 변경하지 않음 |

### 단계별 검증 결과

- Stage 1: `mydocs/working/task_m030_29_stage1.md` — Community Profile API/UI 감사, issue template UI Added와 API null 불일치 확인.
- Stage 2: `mydocs/working/task_m030_29_stage2.md` — 기여자 안내와 행동 강령 초안 작성, 권한/브랜딩/라이선스 경계 확인.
- Stage 2.1: `mydocs/working/task_m030_29_stage2_1.md` — 영어 canonical + 한국어/중국어/일본어 분리 구조 보정, 언어 링크 확인.
- Stage 3: `mydocs/working/task_m030_29_stage3.md` — `task.yml` YAML schema 확인, `.github/ISSUE_TEMPLATE/config.yml` 추가, Community UI/API 불일치 기록.
- Stage 4: `mydocs/working/task_m030_29_stage4.md` — `SECURITY.md`, `.github/FUNDING.yml`, Discussions #57~#61/#63 게시와 GitHub Sponsors URL HTTP 200 확인.

### 통합 검증

- OK: `git diff --check`
- OK: `git status --short --branch`는 최종 보고서 작성 전 `local/task29...origin/devel [ahead 8]`로 clean.
- OK: `git diff --name-status origin/devel..HEAD`로 구현 산출물 확인.
- OK: `rg -n "CONTRIBUTING|CODE_OF_CONDUCT|SECURITY|SUPPORT|issue template|Community Standards" README.md CONTRIBUTING.md CODE_OF_CONDUCT.md mydocs/working mydocs/report`로 community 문서와 보고서 참조 확인.
- OK: `rg -n "FUNDING|Sponsors|Discussions|discussion|crop 소개|discussions/[0-9]+" .github mydocs/working mydocs/report`로 Funding/Discussions 산출물 참조 확인.
- OK: `.github/FUNDING.yml`, `.github/ISSUE_TEMPLATE/task.yml`, `.github/ISSUE_TEMPLATE/config.yml` YAML 파싱 성공.
- MISS: `gh api repos/postmelee/crop/community/profile`은 default branch 기준이라 PR merge 전 새 community health file을 반영하지 않는다. 현재 API 값은 `health_percentage: 57`, `code_of_conduct: null`, `contributing: null`, `issue_template: null`이다.

## 잔여 위험과 후속 작업

### 잔여 위험

- Community Profile API와 GitHub Community Standards UI는 default branch 기준이라 PR merge 전에는 이번 브랜치의 새 community health file 인식을 최종 확인할 수 없다.
- GitHub sponsor button 표시 여부는 `.github/FUNDING.yml`이 default branch에 병합된 뒤 확인해야 한다.
- issue creation chooser는 비로그인 `curl`에서 login page로 redirect되어 브라우저 로그인 세션 기준 template 노출 확인이 남아 있다.
- README community 링크는 이번 작업에서 보류했다. 다국어 README까지 동시에 정리할 때 별도 작업으로 처리하는 편이 좋다.
- 게시된 Discussions 본문은 GitHub 원격 객체이므로 이후 수정이 필요하면 GitHub Discussions에서 직접 편집해야 한다.

### 후속 작업 후보

- PR merge 후 GitHub Community Standards page, Sponsor button, issue chooser를 default branch 기준으로 확인한다.
- 필요하면 README/README.ko.md/README.zh-CN.md/README.ja.md에 community 문서 링크 섹션을 동시에 추가한다.
- 필요하면 게시된 Discussions #57~#61/#63에 한국어/중국어/일본어 요약 댓글을 추가한다.

## 작업지시자 지시 반영

- 작업지시자의 추가 지시에 따라 GitHub Discussions #57~#61을 직접 생성했고, `mydocs/working/`의 본문 초안 파일을 제거했다.
- 추가 지시에 따라 #57~#61 본문을 Markdown heading 중심으로 재편집하고, #59에는 reaction voting 표를 추가했다.
- 다음 언어 지원 조사를 위해 Polls category Discussion #63을 생성했다.
- 이 보정은 `publish/task29`와 PR #56에 추가 반영한다.
