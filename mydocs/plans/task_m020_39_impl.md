# Task #39 구현계획서

수행계획서: [`task_m020_39.md`](task_m020_39.md)
GitHub Issue: [#39](https://github.com/postmelee/crop/issues/39)
마일스톤: M020

## 단계 개요

| Stage | 제목 | 주요 산출 | 검증 |
|---|---|---|---|
| 1 | preview backdrop dismiss 계약 고정 | `crop-overlay.ts`, focused regression test | phase6 regression, runtime grep, diff |
| 2 | preview dialog 크기와 inline padding 보정 | `crop-overlay.css`, CSS regression test | phase6 regression, CSS grep, diff |
| 3 | 품질 기준 갱신과 통합 검증 | quality matrix, 최종 보고서, 오늘할일 | build, typecheck, test, grep, status |
| 4 | 수동 확인 후 visible preview 하단 padding 보정 | `crop-overlay.css`, CSS regression test, Stage/최종 보고서 갱신 | phase6 regression, CSS grep, diff |
| 5 | 수동 확인 후 visible preview padding reserve와 modal 중앙 정렬 | `crop-overlay.css`, CSS regression test, Stage/최종 보고서 갱신 | phase6 regression, build, typecheck, diff |

## 문서 위치 확인

수행계획서의 "문서 위치 판단"과 실제 Stage 산출물 경로를 다음과 같이 일치시킨다. 이번 task에서는 공식 사용자 문서 루트나 README 계열을 수정하지 않는다.

| 파일 | 수행계획서상 선택 위치 | Stage 산출물 경로 | 일치 여부 | 비고 |
|---|---|---|---|---|
| `mydocs/tech/task_m020_8_quality_matrix.md` | `mydocs/tech/` | `mydocs/tech/task_m020_8_quality_matrix.md` | OK | preview backdrop dismiss와 dialog 여백 기준을 내부 품질 매트릭스에 최소 갱신 |
| `README.md` 등 루트 문서 | 해당 없음 | 해당 없음 | OK | 사용자 사용법에 새로 설명할 기능이 아니므로 수정하지 않음 |
| `mydocs/plans/task_m020_39.md` | `mydocs/plans/` | `mydocs/plans/task_m020_39.md` | OK | 수행계획서 |
| `mydocs/plans/task_m020_39_impl.md` | `mydocs/plans/` | `mydocs/plans/task_m020_39_impl.md` | OK | 구현계획서 |
| `mydocs/working/task_m020_39_stage{N}.md` | `mydocs/working/` | `mydocs/working/task_m020_39_stage{N}.md` | OK | 단계 보고서 |
| `mydocs/report/task_m020_39_report.md` | `mydocs/report/` | `mydocs/report/task_m020_39_report.md` | OK | 최종 보고서 |

## 수용 기준 고정

- preview가 열린 상태에서 모달 밖 어두운 backdrop 직접 클릭은 `requestClose()`를 통해 overlay 전체를 제거한다.
- `.crop-preview-dialog` 내부 클릭, preview image/surface click, toolbar action click은 backdrop dismiss로 처리되지 않는다.
- Copy/Save/Retry/Cancel 버튼과 `Command+C`/`Command+S` 또는 `Ctrl+C`/`Ctrl+S`, `Esc` shortcut은 기존 동작을 유지한다.
- `pendingCapture` 중 backdrop click은 중복 cleanup을 만들지 않는다.
- preview surface wheel handling은 modal 뒤 page scroll을 계속 차단한다.
- preview dialog는 desktop/mobile viewport에서 화면을 과도하게 채우지 않고 backdrop click 영역을 남긴다.
- preview image edge와 toolbar Save button edge는 같은 inline padding 기준으로 정렬된다.
- visible preview는 이미지 아래 내부 여백이 양옆 inline padding과 같은 기준으로 보이고, 남는 dialog 높이로 아래 여백이 과도하게 커지지 않는다.
- visible preview는 이미지가 surface를 꽉 채워도 bottom padding을 침범하지 않고, preview modal은 viewport 중앙에 배치된다.
- `debugger`, `<all_urls>`, broad `host_permissions`는 추가하지 않는다.

## Stage 1 — preview backdrop dismiss 계약 고정

### 산출물

신규:

- `mydocs/working/task_m020_39_stage1.md`

수정:

- `src/content/overlay/crop-overlay.ts`
- `tests/content/overlay/phase6-regression.test.ts`

### 변경 내용

- `handleClick`에서 action/mode 처리 이후, 일반 document click 처리 이전에 preview backdrop dismiss 분기를 추가한다.
- `previewCaptureResult`가 있고 `pendingCapture`가 아닐 때만 dismiss 후보로 본다.
- composed path 또는 `event.target` 기준으로 `.crop-preview` container 직접 클릭만 backdrop click으로 인정한다.
- `.crop-preview-dialog`, `.crop-preview-surface`, `.crop-preview-footer`, `.crop-preview-actions`, action button 내부 click은 기존 `isCropOverlayEvent()` 소비 또는 action 처리로 남긴다.
- backdrop dismiss는 `event.preventDefault()`, `event.stopPropagation()` 후 `requestClose()`를 호출한다.
- 필요하면 `isPreviewBackdropEvent(event)` helper를 추가해 runtime 조건을 테스트 가능한 문자열 계약으로 분리한다.
- `handlePointerDown`은 preview container를 overlay event로 계속 소비해 drag selection으로 전환되지 않게 유지한다.
- phase6 regression test에 다음 계약을 추가한다.
  - preview backdrop click helper 또는 분기 존재
  - dismiss가 `requestClose()`를 재사용
  - pending capture guard 존재
  - preview action path가 `startPreviewAction()`을 계속 사용

### 검증

```bash
npm test -- tests/content/overlay/phase6-regression.test.ts
rg -n "requestClose|crop-preview|backdrop|pendingCapture|handleClick|handlePointerDown|isPreviewBackdrop" src/content/overlay tests/content/overlay
git diff --check
```

### 커밋

```text
Task #39 Stage 1: preview backdrop dismiss 계약 고정
```

## Stage 2 — preview dialog 크기와 inline padding 보정

### 산출물

신규:

- `mydocs/working/task_m020_39_stage2.md`

수정:

- `src/content/overlay/crop-overlay.css`
- `tests/content/overlay/phase6-regression.test.ts`

### 변경 내용

- `.crop-preview` viewport padding을 desktop 기준으로 backdrop target이 명확히 남도록 조정한다.
- `.crop-preview-dialog`의 고정 상한 `1480px`/`860px`와 `calc(100vw - 104px)`/`calc(100vh - 68px)` 계약을 재검토해 화면을 과도하게 채우지 않는 상한으로 낮춘다.
- `--crop-preview-inline-padding`를 footer와 surface가 계속 공유하게 유지한다.
- Save button 우측 edge와 preview image 우측 edge가 같은 inline padding 기준을 사용하도록 surface/footer padding과 image sizing 계약을 맞춘다.
- full page preview는 surface 내부 scroll을 유지하고, visible viewport preview는 기존처럼 내부 scroll 없이 `object-fit: contain`으로 맞춘다.
- 모바일 media query는 `16px` 수준의 backdrop target을 유지하되, 버튼과 이미지가 잘리지 않게 dialog width/height를 조정한다.
- phase6 regression test의 기존 수치 assertion을 새 CSS 계약으로 갱신한다.
  - desktop preview padding
  - dialog max width/height
  - shared inline padding
  - surface/footer padding 공유
  - visible preview no-scroll 유지

### 검증

```bash
npm test -- tests/content/overlay/phase6-regression.test.ts
rg -n "crop-preview|crop-preview-dialog|crop-preview-inline-padding|padding|width|height|max|object-fit|overflow" src/content/overlay/crop-overlay.css tests/content/overlay/phase6-regression.test.ts
git diff --check
```

수동 smoke 후보:

- `보이는 영역 선택` 후 preview dialog가 화면을 과도하게 채우지 않고 backdrop 영역이 남는지 확인한다.
- `전체 페이지 선택` 후 preview dialog 내부 scroll과 backdrop 영역이 동시에 유지되는지 확인한다.
- Save button 우측 edge와 preview image edge가 같은 padding 기준으로 보이는지 확인한다.

### 커밋

```text
Task #39 Stage 2: preview dialog padding과 크기 보정
```

## Stage 3 — 품질 기준 갱신과 통합 검증

### 산출물

신규:

- `mydocs/working/task_m020_39_stage3.md`
- `mydocs/report/task_m020_39_report.md`

수정:

- `mydocs/tech/task_m020_8_quality_matrix.md`
- `mydocs/orders/20260604.md`
- 필요 시 Stage 1~2 산출물의 작은 정정

### 변경 내용

- 품질 매트릭스 P6-29b/P6-29c 주변 기준을 갱신하거나 신규 하위 항목을 추가한다.
  - preview backdrop click dismiss
  - preview dialog가 화면을 과도하게 채우지 않고 backdrop click 영역을 남김
  - Save button/image edge shared inline padding
- 수동 smoke 절차에 visible/full page preview에서 backdrop click, dialog 내부 click, Copy/Save/Retry/Cancel 회귀 확인을 추가한다.
- 전체 검증을 실행하고 Stage 3 보고서와 최종 보고서에 결과를 정리한다.
- 오늘할일을 완료 상태로 갱신한다.
- 권한 grep으로 `debugger`, `<all_urls>`, broad host permission이 추가되지 않았음을 기록한다.

### 검증

```bash
npm run build
npm run typecheck
npm test
rg -n "P6-29|P6-35|P6-36|preview|backdrop|padding|dialog" mydocs/tech/task_m020_8_quality_matrix.md src/content/overlay tests/content/overlay
rg -n "debugger|<all_urls>|host_permissions|captureVisibleTab" manifest.json src tests
git diff --check
git status --short
```

수동 smoke 후보:

- visible preview backdrop click dismiss
- full page preview backdrop click dismiss
- preview dialog 내부 click이 dismiss되지 않음
- preview Copy/Save/Retry/Cancel과 keyboard shortcut 회귀 없음
- preview image/surface wheel scroll이 modal 뒤 page scroll로 새지 않음
- desktop/mobile viewport에서 dialog가 화면을 과도하게 채우지 않음

### 커밋

```text
Task #39 Stage 3 + 최종 보고서: preview dismiss와 padding 보정 완료
```

## Stage 4 — 수동 확인 후 visible preview 하단 padding 보정

### 산출물

신규:

- `mydocs/working/task_m020_39_stage4.md`

수정:

- `src/content/overlay/crop-overlay.css`
- `tests/content/overlay/phase6-regression.test.ts`
- `mydocs/plans/task_m020_39_impl.md`
- `mydocs/tech/task_m020_8_quality_matrix.md`
- `mydocs/report/task_m020_39_report.md`
- `mydocs/orders/20260604.md`

### 변경 내용

- 작업지시자 수동 확인 결과, visible preview에서 이미지 아래 내부 여백이 양옆 여백보다 크게 보이는 문제를 보정한다.
- `.crop-preview-surface`의 bottom padding을 `--crop-preview-inline-padding`과 같은 기준으로 명시한다.
- visible preview의 dialog height를 content 기반 `auto`로 전환하고 기존 max-height 상한은 유지해, 이미지 아래 남는 세로 공간이 과도하게 보이지 않도록 한다.
- full page preview는 기존 고정 높이와 surface scroll 계약을 유지한다.
- backdrop bottom padding도 inline backdrop padding과 같은 CSS 변수 기준으로 맞춰 모달 밖 click target의 시각적 균형을 유지한다.
- phase6 regression test에 visible dialog auto-height와 bottom/shared padding 계약을 추가한다.

### 검증

```bash
npm test -- tests/content/overlay/phase6-regression.test.ts
rg -n "crop-preview|crop-preview-dialog|crop-preview-inline-padding|backdrop-block-end|height: auto|flex: 0 1 auto" src/content/overlay/crop-overlay.css tests/content/overlay/phase6-regression.test.ts
rg -n "P6-29b|Task #39|하단 padding|visible preview" mydocs/tech/task_m020_8_quality_matrix.md mydocs/report/task_m020_39_report.md
git diff --check
```

### 커밋

```text
Task #39 Stage 4: visible preview 하단 padding 보정
```

## Stage 5 — 수동 확인 후 visible preview padding reserve와 modal 중앙 정렬

### 산출물

신규:

- `mydocs/working/task_m020_39_stage5.md`

수정:

- `src/content/overlay/crop-overlay.css`
- `tests/content/overlay/phase6-regression.test.ts`
- `mydocs/plans/task_m020_39_impl.md`
- `mydocs/tech/task_m020_8_quality_matrix.md`
- `mydocs/report/task_m020_39_report.md`
- `mydocs/orders/20260605.md`

### 변경 내용

- 작업지시자 수동 확인 결과, scroll이 없는 visible/current-page preview에서 이미지가 surface 하단 padding을 침범하지 않도록 이미지 max-height 계산에서 footer height와 bottom padding을 제외한다.
- full-page preview는 기존 고정 dialog height와 surface scroll 계약을 유지해, scroll 가능한 이미지가 하단까지 붙어 보이는 상태를 그대로 둔다.
- preview modal을 viewport 중앙에 배치하도록 backdrop block padding을 위/아래 동일 변수로 통일하고 `.crop-preview`를 center 정렬한다.
- phase6 regression test에 centered preview, visible image max-height padding reserve, full-page scroll 계약 유지 조건을 추가한다.

### 검증

```bash
npm test -- tests/content/overlay/phase6-regression.test.ts
rg -n "align-items: center|crop-preview-dialog-available-height|footer-block-size|crop-preview-inline-padding|object-fit|overflow: auto|overflow: hidden" src/content/overlay/crop-overlay.css tests/content/overlay/phase6-regression.test.ts
npm run typecheck
npm run build
git diff --check
```

### 커밋

```text
Task #39 Stage 5: visible preview padding reserve와 중앙 정렬
```

## 검증 운영

- 각 Stage 검증 명령은 단계 보고서 작성 전에 실행한다.
- 실패한 검증은 단계 완료로 처리하지 않는다.
- 실제 브라우저 smoke가 현재 세션에서 자동화되지 않으면 작업지시자 직접 검증 지침과 검증 한계를 Stage 보고서에 남긴다.
- 구현 중 파일 위치나 범위가 이 계획과 달라지면 구현계획서를 갱신하고 작업지시자 승인을 다시 받는다.
- 권한 추가가 필요해지는 방향이면 즉시 중단하고 별도 task로 분리한다.

## 커밋

- 구현계획서 자체는 `Task #39: 구현계획서 작성` 커밋으로 별도 기록한다.
- 단계 커밋은 단계 산출물과 `mydocs/working/task_m020_39_stage{N}.md`를 함께 묶는다.
- Stage 1~2 커밋 메시지는 `Task #39 Stage {N}: {핵심 내용 요약}` 형식을 따른다.
- Stage 3은 최종 보고서를 포함하므로 `Task #39 Stage 3 + 최종 보고서: preview dismiss와 padding 보정 완료` 형식을 사용한다.
- Stage 4는 수동 확인 후 레이아웃 보정과 보고서 갱신을 묶어 `Task #39 Stage 4: visible preview 하단 padding 보정` 형식을 사용한다.
- Stage 5는 PR 수동 확인 후 레이아웃 보정과 보고서 갱신을 묶어 `Task #39 Stage 5: visible preview padding reserve와 중앙 정렬` 형식을 사용한다.

## 단계 의존성

- Stage 2는 Stage 1의 backdrop dismiss event contract가 확정된 뒤 진행한다.
- Stage 3은 Stage 2의 CSS layout contract가 확정된 뒤 품질 매트릭스와 최종 검증만 수행한다.
- 최종 결과보고서와 PR 게시 절차는 Stage 5 완료보고서 승인 후 진행한다.

## 위험과 대응

- **event sequence 충돌**: preview backdrop click 분기가 action/mode click, selected outside reset, drag selection과 충돌할 수 있다. `handleClick` 순서와 focused regression test로 고정한다.
- **pending action 중복 cleanup**: Copy/Save 중 backdrop click이 들어올 수 있다. `pendingCapture` guard로 중복 cleanup을 막는다.
- **dialog 축소에 따른 가독성 저하**: dialog 상한을 낮추면 full page preview 가독성이 줄 수 있다. surface scroll과 image `max-width` 계약을 유지한다.
- **visible preview no-scroll 회귀**: dialog 크기 조정이 visible preview를 내부 scroll 상태로 만들 수 있다. visible mode의 `overflow: hidden`, `object-fit: contain`, `max-height: 100%` 계약을 유지한다.
- **모바일 tradeoff**: 좁은 viewport에서는 backdrop target과 이미지 면적이 충돌한다. 최소 backdrop target과 버튼 접근성을 우선하고, 지나친 축소는 피한다.

## 승인 요청 사항

- 위 Stage 1~3 분할, 산출물, 검증 명령, 커밋 메시지 기준으로 Task #39 구현을 시작하는 것
- Stage 1에서 preview backdrop click을 `requestClose()` 기반 cleanup으로 연결하는 것
- Stage 2에서 dialog 최대 크기와 shared inline padding CSS 계약을 함께 보정하는 것
- Stage 3에서 품질 매트릭스와 최종 보고서를 묶어 통합 검증하는 것
- README 계열은 수정하지 않고 `mydocs/tech/task_m020_8_quality_matrix.md`만 최소 갱신하는 것
