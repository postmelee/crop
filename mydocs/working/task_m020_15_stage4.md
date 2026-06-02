# Task #15 Stage 4 보고서

GitHub Issue: [#15](https://github.com/postmelee/crop/issues/15)
구현계획서: [`task_m020_15_impl.md`](../plans/task_m020_15_impl.md)
Stage: 4

## 단계 목적

full page capture가 긴 문서, 마지막 partial tile, horizontal overflow, sticky/fixed page chrome, fractional DPR/zoom-like stitching edge에서 회귀하지 않도록 fixture와 테스트 기준을 보강한다. Chrome MV3의 `captureVisibleTab()` 기반 scroll stitching 제약 안에서 fixed/sticky 요소가 tile마다 반복되는 문제를 최소 보정한다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `src/content/overlay/full-page-capture.ts` | tile capture 직전/직후 hook(`beforeCaptureTile`, `afterCaptureTile`) 추가, 실패 tile에서도 after hook 실행 |
| `src/content/overlay/crop-overlay.ts` | full page capture 두 번째 tile부터 viewport에 보이는 `position: fixed/sticky` page chrome을 capture 직전에 숨기고 직후 복원 |
| `tests/fixtures/phase6_edge_cases.html` | full page smoke section, top/mid/bottom marker, horizontal overflow marker, fixed marker 추가 |
| `tests/content/overlay/full-page-capture.test.ts` | tile hook 실행 순서와 실패 시 hook 복원 경로 회귀 테스트 추가 |
| `tests/shared/stitch-image.test.ts` | 인접 destination tile edge가 pixel snapping 이후에도 맞닿는지 회귀 테스트 추가 |
| `tests/content/overlay/phase6-regression.test.ts` | full page fixture marker와 fixed/sticky suppression wiring 회귀 테스트 추가 |
| `mydocs/orders/20260601.md` | #15 상태를 Stage 4 완료 후 승인 대기로 갱신 |

## 본문 변경 정도 / 본문 무손실 여부

코드 작업이므로 문서 본문 무손실 대상은 없다. 기존 visible selection capture, iframe/open shadow selection, Copy/Save action pipeline은 유지했다. full page capture에서만 tile hook과 fixed/sticky suppression이 동작하며, capture 실패 시 scroll/overlay/page chrome 복원 경로를 유지한다.

## 검증 결과

실행 명령:

```bash
npm test -- tests/content/overlay/full-page-capture.test.ts tests/shared/stitch-image.test.ts tests/content/overlay/phase6-regression.test.ts
npm run build
npm run typecheck
npm run test
rg "fixed|sticky|full page|full-page|stitch|seam|debugger|<all_urls>|captureVisibleTab" src tests manifest.json README.md mydocs
git diff --check
```

결과:

- OK: 관련 테스트 3개 파일 통과, 32개 테스트 통과.
- OK: `npm run build` 통과. Vite production build 완료.
- OK: `npm run typecheck` 통과.
- OK: 전체 `npm run test` 통과, 16개 파일 180개 테스트 통과.
- OK: Stage 4 grep에서 fixed/sticky, full page, stitch/seam, `captureVisibleTab`, 권한 경계 관련 항목 확인.
- OK: `git diff --check` 통과.
- MISS: in-app browser smoke는 로컬 URL 접근이 `net::ERR_BLOCKED_BY_CLIENT`로 차단되고, `file://` 접근은 Browser Use URL policy로 차단되어 수행하지 않았다. 정책 우회를 하지 않았다.

## 잔여 위험

- fixed/sticky 보정은 Firefox `drawSnapshot()`과 동일한 privileged rendering이 아니다. 현재 정책은 첫 tile에는 page chrome을 포함하고, 이후 tile에서는 viewport에 보이는 fixed/sticky 요소를 임시로 숨겨 반복 노출을 줄이는 방식이다.
- 브라우저 확장 UI에서 실제 full page Save/Copy PNG 시각 smoke는 이번 환경에서 실행하지 못했다. 작업지시자 로컬 smoke 또는 Stage 5 최종 smoke에서 확인해야 한다.
- section-local sticky 요소도 두 번째 tile 이후 viewport에 보이면 숨김 대상이 될 수 있다. 현재는 page chrome 반복 노출 방지를 우선한 정책이다.

## 다음 단계 영향

- Stage 5에서 README와 품질 매트릭스에 full page 지원 상태, sticky/fixed 정책, 수동 smoke 체크리스트를 반영한다.
- Stage 5 최종 smoke에서는 `tests/fixtures/phase6_edge_cases.html`에서 `전체 페이지 선택 -> Save/Copy`를 직접 확인하고, 저장 PNG의 top/mid/bottom marker와 horizontal overflow marker를 확인한다.
- 권한은 계속 `debugger`, `<all_urls>` 없이 유지한다.

## 승인 요청

- Stage 4 산출물과 검증 결과를 승인하면 다음 단계인 Stage 5 `문서, 품질 매트릭스, 최종 smoke와 보고`로 진행한다.
