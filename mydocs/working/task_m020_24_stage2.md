# Task #24 Stage 2 보고서

GitHub Issue: [#24](https://github.com/postmelee/crop/issues/24)
구현계획서: [`task_m020_24_impl.md`](../plans/task_m020_24_impl.md)
Stage: 2

## 단계 목적

Stage 1에서 바뀐 큰 wrapper 자동 후보 정책이 overlay hover 상태와 Phase 6 smoke 기준에서 회귀하지 않도록 보강한다. 이번 단계는 runtime 코드 변경 없이, `null` 후보가 기존 hover highlight를 정리하는 상태 전이와 큰 wrapper 내부 table/card fixture를 자동 테스트로 고정하는 단계다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `tests/fixtures/phase6_edge_cases.html` | 너무 큰 wrapper, 내부 infobox table, 내부 card smoke target을 추가했다. wrapper 빈 영역은 자동 후보 없음, 내부 target은 정상 후보 유지 기준으로 설명했다. |
| `tests/content/overlay/phase6-regression.test.ts` | 큰 wrapper 후보 없음 시 hover 상태가 idle로 초기화되는지, 내부 table/card 후보가 유지되는지, fixture smoke target이 존재하는지 검증을 추가했다. |
| `mydocs/orders/20260602.md` | #24 상태를 Stage 2 완료 후 승인 대기로 갱신했다. |

## 본문 변경 정도 / 본문 무손실 여부

fixture와 regression 테스트만 보강했다. `src/content/overlay/crop-overlay.ts` runtime은 수정하지 않았다. 기존 state machine이 `hover` 이벤트의 `rect: null`에서 `createInitialOverlayState()`로 돌아가는 계약을 사용해 이전 highlight 잔류 위험을 테스트로 고정했다.

## 검증 결과

실행 명령:

```bash
npm run build
npm run typecheck
npm test
rg "wrapper|large|infobox|table|selection|highlight|null" src tests/fixtures tests/content/overlay
git diff --check
```

결과:

- OK: `npm run build` 통과.
- OK: `npm run typecheck` 통과.
- OK: `npm test` 통과, 16개 파일 186개 테스트 통과.
- OK: Stage 2 grep에서 새 `too-large-wrapper` fixture, infobox/table/card regression, hover null 처리 경로를 확인했다.
- OK: `git diff --check` 통과.

## 잔여 위험

- 실제 NamuWiki 페이지 수동 smoke는 아직 수행하지 않았다. 이번 단계는 fixture와 자동 regression 기준을 보강한 상태다.
- Stage 3에서 품질 매트릭스에 해당 fixture와 자동 검증 근거를 반영해야 한다.

## 다음 단계 영향

- Stage 3은 `mydocs/tech/task_m020_8_quality_matrix.md`에 큰 wrapper 자동 추천 제외 항목을 추가하고, Stage 1/2 자동 테스트 근거를 연결한다.
- Stage 3 권한/source grep에서 `debugger`, `<all_urls>`, 불필요한 Firefox 원문 복사가 없음을 다시 확인한다.

## 승인 요청

- Stage 2 산출물과 검증 결과를 승인하면 다음 단계인 Stage 3 `품질 매트릭스와 권한 경계 정리`로 진행한다.
