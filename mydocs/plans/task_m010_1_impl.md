# Task #1 구현계획서

수행계획서: [`task_m010_1.md`](task_m010_1.md)
GitHub Issue: [#1](https://github.com/postmelee/crop/issues/1)
마일스톤: M010

## 단계 개요

| Stage | 제목 | 주요 산출 | 검증 |
|---|---|---|---|
| 1 | 라이선스와 고지 파일 | `README.md`, `LICENSE`, `LICENSE-MPL-2.0`, `NOTICE`, `THIRD_PARTY.md` | 파일 존재, 라이선스/상표 문구 grep, `git diff --check` |
| 2 | TypeScript/Vite 빌드 기반 | `package.json`, `package-lock.json`, `tsconfig.json`, `vite.config.ts` | `npm install`, `npm run build`, `npm run typecheck`, `git diff --check` |
| 3 | 소스 구조와 Firefox-derived 정책 | `src/**`, `src/firefox-derived/README.md` | source tree 확인, MPL/출처 문구 grep, `git diff --check` |
| 4 | 최종 검증과 보고 | `mydocs/report/task_m010_1_report.md`, `mydocs/orders/20260525.md` | 전체 검증 재실행, `git status --short`, `git diff --check` |

## 문서 위치 확인

수행계획서의 "문서 위치 판단"과 실제 Stage 산출물 경로를 다음과 같이 일치시킨다. 이번 task에서는 `docs/`, `specs/`, `site/`, `website/`, `adr/` 같은 공식 문서 루트를 만들지 않는다.

| 파일 | 수행계획서상 선택 위치 | Stage 산출물 경로 | 일치 여부 | 비고 |
|---|---|---|---|---|
| `README.md` | 루트 `README.md` | `README.md` | OK | 저장소 첫 화면 문서 |
| `LICENSE` | 루트 `LICENSE` | `LICENSE` | OK | 프로젝트 주 라이선스 |
| `LICENSE-MPL-2.0` | 루트 `LICENSE-MPL-2.0` | `LICENSE-MPL-2.0` | OK | MPL 2.0 원문 |
| `NOTICE` | 루트 `NOTICE` | `NOTICE` | OK | 배포/출처 고지 |
| `THIRD_PARTY.md` | 루트 `THIRD_PARTY.md` | `THIRD_PARTY.md` | OK | third-party 출처 |
| `src/firefox-derived/README.md` | `src/firefox-derived/README.md` | `src/firefox-derived/README.md` | OK | source-local 정책 문서 |

## Stage 1 — 라이선스와 고지 파일

### 산출물

신규:

- `README.md`
- `LICENSE`
- `LICENSE-MPL-2.0`
- `NOTICE`
- `THIRD_PARTY.md`
- `mydocs/working/task_m010_1_stage1.md`

수정:

- 해당 없음

### 변경 내용

- `README.md`에 프로젝트 목적, MVP 범위, 제외 범위, 권한 원칙, 개발 흐름, 라이선스/출처 안내를 작성한다.
- `LICENSE`에는 프로젝트 주 라이선스 기본안인 MIT를 둔다.
- `LICENSE-MPL-2.0`에는 MPL 2.0 원문을 둔다.
- `NOTICE`와 `THIRD_PARTY.md`에는 Mozilla Firefox Screenshots 유래 코드 사용 계획, MPL 2.0 적용 범위, 상표 비제휴 고지를 적는다.
- 사용자-facing 브랜드는 `crop`으로 유지하고, Mozilla/Firefox 명칭은 출처와 라이선스 문맥에서만 사용한다.

### 검증

```bash
test -f README.md
test -f LICENSE
test -f LICENSE-MPL-2.0
test -f NOTICE
test -f THIRD_PARTY.md
rg "MPL|Mozilla|Firefox|crop" README.md NOTICE THIRD_PARTY.md
rg "MIT License|Mozilla Public License" LICENSE LICENSE-MPL-2.0
git diff --check
```

### 커밋

```text
Task #1 Stage 1: 라이선스와 고지 파일 추가
```

## Stage 2 — TypeScript/Vite 빌드 기반

### 산출물

신규:

- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `vite.config.ts`
- `mydocs/working/task_m010_1_stage2.md`

수정:

- 필요 시 `README.md`

### 변경 내용

- npm 기반 `package.json`을 추가하고 `build`, `typecheck`, 필요 시 `clean` 스크립트를 정의한다.
- TypeScript와 Vite 의존성을 추가한다.
- `tsconfig.json`은 MV3 extension 코드가 사용할 ES module/browser 환경을 기준으로 설정한다.
- `vite.config.ts`는 Phase 1에서 manifest/background/content entrypoint를 연결할 수 있도록 최소 Rollup output 구조를 둔다. 아직 실제 runtime entrypoint를 만들지 않으므로 placeholder entry를 억지로 만들지 않는다.
- 실제 확장 동작 구현은 하지 않는다.

### 검증

```bash
npm install
npm run build
npm run typecheck
git diff --check
```

### 커밋

```text
Task #1 Stage 2: TypeScript Vite 빌드 기반 추가
```

## Stage 3 — 소스 구조와 Firefox-derived 정책

### 산출물

신규:

- `src/background/.gitkeep`
- `src/content/.gitkeep`
- `src/content/overlay/.gitkeep`
- `src/firefox-derived/README.md`
- `src/shared/.gitkeep`
- `mydocs/working/task_m010_1_stage3.md`

수정:

- 필요 시 `README.md`
- 필요 시 `NOTICE`
- 필요 시 `THIRD_PARTY.md`

### 변경 내용

- 첨부 계획서의 저장소 구조에 맞춰 Chrome 전용 코드와 Firefox 유래 코드의 디렉터리 경계를 만든다.
- `src/firefox-derived/README.md`에 upstream 후보 파일, MPL 2.0 정책, 수정 시 유지할 헤더, Chrome 전용 구현과의 경계를 명시한다.
- Firefox 원본 코드는 이번 Stage에서 복사/포팅하지 않는다. 포팅은 후속 Phase 2 이슈에서 수행한다.

### 검증

```bash
find src -maxdepth 3 -print
test -f src/firefox-derived/README.md
rg "MPL-2.0|Firefox Screenshots|overlayHelpers|Chrome extension" src/firefox-derived/README.md
git diff --check
```

### 커밋

```text
Task #1 Stage 3: 소스 구조와 Firefox-derived 정책 추가
```

## Stage 4 — 최종 검증과 보고

### 산출물

신규:

- `mydocs/report/task_m010_1_report.md`

수정:

- `mydocs/orders/20260525.md`
- 필요 시 Stage 1~3 산출물의 작은 정정

### 변경 내용

- Issue #1 수용 기준을 기준으로 전체 산출물을 최종 점검한다.
- 오늘할일 상태를 완료로 갱신한다.
- 최종 결과보고서에 변경 요약, 검증 결과, 남은 리스크, 후속 이슈 후보를 정리한다.
- PR 게시 전 `task-final-report` 절차로 이어질 수 있게 작업트리를 정리한다.

### 검증

```bash
npm run build
npm run typecheck
git diff --check
git status --short
```

### 커밋

```text
Task #1 Stage 4 + 최종 보고서: Phase 0 기반 세팅 완료
```

## 검증

- 각 Stage 검증 명령은 단계 보고서 작성 전에 실행한다.
- 실패한 검증은 단계 완료로 처리하지 않는다.
- 계획 변경이 필요하면 구현계획서를 먼저 갱신하고 작업지시자 승인을 받는다.
- 문서 위치가 수행계획서 판단과 달라지면 구현 전에 수행계획서 또는 구현계획서를 갱신하고 작업지시자 승인을 받는다.

## 커밋

- 단계 커밋은 단계 산출물과 `mydocs/working/task_m010_1_stage{N}.md`를 함께 묶는다.
- 커밋 메시지는 `Task #1 Stage {N}: {핵심 내용 요약}` 형식을 따른다.
- 최종 보고서 커밋은 `Task #1 Stage 4 + 최종 보고서: Phase 0 기반 세팅 완료` 형식을 따른다.

## 단계 의존성

- Stage 2는 Stage 1의 라이선스/출처 문서가 확정된 후 진행한다.
- Stage 3은 Stage 2의 빌드 구조가 확정된 후 진행한다.
- Stage 4는 Stage 1~3 검증과 단계 보고서 승인이 끝난 후 진행한다.

## 위험과 대응

- **MIT 라이선스 승인 필요**: 프로젝트 주 라이선스가 MIT가 아니면 Stage 1 전에 `LICENSE` 내용을 조정한다.
- **네트워크 의존성 설치 실패**: `npm install`이 네트워크 또는 registry 문제로 실패하면 실패 로그를 남기고 승인을 받아 재시도한다.
- **Vite entrypoint 부재**: Phase 0에서는 runtime entrypoint를 만들지 않으므로, Vite 설정은 실제 entrypoint 연결 전까지 최소 구성에 머문다.
- **계획 범위 초과**: overlay/capture/copy/save 구현 요구가 생기면 이번 task에 섞지 않고 후속 이슈로 분리한다.

## 승인 요청 사항

- 위 4개 Stage 분할과 산출물 경로 승인
- Stage 1에서 프로젝트 주 라이선스 기본안을 MIT로 사용하는 것 승인
- Stage 2에서 npm + TypeScript + Vite 구성을 사용하는 것 승인
- Stage 3에서 Firefox 원본 코드를 아직 복사하지 않고 디렉터리/정책만 만드는 것 승인
- Stage 4까지 완료한 뒤 `task-final-report` 절차로 PR 게시 준비에 들어가는 것 승인
