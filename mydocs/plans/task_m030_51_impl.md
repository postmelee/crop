# Task #51 구현계획서 - Chrome Web Store 게시 완료 후 README 설치 안내 갱신

수행계획서: [`task_m030_51.md`](task_m030_51.md)
GitHub Issue: [#51](https://github.com/postmelee/crop/issues/51)
마일스톤: M030

## 단계 개요

| Stage | 제목 | 주요 산출 | 검증 |
|---|---|---|---|
| 1 | README 현황과 게시 URL 기준 확인 | `mydocs/working/task_m030_51_stage1.md` | Store URL 접근, README release/install 문구, 권한/제한 문구 대조 |
| 2 | README 설치 안내 갱신 | `README.md`, `README.ko.md`, `README.ja.md`, `README.zh-CN.md`, `mydocs/working/task_m030_51_stage2.md` | Store URL 반영, source loading 안내 유지, privacy/permissions/current limits 충돌 확인 |
| 3 | 최종 검증과 보고 | `mydocs/report/task_m030_51_report.md`, `mydocs/orders/20260608.md` | 최종 grep, `git diff --check`, `git status --short` |

## 문서 위치 확인

수행계획서의 "문서 위치 판단"과 실제 Stage 산출물 경로는 다음과 같이 일치시킨다. 이번 task는 기존 repository root README 계열을 공식 사용자/기여자 안내 위치로 유지하고, 새 공식 문서 루트는 만들지 않는다.

| 파일 | 수행계획서상 선택 위치 | Stage 산출물 경로 | 일치 여부 | 비고 |
|---|---|---|---|---|
| `README.md` | repository root | `README.md` | OK | 기본 언어 사용자 설치 안내 |
| `README.ko.md` | repository root | `README.ko.md` | OK | 한국어 사용자 설치 안내 |
| `README.ja.md` | repository root | `README.ja.md` | OK | 일본어 사용자 설치 안내 |
| `README.zh-CN.md` | repository root | `README.zh-CN.md` | OK | 중국어 간체 사용자 설치 안내 |
| `mydocs/working/task_m030_51_stage1.md` | `mydocs/working/` | `mydocs/working/task_m030_51_stage1.md` | OK | 현황 조사와 URL 기준 확인 |
| `mydocs/working/task_m030_51_stage2.md` | `mydocs/working/` | `mydocs/working/task_m030_51_stage2.md` | OK | README 갱신과 검증 기록 |
| `mydocs/report/task_m030_51_report.md` | `mydocs/report/` | `mydocs/report/task_m030_51_report.md` | OK | 최종 결과보고서 |
| `mydocs/plans/task_m030_51_impl.md` | `mydocs/plans/` | `mydocs/plans/task_m030_51_impl.md` | OK | 구현계획서 |
| `mydocs/orders/20260608.md` | `mydocs/orders/` | `mydocs/orders/20260608.md` | OK | 오늘할일 상태 보드 |

## 수용 기준 고정

- README의 첫 사용자 안내가 Chrome Web Store 공식 설치 경로를 우선한다.
- Store listing URL `https://chromewebstore.google.com/detail/crop/pdmniipgbjdcpnhbkkppodechbehagki`가 README 4개 언어 파일에 반영된다.
- source build/load unpacked 안내가 개발자용 경로로 남아 있다.
- privacy, permissions, current limits 문구가 새 설치 안내와 충돌하지 않는다.
- 다국어 README 4개가 같은 게시 상태를 설명한다.
- Chrome Web Store listing copy, extension 기능, 권한, privacy policy 본문은 변경하지 않는다.

## Stage 1 — README 현황과 게시 URL 기준 확인

### 산출물

신규:

- `mydocs/working/task_m030_51_stage1.md`

수정:

- 필요 시 `mydocs/orders/20260608.md`

### 변경 내용

- 작업지시자가 제공한 Chrome Web Store URL을 기준으로 공개 listing 접근 가능 여부를 확인한다.
- README 4개 언어 파일의 release status, 설치, source loading 문구를 조사한다.
- `manifest.json` 권한과 README 권한 표의 현재 설명을 대조한다.
- Chrome Web Store 제한 페이지, cross-origin iframe, full-page capture 같은 current limits 문구가 설치 안내와 충돌하는지 확인한다.
- Stage 1에서는 README 본문을 수정하지 않고, 변경 대상과 문구 방향만 단계 보고서에 고정한다.

### 검증

```bash
git status --short --branch
rg -n "Release status|배포 상태|リリース状況|发布状态|Chrome Web Store|listed|Load from source|소스에서 로드|ソースから読み込む|从源码加载|Privacy Policy|Permissions|Current Limits|권한|개인정보|現在の制限|当前限制" README.md README.ko.md README.ja.md README.zh-CN.md
rg -n "debugger|<all_urls>|host_permissions|downloads|activeTab|scripting|clipboardWrite" manifest.json README.md README.ko.md README.ja.md README.zh-CN.md
git diff --check
```

### 커밋

```text
Task #51 Stage 1: README 게시 상태 기준 확인
```

## Stage 2 — README 설치 안내 갱신

### 산출물

신규:

- `mydocs/working/task_m030_51_stage2.md`

수정:

- `README.md`
- `README.ko.md`
- `README.ja.md`
- `README.zh-CN.md`
- 필요 시 `mydocs/orders/20260608.md`

### 변경 내용

- README 4개 언어 파일의 상단 release status를 Chrome Web Store 게시 완료 상태로 갱신한다.
- 각 README의 첫 설치 경로를 Chrome Web Store 공식 URL로 바꾸고, 사용자가 확장을 추가한 뒤 일반 웹 페이지에서 실행하는 흐름을 유지한다.
- 기존 source build/load unpacked 안내는 개발자용 설치 또는 개발용 로드 섹션으로 재배치하고 삭제하지 않는다.
- `Privacy`, `Permissions`, `Current Limits` 섹션의 기존 경계와 충돌하지 않도록 연결 문구만 필요한 만큼 보정한다.
- 제품명은 `crop`만 사용하고, Mozilla/Firefox 명칭은 기존 attribution 범위 밖으로 확장하지 않는다.

### 검증

```bash
git status --short --branch
rg -n "Chrome Web Store|pdmniipgbjdcpnhbkkppodechbehagki|load unpacked|Load unpacked|Privacy Policy|Permissions|Current Limits|debugger|<all_urls>|host_permissions" README.md README.ko.md README.ja.md README.zh-CN.md
git diff -- README.md README.ko.md README.ja.md README.zh-CN.md
git diff --check
```

### 커밋

```text
Task #51 Stage 2: README 설치 안내 갱신
```

## Stage 3 — 최종 검증과 보고

### 산출물

신규:

- `mydocs/report/task_m030_51_report.md`

수정:

- `mydocs/orders/20260608.md`
- 필요 시 `mydocs/working/task_m030_51_stage2.md`

### 변경 내용

- Stage 1~2 결과를 최종 보고서로 정리한다.
- 최종 보고서에 Store URL, 변경 README 목록, 다국어 README 갱신 근거, 제외 항목, 검증 결과를 남긴다.
- 오늘할일 상태를 완료 후보로 갱신한다.
- PR 게시 전 미커밋 변경이 없도록 정리한다.

### 검증

```bash
rg -n "Chrome Web Store|pdmniipgbjdcpnhbkkppodechbehagki|README.md|README.ko.md|README.ja.md|README.zh-CN.md|debugger|<all_urls>|host_permissions" README.md README.ko.md README.ja.md README.zh-CN.md mydocs/working/task_m030_51_stage*.md mydocs/report/task_m030_51_report.md
git diff --check
git status --short
```

### 커밋

```text
Task #51 Stage 3: 최종 검증과 보고
```

## 승인 지점

- Stage 1 완료 후 README 갱신 방향과 제외 항목을 작업지시자에게 승인받는다.
- Stage 2 완료 후 README 4개 언어 파일의 실제 변경 내용을 작업지시자에게 승인받는다.
- Stage 3 완료 후 최종 보고서와 PR 준비 상태를 승인받는다.
- Stage 3 승인 후 `task-final-report` 절차로 PR 게시를 진행한다.

## 최종 보고와 PR 준비

Stage 3 완료와 승인 후 `task-final-report` 절차로 진행한다.

예상 산출물:

- `mydocs/report/task_m030_51_report.md`
- `mydocs/orders/20260608.md`
- `publish/task51` 원격 브랜치
- `devel` 대상 PR

예상 검증:

```bash
git status --short --branch
git diff --check
rg -n "Chrome Web Store|pdmniipgbjdcpnhbkkppodechbehagki|README.md|README.ko.md|README.ja.md|README.zh-CN.md" README.md README.ko.md README.ja.md README.zh-CN.md mydocs/working mydocs/report
```

## 검증

- 각 Stage 검증 명령은 단계 보고서 또는 최종 보고서 작성 전에 실행한다.
- 실패한 검증은 단계 완료로 처리하지 않는다.
- 구현 중 파일 위치나 범위가 이 계획과 달라지면 구현계획서를 갱신하고 작업지시자 승인을 다시 받는다.
- 권한, privacy policy 본문, Store listing copy 변경 필요가 발견되면 이번 task에서 직접 수정하지 않고 별도 이슈로 분리한다.

## 커밋

- 구현계획서 자체는 `Task #51: 구현계획서 작성과 오늘할일 갱신` 커밋으로 별도 기록한다.
- 단계 커밋은 단계 산출물과 `mydocs/working/task_m030_51_stage{N}.md` 또는 최종 보고서를 함께 묶는다.
- 커밋 메시지는 `Task #51 Stage {N}: {핵심 내용 요약}` 형식을 따른다.
- 최종 보고와 PR 게시 커밋은 `task-final-report` 절차의 커밋 규칙을 따른다.

## 단계 의존성

- Stage 2는 Stage 1의 README 갱신 방향 승인 후 진행한다.
- Stage 3은 Stage 2의 README 변경 내용 승인 후 진행한다.

## 위험과 대응

- **Store URL 접근 결과 차이**: Chrome Web Store는 로그인, 지역, 동적 렌더링에 따라 결과가 다르게 보일 수 있다. 작업지시자가 제공한 URL을 기준으로 하고, 접근 확인 결과와 한계는 Stage 1 보고서에 남긴다.
- **다국어 README 불일치**: 언어별 표현 차이 때문에 설치 상태가 어긋날 수 있다. Stage 2 검증에서 동일 extension id와 같은 release 상태 전환 여부를 확인한다.
- **권한 문서 불일치**: README 권한 표와 manifest가 어긋나면 신뢰 문제가 생긴다. 권한 변경 없이 문서 일치 여부만 확인하고, 권한 변경이 필요하면 별도 task로 분리한다.

## 승인 요청 사항

- 위 Stage 분할, 산출물, 검증 명령, 커밋 메시지로 #51 구현을 진행한다.
- Stage 1에서는 README 본문을 수정하지 않고 현황 조사와 갱신 방향만 보고한다.
- Stage 2에서 README 4개 언어 파일을 같은 게시 상태로 갱신한다.
- Stage 3에서 최종 보고서를 작성하고 PR 게시 전 승인을 요청한다.
