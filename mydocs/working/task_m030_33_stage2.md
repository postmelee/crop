# Task #33 Stage 2 완료 보고서 - 오버레이 사용자-facing 문자열 치환

GitHub Issue: [#33](https://github.com/postmelee/crop/issues/33)
구현계획서: [`task_m030_33_impl.md`](../plans/task_m030_33_impl.md)
Stage: 2

## 단계 목적

Stage 1에서 추가한 `getCropMessage()` i18n wrapper를 실제 Shadow DOM overlay UI에 연결한다. 버튼, 프롬프트, preview, 토스트, status, 접근성 label/title, resize handle label 등 사용자-facing 문자열을 locale key 기반으로 생성하도록 바꾸고, 기존 회귀 테스트의 하드코딩 문자열 계약을 i18n wiring 계약으로 갱신한다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `src/content/overlay/crop-template.ts` | mode button, prompt, action button, preview, shortcut title, resize handle label을 `getCropMessage()` 기반으로 치환 |
| `src/content/overlay/crop-overlay.ts` | copy success toast와 copy/save failure status를 locale key 기반으로 치환하고 공통 실패 메시지 helper 추가 |
| `tests/content/overlay/phase6-regression.test.ts` | Firefox-style toast/preview 회귀 테스트를 한국어 문구 고정에서 i18n key wiring 확인으로 갱신 |

## 본문 변경 정도 / 본문 무손실 여부

코드 동작은 기존 overlay 생성, capture, Copy, Save, preview pipeline을 유지하고 사용자-facing 문자열 생성 경로만 바꿨다. 내부 계약 문자열인 action id, dataset status, capture mode, `status: "copied"` 등은 번역하지 않았다.

## 검증 결과

실행 명령:

```bash
npm run typecheck
npm run test
rg -n '"복사"|"저장"|"취소"|"다시 시도"|"스크린샷이 복사되었습니다"|"드래그하거나 클릭해서 영역을 선택하세요"' src tests manifest.json
git diff --check
npm run build
```

결과:

- OK: `npm run typecheck` 통과.
- OK: `npm run test` 통과. 17 files, 199 tests passed.
- OK: 사용자-facing 하드코딩 잔여 grep은 출력 없음. `rg`는 매치가 없을 때 exit 1을 반환하므로, 이번 확인에서는 no match가 기대 결과다.
- OK: `git diff --check` 경고 없음.
- OK: `npm run build` 통과. `dist/_locales` 산출물 유지 확인.

## 잔여 위험

- 실제 Chrome UI locale별 시각 smoke는 아직 수행하지 않았다. Stage 3에서 build 산출물과 최종 회귀 검증을 정리할 때 추가 확인 후보로 남긴다.
- 번역 문자열 길이에 따른 미세한 버튼 폭/preview footer 체감 차이는 실제 브라우저 smoke에서 확인할 여지가 있다.

## 다음 단계 영향

- Stage 3은 locale key parity, manifest, phase6, build 산출물 검증을 정리하고 최종 통합 검증을 수행한다.
- Stage 3에서 사용자-facing 하드코딩 문자열 grep 결과를 다시 확인하고, 남는 문자열이 있다면 내부 계약/에러 메시지인지 근거를 기록한다.

## 승인 요청

- Stage 2 산출물과 검증 결과를 승인하면 Stage 3 — 회귀 테스트와 산출물 검증 정리로 진행한다.
