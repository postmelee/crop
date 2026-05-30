# Task #12 Stage 4 보고서

## 개요

Stage 4는 Chrome unpacked extension에서 drag selection edge auto-scroll을 smoke하고, 실제 UX에서 발견된 작은 결함을 보정하는 단계다. 작업지시자가 fixture 기준 수동 smoke를 직접 수행했고, edge auto-scroll 주요 확인 항목은 모두 통과했다. 다만 드래그 중 흰색 vertical line이 순간적으로 보이는 flicker가 재발해 CSS 표시 조건을 보정했다.

## 변경 파일

| 파일 | 내용 |
|---|---|
| `src/content/overlay/crop-overlay.css` | `.crop-frame`을 `draggingReady` 상태에서도 숨기도록 확장해 드래그 threshold 진입 전 viewport frame이 보이는 flicker를 줄였다. |
| `mydocs/orders/20260529.md` | #12 상태를 Stage 4 보정 완료 및 Stage 5 승인 대기로 갱신했다. |
| `mydocs/working/task_m020_12_stage4.md` | Stage 4 smoke 결과와 UX 보정 내용을 기록했다. |

## 수동 smoke 결과

작업지시자 확인 결과:

| 번호 | 항목 | 결과 |
|---|---|---|
| 1 | 확장 reload 후 `Cmd+Shift+P` overlay 실행 | OK |
| 2 | 아래 edge auto-scroll | OK |
| 3 | 위 edge auto-scroll | OK |
| 4 | 오른쪽 edge auto-scroll | OK |
| 5 | 왼쪽 edge auto-scroll | OK |
| 6 | pointerup cleanup | OK |
| 7 | Escape cleanup | OK |
| 8 | Cancel cleanup | OK |
| 9 | 기본 클릭/짧은 드래그 선택 회귀 | OK |
| 10 | Copy/Save 회귀 | OK |
| 11 | `debugger`, `<all_urls>` 권한 회귀 없음 | OK |

추가 보고:

- MISS: 드래그 중 흰색 vertical line이 순간적으로 반짝이는 현상이 재발했다.
- 분석: `.crop-frame`은 Stage #8에서 `dragging` 상태에서만 숨기도록 보정되어 있었다. 하지만 pointerdown 직후부터 40px threshold를 넘기 전까지 overlay 상태는 `draggingReady`이므로, 이 짧은 구간에는 viewport frame이 계속 보일 수 있다.
- 보정: `.crop-frame` 숨김 selector에 `:host([data-crop-state="draggingReady"])`를 추가했다.

## 검증 결과

```bash
npm run build
```

- OK: Vite build 통과. `dist/content/inject.js`가 갱신됐다.

```bash
npm run typecheck
```

- OK: TypeScript `tsc --noEmit` 통과.

```bash
npm run test
```

- OK: 12 files / 98 tests 통과.

```bash
rg "edge|scroll|drag|Escape|Cancel|Copy|Save|debugger|<all_urls>" src tests README.md mydocs manifest.json
```

- OK: edge/scroll/drag cleanup, Copy/Save, 권한 제한 관련 문구와 구현 경계가 확인됐다.

```bash
git diff --check
```

- OK: whitespace 오류 없음.

## 남은 리스크

- `.crop-frame` flicker 보정은 원인에 맞춘 CSS 수정이지만, 수정 후 실제 Chrome 화면 재확인은 아직 작업지시자에게 다시 받지 않았다.
- Chrome drag/scroll 타이밍은 환경 영향을 받을 수 있으므로 Stage 5 최종 보고 전 한 번 더 `phase6_edge_cases.html#edge-scroll`에서 flicker 재확인을 권장한다.
- resize handles, selected-state size badge, full page capture, scroll stitching은 기존 후속 이슈 범위이며 이번 Stage에서 확장하지 않았다.

## 다음 단계

Stage 5에서 README, 최종 보고서, 통합 검증을 수행한다. 최종 보고서에는 edge auto-scroll smoke 통과, `draggingReady` flicker 보정, 그리고 수정 후 최종 시각 재확인 필요 여부를 명시한다.
