# Task #33 Stage 3 완료 보고서 - i18n 회귀 검증 정리

GitHub Issue: [#33](https://github.com/postmelee/crop/issues/33)
구현계획서: [`task_m030_33_impl.md`](../plans/task_m030_33_impl.md)
Stage: 3

## 단계 목적

Stage 1~2에서 추가한 manifest/locale/overlay i18n 경로가 회귀하지 않도록 테스트 계약을 정리한다. locale key parity와 Chrome API fallback 검증에 더해, 오버레이가 필요한 사용자-facing message key를 실제로 참조하는지와 한국어 UI 문구가 overlay source에 직접 남지 않는지를 자동 테스트로 확인한다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `tests/content/overlay/phase6-regression.test.ts` | overlay i18n key wiring, Korean locale 값의 overlay source 하드코딩 부재 테스트 추가 |
| `tests/shared/i18n.test.ts` | placeholder substitution이 `chrome.i18n.getMessage()`로 전달되고 빈 API 응답 시 fallback되는지 검증 추가 |

## 본문 변경 정도 / 본문 무손실 여부

테스트 보강만 수행했으며 runtime source와 locale resource는 변경하지 않았다. Stage 1~2의 구현 동작은 그대로 유지된다.

## 검증 결과

실행 명령:

```bash
npm run typecheck
npm run test
npm run build
find dist/_locales -type f
rg -n '"복사"|"저장"|"취소"|"다시 시도"|"스크린샷이 복사되었습니다"|"드래그하거나 클릭해서 영역을 선택하세요"' src tests manifest.json
git diff --check
```

결과:

- OK: `npm run typecheck` 통과.
- OK: `npm run test` 통과. 17 files, 201 tests passed.
- OK: `npm run build` 통과.
- OK: `find dist/_locales -type f`에서 `en`, `ko`, `ja`, `zh_CN` 4개 messages 파일 확인.
- OK: 사용자-facing 하드코딩 잔여 grep은 출력 없음. `rg` exit 1은 no match 결과이며 기대 동작이다.
- OK: `git diff --check` 경고 없음.

## 잔여 위험

- 자동 테스트와 build 산출물 검증은 통과했지만 실제 Chrome UI locale 전환 smoke는 수행하지 않았다.
- 번역 문구 길이에 따른 시각적 차이는 실제 브라우저 환경에서 추가 확인할 수 있다.

## 다음 단계 영향

- 모든 구현 Stage가 완료됐다. 다음 절차는 최종 결과 보고서 작성, 오늘할일 완료 갱신, 최종 검증, publish branch push, PR 생성이다.
- 최종 보고서에는 locale 지원 범위, build 산출물 포함 확인, 실제 Chrome locale smoke 미수행을 검증 한계로 기록한다.

## 승인 요청

- Stage 3 산출물과 검증 결과를 승인하면 task-final-report 절차로 진행한다.
