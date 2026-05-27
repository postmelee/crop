# Task #4 Stage 3 보고서

GitHub Issue: [#4](https://github.com/postmelee/crop/issues/4)
구현계획서: [`task_m010_4_impl.md`](../plans/task_m010_4_impl.md)
Stage: 3

## 단계 목적

Stage 3은 Firefox Screenshots `overlayHelpers.mjs`의 element hit-test와
rect 선택 휴리스틱을 Chrome MV3 content script에서 재사용 가능한 helper로
분리하는 단계다. 일반 DOM과 open shadow root만 지원하고, Firefox
privileged actor, closed shadow root 접근, cross-origin iframe 내부 접근은
구현하지 않았다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `src/firefox-derived/overlay-helpers.ts` | MPL 2.0 header 포함, `getElementFromPoint`, `getBestRectForElement`, visible rect clipping, heading/article/small/large element 휴리스틱 구현 |
| `tests/firefox-derived/dom-fixtures.ts` | jsdom 없이 helper를 검증하기 위한 fixture element, shadow root, document test double 추가 |
| `tests/firefox-derived/overlay-helpers.test.ts` | 일반 DOM hit-test, open shadow hit-test, iframe fallback, rect clipping, small/large/heading/article/previous rect 정책 검증 |
| `mydocs/orders/20260527.md` | 오늘할일 비고를 Stage 3 완료 후 승인 대기 상태로 갱신 |

## 본문 변경 정도 / 본문 무손실 여부

새 Firefox-derived TypeScript 파일을 `src/firefox-derived/` 아래에만 추가했다.
Chrome runtime entrypoint(`src/content/inject.ts`, `src/background/service-worker.ts`)는
수정하지 않았다. upstream의 threshold 값, heading 제외 태그, `role="article"`
선호 정책은 유지하되, Firefox actor messaging과 `mozInnerScreenX/Y`,
`openOrClosedShadowRoot`, cross-origin iframe 내부 rect 조회는 Chrome MV3
범위에 맞게 제거했다.

## 검증 결과

실행 명령:

```bash
npm run typecheck
npm run test
rg "getBestRectForElement|getElementFromPoint|role=.article|H1|H6" src/firefox-derived tests/firefox-derived
git diff --check
```

결과:

- OK: `npm run typecheck`가 성공했다.
- OK: `npm run test`가 Vitest v3.2.4로 성공했다.
- OK: `tests/firefox-derived/region.test.ts` 5개 테스트가 통과했다.
- OK: `tests/firefox-derived/window-dimensions.test.ts` 6개 테스트가 통과했다.
- OK: `tests/firefox-derived/overlay-helpers.test.ts` 14개 테스트가 통과했다.
- OK: 총 3개 test file, 25개 test가 통과했다.
- OK: `rg`로 `getBestRectForElement`, `getElementFromPoint`, `H1`~`H6` 휴리스틱 기록이 확인됐다.
- OK: `git diff --check`가 경고 없이 통과했다.

추가 확인:

```bash
npm run build
```

결과:

- OK: Vite production build가 성공했고 기존 extension output 구조가 유지됐다.

## 잔여 위험

- Stage 3은 helper 단위 테스트만 수행했다. 실제 pointer movement, hover overlay, selection state machine 연결은 후속 Phase 3 task에서 검증해야 한다.
- fixture 기반 테스트는 브라우저의 실제 layout/hit-test를 완전히 대체하지 않는다. open shadow traversal과 rect 정책의 단위 동작만 보장한다.
- iframe 내부 선택, closed shadow root, full page/scroll stitching은 여전히 제외 범위다.

## 다음 단계 영향

- Stage 4는 `npm run build`, `npm run typecheck`, `npm run test`, license/source grep을 통합 실행하고 최종 보고서를 작성한다.
- 후속 Phase 3 overlay UI task는 `getElementFromPoint()`와 `getBestRectForElement()`를 `src/content/inject.ts`에 연결하되, overlay 자체가 capture PNG에 포함되지 않도록 별도 검증해야 한다.

## 승인 요청

- Stage 3 산출물과 검증 결과를 승인하면 Stage 4로 진행한다.
