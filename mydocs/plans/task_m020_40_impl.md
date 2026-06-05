# Task #40 구현계획서

수행계획서: [`task_m020_40.md`](task_m020_40.md)
GitHub Issue: [#40](https://github.com/postmelee/crop/issues/40)
마일스톤: M020

## 단계 개요

| Stage | 제목 | 주요 산출 | 검증 |
|---|---|---|---|
| 1 | preview scroll artifact 원인 고정 | 기존 preview DOM/CSS/stitching contract 분석, Stage 1 보고서 | source grep, 관련 파일 확인, diff |
| 2 | preview 렌더링 fallback 보정 | `crop-overlay.css`, preview regression test, Stage 2 보고서 | typecheck, phase6 focused test, css grep, diff |
| 3 | 저장 PNG seam 방어 필요성 판단 | 필요 시 `stitch-image.ts`와 stitch tests, Stage 3 보고서 | typecheck, stitch/full-page/phase6 focused tests, diff |
| 4 | 품질 매트릭스와 통합 검증 | Phase 6 matrix, Stage 4 보고서, 최종 보고서, 오늘할일 | build, typecheck, full test, permission grep, status |
| 5 | 긴 페이지 tile paint settle 보정 | `full-page-capture.ts`, full-page capture test, feedback, Stage 5 보고서, 최종 보고서 보정 | build, typecheck, full test, permission grep, status |
| 6 | 보정 rollback과 후속 이슈 분리 | Stage 2/5 제품 코드 되돌림, Stage 6 보고서, 최종 보고서 보정, 새 이슈 초안 | build, typecheck, full test, permission grep, status |

## 문서 위치 확인

수행계획서의 "문서 위치 판단"과 실제 Stage 산출물 경로를 다음과 같이 일치시킨다. 공식 사용자 문서 루트는 만들지 않고, 내부 품질 기준과 작업 산출물만 갱신한다.

| 파일 | 수행계획서상 선택 위치 | Stage 산출물 경로 | 일치 여부 | 비고 |
|---|---|---|---|---|
| `mydocs/tech/task_m020_8_quality_matrix.md` | `mydocs/tech/` | `mydocs/tech/task_m020_8_quality_matrix.md` | OK | preview scroll blank 수동 smoke와 품질 항목 추가 |
| `mydocs/plans/task_m020_40.md` | `mydocs/plans/` | `mydocs/plans/task_m020_40.md` | OK | 수행계획서 |
| `mydocs/plans/task_m020_40_impl.md` | `mydocs/plans/` | `mydocs/plans/task_m020_40_impl.md` | OK | 구현계획서 |
| `mydocs/working/task_m020_40_stage{N}.md` | `mydocs/working/` | `mydocs/working/task_m020_40_stage{N}.md` | OK | 단계 보고서 |
| `mydocs/report/task_m020_40_report.md` | `mydocs/report/` | `mydocs/report/task_m020_40_report.md` | OK | 최종 보고서 |
| `mydocs/feedback/task_m020_40_feedback.md` | `mydocs/feedback/` | `mydocs/feedback/task_m020_40_feedback.md` | OK | 작업지시자 추가 검증 피드백 |

## 수용 기준 고정

- full page preview modal을 빠르게 스크롤할 때 보이는 blank band가 저장 PNG 결함인지 preview 렌더링 결함인지 분리해 판단한다.
- 초대형 단일 `<img>` preview 구조에서 band를 안정적으로 제거하지 못하면 제품 코드의 시각적 완화와 capture wait 보정은 되돌리고 tiled preview 후속 이슈로 분리한다.
- visible viewport preview는 내부 스크롤 없이 기존 `object-fit: contain` 맞춤 표시를 유지한다.
- full page preview는 기존처럼 내부 스크롤이 가능하고 toolbar/image inline padding 정렬이 회귀하지 않는다.
- selected/full page Copy/Save 결과에 crop overlay, preview, toolbar, action UI가 포함되지 않는다.
- 저장 PNG seam 가능성은 preview UI artifact와 분리해 판단한다.
- 저장 PNG 변경은 transparent gap 또는 destination rounding gap이 테스트로 확인될 때만 적용한다.
- `debugger`, `<all_urls>`, broad host permission은 추가하지 않는다.

## Stage 1 — preview scroll artifact 원인 고정

### 산출물

신규:

- `mydocs/working/task_m020_40_stage1.md`

수정:

- 없음

### 변경 내용

- 작업지시자가 제공한 2026-06-04 영상 분석 결론을 Stage 1 보고서에 고정한다.
- 현상이 modal rounded corner clipping이 아니라 preview image 폭 전체에 걸친 하단 paint fallback임을 기록한다.
- `src/content/overlay/crop-template.ts`의 preview DOM 구조를 확인한다.
- `src/content/overlay/crop-overlay.css`의 `.crop-preview-dialog`, `.crop-preview-surface`, `.crop-preview-image`, visible mode override를 확인한다.
- `src/shared/stitch-image.ts`의 canvas 생성, tile draw, destination rect rounding, `toDataURL("image/png")` 경로를 확인한다.
- Stage 2에서 우선 처리할 범위를 preview CSS fallback 제거로 고정하고, Stage 3의 저장 PNG 변경은 조건부로 둔다.

### 검증

```bash
rg "crop-preview-image|crop-preview-surface|crop-preview-dialog|background|overflow|overscroll-behavior" src/content/overlay/crop-overlay.css src/content/overlay/crop-template.ts tests/content/overlay/phase6-regression.test.ts
rg "stitchCapturedTiles|getStitchDestinationPixelRect|drawImage|toDataURL|canvas" src/shared/stitch-image.ts tests/shared/stitch-image.test.ts
git diff --check
```

### 커밋

```text
Task #40 Stage 1: preview scroll artifact 원인 고정
```

## Stage 2 — preview 렌더링 fallback 보정

### 산출물

신규:

- `mydocs/working/task_m020_40_stage2.md`

수정:

- `src/content/overlay/crop-overlay.css`
- `tests/content/overlay/phase6-regression.test.ts`

### 변경 내용

- `.crop-preview-image`의 흰색 fallback background를 제거하거나 modal surface와 같은 어두운 배경으로 맞춘다.
- `.crop-preview-surface`의 기존 dark background와 full page scroll container 역할을 유지한다.
- visible viewport mode override의 `overflow: hidden`, `max-height: 100%`, `object-fit: contain` 동작을 유지한다.
- phase6 regression test에 preview image background가 `#ffffff` fallback을 쓰지 않는다는 회귀 조건을 추가한다.
- 기존 preview modal 크기, inline padding, toolbar/image right alignment, full page scrollability, visible no-scroll string checks를 유지한다.

### 검증

```bash
npm run typecheck
npm test -- tests/content/overlay/phase6-regression.test.ts
rg "crop-preview-image|crop-preview-surface|#ffffff|transparent|background: #44414f|visible\\]\\) \\.crop-preview" src/content/overlay/crop-overlay.css tests/content/overlay/phase6-regression.test.ts
git diff --check
```

### 커밋

```text
Task #40 Stage 2: preview 흰 fallback 배경 제거
```

## Stage 3 — 저장 PNG seam 방어 필요성 판단

### 산출물

신규:

- `mydocs/working/task_m020_40_stage3.md`

수정:

- 필요 시 `src/shared/stitch-image.ts`
- 필요 시 `tests/shared/stitch-image.test.ts`
- 필요 시 `tests/content/overlay/full-page-capture.test.ts`
- 필요 시 `tests/content/overlay/phase6-regression.test.ts`

### 변경 내용

- Stage 2 보정 후에도 저장 PNG 자체에 transparent gap 또는 destination rounding gap 가능성이 있는지 기존 stitch tests와 source inspection으로 판단한다.
- gap 근거가 없으면 `stitch-image.ts`는 변경하지 않고 Stage 3 보고서에 preview-only 결론을 남긴다.
- gap 근거가 있으면 `stitchCapturedTiles()`에서 canvas 초기화 또는 destination rect edge alignment 보정을 추가한다.
- canvas fill을 적용해야 하는 경우에도 페이지 배경을 임의 색으로 오염시키지 않도록 테스트 근거와 적용 범위를 명시한다.
- full page/selected stitching의 tile edge alignment, output scale/downscale metadata, scroll restoration 회귀 조건을 유지한다.

### 검증

```bash
npm run typecheck
npm test -- tests/shared/stitch-image.test.ts tests/content/overlay/full-page-capture.test.ts tests/content/overlay/phase6-regression.test.ts
rg "stitchCapturedTiles|getStitchDestinationPixelRect|drawImage|fillRect|clearRect|downscaled|outputScale|sourceScale|crop-preview-image" src tests
git diff --check
```

### 커밋

```text
Task #40 Stage 3: stitching seam 방어 필요성 판단
```

## Stage 4 — 품질 매트릭스와 통합 검증

### 산출물

신규:

- `mydocs/working/task_m020_40_stage4.md`
- `mydocs/report/task_m020_40_report.md`

수정:

- `mydocs/tech/task_m020_8_quality_matrix.md`
- `mydocs/orders/20260604.md`
- 필요 시 앞 단계에서 발견된 보정 파일

### 변경 내용

- Phase 6 품질 매트릭스에 preview scroll blank 항목을 추가한다.
- 수동 smoke 절차에 full page preview를 빠르게 스크롤해 하단 흰 blank 띠가 보이지 않는지 확인하는 단계를 추가한다.
- 영상 분석 근거, 자동 검증 근거, 수동 smoke 한계를 최종 보고서에 분리해 기록한다.
- 전체 검증을 실행하고 권한이 추가되지 않았음을 grep으로 확인한다.
- 오늘할일을 완료 상태로 갱신한다.

### 검증

```bash
npm run build
npm run typecheck
npm test
rg "debugger|<all_urls>|host_permissions|captureVisibleTab" manifest.json src tests
rg "#40|preview scroll|흰 blank|white blank|crop-preview-image|full page preview" mydocs/tech/task_m020_8_quality_matrix.md mydocs/report/task_m020_40_report.md src tests
git diff --check
git status --short
```

### 커밋

```text
Task #40 Stage 4 + 최종 보고서: preview scroll blank 보정 완료
```

## Stage 5 — 긴 페이지 tile paint settle 보정

### 산출물

신규:

- `mydocs/feedback/task_m020_40_feedback.md`
- `mydocs/working/task_m020_40_stage5.md`
- `mydocs/orders/20260605.md`

수정:

- `src/content/overlay/full-page-capture.ts`
- `tests/content/overlay/full-page-capture.test.ts`
- `mydocs/plans/task_m020_40_impl.md`
- `mydocs/report/task_m020_40_report.md`
- `mydocs/tech/task_m020_8_quality_matrix.md`

### 변경 내용

- 작업지시자 수동 검증에서 긴 페이지 full page preview의 흰 band가 재현된 피드백을 기록한다.
- `captureFullPageTiles()`와 `capturePageRectTiles()`가 사용하는 기본 tile capture wait를 `requestAnimationFrame` 2회로 강화한다.
- visible viewport capture와 viewport 안 selected capture의 별도 wait 경로는 변경하지 않는다.
- 기본 wait contract를 `full-page-capture.test.ts`에 추가한다.
- 변경은 단일 Stage 5 커밋으로 묶어 수동 검증이 만족스럽지 않을 때 되돌릴 수 있게 한다.

### 검증

```bash
npm run build
npm run typecheck
npm test
rg "debugger|<all_urls>|host_permissions|captureVisibleTab" manifest.json src tests
rg "TILE_CAPTURE_SETTLE_FRAME_COUNT|waitForNextPaint|Stage 5|preview scroll|흰 band|P6-41" src tests mydocs
git diff --check
git status --short
```

### 커밋

```text
Task #40 Stage 5: 긴 페이지 tile paint settle 보정
```

## Stage 6 — 보정 rollback과 후속 이슈 분리

### 산출물

신규:

- `mydocs/working/task_m020_40_stage6.md`

수정:

- `src/content/overlay/crop-overlay.css`
- `src/content/overlay/full-page-capture.ts`
- `tests/content/overlay/phase6-regression.test.ts`
- `tests/content/overlay/full-page-capture.test.ts`
- `mydocs/feedback/task_m020_40_feedback.md`
- `mydocs/orders/20260605.md`
- `mydocs/plans/task_m020_40_impl.md`
- `mydocs/report/task_m020_40_report.md`
- `mydocs/tech/task_m020_8_quality_matrix.md`

### 변경 내용

- 작업지시자 수동 검증에서 Stage 5 이후 흰 band가 회색 band로 바뀌어 같은 위치에 남는 현상을 확인한 결과를 반영한다.
- 저장 PNG는 Stage 2/5 전부터 정상이라는 작업지시자 확인을 기록한다.
- Stage 5의 tile capture wait 강화는 원인 layer와 맞지 않아 되돌린다.
- Stage 2의 preview image background 완화도 근본 해결이 아니므로 제품 코드에서 되돌린다.
- #40은 single `<img>` preview의 한계와 후속 tiled preview 필요성을 기록하는 분석/정리 task로 마무리한다.
- 새 tiled preview task는 `task-register` 절차에 따라 [#41](https://github.com/postmelee/crop/issues/41)로 분리한다.

### 검증

```bash
npm run build
npm run typecheck
npm test
rg "debugger|<all_urls>|host_permissions|captureVisibleTab" manifest.json src tests
rg "TILE_CAPTURE_SETTLE_FRAME_COUNT|background: transparent;|background: #ffffff;|P6-41|tiled preview|Stage 6" src tests mydocs
git diff --check
git status --short
```

### 커밋

```text
Task #40 Stage 6: preview band 보정 되돌림
```

## 검증

- 각 Stage 검증 명령은 단계 보고서 작성 전에 실행한다.
- 실패한 검증은 단계 완료로 처리하지 않는다.
- Stage 2 이후에도 흰 blank가 재현되면 Stage 3에서 saved PNG seam 가능성을 다시 판단한다.
- 구현 중 파일 위치나 범위가 이 계획과 달라지면 구현계획서를 갱신하고 작업지시자 승인을 다시 받는다.
- 문서 위치가 수행계획서 판단과 달라지면 구현 전에 수행계획서 또는 구현계획서를 갱신하고 승인을 받는다.

## 커밋

- 구현계획서 자체는 `Task #40: 구현계획서 작성` 커밋으로 별도 기록한다.
- 단계 커밋은 단계 산출물과 `mydocs/working/task_m020_40_stage{N}.md`를 함께 묶는다.
- 커밋 메시지는 `Task #40 Stage {N}: {핵심 내용 요약}` 형식을 따른다.

## 단계 의존성

- Stage 2는 Stage 1의 preview-only 우선 판단과 CSS fallback contract가 확정된 뒤 진행한다.
- Stage 3은 Stage 2 보정과 focused test 결과를 보고한 뒤 진행한다.
- Stage 4는 Stage 3 보고서 승인 후 품질 매트릭스와 통합 검증만 수행한다.
- Stage 5는 Stage 4 이후 작업지시자 수동 검증 피드백을 반영하는 추가 보정이다.
- Stage 6은 Stage 5 이후 수동 검증에서 단일 `<img>` preview 렌더링 문제가 확인된 뒤 보정 코드를 되돌리고 후속 이슈로 분리하는 정리 단계다.
- 최종 결과보고서와 PR 게시 절차는 Stage 6 완료보고서 승인 후 진행한다.

## 위험과 대응

- **재현 민감도**: 한 프레임짜리 paint artifact라 자동 테스트로 완전 재현하기 어렵다. CSS contract test와 수동 smoke 절차를 함께 둔다.
- **preview-only와 저장 PNG 혼동**: Stage 1/3에서 preview artifact와 saved PNG seam을 분리해 보고한다.
- **저장 PNG 오염**: canvas fill은 테스트 근거가 있을 때만 적용하고, 기본은 preview CSS fallback 보정으로 제한한다.
- **visible preview 회귀**: Stage 2 focused test에서 visible mode no-scroll, `object-fit: contain`, max-height contract를 유지한다.
- **캡처 시간 증가**: Stage 5의 추가 frame wait는 tile stitching 경로에만 적용하고, 긴 고정 delay는 추가하지 않는다.
- **근본 원인 layer 불일치**: Stage 6에서 capture wait와 preview fallback 완화는 제품 코드에서 되돌리고, preview renderer 구조 변경은 별도 이슈로 분리한다.
- **#39/#37 작업 충돌**: Task #40은 `/private/tmp/crop-task40` worktree와 `local/task40` 브랜치에서만 진행한다.

## 승인 요청 사항

- Stage 1~4 분할과 각 Stage 산출물
- preview CSS fallback 제거를 Stage 2의 우선 해결책으로 삼는 기준
- 저장 PNG 변경은 Stage 3에서 테스트 근거가 있을 때만 적용하는 기준
- 구현계획서에 명시한 검증 명령과 단계별 커밋 메시지
- 공식 사용자 문서 신규 생성 없이 Phase 6 내부 품질 매트릭스만 갱신하는 기준
