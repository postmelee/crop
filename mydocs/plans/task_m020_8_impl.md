# Task #8 구현계획서

수행계획서: [`task_m020_8.md`](task_m020_8.md)
GitHub Issue: [#8](https://github.com/postmelee/crop/issues/8)
마일스톤: M020

## 단계 개요

| Stage | 제목 | 주요 산출 | 검증 |
|---|---|---|---|
| 1 | Phase 6 fixture와 quality matrix 작성 | `tests/fixtures/phase6_edge_cases.html`, `mydocs/tech/task_m020_8_quality_matrix.md` | fixture/matrix grep, `git diff --check` |
| 2 | 자동 회귀 검증 확장 | 관련 `tests/**/*.test.ts`, 필요 시 순수 helper 보정 | `npm run build`, `npm run typecheck`, `npm run test` |
| 3 | Chrome manual smoke 실행과 결과 기록 | quality matrix 결과 갱신, smoke note, Stage 보고서 | fixture/대표 페이지/zoom manual smoke |
| 4 | 결함/제한/후속 이슈 분류와 작은 보정 | README, matrix, 필요 시 저위험 코드/테스트 보정 | build/typecheck/test, 제한 문구 grep |
| 5 | README, 최종 보고서, 통합 검증 | `README.md`, `mydocs/report/task_m020_8_report.md` | build/typecheck/test/diff/status |

## 문서 위치 확인

수행계획서의 "문서 위치 판단"과 실제 Stage 산출물 경로를 다음과 같이 일치시킨다. 이번 task에서는 `docs/`, `specs/`, `site/`, `website/`, `adr` 같은 공식 제품 문서 루트를 만들지 않는다.

| 파일 | 수행계획서상 선택 위치 | Stage 산출물 경로 | 일치 여부 | 비고 |
|---|---|---|---|---|
| `README.md` | 루트 `README.md` | `README.md` | OK | MVP 제한과 로컬 smoke 기대 결과만 갱신 |
| `mydocs/tech/task_m020_8_quality_matrix.md` | `mydocs/tech/` | `mydocs/tech/task_m020_8_quality_matrix.md` | OK | task-specific QA 기록 |
| `tests/fixtures/phase6_edge_cases.html` | `tests/fixtures/` | `tests/fixtures/phase6_edge_cases.html` | OK | 반복 가능한 로컬 smoke fixture |
| 공식 제품 문서 루트 | 해당 없음 | 해당 없음 | OK | 이번 task는 사용자용 docs 루트를 만들지 않음 |

## Stage 1 — Phase 6 fixture와 quality matrix 작성

### 산출물

신규:

- `tests/fixtures/phase6_edge_cases.html`
- `mydocs/tech/task_m020_8_quality_matrix.md`
- `mydocs/working/task_m020_8_stage1.md`

수정:

- 필요 시 `README.md`의 fixture 로드 안내 후보 문구 초안만 작성하지 않고 matrix에 기록

### 변경 내용

- 정적 HTML fixture를 작성해 외부 네트워크 없이 Phase 6 대표 구조를 재현한다.
- fixture는 다음 섹션을 포함한다:
  - 일반 문서와 headings
  - 카드 UI와 버튼/아이콘 많은 영역
  - 코드 블록
  - 긴 표
  - sticky header
  - transform/scale 적용 요소
  - same-document iframe `srcdoc`
  - open shadow DOM component
  - viewport 밖으로 이어지는 큰 요소
- fixture에는 smoke 대상별 안정적인 `data-crop-fixture` 속성을 둔다.
- quality matrix 문서에는 대상, 예상 동작, 실제 결과, 상태, 후속 분류, 근거를 기록할 표를 만든다.
- README 변경은 Stage 5까지 보류하고, Stage 1에서는 문서 위치와 matrix 구조만 고정한다.

### 검증

```bash
rg "sticky|transform|iframe|shadow|zoom|Copy|Save|data-crop-fixture" tests/fixtures mydocs/tech
git diff --check
```

### 커밋

```text
Task #8 Stage 1: Phase 6 fixture와 품질 매트릭스 작성
```

## Stage 2 — 자동 회귀 검증 확장

### 산출물

신규:

- 필요 시 `tests/content/overlay/phase6-regression.test.ts`
- `mydocs/working/task_m020_8_stage2.md`

수정:

- `tests/shared/crop-image.test.ts`
- `tests/shared/rect.test.ts`
- `tests/firefox-derived/overlay-helpers.test.ts`
- 필요 시 `src/shared/crop-image.ts`
- 필요 시 `src/shared/rect.ts`
- 필요 시 `src/firefox-derived/overlay-helpers.ts`

### 변경 내용

- 자동으로 고정 가능한 Phase 6 회귀 조건을 Vitest에 추가한다.
- 우선순위는 다음 순서다:
  - viewport 밖으로 이어지는 rect가 visible intersection으로 crop되는지
  - zoom-like viewport/screenshot natural size ratio에서 source crop rect가 안정적인지
  - transform/scale fixture와 유사한 bounding rect normalization이 깨지지 않는지
  - open shadow DOM traversal과 iframe fallback helper가 현재 MVP 정책과 일치하는지
- Chrome extension 사용자 제스처가 필요한 Copy/Save와 zoom UI 조작은 자동 테스트로 무리하게 대체하지 않는다.
- 코드 보정이 필요하면 순수 helper의 작은 결함에 한정하고, 주요 기능 추가가 필요한 항목은 Stage 4에서 후속 분류한다.

### 검증

```bash
npm run build
npm run typecheck
npm run test
rg "zoom|scale|iframe|shadow|sticky|viewport|clip|devicePixelRatio" tests src
git diff --check
```

### 커밋

```text
Task #8 Stage 2: Phase 6 자동 회귀 검증 확장
```

## Stage 3 — Chrome manual smoke 실행과 결과 기록

### 산출물

신규:

- 필요 시 `/private/tmp/crop_task8_smoke_notes.md`
- `mydocs/working/task_m020_8_stage3.md`

수정:

- `mydocs/tech/task_m020_8_quality_matrix.md`

### 변경 내용

- `npm run build` 후 Chrome unpacked extension에서 `dist/`를 reload한다.
- fixture를 브라우저에서 열어 다음 시나리오를 확인한다:
  - 일반 문서/카드/버튼/코드/긴 표 hover와 click selection
  - sticky header와 transform/scale 요소 hover/selection
  - same-document iframe과 open shadow DOM의 선택 경계
  - 큰 요소와 viewport 밖 요소의 visible clipping
  - Copy 결과 paste 가능 여부
  - Save 다운로드 가능 여부
  - overlay/prompt/buttons/toast가 최종 PNG에 포함되지 않는지
- Chrome zoom 80%, 100%, 125%, 150%에서 최소 선택/Copy/Save smoke를 수행한다.
- HiDPI/비HiDPI와 OS 조합은 현재 환경에서 확인 가능한 범위를 명시하고, 미확인 조합은 검증 한계로 기록한다.
- 자동화가 불안정하면 작업지시자에게 직접 smoke 지침을 제공하고, 결과를 matrix에 반영한다.

### 검증

```bash
npm run build
rg "80%|100%|125%|150%|HiDPI|Retina|sticky|transform|iframe|shadow|Copy|Save" mydocs/tech mydocs/working
git diff --check
```

수동 시나리오:

- Chrome fixture smoke: 일반 문서/카드/코드/표 선택
- Chrome fixture smoke: sticky/transform/iframe/shadow 선택
- Chrome fixture smoke: zoom 80%, 100%, 125%, 150% Copy/Save
- Chrome fixture smoke: overlay 오염 여부 확인

### 커밋

```text
Task #8 Stage 3: Chrome manual smoke 결과 기록
```

## Stage 4 — 결함/제한/후속 이슈 분류와 작은 보정

### 산출물

신규:

- 필요 시 후속 이슈 후보 문안 또는 GitHub issue
- `mydocs/working/task_m020_8_stage4.md`

수정:

- `README.md`
- `mydocs/tech/task_m020_8_quality_matrix.md`
- 필요 시 작은 결함 보정 코드와 관련 테스트

### 변경 내용

- Stage 3 결과를 다음 범주로 분류한다:
  - 이번 task에서 고칠 작은 결함
  - MVP 제한으로 README에 명시할 항목
  - 기존 후속 이슈 #12~#15로 연결할 항목
  - 새 후속 이슈가 필요한 항목
- README에는 계획서의 MVP 제한 문구를 실제 구현에 맞춰 반영한다:
  - 현재 버전은 화면에 보이는 영역만 캡처한다.
  - 화면 밖으로 이어지는 요소는 보이는 부분만 저장된다.
  - iframe/nested context 내부 선택 등은 MVP 제한임을 필요한 만큼 명시한다.
- 새 후속 이슈 생성이 필요하면 생성 전 작업지시자 승인을 받는다.
- 코드 보정은 저위험 결함에 한정한다. edge auto-scroll, resize/move, iframe 내부 선택, full page/scroll stitching은 직접 구현하지 않는다.

### 검증

```bash
npm run build
npm run typecheck
npm run test
rg "현재 버전|visible|viewport|화면 밖|full page|iframe|shadow|후속|#12|#13|#14|#15" README.md mydocs
git diff --check
```

### 커밋

```text
Task #8 Stage 4: 품질 결과 분류와 MVP 제한 문구 보정
```

## Stage 5 — README, 최종 보고서, 통합 검증

### 산출물

신규:

- `mydocs/report/task_m020_8_report.md`

수정:

- `README.md`
- `mydocs/orders/20260529.md`
- `mydocs/tech/task_m020_8_quality_matrix.md`
- 필요 시 Stage 1~4 산출물의 작은 정정

### 변경 내용

- README의 개발 상태와 MVP 제한 문구를 최종 smoke 결과 기준으로 정리한다.
- 최종 보고서에 Phase 6 수용 기준별 결과, 자동/수동 검증 결과, 확인하지 못한 OS/DPR 조합, 후속 항목을 기록한다.
- 오늘할일을 완료 상태로 갱신한다.
- PR 본문에서 참조할 수 있게 matrix와 stage reports 링크를 정리한다.

### 검증

```bash
npm run build
npm run typecheck
npm run test
rg "Phase 6|품질|edge|zoom|80%|100%|125%|150%|Copy|Save|downloads|debugger|<all_urls>" README.md mydocs src tests manifest.json
git diff --check
git status --short
```

### 커밋

```text
Task #8 Stage 5 + 최종 보고서: 품질 검증 완료
```

## 검증

- 각 Stage 검증 명령은 단계 보고서 작성 전에 실행한다.
- 실패한 검증은 단계 완료로 처리하지 않는다.
- manual smoke가 현재 세션에서 자동화되지 않으면 작업지시자 직접 검증 지침과 결과를 Stage 보고서에 남긴다.
- 기능 추가가 필요한 실패는 구현계획서를 갱신하고 작업지시자 승인을 받거나 후속 이슈로 분리한다.
- 문서 위치가 수행계획서 판단과 달라지면 구현 전에 수행계획서 또는 구현계획서를 갱신하고 작업지시자 승인을 받는다.

## 커밋

- 단계 커밋은 단계 산출물과 `mydocs/working/task_m020_8_stage{N}.md`를 함께 묶는다.
- 커밋 메시지는 `Task #8 Stage {N}: {핵심 내용 요약}` 형식을 따른다.
- 최종 보고서 커밋은 `Task #8 Stage 5 + 최종 보고서: 품질 검증 완료` 형식을 사용한다.

## 단계 의존성

- Stage 2는 Stage 1 fixture/matrix가 고정된 뒤 진행한다.
- Stage 3은 Stage 1 fixture와 Stage 2 자동 회귀 기준선이 통과한 뒤 진행한다.
- Stage 4는 Stage 3 manual smoke 결과가 matrix에 기록된 뒤 진행한다.
- Stage 5는 Stage 4의 결함/제한/후속 분류가 완료된 뒤 진행한다.

## 위험과 대응

- **수동 smoke 자동화 한계**: Chrome extension 사용자 제스처, clipboard, download, zoom 조작은 자동화가 불안정할 수 있다. matrix와 Stage 보고서에 사용자가 직접 확인할 절차와 결과를 남긴다.
- **DPR/OS 조합 부족**: 모든 Retina/비Retina, Windows/macOS/Linux 조합을 한 task에서 실기기 검증하지 못할 수 있다. 확인 가능한 범위와 미확인 범위를 최종 보고서에 분리한다.
- **범위 초과 위험**: full page, scroll stitching, edge auto-scroll, resize/move, iframe 내부 선택은 이번 task에서 직접 구현하지 않는다. 발견되면 #12~#15 또는 신규 후속 이슈로 분리한다.
- **fixture와 실제 웹 차이**: fixture는 반복 재현용이고 실제 웹 전체를 대변하지 않는다. 대표 실제 페이지 smoke 결과와 함께 해석한다.
- **권한 범위 회귀**: `debugger`, `<all_urls>` 권한은 추가하지 않는다. Stage 4/5 grep에서 확인한다.

## 승인 요청 사항

- 5단계 분할과 각 Stage 산출물/검증 명령 승인
- Stage 1에서 `tests/fixtures/phase6_edge_cases.html`과 `mydocs/tech/task_m020_8_quality_matrix.md`를 만드는 구조 승인
- Stage 3 manual smoke를 자동화가 어려운 항목은 작업지시자 직접 확인 지침과 matrix 기록으로 보완하는 것 승인
- Stage 4에서 새 주요 기능 구현 없이 결함/제한/후속 이슈 분류 중심으로 처리하는 것 승인
- `debugger`, `<all_urls>` 권한을 추가하지 않는 것 승인
