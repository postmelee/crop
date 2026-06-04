# Task #35 Stage 3 완료 보고서

GitHub Issue: [#35](https://github.com/postmelee/crop/issues/35)
구현계획서: [`task_m020_35_impl.md`](../plans/task_m020_35_impl.md)
Stage: 3

## 단계 목적

Stage 1~2에서 구현한 oversized full page downscale fallback을 사용자-facing 제한 문구와 내부 품질 기준에 반영한다. 기존 "큰 canvas 크기 오류" 중심 설명을 "단일 PNG 유지를 위한 자동 downscale, 단 layout shift 한계는 유지" 기준으로 좁게 갱신하는 것이 목적이다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `README.md` | full page capture가 canvas 한도 초과 시 PNG를 자동 downscale한다는 설명으로 제한 문구를 갱신했다. |
| `README.ko.md` | 한국어 제한 문구를 downscale fallback 기준으로 동기화했다. |
| `README.ja.md` | 일본어 제한 문구를 downscale fallback 기준으로 동기화했다. |
| `README.zh-CN.md` | 중국어 제한 문구를 downscale fallback 기준으로 동기화했다. |
| `mydocs/tech/task_m020_8_quality_matrix.md` | P6-40 oversized full page downscale fallback 항목, 수동 smoke 절차, Task #35 갱신 결과를 추가했다. |
| `tests/content/overlay/phase6-regression.test.ts` | P6-40과 Task #35 품질 기준이 matrix에 남아 있는지 회귀 테스트를 추가했다. |

## 본문 변경 정도 / 본문 무손실 여부

문서 변경이다. README 계열은 기존 "현재 제한사항"의 full page capture 한 문단만 대체했고, 다른 제한 항목은 유지했다. 품질 매트릭스는 기존 항목을 삭제하지 않고 P6-40과 Task #35 결과, 수동 smoke 절차만 추가했다.

## 검증 결과

실행 명령:

```bash
npm run typecheck
npm test -- tests/shared/stitch-image.test.ts tests/content/overlay/full-page-capture.test.ts tests/content/overlay/phase6-regression.test.ts
rg "#35|downscale|maximum canvas|전체 페이지|full page|canvas" README*.md mydocs/tech/task_m020_8_quality_matrix.md src tests
rg -n "explicit size errors|명시적인 크기 오류|サイズエラー|尺寸错误" README*.md mydocs/tech/task_m020_8_quality_matrix.md
git diff --check
```

결과:

- OK: `npm run typecheck` 통과 (`tsc --noEmit`).
- OK: focused test 통과. `stitch-image.test.ts` 9개, `full-page-capture.test.ts` 15개, `phase6-regression.test.ts` 26개, 총 50개 통과.
- OK: #35/downscale/full page/canvas grep으로 README 계열, 품질 매트릭스, 관련 source/test 근거를 확인했다.
- OK: 이전 "명시적 크기 오류" 계열 문구 grep은 매칭 없음.
- OK: `git diff --check` 경고 없음.

## 잔여 위험

- 실제 oversized full page PNG smoke는 아직 수행하지 않았다. P6-40 수동 smoke 후보로 남겼고 Stage 4 최종 보고서에 검증 한계를 기록해야 한다.
- downscale fallback은 단일 PNG 성공률을 높이지만 원본 DPR 해상도를 낮춘다.
- lazy loading, animation, sticky layout 변화로 인한 scroll stitching 한계는 여전히 남는다.

## 다음 단계 영향

- Stage 4는 전체 `npm run build`, `npm run typecheck`, `npm test`, 권한 grep을 실행하고 최종 보고서에 자동 검증과 수동 smoke 한계를 정리한다.
- Stage 4는 오늘할일을 완료로 갱신하고 최종 결과보고서를 작성해야 한다.
- PR 전에는 `debugger`, `<all_urls>`, broad host permission이 추가되지 않았음을 다시 확인해야 한다.

## 승인 요청

- Stage 3 산출물과 검증 결과를 승인하면 Stage 4 통합 검증과 최종 보고로 진행한다.
