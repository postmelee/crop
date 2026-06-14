# Task #75 구현계획서 - Privacy Policy 적용 버전과 업데이트일 갱신

수행계획서: [`task_m030_75.md`](task_m030_75.md)
GitHub Issue: [#75](https://github.com/postmelee/crop/issues/75)
마일스톤: M030

## 단계 개요

| Stage | 제목 | 주요 산출 | 검증 |
|---|---|---|---|
| 1 | Privacy 문서 적용 버전과 날짜 갱신 | `PRIVACY.md`, `mydocs/working/task_m030_75_stage1.md` | 4개 언어의 `v0.1.1` 적용 문구와 2026-06-14 날짜 확인, privacy/permission 의미 보존 확인 |
| 2 | release runbook Privacy URL 규칙 추가 | `mydocs/manual/release_pipeline_guide.md`, `mydocs/working/task_m030_75_stage2.md` | `main/PRIVACY.md` 고정 URL, tag URL 역할, release마다 date/version 갱신 규칙 확인 |
| 3 | 통합 검증과 최종 보고 | `mydocs/working/task_m030_75_stage3.md`, `mydocs/report/task_m030_75_report.md`, `mydocs/orders/20260614.md` | CWS 제출 제외, release artifact/tag 불변, 최종 grep/status/diff 확인 |

## 문서 위치 확인

수행계획서의 "문서 위치 판단"과 실제 Stage 산출물 경로를 다음과 같이 일치시킨다.

| 파일 | 수행계획서상 선택 위치 | Stage 산출물 경로 | 일치 여부 | 비고 |
|---|---|---|---|---|
| `PRIVACY.md` | 저장소 루트 `PRIVACY.md` | `PRIVACY.md` | OK | Chrome Web Store Privacy URL이 가리키는 공식 privacy policy |
| `mydocs/manual/release_pipeline_guide.md` | `mydocs/manual/` | `mydocs/manual/release_pipeline_guide.md` | OK | 반복 release 절차의 운영 매뉴얼 |
| `mydocs/plans/task_m030_75_impl.md` | `mydocs/plans/` | `mydocs/plans/task_m030_75_impl.md` | OK | 구현계획서 |
| `mydocs/working/task_m030_75_stage{N}.md` | `mydocs/working/` | `mydocs/working/task_m030_75_stage{N}.md` | OK | 단계별 완료보고서 |
| `mydocs/report/task_m030_75_report.md` | `mydocs/report/` | `mydocs/report/task_m030_75_report.md` | OK | 최종 결과보고서 |

## 수용 기준 고정

- Store Dashboard Privacy URL 기본값은 `https://github.com/postmelee/crop/blob/main/PRIVACY.md`로 유지한다.
- `PRIVACY.md` 4개 언어 섹션의 업데이트 날짜가 2026-06-14 기준으로 맞춰진다.
- `PRIVACY.md` 4개 언어 섹션에 `v0.1.1 and later, unless replaced by a newer policy` 의미의 적용 버전 문구가 추가된다.
- privacy/data handling 의미는 기존과 동일하게 유지한다.
- no server upload, no telemetry/analytics, no `debugger`/`<all_urls>`/broad host permissions 문구를 약화하지 않는다.
- `mydocs/manual/release_pipeline_guide.md`가 release마다 `PRIVACY.md`의 Last updated와 적용 버전 문구를 확인하도록 안내한다.
- GitHub Release/tag, release asset, `/tmp/crop-0.1.1-cws.zip`, `manifest.json`, `package.json`은 변경하지 않는다.
- Chrome Web Store package upload와 `Submit for review`는 수행하지 않는다.

## Stage 1 - Privacy 문서 적용 버전과 날짜 갱신

### 산출물

신규:

- `mydocs/working/task_m030_75_stage1.md`

수정:

- `PRIVACY.md`
- 필요 시 `mydocs/orders/20260614.md`

### 변경 내용

- 영어 섹션의 `Last updated`를 `June 14, 2026`으로 갱신한다.
- 한국어 섹션의 `최종 업데이트`를 `2026년 6월 14일`로 갱신한다.
- 일본어 섹션의 `最終更新日`를 `2026年6月14日`로 갱신한다.
- 중국어 섹션의 `最后更新日期`를 `2026年6月14日`로 갱신한다.
- 각 언어의 첫 설명 문단 뒤에 적용 버전 문구를 추가한다.
  - English: `This policy applies to crop v0.1.1 and later, unless it is replaced by a newer policy.`
  - Korean: `이 방침은 더 새로운 방침으로 대체되기 전까지 crop v0.1.1 및 이후 버전에 적용됩니다.`
  - Japanese: `このポリシーは、より新しいポリシーに置き換えられるまで、crop v0.1.1 以降に適用されます。`
  - Chinese: `除非被更新的政策取代，本政策适用于 crop v0.1.1 及更高版本。`
- 데이터 수집, 권한, local processing, no telemetry/no server upload 문단은 의미 변경 없이 유지한다.
- Stage 1 완료보고서에 변경 문구와 검증 결과를 기록한다.

### 검증

```bash
rg -n "v0.1.1|June 14, 2026|2026년 6월 14일|2026年6月14日" PRIVACY.md
rg -n "server|telemetry|analytics|debugger|<all_urls>|host_permissions|activeTab|scripting|clipboardWrite|downloads" PRIVACY.md
git diff --check
```

### 승인 게이트

Stage 1 완료보고서 승인 전에는 `mydocs/manual/release_pipeline_guide.md`를 수정하지 않는다.

### 커밋

```text
Task #75 Stage 1: Privacy 문서 적용 버전 갱신
```

## Stage 2 - release runbook Privacy URL 규칙 추가

### 산출물

신규:

- `mydocs/working/task_m030_75_stage2.md`

수정:

- `mydocs/manual/release_pipeline_guide.md`
- 필요 시 `mydocs/orders/20260614.md`

### 변경 내용

- 강제 규칙에 Chrome Web Store Privacy URL 기본값을 `main/PRIVACY.md`로 고정한다.
- release tag URL은 GitHub Release note, 감사 기록, 특정 버전 스냅샷 확인용이며 Store Dashboard 기본값은 아니라는 기준을 명시한다.
- Release PR 전 확인 또는 GitHub Release/tag 전 확인 절차에 `PRIVACY.md`의 Last updated와 적용 버전 문구 확인을 추가한다.
- Chrome Web Store Dashboard 절차에 release마다 다음 항목을 확인하도록 추가한다.
  - `main/PRIVACY.md` URL 유효성
  - 최신 release version 적용 범위 문구
  - Last updated 날짜
  - privacy/data handling 의미 변경 여부
- 기존 release pipeline의 `main` 또는 tag URL 허용 문구와 충돌하지 않도록, 기본값과 예외 용도를 분리해 서술한다.
- Stage 2 완료보고서에 변경 위치와 확인 결과를 기록한다.

### 검증

```bash
rg -n "main/PRIVACY.md|Last updated|적용|v\\{version\\}|Chrome Web Store Privacy URL|privacy policy URL|tag URL" mydocs/manual/release_pipeline_guide.md
rg -n "main/PRIVACY.md|tag URL|Last updated|v0.1.1|Privacy URL|수행하지" mydocs/working/task_m030_75_stage2.md
git diff --check
```

### 승인 게이트

Stage 2 완료보고서 승인 전에는 최종 결과보고서 작성과 PR 게시 준비로 넘어가지 않는다.

### 커밋

```text
Task #75 Stage 2: release Privacy URL 규칙 추가
```

## Stage 3 - 통합 검증과 최종 보고

### 산출물

신규:

- `mydocs/working/task_m030_75_stage3.md`
- `mydocs/report/task_m030_75_report.md`

수정:

- `mydocs/orders/20260614.md`

### 변경 내용

- Stage 1~2 산출물을 통합 대조한다.
- `PRIVACY.md`의 4개 언어 날짜와 적용 버전 문구를 최종 확인한다.
- `release_pipeline_guide.md`의 fixed main URL 기준과 tag URL 역할 분리가 명확한지 최종 확인한다.
- 이 task가 Chrome Web Store upload, `Submit for review`, release asset 교체, tag 이동을 수행하지 않았음을 최종 보고서에 명시한다.
- 오늘할일을 완료 후보 상태로 갱신한다.

### 검증

```bash
rg -n "v0.1.1|June 14, 2026|2026년 6월 14일|2026年6月14日" PRIVACY.md
rg -n "main/PRIVACY.md|Chrome Web Store Privacy URL|tag URL|Last updated|적용 버전" mydocs/manual/release_pipeline_guide.md
rg -n "Chrome Web Store|Privacy URL|v0.1.1|Submit for review|수행하지|release asset|tag" mydocs/report/task_m030_75_report.md mydocs/working/task_m030_75_stage3.md
git diff --check
git status --short
```

### 커밋

```text
Task #75 Stage 3: 통합 검증과 최종 보고
```

## 최종 보고와 PR 준비

Stage 3 완료와 승인 후 `task-final-report` 절차로 진행한다.

예상 산출물:

- `mydocs/report/task_m030_75_report.md`
- `mydocs/orders/20260614.md`
- `publish/task75` 원격 브랜치
- `devel` 대상 PR

예상 검증:

```bash
rg -n "v0.1.1|June 14, 2026|2026년 6월 14일|2026年6月14日" PRIVACY.md
rg -n "main/PRIVACY.md|Chrome Web Store Privacy URL|tag URL|Last updated|적용 버전" mydocs/manual/release_pipeline_guide.md
git diff --check
git status --short
```

`task-final-report` 이후에도 Chrome Web Store Dashboard upload와 `Submit for review`는 작업지시자가 직접 수행한다.

## 승인 지점

- Stage 1 완료 후 `PRIVACY.md` 4개 언어 문구와 날짜 갱신 결과를 승인받는다.
- Stage 2 완료 후 `release_pipeline_guide.md`의 Privacy URL 운영 규칙을 승인받는다.
- Stage 3 완료 후 최종 보고서와 PR 게시 진행 여부를 승인받는다.
- Chrome Web Store package upload와 `Submit for review`는 이 task의 승인 지점과 별개로 작업지시자가 직접 수행한다.

## 검증

- 각 Stage 검증 명령은 단계 보고서 작성 전에 실행한다.
- 실패한 검증은 단계 완료로 처리하지 않는다.
- 구현 중 파일 위치나 범위가 이 계획과 달라지면 구현계획서를 갱신하고 작업지시자 승인을 다시 받는다.
- 문서 위치가 수행계획서 판단과 달라지면 수행계획서 또는 구현계획서를 갱신하고 작업지시자 승인을 다시 받는다.

## 커밋

- 구현계획서 자체는 `Task #75: 구현계획서 작성과 오늘할일 갱신` 커밋으로 별도 기록한다.
- 단계 커밋은 단계 산출물과 `mydocs/working/task_m030_75_stage{N}.md`를 함께 묶는다.
- 커밋 메시지는 `Task #75 Stage {N}: {핵심 내용 요약}` 형식을 따른다.

## 단계 의존성

- Stage 2는 Stage 1의 완료보고서 승인 후 진행한다.
- Stage 3은 Stage 2의 완료보고서 승인 후 진행한다.
- PR 게시 준비는 Stage 3 완료보고서와 최종 보고서 승인 후 진행한다.

## 위험과 대응

- **다국어 의미 불일치**: 적용 버전 문구를 같은 의미의 짧은 문장으로 통일하고, Stage 1 보고서에 언어별 문구를 그대로 기록한다.
- **Store URL 운영 혼동**: `main/PRIVACY.md`를 Store Dashboard 기본값으로, tag URL을 감사/스냅샷 용도로 분리해 runbook에 적는다.
- **release 산출물 변경 오해**: 검증과 최종 보고서에 `manifest.json`, `package.json`, release asset, tag, CWS 제출을 수행하지 않았음을 명시한다.

## 승인 요청 사항

- 위 3단계 분할, 산출물, 검증 명령, 커밋 메시지 기준을 승인한다.
- Stage 1에서 `PRIVACY.md`에 추가할 4개 언어 적용 버전 문구를 승인한다.
- Stage 2에서 Chrome Web Store Privacy URL 기본값을 `main/PRIVACY.md`로 문서화하는 기준을 승인한다.
