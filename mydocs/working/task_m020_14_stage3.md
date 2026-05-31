# Task #14 Stage 3 보고서

GitHub Issue: [#14](https://github.com/postmelee/crop/issues/14)
구현계획서: [`task_m020_14_impl.md`](../plans/task_m020_14_impl.md)
Stage: 3

## 단계 목적

Stage 3은 Stage 2에서 구현한 same-origin iframe traversal이 브라우저 보안 경계와 nested/open-shadow 조합에서 예외 없이 동작하는지 고정하는 단계다. 이번 단계에서는 접근 불가능 iframe을 정상 fallback 경로로 테스트하고, same-origin iframe과 open shadow root가 섞인 조합을 회귀 테스트로 보강했다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `tests/firefox-derived/overlay-helpers.test.ts` | top-level inaccessible iframe fallback, nested inaccessible iframe parent viewport rect projection, open shadow root 내부 same-origin iframe traversal 테스트를 추가했다. |
| `mydocs/orders/20260531.md` | #14 상태를 Stage 3 완료 후 승인 대기로 갱신했다. |

## fallback 기준

- top-level inaccessible iframe은 `contentDocument` 접근 실패를 삼키고 iframe element fallback으로 반환한다.
- same-origin iframe 내부에서 nested inaccessible iframe을 만나면 nested iframe boundary를 parent viewport rect로 projection하고 `unsupportedReason: "iframe"`을 유지한다.
- open shadow root 내부 iframe은 접근 가능하면 same-origin iframe traversal 경로로 들어가고, 접근 불가능하면 기존 iframe fallback 경로로 남긴다.
- cross-origin iframe 내부 DOM 접근은 Chrome MV3 content script 권한으로 강제하지 않는다.
- `debugger`, `<all_urls>` 권한은 추가하지 않았다.

## 본문 변경 정도 / 본문 무손실 여부

코드 테스트 보강 작업이므로 문서 본문 무손실 여부는 해당 없음. 제품 README와 품질 매트릭스의 지원/제한 문구 갱신은 Stage 4 문서 정리 단계로 남겼다.

## 검증 결과

실행 명령:

```bash
npm run build
npm run typecheck
npm run test
rg "debugger|<all_urls>|iframe|shadow|unsupportedReason|contentDocument" manifest.json src tests README.md mydocs/tech/task_m020_8_quality_matrix.md
git diff --check
```

결과:

- OK: `npm run build` 통과.
- OK: `npm run typecheck` 통과.
- OK: `npm run test` 통과. 14개 test file, 161개 test가 모두 통과했다.
- OK: `rg "debugger|<all_urls>|iframe|shadow|unsupportedReason|contentDocument" ...`에서 iframe/shadow fallback 테스트와 기존 README/품질 매트릭스 제한 문구, manifest 권한 회귀 테스트를 확인했다.
- OK: `git diff --check` 경고 없이 통과.

## 잔여 위험

- 실제 웹의 cross-origin iframe은 로컬 fixture double과 동일한 방식으로 DOM 접근이 차단되지만, 대표 웹 페이지에서의 수동 smoke는 Stage 4에서 확인해야 한다.
- README와 품질 매트릭스는 아직 #14 완료 상태로 갱신하지 않았다. Stage 4에서 same-origin/srcdoc 지원과 cross-origin/closed shadow 제한을 문서화해야 한다.
- Phase 6 fixture의 iframe 설명 문구와 table 기대값은 아직 기존 fallback 중심 문구다. Stage 4에서 fixture smoke 기준을 맞춘다.

## 다음 단계 영향

- Stage 4는 Phase 6 fixture의 same-origin/srcdoc iframe smoke와 문서 문구를 #14 구현 상태에 맞게 갱신한다.
- Stage 4는 README와 `mydocs/tech/task_m020_8_quality_matrix.md`의 P6-10/P6-24/P6-25 상태를 정리한다.
- Stage 4는 최종 보고서와 오늘할일을 PR 준비 상태로 맞춘다.

## 승인 요청

- Stage 3 산출물과 검증 결과를 승인하면 Stage 4 fixture, smoke, 문서와 최종 보고로 진행한다.
