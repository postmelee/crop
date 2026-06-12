# 구현계획서

수행계획서: [`task_m020_66.md`](task_m020_66.md)
GitHub Issue: [#66](https://github.com/postmelee/crop/issues/66)
마일스톤: M020

## 단계 개요

| Stage | 제목 | 주요 산출 | 검증 |
|---|---|---|---|
| 1 | selected scroll planning 계약 고정 | `src/content/overlay/full-page-capture.ts`, `tests/content/overlay/full-page-capture.test.ts` | selected page rect 최소 이동 scroll 테스트 |
| 2 | selected stitching runtime 보정 | `src/content/overlay/full-page-capture.ts`, `src/content/overlay/crop-overlay.ts`, 관련 테스트 | focused test, typecheck |
| 3 | 회귀 검증과 수동 smoke 기준 정리 | `tests/content/overlay/phase6-regression.test.ts`, `mydocs/working/task_m020_66_stage3.md` | phase6 regression, 권한 grep |
| 4 | 최종 보고와 PR 준비 | `mydocs/report/task_m020_66_report.md`, `mydocs/orders/20260613.md` | full test, diff check |

## 문서 위치 확인

수행계획서의 "문서 위치 판단"과 실제 Stage 산출물 경로는 일치한다. 공식 사용자 문서 루트는 이번 task에서 만들거나 수정하지 않는다.

| 파일 | 수행계획서상 선택 위치 | Stage 산출물 경로 | 일치 여부 | 비고 |
|---|---|---|---|---|
| `mydocs/plans/task_m020_66_impl.md` | `mydocs/plans/` | `mydocs/plans/task_m020_66_impl.md` | OK | 구현계획서 |
| `mydocs/working/task_m020_66_stage{N}.md` | `mydocs/working/` | `mydocs/working/task_m020_66_stage{N}.md` | OK | 단계 보고 |
| `mydocs/report/task_m020_66_report.md` | `mydocs/report/` | `mydocs/report/task_m020_66_report.md` | OK | 최종 보고 |
| 공식 사용자 문서 | 생성하지 않음 | 해당 없음 | OK | 사용자-facing 문서 변경 없음 |

## Stage 1 — selected scroll planning 계약 고정

### 산출물

수정:

- `src/content/overlay/full-page-capture.ts`
- `tests/content/overlay/full-page-capture.test.ts`
- `mydocs/working/task_m020_66_stage1.md`

### 변경 내용

- selected page rect capture에서 사용할 최소 이동 scroll 정책을 helper 수준으로 정의한다.
- 선택 rect의 width/height가 viewport width/height 이하인 축은 현재 scroll 위치를 최대한 유지하면서 rect 전체가 viewport 안에 들어오도록 scroll 값을 계산한다.
- 선택 rect가 viewport보다 큰 축은 기존 segment start 기반 scroll을 유지한다.
- 기존 full page tiling과 multi-tile selected rect planning이 회귀하지 않도록 기존 테스트 기대값을 유지한다.

### 검증

```bash
npm test -- tests/content/overlay/full-page-capture.test.ts
git diff --check
```

### 커밋

```text
Task #66 Stage 1: selected scroll planning 계약 고정
```

## Stage 2 — selected stitching runtime 보정

### 산출물

수정:

- `src/content/overlay/full-page-capture.ts`
- `src/content/overlay/crop-overlay.ts`
- `tests/content/overlay/full-page-capture.test.ts`
- `tests/shared/stitch-image.test.ts` 또는 focused helper test
- `mydocs/working/task_m020_66_stage2.md`

### 변경 내용

- Stage 1의 최소 이동 scroll 정책을 `capturePageRectTiles()` selected 경로에 연결한다.
- full page capture 호출은 기존 scroll planning을 유지하도록 옵션 또는 별도 planning mode를 둔다.
- 검정 placeholder retry는 selected stitching 경로에만 적용한다.
  - raw captured tile crop 영역이 all-black 또는 극단적으로 낮은 분산인 경우에만 최대 1-2회 짧게 재시도한다.
  - 실제 검정 콘텐츠 오탐 위험을 줄이기 위해 retry 후에도 동일하면 결과를 실패 처리하지 않고 마지막 capture를 사용한다.
  - retry 적용 여부와 정확한 감지 기준은 Stage 2 구현 직전 코드 구조를 확인해 결정한다.

### 검증

```bash
npm test -- tests/content/overlay/full-page-capture.test.ts tests/shared/stitch-image.test.ts tests/shared/crop-image.test.ts
npm run typecheck
git diff --check
```

### 커밋

```text
Task #66 Stage 2: selected stitching 캡처 보정
```

## Stage 3 — 회귀 검증과 수동 smoke 기준 정리

### 산출물

수정:

- `tests/content/overlay/phase6-regression.test.ts`
- `mydocs/working/task_m020_66_stage3.md`
- 필요 시 `mydocs/tech/task_m020_8_quality_matrix.md`

### 변경 내용

- phase6 regression에 selected page rect planning과 권한 경계를 고정하는 문자열 또는 helper 계약 검증을 추가한다.
- manual smoke 절차를 기록한다.
  - 같은 광고 영역이 viewport 안에 완전히 들어온 경우와 일부 밖에 있는 경우를 비교한다.
  - 일반 본문 selected capture가 viewport 밖이어도 정상인지 확인한다.
  - 결과 크기, 검정 placeholder 여부, 시작 scroll 복구 여부를 확인한다.
- 품질 매트릭스 갱신이 필요하면 `mydocs/tech/task_m020_8_quality_matrix.md`에 #66 항목을 좁게 추가한다.

### 검증

```bash
npm test -- tests/content/overlay/phase6-regression.test.ts
rg "debugger|<all_urls>|host_permissions" manifest.json src tests
git diff --check
```

### 커밋

```text
Task #66 Stage 3: 회귀 검증과 smoke 기준 정리
```

## Stage 4 — 최종 보고와 PR 준비

### 산출물

신규:

- `mydocs/report/task_m020_66_report.md`

수정:

- `mydocs/orders/20260613.md`
- 필요 시 `mydocs/plans/task_m020_66_impl.md`

### 변경 내용

- 최종 보고서에 변경 요약, 수용 기준 결과, 검증 명령 결과, 잔여 리스크를 정리한다.
- 오늘할일 상태를 완료로 갱신한다.
- PR 게시 전 작업 범위와 수동 smoke 잔여 항목을 명확히 기록한다.

### 검증

```bash
npm run typecheck
npm test
rg "debugger|<all_urls>|host_permissions" manifest.json src tests
git diff --check
git status --short
```

### 커밋

```text
Task #66 Stage 4: 최종 보고서 작성
```

## 검증

- 각 Stage 검증 명령은 단계 보고서 작성 전에 실행한다.
- 실패한 검증은 단계 완료로 처리하지 않는다.
- 계획 변경이 필요하면 구현계획서를 먼저 갱신하고 작업지시자 승인을 받는다.
- 문서 위치가 수행계획서 판단과 달라지면 구현 전에 수행계획서 또는 구현계획서를 갱신하고 작업지시자 승인을 받는다.

## 커밋

- 단계 커밋은 단계 산출물과 `mydocs/working/task_m020_66_stage{N}.md`를 함께 묶는다.
- 커밋 메시지는 `Task #66 Stage {N}: {핵심 내용 요약}` 형식을 따른다.

## 단계 의존성

- Stage 2는 Stage 1의 scroll planning 계약과 테스트가 확정된 뒤 진행한다.
- Stage 3은 Stage 2의 runtime 보정과 focused 검증이 끝난 뒤 진행한다.
- Stage 4는 Stage 3 검증과 수동 smoke 기준 정리가 끝난 뒤 진행한다.

## 위험과 대응

- **retry 오탐**: 실제 검정 콘텐츠를 placeholder로 잘못 판단할 수 있다. retry는 selected stitching에만, 제한 횟수로만 적용하고 최종 실패로 처리하지 않는다.
- **full page capture 회귀**: 공용 helper 변경이 full page capture에 번질 수 있다. full page 호출은 기존 planning mode를 유지하고 테스트로 고정한다.
- **외부 광고 재현 불안정**: 광고 소재와 로딩 타이밍은 외부 상태에 의존한다. 자동 테스트는 정책과 계약을 검증하고, 실제 광고는 수동 smoke 절차로 보완한다.
- **권한 확대 유혹**: `debugger`, `<all_urls>`, broad host permission은 이번 task 범위에서 제외하고 권한 grep으로 검증한다.

## 승인 요청 사항

- Stage 1-4 단계 분할과 산출물 승인
- Stage 1에서 selected scroll planning 계약 테스트와 helper 보정을 시작하는 것 승인
- Stage 2에서 retry 정책은 selected stitching 경로에 한정해 구현 직전 최종 코드 구조를 보고 좁게 적용하는 것 승인
