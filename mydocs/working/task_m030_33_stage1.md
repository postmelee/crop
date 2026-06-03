# Task #33 Stage 1 완료 보고서 - i18n 기반과 locale 리소스 추가

GitHub Issue: [#33](https://github.com/postmelee/crop/issues/33)
구현계획서: [`task_m030_33_impl.md`](../plans/task_m030_33_impl.md)
Stage: 1

## 단계 목적

Chrome Extension 표준 i18n 기반을 마련한다. 이번 단계는 실제 오버레이 문자열 치환 전 준비 단계로, manifest localization, `_locales` 메시지 리소스, Vite build 산출물 emit, runtime i18n wrapper, locale/manifest key 검증 테스트를 추가하는 데 목적이 있다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `_locales/en/messages.json` | 기본 locale 메시지 31개 추가 |
| `_locales/ko/messages.json` | Korean locale 메시지 31개 추가 |
| `_locales/ja/messages.json` | Japanese locale 메시지 31개 추가 |
| `_locales/zh_CN/messages.json` | Simplified Chinese locale 메시지 31개 추가 |
| `manifest.json` | `default_locale: en` 추가, name/description/action/command를 `__MSG_*__`로 전환 |
| `vite.config.ts` | `_locales/{locale}/messages.json`을 `dist/_locales`로 emit하는 Vite plugin 추가 |
| `src/shared/i18n.ts` | `chrome.i18n.getMessage()` 우선 조회와 English fallback/placeholder formatting wrapper 추가 |
| `tests/manifest.test.ts` | manifest i18n 필드와 default locale key 존재 검증 추가 |
| `tests/shared/i18n.test.ts` | locale key parity, placeholder parity, fallback, Chrome API 우선순위 테스트 추가 |

## 본문 변경 정도 / 본문 무손실 여부

코드/리소스 추가 작업이므로 문서 원문 무손실 여부는 해당 없음. 기존 runtime 동작에는 아직 i18n wrapper를 연결하지 않았고, manifest metadata만 Chrome i18n 참조로 전환했다. MVP 권한 목록과 command shortcut은 유지했다.

## 검증 결과

실행 명령:

```bash
npm run typecheck
npm run build
find dist/_locales -type f
git diff --check
npm run test
```

결과:

- OK: `npm run typecheck` 통과.
- OK: `npm run build` 통과. build 출력에 `dist/_locales/en/messages.json`, `dist/_locales/ko/messages.json`, `dist/_locales/ja/messages.json`, `dist/_locales/zh_CN/messages.json` 포함 확인.
- OK: `find dist/_locales -type f`에서 4개 locale messages 파일 확인.
- OK: `git diff --check` 경고 없음.
- OK: `npm run test` 통과. 17 files, 199 tests passed.

## 잔여 위험

- Stage 1은 기반만 추가했으므로 overlay runtime에는 아직 지역화 문자열이 적용되지 않았다.
- 실제 Chrome UI locale별 수동 smoke는 Stage 2에서 문자열 치환 후 의미가 있다.
- 번역 문구 길이에 따른 버튼/preview layout 영향은 Stage 2에서 확인해야 한다.

## 다음 단계 영향

- Stage 2는 `src/shared/i18n.ts`의 `getCropMessage()`를 사용해 `src/content/overlay/crop-template.ts`와 `src/content/overlay/crop-overlay.ts`의 사용자-facing 문자열을 치환한다.
- Stage 2에서 action id, dataset status, internal capture mode 같은 내부 계약 문자열은 계속 번역하지 않는다.
- Stage 2 테스트는 이번 Stage의 locale key parity 테스트를 유지하면서 overlay 하드코딩 문자열 기준을 i18n key 또는 fallback 메시지 기준으로 갱신한다.

## 승인 요청

- Stage 1 산출물과 검증 결과를 승인하면 Stage 2 — 오버레이 사용자-facing 문자열 치환으로 진행한다.
