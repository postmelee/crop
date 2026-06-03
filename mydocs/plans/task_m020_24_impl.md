# Task #24 구현계획서

수행계획서: [`task_m020_24.md`](task_m020_24.md)
GitHub Issue: [#24](https://github.com/postmelee/crop/issues/24)
마일스톤: M020

## 단계 개요

| Stage | 제목 | 주요 산출 | 검증 |
|---|---|---|---|
| 1 | 큰 wrapper 자동 후보 정책 보정 | `overlay-helpers.ts`, helper 단위 테스트, Stage 1 보고서 | typecheck/test/grep/diff |
| 2 | fixture와 overlay null 후보 회귀 보강 | Phase 6 fixture/overlay regression, Stage 2 보고서 | build/typecheck/test/diff |
| 3 | 품질 매트릭스와 권한 경계 정리 | quality matrix, permission/source grep, Stage 3 보고서 | build/typecheck/test/grep/diff |
| 4 | 최종 검증과 보고 | 최종 보고서, 오늘할일, Stage 4 보고서 | build/typecheck/test/status/diff |

## 문서 위치 확인

수행계획서의 "문서 위치 판단"과 실제 Stage 산출물 경로를 다음과 같이 일치시킨다. 이번 task에서는 공식 제품 문서 루트(`docs/`, `specs/`, `site/`, `website/`, `adr`)를 새로 만들지 않는다.

| 파일 | 수행계획서상 선택 위치 | Stage 산출물 경로 | 일치 여부 | 비고 |
|---|---|---|---|---|
| `mydocs/tech/task_m020_8_quality_matrix.md` | `mydocs/tech/` | `mydocs/tech/task_m020_8_quality_matrix.md` | OK | 큰 wrapper 자동 추천 제외 품질 항목 추가 |
| `mydocs/plans/task_m020_24.md` | `mydocs/plans/` | `mydocs/plans/task_m020_24.md` | OK | 수행계획서 |
| `mydocs/plans/task_m020_24_impl.md` | `mydocs/plans/` | `mydocs/plans/task_m020_24_impl.md` | OK | 구현계획서 |
| `mydocs/working/task_m020_24_stage{N}.md` | `mydocs/working/` | `mydocs/working/task_m020_24_stage{N}.md` | OK | 단계 보고서 |
| `mydocs/report/task_m020_24_report.md` | `mydocs/report/` | `mydocs/report/task_m020_24_report.md` | OK | 최종 보고서 |

## 수용 기준 고정

- 너무 큰 wrapper 단독 hover는 viewport 크기로 잘린 자동 선택 후보를 만들지 않는다.
- 너무 큰 parent/wrapper를 만나기 전 유효한 작은 후보가 있으면 해당 후보를 유지한다.
- 의미 있는 table/infobox/card 요소는 threshold 정책 안에서 정상 선택된다.
- Copy/Save는 잘못된 wrapper fallback rect가 아니라 실제 선택 rect 기준으로 수행된다.
- `debugger`, `<all_urls>`, broad host permission은 추가하지 않는다.
- Firefox-derived 파일의 MPL boundary와 출처 표기는 유지한다.
- 수동 drag selection, full page capture, visible viewport preview UI는 이번 task에서 변경하지 않는다.

## Stage 1 — 큰 wrapper 자동 후보 정책 보정

### 산출물

신규:

- `mydocs/working/task_m020_24_stage1.md`

수정:

- `src/firefox-derived/overlay-helpers.ts`
- `tests/firefox-derived/overlay-helpers.test.ts`

### 변경 내용

- `getBestRectForElement()`의 큰 요소 처리 정책을 수정한다.
  - 초기 target 자체가 `maxDetectWidth` 또는 `maxDetectHeight`를 초과하면 viewport fallback rect를 반환하지 않고 `null`을 반환한다.
  - child에서 parent로 올라가다가 큰 parent를 만나면 이미 확보한 유효 후보를 유지한다.
  - 후보가 없고 큰 parent만 있는 경우는 자동 선택 후보 없음으로 처리한다.
- `getFallbackRect()`가 더 이상 큰 wrapper를 `maxDetect` 크기로 잘라 후보화하지 않도록 제거하거나 호출 경로를 제한한다.
- threshold override 테스트는 새 의미에 맞게 고친다.
  - max threshold를 낮추면 큰 요소가 잘린 rect로 반환되지 않고 제외되는지 확인한다.
  - 기존 small-to-parent, heading, article, sibling extension, iframe fallback 테스트는 유지한다.
- NamuWiki 유사 케이스의 핵심 단위 테스트를 추가한다.
  - 큰 wrapper 단독 후보 없음
  - 큰 wrapper 내부의 적절한 card 유지
  - 내부 table/infobox 후보 유지

### 검증

```bash
npm run typecheck
npm test -- tests/firefox-derived/overlay-helpers.test.ts
rg "getFallbackRect|isTooLarge|maxDetect|previousRect|debugger|<all_urls>" src/firefox-derived tests/firefox-derived manifest.json
git diff --check
```

### 커밋

```text
Task #24 Stage 1: 큰 wrapper 후보 정책 보정
```

## Stage 2 — fixture와 overlay null 후보 회귀 보강

### 산출물

신규:

- `mydocs/working/task_m020_24_stage2.md`

수정:

- 필요 시 `src/content/overlay/crop-overlay.ts`
- 필요 시 `tests/content/overlay/phase6-regression.test.ts`
- 필요 시 `tests/fixtures/phase6_edge_cases.html`

### 변경 내용

- helper가 `null` 후보를 반환할 때 overlay runtime이 이전 highlight를 부적절하게 유지하지 않는지 확인한다.
- 자동 테스트만으로 부족하면 Phase 6 fixture에 NamuWiki 유사 큰 wrapper와 내부 target을 추가한다.
  - 큰 outer wrapper
  - 내부 infobox/table
  - 내부 일반 card 또는 content block
- fixture 기반 regression은 DOM helper expectations와 runtime source grep을 최소로 유지한다. 실제 Chrome smoke가 필요하면 단계 보고서에 수동 확인 후보로 분리한다.
- selected/drag/visible/full page capture 경로의 기존 동작은 변경하지 않는다.

### 검증

```bash
npm run build
npm run typecheck
npm test
rg "wrapper|large|infobox|table|selection|highlight|null" src tests/fixtures tests/content/overlay
git diff --check
```

### 커밋

```text
Task #24 Stage 2: wrapper fixture와 overlay 회귀 보강
```

## Stage 3 — 품질 매트릭스와 권한 경계 정리

### 산출물

신규:

- `mydocs/working/task_m020_24_stage3.md`

수정:

- `mydocs/tech/task_m020_8_quality_matrix.md`
- 필요 시 `tests/content/overlay/phase6-regression.test.ts`

### 변경 내용

- 품질 매트릭스에 큰 wrapper 자동 추천 제외 항목을 추가한다.
- 수용 기준별 자동 검증 근거를 기록한다.
  - 큰 wrapper 후보 없음
  - 내부 table/infobox/card 후보 유지
  - Copy/Save rect 기준 회귀 없음
- `manifest.json`에 권한 추가가 없음을 grep과 테스트 근거로 확인한다.
- Firefox-derived 코드에 새 외부 원문 복사가 없는지 source grep으로 확인한다.

### 검증

```bash
npm run build
npm run typecheck
npm test
rg "wrapper|자동 추천|too large|MAX_DETECT|debugger|<all_urls>|#24|MPL|Mozilla|Firefox" mydocs src tests manifest.json NOTICE THIRD_PARTY.md
git diff --check
```

### 커밋

```text
Task #24 Stage 3: 품질 매트릭스와 권한 경계 정리
```

## Stage 4 — 최종 검증과 보고

### 산출물

신규:

- `mydocs/working/task_m020_24_stage4.md`
- `mydocs/report/task_m020_24_report.md`

수정:

- `mydocs/orders/20260602.md`
- 필요 시 `mydocs/tech/task_m020_8_quality_matrix.md`

### 변경 내용

- 전체 검증 명령을 다시 실행하고 결과를 최종 보고서에 정리한다.
- 이슈 수용 기준과 실제 변경 파일을 매핑한다.
- 알려진 제한과 수동 smoke 후보가 남으면 최종 보고서에 명확히 분리한다.
- 오늘할일 상태를 최종 보고/PR 준비 상태로 갱신한다.
- PR 게시 전 `local/task24` 작업트리가 깨끗한지 확인한다.

### 검증

```bash
npm run build
npm run typecheck
npm test
rg "wrapper|자동 추천|too large|MAX_DETECT|debugger|<all_urls>|#24" mydocs src tests manifest.json
git status --short
git diff --check
```

### 커밋

```text
Task #24 Stage 4 + 최종 보고서: 큰 wrapper 자동 후보 제외 완료
```

## 검증

- 각 Stage 검증 명령은 단계 보고서 작성 전에 실행한다.
- 실패한 검증은 단계 완료로 처리하지 않는다.
- 계획 변경이 필요하면 구현계획서를 먼저 갱신하고 작업지시자 승인을 받는다.
- 문서 위치가 수행계획서 판단과 달라지면 구현 전에 수행계획서 또는 구현계획서를 갱신하고 작업지시자 승인을 받는다.

## 커밋

- 단계 커밋은 단계 산출물과 `mydocs/working/task_m020_24_stage{N}.md`를 함께 묶는다.
- 커밋 메시지는 `Task #24 Stage {N}: {핵심 내용 요약}` 형식을 따른다.
- 최종 단계는 최종 결과보고서와 함께 `Task #24 Stage 4 + 최종 보고서: 큰 wrapper 자동 후보 제외 완료` 형식을 사용한다.

## 단계 의존성

- Stage 2는 Stage 1의 helper 정책과 단위 테스트가 통과한 뒤 진행한다.
- Stage 3은 Stage 2의 fixture/runtime 회귀가 통과하고 단계 보고서 승인을 받은 뒤 진행한다.
- Stage 4는 Stage 3의 문서/권한 경계 정리가 승인된 뒤 진행한다.

## 위험과 대응

- **후보 없음 상태 UX 회귀**: Stage 2에서 overlay null candidate 처리를 fixture/regression으로 확인한다.
- **table/infobox 오탐**: Stage 1에서 table/infobox 후보 유지 테스트를 고정하고, 필요 시 Stage 2 fixture로 보강한다.
- **기존 Firefox-derived 휴리스틱 회귀**: heading, article, sibling extension, iframe/shadow 기존 테스트를 유지하고 전체 테스트를 단계마다 실행한다.
- **권한 범위 확대**: Stage 3/4 grep에서 `debugger`, `<all_urls>`, host permission 추가 여부를 확인한다.

## 승인 요청 사항

- Task #24를 위 Stage 1~4 구현계획으로 진행하는 것
- Stage 1에서 helper 정책 수정과 단위 테스트를 한 커밋으로 묶는 것
- Stage 2의 fixture/overlay 보강은 실제 필요가 확인된 파일에만 좁게 적용하는 것
- Stage 4에서 최종 결과보고서와 단계 보고서를 함께 묶어 최종 단계 커밋을 만드는 것
