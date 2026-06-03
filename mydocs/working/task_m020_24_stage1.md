# Task #24 Stage 1 보고서

GitHub Issue: [#24](https://github.com/postmelee/crop/issues/24)
구현계획서: [`task_m020_24_impl.md`](../plans/task_m020_24_impl.md)
Stage: 1

## 단계 목적

너무 큰 wrapper가 자동 선택 후보로 추천되지 않도록 `getBestRectForElement()`의 큰 요소 fallback 정책을 수정한다. 이번 단계는 runtime fixture 변경 전, Firefox-derived helper의 자동 후보 산정 규칙과 단위 테스트 기대값을 먼저 고정하는 단계다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `src/firefox-derived/overlay-helpers.ts` | 큰 요소를 viewport/maxDetect 크기로 잘라 후보화하던 `getFallbackRect()` 경로를 제거했다. 큰 요소를 만나기 전 유효 후보가 있으면 유지하고, 없으면 자동 후보 없음으로 반환한다. |
| `tests/firefox-derived/overlay-helpers.test.ts` | 큰 wrapper 단독 후보 없음, 큰 wrapper 내부 card 유지, table/infobox 후보 유지, threshold override 시 후보 제외 테스트를 반영했다. |
| `mydocs/orders/20260602.md` | #24 상태를 Stage 1 완료 후 승인 대기로 갱신했다. |

## 본문 변경 정도 / 본문 무손실 여부

코드 변경은 `src/firefox-derived/overlay-helpers.ts`의 자동 선택 후보 정책에 한정했다. MPL 헤더와 Firefox-derived 파일 경계는 유지했고, Chrome 권한/manifest, capture backend, 수동 drag selection, preview UI는 수정하지 않았다.

## 검증 결과

실행 명령:

```bash
npm run typecheck
npm test -- tests/firefox-derived/overlay-helpers.test.ts
rg "getFallbackRect|isTooLarge|maxDetect|previousRect|debugger|<all_urls>" src/firefox-derived tests/firefox-derived manifest.json
git diff --check
```

결과:

- OK: `npm run typecheck` 통과.
- OK: `npm test -- tests/firefox-derived/overlay-helpers.test.ts` 통과, 1개 파일 28개 테스트 통과.
- OK: Stage 1 grep에서 `getFallbackRect`, `debugger`, `<all_urls>`는 검출되지 않았다. `isTooLarge`, `maxDetect`, `previousRect`는 기대한 helper 정책 경로로만 남아 있다.
- OK: `git diff --check` 통과.

## 잔여 위험

- helper가 `null` 후보를 반환하는 상황에서 overlay runtime이 이전 highlight를 유지하거나 깜빡일 가능성은 Stage 2에서 fixture/regression으로 확인해야 한다.
- 실제 NamuWiki 유사 레이아웃은 fixture가 아직 없으므로 Stage 2에서 큰 wrapper 내부 infobox/table/card smoke 대상을 보강할지 판단해야 한다.

## 다음 단계 영향

- Stage 2는 `getBestRectForElement()`가 큰 wrapper 단독 hover에서 `null`을 반환하는 상태를 기준으로 overlay null candidate 처리를 확인한다.
- Stage 2에서 fixture 보강이 필요하면 `tests/fixtures/phase6_edge_cases.html`과 `tests/content/overlay/phase6-regression.test.ts`만 좁게 수정한다.

## 승인 요청

- Stage 1 산출물과 검증 결과를 승인하면 다음 단계인 Stage 2 `fixture와 overlay null 후보 회귀 보강`으로 진행한다.
