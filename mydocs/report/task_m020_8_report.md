# Task #8 최종 보고서

GitHub Issue: [#8](https://github.com/postmelee/crop/issues/8)
마일스톤: M020

## 작업 요약

- 대상 이슈: #8
- 마일스톤: M020
- 단계 수: 5
- 작업 목적: Phase 6 품질/엣지 케이스 검증을 fixture, 자동 테스트, 수동 smoke, MVP 제한 문구, 후속 이슈 후보로 정리한다.

## 변경 파일 목록과 영향 범위

| 경로 | 변경 요약 | 영향 범위 |
|---|---|---|
| `tests/fixtures/phase6_edge_cases.html` | 일반 문서, 카드, 버튼/아이콘, 코드 블록, 긴 표, sticky, transform, iframe, open shadow DOM, viewport 밖 요소 fixture 추가 | 반복 가능한 로컬 smoke |
| `tests/content/overlay/phase6-regression.test.ts` | viewport clipping, zoom-like source rect, transform, open shadow traversal 회귀 테스트 추가 | 자동 회귀 검증 |
| `tests/content/overlay/state-machine.test.ts` | 역방향 drag selection 정규화 검증 보강 | overlay state machine |
| `src/content/overlay/crop-overlay.css` | dragging 상태에서 viewport frame을 숨겨 drag flicker 보정 | overlay visual behavior |
| `README.md` | 현재 MVP 개발 상태, visible viewport 제한, 후속 범위 #12~#15, 로컬 smoke 기대 결과 갱신 | 기여자 로컬 검증 문서 |
| `mydocs/tech/task_m020_8_quality_matrix.md` | Phase 6 품질 매트릭스, 자동/수동 결과, 제한/후속 분류, 신규 후속 후보 기록 | 내부 QA 기록 |
| `mydocs/working/task_m020_8_stage1.md` ~ `task_m020_8_stage4.md` | Stage별 완료 보고서 작성 | Hyper-Waterfall 추적 |
| `mydocs/report/task_m020_8_report.md` | 최종 보고서 작성 | PR 전 장기 보관 기록 |
| `mydocs/orders/20260529.md` | #8 오늘할일 완료 처리 | 작업 보드 |

## 문서 위치 검증

| 파일 | 계획된 위치 | 실제 위치 | 결과 | 근거 |
|---|---|---|---|---|
| `README.md` | 루트 `README.md` | `README.md` | OK | 수행계획서의 로컬 smoke 기대 결과와 MVP 제한 문구 위치와 일치 |
| `mydocs/tech/task_m020_8_quality_matrix.md` | `mydocs/tech/` | `mydocs/tech/task_m020_8_quality_matrix.md` | OK | task-specific QA 기록 위치와 일치 |
| `tests/fixtures/phase6_edge_cases.html` | `tests/fixtures/` | `tests/fixtures/phase6_edge_cases.html` | OK | 반복 smoke fixture 위치와 일치 |
| 공식 제품 문서 루트 | 생성하지 않음 | 생성하지 않음 | OK | 이번 task는 공식 docs/specs/site/adr 루트 생성을 제외 |

## 변경 전·후 정량 비교

| 지표 | 변경 전 | 변경 후 |
|---|---|---|
| Phase 6 fixture | 없음 | `tests/fixtures/phase6_edge_cases.html` 1개 |
| Phase 6 품질 매트릭스 | 없음 | P6-01~P6-28 28개 항목 |
| 자동 테스트 결과 | 기존 suite | 11개 test file, 85개 test 통과 |
| Chrome zoom smoke 기록 | 없음 | 80%, 100%, 125%, 150% 통과 기록 |
| 단계 보고서 | 없음 | Stage 1~4 보고서 4개 |

## 검증 결과

| 수용 기준 | 결과 |
|---|---|
| Phase 6 테스트 페이지 범위가 검증되거나 제한으로 기록된다 | OK — fixture와 matrix에 일반 문서, 카드, 버튼/아이콘, 코드, 긴 표, sticky, transform, iframe, shadow, viewport 밖 요소 기록 |
| Chrome zoom 80%, 100%, 125%, 150% 결과가 기록된다 | OK — 작업지시자 수동 smoke와 `crop-image.test.ts` 근거 기록 |
| iframe, shadow DOM, sticky, transform/scale 동작이 분류된다 | OK — same-document iframe/open shadow는 현재 기준 기록, cross-origin/closed shadow는 MVP 제한으로 분류 |
| Copy/Save 결과물에 overlay UI가 포함되지 않는다 | OK — 작업지시자 수동 smoke에서 Copy/Save와 overlay 오염 방지 통과 |
| viewport 밖으로 이어지는 선택은 visible viewport 기준으로 잘린다는 제한이 문서에 반영된다 | OK — README 현재 제한과 matrix P6-13에 반영 |
| 발견된 결함은 수정되거나 후속 이슈 후보로 분리된다 | OK — P6-27 flicker는 CSS 보정 후 수동 재확인 OK, P6-28 parity는 후속 후보로 분리 |
| `debugger`, `<all_urls>` 권한이 추가되지 않는다 | OK — `manifest.json`과 README 범위 기준 유지 |
| `npm run build`가 통과한다 | OK — Vite build 통과 |
| `npm run typecheck`가 통과한다 | OK — `tsc --noEmit` 통과 |
| `npm run test`가 통과한다 | OK — 11개 test file, 85개 test 통과 |
| `git diff --check`가 경고 없이 통과한다 | OK — whitespace 오류 없음 |
| `git status --short`가 PR 준비 전 빈 출력이다 | OK — Stage 5 산출물 커밋 후 빈 출력 확인 |

### 단계별 검증 결과

- Stage 1: [`task_m020_8_stage1.md`](../working/task_m020_8_stage1.md) — fixture와 품질 매트릭스 작성, grep/diff 검증 통과.
- Stage 2: [`task_m020_8_stage2.md`](../working/task_m020_8_stage2.md) — Phase 6 자동 회귀 테스트 확장, build/typecheck/test/grep/diff 통과.
- Stage 3: [`task_m020_8_stage3.md`](../working/task_m020_8_stage3.md) — 작업지시자 Chrome manual smoke 결과 기록, Copy/Save/zoom/overlay 오염 방지 OK와 drag flicker MISS 기록.
- Stage 4: [`task_m020_8_stage4.md`](../working/task_m020_8_stage4.md) — drag flicker CSS 보정, README 제한 문구, 후속 후보 분류, build/typecheck/test/grep/diff 통과.
- Stage 5: 최종 보고서와 오늘할일 완료 처리, 통합 검증 통과.

## 잔여 위험과 후속 작업

### 잔여 위험

- 비HiDPI, Windows, Linux 조합은 현재 macOS/Chrome 환경에서 직접 확인하지 못했다.
- cross-origin iframe 내부, nested browsing context, closed shadow DOM 내부 선택은 MVP 제한이다.
- 화면 밖으로 이어지는 요소의 실제 PNG는 visible viewport 교차 영역만 포함한다. full page/scroll stitching은 이번 task 범위 밖이다.
- Firefox식 selected-state size badge, resize/move handles, action button parity는 현재 MVP와 별도 후속 작업이다.

### 후속 작업 후보

- #12: drag selection edge auto-scroll
- #13: selection resize/move handles와 keyboard 조정
- #14: iframe/nested context 내부 선택 고도화
- #15: full page capture와 scroll stitching
- 신규 후보: `Follow-up: Firefox식 selected-state size badge와 action button parity 구현`

## 작업지시자 승인 요청

- 최종 보고서와 수용 기준 검증 결과를 승인하면 PR 게시 절차로 진행한다.
