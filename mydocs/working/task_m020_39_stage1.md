# Task #39 Stage 1 완료 보고서

GitHub Issue: [#39](https://github.com/postmelee/crop/issues/39)
구현계획서: [`task_m020_39_impl.md`](../plans/task_m020_39_impl.md)
Stage: 1

## 단계 목적

preview 모달이 열린 상태에서 모달 밖 어두운 backdrop 직접 클릭을 `Esc`/Cancel과 같은 overlay cleanup 경로로 연결한다. 이번 단계는 runtime event contract에 한정하고, dialog 크기와 padding 보정은 Stage 2로 남긴다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `src/content/overlay/crop-overlay.ts` | preview 결과가 있고 action pending 상태가 아닐 때 `.crop-preview` backdrop 직접 클릭만 `requestClose()`로 처리하는 분기를 추가했다. |
| `tests/content/overlay/phase6-regression.test.ts` | action/mode 처리 이후, 일반 overlay event 소비 이전에 backdrop dismiss 분기가 위치하는지와 pending guard, `requestClose()` 재사용, 직접 backdrop target 판정 계약을 회귀 테스트로 고정했다. |

## 본문 변경 정도 / 본문 무손실 여부

코드 변경이다. 기존 Copy/Save/Retry/Cancel action path, mode button path, preview wheel handling, selected outside reset 흐름은 유지했다. 새 helper는 composed path의 첫 target이 `.crop-preview`인 경우만 backdrop으로 인정해 `.crop-preview-dialog` 내부 click과 충돌하지 않게 했다.

## 검증 결과

실행 명령:

```bash
npm test -- tests/content/overlay/phase6-regression.test.ts
rg -n "requestClose|crop-preview|backdrop|pendingCapture|handleClick|handlePointerDown|isPreviewBackdrop" src/content/overlay tests/content/overlay
git diff --check
npm run typecheck
```

결과:

- OK: `npm test -- tests/content/overlay/phase6-regression.test.ts` 통과. 1차 실행에서 테스트가 `handlePointerDown` 쪽 `isCropOverlayEvent`를 잘못 잡아 실패했으나, `handleClick` backdrop 분기 이후부터 탐색하도록 테스트를 보정한 뒤 27개 테스트가 모두 통과했다.
- OK: `rg`에서 `handleClick` 내 `previewCaptureResult && !pendingCapture && isPreviewBackdropEvent(event)` guard, `requestClose()` 호출, direct `.crop-preview` helper, 기존 preview/action 관련 경로가 확인됐다.
- OK: `git diff --check` 경고 없음.
- OK: 추가 확인으로 `npm run typecheck` 통과 (`tsc --noEmit`).

## 잔여 위험

- 실제 브라우저에서 backdrop click smoke는 아직 수행하지 않았다. Stage 2 레이아웃 보정 후 visible/full page preview에서 함께 확인해야 한다.
- dialog가 화면을 과도하게 차지하는 문제와 Save button/image edge 정렬은 Stage 2 범위로 남아 있다.

## 다음 단계 영향

- Stage 2는 `.crop-preview` backdrop click target이 충분히 남도록 dialog 최대 크기와 viewport padding을 조정해야 한다.
- Stage 2에서 CSS 수치가 바뀌면 `phase6-regression.test.ts`의 기존 preview dialog assertion을 새 계약으로 갱신해야 한다.

## 승인 요청

- Stage 1 산출물과 검증 결과를 승인하면 Stage 2 preview dialog 크기와 inline padding 보정으로 진행한다.
