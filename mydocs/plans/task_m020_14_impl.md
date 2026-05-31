# Task #14 구현계획서

수행계획서: [`task_m020_14.md`](task_m020_14.md)
GitHub Issue: [#14](https://github.com/postmelee/crop/issues/14)
마일스톤: M020

## 단계 개요

| Stage | 제목 | 주요 산출 | 검증 |
|---|---|---|---|
| 1 | iframe hit-test 모델과 좌표 변환 기준 작성 | `overlay-helpers` 타입/테스트, fixture double 확장 | typecheck/test/grep/diff |
| 2 | same-origin iframe traversal 구현 | `overlay-helpers.ts`, overlay runtime 연결, iframe rect 테스트 | build/typecheck/test/grep/diff |
| 3 | cross-origin fallback과 nested/open-shadow 회귀 정리 | inaccessible iframe fallback, shadow+iframe 조합 회귀 | build/typecheck/test/permission grep/diff |
| 4 | fixture, smoke, 문서와 최종 보고 | Phase 6 fixture, README, 품질 매트릭스, 최종 보고서 | build/typecheck/test/smoke/grep/diff/status |

## 문서 위치 확인

수행계획서의 "문서 위치 판단"과 실제 Stage 산출물 경로를 다음과 같이 일치시킨다. 이번 task에서는 공식 제품 문서 루트(`docs/`, `specs/`, `site/`, `website/`, `adr`)를 새로 만들지 않는다.

| 파일 | 수행계획서상 선택 위치 | Stage 산출물 경로 | 일치 여부 | 비고 |
|---|---|---|---|---|
| `README.md` | 루트 `README.md` | `README.md` | OK | iframe 지원/제한과 smoke 기대 결과만 좁게 갱신 |
| `mydocs/tech/task_m020_8_quality_matrix.md` | `mydocs/tech/` | `mydocs/tech/task_m020_8_quality_matrix.md` | OK | P6-10/P6-24/P6-25 기준 갱신 |
| `mydocs/plans/task_m020_14.md` | `mydocs/plans/` | `mydocs/plans/task_m020_14.md` | OK | 수행계획서 |
| `mydocs/plans/task_m020_14_impl.md` | `mydocs/plans/` | `mydocs/plans/task_m020_14_impl.md` | OK | 구현계획서 |
| `mydocs/working/task_m020_14_stage{N}.md` | `mydocs/working/` | `mydocs/working/task_m020_14_stage{N}.md` | OK | 단계 보고서 |
| `mydocs/report/task_m020_14_report.md` | `mydocs/report/` | `mydocs/report/task_m020_14_report.md` | OK | 최종 보고서 |

## 수용 기준 고정

- same-origin/srcdoc iframe 내부 요소는 가능한 경우 parent page 좌표로 변환되어 hover highlight와 selected rectangle 대상이 된다.
- cross-origin 또는 접근 불가능 iframe은 예외 없이 iframe element fallback 또는 명시 제한 상태로 남긴다.
- open shadow root traversal은 #13 완료 상태의 deepest hit target 동작을 유지한다.
- `debugger`, `<all_urls>` 권한은 추가하지 않는다.
- closed shadow DOM 내부 선택, full page capture, scroll stitching은 이번 task 범위 밖으로 유지한다.
- Firefox privileged browsingContext actor 경로는 Chrome MV3에서 사용할 수 없으므로 포팅하지 않는다.

## Stage 1 — iframe hit-test 모델과 좌표 변환 기준 작성

### 산출물

신규:

- `mydocs/working/task_m020_14_stage1.md`

수정:

- `src/firefox-derived/overlay-helpers.ts`
- `tests/firefox-derived/overlay-helpers.test.ts`
- `tests/firefox-derived/dom-fixtures.ts`
- 필요 시 `tests/content/overlay/phase6-regression.test.ts`

### 변경 내용

- 현재 `HitTestResult`의 `element`, `rect`, `unsupportedReason` 계약을 iframe 내부 target에 맞게 확장할지 확정한다.
- same-origin iframe 내부 target을 반환할 때 helper가 parent viewport 기준 `rect`를 제공하는 방식으로 overlay runtime 변경 폭을 줄인다.
- fixture double에 `iframe.contentDocument`, `iframe.contentWindow`, iframe document `elementFromPoint()`를 표현할 수 있는 최소 구조를 추가한다.
- pointer 좌표 변환 기준을 테스트로 먼저 고정한다:
  - parent viewport 좌표에서 iframe viewport 좌표로 변환한다.
  - iframe `getBoundingClientRect()` offset을 반영한다.
  - iframe border/client offset과 iframe document scroll 처리 기준을 명시한다.
  - nested same-origin iframe은 최소 1단계 이상 재귀 가능한 구조로 검토한다.
- 접근 불가능 iframe은 기존처럼 `unsupportedReason: "iframe"` fallback으로 남기는 테스트를 유지한다.
- open shadow root 내부 iframe fallback 테스트가 Stage 2 구현 전에 깨지지 않도록 기준을 유지한다.

### 검증

```bash
npm run typecheck
npm run test
rg "iframe|shadow|contentDocument|contentWindow|unsupportedReason|getElementFromPoint|HitTestResult" src/firefox-derived tests/firefox-derived tests/content/overlay mydocs/plans/task_m020_14.md mydocs/plans/task_m020_14_impl.md
git diff --check
```

### 커밋

```text
Task #14 Stage 1: iframe hit-test 모델과 좌표 기준 작성
```

## Stage 2 — same-origin iframe traversal 구현

### 산출물

신규:

- `mydocs/working/task_m020_14_stage2.md`

수정:

- `src/firefox-derived/overlay-helpers.ts`
- `src/content/overlay/crop-overlay.ts`
- `tests/firefox-derived/overlay-helpers.test.ts`
- `tests/firefox-derived/dom-fixtures.ts`
- 필요 시 `tests/content/overlay/phase6-regression.test.ts`

### 변경 내용

- `getElementFromPoint()`가 iframe element를 만나면 접근 가능한 `contentDocument`를 확인한다.
- 접근 가능한 iframe이면 parent pointer 좌표를 iframe document 좌표로 변환하고 iframe 내부 `elementFromPoint()`를 호출한다.
- iframe 내부 hit target에서 open shadow root traversal도 기존 방식과 동일하게 적용한다.
- iframe 내부 target rect를 parent viewport 기준 `ViewportRect`로 합성한다.
- overlay runtime은 `HitTestResult.rect`가 있으면 이를 page 좌표로 변환해 우선 사용하고, 없으면 기존 `getBestRectForElement()` 경로를 사용한다.
- parent scroll, iframe 위치, iframe document scroll, iframe border/client offset 조건을 단위 테스트로 검증한다.
- 기존 일반 document hit-test, open shadow hit-test, selected rectangle 동작은 변경하지 않는다.

### 검증

```bash
npm run build
npm run typecheck
npm run test
rg "contentDocument|contentWindow|iframe|parent|viewport|page|HitTestResult" src/firefox-derived src/content/overlay tests
git diff --check
```

### 커밋

```text
Task #14 Stage 2: same-origin iframe traversal 구현
```

## Stage 3 — cross-origin fallback과 nested/open-shadow 회귀 정리

### 산출물

신규:

- `mydocs/working/task_m020_14_stage3.md`

수정:

- `src/firefox-derived/overlay-helpers.ts`
- `tests/firefox-derived/overlay-helpers.test.ts`
- `tests/firefox-derived/dom-fixtures.ts`
- `tests/content/overlay/phase6-regression.test.ts`
- 필요 시 `tests/fixtures/phase6_edge_cases.html`

### 변경 내용

- `contentDocument` 접근이 `null`이거나 `DOMException`을 던지는 iframe을 정상 제한 경로로 처리한다.
- cross-origin fallback은 내부 DOM 접근 실패를 로그/throw 없이 iframe boundary 선택 또는 제한 reason으로 고정한다.
- open shadow root 내부에 iframe이 있는 경우와 iframe 내부에 open shadow target이 있는 경우를 가능한 범위에서 조합 테스트한다.
- nested same-origin iframe은 Stage 1에서 확정한 depth 기준에 맞춰 동작하거나 fallback하는지 테스트한다.
- `manifest.json` 권한이 `activeTab`, `scripting`, `clipboardWrite` 중심으로 유지되고 `debugger`, `<all_urls>`가 추가되지 않았음을 회귀 테스트와 grep으로 확인한다.

### 검증

```bash
npm run build
npm run typecheck
npm run test
rg "debugger|<all_urls>|iframe|shadow|unsupportedReason|contentDocument" manifest.json src tests README.md mydocs/tech/task_m020_8_quality_matrix.md
git diff --check
```

### 커밋

```text
Task #14 Stage 3: iframe fallback과 nested context 회귀 정리
```

## Stage 4 — fixture, smoke, 문서와 최종 보고

### 산출물

신규:

- 필요 시 `tests/fixtures/iframe_nested_context.html`
- 필요 시 `tests/content/overlay/iframe-context.test.ts`
- `mydocs/working/task_m020_14_stage4.md`
- `mydocs/report/task_m020_14_report.md`

수정:

- `tests/fixtures/phase6_edge_cases.html`
- `tests/content/overlay/phase6-regression.test.ts`
- `README.md`
- `mydocs/tech/task_m020_8_quality_matrix.md`
- `mydocs/orders/20260531.md`
- 필요 시 Stage 1~3 산출물의 작은 정정

### 변경 내용

- Phase 6 fixture의 `same-document-iframe` 영역을 same-origin/srcdoc 내부 target smoke에 맞게 정리한다.
- 자동 또는 수동 smoke 체크리스트를 단계 보고서와 최종 보고서에 남긴다:
  - same-origin/srcdoc iframe 내부 card hover selection
  - same-origin/srcdoc iframe 내부 button hover/click selection
  - cross-origin iframe 또는 접근 불가 mock fallback
  - open shadow panel/button 회귀
  - Copy/Save 결과에 overlay와 controls가 포함되지 않음
- README의 MVP/후속 범위를 #14 완료 상태에 맞게 갱신한다.
- 품질 매트릭스의 P6-10/P6-24/P6-25 상태와 근거를 갱신한다.
- 오늘할일을 완료 또는 PR 준비 상태로 갱신한다.
- 최종 보고서에 수용 기준별 결과, 자동 검증, smoke 결과, 검증 한계, 후속 항목을 기록한다.

### 검증

```bash
npm run build
npm run typecheck
npm run test
rg "iframe|shadow|cross-origin|same-origin|srcdoc|debugger|<all_urls>|#14" README.md mydocs src tests manifest.json
git diff --check
git status --short
```

수동 또는 CDP smoke:

- same-origin/srcdoc iframe 내부 card hover selection
- same-origin/srcdoc iframe 내부 button click selection
- iframe 내부 target 선택 후 Copy 동작과 완료 toast
- iframe 내부 target 선택 후 Save 동작, Save는 완료 toast 없음
- cross-origin 또는 inaccessible iframe fallback
- open shadow root panel/button 선택 회귀

### 커밋

```text
Task #14 Stage 4 + 최종 보고서: iframe/nested context 선택 지원
```

## 검증 운영

- 각 Stage 검증 명령은 단계 보고서 작성 전에 실행한다.
- 실패한 검증은 단계 완료로 처리하지 않는다.
- 계획 변경이 필요하면 구현계획서를 먼저 갱신하고 작업지시자 승인을 받는다.
- 문서 위치가 수행계획서 판단과 달라지면 구현 전에 수행계획서 또는 구현계획서를 갱신하고 작업지시자 승인을 받는다.
- 권한 추가가 필요한 방향으로 구현이 흔들리면 즉시 중단하고 별도 task로 분리한다.

## 단계 의존성

- Stage 2는 Stage 1의 hit-test result contract와 좌표 변환 테스트가 확정된 뒤 진행한다.
- Stage 3은 Stage 2의 same-origin traversal이 build/typecheck/test를 통과한 뒤 진행한다.
- Stage 4는 Stage 3의 fallback과 권한 회귀 검증이 끝난 뒤 진행한다.

## 위험과 대응

- **브라우저 보안 경계**: cross-origin iframe 내부 DOM 접근은 Chrome MV3 content script에서 제한된다. 접근 실패를 정상 fallback으로 처리하고 권한 확장은 하지 않는다.
- **좌표 변환 오차**: iframe offset, border, internal scroll, parent scroll이 겹치면 highlight가 밀릴 수 있다. helper 단위 테스트로 parent viewport/page 좌표 contract를 먼저 고정한다.
- **runtime 변경 확산**: overlay runtime이 helper 세부 구조에 과도하게 결합될 수 있다. `HitTestResult.rect` 우선 사용이라는 작은 연결로 제한한다.
- **nested context 범위 확대**: 모든 nested browsing context를 완전 지원하려 하면 #14 범위를 넘는다. same-origin 가능한 depth를 테스트 가능한 범위로 제한하고 cross-origin은 fallback한다.
- **open shadow 회귀**: iframe traversal 추가가 shadow traversal 순서를 깨뜨릴 수 있다. 기존 shadow 테스트와 조합 테스트를 유지한다.
- **문서 과확장**: 공식 문서 루트를 새로 만들지 않고 README와 품질 매트릭스만 좁게 갱신한다.

## 승인 요청 사항

- 위 Stage 분할, 산출물, 검증 명령, 커밋 메시지 기준으로 Task #14 구현을 시작하는 것
- `HitTestResult.rect`를 same-origin iframe 내부 target의 parent viewport rect 전달 경로로 사용하는 것
- cross-origin iframe은 권한 추가 없이 fallback/제한 문서화로 처리하는 것
- README와 품질 매트릭스는 기존 위치에서 필요한 문구만 좁게 갱신하는 것
