# Task #35 최종 보고서

GitHub Issue: [#35](https://github.com/postmelee/crop/issues/35)
수행계획서: [`task_m020_35.md`](../plans/task_m020_35.md)
구현계획서: [`task_m020_35_impl.md`](../plans/task_m020_35_impl.md)
마일스톤: M020
상태: PR 게시 준비

## 요약

전체 페이지 캡처가 browser canvas 최대 dimension 또는 area 제한을 넘을 때 계획 단계에서 즉시 실패하지 않고, stitching 단계에서 최종 출력만 자동 다운스케일하도록 보정했다. 입력 tile의 source scale은 유지하고 최종 canvas destination에만 effective output scale을 적용하므로, 제한 이하 full page/selected capture는 기존 출력 크기를 유지한다.

`debugger`, `<all_urls>`, broad host permission은 추가하지 않았다. 기존 Chrome MV3 `chrome.tabs.captureVisibleTab()` 기반 tile capture와 scroll stitching 구조를 유지하면서 단일 PNG fallback 성공률을 높이는 변경이다.

## 작업 요약

- 대상 이슈: #35
- 마일스톤: M020
- 단계 수: 4
- 작업 목적: 전체 페이지 캡처가 maximum canvas size 초과로 실패하는 경우 종횡비 유지 downscale fallback으로 단일 PNG를 생성한다.

## 변경 파일 목록과 영향 범위

| 경로 | 변경 요약 | 영향 범위 |
|---|---|---|
| `src/shared/stitch-image.ts` | source scale과 output scale을 분리하고, max dimension/area 초과 시 종횡비 유지 downscale plan을 계산하도록 변경했다. | stitching output sizing, canvas draw |
| `src/content/overlay/full-page-capture.ts` | full page/page rect tile plan에서 oversized estimated output preflight reject를 제거하고, 유효하지 않은 viewport/document 방어만 유지했다. | full page and selected page rect planning |
| `src/content/overlay/crop-overlay.ts` | stitched capture 결과의 downscale metadata를 preview/action dataset에 기록하도록 연결했다. | capture pipeline metadata |
| `tests/shared/stitch-image.test.ts` | 제한 이하 유지, dimension/area 초과 downscale, tile edge alignment, invalid input 테스트를 보강했다. | automated regression |
| `tests/content/overlay/full-page-capture.test.ts` | oversized full page가 계획 단계에서 실패하지 않고 stitch-time fallback 대상으로 남는지 검증했다. | automated regression |
| `tests/content/overlay/phase6-regression.test.ts` | full page/selected runtime, 권한 경계, P6-40 품질 기준 회귀 테스트를 보강했다. | automated regression |
| `README.md`, `README.ko.md`, `README.ja.md`, `README.zh-CN.md` | full page 제한 설명을 명시 오류에서 자동 downscale fallback 기준으로 갱신했다. | user-facing docs |
| `mydocs/tech/task_m020_8_quality_matrix.md` | P6-40 oversized full page downscale fallback 기준과 수동 smoke 절차를 추가했다. | internal quality matrix |
| `mydocs/plans/task_m020_35.md`, `mydocs/plans/task_m020_35_impl.md` | 수행계획서와 구현계획서를 작성했다. | task planning |
| `mydocs/working/task_m020_35_stage*.md`, `mydocs/report/task_m020_35_report.md`, `mydocs/orders/20260604.md` | 단계 보고, 최종 보고, 오늘할일 완료 상태를 기록했다. | hyper-waterfall records |

## 문서 위치 검증

이번 task에서는 공식 문서 루트(`docs/`, `specs/`, `site/`, `website/`, `adr`)를 새로 만들지 않았다. 수행계획서의 문서 위치 판단대로 기존 README 계열과 `mydocs/` 내부 산출물만 갱신했다.

| 파일 | 계획된 위치 | 실제 위치 | 결과 | 근거 |
|---|---|---|---|---|
| `README.md` | `README.md` | `README.md` | OK | 수행계획서의 root README 갱신 판단과 일치 |
| `README.ko.md` | `README.ko.md` | `README.ko.md` | OK | 수행계획서의 다국어 README 갱신 판단과 일치 |
| `README.ja.md` | `README.ja.md` | `README.ja.md` | OK | 수행계획서의 다국어 README 갱신 판단과 일치 |
| `README.zh-CN.md` | `README.zh-CN.md` | `README.zh-CN.md` | OK | 수행계획서의 다국어 README 갱신 판단과 일치 |
| `mydocs/tech/task_m020_8_quality_matrix.md` | `mydocs/tech/` | `mydocs/tech/` | OK | 내부 품질 기준 위치와 일치 |
| `mydocs/plans/task_m020_35.md` | `mydocs/plans/` | `mydocs/plans/` | OK | 수행계획서 위치 |
| `mydocs/plans/task_m020_35_impl.md` | `mydocs/plans/` | `mydocs/plans/` | OK | 구현계획서 위치 |
| `mydocs/working/task_m020_35_stage*.md` | `mydocs/working/` | `mydocs/working/` | OK | 단계 보고서 위치 |
| `mydocs/report/task_m020_35_report.md` | `mydocs/report/` | `mydocs/report/` | OK | 최종 보고서 위치 |
| `mydocs/orders/20260604.md` | `mydocs/orders/` | `mydocs/orders/` | OK | 오늘할일 위치 |

## 변경 전·후 정량 비교

| 지표 | 변경 전 | 변경 후 |
|---|---|---|
| oversized full page 계획 | estimated output이 max canvas를 넘으면 계획 단계에서 실패 | tile plan은 유지하고 stitch 단계에서 output downscale |
| canvas 제한 초과 처리 | 단일 PNG 생성 실패 | max dimension/area 이하 단일 PNG로 fallback |
| scale metadata | 단일 `scale` 중심 | `sourceScale`, `outputScale`, `downscaleRatio`, `downscaled` 추가 |
| 제한 이하 stitching | source scale 기준 출력 | 기존 출력 크기 유지 |
| oversized fallback 전용 자동 테스트 | 없음 | stitch helper, full page planning, Phase 6 품질 기준 테스트 추가 |
| 전체 자동 테스트 | 해당 없음 | PR 게시 중 `origin/devel` 병합 후 17개 파일, 208개 테스트 통과 |
| MV3 권한 | `activeTab`, `scripting`, `clipboardWrite` 중심 | 동일, `debugger`/`<all_urls>` 미추가 |

## 단계 산출물

| Stage | 보고서 | 요약 |
|---|---|---|
| Stage 1 | [`task_m020_35_stage1.md`](../working/task_m020_35_stage1.md) | stitching 출력 크기 정책과 downscale helper 작성 |
| Stage 2 | [`task_m020_35_stage2.md`](../working/task_m020_35_stage2.md) | full page/selected stitching runtime에 downscale fallback 통합 |
| Stage 3 | [`task_m020_35_stage3.md`](../working/task_m020_35_stage3.md) | README 계열과 Phase 6 품질 매트릭스 갱신 |
| Stage 4 | [`task_m020_35_stage4.md`](../working/task_m020_35_stage4.md) | 통합 build/typecheck/test/grep 검증과 최종 보고 |

## 검증 결과

| 수용 기준 | 결과 |
|---|---|
| 제한 이하 full page/selected stitching은 기존 출력 크기와 tile 배치를 유지한다 | OK — stitch helper 테스트와 selected/full page focused tests |
| 제한 초과 stitching은 최종 output pixel size가 `MAX_CAPTURE_DIMENSION`과 `MAX_CAPTURE_AREA`를 넘지 않는다 | OK — `getStitchOutputPixelPlan()` dimension/area 초과 테스트 |
| 다운스케일은 x/y에 같은 fit ratio를 적용해 종횡비를 유지한다 | OK — downscale ratio와 output scale 테스트 |
| `stitchCapturedTiles()` 결과에서 원본 capture scale과 최종 output scale/downscale 여부를 확인할 수 있다 | OK — result metadata와 overlay dataset 연결 테스트 |
| `createFullPageTilePlan()`은 oversized full page를 계획 단계에서 즉시 실패시키지 않는다 | OK — full-page-capture 테스트로 고정 |
| 빈 viewport/document 또는 유효하지 않은 output은 명확한 오류로 실패한다 | OK — full-page-capture와 stitch-image invalid input 테스트 |
| overlay 숨김, scrollbar 숨김, fixed/sticky page chrome suppression, scroll restoration 정책은 회귀하지 않는다 | OK — phase6 regression과 full-page-capture tests |
| `debugger`, `<all_urls>`, broad host permission은 추가하지 않는다 | OK — manifest/source/test grep과 권한 회귀 테스트 |

### 자동 검증

최근 통과 명령:

```bash
npm run build
npm run typecheck
npm test
rg "debugger|<all_urls>|host_permissions|captureVisibleTab" manifest.json src tests
rg "#35|downscale|maximum canvas|full page|전체 페이지|MAX_CAPTURE" README*.md mydocs src tests manifest.json
git diff --check
git status --short
```

결과:

- OK: `npm run build` 통과. Vite build가 `dist/` 확장 산출물을 생성했다.
- OK: `npm run typecheck` 통과.
- OK: `npm test` 17개 파일, 208개 테스트 통과. PR 게시 중 `origin/devel` 병합 후 재검증했다.
- OK: 권한 경계 grep 통과. `debugger`, `<all_urls>`, broad host permission 추가 없음.
- OK: #35 핵심 키워드 grep 통과. downscale helper, full page fallback, README 계열, 품질 매트릭스, 단계 보고서 반영 확인.
- OK: `git diff --check` 통과.
- OK: PR 게시 중 `origin/devel` 병합 충돌 해결. `mydocs/orders/20260604.md`의 M020 #35 완료 행과 M030 #9 완료 행을 모두 보존했다.

### 단계별 검증 결과

- Stage 1: [`task_m020_35_stage1.md`](../working/task_m020_35_stage1.md) — output size/downscale helper와 stitch 테스트 검증 완료.
- Stage 2: [`task_m020_35_stage2.md`](../working/task_m020_35_stage2.md) — full page/selected runtime 통합과 회귀 테스트 검증 완료.
- Stage 3: [`task_m020_35_stage3.md`](../working/task_m020_35_stage3.md) — README, 품질 매트릭스, P6-40 회귀 테스트 검증 완료.
- Stage 4: [`task_m020_35_stage4.md`](../working/task_m020_35_stage4.md) — 통합 build/typecheck/test/grep 검증 완료.

### 수동 smoke 후보

에이전트는 실제 Chrome 확장으로 oversized full page PNG를 저장해 dimension을 직접 검증하지 않았다. PR 리뷰 또는 작업지시자 확인 시 다음 절차를 권장한다.

1. `npm run build` 후 Chrome `chrome://extensions`에서 `dist/` 확장을 reload한다.
2. 매우 긴 문서 또는 `README`처럼 전체 높이가 큰 페이지에서 crop 전체 페이지 기능을 실행한다.
3. 저장 PNG가 단일 파일로 생성되는지 확인한다.
4. PNG pixel dimension이 `MAX_CAPTURE_DIMENSION = 32767`, `MAX_CAPTURE_AREA = 268435456` 이하인지 확인한다.
5. 원본 DPR 해상도보다 낮아질 수 있음을 확인한다.
6. 저장 PNG에 overlay, preview, action UI가 포함되지 않는지 확인한다.

## 잔여 위험과 후속 작업

### 잔여 위험

- downscale fallback은 원본 DPR 해상도보다 선명도가 낮아질 수 있다.
- 매우 큰 페이지는 downscale 후에도 tile capture, canvas draw, PNG encoding 비용이 남는다.
- lazy loading, animation, layout shift, sticky/fixed 변화가 있는 실제 문서에서는 tile 간 픽셀 차이가 생길 수 있다.
- 이번 task는 단일 PNG fallback만 다루며 원본 해상도 다중 PNG 분할 저장 UX는 포함하지 않았다.

### 후속 작업 후보

- 실제 Chrome 확장 smoke에서 oversized full page 저장 PNG dimension과 overlay 미포함 여부를 PR 리뷰 자료로 추가한다.
- 큰 페이지 capture의 tile 수, 소요 시간, PNG encoding 비용을 계측하는 성능 개선 task를 검토한다.
- 원본 해상도가 중요한 사용자용 다중 파일 저장 또는 scale 선택 UX를 별도 task로 검토한다.

## 작업지시자 승인 요청

- 최종 보고서와 수용 기준 검증 결과를 승인하면 `publish/task35` 브랜치를 게시하고 `devel` 대상 PR을 생성한다.
