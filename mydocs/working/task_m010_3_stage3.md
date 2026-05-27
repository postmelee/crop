# Task #3 Stage 3 보고서

GitHub Issue: [#3](https://github.com/postmelee/crop/issues/3)
구현계획서: [`task_m010_3_impl.md`](../plans/task_m010_3_impl.md)
Stage: 3

## 단계 목적

Stage 3은 background에서 주입하는 `content/inject.js`가 실제 페이지에 최소 overlay shell을 표시하도록 만드는 단계다. Phase 1 범위에 맞춰 `__crop_root__` host, Shadow DOM, 중복 주입 방지, Escape/close 제거 동작만 구현했고 hover/select 캡처 UI는 후속 Phase 이슈로 남겼다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `src/content/inject.ts` | `__crop_root__` host 생성, Shadow DOM overlay stub, 중복 실행 flash 처리, Escape/close 제거 동작 추가 |
| `mydocs/working/task_m010_3_stage3.md` | Stage 3 완료 보고서 작성 |

## 본문 변경 정도 / 본문 무손실 여부

Stage 1의 placeholder content entry를 실제 content script stub으로 교체했다. 페이지 본문 DOM은 `document.documentElement` 아래에 `__crop_root__` host 하나를 추가하는 방식이며, UI 스타일과 이벤트는 Shadow DOM 내부로 제한했다. 중복 실행 시 기존 crop host를 재사용하고, 같은 id를 가진 외부 요소가 있으면 제거하지 않고 warning만 남긴다.

## 검증 결과

실행 명령:

```bash
npm run build
npm run typecheck
rg "__crop_root__|crop|attachShadow|Escape" src/content/inject.ts
git diff --check
```

결과:

- OK: `npm run build`가 Vite v6.4.2로 성공했고 `dist/content/inject.js`가 3.87 kB로 생성됐다.
- OK: `npm run typecheck`가 성공했다.
- OK: `rg`에서 `__crop_root__`, `crop`, `attachShadow`, `Escape` 사용을 확인했다.
- OK: `git diff --check`가 경고 없이 통과했다.

## 잔여 위험

- 실제 Chrome에서 action icon click과 shortcut으로 overlay가 표시되는지는 Stage 4의 unpacked extension smoke test에서 확인해야 한다.
- 이 단계의 overlay는 shell 검증용이다. DOM 요소 hover 하이라이트, 영역 선택, Copy/Save 캡처는 #4~#7 후속 이슈 범위로 유지한다.

## 다음 단계 영향

- Stage 4는 `dist/`를 Chrome unpacked extension으로 로드하는 절차를 README에 기록하고, 가능한 범위에서 action icon, shortcut, 중복 실행, 제한 페이지 warning smoke test를 수행한다.

## 승인 요청

- Stage 3 산출물과 검증 결과를 승인하면 다음 단계로 진행한다.
