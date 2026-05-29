# Task #8 Stage 2 완료 보고서

GitHub Issue: [#8](https://github.com/postmelee/crop/issues/8)
구현계획서: [`task_m020_8_impl.md`](../plans/task_m020_8_impl.md)
Stage: 2

## 단계 목적

Phase 6 품질 항목 중 브라우저 수동 조작 없이 고정할 수 있는 회귀 조건을 자동 테스트로 확장했다. viewport 밖 선택의 visible clipping, zoom-like screenshot source mapping, transform visual rect, open shadow traversal, 드래그 선택 rect 정규화를 검증했다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `tests/content/overlay/phase6-regression.test.ts` | Phase 6 전용 자동 회귀 테스트 추가. viewport 밖 page selection clipping, source image mapping, transform visual rect, nested open shadow hit-test를 검증. |
| `tests/content/overlay/state-machine.test.ts` | 포인터가 시작점보다 위/왼쪽으로 이동하는 역방향 드래그 선택 회귀 테스트 추가. |
| `src/content/overlay/state-machine.ts` | 드래그 선택 중 생성되는 rect를 `normalizeRect`로 정규화해 역방향 드래그에서도 선택 영역이 안정적으로 계산되도록 보정. |
| `mydocs/tech/task_m020_8_quality_matrix.md` | Stage 2 자동 검증 결과와 P6-09, P6-12, P6-13, P6-18~P6-21, P6-26 근거 갱신. |
| `mydocs/working/task_m020_8_stage2.md` | Stage 2 완료 보고서 추가. |

## 본문 변경 정도 / 본문 무손실 여부

기존 사용자 문서는 수정하지 않았다. 코드 변경은 overlay state-machine의 드래그 rect 계산 한 줄에 한정했고, 기존 클릭 선택과 hover 선택 API는 유지했다. 품질 매트릭스는 Stage 2 결과 기록 섹션과 자동 검증 근거만 추가했다.

## 검증 결과

실행 명령:

```bash
npm run build
npm run typecheck
npm run test
rg "zoom|scale|iframe|shadow|sticky|viewport|clip|devicePixelRatio" tests src
git diff --check
```

결과:

- OK: `npm run build` 통과. `dist/manifest.json`, `dist/background/service-worker.js`, `dist/content/inject.js` 생성 확인.
- OK: `npm run typecheck` 통과.
- OK: `npm run test` 통과. 11개 test file, 85개 test 모두 통과.
- OK: `rg`에서 Stage 2 필수 키워드가 `tests`와 `src` 양쪽에서 확인됐다.
- OK: `git diff --check`가 출력 없이 종료되어 whitespace 오류가 없었다.

## 잔여 위험

- 자동 테스트는 DOM test double과 순수 helper 기반이라 실제 Chrome hit-test, browser zoom UI, clipboard/download 사용자 제스처를 대체하지 않는다.
- Copy/Save 결과 이미지에 overlay가 섞이지 않는지, Chrome zoom 80/100/125/150%에서 실제 동작하는지는 Stage 3 manual smoke에서 확인해야 한다.
- iframe 내부 깊은 선택, closed shadow DOM, viewport 밖 전체 요소 캡처는 여전히 MVP 제한 또는 후속 이슈 분류 대상이다.

## 다음 단계 영향

- Stage 3 manual smoke는 이번에 추가한 `phase6_edge_cases.html` fixture와 갱신된 quality matrix를 기준으로 수행한다.
- Stage 3에서 수동 결과가 자동 결과와 다르면 matrix의 상태를 `MISS`, `제한`, `후속` 중 하나로 갱신한다.
- 역방향 드래그 선택은 자동으로 고정됐으므로 Stage 3에서 실제 UI 동작만 확인하면 된다.

## 승인 요청

- Stage 2 산출물과 검증 결과를 승인하면 Stage 3 Chrome manual smoke 실행과 결과 기록으로 진행한다.
