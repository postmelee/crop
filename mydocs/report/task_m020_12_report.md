# Task #12 최종 보고서

GitHub Issue: [#12](https://github.com/postmelee/crop/issues/12)
마일스톤: M020

## 작업 요약

- 대상 이슈: #12
- 마일스톤: M020
- 단계 수: 5
- 작업 목적: drag selection 중 pointer가 viewport edge 근처에 있을 때 페이지를 자동 스크롤하고, selected rectangle을 page/document 좌표 기준으로 유지한다.

## 변경 파일 목록과 영향 범위

| 경로 | 변경 요약 | 영향 범위 |
|---|---|---|
| `src/content/overlay/edge-scroll.ts` | edge auto-scroll delta 계산 helper와 scroll 후 page point 계산 helper 추가 | drag selection auto-scroll 계산 경계 |
| `src/content/overlay/crop-overlay.ts` | drag 중 마지막 pointer 저장, requestAnimationFrame scroll loop, `window.scrollBy()`, pointerup/remove cleanup 연결 | overlay runtime |
| `src/content/overlay/crop-overlay.css` | `draggingReady`/`dragging` 상태에서 viewport frame 숨김 | drag visual flicker 보정 |
| `tests/content/overlay/edge-scroll.test.ts` | edge delta, threshold boundary, page point 계산 단위 테스트 추가 | auto-scroll regression |
| `tests/content/overlay/state-machine.test.ts` | scroll 후 확장된 drag endpoint의 rect 정규화 검증 | overlay state regression |
| `tests/content/overlay/phase6-regression.test.ts` | edge auto-scroll drag update 회귀 테스트 추가 | Phase 6 regression |
| `tests/fixtures/phase6_edge_cases.html` | vertical/horizontal edge auto-scroll smoke 영역 추가 | manual smoke fixture |
| `README.md` | 개발 상태와 Chrome unpacked smoke 기대 결과에 edge auto-scroll 반영 | 기여자 로컬 실행 문서 |
| `mydocs/plans/task_m020_12.md` | 수행계획서 작성 | Hyper-Waterfall 계획 |
| `mydocs/plans/task_m020_12_impl.md` | 구현계획서 작성 | Hyper-Waterfall 단계 계획 |
| `mydocs/working/task_m020_12_stage1.md` | Stage 1 보고서 | 단계 검증 기록 |
| `mydocs/working/task_m020_12_stage2.md` | Stage 2 보고서 | 단계 검증 기록 |
| `mydocs/working/task_m020_12_stage3.md` | Stage 3 보고서 | 단계 검증 기록 |
| `mydocs/working/task_m020_12_stage4.md` | Stage 4 보고서 | manual smoke와 UX 보정 기록 |
| `mydocs/orders/20260529.md` | 오늘할일 완료 처리 | 작업 추적 |

## 문서 위치 검증

| 파일 | 계획된 위치 | 실제 위치 | 결과 | 근거 |
|---|---|---|---|---|
| `README.md` | 루트 `README.md` | `README.md` | OK | 수행계획서의 문서 위치 판단과 일치하며 Chrome unpacked smoke 기대 결과만 좁게 갱신했다. |
| `task_m020_12.md` | `mydocs/plans/` | `mydocs/plans/task_m020_12.md` | OK | 수행계획서 표준 위치와 일치한다. |
| `task_m020_12_impl.md` | `mydocs/plans/` | `mydocs/plans/task_m020_12_impl.md` | OK | 구현계획서 표준 위치와 일치한다. |
| `task_m020_12_stage{N}.md` | `mydocs/working/` | `mydocs/working/task_m020_12_stage1.md` ~ `stage4.md` | OK | 단계 보고서 표준 위치와 일치한다. |
| `task_m020_12_report.md` | `mydocs/report/` | `mydocs/report/task_m020_12_report.md` | OK | 최종 보고서 표준 위치와 일치한다. |

## 변경 전·후 정량 비교

| 지표 | 변경 전 | 변경 후 |
|---|---|---|
| edge auto-scroll helper | 없음 | `src/content/overlay/edge-scroll.ts` 116줄 |
| edge auto-scroll 단위 테스트 | 없음 | `tests/content/overlay/edge-scroll.test.ts` 160줄, 11 tests |
| Phase 6 fixture edge-scroll smoke 영역 | 없음 | `tests/fixtures/phase6_edge_cases.html` 내 `edge-scroll-section` 추가 |
| 전체 자동 테스트 | 12 files / 94 tests | 12 files / 98 tests |
| 단계 보고서 | 없음 | Stage 1~4 보고서 4개 |

## 검증 결과

| 수용 기준 | 결과 |
|---|---|
| drag selection 중 pointer가 viewport 상/하 edge 근처에 머무르면 vertical auto-scroll이 동작한다 | OK — 작업지시자 Stage 4 manual smoke에서 아래/위 edge auto-scroll 통과 확인 |
| drag selection 중 pointer가 viewport 좌/우 edge 근처에 머무르면 horizontal auto-scroll이 동작한다 | OK — 작업지시자 Stage 4 manual smoke에서 오른쪽/왼쪽 edge auto-scroll 통과 확인 |
| 자동 스크롤 중 selected rectangle이 page 좌표 기준으로 확장된다 | OK — `getEdgeScrollPagePoint()`와 state-machine regression test 통과, Stage 4 manual smoke 통과 |
| pointerup 후 scroll loop가 중단된다 | OK — runtime cleanup 구현 및 작업지시자 Stage 4 manual smoke 통과 |
| Escape/Cancel/overlay remove 시 scroll loop가 남지 않는다 | OK — cleanup 경로 구현 및 작업지시자 Stage 4 manual smoke 통과 |
| 기존 click selection, 일반 drag selection, Copy/Save 흐름이 회귀하지 않는다 | OK — `npm run test` 98 tests 통과, 작업지시자 Stage 4 manual smoke 통과 |
| drag selection 중 흰색 frame flicker가 보정된다 | OK — `draggingReady` 상태에서도 `.crop-frame`을 숨기도록 보정했고, 작업지시자 수정 확인 완료 |
| `debugger`, `<all_urls>` 권한이 추가되지 않는다 | OK — Stage 5 grep에서 README/manifest 경계 확인 |

### 단계별 검증 결과

- Stage 1: [`task_m020_12_stage1.md`](../working/task_m020_12_stage1.md) — edge auto-scroll helper 기준 작성, typecheck/test/grep/diff 통과.
- Stage 2: [`task_m020_12_stage2.md`](../working/task_m020_12_stage2.md) — drag selection scroll loop 구현, build/typecheck/test/grep/diff 통과.
- Stage 3: [`task_m020_12_stage3.md`](../working/task_m020_12_stage3.md) — 회귀 테스트와 fixture/smoke 보강, build/typecheck/test/fixture grep/diff 통과.
- Stage 4: [`task_m020_12_stage4.md`](../working/task_m020_12_stage4.md) — Chrome manual smoke 통과, `draggingReady` flicker CSS 보정, build/typecheck/test/grep/diff 통과.
- Stage 5: README/최종 보고서/오늘할일 완료 처리와 통합 검증 통과.

## 잔여 위험과 후속 작업

### 잔여 위험

- Chrome drag/scroll 타이밍은 OS, display scale, page layout에 따라 체감이 달라질 수 있다. 현재 macOS/Chrome fixture 기준 manual smoke는 통과했다.
- horizontal auto-scroll은 문서 또는 target이 실제 horizontal overflow를 만드는 경우에만 체감된다. 이번 fixture는 해당 조건을 제공한다.
- 이번 task는 visible viewport 캡처 MVP 범위만 유지한다. 선택 outline이 화면 밖까지 이어져도 Copy/Save PNG는 visible viewport 교차 영역만 포함한다.

### 후속 작업 후보

- #13 selection resize/move handles와 keyboard 조정
- #14 iframe/nested context 내부 선택 고도화
- #15 full page capture와 scroll stitching
- Firefox식 selected-state size badge와 Copy/Save button parity

## 작업지시자 승인 요청

- 최종 보고서와 수용 기준 검증 결과를 승인하면 PR 게시 절차로 진행한다.
