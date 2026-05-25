# Task #3 Stage 1 보고서

GitHub Issue: [#3](https://github.com/postmelee/crop/issues/3)
구현계획서: [`task_m010_3_impl.md`](../plans/task_m010_3_impl.md)
Stage: 1

## 단계 목적

Stage 1은 Chrome MV3 확장 shell의 source manifest와 Vite build output 경로를 먼저 고정하는 단계다. Phase 0의 virtual no-op entry를 실제 extension entrypoint 경로로 교체했고, build 결과가 `dist/manifest.json`, `dist/background/service-worker.js`, `dist/content/inject.js` 형태로 생성되는지 확인했다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `manifest.json` | MV3 manifest, `crop` metadata, `activeTab`/`scripting`/`clipboardWrite` 권한, background/action/command 정의 |
| `vite.config.ts` | root manifest를 `dist/manifest.json`으로 emit하고 background/content entrypoint를 extension output 경로로 build하도록 변경 |
| `tsconfig.json` | Vite config에서 source manifest JSON을 import할 수 있도록 `resolveJsonModule` 추가 |
| `src/background/service-worker.ts` | Stage 1 build 경로 검증용 최소 placeholder entry 추가 |
| `src/content/inject.ts` | Stage 1 build 경로 검증용 최소 placeholder entry 추가 |

## 본문 변경 정도 / 본문 무손실 여부

Phase 0의 Vite 설정은 virtual no-op entry와 empty bundle 삭제 플러그인을 사용했다. 이번 단계에서 해당 설정을 실제 MV3 산출물 경로 중심으로 교체했다. background 주입 흐름과 content overlay stub 동작은 아직 구현하지 않았고, Stage 2와 Stage 3에서 각각 채울 placeholder만 추가했다.

## 검증 결과

실행 명령:

```bash
npm run build
test -f dist/manifest.json
find dist -maxdepth 3 -type f -print
npm run typecheck
node -e "const fs=require('fs'); JSON.parse(fs.readFileSync('dist/manifest.json','utf8')); console.log('dist manifest ok')"
node -e "const m=require('./dist/manifest.json'); console.log(m.manifest_version, m.name, m.permissions.join(','), m.background.service_worker, m.commands._execute_action.suggested_key.default, m.commands._execute_action.suggested_key.mac)"
rg "debugger|<all_urls>" manifest.json dist/manifest.json
git diff --check
```

결과:

- OK: `npm run build`가 Vite v6.4.2로 성공했다.
- OK: `dist/manifest.json`이 생성됐다.
- OK: `dist/background/service-worker.js`, `dist/content/inject.js`와 각 sourcemap이 생성됐다.
- OK: `npm run typecheck`가 성공했다.
- OK: `dist/manifest.json` JSON parse가 성공했다.
- OK: built manifest가 `manifest_version=3`, `name=crop`, `permissions=activeTab,scripting,clipboardWrite`, `background/service-worker.js`, `Ctrl+Shift+S`, `Command+Shift+S`를 가진다.
- OK: `debugger`와 `<all_urls>`는 `manifest.json`과 `dist/manifest.json`에서 발견되지 않았다.
- OK: `git diff --check`가 경고 없이 통과했다.

## 잔여 위험

- `src/background/service-worker.ts`와 `src/content/inject.ts`는 아직 placeholder다. 실제 action click, command, script injection, overlay stub 동작은 Stage 2와 Stage 3에서 구현해야 한다.
- Chrome unpacked extension 수동 로드는 Stage 4에서 최종 smoke 절차로 수행한다.

## 다음 단계 영향

- Stage 2는 `manifest.json`이 참조하는 `background/service-worker.js` output을 기준으로 background 주입 흐름을 구현한다.
- Stage 3은 `manifest.json`과 background가 참조할 `content/inject.js` output을 기준으로 overlay stub을 구현한다.

## 승인 요청

- Stage 1 산출물과 검증 결과를 승인하면 다음 단계로 진행한다.
