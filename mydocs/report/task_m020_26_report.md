# Task #26 최종 보고서

GitHub Issue: [#26](https://github.com/postmelee/crop/issues/26)
수행계획서: [`task_m020_26.md`](../plans/task_m020_26.md)
구현계획서: [`task_m020_26_impl.md`](../plans/task_m020_26_impl.md)
마일스톤: M020
상태: PR 게시 준비

## 요약

스크롤 후 선택 영역 일부가 현재 viewport 밖에 있는 상태에서 Save/Copy하면 결과가 viewport 교차 영역으로 잘리는 문제를 보정했다. 선택 rect가 현재 viewport 안에 완전히 들어오면 기존 단일 visible crop 경로를 유지하고, viewport 밖으로 나간 selected page rect만 full page capture에서 쓰던 tile capture/stitching 계약을 재사용해 전체 선택 rect 기준 PNG로 만든다.

Chrome MV3 제약상 Firefox privileged snapshot처럼 임의 page rect를 한 번에 그릴 수는 없으므로, `chrome.tabs.captureVisibleTab()` 기반 tile capture를 선택 영역 bounds에 맞게 좁게 적용했다. `debugger`, `<all_urls>`, broad host permission은 추가하지 않았다.

## 작업 요약

- 대상 이슈: #26
- 마일스톤: M020
- 단계 수: 4
- 작업 목적: 스크롤 후 selected region Save/Copy가 현재 viewport로 잘리지 않고 선택한 page rect 전체를 저장하도록 보정한다.

## 변경 파일 목록과 영향 범위

| 경로 | 변경 요약 | 영향 범위 |
|---|---|---|
| `src/content/overlay/full-page-capture.ts` | 선택 page rect bounds 입력 기반 `createPageRectTilePlan()`과 `capturePageRectTiles()`를 추가하고 full page/selected capture loop를 공유했다. | capture tile planning, scroll restoration |
| `src/content/overlay/crop-overlay.ts` | selected capture에서 viewport 완전 포함 여부를 판정하고, viewport 밖 rect는 selected page rect stitching 경로로 분기했다. | selected Save/Copy runtime |
| `tests/content/overlay/full-page-capture.test.ts` | 선택 rect tile plan, clamp, reversed bounds, capture loop, scroll restoration 테스트를 추가했다. | automated regression |
| `tests/content/overlay/phase6-regression.test.ts` | selected capture runtime 분기, fixture marker, 권한 경계를 회귀 테스트로 고정했다. | automated regression |
| `tests/fixtures/phase6_edge_cases.html` | `selected-scroll-capture-target` 수동 smoke fixture를 추가하고 기존 large element 설명을 현재 기대 동작으로 갱신했다. | fixture/manual smoke |
| `mydocs/tech/task_m020_8_quality_matrix.md` | P6-13 기준을 #26 동작으로 갱신하고 P6-37 selected scroll capture 기준과 수동 절차를 추가했다. | internal quality matrix |
| `mydocs/plans/task_m020_26.md`, `mydocs/plans/task_m020_26_impl.md` | 수행계획서와 구현계획서를 작성했다. | task planning |
| `mydocs/working/task_m020_26_stage*.md`, `mydocs/report/task_m020_26_report.md`, `mydocs/orders/20260602.md` | 단계 보고, 최종 보고, 오늘할일 완료 상태를 기록했다. | hyper-waterfall records |

## 문서 위치 검증

이번 task에서는 공식 제품 문서 루트(`docs/`, `specs/`, `site/`, `website/`, `adr`)를 새로 만들지 않았다.

| 파일 | 계획된 위치 | 실제 위치 | 결과 | 근거 |
|---|---|---|---|---|
| `mydocs/tech/task_m020_8_quality_matrix.md` | `mydocs/tech/` | `mydocs/tech/` | OK | 수행계획서와 구현계획서의 문서 위치 판단과 일치 |
| `mydocs/plans/task_m020_26.md` | `mydocs/plans/` | `mydocs/plans/` | OK | 수행계획서 위치 |
| `mydocs/plans/task_m020_26_impl.md` | `mydocs/plans/` | `mydocs/plans/` | OK | 구현계획서 위치 |
| `mydocs/working/task_m020_26_stage*.md` | `mydocs/working/` | `mydocs/working/` | OK | 단계 보고서 위치 |
| `mydocs/report/task_m020_26_report.md` | `mydocs/report/` | `mydocs/report/` | OK | 최종 보고서 위치 |
| `mydocs/orders/20260602.md` | `mydocs/orders/` | `mydocs/orders/` | OK | 오늘할일 위치 |

## 변경 전·후 정량 비교

| 지표 | 변경 전 | 변경 후 |
|---|---|---|
| viewport 밖 selected Save/Copy | 현재 viewport 교차 영역으로 잘릴 수 있음 | selected page rect 전체를 tile/stitching으로 저장 |
| selected rect tile helper | full page bounds 중심 helper만 존재 | `createPageRectTilePlan()`, `capturePageRectTiles()`로 선택 bounds 지원 |
| Phase 6 selected scroll 기준 | 별도 항목 없음 | `P6-37`과 `selected-scroll-capture-target` fixture 추가 |
| 자동 테스트 | Stage 2 기준 185개 통과 | 최종 16개 파일, 186개 테스트 통과 |
| MV3 권한 | `activeTab`, `scripting`, `clipboardWrite` 중심 | 동일, `debugger`/`<all_urls>` 미추가 |

## 단계 산출물

| Stage | 보고서 | 요약 |
|---|---|---|
| Stage 1 | [`task_m020_26_stage1.md`](../working/task_m020_26_stage1.md) | 선택 rect bounds 기반 tile/stitch 계약과 helper 테스트 작성 |
| Stage 2 | [`task_m020_26_stage2.md`](../working/task_m020_26_stage2.md) | selected Save/Copy runtime에서 viewport 밖 rect stitching 경로 통합 |
| Stage 3 | [`task_m020_26_stage3.md`](../working/task_m020_26_stage3.md) | Phase 6 fixture, 품질 매트릭스, 회귀 테스트 보강 |
| Stage 4 | [`task_m020_26_stage4.md`](../working/task_m020_26_stage4.md) | 통합 검증, 최종 보고서, 오늘할일 완료 처리 |

## 검증 결과

| 수용 기준 | 결과 |
|---|---|
| 선택 영역이 현재 viewport 안에 완전히 들어오면 기존 단일 `captureVisibleTab()` crop 경로를 유지한다 | OK — `isPageRectFullyInsideViewport()` 분기와 phase6 runtime grep 테스트 |
| 선택 영역이 현재 viewport를 벗어나면 선택 page rect 전체를 기준으로 tile capture/stitching을 수행한다 | OK — `captureSelectedPageRectRegion()`, `capturePageRectTiles()`, full-page-capture tests |
| 스크롤 후 Save/Copy해도 출력 이미지의 CSS 기준 크기는 선택 rect 크기와 일치한다 | OK — selected rect tile plan `outputCssSize`, destination rect 테스트 |
| 출력 픽셀 크기는 캡처 이미지 natural size와 viewport CSS size에서 계산한 scale을 따른다 | OK — `stitchCapturedTiles()` 및 crop-image 관련 테스트 유지 |
| 선택 영역의 offscreen 부분이 현재 viewport 교집합으로 잘리지 않는다 | OK — tile plan source/destination 테스트와 P6-37 기준 추가 |
| overlay, toolbar, selection outline, handles, action buttons는 최종 PNG에 포함되지 않는다 | 자동 OK / 수동 후보 — overlay 숨김 capture loop 유지, 실제 PNG smoke는 에이전트 미수행 |
| capture 성공/실패와 무관하게 시작 scroll position을 복구한다 | OK — `capturePageRectTiles()` scroll restoration 테스트 |
| full page capture, visible viewport capture, iframe/shadow selection은 회귀하지 않는다 | OK — 전체 `npm test` 16개 파일 186개 테스트 통과 |
| `debugger`, `<all_urls>`, broad host permission은 추가하지 않는다 | OK — manifest/runtime grep과 phase6 permission regression |

### 자동 검증

최근 통과 명령:

```bash
npm run build
npm run typecheck
npm test
rg "debugger|<all_urls>|host_permissions|captureVisibleTab" manifest.json src tests
rg "#26|selected|scroll|viewport|stitch|tile" mydocs src tests
git diff --check
git status --short
```

결과:

- OK: `npm run build` 통과.
- OK: `npm run typecheck` 통과.
- OK: `npm test` 16개 파일, 186개 테스트 통과.
- OK: 권한 경계 grep 통과. `debugger`, `<all_urls>` 권한 추가 없음.
- OK: #26 핵심 경로 grep 통과. selected capture runtime, fixture, 품질 매트릭스 반영 확인.
- OK: `git diff --check` 통과.

### 단계별 검증 결과

- Stage 1: [`task_m020_26_stage1.md`](../working/task_m020_26_stage1.md) — tile/stitch contract와 선택 rect helper 검증 완료.
- Stage 2: [`task_m020_26_stage2.md`](../working/task_m020_26_stage2.md) — selected capture stitching 분기와 scroll restoration 검증 완료.
- Stage 3: [`task_m020_26_stage3.md`](../working/task_m020_26_stage3.md) — fixture, 품질 매트릭스, 회귀 테스트 검증 완료.
- Stage 4: [`task_m020_26_stage4.md`](../working/task_m020_26_stage4.md) — 통합 build/typecheck/test/grep 검증 완료.

### 수동 smoke 후보

에이전트는 실제 Chrome 확장 다운로드 PNG 파일을 생성해 dimension을 직접 검증하지 않았다. PR 리뷰 또는 작업지시자 확인 시 다음 절차를 권장한다.

1. `npm run build` 후 Chrome `chrome://extensions`에서 `dist/` 확장을 reload한다.
2. `http://127.0.0.1:5176/tests/fixtures/phase6_edge_cases.html`을 연다.
3. `selected-scroll-capture-target` 전체 panel을 선택하고 표시 크기 `1520 x 920`을 기록한다.
4. 선택 상태를 유지한 채 scroll해 sticky header가 선택 영역 위쪽과 겹치게 만든다.
5. `Save` 실행 후 저장 PNG 크기가 DPR 2 환경 기준 `3040 x 1840`인지 확인한다.
6. 저장 PNG에 top/bottom marker가 모두 포함되고 overlay, handles, action buttons가 포함되지 않는지 확인한다.
7. Save 후 시작 scroll position으로 복구되는지 확인한다.

## 잔여 위험과 후속 작업

### 잔여 위험

- Chrome MV3 `captureVisibleTab()` 기반 구현은 viewport 밖 선택 rect를 캡처하려면 scroll 이동이 필요하다. tile 수를 선택 rect bounds로 줄이고 완료/실패 후 복구를 보장했지만, capture 중 화면 이동이 순간적으로 보일 수 있다.
- sticky/fixed 요소가 선택 rect 위에 겹친 경우 Firefox privileged snapshot과 pixel-perfect parity는 보장하지 않는다.
- lazy loading, animation, layout shift가 있는 실제 문서에서는 tile 간 픽셀 차이가 생길 수 있다.
- 매우 큰 선택 영역은 기존 max canvas 제한에 걸릴 수 있으며, 이 경우 full page capture와 같은 제한 정책을 따른다.

### 후속 작업 후보

- 실제 Chrome 확장 smoke에서 `selected-scroll-capture-target` 다운로드 PNG dimension과 marker 포함 여부를 PR 리뷰 자료로 추가한다.
- 큰 selected rect capture 중 사용자에게 보이는 scroll 이동을 더 줄이는 별도 UX/overlay suppression 개선을 검토한다.

## 작업지시자 승인 요청

- 최종 보고서와 수용 기준 검증 결과를 승인하면 `publish/task26` 브랜치를 게시하고 `devel` 대상 PR을 생성한다.
