# Task #8 Phase 6 품질 매트릭스

GitHub Issue: [#8](https://github.com/postmelee/crop/issues/8)  
구현계획서: [`task_m020_8_impl.md`](../plans/task_m020_8_impl.md)  
Fixture: [`phase6_edge_cases.html`](../../tests/fixtures/phase6_edge_cases.html)

## 목적

Phase 6에서 MVP 품질과 edge case를 같은 기준으로 반복 확인하기 위한 작업 기록이다. Stage 1에서는 검사 대상, 기대 동작, 상태 분류, 후속 분류 기준만 만든다. 실제 Chrome smoke 결과는 Stage 3에서 채운다.

## 상태 값

| 상태 | 의미 |
|---|---|
| 대기 | 아직 수동 또는 자동 검증 전 |
| OK | 기대 동작과 일치 |
| MISS | 이번 task에서 고쳐야 할 결함 후보 |
| 제한 | MVP 범위상 알려진 제한 |
| 후속 | 별도 이슈로 분리할 기능 또는 큰 결함 |

## 후속 분류 기준

| 분류 | 의미 |
|---|---|
| 이번 task | Task #8 범위에서 문구, 테스트, 저위험 보정으로 처리 |
| MVP 제한 | README 또는 보고서에 제한으로 명시 |
| 기존 후속 | 기존 follow-up 이슈로 연결 |
| 신규 후속 | 작업지시자 승인 후 새 GitHub Issue 등록 |

## 환경 기록

| 항목 | 값 |
|---|---|
| OS | macOS, 작업지시자 Chrome 수동 smoke |
| Chrome 버전 | 작업지시자 수동 smoke 통과, 버전 미기록 |
| 확장 로드 경로 | `dist/` |
| Fixture URL | `http://127.0.0.1:8765/phase6_edge_cases.html` |
| 화면 배율 / DPR | 현재 작업지시자 환경 기준 통과, 세부 DPR 미기록 |
| 브라우저 zoom | 80%, 100%, 125%, 150% |
| HiDPI 확인 | 현재 macOS/Chrome 화면 기준 수동 smoke 통과 |
| 비HiDPI 확인 | 미확인 |
| Windows / Linux 확인 | 제한: 현재 macOS 로컬 환경에서는 직접 확인 전 |

## 대상별 품질 매트릭스

| ID | 대상 | Fixture selector | 조건 | 예상 동작 | 실제 결과 | 상태 | 후속 분류 | 근거 |
|---|---|---|---|---|---|---|---|---|
| P6-01 | 일반 문서 heading | `[data-crop-fixture="document-heading"]` | zoom 100% | hover outline과 click selection이 heading의 visual rect에 맞는다. | 수동 OK | OK | 해당 없음 | 작업지시자 Stage 3 smoke |
| P6-02 | 일반 문서 section | `[data-crop-fixture="document-section"]` | zoom 80/100/125/150% | 브라우저 zoom 변경 후에도 hover와 선택 좌표가 어긋나지 않는다. | 수동 OK | OK | 해당 없음 | 작업지시자 Stage 3 smoke |
| P6-03 | 카드 UI | `[data-crop-fixture="card-primary"]` | 인접 카드 포함 | 선택 영역이 형제 카드로 새지 않는다. | 수동 OK | OK | 해당 없음 | 작업지시자 Stage 3 smoke |
| P6-04 | 중첩 버튼 | `[data-crop-fixture="nested-card-button"]` | 카드 내부 버튼 hover | 버튼과 카드 중 사용자가 가리킨 요소가 일관되게 강조된다. | 수동 OK | OK | 해당 없음 | 작업지시자 Stage 3 smoke |
| P6-05 | 버튼/아이콘 밀집 영역 | `[data-crop-fixture="button-icon-section"]` | 작은 target 연속 hover | hover highlight가 작은 버튼 사이에서 잔상 없이 이동한다. | 수동 OK | OK | 해당 없음 | 작업지시자 Stage 3 smoke |
| P6-06 | code block | `[data-crop-fixture="code-block"]` | 가로 overflow 포함 | code block의 visible rect 기준으로 선택된다. | 수동 OK | OK | 해당 없음 | 작업지시자 Stage 3 smoke |
| P6-07 | 긴 table | `[data-crop-fixture="long-table"]` | 여러 row 포함 | table 전체 또는 cell hover가 예측 가능한 rect로 표시된다. | 수동 OK | OK | 해당 없음 | 작업지시자 Stage 3 smoke |
| P6-08 | sticky header | `[data-crop-fixture="sticky-header"]` | 스크롤 후 hover | sticky 위치의 현재 viewport 좌표에 맞춰 outline이 따라온다. | 수동 OK | OK | 해당 없음 | 작업지시자 Stage 3 smoke |
| P6-09 | transform/scale 요소 | `[data-crop-fixture="transform-scale-target"]` | CSS transform 적용 | 브라우저가 반환한 visual bounding rect 기준으로 선택된다. | 자동+수동 OK | OK | 해당 없음 | `phase6-regression.test.ts`, 작업지시자 Stage 3 smoke |
| P6-10 | same-document iframe | `[data-crop-fixture="same-document-iframe"]` | iframe 내부 hover | MVP에서 iframe 내부 깊은 선택이 제한이면 iframe boundary 또는 제한으로 기록한다. | 수동 OK: MVP fallback 기준 통과 | OK | MVP 제한 후보 | 작업지시자 Stage 3 smoke |
| P6-11 | open shadow host | `[data-crop-fixture="open-shadow-host"]` | host hover | host 경계 선택이 안정적으로 동작한다. | 수동 OK | OK | 해당 없음 | 작업지시자 Stage 3 smoke |
| P6-12 | open shadow 내부 panel | `[data-crop-fixture="open-shadow-panel"]` | open shadow DOM | composed path 기반으로 내부 요소 rect가 잡히는지 확인한다. | 자동+수동 OK | OK | 해당 없음 | `phase6-regression.test.ts`, 작업지시자 Stage 3 smoke |
| P6-13 | viewport 밖 큰 요소 | `[data-crop-fixture="offscreen-large-element"]` | 우측 viewport 밖 확장 | 선택 outline은 요소 rect를 표시하되 Copy/Save 이미지는 visible viewport 교차 영역만 저장한다. | 자동+수동 OK: visible clipping 기준 통과 | OK | MVP 제한 후보 | `phase6-regression.test.ts`, 작업지시자 Stage 3 smoke |
| P6-14 | scroll tail | `[data-crop-fixture="scroll-tail"]` | 하단 스크롤 후 hover | 스크롤 위치가 반영되어 outline이 target에 맞는다. | 수동 OK | OK | 해당 없음 | 작업지시자 Stage 3 smoke |
| P6-15 | Copy 액션 | 선택 완료 후 `Copy` | zoom 100% | overlay/prompt/buttons/toast가 결과 이미지에 포함되지 않고 clipboard paste가 가능하다. | 수동 OK | OK | 해당 없음 | 작업지시자 Stage 3 smoke |
| P6-16 | Save 액션 | 선택 완료 후 `Save` | zoom 100% | overlay/prompt/buttons/toast가 결과 이미지에 포함되지 않고 PNG 다운로드가 시작된다. | 수동 OK | OK | 해당 없음 | 작업지시자 Stage 3 smoke |
| P6-17 | overlay 오염 방지 | Copy/Save 결과 | selected 상태 | crop overlay, prompt, action bar, toast가 최종 PNG에 포함되지 않는다. | 수동 OK | OK | 해당 없음 | 작업지시자 Stage 3 smoke |
| P6-18 | zoom 80% | 대표 카드 + Copy/Save | Chrome zoom 80% | 선택 rect와 저장 이미지가 동일한 visible 영역을 가리킨다. | 자동+수동 OK | OK | 해당 없음 | `crop-image.test.ts`, 작업지시자 Stage 3 smoke |
| P6-19 | zoom 100% | 대표 카드 + Copy/Save | Chrome zoom 100% | 기준 zoom에서 hover, selection, Copy, Save가 통과한다. | 자동+수동 OK | OK | 해당 없음 | `crop-image.test.ts`, 작업지시자 Stage 3 smoke |
| P6-20 | zoom 125% | 대표 카드 + Copy/Save | Chrome zoom 125% | 확대 상태에서도 source crop rect가 어긋나지 않는다. | 자동+수동 OK | OK | 해당 없음 | `crop-image.test.ts`, `phase6-regression.test.ts`, 작업지시자 Stage 3 smoke |
| P6-21 | zoom 150% | 대표 카드 + Copy/Save | Chrome zoom 150% | 큰 zoom에서도 action bar가 viewport 안에 배치되고 저장 결과가 맞다. | 자동+수동 OK | OK | 해당 없음 | `crop-image.test.ts`, 작업지시자 Stage 3 smoke |
| P6-22 | HiDPI | 대표 카드 + Copy/Save | Retina / devicePixelRatio > 1 | clipboard/download 이미지가 선택 영역과 같은 픽셀 비율로 잘린다. | 수동 OK: 현재 macOS/Chrome 화면 기준 | OK | 해당 없음 | 작업지시자 Stage 3 smoke |
| P6-23 | 비HiDPI | 대표 카드 + Copy/Save | devicePixelRatio = 1 | 가능한 환경이면 결과를 확인하고, 없으면 미확인 제한으로 기록한다. | 미확인: 현재 환경 없음 | 제한 | MVP 제한 후보 | Stage 3 환경 한계 |
| P6-24 | cross-origin iframe 후보 | 실제 웹 대표 페이지 | 외부 iframe 존재 시 | MVP 제한이면 selection boundary와 README 제한 문구로 분류한다. | 미확인: fixture 범위 밖 | 제한 | MVP 제한 후보 | Stage 4 분류 필요 |
| P6-25 | closed shadow DOM 후보 | 실제 웹 대표 페이지 | closed shadow 존재 시 | 내부 선택이 불가능하면 제한으로 기록한다. | 미확인: fixture 범위 밖 | 제한 | MVP 제한 후보 | Stage 4 분류 필요 |
| P6-26 | 역방향 드래그 선택 | fixture 일반 영역 | 포인터가 시작점보다 위/왼쪽으로 이동 | 선택 rect가 좌상단-우하단 좌표로 정규화된다. | 자동+수동 OK, 단 drag flicker는 P6-27로 분리 | OK | 해당 없음 | `state-machine.test.ts`, 작업지시자 Stage 3 smoke |
| P6-27 | drag selection flicker | fixture 일반 영역 | 드래그 선택 중 | 선택 중 불필요한 흰색 가로선이 반짝이지 않는다. | Stage 4 CSS 보정 적용, 수동 재확인 필요 | MISS | 이번 task | 작업지시자 Stage 3 smoke, `crop-overlay.css` |
| P6-28 | Firefox식 선택 후 편집 UI parity | 실제 웹 대표 페이지 | 요소 클릭 후 selected 상태 | resize handle, 점선 표시, 이미지 사이즈 badge, Firefox식 Copy/Save 버튼을 제공한다. | 현재 MVP 미구현, 일부는 #13과 연결, size badge/button parity는 신규 후속 후보 | 후속 | 기존 후속 + 신규 후속 후보 | 작업지시자 첨부 이미지, #13 |

## 수동 smoke 절차 초안

1. `npm run build` 후 Chrome `chrome://extensions`에서 `dist/`를 reload한다.
2. Fixture를 로컬 파일 또는 정적 서버로 연다.
3. 확장 아이콘 또는 `Command+Shift+P`로 crop overlay를 실행한다.
4. 각 `data-crop-fixture` target을 hover, click selection, 박스 외 클릭 복귀, Cancel로 확인한다.
5. 대표 target에서 `Copy` 후 이미지 paste를 확인한다.
6. 대표 target에서 `Save` 후 PNG 다운로드를 확인한다.
7. Chrome zoom 80%, 100%, 125%, 150%에서 대표 target의 Copy/Save를 반복한다.
8. overlay, prompt, action bar, toast가 결과 이미지에 포함되는지 확인한다.

## Stage별 갱신 계획

| Stage | 갱신 내용 |
|---|---|
| Stage 1 | 본 matrix 구조와 fixture selector 확정 |
| Stage 2 | 자동 테스트로 확인한 항목의 근거 보강 |
| Stage 3 | Chrome manual smoke 실제 결과와 상태 갱신 |
| Stage 4 | MISS/제한/후속 항목 분류와 README 후보 문구 반영 |
| Stage 5 | 최종 수용 기준 결과와 PR 요약에 사용할 링크 정리 |

## Stage 2 자동 검증 결과

| 항목 | 결과 | 근거 |
|---|---|---|
| viewport 밖 page selection의 visible clipping과 screenshot source mapping | OK | `tests/content/overlay/phase6-regression.test.ts` |
| zoom-like screenshot natural size와 CSS viewport 비율 mapping | OK | `tests/shared/crop-image.test.ts`, `tests/content/overlay/phase6-regression.test.ts` |
| transform/scale 요소의 visual bounding rect 사용 | OK | `tests/content/overlay/phase6-regression.test.ts` |
| nested open shadow root hit-test traversal | OK | `tests/content/overlay/phase6-regression.test.ts` |
| 역방향 드래그 선택 rect 정규화 | OK | `tests/content/overlay/state-machine.test.ts` |

## Stage 3 수동 smoke 결과

| 항목 | 결과 | 근거 |
|---|---|---|
| fixture 확인 항목 전체 | OK | 작업지시자 2026-05-29 수동 smoke |
| Chrome zoom 80%, 100%, 125%, 150% | OK | 작업지시자 2026-05-29 수동 smoke |
| Copy/Save와 overlay 오염 방지 | OK | 작업지시자 2026-05-29 수동 smoke |
| drag selection 중 흰색 가로선 flicker | MISS | Stage 4에서 저위험 CSS 보정 가능 여부 판단 |
| Firefox식 selected-state resize handle, 점선, size badge, 버튼 parity | 후속 | 현재 Task #8은 Phase 6 품질 검증 범위이므로 신규 후속 후보로 분리 |

## Stage 4 분류 결과

| 항목 | 분류 | 처리 |
|---|---|---|
| P6-27 drag selection 흰색 가로선 flicker | 이번 task 결함 | drag 중 전체 viewport frame이 노출되지 않도록 `.crop-frame`을 dragging 상태에서 숨김. 수동 재 smoke 필요. |
| P6-23 비HiDPI 확인 | 검증 한계 | 현재 환경에서 미확인. README와 최종 보고서에 검증 한계로 기록. |
| P6-24 cross-origin iframe 후보 | MVP 제한 / 기존 후속 | [#14](https://github.com/postmelee/crop/issues/14) `Follow-up: iframe/nested context 요소 선택 지원`으로 연결. |
| P6-25 closed shadow DOM 후보 | MVP 제한 / 기존 후속 | Chrome MV3 접근 제약으로 README 제한 문구에 기록. 필요 시 #14 범위에서 함께 검토. |
| P6-28 resize/move handles와 keyboard 조정 | 기존 후속 | [#13](https://github.com/postmelee/crop/issues/13) `Follow-up: 선택 영역 resize/move handles와 keyboard 조정 구현`으로 연결. |
| P6-28 size badge와 Copy/Save button parity | 신규 후속 후보 | 새 이슈 생성은 작업지시자 별도 승인 후 진행. |
| edge auto-scroll | 기존 후속 | [#12](https://github.com/postmelee/crop/issues/12) `Follow-up: 드래그 선택 edge auto-scroll 구현`으로 연결. |
| viewport 밖 전체 이미지 저장 / full page | 기존 후속 | [#15](https://github.com/postmelee/crop/issues/15) `Follow-up: full page capture와 scroll stitching 구현`으로 연결. |

## 신규 후속 이슈 후보

제목 후보: `Follow-up: Firefox식 selected-state size badge와 action button parity 구현`

범위 후보:

- 요소 클릭 또는 드래그 선택 후 selected 상태에서 이미지 크기 badge를 표시한다.
- Firefox 원본에 가까운 selected-state action toolbar 스타일을 적용한다.
- Copy/Save/Cancel button label, icon, spacing, focus state를 Firefox식 selected UI에 맞춘다.
- #13 resize/move handles와 충돌하지 않도록 handle hit-test 영역과 toolbar 배치를 분리한다.
- Copy/Save capture 결과에는 size badge, handle, action toolbar가 포함되지 않아야 한다.
