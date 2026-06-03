# Task #33 최종 보고서 - 확장 UI 사용자-facing 텍스트 다국어화

GitHub Issue: [#33](https://github.com/postmelee/crop/issues/33)
마일스톤: M030

## 작업 요약

- 대상 이슈: #33
- 마일스톤: M030
- 단계 수: 3
- 작업 목적: Chrome MV3 확장의 manifest와 Shadow DOM overlay 사용자-facing 문자열을 Chrome Extension 표준 i18n 기반으로 전환한다.

## 변경 파일 목록과 영향 범위

| 경로 | 변경 요약 | 영향 범위 |
|---|---|---|
| `_locales/en/messages.json` | English 기본 locale 메시지 추가 | extension metadata, overlay UI fallback |
| `_locales/ko/messages.json` | Korean locale 메시지 추가 | Chrome UI locale `ko` 사용자-facing UI |
| `_locales/ja/messages.json` | Japanese locale 메시지 추가 | Chrome UI locale `ja` 사용자-facing UI |
| `_locales/zh_CN/messages.json` | Simplified Chinese locale 메시지 추가 | Chrome UI locale `zh_CN` 사용자-facing UI |
| `manifest.json` | `default_locale: en`과 `__MSG_*__` manifest metadata 적용 | Chrome extension manifest localization |
| `vite.config.ts` | `_locales`를 `dist/_locales`에 emit하는 build plugin 추가 | extension package 산출물 |
| `src/shared/i18n.ts` | `chrome.i18n.getMessage()` wrapper와 English fallback/placeholder formatting 추가 | content script/runtime 문자열 조회 |
| `src/content/overlay/crop-template.ts` | prompt, mode toolbar, action button, preview, resize handle label 지역화 | Shadow DOM overlay UI |
| `src/content/overlay/crop-overlay.ts` | copy success toast와 copy/save failure status 지역화 | capture 후 사용자-facing status |
| `tests/manifest.test.ts` | manifest i18n key 검증 추가 | manifest regression |
| `tests/shared/i18n.test.ts` | locale key parity, placeholder, Chrome API/fallback 테스트 추가 | i18n helper regression |
| `tests/content/overlay/phase6-regression.test.ts` | overlay i18n wiring과 하드코딩 잔여 방지 테스트 추가 | overlay regression |

## 문서 위치 검증

| 파일 | 계획된 위치 | 실제 위치 | 결과 | 근거 |
|---|---|---|---|---|
| `_locales/*/messages.json` | `_locales/` | `_locales/` | OK | 수행계획서의 Chrome Extension i18n 표준 위치 판단과 일치 |
| 작업 산출물 문서 | `mydocs/` | `mydocs/plans`, `mydocs/working`, `mydocs/report` | OK | 하이퍼-워터폴 계획/단계/최종 보고 문서 위치와 일치 |
| 공식 사용자 문서 | 해당 없음 | 해당 없음 | OK | README/공식 문서 수정은 이번 task 범위에서 제외 |

## 변경 전·후 정량 비교

| 지표 | 변경 전 | 변경 후 |
|---|---|---|
| 지원 locale resource | 없음 | `en`, `ko`, `ja`, `zh_CN` 4개 |
| locale message key | 없음 | 31개 key, 4개 locale 동일 key set |
| i18n 단위 테스트 | 없음 | `tests/shared/i18n.test.ts` 5 tests |
| manifest 테스트 | shortcut 1 test | manifest i18n + shortcut 3 tests |
| 전체 테스트 수 | 196 tests | 201 tests |
| build locale 산출물 | 없음 | `dist/_locales/{en,ko,ja,zh_CN}/messages.json` |

## 검증 결과

| 수용 기준 | 결과 |
|---|---|
| Chrome UI locale에 따라 overlay 주요 텍스트가 해당 locale 메시지로 표시된다. | OK — `getCropMessage()`를 overlay template/runtime에 연결했고 CDP mock smoke로 en/ko/ja/zh_CN prompt/action 텍스트를 확인했다. |
| locale 파일이 없는 언어는 default locale로 안전하게 fallback된다. | OK — `src/shared/i18n.ts`가 Chrome API 빈 응답 또는 부재 시 English fallback을 사용하고 `i18n.test.ts`가 검증한다. |
| manifest localization이 Chrome MV3 규칙에 맞게 동작한다. | OK — `manifest.json`에 `default_locale: en`과 `__MSG_*__`를 적용했고 `manifest.test.ts`가 default locale key 존재를 검증한다. |
| `_locales`가 `dist/` 산출물에 포함된다. | OK — `npm run build`와 `find dist/_locales -type f`에서 4개 locale messages 파일 확인. |
| 기존 캡처, Copy, Save, overlay hide 동작은 회귀하지 않는다. | OK — 기존 overlay/capture regression 포함 `npm run test` 17 files, 201 tests 통과. |

### 단계별 검증 결과

- Stage 1: [`task_m030_33_stage1.md`](../working/task_m030_33_stage1.md) — i18n 기반, locale resource, build emit, manifest/i18n 테스트 추가. `npm run typecheck`, `npm run build`, `find dist/_locales -type f`, `git diff --check`, `npm run test` 통과.
- Stage 2: [`task_m030_33_stage2.md`](../working/task_m030_33_stage2.md) — overlay template/runtime 사용자-facing 문자열 치환. `npm run typecheck`, `npm run test`, 사용자-facing 하드코딩 잔여 grep, `git diff --check`, `npm run build` 통과.
- Stage 3: [`task_m030_33_stage3.md`](../working/task_m030_33_stage3.md) — i18n 회귀 테스트 정리. `npm run typecheck`, `npm run test`, `npm run build`, `find dist/_locales -type f`, 사용자-facing 하드코딩 잔여 grep, `git diff --check` 통과.

## PR 스크린샷 placeholder

아래 8개 이미지는 PR 본문에 직접 업로드한 GitHub 이미지 URL로 교체할 placeholder다. 로컬 확인 산출물은 `/tmp/crop-i18n-shots/`에 생성했다.

| 구분 | Locale | 로컬 파일 | PR placeholder |
|---|---|---|---|
| Overlay prompt/mode | English | `/tmp/crop-i18n-shots/crop_overlay_prompt_en.png` | `![Overlay prompt - English](TODO_UPLOAD_crop_overlay_prompt_en.png)` |
| Overlay prompt/mode | Korean | `/tmp/crop-i18n-shots/crop_overlay_prompt_ko.png` | `![Overlay prompt - Korean](TODO_UPLOAD_crop_overlay_prompt_ko.png)` |
| Overlay prompt/mode | Japanese | `/tmp/crop-i18n-shots/crop_overlay_prompt_ja.png` | `![Overlay prompt - Japanese](TODO_UPLOAD_crop_overlay_prompt_ja.png)` |
| Overlay prompt/mode | Simplified Chinese | `/tmp/crop-i18n-shots/crop_overlay_prompt_zh_CN.png` | `![Overlay prompt - Simplified Chinese](TODO_UPLOAD_crop_overlay_prompt_zh_CN.png)` |
| Selected action box | English | `/tmp/crop-i18n-shots/crop_overlay_en.png` | `![Selected actions - English](TODO_UPLOAD_crop_overlay_en.png)` |
| Selected action box | Korean | `/tmp/crop-i18n-shots/crop_overlay_ko.png` | `![Selected actions - Korean](TODO_UPLOAD_crop_overlay_ko.png)` |
| Selected action box | Japanese | `/tmp/crop-i18n-shots/crop_overlay_ja.png` | `![Selected actions - Japanese](TODO_UPLOAD_crop_overlay_ja.png)` |
| Selected action box | Simplified Chinese | `/tmp/crop-i18n-shots/crop_overlay_zh_CN.png` | `![Selected actions - Simplified Chinese](TODO_UPLOAD_crop_overlay_zh_CN.png)` |

## 잔여 위험과 후속 작업

### 잔여 위험

- 실제 Chrome UI locale 전환 기반 수동 smoke는 macOS `--lang` 제약 때문에 수행하지 못했다. 대신 같은 build artifact와 `chrome.i18n` mock을 사용한 CDP rendering smoke로 overlay UI 문자열을 확인했다.
- Chrome Web Store listing localization, promotional screenshots, store copy는 이번 task 범위에서 제외했다.

### 후속 작업 후보

- Chrome Web Store listing 다국어 문구와 스토어 스크린샷 localization task.
- 실제 OS/Chrome UI locale별 수동 smoke를 릴리즈 체크리스트에 포함하는 task.

## 작업지시자 승인 요청

- 최종 보고서와 수용 기준 검증 결과를 승인하면 PR 게시 절차로 진행한다.
