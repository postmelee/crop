# Task #14 Stage 4 보고서

GitHub Issue: [#14](https://github.com/postmelee/crop/issues/14)
구현계획서: [`task_m020_14_impl.md`](../plans/task_m020_14_impl.md)
Stage: 4

## 단계 목적

Stage 4는 #14 구현 결과를 Phase 6 fixture, README, 품질 매트릭스, 최종 보고서에 반영하고 PR 준비 전 검증 결과를 정리하는 단계다. 이번 단계에서는 same-origin/srcdoc iframe을 지원 항목으로 문서화하고, cross-origin iframe과 closed shadow DOM은 Chrome MV3 권한 경계상 제한으로 명시했다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `tests/fixtures/phase6_edge_cases.html` | iframe smoke table과 srcdoc iframe 설명 문구를 same-origin 내부 선택 지원 기준으로 갱신했다. |
| `tests/content/overlay/phase6-regression.test.ts` | Phase 6 fixture에 same-origin iframe smoke target이 유지되는지 회귀 테스트를 추가했다. |
| `README.md` | M020 #14 개발 상태, same-origin/srcdoc iframe 지원, cross-origin/closed shadow 제한, Copy toast/Save no-toast 기대값을 갱신했다. |
| `mydocs/tech/task_m020_8_quality_matrix.md` | P6-10/P6-24/P6-25 상태와 Task #14 갱신 결과를 반영했다. |
| `mydocs/report/task_m020_14_report.md` | 최종 보고서를 작성했다. |
| `mydocs/orders/20260531.md` | #14 상태를 Stage 4 + 최종 보고서 완료 후 승인 대기로 갱신했다. |

## smoke 결과

로컬 Vite server를 `http://127.0.0.1:5175/`에서 임시로 실행했다. 5174는 이미 사용 중이라 Vite가 5175로 전환했다.

확인 URL:

```text
http://127.0.0.1:5175/tests/fixtures/phase6_edge_cases.html
```

결과:

- OK: fixture page title이 `crop Phase 6 edge case fixture`로 로드됐다.
- OK: top document에서 `data-crop-fixture="same-document-iframe"` iframe을 확인했다.
- OK: frame locator로 `data-crop-fixture="iframe-card"` 1개를 확인했다.
- OK: frame locator로 `data-crop-fixture="iframe-button"` 1개를 확인했다.
- OK: iframe card text가 `crop should select this srcdoc content because it is same-origin.` 문구를 포함했다.

## 본문 변경 정도 / 본문 무손실 여부

README와 품질 매트릭스는 수행계획서에서 승인된 기존 위치에 좁게 갱신했다. 공식 제품 문서 루트는 새로 만들지 않았다. 기존 제한/후속 항목은 #14 완료 상태에 맞게 same-origin 지원과 cross-origin/closed shadow 제한으로 재분류했다.

## 검증 결과

실행 명령:

```bash
npm run build
npm run typecheck
npm run test
rg "iframe|shadow|cross-origin|same-origin|srcdoc|debugger|<all_urls>|#14" README.md mydocs src tests manifest.json
git diff --check
git status --short
```

결과:

- OK: `npm run build` 통과.
- OK: `npm run typecheck` 통과.
- OK: `npm run test` 통과. 14개 test file, 162개 test가 모두 통과했다.
- OK: `rg "iframe|shadow|cross-origin|same-origin|srcdoc|debugger|<all_urls>|#14" ...`에서 지원/제한 문구, 권한 회귀 테스트, fixture smoke target을 확인했다.
- OK: `git diff --check` 경고 없이 통과.
- OK: browser fixture smoke에서 srcdoc iframe card/button target을 확인했다.

## 잔여 위험

- 실제 웹의 cross-origin iframe은 Chrome MV3 권한 경계상 내부 DOM 접근을 지원하지 않는다. 이번 task에서는 inaccessible iframe fallback 테스트와 README 제한 문구로 고정했다.
- closed shadow DOM 내부 선택은 접근하지 않는다.
- full page capture와 scroll stitching은 #15 범위로 남아 있다.

## 다음 단계 영향

- 최종 보고서 승인 후 PR 게시 절차로 넘어갈 수 있다.
- PR 게시 전에는 `task-final-report` 절차에 따라 오늘할일 완료 처리, 최종 커밋/브랜치 정리, publish branch push, PR 생성을 진행한다.

## 승인 요청

- Stage 4 산출물과 최종 보고서를 승인하면 PR 게시 절차로 진행한다.
