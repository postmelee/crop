# Task #4 최종 보고서

GitHub Issue: [#4](https://github.com/postmelee/crop/issues/4)
마일스톤: M010

## 작업 요약

- 대상 이슈: #4
- 마일스톤: M010
- 단계 수: 4
- 작업 목적: Firefox Screenshots의 요소 선택 helper를 Chrome MV3 MVP에 맞는 visible viewport 기반 TypeScript helper로 포팅한다.

## 변경 파일 목록과 영향 범위

| 경로 | 변경 요약 | 영향 범위 |
|---|---|---|
| `NOTICE` | Mozilla Firefox Screenshots upstream commit, source path, local adaptation target 기록 | 라이선스/출처 고지 |
| `THIRD_PARTY.md` | `overlayHelpers.mjs` primary source, local target별 modification summary, 제외 upstream source 기록 | 제3자 출처 추적 |
| `src/firefox-derived/README.md` | Firefox-derived source boundary, Task #4 upstream source, local target, 제외 범위 기록 | 기여자 소스 경계 안내 |
| `src/firefox-derived/window-dimensions.ts` | viewport/page viewport dimensions, rect normalize/intersection/clip, window-like reader 구현 | Firefox-derived geometry helper |
| `src/firefox-derived/region.ts` | viewport-clamped region model, width/height/area/distance, containment/intersection 구현 | Firefox-derived geometry helper |
| `src/firefox-derived/overlay-helpers.ts` | 일반 DOM/open shadow hit-test, iframe fallback, `getBestRectForElement`, small/large/heading/article 휴리스틱 구현 | Firefox-derived selection helper |
| `tests/firefox-derived/window-dimensions.test.ts` | WindowDimensions와 rect helper fixture 검증 | 자동 테스트 |
| `tests/firefox-derived/region.test.ts` | Region geometry fixture 검증 | 자동 테스트 |
| `tests/firefox-derived/dom-fixtures.ts` | jsdom 없는 DOM test double 제공 | 자동 테스트 인프라 |
| `tests/firefox-derived/overlay-helpers.test.ts` | hit-test와 rect 휴리스틱 검증 | 자동 테스트 |
| `package.json` | `npm run test`와 `vitest` dev dependency 추가 | 테스트 실행 환경 |
| `package-lock.json` | `vitest@3.2.4` dependency tree 고정 | 재현 가능한 설치 |
| `mydocs/plans/task_m010_4.md` | 수행계획서 작성 | Hyper-Waterfall 작업 추적 |
| `mydocs/plans/task_m010_4_impl.md` | 단계별 구현계획서 작성 | Hyper-Waterfall 작업 추적 |
| `mydocs/working/task_m010_4_stage1.md` | Stage 1 완료 보고서 작성 | 단계 검증 기록 |
| `mydocs/working/task_m010_4_stage2.md` | Stage 2 완료 보고서 작성 | 단계 검증 기록 |
| `mydocs/working/task_m010_4_stage3.md` | Stage 3 완료 보고서 작성 | 단계 검증 기록 |
| `mydocs/orders/20260527.md` | #4 오늘할일 완료 처리 | 작업 상태 기록 |

## 문서 위치 검증

| 파일 | 계획된 위치 | 실제 위치 | 결과 | 근거 |
|---|---|---|---|---|
| `NOTICE` | 루트 `NOTICE` | `NOTICE` | OK | 수행계획서의 문서 위치 판단과 일치한다. |
| `THIRD_PARTY.md` | 루트 `THIRD_PARTY.md` | `THIRD_PARTY.md` | OK | 수행계획서의 제3자 출처 기록 위치와 일치한다. |
| `src/firefox-derived/README.md` | `src/firefox-derived/README.md` | `src/firefox-derived/README.md` | OK | Firefox-derived 디렉터리 내부 정책을 소스 가까이에 둔다는 판단과 일치한다. |
| 공식 제품 문서 루트 | 해당 없음 | 해당 없음 | OK | 이번 task는 `docs/`, `site/`, `website/`, `adr/` 같은 제품 문서 루트를 만들지 않았다. |
| `task_m010_4_report.md` | `mydocs/report/` | `mydocs/report/task_m010_4_report.md` | OK | 최종 보고서 템플릿 위치 정책과 일치한다. |

## 변경 전·후 정량 비교

| 지표 | 변경 전 | 변경 후 |
|---|---|---|
| Firefox-derived TypeScript helper | 없음 | `overlay-helpers.ts` 369줄, `region.ts` 210줄, `window-dimensions.ts` 293줄 |
| Firefox-derived helper 테스트 | 없음 | 3개 test file, 25개 test |
| 테스트 스크립트 | 없음 | `npm run test` (`vitest run`) |
| Stage 보고서 | 없음 | Stage 1~3 보고서 3개, 총 237줄 |
| upstream source 기록 | planned source adaptation | commit `e28b34ab33dbf49364999070168cbb7e11e8e5bd`와 `overlayHelpers.mjs` 고정 |

## 검증 결과

| 수용 기준 | 결과 |
|---|---|
| `npm run build` 통과 | OK — Vite v6.4.2 production build 성공, 기존 `dist/manifest.json`, `dist/background/service-worker.js`, `dist/content/inject.js` 산출 구조 유지 |
| `npm run typecheck` 통과 | OK — `tsc --noEmit` 성공 |
| `npm run test` 통과 | OK — Vitest v3.2.4, 3개 test file, 25개 test 통과 |
| Firefox-derived source boundary 유지 | OK — derived source는 `src/firefox-derived/` 아래에만 추가했고 Chrome runtime entrypoint는 수정하지 않음 |
| MPL 2.0 고지 유지 | OK — `src/firefox-derived/*.ts`, `NOTICE`, `THIRD_PARTY.md`, `src/firefox-derived/README.md`에서 MPL/source 기록 확인 |
| upstream source 고정 | OK — `mozilla-firefox/firefox` commit `e28b34ab33dbf49364999070168cbb7e11e8e5bd`의 `browser/components/screenshots/overlayHelpers.mjs`를 기록 |
| 일반 DOM/open shadow hit-test helper 구현 | OK — `getElementFromPoint()`와 open shadow fixture 테스트 통과 |
| unsupported iframe fallback | OK — 일반 DOM과 open shadow 내부 iframe 모두 `unsupportedReason: "iframe"` fixture 테스트 통과 |
| visible viewport rect helper 구현 | OK — viewport clipping, intersection, Region containment/intersection 테스트 통과 |
| `getBestRectForElement` 휴리스틱 구현 | OK — small element parent promotion, large element fallback, heading parent selection, `role="article"` parent preference, previous rect fallback 테스트 통과 |
| 제외 범위 준수 | OK — overlay UI 연결, capture/crop, Copy/Save, same/cross-origin iframe 내부 선택, full page/scroll stitching은 구현하지 않음 |
| `git diff --check` 통과 | OK — whitespace 경고 없음 |
| 최종 보고서 작성 전 `git status --short` 빈 출력 | OK — Stage 4 통합 검증 시작 시 commit되지 않은 변경 없음 |

### 단계별 검증 결과

- Stage 1: [`task_m010_4_stage1.md`](../working/task_m010_4_stage1.md) — upstream source/revision과 MPL 경계 확정, license/source grep과 `git diff --check` 통과
- Stage 2: [`task_m010_4_stage2.md`](../working/task_m010_4_stage2.md) — Region/WindowDimensions viewport model 구현, typecheck/test/build 통과
- Stage 3: [`task_m010_4_stage3.md`](../working/task_m010_4_stage3.md) — element hit-test와 rect 휴리스틱 구현, typecheck/test/build/필수 문자열 검색 통과
- Stage 4: 통합 검증 — `npm run build`, `npm run typecheck`, `npm run test`, license/source grep, `git diff --check`, `git status --short` 통과

## 잔여 위험과 후속 작업

### 잔여 위험

- helper는 fixture 기반 단위 테스트로 검증했다. 실제 browser layout, pointer movement, hover overlay integration은 Phase 3에서 별도 smoke test가 필요하다.
- open shadow root만 지원한다. closed shadow root와 cross-origin iframe 내부 선택은 Chrome MV3 MVP 범위에서 제외했다.
- helper가 capture pipeline에 아직 연결되지 않았으므로 overlay가 최종 PNG에 포함되지 않는지 여부는 이번 task에서 검증 대상이 아니다.

### 후속 작업 후보

- #5 Phase 3: Shadow DOM overlay UI 구현에서 `getElementFromPoint()`와 `getBestRectForElement()`를 `src/content/inject.ts`에 연결
- #6 Phase 4: visible viewport capture/crop backend 구현
- #7 Phase 5: Copy/Save/UX polish

## 작업지시자 승인 요청

- 최종 보고서와 수용 기준 검증 결과를 승인하면 PR 게시 절차로 진행한다.
