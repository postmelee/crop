# Task #33 구현계획서 - 확장 UI 사용자-facing 텍스트 다국어화

수행계획서: [`task_m030_33.md`](task_m030_33.md)
GitHub Issue: [#33](https://github.com/postmelee/crop/issues/33)
마일스톤: M030

## 단계 개요

| Stage | 제목 | 주요 산출 | 검증 |
|---|---|---|---|
| 1 | i18n 기반과 locale 리소스 추가 | `_locales/*/messages.json`, `manifest.json`, `vite.config.ts`, i18n wrapper | locale key parity, manifest key 검증, `npm run typecheck`, `npm run build` |
| 2 | 오버레이 사용자-facing 문자열 치환 | `src/content/overlay/crop-template.ts`, `src/content/overlay/crop-overlay.ts` | overlay 문자열 테스트, `npm run typecheck`, `npm run test` |
| 3 | 회귀 테스트와 산출물 검증 정리 | manifest/phase6/i18n 테스트, build 산출물 검증 | `npm run typecheck`, `npm run test`, `npm run build`, `git diff --check` |

## 문서 위치 확인

수행계획서의 "문서 위치 판단"과 실제 Stage 산출물 경로는 일치한다. `_locales/*/messages.json`은 문서가 아니라 Chrome extension 런타임 번역 리소스이므로 extension root에 둔다.

| 파일 | 수행계획서상 선택 위치 | Stage 산출물 경로 | 일치 여부 | 비고 |
|---|---|---|---|---|
| `_locales/*/messages.json` | `_locales/` | `_locales/` | OK | Chrome Extension i18n 표준 위치 |
| `mydocs/plans/task_m030_33_impl.md` | `mydocs/` | `mydocs/plans/task_m030_33_impl.md` | OK | 작업 산출물 |
| `mydocs/working/task_m030_33_stage{N}.md` | `mydocs/` | `mydocs/working/` | OK | 단계별 완료보고서 |
| `mydocs/report/task_m030_33_report.md` | `mydocs/` | `mydocs/report/` | OK | 최종 결과보고서 |

## Stage 1 — i18n 기반과 locale 리소스 추가

### 산출물

신규:

- `_locales/en/messages.json`
- `_locales/ko/messages.json`
- `_locales/ja/messages.json`
- `_locales/zh_CN/messages.json`
- `src/shared/i18n.ts`
- `tests/shared/i18n.test.ts`

수정:

- `manifest.json`
- `vite.config.ts`
- `src/vite-env.d.ts`
- `tests/manifest.test.ts`

### 변경 내용

- manifest에 `"default_locale": "en"`을 추가하고 사용자-facing manifest 필드를 `__MSG_*__` 참조로 변경한다.
- extension name, description, action title, command description, overlay 공통 문자열 key를 `_locales/*/messages.json`에 정의한다.
- `src/shared/i18n.ts`에 `chrome.i18n.getMessage()` wrapper와 테스트 환경 fallback을 둔다.
- Vite plugin 또는 build hook으로 `_locales` 디렉터리를 `dist/_locales`에 복사한다.
- manifest key가 default locale에 존재하고 locale 파일 key set이 일치하는지 테스트한다.

### 검증

```bash
npm run typecheck
npm run build
find dist/_locales -type f
git diff --check
```

### 커밋

```text
Task #33 Stage 1: i18n 기반과 locale 리소스 추가
```

## Stage 2 — 오버레이 사용자-facing 문자열 치환

### 산출물

수정:

- `src/content/overlay/crop-template.ts`
- `src/content/overlay/crop-overlay.ts`
- `tests/content/overlay/phase6-regression.test.ts`
- `tests/shared/i18n.test.ts`

### 변경 내용

- `복사`, `저장`, `취소`, `다시 시도`, mode button label, prompt 안내 문구, preview dialog label, toolbar aria-label, title/aria-label을 i18n wrapper로 치환한다.
- 복사 완료 토스트와 복사/저장 실패 상태 메시지를 i18n key로 치환한다.
- resize handle 방향 label과 `{direction} 크기 조절` 형태의 접근성 문자열을 locale 메시지와 placeholder로 생성한다.
- action id, dataset status, internal capture mode, console warning처럼 내부 계약 문자열은 번역하지 않는다.
- 기존 테스트가 특정 한국어 문구를 코드 문자열로 고정하는 부분은 i18n key 또는 fallback 메시지 기준으로 갱신한다.

### 검증

```bash
npm run typecheck
npm run test
rg -n '"복사"|"저장"|"취소"|"다시 시도"|"스크린샷이 복사되었습니다"|"드래그하거나 클릭해서 영역을 선택하세요"' src tests manifest.json
git diff --check
```

### 커밋

```text
Task #33 Stage 2: 오버레이 사용자-facing 문자열 지역화
```

## Stage 3 — 회귀 테스트와 산출물 검증 정리

### 산출물

수정:

- `tests/manifest.test.ts`
- `tests/content/overlay/phase6-regression.test.ts`
- `tests/shared/i18n.test.ts`
- 필요 시 `mydocs/tech/` 검증 메모 없이 단계 보고서에 검증 결과만 기록

### 변경 내용

- Stage 1~2에서 추가한 테스트를 정리해 중복 검증을 줄이고, locale key parity와 build 산출물 확인이 명확히 실패하도록 보강한다.
- `dist/_locales` 산출물과 manifest localization key를 build 결과 기준으로 확인한다.
- 사용자-facing 하드코딩 문자열 잔여 grep 결과를 검토하고, 내부 계약 문자열로 남기는 항목은 단계 보고서에 근거를 기록한다.
- 최종 통합 검증 전에 stage별 변경이 수행계획서 범위와 일치하는지 점검한다.

### 검증

```bash
npm run typecheck
npm run test
npm run build
find dist/_locales -type f
git diff --check
```

### 커밋

```text
Task #33 Stage 3: i18n 회귀 검증 정리
```

## 검증

- 각 Stage 검증 명령은 단계 보고서 작성 전에 실행한다.
- 실패한 검증은 단계 완료로 처리하지 않는다.
- 구현 중 파일 위치나 범위가 이 계획과 달라지면 구현계획서를 갱신하고 작업지시자 승인을 다시 받는다.
- 문서 위치가 수행계획서 판단과 달라지면 구현 전에 수행계획서 또는 구현계획서를 갱신하고 승인을 받는다.

## 커밋

- 단계 커밋은 단계 산출물과 `mydocs/working/task_m030_33_stage{N}.md`를 함께 묶는다.
- 커밋 메시지는 `Task #33 Stage {N}: {핵심 내용 요약}` 형식을 따른다.
- 구현계획서 자체는 `Task #33: 구현계획서 작성` 커밋으로 별도 기록한다.

## 단계 의존성

- Stage 2는 Stage 1의 locale key, manifest i18n, wrapper, build copy 구조가 확정된 뒤 진행한다.
- Stage 3은 Stage 2의 사용자-facing 문자열 치환과 기본 테스트가 통과한 뒤 진행한다.
- 최종 결과보고서와 PR 게시 절차는 Stage 3 완료보고서 승인 후 진행한다.

## 위험과 대응

- **Chrome API fallback 과신**: fallback은 테스트 안정화 목적이다. 실제 extension runtime은 `chrome.i18n.getMessage()`를 우선 사용하도록 wrapper를 작성한다.
- **번역 key 증가로 인한 유지보수 비용**: 버튼/상태/접근성 문구를 재사용 가능한 key로 묶되, 의미가 다른 문구는 분리한다.
- **placeholder 번역 오류**: shortcut, resize direction 같은 동적 값은 `messages.json` placeholders를 사용하고 테스트로 기본 조합을 검증한다.
- **dist 검증 누락**: source 테스트뿐 아니라 build 후 `dist/_locales` 파일 존재를 Stage 1과 Stage 3에서 확인한다.
- **문자열 길이로 인한 UI 깨짐**: Stage 2에서 기존 action box와 preview layout 테스트를 유지하고, 필요한 경우 CSS 조정은 같은 Stage 범위 안에서 처리한다.

## 승인 요청 사항

- Stage 1~3 분할과 각 Stage 산출물
- 구현계획서에 명시한 검증 명령
- 단계별 커밋 메시지
- 사용자-facing 문자열만 i18n 대상으로 삼고 내부 계약 문자열은 제외하는 기준
