# Task #13 최종 보고서

GitHub Issue: [#13](https://github.com/postmelee/crop/issues/13)
마일스톤: M020

## 작업 요약

- 대상 이슈: #13
- 마일스톤: M020
- 단계 수: 5
- 작업 목적: selected 상태에서 8방향 resize handle, 내부 drag move, keyboard move/resize, size badge, Firefox식 action box placement를 구현한다.

## 변경 파일 목록과 영향 범위

| 경로 | 변경 요약 | 영향 범위 |
|---|---|---|
| `src/content/overlay/selection-transform.ts` | selected move/resize helper, pointer hit-test, keyboard adjustment helper 추가 | selected rectangle geometry |
| `src/content/overlay/state-machine.ts` | selected move/resize 상태와 keyboard 조정 이벤트 추가 | overlay 상태 전이 |
| `src/content/overlay/crop-overlay.ts` | selected pointer move/resize, keyboard 조정, action button target 예외, cursor layer용 interactive overlay 판정, size badge 렌더링 연결 | overlay runtime interaction |
| `src/content/overlay/crop-template.ts` | selection controls, 8방향 resize handle, move surface, size badge DOM, cancel/copy/save icon action DOM 추가 | Shadow DOM template |
| `src/content/overlay/crop-overlay.css` | Firefox식 crosshair cursor, resize handle, hover scale animation, centered size badge, action box spacing/shadow/cursor 스타일 추가 | overlay visual/UI |
| `src/content/overlay/positioning.ts` | selection controls, size badge, Firefox식 action box viewport clamp/우하단 placement helper 보강 | viewport positioning |
| `tests/content/overlay/selection-transform.test.ts` | move/resize helper, hit-test, keyboard mapping 테스트 추가 | geometry regression |
| `tests/content/overlay/state-machine.test.ts` | selected adjustment 상태 전이와 keyboard 조정 테스트 추가 | state regression |
| `tests/content/overlay/positioning.test.ts` | controls/action box/size badge placement 테스트 추가 | layout regression |
| `tests/content/overlay/phase6-regression.test.ts` | selected adjustment fixture marker, Firefox식 cursor contract, MVP 권한 회귀 테스트 추가 | Phase 6 regression |
| `tests/fixtures/phase6_edge_cases.html` | selected resize/move/keyboard smoke 전용 target 추가 | 반복 smoke fixture |
| `README.md` | #13 완료 상태와 Chrome unpacked smoke 기대 결과 갱신 | 기여자 로컬 검증 문서 |
| `mydocs/plans/task_m020_13.md` | 수행계획서 작성 | Hyper-Waterfall 계획 |
| `mydocs/plans/task_m020_13_impl.md` | 구현계획서 작성 | Hyper-Waterfall 단계 계획 |
| `mydocs/working/task_m020_13_stage1.md` ~ `task_m020_13_stage4.md` | Stage별 완료 보고서 작성 | 단계 검증 기록 |
| `mydocs/report/task_m020_13_report.md` | 최종 보고서 작성 | PR 전 장기 보관 기록 |
| `mydocs/orders/20260530.md` | 오늘할일 완료 처리 | 작업 보드 |

## 문서 위치 검증

| 파일 | 계획된 위치 | 실제 위치 | 결과 | 근거 |
|---|---|---|---|---|
| `README.md` | 루트 `README.md` | `README.md` | OK | 수행계획서의 문서 위치 판단과 일치하며 로컬 smoke 기대 결과만 좁게 갱신했다. |
| `tests/fixtures/phase6_edge_cases.html` | `tests/fixtures/` | `tests/fixtures/phase6_edge_cases.html` | OK | Stage 5 산출물 계획과 일치하는 반복 smoke fixture다. |
| `task_m020_13.md` | `mydocs/plans/` | `mydocs/plans/task_m020_13.md` | OK | 수행계획서 표준 위치와 일치한다. |
| `task_m020_13_impl.md` | `mydocs/plans/` | `mydocs/plans/task_m020_13_impl.md` | OK | 구현계획서 표준 위치와 일치한다. |
| `task_m020_13_stage{N}.md` | `mydocs/working/` | `mydocs/working/task_m020_13_stage1.md` ~ `stage4.md` | OK | 단계 보고서 표준 위치와 일치한다. |
| `task_m020_13_report.md` | `mydocs/report/` | `mydocs/report/task_m020_13_report.md` | OK | 최종 보고서 표준 위치와 일치한다. |
| 공식 제품 문서 루트 | 생성하지 않음 | 생성하지 않음 | OK | 이번 task는 `docs/`, `specs/`, `site/`, `website/`, `adr/` 루트 생성을 제외했다. |

## 변경 전·후 정량 비교

| 지표 | 변경 전 | 변경 후 |
|---|---|---|
| selected resize handle | 없음 | 8방향 handle DOM/CSS와 pointer resize 연결 |
| selected move | 없음 | selected 내부 move surface와 pointer move 연결 |
| keyboard 조정 | 정책 후보만 있음 | Arrow 1px move, Shift+Arrow 10px move, Alt/Option+Arrow edge resize |
| size badge | 후속 parity 후보 | selected 내부 `width x height` badge 구현 |
| Firefox selected UI parity | 일부 후속 후보 | size badge 중앙 배치, 60px resize handle hit target, 16px circle handle, hover scale animation, 우하단 action box, cancel/copy/save icon buttons 반영 |
| Firefox overlay cursor parity | 브라우저 기본 cursor 노출 | overlay surface `crosshair`, drag selection 중 `grabbing`, toolbar/action 영역 `auto` 반영 |
| Phase 6 selected adjustment fixture | 없음 | `selected-adjustment-*` marker 4개 추가 |
| 전체 자동 테스트 | Task #12 완료 기준 12 files / 98 tests | 13 files / 135 tests |
| Stage 보고서 | 없음 | Stage 1~4 보고서 4개 |

## 검증 결과

| 수용 기준 | 결과 |
|---|---|
| selected 상태에서 모서리/변 edge를 드래그해 영역을 조정할 수 있다 | OK — CDP smoke에서 south-east resize가 `328px x 36px`에서 `368px x 66px`로 갱신됐다. |
| selected highlight 내부를 드래그해 영역을 이동할 수 있다 | OK — CDP smoke에서 selection transform이 `(94, 477.39)`에서 `(124, 497.39)`로 이동했다. |
| click selection 직후에도 Firefox처럼 같은 selected region을 drag로 수정할 수 있다 | OK — fixture target 클릭으로 selected 전환 후 동일 selected region에서 move/resize smoke를 통과했다. |
| selected 영역 밖 클릭은 reset으로 유지되고 resize/move click sequence와 충돌하지 않는다 | OK — CDP smoke에서 outside click 후 state가 `idle`로 돌아왔다. |
| 하단 action box가 Firefox 원본에 가까운 크기, 색, grouping, border radius, shadow, 위치 규칙을 가진다 | OK — 작업지시자 smoke 피드백 후 Firefox upstream `overlay.css`, `ScreenshotsOverlayChild.sys.mjs`를 확인해 cancel/copy/save icon buttons, 우하단 배치, 10px margin 규칙으로 보정했다. |
| action box가 viewport 하단 또는 좌우 경계에서 잘리지 않고 접근 가능한 위치로 flip/clamp 된다 | OK — `positioning.test.ts`의 below/above flip, upper/lower viewport clamp, small viewport clamp 테스트가 통과했다. |
| rectangle size badge가 Firefox처럼 선택 영역 중앙에 표시된다 | OK — Firefox `#selection-size-container` centering 규칙과 `Math.floor(width * zoom)` 산식을 반영했다. |
| rectangle 조정 handle hover 시 커지는 animation이 있다 | OK — Firefox `.mover-target:hover .mover { transform: scale(1.05); }`와 동일한 125ms cubic-bezier transition을 반영했다. |
| overlay 화면 기본 커서가 Firefox처럼 crosshair로 표시된다 | OK — Firefox `#screenshots-component { cursor: crosshair; pointer-events: auto; }` 구조를 확인해 host cursor layer에 반영했고, CDP smoke에서 `initial/hover/selected = crosshair`, `draggingReady/dragging = grabbing`을 확인했다. |
| keyboard 조정 범위가 명확히 동작한다 | OK — 자동 테스트와 CDP smoke에서 Shift+ArrowRight `+10px`, Alt/Option+ArrowDown height `+1px` 조정을 확인했다. |
| action buttons가 선택 영역과 viewport 조건에 따라 접근 가능한 위치에 표시된다 | OK — selected 상태 CDP smoke에서 actions visible, Stage 3/4 positioning 테스트 통과. |
| Copy/Save capture 전 overlay controls가 결과에 포함되지 않도록 숨김 경로가 유지된다 | OK — CDP smoke에서 Save pipeline stub 호출 시 `crop.captureVisibleTab` 직전 host visibility가 `hidden`이었다. |
| `debugger`, `<all_urls>` 권한이 추가되지 않는다 | OK — `phase6-regression.test.ts`와 Stage 5 `rg`에서 권한 경계 유지 확인. |

### 단계별 검증 결과

- Stage 1: [`task_m020_13_stage1.md`](../working/task_m020_13_stage1.md) — selected transform helper와 상태 기준 작성, typecheck/test/grep/diff 통과.
- Stage 2: [`task_m020_13_stage2.md`](../working/task_m020_13_stage2.md) — pointer 기반 move/resize interaction 연결, build/typecheck/test/grep/diff 통과.
- Stage 3: [`task_m020_13_stage3.md`](../working/task_m020_13_stage3.md) — selected controls UI와 action box 보정, build/typecheck/test/selector grep/diff 통과.
- Stage 4: [`task_m020_13_stage4.md`](../working/task_m020_13_stage4.md) — keyboard 조정과 size badge 구현, build/typecheck/test/keyword grep/diff 통과.
- Stage 5: README/fixture/test/최종 보고서/오늘할일 완료 처리와 통합 검증 통과.

### 통합 검증 결과

실행 명령:

```bash
npm run build
npm run typecheck
npm run test
rg "resize|move|keyboard|Copy|Save|Cancel|debugger|<all_urls>|#13" README.md mydocs src tests manifest.json
rg "selection-size|crop-selection-size|crop-resize-handle|crop-action|ACTION_BUTTONS|Firefox|mover|crosshair|grabbing" src tests README.md mydocs/report/task_m020_13_report.md
git diff --check
git status --short
```

결과:

- OK: `npm run build` 통과. `dist/manifest.json`, `dist/background/service-worker.js`, `dist/content/inject.js` 빌드 완료.
- OK: `npm run typecheck` 통과.
- OK: `npm run test` 통과. 13개 test file, 135개 test가 모두 통과했다.
- OK: `rg "resize|move|keyboard|Copy|Save|Cancel|debugger|<all_urls>|#13" ...`에서 README, 구현, 테스트, 계획/보고 문서의 관련 항목을 확인했다.
- OK: Firefox UI parity grep에서 size badge 중앙 배치, handle hover scale, action button placement, crosshair/grabbing cursor, upstream 근거 기록을 확인했다.
- OK: `git diff --check` 경고 없이 통과.
- OK: Headless Chrome CDP smoke 통과. selected click, 8 handles, size badge, selected move, south-east resize, Shift+Arrow move, Alt/Option+Arrow resize, outside reset, Save pipeline overlay hide를 확인했다.
- OK: 작업지시자 smoke 피드백 반영 후 Headless Chrome CDP UI parity smoke 통과. size badge center delta `0px`, action toolbar right delta `0px`, bottom gap `10px`, handle target `60px`, handle dot `16px`, hover transform `matrix(1.05, 0, 0, 1.05, 0, 0)`, action order `cancel/copy/save`를 확인했다.
- OK: cursor parity CDP smoke 통과. host cursor `crosshair`, hover highlight 유지, drag 중 `grabbing`, drag selection 후 selected `70 x 60`, click selection 후 selected `1130 x 260`을 확인했다.

## 잔여 위험과 후속 작업

### 잔여 위험

- Stage 5 CDP smoke는 content script를 fixture page에 직접 주입하고 `chrome.runtime.sendMessage`를 stub 처리했다. 실제 Chrome toolbar action, 시스템 clipboard write, 실제 downloads 동작은 기존 #7/#8 smoke 경로를 유지하며 이번 task에서는 capture 전 overlay hide 경계만 재확인했다.
- Pointer handle 체감 크기와 action box 시각 위치는 OS display scale, browser zoom, 페이지 density에 따라 미세 조정 여지가 있을 수 있으나, Firefox upstream의 60px hit target과 bottom-right placement 산식을 기준값으로 맞췄다.
- Keyboard adjustment는 selected rectangle을 page 좌표 기준으로 이동하므로 selection이 viewport 밖으로 이동할 수 있다. 현재 controls/action box는 visible intersection과 clamp 정책으로 대응한다.

### 후속 작업 후보

- #14 iframe/nested context 내부 선택 고도화
- #15 full page capture와 scroll stitching

## 작업지시자 승인 요청

- 최종 보고서와 수용 기준 검증 결과를 승인하면 PR 게시 절차로 진행한다.
