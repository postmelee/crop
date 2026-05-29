# Task #8 Stage 4 완료 보고서

GitHub Issue: [#8](https://github.com/postmelee/crop/issues/8)
구현계획서: [`task_m020_8_impl.md`](../plans/task_m020_8_impl.md)
Stage: 4

## 단계 목적

Stage 3 manual smoke에서 발견된 MISS, MVP 제한, 후속 작업 후보를 분류했다. 이번 task에서 고칠 수 있는 작은 결함은 drag selection 중 viewport frame이 노출되는 visual flicker로 한정했고, Firefox식 selected-state UI parity는 후속 후보로 문서화했다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `src/content/overlay/crop-overlay.css` | `data-crop-state="dragging"` 동안 `.crop-frame`을 숨겨 drag selection 중 흰색 가로선이 반짝이는 증상을 줄이는 CSS 보정 추가. |
| `README.md` | 현재 버전의 visible viewport 캡처 제한, 화면 밖 요소 저장 범위, iframe/nested context/closed shadow DOM 제한, #12~#15 후속 범위를 명시. |
| `mydocs/tech/task_m020_8_quality_matrix.md` | P6-27/P6-28 결과 갱신, Stage 4 분류 결과, Firefox식 size badge와 action button parity 신규 후속 이슈 후보 기록. |
| `mydocs/working/task_m020_8_stage4.md` | Stage 4 완료 보고서 추가. |

## 본문 변경 정도 / 본문 무손실 여부

코드 변경은 오버레이 CSS의 dragging 상태 표시 조건에 한정했다. README는 기존 개발 상태 섹션 안에서 MVP 제한과 후속 범위만 보강했고, 공식 제품 문서 루트는 새로 만들지 않았다. 품질 매트릭스는 Stage 3 결과를 삭제하지 않고 Stage 4 분류와 후속 후보를 추가했다.

## 검증 결과

실행 명령:

```bash
npm run build
npm run typecheck
npm run test
rg "현재 버전|visible|viewport|화면 밖|full page|iframe|shadow|후속|#12|#13|#14|#15" README.md mydocs
git diff --check
```

결과:

- OK: `npm run build` 통과. `dist/manifest.json`, `dist/background/service-worker.js`, `dist/content/inject.js` 생성 확인.
- OK: `npm run typecheck` 통과.
- OK: `npm run test` 통과. 11개 test file, 85개 test가 모두 통과했다.
- OK: `rg`에서 README와 `mydocs` 내 visible viewport 제한, 화면 밖 요소, iframe/shadow 제한, 후속 #12~#15 문구가 확인됐다.
- OK: `git diff --check`가 출력 없이 종료되어 whitespace 오류가 없었다.

## 잔여 위험

- P6-27 drag selection flicker는 CSS 보정을 적용했지만 실제 Chrome 수동 재 smoke가 필요하다.
- Firefox식 selected-state size badge, action button parity는 이번 task에서 구현하지 않고 신규 후속 이슈 후보로만 기록했다.
- resize/move handles와 keyboard 조정은 기존 #13 범위다.
- edge auto-scroll, iframe/nested context, full page/scroll stitching은 각각 기존 #12, #14, #15 범위다.
- 비HiDPI, Windows, Linux 조합은 현재 환경에서 직접 확인하지 못했다.
- 신규 GitHub Issue 생성은 작업지시자 별도 승인 전에는 수행하지 않았다.

## 다음 단계 영향

- Stage 5 최종 보고서에는 P6-27 재 smoke 필요, visible viewport 저장 제한, 확인하지 못한 OS/DPR 조합, 기존 후속 이슈와 신규 후속 후보를 함께 기록해야 한다.
- 작업지시자가 별도로 승인하면 `Firefox식 selected-state size badge와 action button parity 구현` 후속 이슈를 등록할 수 있다.

## 승인 요청

- Stage 4 산출물과 검증 결과를 승인하면 Stage 5 README, 최종 보고서, 통합 검증으로 진행한다.
