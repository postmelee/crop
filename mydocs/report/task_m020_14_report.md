# Task #14 최종 보고서

GitHub Issue: [#14](https://github.com/postmelee/crop/issues/14)
마일스톤: M020

## 작업 요약

- 대상 이슈: #14
- 마일스톤: M020
- 단계 수: 5
- 작업 목적: Chrome MV3 권한 범위 안에서 same-origin/srcdoc iframe 내부 요소 선택을 지원하고, cross-origin iframe과 closed shadow DOM 제한을 안전하게 문서화하며, 저장 PNG crop 좌표를 Firefox식 pixel snapping으로 보정한다.

## 변경 파일 목록과 영향 범위

| 경로 | 변경 요약 | 영향 범위 |
|---|---|---|
| `src/firefox-derived/overlay-helpers.ts` | iframe 접근 가능 여부 helper, iframe viewport 좌표 projection, same-origin iframe recursive hit-test, fallback guard를 추가했다. | DOM hit-test helper |
| `src/content/overlay/crop-overlay.ts` | `HitTestResult.rect`를 parent viewport rect로 우선 사용해 page rect로 변환한다. | overlay hover/click selection |
| `src/shared/crop-image.ts` | `captureVisibleTab()` 결과 crop source edge를 Firefox식 nearest pixel snapping으로 보정했다. | Copy/Save PNG crop 좌표 |
| `tests/firefox-derived/dom-fixtures.ts` | iframe contentDocument/contentWindow, client offset, inaccessible iframe mock을 지원한다. | 단위 테스트 fixture |
| `tests/firefox-derived/overlay-helpers.test.ts` | same-origin iframe, nested iframe, inaccessible fallback, open shadow 조합 테스트를 추가했다. | iframe/shadow 회귀 테스트 |
| `tests/shared/crop-image.test.ts` | fractional element rect source pixel snapping 회귀 테스트를 추가했다. | crop 좌표 회귀 테스트 |
| `tests/content/overlay/phase6-regression.test.ts` | overlay runtime의 iframe rect 우선 경로, fixture iframe smoke target, fractional crop edge snapping을 검증한다. | 통합 회귀 테스트 |
| `tests/fixtures/phase6_edge_cases.html` | iframe smoke 문구를 same-origin 내부 선택 기준으로 갱신했다. | 수동 smoke fixture |
| `README.md` | #14 개발 상태, same-origin iframe 지원, cross-origin/closed shadow 제한을 갱신했다. | 기여자/로컬 실행 문서 |
| `mydocs/tech/task_m020_8_quality_matrix.md` | P6-10/P6-24/P6-25와 #14 갱신 결과를 정리했다. | 내부 품질 기준 |
| `mydocs/working/task_m020_14_stage{1..5}.md` | 단계별 결과와 검증 근거를 기록했다. | 내부 작업 기록 |
| `mydocs/orders/20260531.md` | 오늘할일 상태를 Stage 5 완료 후 승인 대기로 갱신했다. | Hyper-Waterfall 추적 |

## 문서 위치 검증

| 파일 | 계획된 위치 | 실제 위치 | 결과 | 근거 |
|---|---|---|---|---|
| `README.md` | 루트 `README.md` | `README.md` | OK | 수행계획서의 문서 위치 판단과 일치 |
| `mydocs/tech/task_m020_8_quality_matrix.md` | `mydocs/tech/` | `mydocs/tech/task_m020_8_quality_matrix.md` | OK | 수행계획서의 품질 매트릭스 위치와 일치 |
| `mydocs/working/task_m020_14_stage{N}.md` | `mydocs/working/` | `mydocs/working/task_m020_14_stage{1..5}.md` | OK | 단계 보고서 표준 위치와 일치 |
| `mydocs/report/task_m020_14_report.md` | `mydocs/report/` | `mydocs/report/task_m020_14_report.md` | OK | 최종 보고서 표준 위치와 일치 |

## 변경 전·후 정량 비교

| 지표 | 변경 전 | 변경 후 |
|---|---|---|
| 전체 테스트 수 | 154개 | 163개 |
| iframe helper 회귀 테스트 수 | 5개 | 11개 |
| Phase 6 regression 테스트 수 | 13개 | 15개 |
| crop-image 회귀 테스트 수 | 9개 | 10개 |
| Chrome MV3 `debugger` 권한 | 없음 | 없음 |
| Chrome MV3 `<all_urls>` host 권한 | 없음 | 없음 |

## 검증 결과

| 수용 기준 | 결과 |
|---|---|
| same-origin/srcdoc iframe 내부 요소는 parent page 좌표로 선택된다. | OK — same-origin iframe target, nested iframe, iframe 내부 open shadow root 테스트 통과 |
| iframe 내부 target 클릭 selection 이후 Copy/Save 대상 rectangle은 visible viewport intersection 정책을 유지한다. | OK — overlay runtime이 `HitTestResult.rect`를 page rect로 변환하고 기존 crop geometry 테스트 통과 |
| shadow/iframe target 저장 PNG의 fractional source edge는 Firefox식 nearest pixel snapping을 사용한다. | OK — `getSourceCropRect()`가 `Math.round(edge * scale)`로 source pixel edge를 정수화하고 shadow button fractional rect 테스트 통과 |
| cross-origin iframe은 예외 없이 fallback 또는 제한으로 처리된다. | OK — inaccessible iframe fallback과 nested inaccessible iframe fallback 테스트 통과 |
| open shadow root hit-test는 기존 deepest open shadow element 선택 동작을 유지한다. | OK — 기존 nested open shadow 테스트와 iframe/shadow 조합 테스트 통과 |
| closed shadow DOM 내부 선택은 제한으로 남는다. | OK — README와 품질 매트릭스에 제한으로 문서화 |
| `debugger`, `<all_urls>` 권한이 추가되지 않는다. | OK — manifest 회귀 테스트와 grep 검증 통과 |

### 단계별 검증 결과

- Stage 1: [task_m020_14_stage1.md](../working/task_m020_14_stage1.md) — iframe 좌표 계약과 fixture double 확정, `npm run typecheck`, `npm run test` 통과.
- Stage 2: [task_m020_14_stage2.md](../working/task_m020_14_stage2.md) — same-origin iframe traversal과 overlay rect 연결, `npm run build`, `npm run typecheck`, `npm run test` 통과.
- Stage 3: [task_m020_14_stage3.md](../working/task_m020_14_stage3.md) — inaccessible fallback과 nested/open-shadow 회귀 정리, `npm run build`, `npm run typecheck`, `npm run test` 통과.
- Stage 4: [task_m020_14_stage4.md](../working/task_m020_14_stage4.md) — fixture/docs/final report 정리, `npm run build`, `npm run typecheck`, `npm run test`, browser fixture smoke 통과.
- Stage 5: [task_m020_14_stage5.md](../working/task_m020_14_stage5.md) — smoke 후속 capture pixel snapping 보정, targeted test, `npm run build`, `npm run typecheck`, `npm run test` 통과.

## 잔여 위험과 후속 작업

### 잔여 위험

- cross-origin iframe 내부 DOM 선택은 Chrome MV3 content script 보안 경계 때문에 지원하지 않는다. 이번 task는 inaccessible iframe fallback과 문서화로 제한을 고정했다.
- closed shadow DOM 내부 선택은 지원하지 않는다.
- 실제 Copy/Save 결과는 기존 정책대로 visible viewport intersection만 저장하며, source edge는 Firefox식 nearest pixel snapping으로 정수화한다.

### 후속 작업 후보

- [#15](https://github.com/postmelee/crop/issues/15) full page capture와 scroll stitching.
- 실제 대표 웹 페이지에서 cross-origin iframe boundary fallback 수동 smoke를 추가로 수행할 수 있다.

## 작업지시자 승인 요청

- 최종 보고서와 Stage 5 수용 기준 검증 결과를 승인하면 PR 게시 절차로 진행한다.
