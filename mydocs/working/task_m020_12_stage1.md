# Task #12 Stage 1 완료 보고서

GitHub Issue: [#12](https://github.com/postmelee/crop/issues/12)
구현계획서: [`task_m020_12_impl.md`](../plans/task_m020_12_impl.md)
Stage: 1

## 단계 목적

drag selection edge auto-scroll을 실제 overlay에 연결하기 전에, pointer 위치와 viewport 크기만으로 scroll delta를 계산하는 순수 helper 기준을 고정했다. Stage 1은 구현계획서상 `edge auto-scroll helper 기준 작성` 단계이며, runtime 연결은 Stage 2로 넘긴다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `src/content/overlay/edge-scroll.ts` | edge auto-scroll용 `getEdgeScrollDelta()` helper, 입력/출력 타입, 기본 threshold/max step 상수 추가. |
| `tests/content/overlay/edge-scroll.test.ts` | safe area, 상/하/좌/우 edge, corner, viewport 밖 pointer clamp, custom option, threshold cap, invalid input 테스트 추가. |
| `mydocs/working/task_m020_12_stage1.md` | Stage 1 완료 보고서 추가. |

## 본문 변경 정도 / 본문 무손실 여부

코드 추가 작업이다. 기존 overlay runtime, state machine, README, fixture는 수정하지 않았다. Firefox 원본 코드를 복사하지 않고 Chrome content script에서 사용할 순수 계산 helper만 새로 작성했다.

## 검증 결과

실행 명령:

```bash
npm run typecheck
npm run test
rg "edge|scroll|drag|viewport|page|delta" src/content/overlay tests/content/overlay mydocs/plans/task_m020_12.md
git diff --check
```

결과:

- OK: `npm run typecheck` 통과.
- OK: `npm run test` 통과. 12개 test file, 94개 test가 모두 통과했다.
- OK: `rg`에서 edge/scroll/drag/viewport/page/delta 관련 helper, 테스트, 계획서 문구가 확인됐다.
- OK: `git diff --check`가 출력 없이 종료되어 whitespace 오류가 없었다.

## 잔여 위험

- helper는 아직 overlay runtime에 연결되지 않았다. 실제 scroll loop cleanup과 page-coordinate drag 갱신은 Stage 2에서 구현해야 한다.
- scroll 속도와 threshold는 기본값으로만 고정했다. 실제 Chrome smoke에서 과하거나 부족하면 Stage 4에서 좁게 조정한다.
- Chrome 확장 환경에서 pointermove/scroll event 순서가 테스트 환경과 다를 수 있다.

## 다음 단계 영향

- Stage 2는 `getEdgeScrollDelta()`를 `crop-overlay.ts`의 drag 흐름에 연결한다.
- Stage 2에서 requestAnimationFrame loop, `window.scrollBy()`, pointerup/Escape/Cancel/remove cleanup을 함께 고정해야 한다.

## 승인 요청

- Stage 1 산출물과 검증 결과를 승인하면 Stage 2 drag selection scroll loop 구현으로 진행한다.
