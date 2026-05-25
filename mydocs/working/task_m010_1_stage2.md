# Task #1 Stage 2 보고서

GitHub Issue: [#1](https://github.com/postmelee/crop/issues/1)
구현계획서: [`task_m010_1_impl.md`](../plans/task_m010_1_impl.md)
Stage: 2

## 단계 목적

Stage 2는 Phase 0 기반 세팅 중 npm, TypeScript, Vite 빌드 기반을 추가하는 단계다. 아직 MV3 runtime entrypoint가 없으므로 실제 확장 코드는 만들지 않고, Phase 1에서 manifest/background/content entrypoint를 연결할 수 있는 최소 빌드 설정과 검증 명령을 마련했다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `.gitignore` | `node_modules/`, `dist/`, macOS/ npm debug 부산물 제외 |
| `package.json` | npm 패키지 메타데이터, `build`, `typecheck` 스크립트, TypeScript/Vite dev dependency 추가 |
| `package-lock.json` | `npm install` 결과 lockfile 추가 |
| `tsconfig.json` | ES2022, DOM, strict TypeScript 설정 추가 |
| `vite.config.ts` | Phase 0용 virtual no-op entry와 Vite build output 기본 설정 추가 |
| `README.md` | Node/npm 전제조건과 `npm install`, `npm run build`, `npm run typecheck` 안내 추가 |
| `mydocs/plans/task_m010_1_impl.md` | Stage 2 산출물에 `.gitignore` 명시 |

## 본문 변경 정도 / 본문 무손실 여부

Stage 1에서 작성한 `README.md`는 기존 내용을 유지하고 Local Development 섹션만 추가했다. 구현계획서는 빌드 부산물을 커밋하지 않기 위해 필요한 `.gitignore`를 Stage 2 산출물에 추가하는 범위로 보정했다. 제품 runtime 코드나 manifest는 생성하지 않았다.

## 검증 결과

실행 명령:

```bash
npm install
npm run build
npm run typecheck
git diff --check
git check-ignore -v node_modules dist/
```

결과:

- OK: `npm install`이 14개 package를 설치하고 `package-lock.json`을 생성했다.
- OK: npm audit 결과 취약점 0개가 보고됐다.
- OK: `npm run build`가 Vite v6.4.2로 Phase 0 virtual entry build를 성공했다.
- OK: `npm run typecheck`가 `tsc --noEmit`으로 성공했다.
- OK: `git diff --check`가 경고 없이 통과했다.
- OK: `.gitignore`가 `node_modules/`와 `dist/`를 제외하는 것을 확인했다.

## 잔여 위험

- Phase 0 Vite 설정은 실제 MV3 entrypoint가 아니라 virtual no-op entry를 사용한다. Phase 1에서 `manifest.json`, background service worker, content script entrypoint가 생기면 Rollup input/output을 실제 파일 기준으로 교체해야 한다.
- `npm install`은 registry 네트워크 접근이 필요하다. 제한된 환경에서는 재시도 또는 캐시 설정이 필요할 수 있다.

## 다음 단계 영향

- Stage 3에서 `src/` 디렉터리와 `src/firefox-derived/README.md`를 추가하면 `tsconfig.json`의 `src/**/*.ts` include 범위가 실제 소스 구조와 맞아진다.
- Phase 1에서는 현재 Vite virtual entry를 실제 MV3 entrypoint로 교체해야 한다.

## 승인 요청

- Stage 2 산출물과 검증 결과를 승인하면 다음 단계로 진행한다.
