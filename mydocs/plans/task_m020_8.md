# Task #8 수행계획서

GitHub Issue: [#8](https://github.com/postmelee/crop/issues/8)
마일스톤: M020

## 목적

M010에서 완성한 `crop` MVP의 핵심 흐름을 다양한 페이지 구조와 브라우저 조건에서 검증한다. 이번 task의 결과물은 새 주요 기능이 아니라, 품질 검증 매트릭스, 재현 가능한 edge-case fixture, 수동 smoke 결과, MVP 제한 문구 정리, 결함/후속 이슈 분류다.

완료 후에는 일반 문서, 카드 UI, 코드 블록, 긴 표, sticky header, transform/scale, iframe, open shadow DOM, Chrome zoom 80/100/125/150% 조건에서 현재 동작이 확인되어야 한다. 발견된 문제는 이번 task에서 좁게 고칠 수 있는 결함, MVP 제한으로 문서화할 항목, #12~#15 같은 후속 기능 이슈로 나눠 기록한다.

## 배경

#5~#7에서 overlay UI, visible viewport capture/crop, Copy/Save까지 MVP 사용자 흐름이 연결됐다. 다음 단계인 Phase 6은 기능 추가보다 실제 페이지 조건에서 좌표, clipping, overlay 숨김, Copy/Save 결과, 제한 문구가 일치하는지 확인하는 안정화 작업이다.

원본 계획서 `/Users/melee/Downloads/crop_development_plan_prompt.md`의 Phase 6은 일반 문서, 카드 UI, 버튼/아이콘 많은 페이지, 코드 블록, 긴 표, sticky header, transform/scale 요소, iframe 포함 페이지, open shadow DOM 컴포넌트, Chrome zoom 80~150%, Retina/비Retina, OS 차이를 검증 대상으로 둔다. 이슈 #8은 같은 범위를 M020 안정화 작업으로 등록했다.

## 범위

### 포함

- 대표 edge-case fixture 또는 smoke 페이지 작성
- 일반 문서, 카드 UI, 버튼/아이콘 많은 페이지, 코드 블록, 긴 표 검증
- sticky header, transform/scale 요소 검증
- iframe, open shadow DOM, cross-origin/closed shadow 제한 동작 분류
- Chrome zoom 80%, 100%, 125%, 150% 수동 또는 반자동 smoke
- HiDPI/비HiDPI 확인 가능 범위 기록
- Copy/Save 결과와 overlay 오염 여부 재확인
- MVP 제한 문구와 README 기대 결과 점검
- 발견 항목을 결함 수정, 문서화, 후속 이슈 후보로 분류
- `npm run build`, `npm run typecheck`, `npm run test`, `git diff --check`

### 제외

- 새로운 주요 기능 구현
- full page capture
- scroll stitching
- edge auto-scroll 구현
- selection resize/move handles와 keyboard 조정
- iframe/nested context 내부 선택 고도화
- Chrome Web Store 제출 또는 배포 문구 작성
- 대규모 UI redesign
- Windows/Linux 실기기 검증 자동화

## 설계 방향

- 검증을 재현 가능하게 하기 위해 fixture HTML과 quality matrix 문서를 먼저 만든다.
- fixture는 로컬에서 열 수 있는 정적 HTML로 구성하고, 외부 네트워크 의존 없이 일반 문서, 카드, 코드 블록, 긴 표, sticky, transform, iframe, open shadow DOM 샘플을 포함한다.
- 자동 단위 테스트로 검증 가능한 좌표/geometry/filename/message 회귀는 Vitest로 유지하고, Chrome extension 사용자 제스처가 필요한 Copy/Save/zoom smoke는 manual checklist에 결과를 남긴다.
- 기능 추가가 필요한 항목은 이번 task에서 즉시 구현하지 않고 후속 이슈로 분리한다. 단, README 제한 문구 또는 fixture/checklist 오류처럼 품질 검증에 직접 필요한 작은 문서/테스트 보정은 이번 task에 포함할 수 있다.
- `debugger`, `<all_urls>` 권한은 추가하지 않는다. `downloads`는 #7에서 승인된 Save 권한으로 유지한다.
- 제품명과 사용자-facing 브랜딩은 계속 `crop`만 사용한다.

## 문서 위치 판단

이번 task는 공식 사용자 문서 루트를 새로 만들지 않는다. 품질 검증 결과와 체크리스트는 내부 작업 산출물이므로 `mydocs/tech/`와 단계/최종 보고서에 둔다. 로컬 개발자가 직접 smoke할 때 필요한 기대 결과와 MVP 제한 문구만 기존 루트 `README.md`에 반영한다.

| 파일 | 분류 | 대상 독자 | 선택 위치 | 대안 위치 | 선택 이유 |
|---|---|---|---|---|---|
| `README.md` | 기여자 로컬 실행 문서 | 기여자/에이전트 | 루트 `README.md` | `docs/dev.md` | 이미 Chrome unpacked smoke 기대 결과의 진실 원천이며, Phase 6에서 확인한 MVP 제한 문구를 같은 위치에 유지하는 것이 가장 작다. |
| `mydocs/tech/task_m020_8_quality_matrix.md` | 기술 조사/검증 매트릭스 | 내부 작업자/에이전트 | `mydocs/tech/` | `docs/qa.md` | 제품 사용자 문서가 아니라 task-specific QA 기록이므로 공식 docs 루트를 만들지 않는다. |
| `tests/fixtures/phase6_edge_cases.html` | 수동 smoke fixture | 기여자/에이전트 | `tests/fixtures/` | `/private/tmp` | 반복 검증 가능해야 하므로 저장소 안 테스트 fixture로 둔다. |

## 예상 변경 파일

신규:

- `tests/fixtures/phase6_edge_cases.html`
- `mydocs/tech/task_m020_8_quality_matrix.md`

수정:

- `README.md`
- 필요 시 `src/content/overlay/crop-overlay.ts`
- 필요 시 `src/firefox-derived/overlay-helpers.ts`
- 필요 시 `src/shared/crop-image.ts`
- 필요 시 관련 `tests/**/*.test.ts`

이번 task 산출물:

- `mydocs/orders/20260529.md`
- `mydocs/plans/task_m020_8.md`
- `mydocs/plans/task_m020_8_impl.md`
- `mydocs/working/task_m020_8_stage{N}.md`
- `mydocs/report/task_m020_8_report.md`

## 잠정 단계

- **Stage 1 — Phase 6 fixture와 quality matrix 작성**
  - edge-case fixture HTML, quality matrix 초안 작성
  - 검증 대상/예상 결과/제한 항목을 표로 고정
- **Stage 2 — 자동 회귀 검증 확장**
  - 기존 geometry/crop/message 테스트 중 Phase 6 조건과 연결되는 케이스 보강
  - build/typecheck/test 기준선 확인
- **Stage 3 — Chrome manual smoke 실행과 결과 기록**
  - fixture와 실제 대표 페이지에서 Copy/Save, sticky/transform/iframe/shadow, zoom 80~150% 확인
  - HiDPI/비HiDPI와 OS 제한은 확인 가능 범위를 명시
- **Stage 4 — 결함/제한/후속 이슈 분류와 작은 보정**
  - 발견 항목을 이번 task 수정, README 제한 문구, 후속 이슈 후보로 분리
  - 필요한 작은 문서/테스트/저위험 코드 보정만 반영
- **Stage 5 — README, 최종 보고서, PR 준비**
  - README의 MVP 제한/로컬 smoke 기대 결과 갱신
  - 최종 보고서에 검증 매트릭스와 후속 항목 정리

## 검증 계획

### 단계별 검증

- Stage 1
  - `rg "sticky|transform|iframe|shadow|zoom|Copy|Save" tests/fixtures mydocs/tech`
  - `git diff --check`
- Stage 2
  - `npm run build`
  - `npm run typecheck`
  - `npm run test`
  - `rg "zoom|scale|iframe|shadow|sticky|viewport|clip" tests src`
- Stage 3
  - Chrome manual smoke: fixture page 일반 문서/카드/코드/표 선택
  - Chrome manual smoke: sticky header와 transform/scale 요소 선택
  - Chrome manual smoke: iframe/open shadow DOM/cross-origin 제한 확인
  - Chrome manual smoke: zoom 80%, 100%, 125%, 150%에서 Copy/Save 확인
- Stage 4
  - `npm run build`
  - `npm run typecheck`
  - `npm run test`
  - `rg "현재 버전|visible|viewport|화면 밖|full page|iframe|shadow" README.md mydocs`
  - `git diff --check`
- Stage 5
  - `npm run build`
  - `npm run typecheck`
  - `npm run test`
  - `git diff --check`
  - `git status --short`

### 통합 검증

- Phase 6 테스트 페이지 범위가 검증되거나 제한으로 명확히 기록된다.
- Chrome zoom 80%, 100%, 125%, 150% 결과가 기록된다.
- iframe, shadow DOM, sticky, transform/scale 동작이 분류된다.
- Copy/Save 결과물에 overlay UI가 포함되지 않는다.
- viewport 밖으로 이어지는 선택은 visible viewport 기준으로 잘린다는 제한이 문서에 반영된다.
- 발견된 결함은 수정되거나 후속 이슈 후보로 분리된다.
- `debugger`, `<all_urls>` 권한이 추가되지 않는다.
- `npm run build`가 통과한다.
- `npm run typecheck`가 통과한다.
- `npm run test`가 통과한다.
- `git status --short`가 PR 준비 전 빈 출력이다.
- `git diff --check`가 경고 없이 통과한다.

## 리스크

- **Chrome extension manual smoke 한계**: 사용자 제스처, clipboard, download, zoom 상태는 자동화가 불안정할 수 있다. 결과는 fixture, matrix, 작업지시자 확인으로 보완한다.
- **HiDPI/비HiDPI 장비 한계**: 현재 환경에서 모든 devicePixelRatio/OS 조합을 직접 확인하지 못할 수 있다. 확인하지 못한 조합은 검증 한계로 명시하고 후속 재현 항목으로 남긴다.
- **기능 추가 유혹**: edge auto-scroll, resize/move, iframe 내부 선택, full page는 발견되더라도 이번 task의 주요 구현 범위가 아니다. 후속 이슈로 분리한다.
- **문서 과잉 위험**: 공식 사용자 docs 루트를 새로 만들지 않고 README와 mydocs 내부 산출물에 한정한다.

## 승인 요청 사항

- #8 범위를 품질 검증, fixture/checklist, 문서화, 후속 이슈 분류 중심으로 제한하는 것
- 새 주요 기능 구현을 제외하고 작은 결함 보정만 Stage 4에서 별도 승인 하에 반영하는 것
- Phase 6 검증 매트릭스를 `mydocs/tech/task_m020_8_quality_matrix.md`에 두는 것
- 반복 가능한 smoke fixture를 `tests/fixtures/phase6_edge_cases.html`에 두는 것
- `README.md`에는 MVP 제한과 로컬 smoke 기대 결과만 갱신하는 것
- `debugger`, `<all_urls>` 권한을 추가하지 않는 것

승인되면 `task_m020_8_impl.md`에서 단계별 산출물, 검증 명령, 커밋 메시지를 구체화한다.
