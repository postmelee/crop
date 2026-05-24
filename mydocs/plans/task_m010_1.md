# Task #1 수행계획서

GitHub Issue: [#1](https://github.com/postmelee/crop/issues/1)
마일스톤: M010

## 목적

`crop` Chrome MV3 확장 개발을 시작할 수 있도록 저장소의 Phase 0 기반을 만든다. 이번 작업은 제품 기능 구현이 아니라 라이선스, third-party notice, TypeScript 빌드 기반, 초기 소스 디렉터리 정책을 고정하는 준비 단계다.

최종 상태는 다음 Phase 1에서 `manifest.json`, background service worker, content script 주입 흐름을 구현할 수 있는 형태여야 한다.

## 배경

현재 저장소에는 Hyper-Waterfall 운영 구조와 GitHub 원격 저장소만 있다. 첨부 계획서 `/Users/melee/Downloads/crop_development_plan_prompt.md`는 Phase 0 완료 조건으로 `crop` 저장소 생성, TypeScript + Vite 또는 Rollup 기반 MV3 빌드 구성, `LICENSE`, `LICENSE-MPL-2.0`, `NOTICE`, `THIRD_PARTY.md`, Firefox 유래 코드 분리, upstream Firefox revision 기록, Mozilla/Firefox 상표 미사용 확인을 요구한다.

이 작업은 그 요구사항 중 저장소/라이선스/빌드 기반에 해당하는 범위만 다룬다. overlay UX, 요소 탐지 알고리즘, 캡처 파이프라인은 후속 Phase에서 별도 이슈로 처리한다.

## 범위

### 포함

- Node/TypeScript 기반 프로젝트 메타데이터와 빌드 스크립트 추가
- Vite 기반 MV3 번들링 방향 설정
- 초기 소스 디렉터리 구조 생성
- `LICENSE`, `LICENSE-MPL-2.0`, `NOTICE`, `THIRD_PARTY.md` 추가
- `src/firefox-derived/README.md`에 Firefox Screenshots 유래 코드 정책과 출처 기록
- 루트 `README.md`에 개발 초기화, 빌드, 범위 제한, 브랜드/권한 원칙 요약
- Phase 0 산출물 검증 명령 정의

### 제외

- 실제 Chrome extension runtime 구현
- `manifest.json`의 최종 권한/commands/action 동작 구현
- `chrome.scripting.executeScript()` 주입 흐름 구현
- Firefox `overlayHelpers.mjs` 포팅
- Shadow DOM overlay UI 구현
- `chrome.tabs.captureVisibleTab()` 캡처/crop/copy/save 구현
- full page 캡처, scroll stitching, Chrome Web Store 배포 준비

## 설계 방향

- 빌드 도구는 TypeScript + Vite를 기본안으로 둔다. MV3 확장 번들링은 Rollup 기반 Vite 설정으로 시작하고, Phase 1에서 manifest와 entrypoint가 확정되면 세부 output을 조정한다.
- 패키지 매니저는 별도 제약이 없으므로 npm을 기본값으로 둔다.
- 프로젝트 주 라이선스는 승인 전까지 MIT를 제안안으로 기록한다. Firefox 유래 또는 수정 파일은 MPL 2.0 파일 단위 고지를 유지한다.
- Firefox 유래 코드는 `src/firefox-derived/` 아래에만 둔다. 새로 작성하는 Chrome 전용 코드는 `src/background/`, `src/content/`, `src/shared/`로 분리한다.
- 사용자-facing 제품명은 `crop`만 사용한다. Mozilla/Firefox 명칭은 라이선스와 third-party notice의 사실 관계 설명에만 사용한다.
- MVP 권한 원칙은 `activeTab`, `scripting`, `clipboardWrite` 중심으로 유지하고, `debugger`와 `<all_urls>`는 이번 task에서 추가하지 않는다.

## 문서 위치 판단

이번 task는 공식 사용자 문서 루트(`docs/`, `specs/`, `site/`, `website/`, `adr/`)를 만들지 않는다. Phase 0에 필요한 문서는 저장소 표준 루트 파일과 source-local README에 한정한다.

| 파일 | 분류 | 대상 독자 | 선택 위치 | 대안 위치 | 선택 이유 |
|---|---|---|---|---|---|
| `README.md` | 공식 문서 | 사용자/기여자 | 루트 `README.md` | `docs/README.md` | 저장소 첫 화면에서 설치/빌드/범위 원칙을 바로 확인해야 한다. 별도 문서 루트 선택은 아직 필요하지 않다. |
| `LICENSE` | 공식 문서 | 사용자/기여자 | 루트 `LICENSE` | 해당 없음 | GitHub와 일반 오픈소스 관례상 루트 라이선스가 표준 위치다. |
| `LICENSE-MPL-2.0` | 공식 문서 | 사용자/기여자 | 루트 `LICENSE-MPL-2.0` | `third_party/` | Firefox 유래 파일의 파일 단위 라이선스 원문을 저장소 루트에서 쉽게 확인해야 한다. |
| `NOTICE` | 공식 문서 | 사용자/기여자 | 루트 `NOTICE` | `docs/NOTICE.md` | 배포와 라이선스 고지를 루트 표준 파일로 제공한다. |
| `THIRD_PARTY.md` | 공식 문서 | 사용자/기여자 | 루트 `THIRD_PARTY.md` | `docs/third-party.md` | third-party 출처를 루트에서 명확히 제공하되 별도 공식 문서 루트는 만들지 않는다. |
| `src/firefox-derived/README.md` | source-local 기술 문서 | 기여자/에이전트 | `src/firefox-derived/README.md` | `docs/firefox-derived.md` | Firefox 유래 코드가 위치하는 디렉터리 안에서 수정 정책과 출처를 바로 확인해야 한다. |

## 예상 변경 파일

신규:

- `README.md`
- `LICENSE`
- `LICENSE-MPL-2.0`
- `NOTICE`
- `THIRD_PARTY.md`
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `vite.config.ts`
- `src/background/.gitkeep`
- `src/content/.gitkeep`
- `src/content/overlay/.gitkeep`
- `src/firefox-derived/README.md`
- `src/shared/.gitkeep`

수정:

- 해당 없음

이번 task 산출물:

- `mydocs/orders/20260525.md`
- `mydocs/plans/task_m010_1.md`
- `mydocs/plans/task_m010_1_impl.md`
- `mydocs/working/task_m010_1_stage{N}.md`
- `mydocs/report/task_m010_1_report.md`

## 잠정 단계

- **Stage 1 — 라이선스와 고지 파일**
  - `LICENSE`, `LICENSE-MPL-2.0`, `NOTICE`, `THIRD_PARTY.md`, `README.md` 초안
  - Mozilla/Firefox 상표 혼동 표현과 MPL 2.0 고지 누락 여부 확인
- **Stage 2 — TypeScript/Vite 빌드 기반**
  - `package.json`, lockfile, `tsconfig.json`, `vite.config.ts`
  - `npm run build` 또는 초기 빌드 검증 명령 통과
- **Stage 3 — 소스 구조와 Firefox-derived 정책**
  - `src/` 초기 디렉터리와 `src/firefox-derived/README.md`
  - 디렉터리 경계가 첨부 계획서와 `AGENTS.md` 제약에 맞는지 확인
- **Stage 4 — 최종 검증과 보고**
  - 전체 diff, 빌드/정적 검증, 최종 보고서
  - Issue #1 수용 기준 충족 여부 확인

## 검증 계획

### 단계별 검증

- Stage 1
  - `test -f LICENSE && test -f LICENSE-MPL-2.0 && test -f NOTICE && test -f THIRD_PARTY.md`
  - `rg "Mozilla|Firefox|MPL|crop" README.md NOTICE THIRD_PARTY.md src/firefox-derived/README.md`
- Stage 2
  - `npm install`
  - `npm run build`
  - `npm run typecheck`가 정의되면 실행
- Stage 3
  - `find src -maxdepth 3 -print`
  - `rg "MPL-2.0|Firefox Screenshots|overlayHelpers" src/firefox-derived/README.md`
- Stage 4
  - `git diff --check`
  - `git status --short`

### 통합 검증

- Issue #1의 수용 기준을 모두 충족한다.
- 루트 문서와 `src/firefox-derived/README.md`가 Firefox 유래 코드의 출처와 MPL 2.0 정책을 설명한다.
- MVP에서 제외한 overlay/capture/copy/save 기능을 이번 task에서 구현하지 않는다.
- `git status --short`가 PR 준비 전 빈 출력이다.
- `git diff --check`가 경고 없이 통과한다.

## 리스크

- **라이선스 선택 불명확**: 프로젝트 주 라이선스가 확정되지 않으면 `LICENSE` 내용이 바뀔 수 있다. 기본안은 MIT로 두고, 승인 시 다른 라이선스로 변경한다.
- **Vite MV3 output 조정 필요**: Phase 1에서 manifest entrypoint가 확정되면 Vite output 경로 조정이 필요할 수 있다. Phase 0에서는 최소 빌드 기반과 구조만 고정한다.
- **MPL 고지 누락**: Firefox 유래 코드가 들어올 때 파일 단위 MPL 헤더가 빠질 수 있다. `src/firefox-derived/README.md`, `NOTICE`, `THIRD_PARTY.md`로 기준을 먼저 둔다.
- **공식 문서 루트 과잉 생성**: `docs/`를 만들면 문서 체계가 조기 확정된다. 이번 task에서는 루트 표준 파일과 source-local README만 사용한다.

## 승인 요청 사항

- Phase 0 범위를 저장소/라이선스/빌드 기반으로 제한하는 것
- TypeScript + Vite + npm을 기본 빌드 구성으로 채택하는 것
- 프로젝트 주 라이선스 기본안을 MIT로 두고, Firefox 유래 파일은 MPL 2.0 파일 단위 고지를 유지하는 것
- 공식 문서 루트를 아직 만들지 않고 루트 표준 파일과 `src/firefox-derived/README.md`만 추가하는 것
- overlay/capture/copy/save 구현은 후속 이슈로 분리하는 것

승인되면 `task_m010_1_impl.md`에서 단계별 산출물, 검증 명령, 커밋 메시지를 구체화한다.
