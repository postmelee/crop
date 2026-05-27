# Task #4 구현계획서

수행계획서: [`task_m010_4.md`](task_m010_4.md)
GitHub Issue: [#4](https://github.com/postmelee/crop/issues/4)
마일스톤: M010

## 단계 개요

| Stage | 제목 | 주요 산출 | 검증 |
|---|---|---|---|
| 1 | upstream 범위와 라이선스 기록 확정 | `NOTICE`, `THIRD_PARTY.md`, `src/firefox-derived/README.md` | `rg "MPL-2.0|Mozilla Public License|overlayHelpers"` |
| 2 | Region과 WindowDimensions viewport 모델 구현 | `src/firefox-derived/region.ts`, `src/firefox-derived/window-dimensions.ts` | `npm run typecheck`, `npm run test` |
| 3 | overlay helper hit-test와 rect 휴리스틱 구현 | `src/firefox-derived/overlay-helpers.ts`, `tests/firefox-derived/overlay-helpers.test.ts` | `npm run typecheck`, `npm run test` |
| 4 | helper 테스트와 통합 검증 | `mydocs/report/task_m010_4_report.md` | `npm run build`, `npm run typecheck`, `npm run test` |

## 문서 위치 확인

수행계획서의 "문서 위치 판단"과 실제 Stage 산출물 경로를 다음과 같이 일치시킨다. 이번 task에서는 `docs/`, `specs/`, `site/`, `website/`, `adr/` 같은 공식 제품 문서 루트를 만들지 않는다.

| 파일 | 수행계획서상 선택 위치 | Stage 산출물 경로 | 일치 여부 | 비고 |
|---|---|---|---|---|
| `NOTICE` | 루트 `NOTICE` | `NOTICE` | OK | Mozilla Firefox Screenshots 출처 고지 갱신 |
| `THIRD_PARTY.md` | 루트 `THIRD_PARTY.md` | `THIRD_PARTY.md` | OK | upstream URL, commit/revision, source path, local path, modification summary 기록 |
| `src/firefox-derived/README.md` | `src/firefox-derived/README.md` | `src/firefox-derived/README.md` | OK | derived source 경계와 import 목록 갱신 |
| 공식 제품 문서 루트 | 해당 없음 | 해당 없음 | OK | 이번 task는 제품 사용자 문서를 생성하지 않음 |

## Stage 1 — upstream 범위와 라이선스 기록 확정

### 산출물

신규:

- `mydocs/working/task_m010_4_stage1.md`

수정:

- `NOTICE`
- `THIRD_PARTY.md`
- `src/firefox-derived/README.md`

### 변경 내용

- Mozilla Firefox Screenshots upstream source 중 이번 task에서 실제로 포팅할 범위를 `overlayHelpers.mjs` 중심으로 확정한다.
- Stage 1 작업 시 Mozilla의 primary source에서 정확한 upstream repository URL, commit 또는 revision, source path를 확인해 `THIRD_PARTY.md`에 기록한다.
- `Region`, `WindowDimensions`, `getElementFromPoint`, `getBestRectForElement` 계열 로직이 어느 upstream 파일에서 유래했는지 local path별로 분리해 적는다.
- `NOTICE`의 "planned" 문구를 실제 adapted source 기록으로 갱신한다.
- `src/firefox-derived/README.md`에 이번 task에서 추가될 TypeScript 파일 목록, MPL 2.0 header 요구사항, Chrome MV3에서 제거한 Firefox privileged API 범위를 기록한다.
- 사용자-facing 제품명은 계속 `crop`만 사용하고 Mozilla/Firefox는 factual source attribution에만 사용한다.

### 검증

```bash
rg "MPL-2.0|Mozilla Public License|overlayHelpers" src/firefox-derived THIRD_PARTY.md NOTICE
git diff --check
```

### 커밋

```text
Task #4 Stage 1: Firefox-derived 출처와 라이선스 기록 확정
```

## Stage 2 — Region과 WindowDimensions viewport 모델 구현

### 산출물

신규:

- `src/firefox-derived/region.ts`
- `src/firefox-derived/window-dimensions.ts`
- `tests/firefox-derived/region.test.ts`
- `tests/firefox-derived/window-dimensions.test.ts`
- `mydocs/working/task_m010_4_stage2.md`

수정:

- `package.json`
- `package-lock.json`
- 필요 시 `tsconfig.json`

### 변경 내용

- `region.ts`는 visible viewport 기준 rect 정규화, width/height/area 계산, containment/intersection, clipping helper를 제공한다.
- `window-dimensions.ts`는 Chrome content script에서 안전하게 얻을 수 있는 viewport width/height, scroll offset, device pixel ratio 입력을 명시적 객체로 정리한다.
- Firefox의 full page, scroll stitching, `mozInnerScreenX/Y`, privileged actor 의존성은 구현하지 않는다.
- 테스트 실행을 위해 `vitest` dev dependency와 `npm run test` 스크립트를 추가한다.
- 테스트는 브라우저 자동화 대신 수치 기반 fixture와 작은 DOM test double을 사용한다. `jsdom`은 이 단계의 기본 의존성으로 추가하지 않는다.

### 검증

```bash
npm run typecheck
npm run test
git diff --check
```

### 커밋

```text
Task #4 Stage 2: viewport geometry helper 구현
```

## Stage 3 — overlay helper hit-test와 rect 휴리스틱 구현

### 산출물

신규:

- `src/firefox-derived/overlay-helpers.ts`
- `tests/firefox-derived/overlay-helpers.test.ts`
- `tests/firefox-derived/dom-fixtures.ts`
- `mydocs/working/task_m010_4_stage3.md`

수정:

- 필요 시 `src/firefox-derived/region.ts`
- 필요 시 `src/firefox-derived/window-dimensions.ts`

### 변경 내용

- 일반 DOM과 open shadow root 범위에서 동작하는 element hit-test helper를 구현한다.
- closed shadow root와 cross-origin iframe 내부 접근은 지원하지 않고, 접근 불가 상황은 host element 또는 null fallback으로 제한한다.
- `getBestRectForElement` 계열 rect 선택 정책을 구현해 visible viewport 안에서 선택 후보 rect를 반환한다.
- 작은 요소는 안정적인 부모 후보로 올리고, viewport보다 큰 요소는 viewport intersection과 이전 rect fallback 정책을 적용한다.
- `H1`~`H6` heading 단독 선택 과민 반응을 줄이는 부모 선택 정책을 구현한다.
- `role="article"` 또는 article-like parent 선호 정책을 구현한다.
- `src/content/inject.ts`와 실제 hover UI 연결은 Stage 3에서도 하지 않는다.

### 검증

```bash
npm run typecheck
npm run test
rg "getBestRectForElement|getElementFromPoint|role=.article|H1|H6" src/firefox-derived tests/firefox-derived
git diff --check
```

### 커밋

```text
Task #4 Stage 3: element hit-test와 rect 휴리스틱 구현
```

## Stage 4 — helper 테스트와 통합 검증

### 산출물

신규:

- `mydocs/report/task_m010_4_report.md`

수정:

- `mydocs/orders/20260527.md`
- 필요 시 Stage 1~3 산출물의 작은 정정

### 변경 내용

- Stage 1~3에서 추가한 helper와 테스트를 통합 검증한다.
- `npm run build`, `npm run typecheck`, `npm run test`가 모두 통과하는지 확인한다.
- Firefox-derived 파일의 MPL 2.0 header와 `NOTICE`/`THIRD_PARTY.md` 기록이 남아 있는지 grep으로 재확인한다.
- 최종 보고서에 구현 범위, 제외 범위, 자동 검증 결과, 다음 Phase 3 overlay UI 연결 시 주의점을 기록한다.
- 오늘할일을 완료 상태로 갱신한다.

### 검증

```bash
npm run build
npm run typecheck
npm run test
rg "MPL-2.0|Mozilla Public License|overlayHelpers|getBestRectForElement" src/firefox-derived THIRD_PARTY.md NOTICE
git diff --check
git status --short
```

### 커밋

```text
Task #4 Stage 4 + 최종 보고서: Firefox-derived helper 포팅 완료
```

## 검증

- 각 Stage 검증 명령은 단계 보고서 작성 전에 실행한다.
- 실패한 검증은 단계 완료로 처리하지 않는다.
- 계획 변경이 필요하면 구현계획서를 먼저 갱신하고 작업지시자 승인을 받는다.
- 문서 위치가 수행계획서 판단과 달라지면 구현 전에 수행계획서 또는 구현계획서를 갱신하고 작업지시자 승인을 받는다.
- Stage 2에서 `vitest` 설치가 네트워크 또는 sandbox 제약으로 실패하면 즉시 중단하고 검증 한계가 아니라 작업 블로커로 처리한다.

## 커밋

- 단계 커밋은 단계 산출물과 `mydocs/working/task_m010_4_stage{N}.md`를 함께 묶는다.
- 커밋 메시지는 `Task #4 Stage {N}: {핵심 내용 요약}` 형식을 따른다.
- 최종 보고서 커밋은 `Task #4 Stage 4 + 최종 보고서: Firefox-derived helper 포팅 완료` 형식을 따른다.

## 단계 의존성

- Stage 2는 Stage 1에서 upstream revision과 MPL 경계가 확정된 후 진행한다.
- Stage 3은 Stage 2에서 viewport geometry helper API와 테스트 실행 방식이 확정된 후 진행한다.
- Stage 4는 Stage 1~3 검증과 단계 보고서 승인이 끝난 후 진행한다.
- Phase 3 overlay UI 연결은 Task #4 final report와 PR merge 이후 별도 이슈에서 진행한다.

## 위험과 대응

- **upstream revision 모호성**: Stage 1에서 primary source로 정확한 commit 또는 revision을 확인하고 `THIRD_PARTY.md`에 고정한다.
- **MPL 경계 혼선**: derived 로직은 `src/firefox-derived/`에만 두고 Chrome runtime entrypoint에는 직접 섞지 않는다.
- **테스트 DOM과 실제 브라우저 차이**: 이번 task는 pure helper 검증에 집중하고 실제 pointer integration smoke는 Phase 3에서 수행한다.
- **테스트 의존성 증가**: 기본값은 `vitest` 1개만 추가한다. `jsdom` 등 DOM 환경 의존성이 필요해지면 구현계획서를 갱신하고 승인받는다.
- **범위 초과**: overlay UI, capture/crop, Copy/Save 요구가 생기면 Task #4에 포함하지 않고 후속 이슈로 유지한다.

## 승인 요청 사항

- 위 4개 Stage 분할과 산출물 경로 승인
- Stage 2에서 `vitest` dev dependency와 `npm run test` 스크립트를 추가하는 것 승인
- 테스트 파일을 `tests/firefox-derived/`에 두고 derived source는 `src/firefox-derived/`에만 두는 구조 승인
- `jsdom` 없이 수치 fixture와 DOM test double로 helper를 먼저 검증하는 방식 승인
- Stage 1에서 정확한 Mozilla upstream revision을 확인한 뒤 `NOTICE`, `THIRD_PARTY.md`, `src/firefox-derived/README.md`를 갱신하는 순서 승인
- overlay UI 연결, capture/crop, Copy/Save, iframe 고도화, full page 캡처를 이번 task에서 제외하는 것 승인
