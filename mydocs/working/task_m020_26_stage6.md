# Task #26 Stage 6 보고서

GitHub Issue: [#26](https://github.com/postmelee/crop/issues/26)
구현계획서: [`task_m020_26_impl.md`](../plans/task_m020_26_impl.md)
Stage: 6

## 단계 목적

Stage 6은 작업지시자 Firefox 비교로 확인된 oversized initial element 자동 추천 차이를 보정하는 단계다. Firefox처럼 첫 hit 후보가 max detect threshold보다 크고 이전 usable rect가 없으면 clipped viewport-sized fallback을 만들지 않고 후보 없음으로 처리했다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `src/firefox-derived/overlay-helpers.ts` | oversized initial element에서 viewport fallback rect를 만들던 `getFallbackRect()` 경로를 제거했다. |
| `tests/firefox-derived/overlay-helpers.test.ts` | initial oversized element는 `null`을 반환하고, previous usable rect fallback은 유지되는지 검증했다. |
| `tests/content/overlay/phase6-regression.test.ts` | Phase 6 조건에 가까운 oversized element가 Firefox threshold를 넘으면 자동 선택되지 않는 회귀 테스트를 추가했다. |
| `tests/fixtures/phase6_edge_cases.html` | `offscreen-large-element` 설명을 자동 추천 차단 기준으로 갱신했다. |
| `mydocs/tech/task_m020_8_quality_matrix.md` | P6-13을 selected stitching 대상이 아니라 oversized initial 자동 추천 차단 기준으로 재정의했다. |
| `mydocs/plans/task_m020_26_impl.md` | Stage 6 보정 단계, 수용 기준, 검증 명령, 위험을 추가했다. |
| `mydocs/report/task_m020_26_report.md` | 최종 보고서를 Stage 6 기준으로 갱신했다. |
| `mydocs/orders/20260603.md` | 2026-06-03 오늘할일에 Stage 6 완료를 기록했다. |

## 본문 변경 정도 / 본문 무손실 여부

코드 변경은 Firefox-derived helper의 oversized initial fallback 경로 제거에 한정했다. parent가 너무 커서 이전 child/sibling usable rect로 되돌아가는 동작은 유지했다. 문서는 P6-13과 최종 보고서의 문제 정의를 새 Firefox 비교 결과에 맞춰 갱신했다.

## 검증 결과

실행 명령:

```bash
npm run build
npm run typecheck
npm test
rg "initial oversized|offscreen-large-element|P6-13|isTooLarge|previous usable|viewport fallback|setCapturePageChromeSuppressed" src tests mydocs
rg "debugger|<all_urls>|host_permissions|captureVisibleTab" manifest.json src tests
git diff --check
git status --short
```

결과:

- `npm run build`: OK. Vite build 완료.
- `npm run typecheck`: OK.
- `npm test`: OK. 16개 파일, 188개 테스트 통과.
- Stage 6 핵심 grep: OK. oversized initial rejection, P6-13, selected/full page suppression 기준 반영 확인.
- 권한 경계 grep: OK. `debugger`, `<all_urls>` 권한 추가 없음.
- `git diff --check`: OK. whitespace 오류 없음.
- `git status --short`: OK. Stage 6 대상 파일만 변경됨.

## 잔여 위험

- 에이전트 환경에서는 실제 Chrome 확장 UI에서 `offscreen-large-element` hover/click smoke를 직접 수행하지 않았다.
- Firefox parity에 맞춰 oversized initial element는 자동 추천되지 않는다. 큰 컨테이너를 직접 선택해야 하는 사용자는 drag selection을 사용해야 한다.

## 다음 단계 영향

- PR 본문은 Stage 6까지 포함해야 한다.
- 수동 smoke에서는 `offscreen-large-element` 빈 영역 hover/click 시 추천 박스가 생성되지 않는지 확인해야 한다.

## 승인 요청

- Stage 6 산출물과 검증 결과를 승인하면 PR 게시 절차로 진행한다.
