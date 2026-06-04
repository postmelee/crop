# Task #35 구현계획서

수행계획서: [`task_m020_35.md`](task_m020_35.md)
GitHub Issue: [#35](https://github.com/postmelee/crop/issues/35)
마일스톤: M020

## 단계 개요

| Stage | 제목 | 주요 산출 | 검증 |
|---|---|---|---|
| 1 | 출력 크기 정책과 다운스케일 helper 작성 | `stitch-image.ts`, stitch helper 테스트 | typecheck, stitch-image focused test, diff |
| 2 | full page/selected stitching 경로 통합 | `full-page-capture.ts`, `crop-overlay.ts`, capture 회귀 테스트 | typecheck, focused overlay/capture tests, grep, diff |
| 3 | 문서와 품질 매트릭스 갱신 | README 계열, Phase 6 품질 매트릭스 | typecheck, focused tests, 문서 grep, diff |
| 4 | 통합 검증과 최종 보고 | stage/final report, 오늘할일, 전체 검증 | build, typecheck, test, 권한 grep, status |

## 문서 위치 확인

수행계획서의 "문서 위치 판단"과 실제 Stage 산출물 경로를 다음과 같이 일치시킨다. 공식 문서 루트는 새로 만들지 않고, 기존 README 계열과 `mydocs/` 산출물 위치만 사용한다.

| 파일 | 수행계획서상 선택 위치 | Stage 산출물 경로 | 일치 여부 | 비고 |
|---|---|---|---|---|
| `README.md` | `README.md` | `README.md` | OK | full page 제한 문구를 다운스케일 fallback 기준으로 좁게 갱신 |
| `README.ko.md` | `README.ko.md` | `README.ko.md` | OK | 한국어 README 제한 문구 동기화 |
| `README.ja.md` | `README.ja.md` | `README.ja.md` | OK | 일본어 README 제한 문구 동기화 |
| `README.zh-CN.md` | `README.zh-CN.md` | `README.zh-CN.md` | OK | 중국어 README 제한 문구 동기화 |
| `mydocs/tech/task_m020_8_quality_matrix.md` | `mydocs/tech/` | `mydocs/tech/task_m020_8_quality_matrix.md` | OK | #35 oversized full page fallback 기준 추가 |
| `mydocs/plans/task_m020_35.md` | `mydocs/plans/` | `mydocs/plans/task_m020_35.md` | OK | 수행계획서 |
| `mydocs/plans/task_m020_35_impl.md` | `mydocs/plans/` | `mydocs/plans/task_m020_35_impl.md` | OK | 구현계획서 |
| `mydocs/working/task_m020_35_stage{N}.md` | `mydocs/working/` | `mydocs/working/task_m020_35_stage{N}.md` | OK | 단계 보고서 |
| `mydocs/report/task_m020_35_report.md` | `mydocs/report/` | `mydocs/report/task_m020_35_report.md` | OK | 최종 보고서 |

## 수용 기준 고정

- 제한 이하 full page/selected stitching은 기존 출력 크기와 tile 배치가 유지된다.
- 제한 초과 stitching은 단일 PNG를 생성하되 최종 output pixel size가 `MAX_CAPTURE_DIMENSION`과 `MAX_CAPTURE_AREA`를 넘지 않는다.
- 다운스케일은 x/y에 같은 fit ratio를 적용해 종횡비를 유지한다.
- `stitchCapturedTiles()` 결과에서 원본 capture scale과 최종 output scale 또는 downscale 적용 여부를 테스트로 확인할 수 있다.
- `createFullPageTilePlan()`은 oversized full page를 계획 단계에서 즉시 실패시키지 않는다.
- 여전히 비어 있는 viewport/document 또는 유효하지 않은 output은 명확한 오류로 실패한다.
- overlay 숨김, scrollbar 숨김, fixed/sticky page chrome suppression, scroll restoration 정책은 회귀하지 않는다.
- `debugger`, `<all_urls>`, broad host permission은 추가하지 않는다.

## Stage 1 — 출력 크기 정책과 다운스케일 helper 작성

### 산출물

신규:

- `mydocs/working/task_m020_35_stage1.md`

수정:

- `src/shared/stitch-image.ts`
- `tests/shared/stitch-image.test.ts`

### 변경 내용

- `stitch-image.ts`에 output CSS size와 captured image source scale을 받아 최종 output pixel size를 계산하는 helper를 추가하거나 기존 `getStitchOutputPixelSize()`를 확장한다.
- 제한 이하에서는 기존 `Math.round(outputCssSize * sourceScale)` 결과를 유지한다.
- 제한 초과에서는 다음 fit ratio 중 최솟값을 적용한다.
  - `MAX_CAPTURE_DIMENSION / estimatedWidth`
  - `MAX_CAPTURE_DIMENSION / estimatedHeight`
  - `sqrt(MAX_CAPTURE_AREA / estimatedArea)`
- fit ratio는 x/y output scale에 동일하게 곱한다. source crop 계산에는 기존 captured image natural size와 viewport CSS size 기반 source scale을 유지한다.
- `StitchCapturedTilesResult`에는 테스트와 runtime metadata가 구분 가능하도록 source scale과 effective output scale/downscale 여부를 표현하는 필드를 추가한다. 기존 `scale` 필드는 호환성 판단 후 유지하거나 effective output scale로 명확히 재정의한다.
- destination pixel rect 계산은 effective output scale을 사용하고, adjacent tile edge alignment 테스트를 유지한다.
- 다음 테스트를 추가한다.
  - 제한 이하 output size는 기존과 동일하다.
  - height dimension 제한 초과 시 height가 `MAX_CAPTURE_DIMENSION` 이하로 축소된다.
  - area 제한 초과 시 area가 `MAX_CAPTURE_AREA` 이하로 축소된다.
  - 다운스케일 후 destination tile edges가 맞물린다.
  - 빈 output과 비정상 scale은 기존처럼 실패한다.

### 검증

```bash
npm run typecheck
npm test -- tests/shared/stitch-image.test.ts
git diff --check
```

### 커밋

```text
Task #35 Stage 1: stitching 다운스케일 helper 작성
```

## Stage 2 — full page/selected stitching 경로 통합

### 산출물

신규:

- `mydocs/working/task_m020_35_stage2.md`

수정:

- `src/content/overlay/full-page-capture.ts`
- `src/content/overlay/crop-overlay.ts`
- `tests/content/overlay/full-page-capture.test.ts`
- `tests/content/overlay/phase6-regression.test.ts`
- `tests/shared/stitch-image.test.ts`

### 변경 내용

- `full-page-capture.ts`의 `validateEstimatedOutputSize()`가 oversized output을 즉시 throw하는 구조를 제거하거나 옵션화한다.
- 빈 viewport/document 방어는 유지한다.
- full page tile plan은 CSS bounds와 tiles를 계속 만들고, 실제 final canvas limit 판단은 captured tile source scale을 알 수 있는 `stitchCapturedTiles()` 단계에서 수행한다.
- selected page rect stitching도 같은 fallback helper를 쓰므로 일반 크기 selected capture가 기존 크기를 유지하는지 회귀 테스트를 추가한다.
- `crop-overlay.ts`는 `stitchCapturedTiles()`의 `outputWidth`, `outputHeight`, `drawnTiles`를 기존 preview/action metadata에 그대로 반영한다.
- downscale 여부가 dataset으로 필요하다고 판단되면 `data-crop-capture-downscaled` 같은 내부 metadata를 추가하되 UI 문구는 Stage 3 문서 판단 후 결정한다.
- full page block은 기존 `setCapturePageChromeSuppressed(index > 0)` 정책을 유지한다.
- selected stitching block은 기존 selected suppression 정책을 유지한다.
- phase6 regression test에는 runtime string check 수준으로 full page/selected 경로가 같은 stitch helper와 권한 경계를 유지하는지 보강한다.

### 검증

```bash
npm run typecheck
npm test -- tests/shared/stitch-image.test.ts tests/content/overlay/full-page-capture.test.ts tests/content/overlay/phase6-regression.test.ts
rg "MAX_CAPTURE|stitchCapturedTiles|captureFullPageTiles|capturePageRectTiles|setCapturePageChromeSuppressed" src tests
git diff --check
```

### 커밋

```text
Task #35 Stage 2: full page 다운스케일 경로 통합
```

## Stage 3 — 문서와 품질 매트릭스 갱신

### 산출물

신규:

- `mydocs/working/task_m020_35_stage3.md`

수정:

- `README.md`
- `README.ko.md`
- `README.ja.md`
- `README.zh-CN.md`
- `mydocs/tech/task_m020_8_quality_matrix.md`
- `tests/content/overlay/phase6-regression.test.ts`
- 필요 시 `tests/fixtures/phase6_edge_cases.html`

### 변경 내용

- README 계열의 full page 제한 문구에서 "큰 canvas 크기 오류"를 "제한 초과 시 자동 다운스케일될 수 있으며, lazy loading/animation/layout shift 한계는 남는다"는 기준으로 갱신한다.
- Phase 6 품질 매트릭스에 `P6-40` 또는 다음 빈 번호로 oversized full page downscale fallback 항목을 추가한다.
- 수동 smoke 기준을 추가한다.
  - 긴 문서에서 전체 페이지 캡처를 실행한다.
  - 저장 PNG가 단일 파일로 생성되는지 확인한다.
  - 출력 pixel dimension이 max canvas 제한 이하인지 확인한다.
  - 출력이 원본 DPR 해상도보다 낮아질 수 있음을 기록한다.
  - overlay/preview/action UI가 결과에 포함되지 않는지 확인한다.
- fixture에 실제 oversized canvas를 강제로 만들면 테스트 비용이 커질 수 있으므로, 자동 테스트는 helper 단위로 고정하고 fixture는 smoke 절차 중심으로 둔다.
- 문서 변경은 기존 문단만 좁게 수정하고 새 공식 문서 루트는 만들지 않는다.

### 검증

```bash
npm run typecheck
npm test -- tests/shared/stitch-image.test.ts tests/content/overlay/full-page-capture.test.ts tests/content/overlay/phase6-regression.test.ts
rg "#35|downscale|maximum canvas|전체 페이지|full page|canvas" README*.md mydocs/tech/task_m020_8_quality_matrix.md src tests
git diff --check
```

### 커밋

```text
Task #35 Stage 3: 다운스케일 문서와 품질 기준 갱신
```

## Stage 4 — 통합 검증과 최종 보고

### 산출물

신규:

- `mydocs/working/task_m020_35_stage4.md`
- `mydocs/report/task_m020_35_report.md`

수정:

- `mydocs/orders/20260604.md`
- 필요 시 앞 단계에서 발견된 보정 파일

### 변경 내용

- 전체 자동 검증을 실행하고 결과를 Stage 4 보고서와 최종 보고서에 정리한다.
- 권한 grep으로 `debugger`, `<all_urls>`, broad host permission이 추가되지 않았음을 기록한다.
- full page oversized fallback의 자동 검증 근거와 수동 smoke 한계를 분리해 적는다.
- 남은 리스크를 정리한다.
  - 다운스케일에 따른 이미지 선명도 저하
  - 매우 큰 PNG 생성의 성능 비용
  - lazy loading/layout shift/sticky 변화 한계
  - 원본 해상도 다중 파일 저장 제외
- 오늘할일 상태를 완료로 갱신한다.

### 검증

```bash
npm run build
npm run typecheck
npm test
rg "debugger|<all_urls>|host_permissions|captureVisibleTab" manifest.json src tests
rg "#35|downscale|maximum canvas|full page|전체 페이지|MAX_CAPTURE" README*.md mydocs src tests manifest.json
git diff --check
git status --short
```

### 커밋

```text
Task #35 Stage 4 + 최종 보고서: 전체 페이지 다운스케일 fallback 완료
```

## 검증

- 각 Stage 검증 명령은 단계 보고서 작성 전에 실행한다.
- 실패한 검증은 단계 완료로 처리하지 않는다.
- 구현 중 파일 위치나 범위가 이 계획과 달라지면 구현계획서를 갱신하고 작업지시자 승인을 다시 받는다.
- 문서 위치가 수행계획서 판단과 달라지면 구현 전에 수행계획서 또는 구현계획서를 갱신하고 승인을 받는다.

## 커밋

- 구현계획서 자체는 `Task #35: 구현계획서 작성` 커밋으로 별도 기록한다.
- 단계 커밋은 단계 산출물과 `mydocs/working/task_m020_35_stage{N}.md`를 함께 묶는다.
- 커밋 메시지는 `Task #35 Stage {N}: {핵심 내용 요약}` 형식을 따른다.

## 단계 의존성

- Stage 2는 Stage 1의 output size/downscale helper contract가 확정된 뒤 진행한다.
- Stage 3은 Stage 2에서 runtime metadata와 실제 fallback 경로가 확정된 뒤 진행한다.
- Stage 4는 Stage 3 보고서 승인 후 최종 통합 검증과 보고만 수행한다.
- 최종 결과보고서와 PR 게시 절차는 Stage 4 완료보고서 승인 후 진행한다.

## 위험과 대응

- **품질 저하**: 다운스케일 fallback은 원본 DPR 해상도를 낮춘다. README와 최종 보고서에 단일 PNG 성공을 위한 품질 tradeoff로 기록한다.
- **scale 의미 혼동**: source scale과 output scale을 분리해 naming하고 테스트에서 각각의 값을 확인한다.
- **canvas rounding seam**: effective output scale로 destination rect를 snap할 때 tile edge alignment 테스트를 유지한다.
- **계획 단계 oversized rejection 잔존**: `full-page-capture.ts`에 남은 preflight rejection이 fallback을 막지 않도록 grep과 테스트로 확인한다.
- **selected capture 회귀**: selected page rect도 같은 stitch helper를 쓰므로 제한 이하 selected output size 회귀 테스트를 Stage 2에 포함한다.
- **성능 비용**: 큰 페이지는 downscale 후에도 tile capture와 PNG encoding 비용이 남는다. 기존 max area 정책을 유지하고 별도 성능 최적화는 후속으로 분리한다.

## 승인 요청 사항

- Stage 1~4 분할과 각 Stage 산출물
- 구현계획서에 명시한 검증 명령
- 단계별 커밋 메시지
- source scale과 effective output scale을 분리해 downscale fallback을 구현하는 기준
- 권한 추가 없이 `captureVisibleTab()` + scroll stitching 구조를 유지하는 기준
