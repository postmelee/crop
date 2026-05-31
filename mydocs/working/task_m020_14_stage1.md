# Task #14 Stage 1 보고서

GitHub Issue: [#14](https://github.com/postmelee/crop/issues/14)
구현계획서: [`task_m020_14_impl.md`](../plans/task_m020_14_impl.md)
Stage: 1

## 단계 목적

Stage 1은 same-origin iframe traversal을 실제 overlay에 연결하기 전에 iframe hit-test 좌표 계약과 테스트 double을 고정하는 단계다. 이번 단계에서는 iframe 내부 target을 parent viewport 기준 rect로 전달할 수 있는 helper를 추가했고, `contentDocument` 접근 가능/불가능 판정을 안전한 helper로 분리했다. 실제 `getElementFromPoint()`의 iframe 내부 traversal은 Stage 2로 남겼으므로 사용자-facing 동작은 아직 바뀌지 않는다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `src/firefox-derived/overlay-helpers.ts` | iframe viewport point 타입, accessible iframe document 판정 helper, parent viewport -> iframe viewport point projection, iframe viewport rect -> parent viewport rect projection helper를 추가했다. |
| `tests/firefox-derived/dom-fixtures.ts` | fixture element에 `clientLeft`/`clientTop`, `contentDocument`, `contentWindow`, inaccessible contentDocument mock, `elementFromPoint()` 호출 좌표 기록을 추가했다. |
| `tests/firefox-derived/overlay-helpers.test.ts` | same-origin fixture iframe document 접근, inaccessible iframe fallback, non-iframe 거부, iframe point/rect 좌표 projection 테스트를 추가했다. |
| `mydocs/orders/20260531.md` | #14 상태를 Stage 1 완료 후 승인 대기로 갱신했다. |

## 좌표 계약

- parent pointer 좌표는 parent viewport 좌표로 입력한다.
- iframe 내부 `elementFromPoint()`에는 iframe content viewport 좌표를 전달한다.
- iframe content viewport origin은 `iframe.getBoundingClientRect().left/top + iframe.clientLeft/clientTop`으로 계산한다.
- iframe 내부 element rect는 iframe document viewport 기준 `getBoundingClientRect()` 결과로 보고, parent viewport rect로 합성할 때 iframe content viewport origin만 더한다.
- child document scroll은 child `getBoundingClientRect()`가 이미 반영한 viewport 좌표로 취급하므로 projection helper에서 별도로 더하지 않는다.
- cross-origin 또는 접근 불가능 iframe은 `contentDocument` 접근 실패를 `null`로 정규화한다.

## 본문 변경 정도 / 본문 무손실 여부

코드 작업이므로 문서 본문 무손실 여부는 해당 없음. 기존 일반 document hit-test, open shadow root traversal, iframe unsupported fallback 테스트는 유지했다. Stage 1에서는 `getElementFromPoint()`가 iframe 내부로 들어가지 않으므로 기존 사용자-facing fallback 동작도 유지된다.

## 검증 결과

실행 명령:

```bash
npm run typecheck
npm run test
rg "iframe|shadow|contentDocument|contentWindow|unsupportedReason|getElementFromPoint|HitTestResult" src/firefox-derived tests/firefox-derived tests/content/overlay mydocs/plans/task_m020_14.md mydocs/plans/task_m020_14_impl.md
git diff --check
```

결과:

- OK: `npm run typecheck` 통과.
- OK: `npm run test` 통과. 14개 test file, 154개 test가 모두 통과했다.
- OK: `rg "iframe|shadow|contentDocument|contentWindow|unsupportedReason|getElementFromPoint|HitTestResult" ...`에서 Stage 1 산출물과 계획서 참조를 확인했다.
- OK: `git diff --check` 경고 없이 통과.

## 잔여 위험

- `getElementFromPoint()`는 아직 same-origin iframe 내부 target으로 들어가지 않는다. Stage 2에서 이번 helper를 실제 hit-test 흐름에 연결해야 한다.
- nested same-origin iframe은 projection helper 조합으로 처리 가능한 구조만 마련했다. Stage 2에서 재귀 depth와 중단 조건을 테스트로 고정해야 한다.
- open shadow root와 iframe이 섞인 조합은 Stage 3에서 회귀 테스트를 더 추가한다.

## 다음 단계 영향

- Stage 2는 `getAccessibleIframeDocument()`, `projectPointIntoIframeViewport()`, `projectIframeViewportRectToParentViewport()`를 `getElementFromPoint()` 흐름에 연결한다.
- Stage 2는 `HitTestResult.rect`가 parent viewport rect를 담는 경로를 overlay runtime에서 page rect로 변환해 우선 사용하도록 연결한다.
- Stage 2는 iframe border/client offset, parent scroll, iframe document scroll 조건을 실제 traversal 테스트로 확장한다.

## 승인 요청

- Stage 1 산출물과 검증 결과를 승인하면 Stage 2 same-origin iframe traversal 구현으로 진행한다.
