# Task #15 최종 보고서

GitHub Issue: [#15](https://github.com/postmelee/crop/issues/15)  
수행계획서: [`task_m020_15.md`](../plans/task_m020_15.md)  
구현계획서: [`task_m020_15_impl.md`](../plans/task_m020_15_impl.md)  
마일스톤: M020  
상태: PR 게시 준비 완료

## 요약

`전체 페이지 선택`을 실제 full page capture mode로 활성화하고, Chrome MV3의 `chrome.tabs.captureVisibleTab()` 기반 visible viewport tile을 scroll stitching해 하나의 PNG로 만든 뒤 Firefox식 preview에서 Copy/Save하는 경로를 구현했다.

Firefox Screenshots의 privileged `drawSnapshot()` API는 Chrome 확장에서 사용할 수 없으므로, 이번 구현은 Firefox의 full page bounds/action pipeline contract를 참고하되 Chrome-safe scroll orchestration으로 구현했다. `debugger`, `<all_urls>` 권한은 추가하지 않았다.

## 작업 요약

- 대상 이슈: #15
- 마일스톤: M020
- 단계 수: 5
- 작업 목적: Chrome MV3 권한 경계를 유지하면서 `보이는 영역 선택`과 `전체 페이지 선택`을 Firefox식 preview Copy/Save 흐름으로 지원한다.

## 변경 파일 목록과 영향 범위

| 경로 | 변경 요약 | 영향 범위 |
|---|---|---|
| `src/content/overlay/crop-overlay.ts` | visible/full page preview orchestration, tile capture 연결, preview shortcut, 종료 flicker 방지 | content overlay runtime |
| `src/content/overlay/crop-overlay.css` | Firefox식 mode toolbar, selection controls, preview modal, toolbar, frame, cursor 스타일 보정 | overlay UI |
| `src/content/overlay/crop-template.ts` | mode button, preview dialog/action template, action tooltip/shortcut 연결 | overlay DOM template |
| `src/content/overlay/full-page-capture.ts` | full page tile plan, scroll capture loop, scroll restoration, chrome suppression hook | full page capture core |
| `src/firefox-derived/screenshots-ui-assets.ts` | Firefox reload icon 기반 retry icon asset 추가 | Firefox-derived UI asset |
| `tests/content/overlay/*.test.ts` | full page/visible preview, stitching, UI parity, shortcut, flicker guard 회귀 보강 | automated regression |
| `README.md`, `mydocs/tech/task_m020_8_quality_matrix.md`, `mydocs/report/task_m020_15_report.md`, `mydocs/orders/20260601.md` | 사용법, 품질 매트릭스, 최종 보고, 오늘할일 상태 갱신 | project docs |

## 문서 위치 검증

| 파일 | 계획된 위치 | 실제 위치 | 결과 | 근거 |
|---|---|---|---|---|
| `mydocs/report/task_m020_15_report.md` | `mydocs/report/` | `mydocs/report/` | OK | 하이퍼-워터폴 최종 보고서 위치 |
| `mydocs/tech/task_m020_8_quality_matrix.md` | `mydocs/tech/` | `mydocs/tech/` | OK | Phase 6 품질 매트릭스 기존 문서 갱신 |
| `README.md` | repository root | repository root | OK | 사용자-facing 사용법과 제한 문구 갱신 |
| `mydocs/orders/20260601.md` | `mydocs/orders/` | `mydocs/orders/` | OK | 오늘할일 완료 처리 |

## 변경 전·후 정량 비교

| 지표 | 변경 전 | 변경 후 |
|---|---|---|
| full page mode | mode button disabled 또는 미완성 경로 | full page tile stitching 후 preview Copy/Save |
| visible viewport mode | 즉시 capture action 중심 | Firefox식 preview modal Copy/Save |
| 자동 테스트 | 180개 기준 | 181개 통과 |
| MV3 권한 | `activeTab`, `scripting`, `clipboardWrite` 중심 | 동일, `debugger`/`<all_urls>` 미추가 |

## 단계 산출물

| Stage | 보고서 | 요약 |
|---|---|---|
| Stage 1 | [`task_m020_15_stage1.md`](../working/task_m020_15_stage1.md) | full page metrics, tile plan, stitching helper와 max canvas guard 작성 |
| Stage 2 | [`task_m020_15_stage2.md`](../working/task_m020_15_stage2.md) | scroll capture loop, overlay 숨김, scroll restoration 구현 |
| Stage 3 | [`task_m020_15_stage3.md`](../working/task_m020_15_stage3.md) | `전체 페이지 선택` UI와 Copy/Save action pipeline 연결 |
| Stage 4 | [`task_m020_15_stage4.md`](../working/task_m020_15_stage4.md) | fixture, fixed/sticky 보정, stitching seam 회귀 테스트 보강 |
| Stage 5 | 완료 | Firefox식 visible/full page preview 보정, 상단 preview toolbar/내부 스크롤 잠금, preview dialog 위치/크기 보정, visible/full page dialog 크기 통일, preview toolbar와 image right edge 정렬, visible preview no-scroll 맞춤, preview frame 색상 통일, preview 기본 커서 보정, preview toolbar icon/tooltip/shortcut 보정, Copy/Save 종료 시 선택 박스와 preview toolbar flicker 방지, per-tile overlay 숨김, mode toolbar viewport 내부 배치, scrollbar 숨김, README, 품질 매트릭스, 직접 smoke 체크리스트 갱신 |

## 수용 기준 결과

| 기준 | 결과 | 근거 |
|---|---|---|
| `전체 페이지 선택`이 현재 top-level document full page PNG preview를 생성한다 | 자동+수동 OK | `crop-overlay.ts`, `crop-template.ts`, `phase6-regression.test.ts`, 작업지시자 smoke |
| `보이는 영역 선택`이 현재 visible viewport PNG preview를 생성한다 | 자동+수동 OK | `crop-overlay.ts`, `crop-template.ts`, `phase6-regression.test.ts`, 작업지시자 smoke |
| `captureVisibleTab()`와 content script scroll orchestration으로 구현한다 | OK | `full-page-capture.ts`, `service-worker.ts` |
| `debugger`, `<all_urls>` 권한을 추가하지 않는다 | OK | `manifest.json`, `phase6-regression.test.ts`, grep |
| capture 결과에 overlay/action controls/scrollbar가 포함되지 않는다 | 자동+수동 OK | overlay hidden depth, document chrome suppression, Stage 5 regression, 작업지시자 PNG smoke |
| full page preview 모달이 Firefox처럼 상단 toolbar를 사용하고 배경 페이지로 wheel scroll을 넘기지 않는다 | 자동+수동 OK | `crop-template.ts`, `crop-overlay.css`, `crop-overlay.ts`, `phase6-regression.test.ts`, 작업지시자 smoke |
| full page preview toolbar가 Firefox식 retry icon과 Copy/Save shortcut tooltip을 사용한다 | 자동+수동 OK | `screenshots-ui-assets.ts`, `crop-template.ts`, `crop-overlay.ts`, `phase6-regression.test.ts`, 작업지시자 smoke |
| full page preview dialog가 넓은 화면에서 과도하게 커지지 않는다 | 자동+수동 OK | `crop-overlay.css`, `phase6-regression.test.ts`, 작업지시자 smoke |
| visible/full page preview dialog가 상단에 가깝게 배치되고 visible preview는 내부 스크롤 없이 맞춰진다 | 자동+수동 OK | `crop-overlay.css`, `phase6-regression.test.ts`, 작업지시자 smoke |
| visible/full page preview dialog 크기가 동일하고 Save button right edge가 image right edge와 맞는다 | 자동+수동 OK | `crop-overlay.css`, `phase6-regression.test.ts`, 작업지시자 smoke |
| full page preview 이미지 주변이 상단 toolbar와 같은 색 frame으로 감싸진다 | 자동+수동 OK | `crop-overlay.css`, `phase6-regression.test.ts`, 작업지시자 smoke |
| full page preview에서는 selection crosshair 대신 기본 커서를 사용한다 | 자동+수동 OK | `crop-overlay.css`, `phase6-regression.test.ts`, 작업지시자 smoke |
| full page capture 중 page scroll 이동이 사용자에게 노출되는 시간을 줄인다 | 자동+수동 OK | `full-page-capture.ts`, `full-page-capture.test.ts`, 작업지시자 smoke |
| mode toolbar가 browser chrome/bookmark bar에 가려지지 않도록 viewport 안쪽에 배치된다 | 자동+수동 OK | `crop-overlay.css`, `phase6-regression.test.ts`, 작업지시자 smoke |
| 선택 영역/visible/full page Copy 또는 Save 직후 선택 박스와 preview toolbar가 깜빡이지 않는다 | 자동+수동 OK | `crop-overlay.ts`, `phase6-regression.test.ts`, 작업지시자 smoke |
| 완료/실패와 무관하게 시작 scroll position을 복구한다 | 자동+수동 OK | `full-page-capture.test.ts`, 작업지시자 smoke |
| visible viewport selection/crop은 회귀하지 않는다 | 자동 OK | 전체 `npm run test` |
| same-origin iframe/open shadow selection은 회귀하지 않는다 | 자동 OK | `overlay-helpers.test.ts`, `phase6-regression.test.ts` |
| 매우 큰 문서는 max canvas dimension/area 정책으로 방어한다 | OK | `stitch-image.ts`, `full-page-capture.test.ts` |
| Firefox `drawSnapshot()`/actor/privileged API를 사용하지 않는다 | OK | Chrome MV3 runtime path 유지 |

## 자동 검증

최근 통과 명령:

```bash
npm run test
npm test -- tests/content/overlay/full-page-capture.test.ts tests/content/overlay/phase6-regression.test.ts
npm run typecheck
npm run build
rg -n "debugger|<all_urls>|chrome\\.debugger|captureFullPageTiles|stitchCapturedTiles|crop-preview-dialog|handleWheel|crop-mode-button--full-page" manifest.json src tests mydocs/report/task_m020_15_report.md mydocs/tech/task_m020_8_quality_matrix.md README.md
git diff --check
```

결과:

- OK: 관련 테스트 2개 파일 28개 테스트 통과.
- OK: 전체 `npm run test` 16개 파일 181개 테스트 통과.
- OK: build/typecheck 통과.
- OK: 권한 경계 grep 통과.
- OK: diff whitespace check 통과.

### 단계별 검증 결과

- Stage 1: [`task_m020_15_stage1.md`](../working/task_m020_15_stage1.md) — tile/stitch helper와 max canvas guard 검증 완료.
- Stage 2: [`task_m020_15_stage2.md`](../working/task_m020_15_stage2.md) — scroll capture loop와 scroll restoration 검증 완료.
- Stage 3: [`task_m020_15_stage3.md`](../working/task_m020_15_stage3.md) — full page UI/action pipeline 검증 완료.
- Stage 4: [`task_m020_15_stage4.md`](../working/task_m020_15_stage4.md) — fixture와 stitching edge case 검증 완료.
- Stage 5: `npm run test`, `npm run typecheck`, `npm run build`, 작업지시자 수동 smoke 통과.

## 직접 smoke 체크리스트

서버:

```text
http://127.0.0.1:5176/tests/fixtures/phase6_edge_cases.html
```

확인 항목:

1. `npm run build` 후 Chrome `chrome://extensions`에서 `dist/` 확장을 reload한다.
2. 위 fixture URL을 연다.
3. 확장 아이콘 또는 `Command+Shift+S`로 overlay를 실행한다.
4. `전체 페이지 선택`을 클릭한다.
5. 버튼 배경이 Firefox처럼 파란색이고 hover 시 더 진한 파란색으로 바뀌는지 확인한다.
6. mode toolbar 상단이 브라우저 주소창/북마크 바에 가려지지 않는지 확인한다.
7. 클릭 직후 거대한 selected rectangle이나 drag 상태로 들어가지 않고 full page preview가 표시되는지 확인한다.
8. 캡처 중 원본 페이지가 눈에 띄게 아래로 점프하거나 drag 상태처럼 보이지 않는지 확인한다.
9. preview dialog가 브라우저 viewport를 과도하게 채우지 않고 Firefox에 가까운 여백을 남기는지 확인한다.
10. preview 이미지가 버튼 toolbar 바로 아래에서 시작하고 상단 여백이 과도하지 않은지 확인한다.
11. preview 이미지 주변이 상단 toolbar와 같은 색 frame으로 감싸져 테두리를 확인할 수 있는지 확인한다.
12. preview 화면에서 커서가 selection crosshair가 아니라 기본 커서로 보이는지 확인한다.
13. preview dialog의 action buttons가 하단 floating bar가 아니라 상단 우측 toolbar에 표시되는지 확인한다.
14. retry icon이 X icon과 시각적으로 비슷한 크기인지 확인한다.
15. preview toolbar 버튼 hover title이 Firefox처럼 표시되는지 확인한다. Copy는 `⌘C`/`Ctrl+C`, Save는 `⌘S`/`Ctrl+S`, Cancel은 `esc`/`Esc`가 포함되어야 한다.
16. preview에서 `Command+C`/`Ctrl+C`로 Copy, `Command+S`/`Ctrl+S`로 Save가 실행되는지 확인한다.
17. preview 이미지 영역을 스크롤할 때 modal 뒤의 원본 페이지가 함께 스크롤되지 않는지 확인한다.
18. preview에서 `Save`를 눌러 PNG를 저장한다.
19. 저장 PNG에 `Full page top marker`, `Middle seam marker`, `Horizontal overflow marker`, `Bottom partial tile marker`가 포함되는지 확인한다.
20. 저장 PNG에 crop overlay, resize handles, action box가 포함되지 않는지 확인한다.
21. fixed/sticky 요소가 tile마다 과도하게 반복되지 않는지 확인한다.
22. Save 후 원래 scroll position으로 돌아오는지 확인한다.
23. 다시 overlay를 열고 `전체 페이지 선택 -> preview -> Copy`를 실행한 뒤 이미지 paste가 가능한지 확인한다.
24. 일반 요소 선택 Copy/Save, iframe button, shadow button 선택이 회귀하지 않았는지 확인한다.
25. overlay를 다시 열고 `보이는 영역 선택`을 클릭했을 때 full page와 같은 preview modal이 열리는지 확인한다.
26. visible preview가 내부 스크롤 없이 한 화면에 맞춰지고 modal 위치가 과도하게 낮지 않은지 확인한다.
27. visible/full page preview의 modal 크기가 동일하고 Save button 오른쪽 끝이 image 오른쪽 끝과 맞는지 확인한다.
28. visible preview에서 Copy/Save 및 `Command+C`/`Command+S` 또는 `Ctrl+C`/`Ctrl+S`가 동작하는지 확인한다.
29. 일반 선택 박스, 드래그 선택 박스, visible preview, full page preview에서 Copy/Save를 눌렀을 때 닫히기 직전 선택 박스나 toolbar가 한 번 깜빡이지 않는지 확인한다.

## 검증 한계와 잔여 위험

- 에이전트가 실제 Chrome 확장 UI를 직접 조작하는 visual smoke는 제한적이어서, 최종 UI smoke는 작업지시자 직접 검증 결과를 근거로 반영했다.
- fixed/sticky 보정은 Firefox `drawSnapshot()`과 동일한 privileged rendering이 아니다. 첫 tile에는 page chrome을 포함하고, 이후 tile에서는 viewport에 보이는 fixed/sticky 요소를 capture 직전에 숨겨 반복을 줄인다.
- capture 중 lazy loading, animation, layout shift가 발생하는 실제 웹 페이지에서는 tile 간 내용 차이가 남을 수 있다.
- cross-origin iframe 내부 full page stitching, iframe document full page capture, closed shadow 내부 capture는 이번 범위가 아니다.

## PR 요약 후보

- Add full page tile planning, capture loop, and stitching helpers.
- Enable `전체 페이지 선택` and route full page Copy/Save through a Firefox-style preview dialog with top toolbar actions.
- Preserve overlay hiding, scroll restoration, and MVP permission boundaries.
- Add fixture and regression coverage for partial bottom tiles, horizontal overflow, sticky/fixed page chrome, and stitch edge alignment.
- Update README and Phase 6 quality matrix with full page support state and smoke checklist.

## 작업지시자 승인 요청

- 작업지시자가 2026-06-01 수동 smoke 통과를 확인했고 PR 생성을 요청했다.
- 본 보고서와 수용 기준 검증 결과를 기준으로 `publish/task15` 브랜치를 게시하고 `devel` 대상 PR을 생성한다.
