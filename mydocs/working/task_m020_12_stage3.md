# Task #12 Stage 3 보고서

## 개요

Stage 3은 drag selection edge auto-scroll의 자동 회귀 조건과 수동 smoke fixture를 보강하는 단계다. Stage 2의 runtime loop가 마지막 client pointer와 최신 scroll 위치를 조합해 page 좌표를 다시 계산한다는 점을 테스트 가능한 helper로 고정했고, 긴 세로 문서와 넓은 가로 overflow 영역을 fixture에 추가했다.

## 변경 파일

| 파일 | 내용 |
|---|---|
| `src/content/overlay/edge-scroll.ts` | `getEdgeScrollPagePoint()` helper를 추가해 scroll 후 drag endpoint page 좌표 계산을 명시화했다. |
| `src/content/overlay/crop-overlay.ts` | 기존 inline page 좌표 계산을 `getEdgeScrollPagePoint()` 호출로 대체했다. 동작 변경은 없다. |
| `tests/content/overlay/edge-scroll.test.ts` | edge threshold 경계 inactive 조건과 최신 scroll 기준 page point 재계산 테스트를 추가했다. |
| `tests/content/overlay/state-machine.test.ts` | 스크롤 이후 확장된 drag endpoint도 selected rect 정규화가 유지되는지 검증했다. |
| `tests/content/overlay/phase6-regression.test.ts` | edge auto-scroll delta 활성화와 최신 scroll 기준 page point 계산을 Phase 6 회귀 묶음에 추가했다. |
| `tests/fixtures/phase6_edge_cases.html` | `edge-scroll-section`을 추가해 세로 edge auto-scroll, 가로 overflow edge auto-scroll, pointerup/Escape/Cancel cleanup 수동 smoke를 명시했다. |
| `mydocs/orders/20260529.md` | #12 상태를 Stage 3 완료 및 Stage 4 승인 대기로 갱신했다. |

## 수동 smoke 기준

`tests/fixtures/phase6_edge_cases.html#edge-scroll`에서 다음을 확인한다.

- Drag start marker에서 선택을 시작하고 pointer를 bottom edge에 유지하면 vertical edge auto-scroll이 내려간다.
- 문서를 내린 뒤 pointer를 top edge에 유지하면 vertical edge auto-scroll이 올라간다.
- 넓은 horizontal target에서 pointer를 right/left edge에 유지하면 가로 overflow 방향으로 움직인다.
- pointerup 후 자동 스크롤이 멈춘다.
- Escape 또는 Cancel 후 overlay가 제거되고 scroll loop가 남지 않는다.

## 검증 결과

```bash
npm run build
```

- OK: Vite build 통과. `dist/content/inject.js` 생성 확인.

```bash
npm run typecheck
```

- OK: TypeScript `tsc --noEmit` 통과.

```bash
npm run test
```

- OK: 12 files / 98 tests 통과.

```bash
rg "edge auto-scroll|scrollBy|horizontal|vertical|pointerup|Escape|Cancel|data-crop-fixture" tests/fixtures tests/content mydocs/working
```

- OK: fixture의 edge auto-scroll smoke 문구, horizontal/vertical target, pointerup/Escape/Cancel cleanup 문구, 기존 Stage 2 `scrollBy` 근거가 확인됐다.

```bash
git diff --check
```

- OK: whitespace 오류 없음.

## 남은 리스크

- 실제 Chrome에서 edge auto-scroll이 pointer 위치, window scroll, overlay render 타이밍과 함께 자연스럽게 동작하는지는 Stage 4 smoke에서 확인해야 한다.
- 가로 스크롤은 문서/브라우저의 horizontal overflow 조건에 영향을 받으므로 fixture 기준으로 먼저 확인한다.

## 다음 단계

Stage 4에서 Chrome unpacked extension smoke를 수행하고, 필요하면 threshold/speed/cleanup 같은 작은 UX 보정을 반영한다.
