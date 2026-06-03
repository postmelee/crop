# Task #24 최종 보고서

GitHub Issue: [#24](https://github.com/postmelee/crop/issues/24)
수행계획서: [`task_m020_24.md`](../plans/task_m020_24.md)
구현계획서: [`task_m020_24_impl.md`](../plans/task_m020_24_impl.md)
마일스톤: M020
상태: PR 게시 승인 대기

## 요약

너무 큰 wrapper를 자동 선택 후보로 만들던 `getBestRectForElement()` fallback 경로를 제거했다. 이제 `MAX_DETECT_WIDTH`/`MAX_DETECT_HEIGHT`를 초과하는 초기 wrapper는 viewport/maxDetect 크기로 잘린 후보를 반환하지 않고, 큰 parent를 만나기 전 이미 확보한 실제 콘텐츠 후보는 유지한다.

NamuWiki 유사 레이아웃을 대비해 Phase 6 fixture에 큰 wrapper, 내부 infobox table, 내부 card target을 추가했고, wrapper 후보 없음 시 hover highlight가 초기화되는 상태 전이도 regression으로 고정했다. Chrome MV3 권한과 Firefox-derived MPL boundary는 유지했다.

## 작업 요약

- 대상 이슈: #24
- 마일스톤: M020
- 단계 수: 4
- 작업 목적: 너무 큰 wrapper 자동 추천을 제외하고 내부 실제 요소 선택과 Copy/Save rect 기준을 유지한다.

## 변경 파일 목록과 영향 범위

| 경로 | 변경 요약 | 영향 범위 |
|---|---|---|
| `src/firefox-derived/overlay-helpers.ts` | 큰 요소를 viewport/maxDetect 크기로 잘라 후보화하던 fallback 제거 | Firefox-derived element selection helper |
| `tests/firefox-derived/overlay-helpers.test.ts` | 큰 wrapper 후보 없음, 내부 card/table 후보 유지, threshold override 회귀 테스트 추가/수정 | helper 단위 테스트 |
| `tests/content/overlay/phase6-regression.test.ts` | wrapper 후보 없음 시 hover 초기화, 내부 table/card 후보 유지, fixture target 존재 검증 추가 | Phase 6 overlay regression |
| `tests/fixtures/phase6_edge_cases.html` | 너무 큰 wrapper, 내부 infobox table, 내부 card smoke target 추가 | fixture smoke |
| `mydocs/tech/task_m020_8_quality_matrix.md` | P6-37/P6-38, #24 검증 근거와 smoke 절차 추가 | 내부 품질 기준 |
| `mydocs/plans/task_m020_24.md`, `mydocs/plans/task_m020_24_impl.md` | 수행계획서와 구현계획서 작성 | 작업 산출물 |
| `mydocs/working/task_m020_24_stage{1..4}.md` | 단계별 완료 보고서 작성 | 작업 산출물 |
| `mydocs/report/task_m020_24_report.md`, `mydocs/orders/20260602.md` | 최종 보고서와 오늘할일 완료 처리 | 작업 산출물 |

## 문서 위치 검증

| 파일 | 계획된 위치 | 실제 위치 | 결과 | 근거 |
|---|---|---|---|---|
| `mydocs/tech/task_m020_8_quality_matrix.md` | `mydocs/tech/` | `mydocs/tech/` | OK | 수행계획서의 내부 품질 기준 위치와 일치 |
| `mydocs/report/task_m020_24_report.md` | `mydocs/report/` | `mydocs/report/` | OK | 하이퍼-워터폴 최종 보고서 위치 |
| `mydocs/orders/20260602.md` | `mydocs/orders/` | `mydocs/orders/` | OK | 오늘할일 완료 처리 위치 |

## 변경 전·후 정량 비교

| 지표 | 변경 전 | 변경 후 |
|---|---|---|
| 큰 초기 wrapper 후보 | viewport/maxDetect fallback rect 반환 가능 | `null` 반환으로 자동 추천 제외 |
| 큰 parent 내부 실제 후보 | 직전 후보 유지 경로 존재 | 직전 후보 유지 경로 명시 테스트 |
| Phase 6 wrapper 품질 항목 | 없음 | P6-37/P6-38 추가 |
| 자동 테스트 | task 시작 전 기준 미기록 | 16개 파일 186개 테스트 통과 |
| MV3 권한 | `activeTab`, `scripting`, `clipboardWrite`, `downloads` | 동일, `debugger`/`<all_urls>` 미추가 |

## 단계 산출물

| Stage | 보고서 | 요약 |
|---|---|---|
| Stage 1 | [`task_m020_24_stage1.md`](../working/task_m020_24_stage1.md) | 큰 wrapper fallback 제거와 helper 단위 테스트 보정 |
| Stage 2 | [`task_m020_24_stage2.md`](../working/task_m020_24_stage2.md) | Phase 6 fixture와 overlay hover null regression 보강 |
| Stage 3 | [`task_m020_24_stage3.md`](../working/task_m020_24_stage3.md) | 품질 매트릭스와 권한/MPL 경계 정리 |
| Stage 4 | [`task_m020_24_stage4.md`](../working/task_m020_24_stage4.md) | 최종 검증, 최종 보고서, 오늘할일 완료 처리 |

## 수용 기준 결과

| 수용 기준 | 결과 |
|---|---|
| 너무 큰 wrapper 위에 커서를 올려도 자동 선택 박스가 큰 빈 영역으로 생성되지 않는다. | OK — `overlay-helpers.test.ts`와 `phase6-regression.test.ts`에서 큰 wrapper 후보 없음과 hover 초기화를 검증했다. |
| 너무 큰 wrapper 내부의 적절한 실제 요소는 여전히 자동 선택 가능하다. | OK — 내부 card/table 후보 유지 테스트와 `too-large-wrapper-card`, `too-large-wrapper-infobox` fixture를 추가했다. |
| NamuWiki 유사 레이아웃에서 infobox/table 계열 요소는 정상 rect로 선택된다. | OK — table/infobox 후보 유지 단위 테스트와 Phase 6 regression으로 고정했다. |
| Copy/Save 결과가 잘못된 wrapper fallback rect가 아니라 실제 선택 rect 기준으로 생성된다. | OK — wrapper fallback rect가 제거됐고 기존 `crop-image.test.ts`, `phase6-regression.test.ts`가 통과했다. |
| Firefox-derived 코드 출처와 MPL 분리 정책을 유지한다. | OK — `overlay-helpers.ts` MPL header와 `src/firefox-derived/` boundary 유지, 새 외부 원문 복사 없음. |
| `debugger`, `<all_urls>` 또는 broad host permission이 추가되지 않는다. | OK — `manifest.json` 권한 변경 없음, `phase6-regression.test.ts` 권한 회귀 통과. |

## 자동 검증

최근 통과 명령:

```bash
npm run build
npm run typecheck
npm test
rg "wrapper|자동 추천|too large|MAX_DETECT|debugger|<all_urls>|#24" mydocs src tests manifest.json
git status --short
git diff --check
```

결과:

- OK: `npm run build` 통과.
- OK: `npm run typecheck` 통과.
- OK: `npm test` 16개 파일 186개 테스트 통과.
- OK: Stage 4 grep에서 wrapper 정책, #24 문서/테스트, 권한 회귀 테스트, `MAX_DETECT` 기준을 확인했다.
- OK: 검증 시점의 `git status --short`는 빈 출력이었다.
- OK: `git diff --check` 통과.

### 단계별 검증 결과

- Stage 1: [`task_m020_24_stage1.md`](../working/task_m020_24_stage1.md) — typecheck, helper 단위 테스트 28개, policy grep, diff check 통과.
- Stage 2: [`task_m020_24_stage2.md`](../working/task_m020_24_stage2.md) — build, typecheck, 전체 테스트 186개, fixture/runtime grep, diff check 통과.
- Stage 3: [`task_m020_24_stage3.md`](../working/task_m020_24_stage3.md) — build, typecheck, 전체 테스트 186개, 권한/source grep, diff check 통과.
- Stage 4: [`task_m020_24_stage4.md`](../working/task_m020_24_stage4.md) — build, typecheck, 전체 테스트 186개, 최종 grep/status/diff check 통과.

## 직접 smoke 체크리스트

Fixture URL 후보:

```text
http://127.0.0.1:5176/tests/fixtures/phase6_edge_cases.html
```

확인 항목:

1. `npm run build` 후 Chrome `chrome://extensions`에서 `dist/` 확장을 reload한다.
2. fixture를 열고 확장 아이콘 또는 `Command+Shift+S`로 crop overlay를 실행한다.
3. `too-large-wrapper`의 빈 wrapper 영역을 hover했을 때 큰 선택 박스가 생성되지 않는지 확인한다.
4. `too-large-wrapper-infobox`를 hover했을 때 table/infobox가 정상 선택되는지 확인한다.
5. `too-large-wrapper-card`를 hover했을 때 내부 card가 정상 선택되는지 확인한다.
6. 대표 target에서 Copy/Save 결과가 선택 rect와 일치하고 overlay controls가 포함되지 않는지 확인한다.

## 검증 한계와 잔여 위험

- 실제 NamuWiki `턴스타일` 페이지 수동 smoke는 아직 수행하지 않았다. 이번 task는 NamuWiki 유사 fixture와 helper/runtime regression으로 정책을 고정했다.
- table/infobox가 `maxDetect` threshold 자체를 초과하는 극단적 레이아웃에서는 자동 후보에서 제외될 수 있다. 이 경우 threshold 정책 또는 별도 element-specific heuristic은 후속 task에서 판단한다.

## 후속 작업 후보

- 실제 NamuWiki 페이지 smoke에서 추가 오탐이 확인되면 해당 DOM 구조를 Phase 6 fixture에 축소 재현해 별도 이슈로 처리한다.

## PR 요약 후보

- Remove viewport/maxDetect fallback rect generation for too-large auto-selection wrappers.
- Keep existing smaller candidates when traversal reaches a too-large parent.
- Add wrapper/infobox/card regression coverage and Phase 6 fixture targets.
- Update the Phase 6 quality matrix with #24 policy and verification evidence.

## 작업지시자 승인 요청

- 최종 보고서와 수용 기준 검증 결과를 승인하면 `publish/task24` 브랜치를 게시하고 `devel` 대상 PR을 생성한다.
