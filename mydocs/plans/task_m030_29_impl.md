# Task #29 구현계획서 - GitHub Community Standards 보강

수행계획서: [`task_m030_29.md`](task_m030_29.md)
GitHub Issue: [#29](https://github.com/postmelee/crop/issues/29)
마일스톤: M030

## 단계 개요

| Stage | 제목 | 주요 산출 | 검증 |
|---|---|---|---|
| 1 | Community Profile 감사와 문서 범위 확정 | `mydocs/working/task_m030_29_stage1.md` | Community API, `.github` template, README/PR template 상태 확인 |
| 2 | 기여자 안내와 행동 강령 작성 | `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `mydocs/working/task_m030_29_stage2.md` | 공개 기여 흐름, 신고 경로, Hyper-Waterfall 경계 대조 |
| 3 | Issue template 인식 문제 수정 | `.github/ISSUE_TEMPLATE/task.yml`, 필요 시 `.github/ISSUE_TEMPLATE/config.yml`, `mydocs/working/task_m030_29_stage3.md` | GitHub issue forms schema, Community API/UI 인식 상태 확인 |
| 4 | 보안/지원/README 링크 정리와 최종 검증 | 필요 시 `SECURITY.md`, `SUPPORT.md`, `README.md`, `mydocs/working/task_m030_29_stage4.md` | community health files, 링크, 최종 Community API 결과 확인 |

## 문서 위치 확인

수행계획서의 "문서 위치 판단"과 실제 Stage 산출물 경로를 다음과 같이 일치시킨다. 공식 community health file은 GitHub가 자동 인식하는 repository root 또는 `.github/ISSUE_TEMPLATE/`에 둔다. `mydocs/`는 작업 산출물과 단계 보고서에만 사용한다.

| 파일 | 수행계획서상 선택 위치 | Stage 산출물 경로 | 일치 여부 | 비고 |
|---|---|---|---|---|
| `CONTRIBUTING.md` | `CONTRIBUTING.md` | `CONTRIBUTING.md` | OK | Stage 2에서 작성 |
| `CODE_OF_CONDUCT.md` | `CODE_OF_CONDUCT.md` | `CODE_OF_CONDUCT.md` | OK | Stage 2에서 작성 |
| `.github/ISSUE_TEMPLATE/task.yml` | `.github/ISSUE_TEMPLATE/task.yml` | `.github/ISSUE_TEMPLATE/task.yml` | OK | Stage 3에서 원인 확인 후 최소 수정 |
| `.github/ISSUE_TEMPLATE/config.yml` | `.github/ISSUE_TEMPLATE/config.yml` | `.github/ISSUE_TEMPLATE/config.yml` | OK | 필요하다고 판단될 때만 Stage 3에서 추가 |
| `SECURITY.md` | `SECURITY.md` | `SECURITY.md` | OK | Stage 1 판단 후 Stage 4에서 추가 또는 보류 |
| `SUPPORT.md` | `SUPPORT.md` | `SUPPORT.md` | OK | Stage 1 판단 후 Stage 4에서 추가 또는 보류 |
| `README.md` | `README.md` | `README.md` | OK | Stage 4에서 community 문서 링크가 필요할 때만 최소 수정 |
| `mydocs/plans/task_m030_29_impl.md` | `mydocs/plans/` | `mydocs/plans/task_m030_29_impl.md` | OK | 구현계획서 |
| `mydocs/working/task_m030_29_stage{N}.md` | `mydocs/working/` | `mydocs/working/task_m030_29_stage{N}.md` | OK | 단계 보고서 |
| `mydocs/report/task_m030_29_report.md` | `mydocs/report/` | `mydocs/report/task_m030_29_report.md` | OK | 최종 보고서 |
| `mydocs/orders/20260608.md` | `mydocs/orders/` | `mydocs/orders/20260608.md` | OK | 오늘할일 보드 |

## 수용 기준 고정

- GitHub Community Standards checklist에서 현재 저장소가 지원 가능한 누락 항목을 보강한다.
- `CONTRIBUTING.md`는 issue/PR 흐름, 외부 기여 기대사항, Hyper-Waterfall과 외부 기여의 경계를 설명한다.
- `CODE_OF_CONDUCT.md`는 공개 저장소 운영에 필요한 최소 행동 기준과 신고/연락 경로를 포함한다.
- `.github/ISSUE_TEMPLATE/task.yml`이 community profile에서 인식되지 않는 원인을 확인하고, 가능한 수정은 반영한다.
- `SECURITY.md`, `SUPPORT.md`, 추가 issue form, `.github/ISSUE_TEMPLATE/config.yml`은 Stage 1 감사 결과로 추가/보류를 결정하고 그 이유를 기록한다.
- GitHub Discussions, Wiki, Pages 설정 변경, 법률 자문이 필요한 정책 확정, 라이선스 변경, 새 label/milestone 생성은 수행하지 않는다.
- #51 README 변경과 충돌하면 #51 병합 결과를 우선해 rebase/충돌 해소한다.

## Stage 1 — Community Profile 감사와 문서 범위 확정

### 산출물

신규:

- `mydocs/working/task_m030_29_stage1.md`

수정:

- 필요 시 `mydocs/orders/20260608.md`

### 변경 내용

- 현재 branch와 working tree 상태를 확인한다.
- GitHub Community Profile API 결과를 기록한다.
- GitHub Community Standards page를 수동 확인해 API 결과와 UI 표시를 대조한다.
- `.github/ISSUE_TEMPLATE/task.yml`과 `.github/pull_request_template.md`의 현재 형식을 확인한다.
- README의 documentation URL, Chrome Web Store 게시 문구, community 문서 링크 필요성을 확인한다.
- `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `SUPPORT.md`, issue template 수정, `config.yml` 추가 여부를 확정한다.
- Stage 1은 감사와 판단 단계이므로 공식 community health file을 아직 생성하지 않는다.

### 검증

```bash
git status --short --branch
gh api repos/postmelee/crop/community/profile
sed -n '1,260p' .github/ISSUE_TEMPLATE/task.yml
sed -n '1,220p' .github/pull_request_template.md
sed -n '1,220p' README.md
find .github -maxdepth 3 -type f | sort
git diff --check
```

수동 확인:

- GitHub Community Standards page: `https://github.com/postmelee/crop/community`
- GitHub issue creation page에서 issue form 노출 여부

### 커밋

```text
Task #29 Stage 1: Community Profile 감사와 범위 확정
```

## Stage 2 — 기여자 안내와 행동 강령 작성

### 산출물

신규:

- `CONTRIBUTING.md`
- `CODE_OF_CONDUCT.md`
- `mydocs/working/task_m030_29_stage2.md`

수정:

- 필요 시 `mydocs/orders/20260608.md`

### 변경 내용

- `CONTRIBUTING.md`를 공개 기여자 관점으로 작성한다.
  - issue 먼저 열기
  - scope를 작게 유지하기
  - PR template 사용
  - permissions/privacy/branding/license 경계
  - maintainer가 Hyper-Waterfall 작업으로 전환할 수 있다는 안내
  - 외부 기여자가 내부 task 문서를 직접 작성해야 하는 요구는 두지 않음
- `CODE_OF_CONDUCT.md`를 공개 저장소의 최소 행동 기준으로 작성한다.
  - 기대 행동
  - 허용하지 않는 행동
  - 신고/연락 경로
  - maintainer 처리 원칙
- Mozilla/Firefox 명칭은 제품명, 제휴, 보증 암시 없이 license/attribution 맥락에서만 다룬다.

### 검증

```bash
sed -n '1,280p' CONTRIBUTING.md
sed -n '1,240p' CODE_OF_CONDUCT.md
rg -n "Hyper-Waterfall|issue|pull request|security|conduct|Mozilla|Firefox|debugger|<all_urls>|activeTab|scripting|clipboardWrite|downloads" CONTRIBUTING.md CODE_OF_CONDUCT.md AGENTS.md mydocs/manual
rg -n "affiliated|endorsed|sponsored|official" CONTRIBUTING.md CODE_OF_CONDUCT.md
git diff --check
```

### 커밋

```text
Task #29 Stage 2: 기여자 안내와 행동 강령 작성
```

## Stage 3 — Issue template 인식 문제 수정

### 산출물

신규:

- 필요 시 `.github/ISSUE_TEMPLATE/config.yml`
- 필요 시 추가 issue form 파일
- `mydocs/working/task_m030_29_stage3.md`

수정:

- `.github/ISSUE_TEMPLATE/task.yml`
- 필요 시 `mydocs/orders/20260608.md`

### 변경 내용

- `.github/ISSUE_TEMPLATE/task.yml`이 GitHub issue forms schema와 community profile 인식 조건을 만족하는지 확인한다.
- 기존 task template 목적을 유지하면서 인식에 필요한 최소 metadata 또는 구조를 보정한다.
- `config.yml`은 issue forms UI의 예측 가능성을 높이거나 blank issue 정책을 명확히 할 필요가 있을 때만 추가한다.
- bug/feature/security 등 별도 public template이 꼭 필요하다고 확인되면 추가 issue form 후보를 stage 보고서에 기록하고, 범위가 커지면 작업지시자 승인을 다시 요청한다.
- 수정 후 Community Profile API와 GitHub UI를 다시 확인한다.

### 검증

```bash
sed -n '1,300p' .github/ISSUE_TEMPLATE/task.yml
test -f .github/ISSUE_TEMPLATE/config.yml && sed -n '1,200p' .github/ISSUE_TEMPLATE/config.yml || true
find .github/ISSUE_TEMPLATE -maxdepth 1 -type f | sort
gh api repos/postmelee/crop/community/profile
git diff --check
```

수동 확인:

- GitHub Community Standards page에서 issue template 항목 표시
- GitHub issue creation page에서 template 선택/표시 상태

### 커밋

```text
Task #29 Stage 3: issue template 인식 문제 수정
```

## Stage 4 — 보안/지원/README 링크 정리와 최종 검증

### 산출물

신규:

- Stage 1 판단에 따라 `SECURITY.md`
- Stage 1 판단에 따라 `SUPPORT.md`
- `mydocs/working/task_m030_29_stage4.md`

수정:

- 필요 시 `README.md`
- 필요 시 `CONTRIBUTING.md`
- 필요 시 `CODE_OF_CONDUCT.md`
- 필요 시 `.github/ISSUE_TEMPLATE/task.yml`
- 필요 시 `mydocs/orders/20260608.md`

### 변경 내용

- Stage 1 판단에 따라 `SECURITY.md`와 `SUPPORT.md`를 추가하거나 보류 사유를 Stage 4 보고서에 남긴다.
- README에는 필요한 경우 `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `SUPPORT.md` 링크를 최소 범위로 추가한다.
- #51이 README의 Chrome Web Store 게시 문구를 먼저 갱신했다면 rebase 후 그 결과를 기준으로 링크만 보정한다.
- 모든 community 문서가 서로 모순되지 않는지 확인한다.
- Community Profile API와 GitHub UI의 최종 상태를 확인한다.

### 검증

```bash
ls CONTRIBUTING.md CODE_OF_CONDUCT.md
test -f SECURITY.md && sed -n '1,240p' SECURITY.md || true
test -f SUPPORT.md && sed -n '1,240p' SUPPORT.md || true
rg -n "CONTRIBUTING|CODE_OF_CONDUCT|SECURITY|SUPPORT|Issue|Pull Request|security|conduct" README.md CONTRIBUTING.md CODE_OF_CONDUCT.md .github
gh api repos/postmelee/crop/community/profile
git diff --check
git status --short
```

수동 확인:

- GitHub Community Standards page 최종 상태
- README와 community 문서 링크 클릭 경로

### 커밋

```text
Task #29 Stage 4: community 문서 링크와 최종 검증
```

## 최종 보고와 PR 준비

모든 Stage 완료와 승인 후 `task-final-report` 절차로 진행한다.

예상 산출물:

- `mydocs/report/task_m030_29_report.md`
- `mydocs/orders/20260608.md`
- `publish/task29` 원격 브랜치
- `devel` 대상 PR

예상 검증:

```bash
git status --short --branch
git diff --check
gh api repos/postmelee/crop/community/profile
rg -n "CONTRIBUTING|CODE_OF_CONDUCT|SECURITY|SUPPORT|issue template|Community Standards" README.md CONTRIBUTING.md CODE_OF_CONDUCT.md mydocs/working mydocs/report
```

## 검증

- 각 Stage 검증 명령은 단계 보고서 작성 전에 실행한다.
- 실패한 검증은 단계 완료로 처리하지 않는다.
- Community Profile API는 default branch 기준으로 반영될 수 있으므로, branch-local 수정 직후 API가 개선되지 않으면 stage 보고서에 "PR merge 후 확인 필요"로 구분한다.
- 수동 GitHub UI 확인은 확인 시점과 관찰 결과를 단계 보고서에 남긴다.
- 구현 중 문서 위치나 범위가 이 계획과 달라지면 구현계획서를 갱신하고 작업지시자 승인을 다시 받는다.

## 커밋

- 구현계획서 자체는 `Task #29: 구현계획서 작성과 오늘할일 갱신` 커밋으로 별도 기록한다.
- 단계 커밋은 단계 산출물과 `mydocs/working/task_m030_29_stage{N}.md`를 함께 묶는다.
- 커밋 메시지는 `Task #29 Stage {N}: {핵심 내용 요약}` 형식을 따른다.
- 최종 보고와 PR 게시 커밋은 `task-final-report` 절차의 커밋 규칙을 따른다.

## 단계 의존성

- Stage 2는 Stage 1에서 community health file 추가/보류 범위가 확정된 뒤 진행한다.
- Stage 3은 Stage 1의 issue template 원인 후보가 정리된 뒤 진행한다.
- Stage 4는 Stage 2와 Stage 3 산출물이 모두 존재한 뒤 통합 링크와 보안/지원 문서 판단을 마무리한다.
- 모든 Stage는 단계 보고서 작성과 커밋 후 작업지시자 승인 없이는 다음 Stage로 넘어가지 않는다.

## 위험과 대응

- **GitHub 인식 지연**: branch-local 수정 직후 Community Profile API가 default branch 기준으로만 표시될 수 있다. 단계 보고서에는 로컬 수정, API 결과, PR merge 후 재확인 필요 여부를 분리해 적는다.
- **외부 기여 안내 과잉**: 내부 작업자용 산출물 요구가 공개 문서에 과도하게 들어가지 않도록 issue/PR 기대사항 중심으로 작성한다.
- **정책 문서 과확정**: 보안/행동강령 문서는 운영 원칙과 연락 경로 중심으로 좁게 작성하고 법률/라이선스 판단은 범위 밖으로 둔다.
- **#51 충돌**: README와 `mydocs/orders/20260608.md`는 #51과 충돌 가능성이 있다. #51 병합 결과를 rebase 후 우선 반영하고, #29는 community link 변경만 남긴다.

## 승인 요청 사항

- 위 Stage 1~4 분할, 산출물, 검증 명령, 커밋 메시지로 #29 구현을 진행한다.
- Stage 1에서는 감사/판단과 단계 보고서만 작성하고, 공식 community health file 생성은 Stage 2 이후로 미룬다.
- `SECURITY.md`, `SUPPORT.md`, `.github/ISSUE_TEMPLATE/config.yml`, 추가 issue form은 Stage 1 판단 결과에 따라 추가 또는 보류한다.
- GitHub Community Profile API가 default branch 기준으로 즉시 개선되지 않을 수 있음을 검증 한계로 인정한다.
