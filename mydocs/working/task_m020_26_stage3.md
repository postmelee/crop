# Task #26 Stage 3 보고서

GitHub Issue: [#26](https://github.com/postmelee/crop/issues/26)
구현계획서: [`task_m020_26_impl.md`](../plans/task_m020_26_impl.md)
Stage: 3

## 단계 목적

Stage 3은 스크롤 후 selected region 저장 버그를 반복 검증할 수 있도록 Phase 6 fixture와 품질 매트릭스를 갱신하는 단계다. Stage 1/2에서 구현한 selected page rect tile/stitching 경로가 실제 fixture 기준과 회귀 테스트 기준에 반영되는지 확인했다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `tests/fixtures/phase6_edge_cases.html` | `selected-scroll-capture-target` smoke 영역과 nav 항목을 추가하고, 기존 large element 설명을 selected rect 전체 저장 기준으로 갱신했다. |
| `tests/content/overlay/phase6-regression.test.ts` | selected scroll capture fixture marker와 `data-crop-expected-css-size="1520x920"`, 품질 매트릭스 `P6-37` 항목을 고정하는 회귀 테스트를 추가했다. |
| `mydocs/tech/task_m020_8_quality_matrix.md` | P6-13 기준을 #26 구현 방향으로 갱신하고 P6-37 및 수동 smoke 절차, Task #26 갱신 결과 표를 추가했다. |

## 본문 변경 정도 / 본문 무손실 여부

fixture는 신규 재현 섹션을 추가하고 기존 offscreen-large 설명 중 낡은 MVP visible-only 저장 기준만 교체했다. 품질 매트릭스는 기존 항목을 유지하면서 #26으로 바뀐 selected Copy/Save 기대 동작과 수동 확인 절차를 추가했다. 런타임 코드 API 변경은 이 Stage에 없다.

## 검증 결과

실행 명령:

```bash
npm run build
npm run typecheck
npm test
rg "#26|selected|selection|scroll|viewport|stitch|tile|quality" tests mydocs/tech/task_m020_8_quality_matrix.md
rg "save only the visible viewport|visible viewport intersection" tests/fixtures/phase6_edge_cases.html mydocs/tech/task_m020_8_quality_matrix.md
git diff --check
```

결과:

- `npm run build`: OK. Vite build 완료.
- `npm run typecheck`: OK.
- `npm test`: OK. 16개 파일, 186개 테스트 통과.
- 핵심 키워드 grep: OK. fixture, 회귀 테스트, 품질 매트릭스에 #26 selected scroll capture 기준이 반영됨.
- obsolete 문구 grep: OK. `save only the visible viewport` 문구는 제거됨. 남은 `visible viewport intersection`은 clipping 방지 설명 문장이다.
- `git diff --check`: OK. whitespace 오류 없음.

## 잔여 위험

- 실제 저장 PNG가 `1520 x 920` CSS px x DPR 크기인지 확인하는 smoke는 수동 후보로 남아 있다.
- sticky header가 선택 rect와 겹친 상태에서 픽셀 결과가 브라우저별로 완전히 동일한지는 Stage 4에서 실제 브라우저 확인이 필요하다.

## 다음 단계 영향

- Stage 4에서는 전체 검증과 최종 보고서 작성 전에 `selected-scroll-capture-target` 수동 smoke 결과를 기록해야 한다.
- manifest 권한 grep으로 `debugger`, `<all_urls>`가 추가되지 않았음을 한 번 더 확인한다.

## 승인 요청

- Stage 3 산출물과 검증 결과를 승인하면 Stage 4 통합 검증과 최종 보고로 진행한다.
