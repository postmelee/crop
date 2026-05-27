# Task #4 수행계획서

GitHub Issue: [#4](https://github.com/postmelee/crop/issues/4)
마일스톤: M010

## 목적

Firefox Screenshots의 요소 선택 helper 중 Chrome MV3 content script에서 재사용 가능한 핵심 휴리스틱을 `crop` 코드베이스에 포팅한다. 이번 task의 결과물은 이후 Phase 3 overlay UI가 hover 대상 요소를 안정적으로 찾고, visible viewport 안에서 적절한 선택 후보 rect를 얻을 수 있게 하는 순수 helper 기반이다.

완료 후에는 일반 DOM/open shadow DOM 요소에 대해 `getElementFromPoint` 계열 처리와 `getBestRectForElement` 계열 rect 선택 정책이 동작해야 한다. 단, 이번 task는 helper 포팅에 한정하며 실제 overlay UI 연결, 캡처, Copy/Save 동작은 구현하지 않는다.

## 배경

Task #3에서 Chrome MV3 shell, background injection, content overlay stub, `open-crop` shortcut 경로가 준비됐다. 다음 단계는 실제 Firefox식 hover/selection UX를 만들기 전에, Firefox Screenshots의 요소 선택 휴리스틱을 Chrome 확장 환경에 맞게 분리하는 것이다.

원본 계획서 `/Users/melee/Downloads/crop_development_plan_prompt.md`의 Phase 2는 `overlayHelpers.mjs`의 `getBestRectForElement`, 일반 DOM/open shadow 중심 `getElementFromPoint`, `Region`, viewport-only `WindowDimensions` 포팅을 요구한다. Firefox privileged API(`ScreenshotsHelper` actor, XPCOM, ChromeUtils, Services, closed shadow root 접근, `mozInnerScreenX/Y`)는 Chrome MV3에서 사용할 수 없으므로 제거하거나 명시적으로 범위 밖으로 둔다.

## 범위

### 포함

- `src/firefox-derived/overlay-helpers.ts` 신규 작성
- `src/firefox-derived/region.ts` 신규 작성
- `src/firefox-derived/window-dimensions.ts` 신규 작성
- Firefox-derived 파일 MPL 2.0 header와 upstream source/revision 주석 기록
- `NOTICE`, `THIRD_PARTY.md`의 Mozilla Firefox Screenshots 출처를 "planned"에서 실제 adapted source 기록으로 갱신
- 일반 DOM과 open shadow root 범위의 element hit-test helper 구현
- visible viewport 기준 `Region`/`WindowDimensions` 최소 구현
- `getBestRectForElement`와 작은 요소/큰 요소/heading/`role="article"` 선택 휴리스틱 구현
- Node/jsdom 또는 DOM fixture 기반 테스트 가능한 순수 함수 검증 추가

### 제외

- Shadow DOM overlay UI 완성
- `src/content/inject.ts`와 실제 hover UI 연결
- selection state machine 구현
- capture/crop backend
- Copy/Save 동작
- same-origin iframe 내부 선택 고도화
- cross-origin iframe 내부 접근
- full page 캡처와 scroll stitching
- Firefox/Mozilla 사용자-facing 브랜딩 또는 아이콘 도입

## 설계 방향

- Firefox-derived 또는 수정 파일은 `src/firefox-derived/`에만 둔다.
- Firefox-derived 파일은 MPL 2.0 notice와 upstream source URL, upstream revision, source path, local path, modification summary를 파일 또는 관련 문서에 기록한다.
- Chrome 전용 runtime entrypoint(`src/content/inject.ts`, `src/background/service-worker.ts`)에는 MPL 코드를 직접 섞지 않는다.
- helper API는 Phase 3 overlay에서 쓰기 쉽도록 DOM `Element`, `Document`, viewport dimensions, previous rect 같은 명시적 입력을 받는 순수 함수 중심으로 둔다.
- closed shadow root, cross-origin iframe, Firefox privileged actor 접근은 지원하지 않는다. 지원 불가 상황은 host element 또는 null/viewport fallback 정책으로 제한한다.
- 테스트는 브라우저 자동화가 아니라 가능한 한 순수 DOM fixture로 시작한다. 필요하면 `jsdom` 같은 dev dependency 추가를 구현계획서에서 명시하고 lockfile과 함께 커밋한다.

## 문서 위치 판단

이번 task는 Firefox-derived source를 실제로 추가하므로 라이선스/출처 문서 갱신이 필요하다. 제품 사용자 문서 루트(`docs/`, `site/`, `website/`)는 만들지 않는다.

| 파일 | 분류 | 대상 독자 | 선택 위치 | 대안 위치 | 선택 이유 |
|---|---|---|---|---|---|
| `NOTICE` | 라이선스/출처 고지 | 사용자/기여자 | 루트 `NOTICE` | `docs/legal.md` | 기존 Phase 0에서 root notice를 기준으로 삼았고, 배포·감사 대상 고지는 루트에 있어야 한다. |
| `THIRD_PARTY.md` | 제3자 출처 기록 | 기여자/감사자 | 루트 `THIRD_PARTY.md` | `docs/third-party.md` | 기존 third-party 기록의 진실 원천이며 upstream revision과 modification summary를 보관한다. |
| `src/firefox-derived/README.md` | 소스 경계 설명 | 기여자/에이전트 | `src/firefox-derived/README.md` | `mydocs/` | Firefox-derived 디렉터리 내부 정책은 소스 가까이에 있어야 하며, 제품 사용자 문서가 아니다. |
| 공식 제품 문서 루트 | 해당 없음 | 해당 없음 | 해당 없음 | `docs/` | 이번 task는 제품 사용자 문서를 새로 만들지 않는다. |

## 예상 변경 파일

신규:

- `src/firefox-derived/overlay-helpers.ts`
- `src/firefox-derived/region.ts`
- `src/firefox-derived/window-dimensions.ts`
- 테스트 파일 또는 fixture 파일. 구체 경로는 구현계획서에서 결정

수정:

- `NOTICE`
- `THIRD_PARTY.md`
- `src/firefox-derived/README.md`
- `package.json`, `package-lock.json` 또는 test 설정 파일. 테스트 도구 추가가 필요한 경우만

이번 task 산출물:

- `mydocs/orders/20260527.md`
- `mydocs/plans/task_m010_4.md`
- `mydocs/plans/task_m010_4_impl.md`
- `mydocs/working/task_m010_4_stage{N}.md`
- `mydocs/report/task_m010_4_report.md`

## 잠정 단계

- **Stage 1 — upstream 범위와 라이선스 기록 확정**
  - Firefox upstream source URL/revision/source path 확정
  - `NOTICE`, `THIRD_PARTY.md`, `src/firefox-derived/README.md` 갱신
  - MPL 2.0 header 형식 확정
- **Stage 2 — Region과 WindowDimensions viewport 모델 구현**
  - `region.ts`, `window-dimensions.ts`
  - viewport-only intersection/containment/size helper 검증
- **Stage 3 — overlay helper hit-test와 rect 휴리스틱 구현**
  - `overlay-helpers.ts`
  - 일반 DOM/open shadow hit-test, `getBestRectForElement`, heading/작은 요소/큰 요소/article parent 정책 구현
- **Stage 4 — helper 테스트와 통합 검증**
  - 테스트 파일 또는 fixture 정리
  - build/typecheck/test/license grep 통합 검증
  - 최종 보고서 작성과 PR 준비

## 검증 계획

### 단계별 검증

- Stage 1
  - `rg "MPL-2.0|Mozilla Public License|overlayHelpers" src/firefox-derived THIRD_PARTY.md NOTICE`
  - `git diff --check`
- Stage 2
  - `npm run typecheck`
  - Region/viewport helper 테스트 또는 fixture 검증
- Stage 3
  - `npm run typecheck`
  - `rg "getBestRectForElement|getElementFromPoint|role=.article|H1|H6" src/firefox-derived`
  - helper 테스트 또는 fixture 검증
- Stage 4
  - `npm run build`
  - `npm run typecheck`
  - helper 테스트 또는 fixture 기반 검증
  - `rg "MPL-2.0|Mozilla Public License|overlayHelpers" src/firefox-derived THIRD_PARTY.md NOTICE`
  - `git diff --check`

### 통합 검증

- 일반 DOM 요소 hover 후보에 대해 적절한 rect를 반환한다.
- 너무 작은 요소는 부모 후보로 올라간다.
- 너무 큰 요소는 이전 rect 또는 viewport intersection 정책을 따른다.
- `H1`~`H6` 단독 선택 과민 반응을 줄인다.
- `role="article"` 부모 선호 정책이 동작한다.
- Firefox-derived 파일의 MPL 2.0 고지와 upstream 기록이 존재한다.
- `npm run build`가 통과한다.
- `npm run typecheck`가 통과한다.
- helper 테스트 또는 fixture 검증이 통과한다.
- `git status --short`가 PR 준비 전 빈 출력이다.
- `git diff --check`가 경고 없이 통과한다.

## 리스크

- **upstream revision 모호성**: `main` branch URL만 기록하면 재현성이 떨어진다. Stage 1에서 정확한 commit SHA 또는 release revision을 확정해 `THIRD_PARTY.md`에 기록한다.
- **MPL 파일 경계 혼선**: MPL-derived 로직을 Chrome runtime 파일에 섞으면 라이선스 경계가 흐려진다. Firefox-derived 로직은 `src/firefox-derived/`에 두고 Chrome 전용 파일은 별도 adapter로 연결한다.
- **브라우저 DOM과 테스트 DOM 차이**: jsdom/fixture 테스트가 실제 browser hit-test를 완전히 대체하지 못할 수 있다. 순수 rect 정책은 fixture로 검증하고, 실제 pointer integration은 Phase 3에서 smoke test로 검증한다.
- **iframe/shadow root 범위 초과**: cross-origin iframe과 closed shadow root는 Chrome content script에서 안정적으로 접근할 수 없다. 이번 task에서는 명시적으로 제외하고 fallback 정책만 둔다.
- **원본 알고리즘 과포팅**: Firefox privileged API를 억지로 재현하지 않는다. MVP visible viewport에 필요한 부분만 TypeScript로 이식한다.

## 승인 요청 사항

- Phase 2 범위를 Firefox-derived helper 포팅과 테스트에 한정하고, overlay UI 연결은 Phase 3으로 유지하는 것
- Firefox-derived 파일을 `src/firefox-derived/`에만 두고 MPL 2.0 header/upstream revision 기록을 강제하는 것
- `NOTICE`와 `THIRD_PARTY.md`를 이번 task에서 공식 출처 문서로 갱신하는 것
- same-origin iframe 고도화, cross-origin iframe, closed shadow root, full page 캡처를 이번 task에서 제외하는 것
- 테스트 도구 또는 dev dependency 추가가 필요하면 구현계획서에서 먼저 구체화한 뒤 진행하는 것

승인되면 `task_m010_4_impl.md`에서 단계별 산출물, 검증 명령, 커밋 메시지를 구체화한다.
