# Task #14 Stage 2 보고서

GitHub Issue: [#14](https://github.com/postmelee/crop/issues/14)
구현계획서: [`task_m020_14_impl.md`](../plans/task_m020_14_impl.md)
Stage: 2

## 단계 목적

Stage 2는 Stage 1에서 고정한 iframe 좌표 계약을 실제 hit-test 흐름에 연결하는 단계다. 이번 단계에서는 접근 가능한 same-origin/srcdoc iframe 내부 `elementFromPoint()`로 내려가고, iframe 내부 target rect를 parent viewport 기준으로 합성해 overlay runtime이 page rect로 변환해 사용하도록 연결했다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `src/firefox-derived/overlay-helpers.ts` | `getElementFromPoint()`에 iframe 재귀 traversal을 연결했다. 접근 가능한 iframe은 내부 document로 내려가고, 내부 target rect를 parent viewport rect로 projection한다. 재귀 depth guard와 visited iframe guard를 추가했다. |
| `src/content/overlay/crop-overlay.ts` | `HitTestResult.rect`가 있으면 parent viewport rect로 보고 `viewportRectToPageRect()`로 변환해 hover selection rect로 우선 사용한다. |
| `tests/firefox-derived/overlay-helpers.test.ts` | same-origin iframe 내부 target, nested same-origin iframe, iframe 내부 open shadow root traversal 테스트를 추가했다. |
| `tests/content/overlay/phase6-regression.test.ts` | overlay runtime이 iframe hit-test rect를 page rect 변환 전에 우선 사용하는 회귀 테스트를 추가했다. |
| `mydocs/orders/20260531.md` | #14 상태를 Stage 2 완료 후 승인 대기로 갱신했다. |

## 구현 기준

- `getElementFromPoint()`는 iframe element를 만나면 `contentDocument` 접근을 시도한다.
- `contentDocument`가 접근 가능하면 parent viewport pointer를 iframe viewport pointer로 변환하고 child document의 `elementFromPoint()`를 호출한다.
- child target rect는 iframe viewport 기준 `getBoundingClientRect()` 또는 child hit result rect를 parent viewport 기준으로 projection한다.
- nested same-origin iframe은 재귀적으로 처리하되 최대 depth 8과 visited iframe guard로 순환을 방지한다.
- 접근 불가능 iframe, contentDocument 없음, rect 계산 불가 상황은 기존 `unsupportedReason: "iframe"` fallback을 유지한다.
- overlay runtime은 `HitTestResult.rect`가 있으면 iframe 내부 element를 top document 좌표로 다시 해석하지 않고 바로 page rect로 변환한다.

## 본문 변경 정도 / 본문 무손실 여부

코드 작업이므로 문서 본문 무손실 여부는 해당 없음. 기존 일반 document hit-test, open shadow traversal, iframe fallback 테스트는 유지했고 전체 테스트로 회귀를 확인했다.

## 검증 결과

실행 명령:

```bash
npm run build
npm run typecheck
npm run test
rg "contentDocument|contentWindow|iframe|parent|viewport|page|HitTestResult" src/firefox-derived src/content/overlay tests
git diff --check
```

결과:

- OK: `npm run build` 통과.
- OK: `npm run typecheck` 통과.
- OK: `npm run test` 통과. 14개 test file, 158개 test가 모두 통과했다.
- OK: `rg "contentDocument|contentWindow|iframe|parent|viewport|page|HitTestResult" ...`에서 Stage 2 산출물과 회귀 테스트 참조를 확인했다.
- OK: `git diff --check` 경고 없이 통과.

## 잔여 위험

- cross-origin iframe fallback은 helper에서 안전하게 유지되지만, 접근 불가 mock과 실제 제한 문서화는 Stage 3에서 더 명시적으로 정리한다.
- iframe 내부 target rect는 현재 child target rect 기준이다. Firefox privileged actor 수준의 browsing context selection heuristic과 완전히 같지는 않으며, Stage 4 smoke에서 실제 fixture 기대값을 확인한다.
- open shadow root와 iframe이 섞인 더 복잡한 조합은 Stage 3에서 회귀 테스트를 보강한다.

## 다음 단계 영향

- Stage 3는 cross-origin/inaccessible iframe fallback을 테스트와 문서 기준으로 고정한다.
- Stage 3는 open shadow root 내부 iframe, iframe 내부 open shadow root, nested context fallback 조합을 정리한다.
- Stage 3는 `debugger`, `<all_urls>` 권한이 추가되지 않았음을 manifest/grep/test로 재확인한다.

## 승인 요청

- Stage 2 산출물과 검증 결과를 승인하면 Stage 3 cross-origin fallback과 nested/open-shadow 회귀 정리로 진행한다.
