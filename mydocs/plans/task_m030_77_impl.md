# Task #77 구현계획서 - v0.1.1 Web Store 게시 후 릴리스 노트와 배포 문서 보정

수행계획서: [`task_m030_77.md`](task_m030_77.md)
GitHub Issue: [#77](https://github.com/postmelee/crop/issues/77)
마일스톤: M030

## 단계 개요

| Stage | 제목 | 주요 산출 | 검증 |
|---|---|---|---|
| 1 | 현재 게시 상태 재검증과 보정안 확정 | `mydocs/working/task_m030_77_stage1.md` | GitHub Release, Chrome Web Store listing, README/PRIVACY 상태 재확인 |
| 2 | Release body와 운영 문서 보정 | GitHub Release `v0.1.1` body, `mydocs/manual/release_pipeline_guide.md`, 필요 시 `mydocs/tech/*`, `mydocs/working/task_m030_77_stage2.md` | Release body published 문구, version 일반화 path, tag/asset 불변 확인 |
| 3 | 통합 검증과 최종 보고 | `mydocs/working/task_m030_77_stage3.md`, `mydocs/report/task_m030_77_report.md`, `mydocs/orders/20260616.md` | 원격 Release body, Web Store 접근성, 문서 grep, status/diff 확인 |

## 문서 위치 확인

수행계획서의 "문서 위치 판단"과 실제 Stage 산출물 경로를 다음과 같이 일치시킨다.

| 파일 | 수행계획서상 선택 위치 | Stage 산출물 경로 | 일치 여부 | 비고 |
|---|---|---|---|---|
| GitHub Release `v0.1.1` body | GitHub Release 원격 body | GitHub Release 원격 body | OK | 실제 사용자-facing release note |
| `mydocs/manual/release_pipeline_guide.md` | `mydocs/manual/` | `mydocs/manual/release_pipeline_guide.md` | OK | 반복 release 절차의 운영 매뉴얼 |
| `mydocs/tech/task_m030_37_chrome_web_store_dashboard.md` | `mydocs/tech/` | 필요 시 동일 파일 | OK | #37 스냅샷 보존, 최신 상태 주석만 허용 |
| `mydocs/tech/task_m030_72_release_candidate.md` | `mydocs/tech/` | 필요 시 동일 파일 | OK | #72 후보 기록 보존, 게시 후 확인 섹션만 허용 |
| `mydocs/plans/task_m030_77_impl.md` | `mydocs/plans/` | `mydocs/plans/task_m030_77_impl.md` | OK | 구현계획서 |
| `mydocs/working/task_m030_77_stage{N}.md` | `mydocs/working/` | `mydocs/working/task_m030_77_stage{N}.md` | OK | 단계별 완료보고서 |
| `mydocs/report/task_m030_77_report.md` | `mydocs/report/` | `mydocs/report/task_m030_77_report.md` | OK | 최종 결과보고서 |

## 수용 기준 고정

- GitHub Release `v0.1.1` body가 Chrome Web Store published 상태를 설명한다.
- Release body의 tag, title, draft/prerelease 상태, release commit, asset 이름, asset URL, asset size, SHA-256 checksum은 변경하지 않는다.
- `mydocs/manual/release_pipeline_guide.md`의 반복 release 절차가 `/tmp/crop-0.1.0-cws.zip`를 현재 기준으로 하드코딩하지 않는다.
- #37/#72 기술 노트는 과거 기록을 보존하며, 최신 상태 보정이 필요하면 별도 섹션으로 분리한다.
- README/PRIVACY는 이번 task에서 수정하지 않고 검증 결과만 보고서에 남긴다. 새 불일치가 발견되면 작업지시자에게 계획 변경 승인을 요청한다.
- Chrome Web Store Dashboard, package, tag, release asset, extension source/runtime은 변경하지 않는다.

## Stage 1 - 현재 게시 상태 재검증과 보정안 확정

### 산출물

신규:

- `mydocs/working/task_m030_77_stage1.md`

수정:

- 필요 시 `mydocs/orders/20260616.md`

### 변경 내용

- GitHub Release `v0.1.1`의 현재 body, draft/prerelease 상태, release asset metadata를 조회한다.
- Chrome Web Store listing URL 접근성과 listing HTML의 version/privacy URL 단서를 다시 확인한다.
- README 4개 언어와 `PRIVACY.md`가 수정 불필요한지 grep으로 확인한다.
- Stage 2에서 적용할 GitHub Release body 보정안을 작성한다.
- `release_pipeline_guide.md`, #37 Dashboard 노트, #72 release candidate 노트에서 실제 수정할 항목과 보존할 항목을 구분한다.
- Stage 1 완료보고서에 수정 전 원격 Release body 핵심 문구와 보정안을 기록한다.

### 검증

```bash
gh release view v0.1.1 --repo postmelee/crop --json tagName,name,url,isDraft,isPrerelease,publishedAt,targetCommitish,assets,body
curl -L -I https://chromewebstore.google.com/detail/crop/pdmniipgbjdcpnhbkkppodechbehagki
rg -n "Release status|Chrome Web Store에서 설치|Chrome Web Store からインストール|从 Chrome Web Store 安装|v0.1.1|2026년 6월 14일|2026年6月14日" README*.md PRIVACY.md
rg -n "not submitted|crop-0.1.0-cws.zip|crop-\\{version\\}-cws.zip|/tmp/crop-\\{version\\}-cws.zip" mydocs/manual/release_pipeline_guide.md mydocs/tech/task_m030_37_chrome_web_store_dashboard.md mydocs/tech/task_m030_72_release_candidate.md
git diff --check
```

### 승인 게이트

Stage 1 완료보고서 승인 전에는 GitHub Release body, `release_pipeline_guide.md`, #37/#72 기술 노트를 수정하지 않는다.

### 커밋

```text
Task #77 Stage 1: 게시 상태 재검증과 보정안 확정
```

## Stage 2 - Release body와 운영 문서 보정

### 산출물

신규:

- `mydocs/working/task_m030_77_stage2.md`

수정:

- GitHub Release `v0.1.1` body
- `mydocs/manual/release_pipeline_guide.md`
- 필요 시 `mydocs/tech/task_m030_37_chrome_web_store_dashboard.md`
- 필요 시 `mydocs/tech/task_m030_72_release_candidate.md`
- 필요 시 `mydocs/orders/20260616.md`

### 변경 내용

- 승인된 notes file을 사용해 GitHub Release `v0.1.1` body를 수정한다.
  - `Chrome Web Store: not submitted for v0.1.1` 계열 문구를 published 상태로 바꾼다.
  - 업데이트 방식은 review 완료 후 후보가 아니라 Chrome Web Store 자동 업데이트/신규 설치 가능 상태로 설명한다.
  - `Store 상태`와 `확인일`을 게시 후 확인 기준으로 보정한다.
  - follow-up 문구에서 `upload`/`Submit for review` 잔여 작업이 이미 완료된 상태임을 반영한다.
- `release_pipeline_guide.md`에서 `/tmp/crop-0.1.0-cws.zip` 하드코딩을 `version` 기반 예시로 바꾼다.
- #37 Dashboard 노트는 필요 시 상단 또는 관련 섹션에 `v0.1.0` 제출 스냅샷임을 밝히고 최신 release package는 release pipeline guide를 따른다고 적는다.
- #72 release candidate 노트는 필요 시 하단에 `v0.1.1` 게시 후 확인 섹션을 추가한다.
- Stage 2 완료보고서에 Release body 수정 전후 핵심 차이, 변경하지 않은 tag/asset metadata, 문서 변경 위치를 기록한다.

### 검증

```bash
gh release view v0.1.1 --repo postmelee/crop --json tagName,name,url,isDraft,isPrerelease,assets,body
rg -n "not submitted|published|crop-0.1.0-cws.zip|crop-\\{version\\}-cws.zip|/tmp/crop-\\{version\\}-cws.zip" mydocs/manual/release_pipeline_guide.md mydocs/tech/task_m030_37_chrome_web_store_dashboard.md mydocs/tech/task_m030_72_release_candidate.md
rg -n "Chrome Web Store|published|v0.1.1|asset|SHA-256|Submit for review|수행하지" mydocs/working/task_m030_77_stage2.md
git diff --check
```

### 승인 게이트

Stage 2 완료보고서 승인 전에는 통합 검증과 최종 보고서 작성으로 넘어가지 않는다.

### 커밋

```text
Task #77 Stage 2: Release body와 배포 문서 보정
```

## Stage 3 - 통합 검증과 최종 보고

### 산출물

신규:

- `mydocs/working/task_m030_77_stage3.md`
- `mydocs/report/task_m030_77_report.md`

수정:

- `mydocs/orders/20260616.md`

### 변경 내용

- GitHub Release `v0.1.1` body가 published 상태를 설명하는지 최종 확인한다.
- GitHub Release tag/title/draft/prerelease/asset metadata가 변경되지 않았음을 최종 보고서에 기록한다.
- Chrome Web Store listing URL 접근성과 version/privacy URL 단서를 최종 확인한다.
- README/PRIVACY가 수정 불필요했던 근거를 최종 보고서에 정리한다.
- `release_pipeline_guide.md`의 version 일반화 결과와 #37/#72 이력 보존 방식을 최종 보고서에 기록한다.
- 오늘할일을 완료 후보 상태로 갱신한다.

### 검증

```bash
gh release list --repo postmelee/crop --limit 5
gh release view v0.1.1 --repo postmelee/crop --json tagName,name,url,isDraft,isPrerelease,publishedAt,targetCommitish,assets,body
curl -L -I https://chromewebstore.google.com/detail/crop/pdmniipgbjdcpnhbkkppodechbehagki
rg -n "not submitted|published|Chrome Web Store|crop-\\{version\\}-cws.zip|README|PRIVACY" mydocs/report/task_m030_77_report.md mydocs/working/task_m030_77_stage3.md
git diff --check
git status --short
```

### 커밋

```text
Task #77 Stage 3: 통합 검증과 최종 보고
```

## 최종 보고와 PR 준비

Stage 3 완료와 승인 후 `task-final-report` 절차로 진행한다.

예상 산출물:

- `mydocs/report/task_m030_77_report.md`
- `mydocs/orders/20260616.md`
- `publish/task77` 원격 브랜치
- `devel` 대상 PR

예상 검증:

```bash
gh release view v0.1.1 --repo postmelee/crop --json tagName,name,url,isDraft,isPrerelease,assets,body
rg -n "published|crop-\\{version\\}-cws.zip|v0.1.1|Chrome Web Store" mydocs/report/task_m030_77_report.md mydocs/manual/release_pipeline_guide.md
git diff --check
git status --short
```

## 승인 지점

- Stage 1 완료 후 현재 게시 상태와 보정안을 승인받는다.
- Stage 2 완료 후 GitHub Release body와 운영 문서 보정 결과를 승인받는다.
- Stage 3 완료 후 최종 보고서와 PR 게시 진행 여부를 승인받는다.

## 검증

- 각 Stage 검증 명령은 단계 보고서 작성 전에 실행한다.
- 실패한 검증은 단계 완료로 처리하지 않는다.
- 구현 중 파일 위치나 범위가 이 계획과 달라지면 구현계획서를 갱신하고 작업지시자 승인을 다시 받는다.
- 문서 위치가 수행계획서 판단과 달라지면 수행계획서 또는 구현계획서를 갱신하고 작업지시자 승인을 다시 받는다.

## 커밋

- 구현계획서 자체는 `Task #77: 구현계획서 작성과 오늘할일 갱신` 커밋으로 별도 기록한다.
- 단계 커밋은 단계 산출물과 `mydocs/working/task_m030_77_stage{N}.md`를 함께 묶는다.
- 커밋 메시지는 `Task #77 Stage {N}: {핵심 내용 요약}` 형식을 따른다.

## 단계 의존성

- Stage 2는 Stage 1의 완료보고서 승인 후 진행한다.
- Stage 3은 Stage 2의 완료보고서 승인 후 진행한다.
- PR 게시 준비는 Stage 3 완료보고서와 최종 보고서 승인 후 진행한다.

## 위험과 대응

- **원격 Release body와 저장소 커밋의 불일치**: Release body 수정 전후를 Stage 2 보고서와 최종 보고서에 기록한다.
- **원격 Release body 실수 수정 위험**: 승인된 notes file만 사용하고, `gh release edit` 전후 tag/title/asset/draft/prerelease 상태를 비교한다.
- **과거 산출물 훼손**: #37/#72 문서는 기존 문장을 덮어쓰지 않고 별도 보정 섹션만 추가한다.
- **게시 상태 재확인 한계**: Web Store 동적 UI는 작업지시자가 제공한 게시 완료 사실, HTTP 200, listing HTML의 version/privacy URL 단서를 조합해 판단한다.
- **release 산출물 변경 오해**: tag, asset, package, manifest version은 변경하지 않으며 검증과 보고서에 명시한다.

## 승인 요청 사항

- 위 3단계 분할, 산출물, 검증 명령, 커밋 메시지 기준을 승인한다.
- Stage 1에서 현재 게시 상태 재검증과 보정안을 확정하는 범위를 승인한다.
- Stage 2에서 GitHub Release `v0.1.1` body와 release pipeline guide를 보정하는 범위를 승인한다.
- #37/#72 기술 노트는 이력 보존 방식으로만 필요한 주석 또는 보정 섹션을 추가하는 기준을 승인한다.
