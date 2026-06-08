# Task #29 최종 보고서 - GitHub Community Standards 보강

GitHub Issue: [#29](https://github.com/postmelee/crop/issues/29)
마일스톤: M030

## 작업 요약

- 대상 이슈: #29
- 마일스톤: M030
- 단계 수: 4개 Stage + Stage 2.1 보정
- 작업 목적: `crop` 공개 저장소의 GitHub Community Standards 관련 문서, funding 설정, discussion 후보 문안을 보강한다.

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
| `mydocs/working/task_m030_29_discussions_drafts.md` | Discussions 게시글 후보 5개 작성 | 게시 전 검토용 운영 문안 |
| `mydocs/plans/task_m030_29.md` | 수행계획서 작성 및 범위 보정 | 작업 추적 문서 |
| `mydocs/plans/task_m030_29_impl.md` | 구현계획서 작성 및 다국어/Funding/Discussions 범위 반영 | 작업 추적 문서 |
| `mydocs/working/task_m030_29_stage1.md` | Community Profile 감사와 범위 확정 보고 | 단계 보고서 |
| `mydocs/working/task_m030_29_stage2.md` | 기여자 안내와 행동 강령 작성 보고 | 단계 보고서 |
| `mydocs/working/task_m030_29_stage2_1.md` | 다국어 community 문서 보정 보고 | 단계 보고서 |
| `mydocs/working/task_m030_29_stage3.md` | issue template API/UI 불일치와 config 추가 보고 | 단계 보고서 |
| `mydocs/working/task_m030_29_stage4.md` | 보안/Funding/Discussions 후보 검증 보고 | 단계 보고서 |
| `mydocs/orders/20260608.md` | #29 상태를 완료로 갱신 | 오늘할일 보드 |

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
| `mydocs/working/task_m030_29_discussions_drafts.md` | `mydocs/working/` | `mydocs/working/task_m030_29_discussions_drafts.md` | OK | 실제 게시가 아닌 작업 산출물 |
| `README.md` | 필요 시 최소 수정 | 변경 없음 | OK | 다국어 README 동시 정리가 필요해 이번 Stage에서는 보류 |

## 변경 전·후 정량 비교

| 지표 | 변경 전 | 변경 후 |
|---|---|---|
| GitHub 인식 후보 community health file | `LICENSE`, `README.md`, PR template 중심 | `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `.github/FUNDING.yml`, issue template config 추가 |
| 기여 안내 언어 수 | 없음 | 영어 canonical + 한국어 + Simplified Chinese + Japanese |
| 행동 강령 언어 수 | 없음 | 영어 canonical + 한국어 + Simplified Chinese + Japanese |
| Discussions 후보 문안 | 없음 | 5개 후보 |
| 구현 산출물 diff | 0 | 최종 보고서 작성 전 기준 20 files, 1752 insertions |

## 검증 결과

| 수용 기준 | 결과 |
|---|---|
| GitHub Community Standards checklist에서 현재 저장소가 지원 가능한 누락 항목을 보강한다 | OK — `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `.github/FUNDING.yml`, `.github/ISSUE_TEMPLATE/config.yml` 추가 |
| `CONTRIBUTING.md`는 English canonical이며 다국어 번역을 연결한다 | OK — root canonical과 `ko`, `zh-CN`, `ja` 문서 존재, 언어 링크 확인 |
| `CODE_OF_CONDUCT.md`는 English canonical이며 다국어 번역을 연결한다 | OK — root canonical과 `ko`, `zh-CN`, `ja` 문서 존재, 언어 링크 확인 |
| `.github/ISSUE_TEMPLATE/task.yml` 인식 문제를 확인하고 가능한 수정은 반영한다 | OK — YAML schema 확인, UI Added/API null 불일치 기록, `config.yml` 추가 |
| `SECURITY.md`, `SUPPORT.md`, 추가 issue form, `config.yml` 추가/보류 사유를 기록한다 | OK — `SECURITY.md` 추가, `SUPPORT.md` 독립 파일 보류, 추가 issue form 보류, `config.yml` 추가 사유 기록 |
| `.github/FUNDING.yml`은 GitHub Sponsors 계정 `postmelee`를 가리킨다 | OK — `github: [postmelee]`, YAML 파싱 결과 `{"github"=>["postmelee"]}` |
| GitHub Discussions에 실제 게시 가능한 `crop` 소개 및 글 후보를 준비한다 | OK — `crop` 소개, 첫 사용 안내, 피드백 요청, 제약/로드맵, 후원 안내 후보 작성 |
| GitHub Discussions 실제 게시글 생성은 수행하지 않는다 | OK — 원격 discussion 쓰기 작업 없음 |
| GitHub Discussions, Wiki, Pages 설정 변경, 법률 자문이 필요한 정책 확정, 라이선스 변경, 새 label/milestone 생성은 수행하지 않는다 | OK — 파일 변경만 수행 |
| #51 README 변경과 충돌하면 #51 병합 결과를 우선한다 | OK — #51/#50 merge 이후 `origin/devel` 위로 rebase했고 README는 변경하지 않음 |

### 단계별 검증 결과

- Stage 1: `mydocs/working/task_m030_29_stage1.md` — Community Profile API/UI 감사, issue template UI Added와 API null 불일치 확인.
- Stage 2: `mydocs/working/task_m030_29_stage2.md` — 기여자 안내와 행동 강령 초안 작성, 권한/브랜딩/라이선스 경계 확인.
- Stage 2.1: `mydocs/working/task_m030_29_stage2_1.md` — 영어 canonical + 한국어/중국어/일본어 분리 구조 보정, 언어 링크 확인.
- Stage 3: `mydocs/working/task_m030_29_stage3.md` — `task.yml` YAML schema 확인, `.github/ISSUE_TEMPLATE/config.yml` 추가, Community UI/API 불일치 기록.
- Stage 4: `mydocs/working/task_m030_29_stage4.md` — `SECURITY.md`, `.github/FUNDING.yml`, Discussions 후보 검증, GitHub Sponsors URL HTTP 200 확인.

### 통합 검증

- OK: `git diff --check`
- OK: `git status --short --branch`는 최종 보고서 작성 전 `local/task29...origin/devel [ahead 8]`로 clean.
- OK: `git diff --name-status origin/devel..HEAD`로 20개 구현 산출물 확인.
- OK: `rg -n "CONTRIBUTING|CODE_OF_CONDUCT|SECURITY|SUPPORT|issue template|Community Standards" README.md CONTRIBUTING.md CODE_OF_CONDUCT.md mydocs/working mydocs/report`로 community 문서와 보고서 참조 확인.
- OK: `rg -n "FUNDING|Sponsors|Discussions|discussion|crop 소개" .github mydocs/working mydocs/report`로 Funding/Discussions 산출물 참조 확인.
- OK: `.github/FUNDING.yml`, `.github/ISSUE_TEMPLATE/task.yml`, `.github/ISSUE_TEMPLATE/config.yml` YAML 파싱 성공.
- MISS: `gh api repos/postmelee/crop/community/profile`은 default branch 기준이라 PR merge 전 새 community health file을 반영하지 않는다. 현재 API 값은 `health_percentage: 57`, `code_of_conduct: null`, `contributing: null`, `issue_template: null`이다.

## 잔여 위험과 후속 작업

### 잔여 위험

- Community Profile API와 GitHub Community Standards UI는 default branch 기준이라 PR merge 전에는 이번 브랜치의 새 community health file 인식을 최종 확인할 수 없다.
- GitHub sponsor button 표시 여부는 `.github/FUNDING.yml`이 default branch에 병합된 뒤 확인해야 한다.
- issue creation chooser는 비로그인 `curl`에서 login page로 redirect되어 브라우저 로그인 세션 기준 template 노출 확인이 남아 있다.
- README community 링크는 이번 작업에서 보류했다. 다국어 README까지 동시에 정리할 때 별도 작업으로 처리하는 편이 좋다.

### 후속 작업 후보

- PR merge 후 GitHub Community Standards page, Sponsor button, issue chooser를 default branch 기준으로 확인한다.
- 필요하면 README/README.ko.md/README.zh-CN.md/README.ja.md에 community 문서 링크 섹션을 동시에 추가한다.
- Discussions 후보 중 실제 게시할 글을 선택해 GitHub Discussions에 게시한다.

## 작업지시자 승인 요청

- 작업지시자의 최종 진행 승인에 따라 이 보고서와 오늘할일 완료 처리를 커밋한 뒤 `publish/task29` 브랜치 push와 `devel` 대상 PR 생성을 진행한다.
