# Task #40 Stage 6 보고서

GitHub Issue: [#40](https://github.com/postmelee/crop/issues/40)
구현계획서: [`task_m020_40_impl.md`](../plans/task_m020_40_impl.md)
Stage: 6

## 단계 목적

Stage 5 build를 작업지시자가 수동 검증한 결과, 기존 흰 band가 같은 위치의 회색 band로 바뀌어 계속 보였다. 저장 PNG는 이 수정 전부터 정상이었으므로, 문제를 capture/stitching 결과가 아니라 초대형 단일 `<img>` preview의 scroll paint artifact로 재분류한다. Stage 6은 Stage 2/5 제품 코드 보정을 되돌리고, 실제 해결을 tiled preview renderer 후속 이슈로 분리한다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `src/content/overlay/crop-overlay.css` | `.crop-preview-image` background를 `transparent`에서 기존 `#ffffff`로 되돌림 |
| `src/content/overlay/full-page-capture.ts` | tile capture 기본 wait를 2 animation frames에서 기존 1 animation frame + timeout으로 되돌림 |
| `tests/content/overlay/phase6-regression.test.ts` | preview image `#ffffff` 금지 assertion 제거 |
| `tests/content/overlay/full-page-capture.test.ts` | Stage 5 tile wait contract test 제거 |
| `mydocs/feedback/task_m020_40_feedback.md` | 저장 PNG 정상, preview-only 회색 band 재현, tiled preview 후속 분리 판단 기록 |
| `mydocs/orders/20260605.md` | #40 상태를 보정 되돌림과 후속 이슈 분리 완료로 갱신 |
| `mydocs/plans/task_m020_40_impl.md` | Stage 6 rollback과 후속 이슈 분리 계획 추가 |
| `mydocs/tech/task_m020_8_quality_matrix.md` | P6-41을 후속 이슈 필요 상태로 갱신 |
| `mydocs/report/task_m020_40_report.md` | 최종 보고서를 Stage 6 판단 기준으로 갱신 |
| `mydocs/working/task_m020_40_stage6.md` | Stage 6 완료 보고서 작성 |

## 본문 변경 정도 / 본문 무손실 여부

제품 코드는 Stage 2/5에서 추가한 보정만 되돌렸다. 저장 PNG stitching, Chrome 권한, full page capture tile 계획, preview toolbar 동작은 변경하지 않았다. Stage 1~5 보고서는 삭제하지 않고, Stage 6 문서에서 시도와 되돌림을 연결해 기록했다.

## 검증 결과

실행 명령:

```bash
npm run build
npm run typecheck
npm test
rg "debugger|<all_urls>|host_permissions|captureVisibleTab" manifest.json src tests
rg "TILE_CAPTURE_SETTLE_FRAME_COUNT|background: transparent;|background: #ffffff;|P6-41|tiled preview|Stage 6" src tests mydocs
git diff --check
git status --short
```

결과:

- OK — `npm run build` 통과. Vite build는 `21` modules transformed, `dist/content/inject.js` 생성, `174ms`.
- OK — `npm run typecheck` 통과.
- OK — `npm test` 통과. `17` files, `208` tests passed.
- OK — permission grep에서 `debugger`, `<all_urls>`, `host_permissions` 추가 없음.
- OK — Stage 6 키워드 grep으로 제품 코드 되돌림과 문서 반영 확인.
- OK — `git diff --check` 통과.

## 잔여 위험

- 현행 단일 `<img>` preview 구조에서는 엄청 긴 full page preview를 빠르게 스크롤할 때 blank band가 계속 보일 수 있다.
- 이 현상은 저장 PNG 문제가 아니지만, preview 품질 문제로 사용자가 캡처 실패처럼 인식할 수 있다.
- 후속 tiled preview renderer task가 생성되어야 실제 사용자-visible 문제를 해결할 수 있다.

## 다음 단계 영향

- 새 이슈는 `task-register` 절차에 따라 제목, 본문, milestone, label 초안을 작업지시자에게 확인받은 뒤 생성한다.
- 후속 이슈에서는 Save/Copy용 stitched PNG는 유지하고, modal preview만 tile 조각 렌더링으로 전환한다.

## 새 이슈 초안

- 제목: `Full page preview를 tiled renderer로 전환해 긴 페이지 스크롤 paint artifact 제거`
- milestone 후보: `M020 — MVP Stabilization`
- label 후보: `bug`
- 생성 결과: [#41](https://github.com/postmelee/crop/issues/41)
- 선택 이유: P6-41 preview 품질 결함이며, 열린 milestone 설명 중 Phase 6 품질/edge-case/MVP limitation review에 해당한다. 조회된 기존 label에는 area/kind label이 없으므로 동작 결함을 나타내는 `bug`만 사용한다.
- 중복 확인: `gh issue list --repo postmelee/crop --state all --search "tiled preview full page preview blank band" --limit 20` 결과 중복 없음.

### 배경

- #40에서 전체 페이지 preview modal을 매우 긴 페이지에서 빠르게 스크롤할 때 blank band가 보이는 문제가 분석됐다.
- 작업지시자 확인에 따르면 저장 PNG는 Stage 2/5 수정 전부터 정상이다.
- Stage 2의 preview image background 완화와 Stage 5의 tile capture wait 강화는 흰 band를 근본 해결하지 못했고, 같은 위치의 회색 band가 계속 재현됐다.
- 최종 판단은 초대형 단일 `<img>` preview를 Chrome이 빠른 스크롤 중 즉시 raster/paint하지 못해 preview surface 배경이 edge에 드러나는 렌더링 artifact다.

### 목표

- Save/Copy용 stitched PNG 생성 경로는 유지한다.
- full page preview modal만 단일 초대형 `<img>` 대신 capture tile dataUrl 기반 tiled renderer로 표시한다.
- 매우 긴 페이지 preview를 빠르게 스크롤해도 새로 노출되는 edge에 blank band가 보이지 않게 한다.
- visible viewport preview와 selected visible crop preview 동작은 회귀하지 않는다.

### 범위 - 포함

- full page capture 결과에서 preview 표시용 tile metadata/dataUrl을 유지하거나 전달하는 구조 설계.
- modal preview의 full page mode를 여러 작은 image tile 조각으로 렌더링하는 DOM/CSS 구현.
- tile의 `destinationCssRect`, output scale/downscale, wrapper 크기 정렬 검증.
- Copy/Save는 기존 stitched PNG dataUrl을 계속 사용하도록 책임 분리.
- P6-41 품질 매트릭스와 task 문서 갱신.

### 범위 - 제외

- full page 저장 PNG 해상도 개선.
- multi-part PNG export, PDF export, 별도 파일 묶음 export.
- `debugger`, `<all_urls>`, broad host permission 추가.
- capture/stitching 알고리즘의 품질 변경. 단, preview tile metadata 전달을 위한 최소 구조 변경은 포함한다.
- tile virtualization은 초기 구현에서 필요한 경우에만 별도 승인 후 다룬다.

### 수용 기준

- 매우 긴 실제 GitHub 페이지에서 full page preview modal을 빠르게 스크롤해도 blank band가 보이지 않는다.
- Save/Copy 결과 PNG는 기존 정상 stitched PNG와 같은 경로를 사용하고 preview tile DOM이 저장 결과에 섞이지 않는다.
- visible viewport preview는 내부 스크롤 없이 기존 맞춤 표시를 유지한다.
- full page preview toolbar, Copy/Save/Cancel/Retry 동작과 shortcut이 유지된다.
- Chrome MV3 권한이 확대되지 않는다.

### 검증 기준

- `npm run build`
- `npm run typecheck`
- `npm test`
- full page capture/preview 관련 focused tests
- `rg "debugger|<all_urls>|host_permissions|captureVisibleTab" manifest.json src tests`
- 긴 실제 GitHub 페이지 full page preview scroll 수동 smoke
- 저장 PNG Save smoke

### 참고

- #40
- `mydocs/feedback/task_m020_40_feedback.md`
- `mydocs/report/task_m020_40_report.md`
- `mydocs/tech/task_m020_8_quality_matrix.md` P6-41

## 승인 요청

- Stage 6 산출물과 검증 결과를 승인하면 #40은 원인 분리와 보정 되돌림 완료로 마무리하고, #41 task-start 승인 절차로 진행한다.
