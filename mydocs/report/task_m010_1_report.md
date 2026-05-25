# Task #1 최종 보고서

GitHub Issue: [#1](https://github.com/postmelee/crop/issues/1)
마일스톤: M010

## 작업 요약

- 대상 이슈: #1
- 마일스톤: M010
- 단계 수: 4
- 작업 목적: `crop` Chrome MV3 확장 개발을 시작하기 위한 Phase 0 저장소/라이선스/빌드 기반을 구축한다.

## 변경 파일 목록과 영향 범위

| 경로 | 변경 요약 | 영향 범위 |
|---|---|---|
| `.gitignore` | `node_modules/`, `dist/`, macOS/npm 부산물 제외 | 개발 환경 |
| `README.md` | 프로젝트 목적, MVP 범위, 개발 명령, source layout, 라이선스/브랜딩 안내 추가 | 사용자/기여자 진입 문서 |
| `LICENSE` | MIT License 추가 | 프로젝트 주 라이선스 |
| `LICENSE-MPL-2.0` | Mozilla Public License 2.0 원문 추가 | Firefox-derived 파일 라이선스 참조 |
| `NOTICE` | Mozilla/Firefox 비제휴와 Firefox-derived 고지 정책 추가 | 배포/출처 고지 |
| `THIRD_PARTY.md` | 예정된 Firefox Screenshots upstream 후보와 MPL 처리 규칙 추가 | third-party 출처 관리 |
| `package.json` | npm metadata, `build`, `typecheck`, TypeScript/Vite dev dependency 추가 | 빌드 기반 |
| `package-lock.json` | npm lockfile 추가 | 재현 가능한 의존성 설치 |
| `tsconfig.json` | strict TypeScript 설정 추가 | 타입 검증 |
| `vite.config.ts` | Phase 0 virtual no-op entry 기반 Vite build 설정 추가 | 빌드 검증 |
| `src/background/.gitkeep` | background service worker 코드 위치 생성 | 소스 구조 |
| `src/content/.gitkeep` | content script 코드 위치 생성 | 소스 구조 |
| `src/content/overlay/.gitkeep` | Shadow DOM overlay UI 코드 위치 생성 | 소스 구조 |
| `src/shared/.gitkeep` | shared helper 코드 위치 생성 | 소스 구조 |
| `src/firefox-derived/README.md` | Firefox-derived upstream 후보, MPL-2.0 헤더, Chrome extension 경계 정책 추가 | source-local 정책 |
| `mydocs/orders/20260525.md` | Task #1 진행/완료 상태 기록 | Hyper-Waterfall 운영 산출물 |
| `mydocs/plans/task_m010_1.md` | 수행계획서 작성 | Hyper-Waterfall 운영 산출물 |
| `mydocs/plans/task_m010_1_impl.md` | 구현계획서 작성과 Stage 2 `.gitignore` 산출물 보정 | Hyper-Waterfall 운영 산출물 |
| `mydocs/working/task_m010_1_stage1.md` | Stage 1 완료 보고 | Hyper-Waterfall 운영 산출물 |
| `mydocs/working/task_m010_1_stage2.md` | Stage 2 완료 보고 | Hyper-Waterfall 운영 산출물 |
| `mydocs/working/task_m010_1_stage3.md` | Stage 3 완료 보고 | Hyper-Waterfall 운영 산출물 |
| `mydocs/report/task_m010_1_report.md` | 최종 결과 보고 | Hyper-Waterfall 운영 산출물 |

## 문서 위치 검증

수행계획서의 "문서 위치 판단"은 루트 표준 파일과 `src/firefox-derived/README.md`만 사용하는 방향이었다. 실제 산출물도 동일하며, `docs/`, `specs/`, `site/`, `website/`, `adr/` 같은 공식 문서 루트는 만들지 않았다.

| 파일 | 계획된 위치 | 실제 위치 | 결과 | 근거 |
|---|---|---|---|---|
| `README.md` | 루트 `README.md` | `README.md` | OK | 루트 문서로 추가됨 |
| `LICENSE` | 루트 `LICENSE` | `LICENSE` | OK | 루트 라이선스로 추가됨 |
| `LICENSE-MPL-2.0` | 루트 `LICENSE-MPL-2.0` | `LICENSE-MPL-2.0` | OK | 루트 MPL 원문으로 추가됨 |
| `NOTICE` | 루트 `NOTICE` | `NOTICE` | OK | 루트 고지 파일로 추가됨 |
| `THIRD_PARTY.md` | 루트 `THIRD_PARTY.md` | `THIRD_PARTY.md` | OK | 루트 third-party 문서로 추가됨 |
| `src/firefox-derived/README.md` | `src/firefox-derived/README.md` | `src/firefox-derived/README.md` | OK | source-local 정책 문서로 추가됨 |

## 변경 전·후 정량 비교

| 지표 | 변경 전 | 변경 후 |
|---|---|---|
| Task #1 브랜치 변경 파일 수 | 0 | 22 |
| Task #1 브랜치 추가 라인 수 | 0 | 2501 |
| npm package metadata | 없음 | `package.json`, `package-lock.json` 존재 |
| 빌드 검증 명령 | 없음 | `npm run build`, `npm run typecheck` 존재 |
| `src/` 소스 경계 | 없음 | background/content/overlay/shared/firefox-derived 경계 존재 |
| Stage 보고서 | 없음 | Stage 1, Stage 2, Stage 3 보고서 존재 |

## 검증 결과

| 수용 기준 | 결과 |
|---|---|
| 로컬에서 의존성 설치 후 기본 빌드 명령을 실행할 수 있다. | OK — `npm install`, `npm run build`, `npm run typecheck` 통과 |
| MV3 확장 산출물을 만들 수 있는 프로젝트 구조가 존재한다. | OK — TypeScript/Vite 기반과 `src/background`, `src/content`, `src/shared` 경계 생성 |
| Firefox 유래 파일을 둘 위치가 `src/firefox-derived/`로 분리되어 있다. | OK — `src/firefox-derived/README.md`와 디렉터리 생성 |
| MPL 2.0 및 Mozilla Firefox Screenshots 출처 고지가 저장소에 존재한다. | OK — `LICENSE-MPL-2.0`, `NOTICE`, `THIRD_PARTY.md`, `src/firefox-derived/README.md` 추가 |
| 사용자-facing 제품명은 `crop`으로 유지되고 Mozilla/Firefox 공식 제품처럼 보이는 표현이 없다. | OK — README/NOTICE/THIRD_PARTY에서 비제휴 고지와 사실 관계 출처 문맥으로 제한 |
| overlay/capture/copy/save 구현은 이번 task에서 제외한다. | OK — runtime implementation, `manifest.json`, content/background entrypoint는 생성하지 않음 |

### 단계별 검증 결과

- Stage 1: [`task_m010_1_stage1.md`](../working/task_m010_1_stage1.md) — 라이선스/고지 파일 존재, MPL/Mozilla/Firefox/crop 문구, MIT/MPL 라이선스 문구, `git diff --check` 통과
- Stage 2: [`task_m010_1_stage2.md`](../working/task_m010_1_stage2.md) — `npm install`, `npm run build`, `npm run typecheck`, `git diff --check`, `.gitignore` 확인 통과
- Stage 3: [`task_m010_1_stage3.md`](../working/task_m010_1_stage3.md) — `src/` 구조, Firefox-derived README, MPL/Firefox/Chrome 경계 문구, `npm run build`, `npm run typecheck`, `git diff --check` 통과
- Stage 4: 통합 검증으로 `npm run build`, `npm run typecheck`, `git diff --check`, `git status --short` 통과

### 통합 검증 로그 요약

```bash
npm run build
# vite v6.4.2, 1 module transformed, built successfully

npm run typecheck
# tsc --noEmit, success

git diff --check
# no output

git status --short
# no output before final report/order edits
```

## 잔여 위험과 후속 작업

### 잔여 위험

- Phase 0 Vite 설정은 virtual no-op entry 기반이다. Phase 1에서 실제 `manifest.json`, background service worker, content script entrypoint가 추가되면 Vite input/output을 실제 MV3 산출물 기준으로 교체해야 한다.
- Firefox 원본 코드는 아직 복사하지 않았다. Phase 2 포팅 시 upstream URL, commit/revision, local path, modification summary를 `THIRD_PARTY.md`와 `src/firefox-derived/README.md`에 추가해야 한다.
- 프로젝트 주 라이선스는 MIT 기본안으로 설정했다. 변경이 필요하면 별도 승인으로 조정해야 한다.

### 후속 작업 후보

- Phase 1: Chrome MV3 extension shell 구현
- Phase 2: Firefox-derived helper 포팅
- Phase 3: Firefox식 overlay UI 구현
- Phase 4: capture/crop backend 구현
- Phase 5: Copy/Save 구현

## 작업지시자 승인 요청

- 최종 보고서와 수용 기준 검증 결과를 승인하면 `publish/task1` 원격 브랜치 push와 `devel` 대상 PR 게시 절차로 진행한다.
