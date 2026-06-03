# Task #26 Stage 4 보고서

GitHub Issue: [#26](https://github.com/postmelee/crop/issues/26)
구현계획서: [`task_m020_26_impl.md`](../plans/task_m020_26_impl.md)
Stage: 4

## 단계 목적

Stage 4는 #26의 전체 수용 기준을 통합 검증하고, 최종 보고서와 오늘할일 완료 처리를 남기는 단계다. Stage 1~3의 코드, fixture, 품질 기준 변경이 전체 build/test/typecheck와 MV3 권한 경계를 통과하는지 확인했다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `mydocs/working/task_m020_26_stage4.md` | Stage 4 통합 검증 결과와 잔여 위험을 기록했다. |
| `mydocs/report/task_m020_26_report.md` | #26 최종 보고서, 변경 범위, 수용 기준별 검증 결과, PR 전 승인 요청을 정리했다. |
| `mydocs/orders/20260602.md` | #26 오늘할일 상태를 완료로 갱신했다. |

## 본문 변경 정도 / 본문 무손실 여부

이번 Stage는 보고 문서와 작업 관리 문서만 갱신했다. 제품 공식 문서, 사용자 문서, 런타임 코드, 테스트 파일은 변경하지 않았다.

## 검증 결과

실행 명령:

```bash
npm run build
npm run typecheck
npm test
rg "debugger|<all_urls>|host_permissions|captureVisibleTab" manifest.json src tests
rg "#26|selected|scroll|viewport|stitch|tile" mydocs src tests
git diff --check
git status --short
```

결과:

- `npm run build`: OK. Vite build 완료, `dist/content/inject.js` 생성.
- `npm run typecheck`: OK.
- `npm test`: OK. 16개 파일, 186개 테스트 통과.
- 권한 경계 grep: OK. `captureVisibleTab` 경로만 확인되며 `debugger`, `<all_urls>` 권한 추가 없음.
- #26 핵심 키워드 grep: OK. selected scroll capture runtime, fixture, 품질 매트릭스, 단계 보고서에 반영됨.
- `git diff --check`: OK. whitespace 오류 없음.
- `git status --short`: OK. 보고서 작성 전에는 변경 없음.

## 잔여 위험

- 에이전트 환경에서는 실제 Chrome 확장의 다운로드 PNG 파일 크기와 픽셀 내용을 직접 저장해 검증하지 않았다.
- viewport 밖 selected capture는 Chrome MV3 `captureVisibleTab()` 제약 때문에 tile별 scroll 이동을 사용한다. 완료/실패 시 복구를 보장하지만, capture 중 페이지 animation/lazy load/layout shift가 있으면 픽셀 차이가 남을 수 있다.
- sticky/fixed 요소가 selection rect 위에 겹친 경우 Firefox privileged snapshot과 pixel-perfect parity는 보장하지 않는다.

## 다음 단계 영향

- 최종 보고서 승인 후 `publish/task26` 브랜치를 게시하고 `devel` 대상 PR을 생성한다.
- PR 본문에는 실제 PNG dimension smoke가 에이전트 미수행 수동 후보로 남아 있음을 검증 한계에 명시한다.

## 승인 요청

- Stage 4 산출물과 최종 보고서를 승인하면 PR 게시 절차로 진행한다.
