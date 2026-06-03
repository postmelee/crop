# Task #31 구현계획서

수행계획서: [`task_m030_31.md`](task_m030_31.md)
GitHub Issue: [#31](https://github.com/postmelee/crop/issues/31)
마일스톤: M030

## 단계 개요

| Stage | 제목 | 주요 산출 | 검증 |
|---|---|---|---|
| 1 | 문체 기준 확정과 구현계획서 작성 | `mydocs/plans/task_m030_31_impl.md` | diff/status/문체 기준 수동 검토 |
| 2 | 한국어 README 존댓말 전환과 중일 README 점검 | `README.ko.md`, 필요 시 `README.zh-CN.md`, `README.ja.md`, `mydocs/working/task_m030_31_stage2.md` | 평어체 grep/문체 수동 검토/diff |
| 3 | 최종 검증과 보고 | `mydocs/report/task_m030_31_report.md`, `mydocs/orders/20260603.md` | diff/status/최종 보고 확인 |

## 문서 위치 확인

수행계획서의 "문서 위치 판단"과 실제 Stage 산출물 경로를 다음과 같이 일치시킨다. 이번 task에서는 공식 문서 루트(`docs/`, `specs/`, `site/`, `website/`, `adr`)를 새로 만들지 않는다.

| 파일 | 수행계획서상 선택 위치 | Stage 산출물 경로 | 일치 여부 | 비고 |
|---|---|---|---|---|
| `README.ko.md` | 저장소 루트 | `README.ko.md` | OK | 한국어 사용자-facing README |
| `README.zh-CN.md` | 저장소 루트 | `README.zh-CN.md` | OK | Simplified Chinese README, 필요 시 최소 수정 |
| `README.ja.md` | 저장소 루트 | `README.ja.md` | OK | Japanese README, 필요 시 최소 수정 |
| `mydocs/plans/task_m030_31.md` | `mydocs/plans/` | `mydocs/plans/task_m030_31.md` | OK | 수행계획서 |
| `mydocs/plans/task_m030_31_impl.md` | `mydocs/plans/` | `mydocs/plans/task_m030_31_impl.md` | OK | 구현계획서 |
| `mydocs/working/task_m030_31_stage{N}.md` | `mydocs/working/` | `mydocs/working/task_m030_31_stage{N}.md` | OK | 단계 보고서 |
| `mydocs/report/task_m030_31_report.md` | `mydocs/report/` | `mydocs/report/task_m030_31_report.md` | OK | 최종 보고서 |

## 수용 기준 고정

- `README.ko.md`는 사용자 안내 문서로 자연스러운 존댓말 문체를 사용한다.
- 한국어 본문은 `~입니다`, `~합니다`, `~하세요` 중심으로 정리한다.
- 명령형 단계 안내는 `여세요`, `켜세요`, `선택하세요`, `클릭하세요`처럼 안내형 존댓말을 사용한다.
- 코드 블록, 파일명, 제품명, 권한명, UI label, 바로가기 키 표기는 변경하지 않는다.
- `README.zh-CN.md`는 중국어 README에서 자연스러운 중립 안내체를 기본으로 유지한다.
- 중국어 README에 `请` 또는 `您`를 기계적으로 추가하지 않는다. 요청성 문장의 명확성이 필요할 때만 제한적으로 사용한다.
- `README.ja.md`는 `です/ます` 정중체를 기준으로 유지한다.
- 일본어 README는 평서형 혼입이나 불필요하게 딱딱한 문장이 발견될 때만 최소 수정한다.
- 기능 설명, 권한 설명, privacy/local processing, limitations, license/attribution의 의미는 기존 README family와 다르게 바꾸지 않는다.

## Stage 1 — 문체 기준 확정과 구현계획서 작성

### 산출물

신규:

- `mydocs/plans/task_m030_31_impl.md`

수정:

- `mydocs/orders/20260603.md`

### 변경 내용

- 수행계획서의 잠정 단계를 실제 작업 단계로 고정한다.
- 한국어 README 존댓말 전환 기준을 문장 유형별로 명확히 한다.
- 중국어 README는 중립 안내체 유지, 일본어 README는 `です/ます` 정중체 유지 기준을 고정한다.
- README 변경 Stage의 검증 명령과 커밋 메시지를 미리 정한다.
- 오늘할일 #31 비고를 구현계획서 승인 대기 상태로 갱신한다.

### 검증

```bash
git diff --check
git diff -- mydocs/plans/task_m030_31_impl.md mydocs/orders/20260603.md
git status --short
```

### 커밋

```text
Task #31: 구현 계획서 작성과 오늘할일 갱신
```

## Stage 2 — 한국어 README 존댓말 전환과 중일 README 점검

### 산출물

신규:

- `mydocs/working/task_m030_31_stage2.md`

수정:

- `README.ko.md`
- 필요 시 `README.zh-CN.md`
- 필요 시 `README.ja.md`

### 변경 내용

- `README.ko.md`의 평어체 문장을 존댓말 문체로 수정한다.
  - 예: `확장이다` -> `확장입니다`
  - 예: `로드한다` -> `로드합니다`
  - 예: `연다` -> `여세요` 또는 `엽니다`
  - 예: `선택한다` -> `선택하세요` 또는 `선택합니다`
- 기능 목록의 bullet은 설명형 문장으로 유지하되 종결부를 `~합니다`로 맞춘다.
- 단계형 사용법은 사용자를 직접 안내하는 `~하세요` 문장으로 맞춘다.
- 권한 표의 이유 문장은 `~합니다`, `~수 있게 합니다`처럼 정중한 설명형으로 맞춘다.
- 개인정보/제한사항/출처와 라이선스 섹션은 의미를 바꾸지 않고 문체만 정리한다.
- `README.zh-CN.md`는 현재 중립 안내체를 유지할지 검토한다. 수정이 필요하지 않으면 단계 보고서에 "수정 없음"과 근거를 기록한다.
- `README.ja.md`는 현재 `です/ます` 정중체를 유지할지 검토한다. 수정이 필요하지 않으면 단계 보고서에 "수정 없음"과 근거를 기록한다.

### 검증

```bash
git diff -- README.ko.md README.zh-CN.md README.ja.md
rg -n "이다\\.|한다\\.|된다\\.|있다\\.|없다\\.|연다\\.|선택한다\\.|사용한다\\.|요청한다\\.|유지한다\\." README.ko.md || true
rg -n "입니다|합니다|하세요|됩니다|있습니다|없습니다" README.ko.md
rg -n "请|您" README.zh-CN.md || true
rg -n "です|ます|ません|ください" README.ja.md
git diff --check
```

### 커밋

```text
Task #31 Stage 2: 한국어 README 존댓말 문체 정리
```

## Stage 3 — 최종 검증과 보고

### 산출물

신규:

- `mydocs/report/task_m030_31_report.md`

수정:

- `mydocs/orders/20260603.md`

### 변경 내용

- README family 전체의 변경 범위를 최종 확인한다.
- 한국어 README 존댓말 전환 결과와 중일 README 문체 판단을 최종 보고서에 기록한다.
- 오늘할일 #31 행을 완료 상태로 갱신한다.
- PR 게시 준비 전에 작업트리가 깨끗한지 확인한다.

### 검증

```bash
git diff -- README.ko.md README.zh-CN.md README.ja.md mydocs/orders/20260603.md mydocs/report/task_m030_31_report.md
git diff --check
git status --short
```

### 커밋

```text
Task #31: 최종 보고서 작성과 오늘할일 완료 처리
```

## 최종 보고와 PR 준비

모든 Stage 완료와 승인 후 `task-final-report` 절차로 진행한다.

예상 산출물:

- `mydocs/report/task_m030_31_report.md`
- `mydocs/orders/20260603.md`
- `publish/task31` 원격 브랜치
- `devel` 대상 PR

예상 검증:

```bash
git diff --check
git status --short
```

필요 시 Stage 2 검증 명령을 최종 보고서에 재실행 결과로 반영한다.

## 검증

- 각 Stage 검증 명령은 단계 보고서 또는 최종 보고서 작성 전에 실행한다.
- 실패한 검증은 단계 완료로 처리하지 않는다.
- 계획 변경이 필요하면 구현계획서를 먼저 갱신하고 작업지시자 승인을 받는다.
- 문서 위치가 수행계획서 판단과 달라지면 구현 전에 수행계획서 또는 구현계획서를 갱신하고 작업지시자 승인을 받는다.
- README 외 source, manifest, package 파일을 변경하게 되면 해당 변경 이유를 작업지시자에게 보고하고 `npm run build`, `npm run typecheck`, 필요 시 `npm test`를 검증에 추가한다.

## 커밋

- Stage 2는 README 수정과 `mydocs/working/task_m030_31_stage2.md`를 함께 묶는다.
- 최종 보고와 PR 게시 커밋은 `task-final-report` 절차의 커밋 규칙을 따른다.
- 커밋 메시지는 구현계획서의 각 Stage에 명시한 형식을 따른다.

## 단계 의존성

- Stage 2는 본 구현계획서 승인 후 진행한다.
- Stage 3은 Stage 2 단계 보고서 승인 후 진행한다.
- 최종 PR 준비는 Stage 3 최종 보고 승인 후 진행한다.

## 위험과 대응

- **한국어 의미 변경**: 문체 전환 중 기능 설명 또는 제한사항 의미가 바뀔 수 있다. 문장 종결과 조사 중심으로 수정하고, UI label과 권한명은 그대로 둔다.
- **평어체 잔류**: `~다` 종결 문장이 일부 남을 수 있다. 정규식 grep과 수동 검토를 함께 사용한다.
- **중국어 과잉 정중화**: `请` 또는 `您`를 과도하게 넣으면 중국어 README가 부자연스러워질 수 있다. 현재 중립 안내체를 기본으로 유지한다.
- **일본어 불필요 수정**: 이미 정중체인 문서를 불필요하게 수정하면 번역 drift가 생길 수 있다. 수정 필요성이 명확할 때만 최소 수정한다.
