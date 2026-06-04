# Task #8 Phase 6 품질 매트릭스

GitHub Issue: [#8](https://github.com/postmelee/crop/issues/8)  
구현계획서: [`task_m020_8_impl.md`](../plans/task_m020_8_impl.md)  
Fixture: [`phase6_edge_cases.html`](../../tests/fixtures/phase6_edge_cases.html)

## 목적

Phase 6에서 MVP 품질과 edge case를 같은 기준으로 반복 확인하기 위한 작업 기록이다. Stage 1에서는 검사 대상, 기대 동작, 상태 분류, 후속 분류 기준만 만든다. 실제 Chrome smoke 결과는 Stage 3에서 채운다.

## 상태 값

| 상태 | 의미 |
|---|---|
| 대기 | 아직 수동 또는 자동 검증 전 |
| OK | 기대 동작과 일치 |
| MISS | 이번 task에서 고쳐야 할 결함 후보 |
| 제한 | MVP 범위상 알려진 제한 |
| 후속 | 별도 이슈로 분리할 기능 또는 큰 결함 |

## 후속 분류 기준

| 분류 | 의미 |
|---|---|
| 이번 task | Task #8 범위에서 문구, 테스트, 저위험 보정으로 처리 |
| MVP 제한 | README 또는 보고서에 제한으로 명시 |
| 기존 후속 | 기존 follow-up 이슈로 연결 |
| 신규 후속 | 작업지시자 승인 후 새 GitHub Issue 등록 |

## 환경 기록

| 항목 | 값 |
|---|---|
| OS | macOS, 작업지시자 Chrome 수동 smoke |
| Chrome 버전 | 작업지시자 수동 smoke 통과, 버전 미기록 |
| 확장 로드 경로 | `dist/` |
| Fixture URL | `http://127.0.0.1:8765/phase6_edge_cases.html` |
| 화면 배율 / DPR | 현재 작업지시자 환경 기준 통과, 세부 DPR 미기록 |
| 브라우저 zoom | 80%, 100%, 125%, 150% |
| HiDPI 확인 | 현재 macOS/Chrome 화면 기준 수동 smoke 통과 |
| 비HiDPI 확인 | 미확인 |
| Windows / Linux 확인 | 제한: 현재 macOS 로컬 환경에서는 직접 확인 전 |

## 대상별 품질 매트릭스

| ID | 대상 | Fixture selector | 조건 | 예상 동작 | 실제 결과 | 상태 | 후속 분류 | 근거 |
|---|---|---|---|---|---|---|---|---|
| P6-01 | 일반 문서 heading | `[data-crop-fixture="document-heading"]` | zoom 100% | hover outline과 click selection이 heading의 visual rect에 맞는다. | 수동 OK | OK | 해당 없음 | 작업지시자 Stage 3 smoke |
| P6-02 | 일반 문서 section | `[data-crop-fixture="document-section"]` | zoom 80/100/125/150% | 브라우저 zoom 변경 후에도 hover와 선택 좌표가 어긋나지 않는다. | 수동 OK | OK | 해당 없음 | 작업지시자 Stage 3 smoke |
| P6-03 | 카드 UI | `[data-crop-fixture="card-primary"]` | 인접 카드 포함 | 선택 영역이 형제 카드로 새지 않는다. | 수동 OK | OK | 해당 없음 | 작업지시자 Stage 3 smoke |
| P6-04 | 중첩 버튼 | `[data-crop-fixture="nested-card-button"]` | 카드 내부 버튼 hover | 버튼과 카드 중 사용자가 가리킨 요소가 일관되게 강조된다. | 수동 OK | OK | 해당 없음 | 작업지시자 Stage 3 smoke |
| P6-05 | 버튼/아이콘 밀집 영역 | `[data-crop-fixture="button-icon-section"]` | 작은 target 연속 hover | hover highlight가 작은 버튼 사이에서 잔상 없이 이동한다. | 수동 OK | OK | 해당 없음 | 작업지시자 Stage 3 smoke |
| P6-06 | code block | `[data-crop-fixture="code-block"]` | 가로 overflow 포함 | code block의 visible rect 기준으로 선택된다. | 수동 OK | OK | 해당 없음 | 작업지시자 Stage 3 smoke |
| P6-07 | 긴 table | `[data-crop-fixture="long-table"]` | 여러 row 포함 | table 전체 또는 cell hover가 예측 가능한 rect로 표시된다. | 수동 OK | OK | 해당 없음 | 작업지시자 Stage 3 smoke |
| P6-08 | sticky header | `[data-crop-fixture="sticky-header"]` | 스크롤 후 hover | sticky 위치의 현재 viewport 좌표에 맞춰 outline이 따라온다. | 수동 OK | OK | 해당 없음 | 작업지시자 Stage 3 smoke |
| P6-09 | transform/scale 요소 | `[data-crop-fixture="transform-scale-target"]` | CSS transform 적용 | 브라우저가 반환한 visual bounding rect 기준으로 선택된다. | 자동+수동 OK | OK | 해당 없음 | `phase6-regression.test.ts`, 작업지시자 Stage 3 smoke |
| P6-10 | same-document iframe | `[data-crop-fixture="same-document-iframe"]` | iframe 내부 hover | same-origin/srcdoc iframe 내부 요소가 parent viewport 좌표로 선택된다. | 자동 OK: #14 iframe traversal 테스트, Stage 4 fixture smoke 후보 | OK | 해당 없음 | `overlay-helpers.test.ts`, Stage 4 smoke |
| P6-11 | open shadow host | `[data-crop-fixture="open-shadow-host"]` | host hover | host 경계 선택이 안정적으로 동작한다. | 수동 OK | OK | 해당 없음 | 작업지시자 Stage 3 smoke |
| P6-12 | open shadow 내부 panel | `[data-crop-fixture="open-shadow-panel"]` | open shadow DOM | composed path 기반으로 내부 요소 rect가 잡히는지 확인한다. | 자동+수동 OK | OK | 해당 없음 | `phase6-regression.test.ts`, 작업지시자 Stage 3 smoke |
| P6-13 | viewport 밖 큰 요소 | `[data-crop-fixture="offscreen-large-element"]` | 우측 viewport 밖 확장, 첫 hit 후보가 Firefox max detect threshold보다 큼 | Firefox처럼 oversized initial element는 자동 추천하지 않고, clipped viewport-sized fallback 선택 박스를 만들지 않는다. | #26 Stage 6 자동 보정 / 수동 smoke 후보 | OK | 해당 없음 | `overlay-helpers.test.ts`, `phase6-regression.test.ts`, #26 |
| P6-14 | scroll tail | `[data-crop-fixture="scroll-tail"]` | 하단 스크롤 후 hover | 스크롤 위치가 반영되어 outline이 target에 맞는다. | 수동 OK | OK | 해당 없음 | 작업지시자 Stage 3 smoke |
| P6-15 | Copy 액션 | 선택 완료 후 `Copy` | zoom 100% | overlay/prompt/buttons/toast가 결과 이미지에 포함되지 않고 clipboard paste가 가능하다. | 수동 OK | OK | 해당 없음 | 작업지시자 Stage 3 smoke |
| P6-16 | Save 액션 | 선택 완료 후 `Save` | zoom 100% | overlay/prompt/buttons/toast가 결과 이미지에 포함되지 않고 PNG 다운로드가 시작된다. | 수동 OK | OK | 해당 없음 | 작업지시자 Stage 3 smoke |
| P6-17 | overlay 오염 방지 | Copy/Save 결과 | selected 상태 | crop overlay, prompt, action bar, toast가 최종 PNG에 포함되지 않는다. | 수동 OK | OK | 해당 없음 | 작업지시자 Stage 3 smoke |
| P6-18 | zoom 80% | 대표 카드 + Copy/Save | Chrome zoom 80% | 선택 rect와 저장 이미지가 동일한 visible 영역을 가리킨다. | 자동+수동 OK | OK | 해당 없음 | `crop-image.test.ts`, 작업지시자 Stage 3 smoke |
| P6-19 | zoom 100% | 대표 카드 + Copy/Save | Chrome zoom 100% | 기준 zoom에서 hover, selection, Copy, Save가 통과한다. | 자동+수동 OK | OK | 해당 없음 | `crop-image.test.ts`, 작업지시자 Stage 3 smoke |
| P6-20 | zoom 125% | 대표 카드 + Copy/Save | Chrome zoom 125% | 확대 상태에서도 source crop rect가 어긋나지 않는다. | 자동+수동 OK | OK | 해당 없음 | `crop-image.test.ts`, `phase6-regression.test.ts`, 작업지시자 Stage 3 smoke |
| P6-21 | zoom 150% | 대표 카드 + Copy/Save | Chrome zoom 150% | 큰 zoom에서도 action bar가 viewport 안에 배치되고 저장 결과가 맞다. | 자동+수동 OK | OK | 해당 없음 | `crop-image.test.ts`, 작업지시자 Stage 3 smoke |
| P6-22 | HiDPI | 대표 카드 + Copy/Save | Retina / devicePixelRatio > 1 | clipboard/download 이미지가 선택 영역과 같은 픽셀 비율로 잘린다. | 수동 OK: 현재 macOS/Chrome 화면 기준 | OK | 해당 없음 | 작업지시자 Stage 3 smoke |
| P6-23 | 비HiDPI | 대표 카드 + Copy/Save | devicePixelRatio = 1 | 가능한 환경이면 결과를 확인하고, 없으면 미확인 제한으로 기록한다. | 미확인: 현재 환경 없음 | 제한 | MVP 제한 후보 | Stage 3 환경 한계 |
| P6-24 | cross-origin iframe 후보 | 실제 웹 대표 페이지 | 외부 iframe 존재 시 | Chrome MV3 권한 경계상 내부 DOM 접근 없이 iframe boundary fallback 또는 제한으로 처리한다. | 자동 OK: inaccessible iframe fallback 테스트, 실제 대표 페이지 smoke는 수동 후보 | 제한 | 보안 경계 | `overlay-helpers.test.ts`, Stage 4 문서화 |
| P6-25 | closed shadow DOM 후보 | 실제 웹 대표 페이지 | closed shadow 존재 시 | closed shadow 내부는 접근하지 않고 제한으로 기록한다. | 문서화 OK: README 제한 문구 | 제한 | 보안 경계 | Stage 4 문서화 |
| P6-26 | 역방향 드래그 선택 | fixture 일반 영역 | 포인터가 시작점보다 위/왼쪽으로 이동 | 선택 rect가 좌상단-우하단 좌표로 정규화된다. | 자동+수동 OK, 단 drag flicker는 P6-27로 분리 | OK | 해당 없음 | `state-machine.test.ts`, 작업지시자 Stage 3 smoke |
| P6-27 | drag selection flicker | fixture 일반 영역 | 드래그 선택 중 | 선택 중 불필요한 흰색 가로선이 반짝이지 않는다. | Stage 4 CSS 보정 후 작업지시자 수동 재확인 OK | OK | 해당 없음 | 작업지시자 Stage 3/5 smoke, `crop-overlay.css` |
| P6-28 | Firefox식 선택 후 편집 UI parity | 실제 웹 대표 페이지 | 요소 클릭 후 selected 상태 | resize handle, 점선 표시, 이미지 사이즈 badge, Firefox식 Copy/Save 버튼을 제공한다. | 현재 MVP 미구현, 일부는 #13과 연결, size badge/button parity는 신규 후속 후보 | 후속 | 기존 후속 + 신규 후속 후보 | 작업지시자 첨부 이미지, #13 |
| P6-29 | full page mode 진입 | `[data-crop-fixture="full-page-capture-section"]` | `전체 페이지 선택` 클릭 | Firefox처럼 거대한 selected rectangle을 만들지 않고 full page capture preview가 표시된다. | 자동+수동 OK | OK | 해당 없음 | #15 Stage 5 regression, 작업지시자 smoke |
| P6-29a | visible viewport mode 진입 | 현재 visible viewport | `보이는 영역 선택` 클릭 | Firefox처럼 같은 preview modal에 visible viewport capture가 표시된다. | 자동+수동 OK | OK | 해당 없음 | #15 Stage 5 regression, 작업지시자 smoke |
| P6-29b | visible preview no-scroll와 backdrop target | visible preview modal | `보이는 영역 선택` 클릭 후 preview | preview dialog가 상단에 가깝게 표시되고 화면을 과도하게 채우지 않아 모달 밖 backdrop click 영역을 남기며, visible viewport 이미지는 내부 스크롤 없이 맞춰진다. 이미지 아래 내부 여백은 양옆 inline padding과 같은 기준으로 보인다. | 자동 OK / 수동 smoke 후보 | OK | 해당 없음 | #15 Stage 5 regression, #39 Stage 2/4 regression |
| P6-29c | preview toolbar/image right alignment | visible/full page preview modal | preview 표시 | Save button 오른쪽 끝과 image 오른쪽 끝이 같은 shared inline padding 기준으로 정렬된다. | 자동 OK / 수동 smoke 후보 | OK | 해당 없음 | #15 Stage 5 regression, #39 Stage 2 regression |
| P6-29d | preview backdrop dismiss | visible/full page preview modal | preview 표시 후 모달 밖 어두운 backdrop 직접 클릭 | preview backdrop 직접 클릭은 `Esc`/Cancel과 같은 cleanup 경로로 overlay를 제거하고, dialog 내부 click과 Copy/Save/Retry/Cancel action은 dismiss와 충돌하지 않는다. | 자동 OK / 수동 smoke 후보 | OK | 해당 없음 | #39 Stage 1 regression |
| P6-30 | full page stitching top/mid/bottom | `[data-crop-fixture="full-page-top-marker"]`, `[data-crop-fixture="full-page-mid-seam-marker"]`, `[data-crop-fixture="full-page-bottom-marker"]` | full page Save | 저장 PNG에 상단, 중간 seam marker, 하단 partial tile marker가 포함된다. | 자동+수동 OK | OK | 해당 없음 | `phase6-regression.test.ts`, `stitch-image.test.ts`, 작업지시자 PNG smoke |
| P6-31 | full page horizontal overflow | `[data-crop-fixture="full-page-horizontal-overflow"]` | full page Save | 오른쪽으로 확장된 horizontal marker가 stitched PNG에 포함된다. | 자동+수동 OK | OK | 해당 없음 | `full-page-capture.test.ts`, 작업지시자 PNG smoke |
| P6-32 | fixed/sticky 반복 노출 정책 | `[data-crop-fixture="sticky-header"]`, `[data-crop-fixture="full-page-fixed-marker"]` | full page Save | 첫 tile 이후 viewport에 보이는 fixed/sticky page chrome 반복 노출을 capture 직전 숨김으로 줄인다. Firefox `drawSnapshot()`과 pixel-perfect parity는 아니다. | 자동+수동 OK / 제한 문서화 | OK | 제한 문서화 | `phase6-regression.test.ts`, README, 작업지시자 smoke |
| P6-33 | full page scroll restoration | fixture 임의 scroll 위치 | full page Copy/Save 후 | capture 시작 전 scroll position으로 돌아온다. | 자동+수동 OK | OK | 해당 없음 | `full-page-capture.test.ts`, 작업지시자 smoke |
| P6-34 | full page overlay 오염 방지 | full page preview Copy/Save 결과 | preview visible 상태 | crop overlay, preview, handles, action box, scrollbar가 저장 PNG에 포함되지 않는다. | 자동+수동 OK | OK | 해당 없음 | #15 Stage 5 regression, 작업지시자 PNG smoke |
| P6-35 | full page preview toolbar parity | full page preview toolbar | hover 및 keydown | Retry icon이 Firefox reload icon 크기와 맞고, Copy/Save/Cancel tooltip shortcut 및 Copy/Save shortcut 동작이 맞는다. | 자동+수동 OK | OK | 해당 없음 | #15 Stage 5 regression, 작업지시자 smoke |
| P6-36 | Copy/Save 종료 flicker | selected/drag/visible/full page capture | Copy 또는 Save 직후 | 닫히기 직전 선택 박스가 재노출되거나 preview toolbar가 disabled opacity로 깜빡이지 않는다. | 자동+수동 OK | OK | 해당 없음 | #15 Stage 5 regression, 작업지시자 smoke |
| P6-37 | 너무 큰 wrapper 자동 추천 제외 | `[data-crop-fixture="too-large-wrapper"]` | wrapper 빈 영역 hover | `MAX_DETECT_WIDTH`/`MAX_DETECT_HEIGHT`를 초과하는 wrapper는 viewport/maxDetect 크기로 잘린 자동 선택 후보를 만들지 않고 hover state를 초기화한다. | 자동 OK | OK | 해당 없음 | #24 Stage 1/2 regression, `overlay-helpers.test.ts`, `phase6-regression.test.ts` |
| P6-38 | 큰 wrapper 내부 실제 요소 선택 유지 | `[data-crop-fixture="too-large-wrapper-infobox"]`, `[data-crop-fixture="too-large-wrapper-card"]` | wrapper 내부 table/card hover | 큰 wrapper 내부의 infobox/table/card는 자동 선택 후보로 계속 유지된다. | 자동 OK, 수동 smoke 후보 | OK | 해당 없음 | #24 Stage 1/2 regression, `overlay-helpers.test.ts`, `phase6-regression.test.ts`, `phase6_edge_cases.html` |
| P6-39 | selected scroll capture 전체 rect 저장 | `[data-crop-fixture="selected-scroll-capture-target"]` | 선택 후 스크롤로 rect 일부가 viewport 밖에 있고 sticky header가 선택 영역 위에 겹친 상태에서 Save/Copy | 저장 PNG 크기가 선택 박스 CSS 크기 x DPR과 일치하고 offscreen 부분이 현재 viewport 교집합으로 잘리지 않는다. 선택 박스 밖 sticky/fixed page chrome도 포함되지 않는다. | #26 Stage 5 자동 보정 / 수동 smoke 후보 | OK | 해당 없음 | `full-page-capture.test.ts`, `phase6-regression.test.ts`, Task #26 |
| P6-40 | full page oversized downscale fallback | `[data-crop-fixture="full-page-capture-section"]` 또는 실제 긴 문서 | 전체 페이지 stitched output이 `MAX_CAPTURE_DIMENSION`/`MAX_CAPTURE_AREA`를 넘는 조건 | 전체 페이지 캡처가 계획 단계에서 실패하지 않고, stitching 단계에서 종횡비 유지 downscale을 적용해 단일 PNG를 만든다. 출력 pixel dimension은 max canvas 제한 이하이며 overlay/preview/action UI가 포함되지 않는다. | #35 Stage 1/2 자동 보정 / 수동 smoke 후보 | OK | 해당 없음 | `stitch-image.test.ts`, `full-page-capture.test.ts`, `phase6-regression.test.ts`, Task #35 |

## 수동 smoke 절차 초안

1. `npm run build` 후 Chrome `chrome://extensions`에서 `dist/`를 reload한다.
2. Fixture를 로컬 파일 또는 정적 서버로 연다. #15 기준 로컬 서버 URL은 `http://127.0.0.1:5176/tests/fixtures/phase6_edge_cases.html`이다.
3. 확장 아이콘 또는 `Command+Shift+S`로 crop overlay를 실행한다.
4. 각 `data-crop-fixture` target을 hover, click selection, 박스 외 클릭 복귀, Cancel로 확인한다.
5. 대표 target에서 `Copy` 후 이미지 paste를 확인한다.
6. 대표 target에서 `Save` 후 PNG 다운로드를 확인한다.
7. Chrome zoom 80%, 100%, 125%, 150%에서 대표 target의 Copy/Save를 반복한다.
8. overlay, prompt, action bar, toast가 결과 이미지에 포함되는지 확인한다.
9. `전체 페이지 선택` 후 Firefox식 full page preview가 열리고 이상한 drag selection 상태가 되지 않는지 확인한다.
10. preview에서 `Save`를 눌러 저장 PNG에 top/mid/bottom marker와 horizontal overflow marker가 포함되는지 확인한다.
11. full page Save 후 원래 scroll position으로 돌아오는지 확인한다.
12. 다시 `전체 페이지 선택` 후 preview에서 `Copy`를 눌러 clipboard 이미지 paste가 가능한지 확인한다.
13. preview toolbar hover title에 Copy/Save/Cancel shortcut이 표시되고 `Command+C`/`Command+S` 또는 `Ctrl+C`/`Ctrl+S`가 동작하는지 확인한다.
14. `보이는 영역 선택` 후 Firefox식 preview modal이 열리고 visible viewport Copy/Save가 동작하는지 확인한다.
15. visible preview가 내부 스크롤 없이 한 화면에 맞춰지고 modal 위치가 과도하게 낮지 않으며, 모달 밖 어두운 backdrop 영역이 클릭 가능하게 남고 이미지 아래 padding이 양옆 padding과 같은 기준으로 보이는지 확인한다.
16. visible/full page preview의 modal 크기가 동일하고 Save button 오른쪽 끝이 image 오른쪽 끝과 같은 inline padding 기준으로 맞는지 확인한다.
17. visible/full page preview에서 dialog 내부를 클릭해도 닫히지 않고, 모달 밖 어두운 backdrop 직접 클릭은 preview와 overlay를 함께 닫는지 확인한다.
18. preview Copy/Save/Retry/Cancel button과 `Command+C`/`Command+S` 또는 `Ctrl+C`/`Ctrl+S`, `Esc`가 backdrop dismiss와 충돌하지 않는지 확인한다.
19. selected/drag/visible/full page 각 모드에서 Copy/Save 직후 선택 박스나 preview toolbar가 깜빡이지 않는지 확인한다.
20. `[data-crop-fixture="selected-scroll-capture-target"]` 전체 panel을 선택하고 표시 크기 `1520 x 920`을 기록한다.
21. 선택 상태를 유지한 채 스크롤해 sticky header가 선택 영역 위쪽과 겹치도록 만든 뒤 `Save`를 실행한다.
22. 저장 PNG 크기가 DPR 2 환경에서는 `3040 x 1840`처럼 선택 CSS 크기 x DPR과 일치하는지 확인한다.
23. 저장 PNG에 top/bottom marker가 모두 포함되고 crop overlay, handles, action buttons, 선택 박스 밖 sticky header가 포함되지 않는지 확인한다.
24. selected scroll Save 후 시작 scroll position으로 복구되는지 확인한다.
25. `[data-crop-fixture="offscreen-large-element"]`의 빈 큰 영역을 hover/click해도 자동 추천 박스가 생성되지 않는지 확인한다.
26. `too-large-wrapper`의 빈 wrapper 영역을 hover해 큰 선택 박스가 생기지 않는지 확인한다.
27. 같은 영역의 `too-large-wrapper-infobox`, `too-large-wrapper-card`를 hover해 내부 table/card가 정상 선택되는지 확인한다.
28. 매우 긴 실제 문서 또는 oversized test page에서 `전체 페이지 선택`을 실행한다.
29. preview 또는 Save 결과가 단일 PNG로 생성되고 Chrome 확장 오류 페이지에 `maximum canvas size` 오류가 남지 않는지 확인한다.
30. 저장 PNG의 pixel dimension이 `MAX_CAPTURE_DIMENSION`과 `MAX_CAPTURE_AREA` 한도 아래인지 확인한다.
31. downscale 때문에 원본 DPR 해상도보다 낮아질 수 있음을 기록하고, overlay/preview/action UI가 결과에 포함되지 않는지 확인한다.

## Stage별 갱신 계획

| Stage | 갱신 내용 |
|---|---|
| Stage 1 | 본 matrix 구조와 fixture selector 확정 |
| Stage 2 | 자동 테스트로 확인한 항목의 근거 보강 |
| Stage 3 | Chrome manual smoke 실제 결과와 상태 갱신 |
| Stage 4 | MISS/제한/후속 항목 분류와 README 후보 문구 반영 |
| Stage 5 | 최종 수용 기준 결과와 PR 요약에 사용할 링크 정리 |

## Stage 2 자동 검증 결과

| 항목 | 결과 | 근거 |
|---|---|---|
| viewport 밖 page selection의 visible clipping과 screenshot source mapping | OK | `tests/content/overlay/phase6-regression.test.ts` |
| zoom-like screenshot natural size와 CSS viewport 비율 mapping | OK | `tests/shared/crop-image.test.ts`, `tests/content/overlay/phase6-regression.test.ts` |
| transform/scale 요소의 visual bounding rect 사용 | OK | `tests/content/overlay/phase6-regression.test.ts` |
| nested open shadow root hit-test traversal | OK | `tests/content/overlay/phase6-regression.test.ts` |
| 역방향 드래그 선택 rect 정규화 | OK | `tests/content/overlay/state-machine.test.ts` |

## Stage 3 수동 smoke 결과

| 항목 | 결과 | 근거 |
|---|---|---|
| fixture 확인 항목 전체 | OK | 작업지시자 2026-05-29 수동 smoke |
| Chrome zoom 80%, 100%, 125%, 150% | OK | 작업지시자 2026-05-29 수동 smoke |
| Copy/Save와 overlay 오염 방지 | OK | 작업지시자 2026-05-29 수동 smoke |
| drag selection 중 흰색 가로선 flicker | OK | Stage 4 CSS 보정 후 작업지시자 2026-05-29 수동 재확인 |
| Firefox식 selected-state resize handle, 점선, size badge, 버튼 parity | 후속 | 현재 Task #8은 Phase 6 품질 검증 범위이므로 신규 후속 후보로 분리 |

## Stage 4 분류 결과

| 항목 | 분류 | 처리 |
|---|---|---|
| P6-27 drag selection 흰색 가로선 flicker | 이번 task 결함 | drag 중 전체 viewport frame이 노출되지 않도록 `.crop-frame`을 dragging 상태에서 숨겼고, Stage 5 수동 재 smoke에서 보정 확인. |
| P6-23 비HiDPI 확인 | 검증 한계 | 현재 환경에서 미확인. README와 최종 보고서에 검증 한계로 기록. |
| P6-24 cross-origin iframe 후보 | 보안 경계 / 제한 유지 | #14에서 inaccessible iframe fallback을 테스트로 고정. `debugger`, `<all_urls>` 없이 내부 DOM 접근은 지원하지 않는다. |
| P6-25 closed shadow DOM 후보 | 보안 경계 / 제한 유지 | Chrome MV3 접근 제약으로 README 제한 문구에 기록. closed shadow 내부 접근은 지원하지 않는다. |
| P6-28 resize/move handles와 keyboard 조정 | 기존 후속 | [#13](https://github.com/postmelee/crop/issues/13) `Follow-up: 선택 영역 resize/move handles와 keyboard 조정 구현`으로 연결. |
| P6-28 size badge와 Copy/Save button parity | 신규 후속 후보 | 새 이슈 생성은 작업지시자 별도 승인 후 진행. |
| edge auto-scroll | 기존 후속 | [#12](https://github.com/postmelee/crop/issues/12) `Follow-up: 드래그 선택 edge auto-scroll 구현`으로 연결. |
| viewport 밖 전체 이미지 저장 / full page | #15 구현 완료 | [#15](https://github.com/postmelee/crop/issues/15)에서 top-level document full page capture와 scroll stitching 구현. iframe 내부 full page와 Firefox `drawSnapshot()` parity는 제한으로 유지. |

## Task #14 갱신 결과

| 항목 | 결과 | 근거 |
|---|---|---|
| same-origin/srcdoc iframe 내부 요소 선택 | OK | `tests/firefox-derived/overlay-helpers.test.ts`, `tests/content/overlay/phase6-regression.test.ts` |
| nested same-origin iframe 좌표 변환 | OK | `tests/firefox-derived/overlay-helpers.test.ts` |
| iframe 내부 open shadow root traversal | OK | `tests/firefox-derived/overlay-helpers.test.ts` |
| open shadow root 내부 same-origin iframe traversal | OK | `tests/firefox-derived/overlay-helpers.test.ts` |
| inaccessible/cross-origin iframe fallback | 제한 유지 / OK | `tests/firefox-derived/overlay-helpers.test.ts` |
| `debugger`, `<all_urls>` 권한 미추가 | OK | `tests/content/overlay/phase6-regression.test.ts`, `manifest.json` |
| Phase 6 srcdoc iframe fixture smoke | OK | in-app browser frame locator smoke, `data-crop-fixture="iframe-card"`와 `iframe-button` 확인 |

## Task #15 갱신 결과

| 항목 | 결과 | 근거 |
|---|---|---|
| full page tile/stitch helper | OK | `tests/content/overlay/full-page-capture.test.ts`, `tests/shared/stitch-image.test.ts` |
| `전체 페이지 선택` UI와 Firefox식 preview 상단 toolbar Copy/Save action pipeline 연결 | OK | `tests/content/overlay/phase6-regression.test.ts` |
| full page fixture marker 보강 | OK | `tests/fixtures/phase6_edge_cases.html`, `phase6-regression.test.ts` |
| bottom partial tile와 horizontal overflow tile plan | OK | `full-page-capture.test.ts` |
| fractional destination edge seam 회귀 | OK | `stitch-image.test.ts` |
| fixed/sticky 반복 노출 최소 보정 | OK / 제한 | 두 번째 tile 이후 viewport에 보이는 fixed/sticky page chrome을 capture 직전에 숨김. Firefox `drawSnapshot()`과 완전 동일하지 않음 |
| full page scroll restoration | 자동+수동 OK | `full-page-capture.test.ts`, 작업지시자 smoke |
| full page preview 내부 스크롤 잠금 | 자동+수동 OK | `crop-overlay.ts`, `crop-overlay.css`, `phase6-regression.test.ts`, 작업지시자 smoke |
| full page Save/Copy 실제 PNG smoke | OK | `http://127.0.0.1:5176/tests/fixtures/phase6_edge_cases.html`에서 작업지시자 직접 검증 |
| `debugger`, `<all_urls>` 권한 미추가 | OK | `manifest.json`, `phase6-regression.test.ts`, Stage 4/5 grep |

## Task #26 갱신 결과

| 항목 | 결과 | 근거 |
|---|---|---|
| selected page rect tile plan | OK | `tests/content/overlay/full-page-capture.test.ts` |
| viewport 밖 selected capture runtime 분기 | OK | `src/content/overlay/crop-overlay.ts`, `tests/content/overlay/phase6-regression.test.ts` |
| oversized initial element auto-select rejection | OK | `src/firefox-derived/overlay-helpers.ts`, `tests/firefox-derived/overlay-helpers.test.ts`, `tests/content/overlay/phase6-regression.test.ts` |
| selected rect capture scroll restoration | OK | `tests/content/overlay/full-page-capture.test.ts` |
| selected scroll capture fixture marker | OK | `tests/fixtures/phase6_edge_cases.html`, `tests/content/overlay/phase6-regression.test.ts` |
| selected scroll capture sticky/fixed page chrome suppression | OK | `src/content/overlay/crop-overlay.ts`, `tests/content/overlay/phase6-regression.test.ts` |
| 실제 PNG dimension smoke | 수동 후보 | `[data-crop-fixture="selected-scroll-capture-target"]`, `data-crop-expected-css-size="1520x920"` |
| `debugger`, `<all_urls>` 권한 미추가 | OK | `manifest.json`, Stage 3/4 grep |

## Task #35 갱신 결과

| 항목 | 결과 | 근거 |
|---|---|---|
| stitch output downscale helper | OK | `src/shared/stitch-image.ts`, `tests/shared/stitch-image.test.ts` |
| dimension/area 초과 output fallback | OK | `getStitchOutputPixelPlan()` dimension/area focused tests |
| oversized full page tile plan preflight 제거 | OK | `src/content/overlay/full-page-capture.ts`, `tests/content/overlay/full-page-capture.test.ts` |
| selected/full page stitch metadata 유지 | OK | `src/content/overlay/crop-overlay.ts`, `tests/content/overlay/phase6-regression.test.ts` |
| 실제 oversized full page PNG smoke | 수동 후보 | P6-40 수동 smoke 절차 |
| `debugger`, `<all_urls>` 권한 미추가 | OK | `manifest.json`, Stage 4 grep 예정 |

## Task #39 갱신 결과

| 항목 | 결과 | 근거 |
|---|---|---|
| preview backdrop 직접 click dismiss | 자동 OK / 수동 후보 | `src/content/overlay/crop-overlay.ts`, `tests/content/overlay/phase6-regression.test.ts` |
| preview dialog 내부 click과 action path 충돌 방지 | 자동 OK / 수동 후보 | action/mode 처리 이후 backdrop 분기, direct `.crop-preview` target helper, `phase6-regression.test.ts` |
| preview dialog backdrop target 유지 | 자동 OK / 수동 후보 | `crop-overlay.css`의 `--crop-preview-backdrop-*` 변수와 dialog max size regression |
| Save button/image shared inline padding 유지 | 자동 OK / 수동 후보 | `--crop-preview-inline-padding`을 surface/footer가 공유하는 CSS regression |
| visible preview 하단 padding 보정 | 자동 OK / 수동 후보 | visible mode dialog `height: auto`, surface bottom `--crop-preview-inline-padding`, backdrop block-end/inline 공유 regression |
| visible preview no-scroll와 full page preview scroll 유지 | 자동 OK / 수동 후보 | visible mode `overflow: hidden`, `object-fit: contain`, full page surface `overflow: auto` regression |
| `debugger`, `<all_urls>` 권한 미추가 | OK | `manifest.json`, `phase6-regression.test.ts`, Task #39 Stage 3 grep |

## Task #24 갱신 결과

| 항목 | 결과 | 근거 |
|---|---|---|
| 너무 큰 wrapper 단독 hover 후보 제외 | 자동 OK | `tests/firefox-derived/overlay-helpers.test.ts`, `tests/content/overlay/phase6-regression.test.ts` |
| 큰 wrapper 후보 없음 시 hover highlight 초기화 | 자동 OK | `tests/content/overlay/phase6-regression.test.ts`, `transitionOverlayState(..., { type: "hover", rect: null })` |
| 큰 wrapper 내부 table/infobox/card 후보 유지 | 자동 OK | `tests/firefox-derived/overlay-helpers.test.ts`, `tests/content/overlay/phase6-regression.test.ts`, `tests/fixtures/phase6_edge_cases.html` |
| Copy/Save rect 기준 회귀 없음 | 자동 OK | `tests/shared/crop-image.test.ts`, `tests/content/overlay/phase6-regression.test.ts` |
| `debugger`, `<all_urls>` 권한 미추가 | OK | `manifest.json`, Stage 3 grep |
| Firefox-derived MPL boundary 유지 | OK | `src/firefox-derived/overlay-helpers.ts` MPL header 유지, Stage 3 source grep |

## 신규 후속 이슈 후보

제목 후보: `Follow-up: Firefox식 selected-state size badge와 action button parity 구현`

범위 후보:

- 요소 클릭 또는 드래그 선택 후 selected 상태에서 이미지 크기 badge를 표시한다.
- Firefox 원본에 가까운 selected-state action toolbar 스타일을 적용한다.
- Copy/Save/Cancel button label, icon, spacing, focus state를 Firefox식 selected UI에 맞춘다.
- #13 resize/move handles와 충돌하지 않도록 handle hit-test 영역과 toolbar 배치를 분리한다.
- Copy/Save capture 결과에는 size badge, handle, action toolbar가 포함되지 않아야 한다.
