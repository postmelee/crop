# Task #39 Stage 2 완료 보고서

GitHub Issue: [#39](https://github.com/postmelee/crop/issues/39)
구현계획서: [`task_m020_39_impl.md`](../plans/task_m020_39_impl.md)
Stage: 2

## 단계 목적

preview dialog가 화면을 과도하게 차지하지 않도록 최대 크기와 viewport backdrop 여백을 보정하고, image surface와 toolbar footer가 같은 inline padding 기준을 공유하도록 CSS 계약을 고정한다. Stage 1에서 추가한 backdrop dismiss runtime은 유지한다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `src/content/overlay/crop-overlay.css` | preview backdrop block/inline 여백과 dialog max width/height를 CSS 변수로 분리했다. desktop dialog 상한을 `1280px x 820px`로 낮추고, viewport 폭/높이 계산에서 backdrop 여백을 명시적으로 제외하게 했다. mobile media query는 같은 변수만 `16px`로 줄이도록 단순화했다. |
| `tests/content/overlay/phase6-regression.test.ts` | 기존 `1480px`/`860px`/`52px` 수치 assertion을 새 CSS 변수 기반 계약으로 갱신하고, surface/footer가 `--crop-preview-inline-padding`을 계속 공유하는지 유지했다. |

## 본문 변경 정도 / 본문 무손실 여부

코드 변경이다. preview DOM 구조, Copy/Save/Retry/Cancel action path, visible preview no-scroll 계약, full page preview 내부 scroll 계약은 유지했다. CSS 수치와 viewport 계산만 바꿨다.

## 검증 결과

실행 명령:

```bash
npm test -- tests/content/overlay/phase6-regression.test.ts
rg -n "crop-preview|crop-preview-dialog|crop-preview-inline-padding|padding|width|height|max|object-fit|overflow" src/content/overlay/crop-overlay.css tests/content/overlay/phase6-regression.test.ts
git diff --check
npm run typecheck
```

결과:

- OK: `npm test -- tests/content/overlay/phase6-regression.test.ts` 통과. 27개 테스트 통과.
- OK: `rg`에서 새 backdrop 변수, dialog max width/height, shared inline padding, visible preview `overflow: hidden`/`object-fit: contain` 계약을 확인했다.
- OK: `git diff --check` 경고 없음.
- OK: 추가 확인으로 `npm run typecheck` 통과 (`tsc --noEmit`).

## 잔여 위험

- 실제 Chrome extension visual smoke는 수행하지 않았다. extension preview는 Chrome unpacked extension context가 필요하므로 Stage 3 최종 검증 또는 작업지시자 수동 smoke 후보로 남긴다.
- Save button/image edge 정렬은 자동 CSS 계약으로는 shared inline padding을 고정했지만, 실제 이미지 aspect ratio와 viewport 높이에 따른 체감 정렬은 수동 확인이 필요하다.

## 다음 단계 영향

- Stage 3은 품질 매트릭스 P6-29b/P6-29c 주변에 backdrop dismiss와 dialog 여백 기준을 반영해야 한다.
- Stage 3 수동 smoke 후보에는 visible/full page preview에서 backdrop 영역이 충분히 남는지, dialog 내부 click은 닫히지 않는지, Save button/image edge 정렬이 체감상 맞는지 확인하는 항목을 포함한다.

## 승인 요청

- Stage 2 산출물과 검증 결과를 승인하면 Stage 3 품질 기준 갱신과 통합 검증으로 진행한다.
