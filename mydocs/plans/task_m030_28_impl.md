# Task #28 구현계획서

수행계획서: [`task_m030_28.md`](task_m030_28.md)
GitHub Issue: [#28](https://github.com/postmelee/crop/issues/28)
마일스톤: M030

## 단계 개요

| Stage | 제목 | 주요 산출 | 검증 |
|---|---|---|---|
| 1 | README 정보 구조와 English 초안 작성 | `README.md`, `mydocs/working/task_m030_28_stage1.md` | diff/권한 grep/브랜딩 grep |
| 2 | English README 완성도 보정 | `README.md`, `mydocs/working/task_m030_28_stage2.md` | diff/링크 후보/권한·제한사항 대조 |
| 3 | 다국어 README 작성과 링크 연결 | `README.ko.md`, `README.zh-CN.md`, `README.ja.md`, `README.md`, `mydocs/working/task_m030_28_stage3.md` | 파일 존재/링크/권한·브랜딩 grep |
| 4 | 통합 문서 검증과 잔여 정리 | README family, `mydocs/working/task_m030_28_stage4.md` | 전체 grep/diff/status |

## 문서 위치 확인

수행계획서의 "문서 위치 판단"과 실제 Stage 산출물 경로를 다음과 같이 일치시킨다. 이번 task에서는 공식 문서 루트(`docs/`, `specs/`, `site/`, `website/`, `adr`)를 새로 만들지 않는다.

| 파일 | 수행계획서상 선택 위치 | Stage 산출물 경로 | 일치 여부 | 비고 |
|---|---|---|---|---|
| `README.md` | `README.md` | `README.md` | OK | English 기본 사용자-facing README |
| `README.ko.md` | `README.ko.md` | `README.ko.md` | OK | Korean README |
| `README.zh-CN.md` | `README.zh-CN.md` | `README.zh-CN.md` | OK | Simplified Chinese README |
| `README.ja.md` | `README.ja.md` | `README.ja.md` | OK | Japanese README |
| `mydocs/plans/task_m030_28.md` | `mydocs/plans/` | `mydocs/plans/task_m030_28.md` | OK | 수행계획서 |
| `mydocs/plans/task_m030_28_impl.md` | `mydocs/plans/` | `mydocs/plans/task_m030_28_impl.md` | OK | 구현계획서 |
| `mydocs/working/task_m030_28_stage{N}.md` | `mydocs/working/` | `mydocs/working/task_m030_28_stage{N}.md` | OK | 단계 보고서 |
| `mydocs/report/task_m030_28_report.md` | `mydocs/report/` | `mydocs/report/task_m030_28_report.md` | OK | 최종 보고서 |

## 수용 기준 고정

- 루트 README는 English 기본 문서로 작성한다.
- 루트 README 상단에서 Korean, Simplified Chinese, Japanese README 링크가 보인다.
- 각 다국어 README에서 English 루트 README로 돌아갈 수 있다.
- 기능 설명은 현재 구현 범위를 넘지 않는다.
- 권한 설명은 `manifest.json`의 `activeTab`, `scripting`, `clipboardWrite`, `downloads`와 일치한다.
- privacy/local processing 설명은 서버 전송 없음, 로컬 처리, telemetry 없음 정책을 명확히 담는다.
- Mozilla/Firefox는 upstream material, license, technical inspiration 맥락에서만 언급한다.
- Chrome Web Store 제출, 앱 아이콘, 스크린샷, 소개 동영상, 별도 privacy policy 전문은 이번 task에서 만들지 않는다.
- `debugger`, `<all_urls>`, broad host permission은 추가하지 않는다.

## Stage 1 — README 정보 구조와 English 초안 작성

### 산출물

신규:

- `mydocs/working/task_m030_28_stage1.md`

수정:

- `README.md`

### 변경 내용

- 현재 README의 개발 상태 중심 긴 목록을 제거하거나 Development 섹션으로 축약한다.
- 루트 README를 다음 사용자-facing 구조로 재배치한다.
  - 제목과 짧은 소개
  - 언어 링크 placeholder
  - 핵심 기능
  - 현재 배포 상태와 local unpacked 설치 안내
  - 기본 사용 흐름
  - 권한과 privacy/local processing
  - 제한사항
  - 개발자 quick start
  - license/attribution
- Stage 1에서는 English 문서의 전체 skeleton과 주요 문구 초안을 먼저 완성한다.
- 다국어 파일은 아직 만들지 않고, 루트 README의 링크 구조는 Stage 3에서 최종 연결한다.
- `crop` branding, Chrome MV3 권한, visible/full page capture 현재 상태가 실제 구현과 맞는지 우선 대조한다.

### 검증

```bash
git diff -- README.md
rg -n "activeTab|scripting|clipboardWrite|downloads|debugger|<all_urls>" README.md manifest.json
rg -n "Mozilla|Firefox|official|endorsed|sponsored|affiliated" README.md
git diff --check
```

### 커밋

```text
Task #28 Stage 1: README 정보 구조 초안 작성
```

## Stage 2 — English README 완성도 보정

### 산출물

신규:

- `mydocs/working/task_m030_28_stage2.md`

수정:

- `README.md`

### 변경 내용

- Stage 1 초안을 사용자 관점에서 다시 압축하고 문장을 다듬는다.
- README의 기능 설명을 현재 동작과 맞춘다.
  - action icon 또는 shortcut으로 overlay 열기
  - DOM 요소 hover highlight와 click selection
  - drag selection, resize/move, keyboard adjustment
  - Copy/Save, visible viewport capture, current full page stitching 상태
  - same-origin/srcdoc iframe 지원과 cross-origin/Chrome restricted page 제한
- 권한 설명을 Chrome Web Store 제출 문구의 기반으로 쓸 수 있게 정리한다.
- privacy 문구는 서버 전송 없음, telemetry 없음, local browser processing으로 제한해 작성한다.
- license/attribution은 MIT, MPL 2.0, `src/firefox-derived/`, `NOTICE`, `THIRD_PARTY.md`가 함께 보이도록 정리한다.
- README가 Chrome Web Store에 이미 배포된 것처럼 보이는 표현을 제거한다.

### 검증

```bash
git diff -- README.md
rg -n "activeTab|scripting|clipboardWrite|downloads|debugger|<all_urls>|host_permissions" README.md manifest.json
rg -n "Chrome Web Store|published|available|install from|Mozilla|Firefox|official|endorsed|sponsored|affiliated" README.md
rg -n "server|telemetry|local|privacy|permission|limitation|license|MPL|NOTICE|THIRD_PARTY" README.md
git diff --check
```

### 커밋

```text
Task #28 Stage 2: English README 공개 문구 보정
```

## Stage 3 — 다국어 README 작성과 링크 연결

### 산출물

신규:

- `README.ko.md`
- `README.zh-CN.md`
- `README.ja.md`
- `mydocs/working/task_m030_28_stage3.md`

수정:

- `README.md`

### 변경 내용

- Stage 2에서 확정된 English README 구조를 기준으로 Korean, Simplified Chinese, Japanese README를 작성한다.
- 각 다국어 README는 같은 섹션 순서를 유지한다.
- 각 언어 문서 상단에 언어 전환 링크를 둔다.
- 루트 `README.md`의 언어 링크를 실제 파일 경로로 연결한다.
- 번역문은 기능 범위, 권한 설명, privacy stance, limitations, license/attribution을 English 원문과 맞춘다.
- Chrome Web Store 배포 완료, 공식 Mozilla/Firefox 제휴, 미지원 기능 지원을 암시하는 번역 표현을 제거한다.

### 검증

```bash
ls README.md README.ko.md README.zh-CN.md README.ja.md
rg -n "README\\.(ko|zh-CN|ja)\\.md|README.md" README.md README.ko.md README.zh-CN.md README.ja.md
rg -n "activeTab|scripting|clipboardWrite|downloads|debugger|<all_urls>|host_permissions" README.md README.ko.md README.zh-CN.md README.ja.md manifest.json
rg -n "Mozilla|Firefox|official|endorsed|sponsored|affiliated" README.md README.ko.md README.zh-CN.md README.ja.md
rg -n "server|telemetry|local|privacy|permission|MPL|NOTICE|THIRD_PARTY" README.md README.ko.md README.zh-CN.md README.ja.md
git diff --check
```

### 커밋

```text
Task #28 Stage 3: 다국어 README 링크 구조 작성
```

## Stage 4 — 통합 문서 검증과 잔여 정리

### 산출물

신규:

- `mydocs/working/task_m030_28_stage4.md`

수정:

- 필요 시 `README.md`
- 필요 시 `README.ko.md`
- 필요 시 `README.zh-CN.md`
- 필요 시 `README.ja.md`
- 필요 시 `mydocs/orders/20260603.md`

### 변경 내용

- README family 전체를 마지막으로 대조한다.
- 언어 링크, 권한 설명, privacy/local processing, limitations, license/attribution, branding disclaimer를 통합 검토한다.
- #29 Community Standards와 브랜딩 자산 작업에서 재사용할 공개 문구 기준이 README에 남았는지 확인한다.
- 발견된 오탈자, 링크 오류, 과장 표현, 번역 drift를 좁게 수정한다.
- 오늘할일은 Stage 4 완료 시점 기준으로 진행 상태만 갱신한다. 최종 결과보고서와 PR 게시, 완료 처리는 `task-final-report` 절차에서 별도로 수행한다.

### 검증

```bash
git diff -- README.md README.ko.md README.zh-CN.md README.ja.md
ls README.md README.ko.md README.zh-CN.md README.ja.md
rg -n "README\\.(ko|zh-CN|ja)\\.md|README.md" README.md README.ko.md README.zh-CN.md README.ja.md
rg -n "activeTab|scripting|clipboardWrite|downloads|debugger|<all_urls>|host_permissions" README.md README.ko.md README.zh-CN.md README.ja.md manifest.json
rg -n "Chrome Web Store|published|available|install from|Mozilla|Firefox|official|endorsed|sponsored|affiliated" README.md README.ko.md README.zh-CN.md README.ja.md
rg -n "server|telemetry|local|privacy|permission|limitation|license|MPL|NOTICE|THIRD_PARTY" README.md README.ko.md README.zh-CN.md README.ja.md
git diff --check
git status --short
```

### 커밋

```text
Task #28 Stage 4: README 통합 문서 검증
```

## 최종 보고와 PR 준비

모든 Stage 완료와 승인 후 `task-final-report` 절차로 진행한다.

예상 산출물:

- `mydocs/report/task_m030_28_report.md`
- `mydocs/orders/20260603.md`
- `publish/task28` 원격 브랜치
- `devel` 대상 PR

예상 검증:

```bash
git diff --check
git status --short
```

필요 시 Stage 4 검증 명령을 최종 보고서에 재실행 결과로 반영한다.

## 검증

- 각 Stage 검증 명령은 단계 보고서 작성 전에 실행한다.
- 실패한 검증은 단계 완료로 처리하지 않는다.
- 계획 변경이 필요하면 구현계획서를 먼저 갱신하고 작업지시자 승인을 받는다.
- 문서 위치가 수행계획서 판단과 달라지면 구현 전에 수행계획서 또는 구현계획서를 갱신하고 작업지시자 승인을 받는다.
- README 외 source, manifest, package 파일을 변경하게 되면 해당 변경 이유를 작업지시자에게 보고하고 `npm run build`, `npm run typecheck`, 필요 시 `npm test`를 검증에 추가한다.

## 커밋

- 단계 커밋은 단계 산출물과 `mydocs/working/task_m030_28_stage{N}.md`를 함께 묶는다.
- 커밋 메시지는 `Task #28 Stage {N}: {핵심 내용 요약}` 형식을 따른다.
- 구현계획서 변경이 필요한 경우 별도 커밋으로 남기고 다음 Stage 진행 전 승인을 받는다.
- 최종 보고와 PR 게시 커밋은 `task-final-report` 절차의 커밋 규칙을 따른다.

## 단계 의존성

- Stage 2는 Stage 1의 README 정보 구조 승인 후 진행한다.
- Stage 3은 Stage 2의 English README 공개 문구 승인 후 진행한다.
- Stage 4는 Stage 3의 다국어 README와 링크 구조 승인 후 진행한다.
- 최종 보고와 PR 준비는 Stage 4 단계 보고서 승인 후 진행한다.

## 위험과 대응

- **기능 과장**: README가 현재 구현보다 큰 기능을 약속할 수 있다. 각 Stage에서 `manifest.json`, 기존 README, issue #28/#9 기준과 대조한다.
- **권한 설명 불일치**: Chrome Web Store 문구의 기반이 되는 README 권한 설명이 실제 manifest와 달라질 수 있다. `activeTab`, `scripting`, `clipboardWrite`, `downloads` grep을 Stage마다 유지한다.
- **브랜딩 오해**: Firefox UX reference와 MPL attribution이 제품 제휴처럼 보일 수 있다. `official`, `endorsed`, `sponsored`, `affiliated` 표현을 grep하고 문맥을 리뷰한다.
- **번역 drift**: 다국어 README가 English README와 다른 기능 약속을 할 수 있다. Stage 3과 Stage 4에서 같은 섹션 구조와 핵심 키워드를 대조한다.
- **문서 범위 확장**: README 작업 중 `docs/`, privacy policy 전문, Store 자산이 필요해질 수 있다. 이번 task에서는 README family로 제한하고 #29 또는 후속 브랜딩 이슈로 분리한다.

## 승인 요청 사항

- Task #28을 위 Stage 1~4 분할로 진행하는 것
- Stage별 산출물, 검증 명령, 커밋 메시지를 본 구현계획서 기준으로 고정하는 것
- 최종 보고와 PR 준비는 Stage 4 승인 후 `task-final-report` 절차로 별도 진행하는 것
- README 외 source, manifest, package 변경이 필요해지는 경우 즉시 범위 변경 승인을 받는 것
