# Task #3 Stage 2 보고서

GitHub Issue: [#3](https://github.com/postmelee/crop/issues/3)
구현계획서: [`task_m010_3_impl.md`](../plans/task_m010_3_impl.md)
Stage: 2

## 단계 목적

Stage 2는 MV3 background service worker에서 확장 아이콘 클릭과 `open-crop` 단축키 실행을 같은 content script 주입 흐름으로 연결하는 단계다. Stage 1에서 확정한 `content/inject.js` output 경로를 `chrome.scripting.executeScript()`의 대상 파일로 사용했다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `src/background/service-worker.ts` | action click handler, command handler, 공통 `injectCrop()` 흐름, 제한 URL/tab id/주입 실패 warning, shortcut 등록 상태 warning 추가 |
| `mydocs/working/task_m010_3_stage2.md` | Stage 2 완료 보고서 작성 |

## 본문 변경 정도 / 본문 무손실 여부

Stage 1의 placeholder background entry를 실제 MV3 event listener와 script injection 흐름으로 교체했다. 제품 범위는 Phase 1 shell에 한정했고, content overlay 동작은 아직 구현하지 않았다. `@types/chrome` 의존성은 추가하지 않고 Stage 2에서 사용하는 Chrome API 표면만 파일 내부 타입으로 좁게 선언했다.

## 검증 결과

실행 명령:

```bash
npm run typecheck
rg "chrome.action.onClicked|chrome.commands.onCommand|executeScript|commands.getAll" src/background/service-worker.ts
npm run build
git diff --check
```

결과:

- OK: `npm run typecheck`가 성공했다.
- OK: `rg`에서 `chrome.action.onClicked`, `chrome.commands.onCommand`, `executeScript`, `commands.getAll` 사용을 확인했다.
- OK: `npm run build`가 Vite v6.4.2로 성공했고 `dist/background/service-worker.js`가 1.34 kB로 생성됐다.
- OK: `git diff --check`가 경고 없이 통과했다.

## 잔여 위험

- 제한 페이지 판정은 명시적 URL prefix 기반이다. 실제 Chrome 주입 실패는 `executeScript()` 예외 warning으로 한 번 더 처리한다.
- `src/content/inject.ts`는 아직 placeholder라서 주입 성공 후 사용자에게 보이는 overlay는 Stage 3에서 구현해야 한다.
- Chrome unpacked extension 수동 smoke test는 Stage 4에서 수행한다.

## 다음 단계 영향

- Stage 3은 `content/inject.js`가 주입되는 전제 위에서 `__crop_root__` 기반 overlay stub과 중복 실행 방지, Escape/close 제거 동작을 구현한다.

## 승인 요청

- Stage 2 산출물과 검증 결과를 승인하면 다음 단계로 진행한다.
