# Task #41 Stage 4 보고서

GitHub Issue: [#41](https://github.com/postmelee/crop/issues/41)
구현계획서: [`task_m020_41_impl.md`](../plans/task_m020_41_impl.md)
Stage: 4

## 단계 목적

Stage 1~3에서 구현한 full page tiled preview를 통합 검증하고, 실제 긴 GitHub 페이지 수동 smoke 결과를 P6-41 품질 기준과 최종 보고서에 반영한다. 이번 단계는 구현계획서상 Stage 4이며, 최종 보고서와 오늘할일 완료 처리를 함께 수행한다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `src/content/overlay/crop-overlay.ts` | tiled preview를 modal surface 폭에 맞춰 축소하는 display scale 계산 추가, tile coordinate layer를 내부 scale layer로 분리 |
| `src/content/overlay/crop-overlay.css` | `.crop-preview-tiled-layer`와 `.crop-preview-image[hidden]` 스타일 추가 |
| `tests/content/overlay/phase6-regression.test.ts` | tiled preview scale layer, hidden image placeholder 방지 regression 추가 |
| `mydocs/tech/task_m020_8_quality_matrix.md` | P6-41을 #41 결과 기준 OK로 갱신하고 Task #41 결과 표 추가 |
| `mydocs/working/task_m020_41_stage4.md` | Stage 4 검증 결과와 수동 smoke 결과 기록 |
| `mydocs/report/task_m020_41_report.md` | Task #41 최종 보고서 작성 |
| `mydocs/orders/20260605.md` | #41 상태를 완료로 갱신 |

## 본문 변경 정도 / 본문 무손실 여부

코드와 문서 변경이다. full page 저장 PNG 생성 알고리즘과 Save/Copy action 경로는 변경하지 않았다. Stage 4의 제품 코드 보정은 preview 표시 크기와 숨김 image placeholder에 한정된다.

## 구현 보정

- 첫 수동 smoke에서 흰색/회색 band는 사라졌지만, tiled preview가 DPR 기준 output pixel 크기를 CSS 크기로 그대로 사용해 화면이 확대되어 보였다.
- 이를 해결하기 위해 `.crop-preview-tiled` outer box는 modal surface의 가용 폭에 맞추고, 내부 `.crop-preview-tiled-layer`에 `transform: scale(...)`을 적용했다.
- tile 좌표 자체는 Stage 3에서 고정한 stitched output pixel 좌표를 유지하므로 저장 PNG와 preview edge snapping 기준은 변하지 않는다.
- 두 번째 수동 smoke에서 좌상단에 `Full page screenshot preview` alt text가 노출됐다. `.crop-preview-image { display: block; }`이 `hidden` 속성의 기본 표시 규칙을 덮었기 때문이다.
- `.crop-preview-image[hidden] { display: none; }`를 추가해 tiled mode에서 빈 단일 image alt text가 보이지 않도록 했다.

## 검증 결과

실행 명령:

```bash
npm run build
npm run typecheck
npm test
rg "debugger|<all_urls>|host_permissions|captureVisibleTab" manifest.json src tests
rg "P6-41|#41|tiled preview|crop-preview-tile|crop-preview-tiled|full page preview" src tests mydocs/tech/task_m020_8_quality_matrix.md mydocs/report/task_m020_41_report.md
git diff --check
git status --short
```

결과:

- OK: `npm run build` 통과. `dist/content/inject.js` 생성 확인.
- OK: `npm run typecheck` 통과 (`tsc --noEmit`).
- OK: `npm test` 통과. 17개 test file, 212개 test 통과.
- OK: 권한 grep에서 `debugger`, `<all_urls>` 권한 추가 없음. `captureVisibleTab` 기반 경로 유지.
- OK: `git diff --check` 통과.
- OK: 최종 문서 작성 후 P6-41/#41/tiled preview grep을 재실행해 문서와 코드 참조를 확인했다.

## 수동 smoke 결과

| 시나리오 | 결과 | 근거 |
|---|---|---|
| 긴 GitHub 페이지 full page preview 빠른 스크롤 | OK | 작업지시자 2026-06-06 수동 확인: 흰색/회색 band 미노출 |
| full page tiled preview 표시 크기 | OK | 첫 확인에서 확대 문제 발견 후 scale wrapper 보정, 작업지시자 재확인 |
| tiled mode 좌상단 placeholder | OK | 두 번째 확인에서 alt placeholder 노출 발견 후 `.crop-preview-image[hidden]` 보정, 작업지시자 재확인 |
| 저장 PNG Save 경로 | OK | Save/Copy는 기존 stitched PNG `dataUrl` 경로 유지, preview tile DOM 오염 보고 없음 |

## 잔여 위험

- tile dataUrl과 stitched PNG dataUrl을 함께 보관하므로 아주 큰 페이지에서는 preview 메모리 사용량이 증가할 수 있다. 이번 task에서는 정확성을 우선하고 virtualization은 제외했다.
- Chrome compositor artifact는 환경 의존성이 있으므로 다른 OS/GPU 조합에서는 추가 smoke가 필요할 수 있다.

## 다음 단계 영향

- 최종 보고서 승인 후 `publish/task41` 브랜치로 push하고 `devel` 대상 PR을 생성한다.
- PR 전에는 `local/task41`이 `origin/devel`보다 behind인 상태를 해소할지 판단해야 한다. 현재 변경은 `/private/tmp/crop-task41` worktree에만 있다.

## 승인 요청

- Stage 4 산출물과 최종 보고서를 승인하면 PR 게시 절차로 진행한다.
