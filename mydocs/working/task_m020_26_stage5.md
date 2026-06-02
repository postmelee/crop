# Task #26 Stage 5 보고서

GitHub Issue: [#26](https://github.com/postmelee/crop/issues/26)
구현계획서: [`task_m020_26_impl.md`](../plans/task_m020_26_impl.md)
Stage: 5

## 단계 목적

Stage 5는 Stage 4 이후 수동 검증에서 확인된 selected stitching 첫 tile의 sticky/fixed page chrome 오염을 보정하는 단계다. 선택 박스 밖 sticky header가 저장 PNG에 포함되지 않도록 selected page rect stitching의 모든 tile에서 page chrome suppression을 적용했다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `src/content/overlay/crop-overlay.ts` | selected page rect stitching은 첫 tile부터 `setCapturePageChromeSuppressed(true)`를 적용하도록 변경했다. full page capture의 `index > 0` 정책은 유지했다. |
| `tests/content/overlay/phase6-regression.test.ts` | selected capture block은 모든 tile suppression, full page block은 첫 tile 보존 정책을 유지하는지 회귀 테스트를 추가했다. |
| `mydocs/plans/task_m020_26_impl.md` | Stage 5 보정 단계와 검증 명령을 추가했다. |
| `mydocs/tech/task_m020_8_quality_matrix.md` | P6-37 기대값과 수동 smoke 절차에 선택 박스 밖 sticky/fixed page chrome 미포함 기준을 추가했다. |
| `mydocs/report/task_m020_26_report.md` | Stage 5 결과, 187개 테스트 통과, selected sticky/fixed suppression 기준을 최종 보고서에 반영했다. |
| `mydocs/orders/20260602.md` | #26 완료 시간을 Stage 5 완료 시각으로 갱신했다. |

## 본문 변경 정도 / 본문 무손실 여부

코드 변경은 selected page rect stitching의 `beforeCaptureTile` hook 한 곳으로 제한했다. full page capture, visible viewport crop, iframe/shadow selection 경로는 변경하지 않았다. 문서는 기존 내용을 삭제하지 않고 Stage 5 보정 내역과 수동 검증 기준을 추가 또는 갱신했다.

## 검증 결과

실행 명령:

```bash
npm run build
npm run typecheck
npm test
rg "setCapturePageChromeSuppressed\\(true\\)|setCapturePageChromeSuppressed\\(index > 0\\)|selected-scroll-capture|P6-37" src tests mydocs
rg "debugger|<all_urls>|host_permissions|captureVisibleTab" manifest.json src tests
git diff --check
git status --short
```

결과:

- `npm run build`: OK. Vite build 완료.
- `npm run typecheck`: OK.
- `npm test`: OK. 16개 파일, 187개 테스트 통과.
- selected/full page suppression 정책 grep: OK. selected block은 `setCapturePageChromeSuppressed(true)`, full page block은 `setCapturePageChromeSuppressed(index > 0)` 유지.
- 권한 경계 grep: OK. `debugger`, `<all_urls>` 권한 추가 없음.
- `git diff --check`: OK. whitespace 오류 없음.
- `git status --short`: OK. Stage 5 대상 파일만 변경됨.

## 잔여 위험

- 에이전트 환경에서는 실제 Chrome 확장 다운로드 PNG를 새로 저장해 header 미포함을 직접 확인하지 않았다.
- viewport 밖 selected stitching은 모든 tile에서 visible fixed/sticky page chrome을 숨긴다. 일반 visible selected crop과 full page 첫 tile 정책은 유지하지만, viewport 밖 큰 선택 영역 안에 의도적으로 포함하려던 fixed/sticky 요소가 있으면 결과에서 제외될 수 있다.

## 다음 단계 영향

- PR 전 수동 smoke에서는 `selected-scroll-capture-target` 저장 PNG에 sticky header가 포함되지 않는지 확인해야 한다.
- 최종 보고서는 Stage 5 기준으로 갱신되어 있으므로 PR 본문은 Stage 5까지 포함해야 한다.

## 승인 요청

- Stage 5 산출물과 검증 결과를 승인하면 PR 게시 절차로 진행한다.
