# Task #68 Stage 4 보고서

GitHub Issue: [#68](https://github.com/postmelee/crop/issues/68)
구현계획서: [`task_m020_68_impl.md`](../plans/task_m020_68_impl.md)
Stage: 4

## 단계 목적

Stage 4는 #68의 전체 자동 검증을 수행하고, 최종 보고서와 오늘할일 상태를 정리하는 단계다. macOS `Show scroll bars: Always` 환경의 실제 Chrome Copy/Save smoke는 작업지시자가 직접 진행하기로 했으므로, 에이전트는 자동 검증 결과와 수동 smoke 대기 상태를 분리해 기록했다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `mydocs/working/task_m020_68_stage4.md` | Stage 4 자동 검증 결과, smoke 전제 확인, 수동 smoke 대기 상태를 기록했다. |
| `mydocs/report/task_m020_68_report.md` | #68 최종 보고서, 변경 범위, 수용 기준별 검증 결과, 남은 수동 검증 항목을 정리했다. |
| `mydocs/orders/20260612.md` | #68 오늘할일 비고를 자동 검증 완료와 수동 smoke 대기 상태로 갱신했다. |

## 본문 변경 정도 / 본문 무손실 여부

이번 Stage는 보고 문서와 작업 관리 문서만 갱신했다. 제품 공식 문서, 사용자 문서, 런타임 코드, 테스트 파일은 변경하지 않았다.

## 검증 결과

실행 명령:

```bash
npm run build
npm run typecheck
npm test
rg -n "debugger|<all_urls>|host_permissions|captureVisibleTab" manifest.json src tests
rg -n "#68|Always scroll|capture viewport|scrollbar|innerWidth|captureViewport" src tests mydocs/plans/task_m020_68.md mydocs/plans/task_m020_68_impl.md mydocs/report/task_m020_68_report.md
git diff --check
git status --short
defaults read -g AppleShowScrollBars
```

결과:

- OK: `npm run build` 통과. Vite build 완료, `dist/manifest.json`, `dist/background/service-worker.js`, `dist/content/inject.js` 생성.
- OK: `npm run typecheck` 통과. `tsc --noEmit` 오류 없음.
- OK: `npm test` 통과. 17개 파일, 222개 테스트 통과.
- OK: 권한 경계 grep에서 `captureVisibleTab` 경로만 확인했고, `debugger`, `<all_urls>` 권한 추가 없음.
- OK: 핵심 키워드 grep에서 #68 계획서, 최종 보고서, source mapping 테스트, visible/tiled capture runtime, capture viewport 계약 반영을 확인했다. 최종 보고서 생성 전 1회는 보고서 파일 미존재로 실패했고, 보고서 작성 후 재실행해 통과했다.
- OK: `git diff --check` 경고 없음.
- OK: `defaults read -g AppleShowScrollBars` 결과는 `Always`.

## 수동 smoke 상태

- 에이전트는 Chrome에서 LG CNS 재현 페이지를 열고 `window.innerWidth=1452`, `document.documentElement.clientWidth=1437` 상태와 대상 이미지 노출을 확인했다.
- 이후 작업지시자가 "검증은 내가 직접 진행하게 해줘."라고 지시했으므로, Copy/Save PNG 생성과 우측 gutter 확인은 작업지시자 직접 검증 항목으로 남긴다.
- 수동 smoke 절차는 최종 보고서에 기록했다.

## 잔여 위험

- 실제 Copy/Save PNG의 우측 순백 gutter 제거 여부는 작업지시자 수동 smoke 결과를 받아야 최종 확인된다.
- 에이전트가 Chrome GUI smoke를 중단했으므로, PR 게시 전 작업지시자 확인 결과를 반영해야 한다.

## 다음 단계 영향

- 작업지시자 수동 smoke에서 Save/Copy 결과가 정상임을 확인하면 PR 게시 절차로 진행할 수 있다.
- smoke에서 문제가 재현되면 Stage 2/3의 source mapping 계약 또는 실제 확장 로드 상태를 다시 점검해야 한다.

## 승인 요청

- Stage 4 자동 검증 결과와 최종 보고서를 확인하고, 작업지시자 수동 smoke 결과까지 문제가 없으면 PR 게시 절차로 진행한다.
