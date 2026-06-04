# Task #39 최종 보고서 - Preview 모달 backdrop dismiss와 inline padding 정렬

GitHub Issue: [#39](https://github.com/postmelee/crop/issues/39)
마일스톤: M020

## 작업 요약

- 대상 이슈: #39
- 마일스톤: M020
- 단계 수: 4
- 작업 목적: visible/full page preview 모달에서 backdrop dismiss를 지원하고, dialog 크기와 shared inline padding 기준 및 visible preview 하단 padding 체감을 보정한다.

## 변경 파일 목록과 영향 범위

| 경로 | 변경 요약 | 영향 범위 |
|---|---|---|
| `src/content/overlay/crop-overlay.ts` | preview 결과가 있고 pending action이 아닐 때 `.crop-preview` 직접 click만 `requestClose()`로 처리하는 backdrop dismiss 분기를 추가했다. | preview modal event handling |
| `src/content/overlay/crop-overlay.css` | preview backdrop 여백과 dialog max size를 CSS 변수로 분리하고 dialog 상한을 `1280px x 820px`로 낮췄다. surface/footer shared inline padding은 유지했고, visible preview dialog는 content height 기반으로 줄어들게 보정했다. | preview modal layout |
| `tests/content/overlay/phase6-regression.test.ts` | backdrop dismiss event order, pending guard, direct backdrop target helper, dialog sizing 변수, shared inline/bottom padding 계약, visible dialog auto-height 계약을 회귀 테스트로 고정했다. | automated regression |
| `mydocs/tech/task_m020_8_quality_matrix.md` | P6-29b/P6-29c를 #39 기준으로 갱신하고 P6-29d 및 Task #39 결과를 추가했다. 후속으로 visible preview 하단 padding 보정 기준을 P6-29b와 Task #39 결과에 반영했다. | internal quality matrix |
| `mydocs/working/task_m020_39_stage1.md` | Stage 1 완료 보고서 작성. | task record |
| `mydocs/working/task_m020_39_stage2.md` | Stage 2 완료 보고서 작성. | task record |
| `mydocs/working/task_m020_39_stage3.md` | Stage 3 완료 보고서 작성. | task record |
| `mydocs/working/task_m020_39_stage4.md` | Stage 4 후속 보정 완료 보고서 작성. | task record |
| `mydocs/report/task_m020_39_report.md` | 최종 결과와 수용 기준별 검증 결과를 정리했다. | task record |
| `mydocs/orders/20260604.md` | #39 상태를 진행중에서 완료로 갱신했다. | daily task board |

## 문서 위치 검증

| 파일 | 계획된 위치 | 실제 위치 | 결과 | 근거 |
|---|---|---|---|---|
| `mydocs/tech/task_m020_8_quality_matrix.md` | `mydocs/tech/` | `mydocs/tech/task_m020_8_quality_matrix.md` | OK | 수행계획서와 구현계획서 모두 품질 기준은 내부 매트릭스에 최소 갱신하기로 했다. |
| README 계열 | 수정 없음 | 수정 없음 | OK | backdrop dismiss와 padding 보정은 사용자 사용법 문서에 새 설명이 필요한 기능이 아니므로 제외 범위를 지켰다. |

## 변경 전·후 정량 비교

| 지표 | 변경 전 | 변경 후 |
|---|---|---|
| Preview dialog desktop max width | `1480px` | `1280px` |
| Preview dialog desktop max height | `860px` | `820px` |
| Preview backdrop horizontal margin | 고정 `52px` 기반 | `clamp(64px, 10vw, 144px)` |
| Preview backdrop bottom margin | `56px` | horizontal margin과 같은 `--crop-preview-backdrop-inline` 기준 |
| Visible preview dialog height | 고정 dialog height 기반 | content height `auto` + 기존 max-height 상한 |
| Preview backdrop dismiss test | 없음 | `phase6-regression.test.ts`에 direct backdrop click 계약 추가 |
| Phase 6 preview criteria | P6-29b/P6-29c | P6-29b/P6-29c 보강 + P6-29d 추가 |

## 검증 결과

| 수용 기준 | 결과 |
|---|---|
| preview backdrop 직접 클릭은 overlay를 제거한다 | OK — `handleClick`에서 `previewCaptureResult && !pendingCapture && isPreviewBackdropEvent(event)` 조건으로 `requestClose()`를 호출한다. |
| preview dialog 내부 클릭은 overlay를 닫지 않는다 | OK — helper가 composed path 첫 target의 `.crop-preview`만 인정하고 내부 요소는 `isCropOverlayEvent()` 소비 또는 action path를 유지한다. |
| Copy/Save/Retry/Cancel과 keyboard shortcut은 기존처럼 동작한다 | OK — action/mode 처리 후 backdrop 분기를 두고 `startPreviewAction(action)` 경로를 유지한다. |
| preview surface wheel은 page scroll로 새지 않는다 | OK — 기존 `handleWheel`/`isPreviewScrollableEvent` 계약 유지, phase6 regression 통과. |
| Copy/Save 처리 중 backdrop click이 중복 cleanup을 만들지 않는다 | OK — `pendingCapture` guard를 backdrop dismiss 조건에 포함했다. |
| dialog가 화면을 과도하게 채우지 않고 backdrop 영역을 유지한다 | OK — dialog max size와 backdrop margin CSS 변수를 추가하고 regression으로 고정했다. 실제 visual smoke는 수동 후보로 남김. |
| Save button edge와 image edge가 같은 inline padding 기준을 사용한다 | OK — surface/footer가 `--crop-preview-inline-padding`을 공유한다. 실제 visual smoke는 수동 후보로 남김. |
| visible preview 이미지 아래 padding이 양옆 padding과 같은 기준으로 보인다 | OK — visible dialog는 `height: auto`로 content height에 맞추고, surface bottom padding은 `--crop-preview-inline-padding`을 사용한다. 실제 visual smoke는 수동 후보로 남김. |
| 권한 경계가 유지된다 | OK — `debugger`, `<all_urls>`, broad `host_permissions` 추가 없음. |

### 단계별 검증 결과

- Stage 1: [task_m020_39_stage1.md](../working/task_m020_39_stage1.md) — focused phase6 regression, runtime grep, diff check, typecheck 통과.
- Stage 2: [task_m020_39_stage2.md](../working/task_m020_39_stage2.md) — focused phase6 regression, CSS grep, diff check, typecheck 통과.
- Stage 3: [task_m020_39_stage3.md](../working/task_m020_39_stage3.md) — build, typecheck, full test, quality/permission grep, diff check 통과.
- Stage 4: [task_m020_39_stage4.md](../working/task_m020_39_stage4.md) — focused phase6 regression, CSS/문서 grep, build, typecheck, diff check 통과.

## 잔여 위험과 후속 작업

### 잔여 위험

- 실제 Chrome unpacked extension visual smoke는 수행하지 않았다. 자동 검증은 event/CSS/source 계약을 고정했지만, 사용자가 보는 dialog 크기, edge alignment, visible preview 하단 padding의 최종 체감은 수동 smoke로 확인해야 한다.
- 모바일 좁은 viewport에서는 backdrop target과 이미지 표시 면적 사이 tradeoff가 남는다. 현재는 최소 `16px` backdrop margin을 유지한다.

### 후속 작업 후보

- PR 또는 수동 smoke에서 dialog 크기 체감 피드백이 나오면 `--crop-preview-dialog-max-*`, `--crop-preview-backdrop-*`, visible preview height rule만 좁게 조정한다.

## 작업지시자 승인 요청

- 최종 보고서와 수용 기준 검증 결과를 승인하면 PR 게시 절차로 진행한다.
