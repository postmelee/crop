# Task #37 구현계획서 - Chrome Web Store Developer Dashboard 입력값 확정 및 제출 체크리스트

수행계획서: [`task_m030_37.md`](task_m030_37.md)
GitHub Issue: [#37](https://github.com/postmelee/crop/issues/37)
마일스톤: M030

## 단계 개요

| Stage | 제목 | 주요 산출 | 검증 |
|---|---|---|---|
| 1 | 공식 문서와 현행 산출물 재대조 | `mydocs/tech/task_m030_37_chrome_web_store_dashboard.md` 초안 | 공식 문서 확인일/URL, #9/#35/#38 산출물, 권한·downscale 문구 grep |
| 2 | Dashboard 입력값 표 확정 | Store Listing, Privacy practices, Distribution, URL 후보 표 | privacy·permission·branding·downscale 문구 대조 |
| 3 | Package/Upload와 제출 전 smoke checklist 확정 | fresh zip 절차, package contents, smoke checklist, asset blocker 표 | `npm run build`, zip contents, `dist/manifest.json`, diff 검증 |
| 4 | 통합 검증과 최종 보고 | Stage 4 보고서, 최종 보고서, 오늘할일 완료 후보 | build/typecheck/test, 권한·privacy·branding grep, status/diff |

## 문서 위치 확인

수행계획서의 "문서 위치 판단"과 실제 Stage 산출물 경로는 다음과 같이 일치시킨다. Dashboard 입력값은 작업 산출물인 `mydocs/tech/`에 두고, 공개 사용자 문서는 PR #38 반영 차이로 문구 충돌이 확인될 때만 최소 수정한다.

| 파일 | 수행계획서상 선택 위치 | Stage 산출물 경로 | 일치 여부 | 비고 |
|---|---|---|---|---|
| `mydocs/tech/task_m030_37_chrome_web_store_dashboard.md` | `mydocs/tech/` | `mydocs/tech/task_m030_37_chrome_web_store_dashboard.md` | OK | Dashboard 입력값과 제출 체크리스트의 진실 원천 |
| `PRIVACY.md` | 저장소 루트 기존 위치 | 필요 시 `PRIVACY.md` | OK | PR #38 이후 outdated large canvas 문구가 있으면 최소 보정 |
| README family | 저장소 루트 기존 위치 | 필요 시 `README.md`, `README.ko.md`, `README.zh-CN.md`, `README.ja.md` | OK | Store copy와 사용자-facing 제한 문구 충돌 시 최소 보정 |
| `mydocs/plans/task_m030_37_impl.md` | `mydocs/plans/` | `mydocs/plans/task_m030_37_impl.md` | OK | 구현계획서 |
| `mydocs/working/task_m030_37_stage{N}.md` | `mydocs/working/` | `mydocs/working/task_m030_37_stage{N}.md` | OK | 단계별 완료 보고서 |
| `mydocs/report/task_m030_37_report.md` | `mydocs/report/` | `mydocs/report/task_m030_37_report.md` | OK | 최종 결과 보고서 |

## 수용 기준 고정

- Dashboard 입력값 표가 Store Listing, Privacy practices, Distribution, Package/Upload, Review submit 전 확인 항목을 포함한다.
- 입력값은 #9 Store copy/privacy policy/permission draft와 충돌하지 않는다.
- PR #38 이후 full-page downscale fallback 설명이 Store copy/privacy/checklist에 반영된다.
- `activeTab`, `scripting`, `clipboardWrite`, `downloads` 권한 justification이 현재 manifest와 실제 사용처에 맞다.
- `debugger`, `<all_urls>`, broad `host_permissions`를 요구하거나 암시하지 않는다.
- privacy disclosure는 local processing, no server upload, no telemetry/analytics, explicit Copy/Save behavior를 유지한다.
- PR merge 후 사용할 privacy policy URL 후보가 `devel` 기준 stable URL로 정리된다.
- Store screenshot, small promotional image, optional marquee/video, localized listing은 필수/선택/후속 항목으로 분리된다.
- 실제 upload/review submit은 수행하지 않고, 작업지시자 승인 필요 항목으로 남긴다.

## Stage 1 — 공식 문서와 현행 산출물 재대조

### 산출물

신규:

- `mydocs/tech/task_m030_37_chrome_web_store_dashboard.md`
- `mydocs/working/task_m030_37_stage1.md`

수정:

- 필요 시 `mydocs/orders/20260604.md`

### 변경 내용

- Chrome Web Store 공식 문서와 실제 Dashboard 항목명을 확인한다.
- 공식 문서 확인일과 URL을 #37 기술 노트에 기록한다.
- 실제 Dashboard 화면 확인이 불가능한 항목은 `작업지시자 확인 필요`로 표시한다.
- #9 Store 준비 노트, #9 최종 보고서, #35 최종 보고서, PR #38 merge 상태를 대조한다.
- `README` 계열과 `PRIVACY.md`에 PR #38 이후 outdated large canvas 표현이 남아 있는지 확인한다.
- 권한, privacy, branding, source availability의 현재 기준을 다시 고정한다.

### 검증

```bash
gh issue view 37 --repo postmelee/crop --json number,title,state,labels,milestone,body
gh pr view 38 --repo postmelee/crop --json number,title,state,mergedAt,baseRefName,headRefName,body
rg -n "explicit size errors|명시적인 크기 오류|maximum canvas|downscale|large canvas|full page|전체 페이지" README*.md PRIVACY.md mydocs/tech mydocs/report/task_m020_35_report.md
rg -n "activeTab|scripting|clipboardWrite|downloads|debugger|<all_urls>|host_permissions" manifest.json README.md README.ko.md README.zh-CN.md README.ja.md PRIVACY.md mydocs/tech
git diff --check
```

### 커밋

```text
Task #37 Stage 1: 공식 문서와 현행 산출물 재대조
```

## Stage 2 — Dashboard 입력값 표 확정

### 산출물

신규:

- `mydocs/working/task_m030_37_stage2.md`

수정:

- `mydocs/tech/task_m030_37_chrome_web_store_dashboard.md`
- 필요 시 `PRIVACY.md`
- 필요 시 README family

### 변경 내용

- Store Listing 입력값을 확정한다.
  - short description
  - detailed description
  - category 후보와 최종 선택안
  - item language
  - homepage/support/privacy policy URL 후보
  - graphic asset requirements
- Privacy practices 입력값을 확정한다.
  - single purpose
  - data collection/use disclosure
  - Limited Use certification
  - permission justification
- Distribution/visibility 입력 후보와 review submit 전 승인 필요 항목을 분리한다.
- full-page downscale fallback, no server/no telemetry, Copy/Save explicit action, 권한 최소화 문구가 서로 충돌하지 않는지 정리한다.
- PR #38 반영으로 `PRIVACY.md` 또는 README family 수정이 필요하면 최소 범위만 보정한다.

### 검증

```bash
rg -n "activeTab|scripting|clipboardWrite|downloads|debugger|<all_urls>|host_permissions" manifest.json README.md README.ko.md README.zh-CN.md README.ja.md PRIVACY.md mydocs/tech
rg -n "server|telemetry|analytics|local|privacy|clipboard|download|Mozilla|Firefox|affiliated|endorsed|sponsored" README.md README.ko.md README.zh-CN.md README.ja.md PRIVACY.md NOTICE THIRD_PARTY.md mydocs/tech
rg -n "downscale|maximum canvas|large canvas|full-page|full page|전체 페이지" README*.md PRIVACY.md mydocs/tech/task_m030_37_chrome_web_store_dashboard.md
git diff --check
```

### 커밋

```text
Task #37 Stage 2: Dashboard 입력값 표 확정
```

## Stage 3 — Package/Upload와 제출 전 smoke checklist 확정

### 산출물

신규:

- `mydocs/working/task_m030_37_stage3.md`

수정:

- `mydocs/tech/task_m030_37_chrome_web_store_dashboard.md`

### 변경 내용

- `npm run build` 기준 Chrome Web Store upload package 생성 절차를 재검토한다.
- fresh zip 생성 명령을 고정하고 `/tmp/crop-0.1.0-cws.zip` contents를 기록한다.
- `dist/manifest.json`의 권한, icon, locale, version metadata를 확인한다.
- zip root에 `manifest.json`이 있고 `_locales`와 `icons`가 포함되는지 확인한다.
- zip에 `node_modules/`, `mydocs/`, repository root 개발 파일이 섞이지 않는지 확인한다.
- Store screenshot, small promotional image, optional marquee/video, localized listing을 필수/선택/후속으로 분리한다.
- 실제 submit 직전 수동 smoke checklist를 확정한다.

### 검증

```bash
npm run build
python3 -c 'from pathlib import Path; from zipfile import ZipFile, ZIP_DEFLATED; root=Path("dist"); z=ZipFile("/tmp/crop-0.1.0-cws.zip","w",ZIP_DEFLATED); [z.write(p,p.relative_to(root).as_posix()) for p in sorted(root.rglob("*")) if p.is_file()]; z.close()'
unzip -l /tmp/crop-0.1.0-cws.zip
sed -n '1,240p' dist/manifest.json
rg -n "Store screenshot|Small promotional image|small promo|1280x800|640x400|440x280|localized|marquee|video|review submit|upload" mydocs/tech/task_m030_37_chrome_web_store_dashboard.md
git diff --check
```

### 커밋

```text
Task #37 Stage 3: package upload와 제출 전 smoke checklist 확정
```

## Stage 4 — 통합 검증과 최종 보고

### 산출물

신규:

- `mydocs/working/task_m030_37_stage4.md`
- `mydocs/report/task_m030_37_report.md`

수정:

- `mydocs/tech/task_m030_37_chrome_web_store_dashboard.md`
- `mydocs/orders/20260604.md`
- 필요 시 `PRIVACY.md`
- 필요 시 README family

### 변경 내용

- Stage 1~3 산출물을 통합 검토한다.
- Dashboard 입력값 표, permission/privacy copy, package checklist, asset blocker, smoke checklist를 최종 대조한다.
- build/typecheck/test와 권한/privacy/branding grep으로 최종 검증한다.
- 실제 Chrome Web Store upload/review submit은 수행하지 않았음을 최종 보고서에 명시한다.
- 작업지시자 승인 필요 항목과 후속 작업 후보를 분리한다.
- 오늘할일을 완료 처리한다.

### 검증

```bash
npm run build
npm run typecheck
npm test
python3 -c 'from pathlib import Path; from zipfile import ZipFile, ZIP_DEFLATED; root=Path("dist"); z=ZipFile("/tmp/crop-0.1.0-cws.zip","w",ZIP_DEFLATED); [z.write(p,p.relative_to(root).as_posix()) for p in sorted(root.rglob("*")) if p.is_file()]; z.close()'
sed -n '1,240p' dist/manifest.json
unzip -l /tmp/crop-0.1.0-cws.zip
rg -n "activeTab|scripting|clipboardWrite|downloads|debugger|<all_urls>|host_permissions" manifest.json dist/manifest.json README.md README.ko.md README.zh-CN.md README.ja.md PRIVACY.md mydocs/tech
rg -n "server|telemetry|analytics|local|privacy|clipboard|download|Mozilla|Firefox|affiliated|endorsed|sponsored" README.md README.ko.md README.zh-CN.md README.ja.md PRIVACY.md NOTICE THIRD_PARTY.md mydocs/tech
rg -n "downscale|maximum canvas|large canvas|full-page|full page|전체 페이지|upload|review submit|Store screenshot|Small promotional" README*.md PRIVACY.md mydocs/tech mydocs/report/task_m030_37_report.md
git diff --check
git status --short
```

### 커밋

```text
Task #37 Stage 4: 통합 검증과 최종 보고
```

## 최종 보고와 PR 준비

Stage 4 완료와 승인 후 `task-final-report` 절차로 진행한다.

예상 산출물:

- `mydocs/report/task_m030_37_report.md`
- `mydocs/orders/20260604.md`
- `publish/task37` 원격 브랜치
- `devel` 대상 PR

예상 검증:

```bash
npm run build
npm run typecheck
npm test
git diff --check
git status --short
```

## 검증

- 각 Stage 검증 명령은 단계 보고서 작성 전에 실행한다.
- 실패한 검증은 단계 완료로 처리하지 않는다.
- 구현 중 파일 위치나 범위가 이 계획과 달라지면 구현계획서를 갱신하고 작업지시자 승인을 다시 받는다.
- 문서 위치가 수행계획서 판단과 달라지면 수행계획서 또는 구현계획서를 갱신하고 작업지시자 승인을 다시 받는다.
- Chrome Web Store 공식 문서 확인이 필요한 항목은 확인일과 URL을 `mydocs/tech/task_m030_37_chrome_web_store_dashboard.md`에 남긴다.

## 커밋

- 구현계획서 자체는 `Task #37: 구현계획서 작성과 오늘할일 갱신` 커밋으로 별도 기록한다.
- 단계 커밋은 단계 산출물과 `mydocs/working/task_m030_37_stage{N}.md`를 함께 묶는다.
- 커밋 메시지는 `Task #37 Stage {N}: {핵심 내용 요약}` 형식을 따른다.
- 최종 보고와 PR 게시 커밋은 `task-final-report` 절차의 커밋 규칙을 따른다.

## 단계 의존성

- Stage 1은 구현계획서 승인 후 진행한다.
- Stage 2는 Stage 1의 공식 문서/현행 산출물 재대조 보고서 승인 후 진행한다.
- Stage 3은 Stage 2의 Dashboard 입력값 표 승인 후 진행한다.
- Stage 4는 Stage 3의 package/upload checklist와 수동 smoke checklist 승인 후 진행한다.
- 최종 보고와 PR 준비는 Stage 4 단계 보고서 승인 후 진행한다.

## 위험과 대응

- **Dashboard 확인 한계**: 실제 로그인된 Developer Dashboard 화면 확인이 불가능하면 공식 문서 기준값과 `작업지시자 확인 필요` 값을 분리한다.
- **공식 문서 변동성**: Stage 1에서 확인일과 URL을 기록하고, 실제 submit 직전 재확인 항목을 남긴다.
- **PR #38 반영 누락**: Stage 1~2 grep으로 old large canvas 표현을 찾고, 필요 시 `PRIVACY.md`와 README family를 최소 보정한다.
- **권한 copy 과장**: Dashboard 입력값은 현재 manifest의 4개 권한만 설명하고 `debugger`, `<all_urls>`, broad `host_permissions`를 암시하지 않는다.
- **Asset blocker 지속**: screenshot과 small promo image는 제작하지 않고 제출 차단 blocker 또는 후속 승인 항목으로 남긴다.
- **제출 행위 오해**: upload/review submit은 이 task에서 수행하지 않고, 명시 승인 필요 항목으로 고정한다.

## 승인 요청 사항

- Stage 1~4 분할과 각 Stage 산출물
- 구현계획서에 명시한 검증 명령
- 단계별 커밋 메시지
- `mydocs/tech/task_m030_37_chrome_web_store_dashboard.md`를 Dashboard 입력값 진실 원천으로 사용하는 기준
- 필요 시 `PRIVACY.md`와 README family를 PR #38 이후 문구 불일치 보정에 한해 최소 수정하는 기준
- Store screenshot/small promotional image 제작과 실제 Chrome Web Store upload/review submit을 이번 task 범위에서 제외하고 blocker/후속 승인 항목으로 남기는 기준
