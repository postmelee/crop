# Task #6 Stage 2 보고서

GitHub Issue: [#6](https://github.com/postmelee/crop/issues/6)
구현계획서: [`task_m010_6_impl.md`](../plans/task_m010_6_impl.md)
Stage: 2

## 단계 목적

Capture 결과 이미지를 정확히 crop하기 위한 순수 geometry helper를 추가한다. 선택 영역은 #5에서 page coordinate로 저장되므로, Stage 2는 page rect를 visible viewport rect로 clipping하고, screenshot natural size와 viewport CSS size 비율로 source pixel rect를 계산하는 경계를 테스트로 고정한다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `src/shared/rect.ts` | DOM/Chrome API에 의존하지 않는 rect normalize/intersection, page/viewport projection, visible viewport clipping helper 추가 |
| `src/shared/crop-image.ts` | screenshot natural size와 viewport CSS size 기준 scale 계산 및 source crop rect 계산 helper 추가 |
| `tests/shared/rect.test.ts` | rect normalize, intersection, page/viewport projection, viewport 밖 selection clipping 테스트 추가 |
| `tests/shared/crop-image.test.ts` | image/viewport scale, source pixel rect, devicePixelRatio 비의존 정책, 80/100/125/150% zoom-like ratio, image bounds clipping 테스트 추가 |

## 본문 변경 정도 / 본문 무손실 여부

코드 작업이므로 본문 무손실 대상은 없다. Stage 1의 capture message/background handler와 기존 overlay runtime은 수정하지 않았다.

## 검증 결과

실행 명령:

```bash
npm run typecheck
npm run test
rg "naturalWidth|naturalHeight|viewport|scale|clip|intersect" src/shared tests/shared
git diff --check
```

결과:

- OK — `npm run typecheck`: `tsc --noEmit` 성공
- OK — `npm run test`: Vitest 7개 test file, 65개 test 통과
- OK — grep: natural image size, viewport CSS size, scale, clip/intersect helper와 테스트 확인
- OK — `git diff --check`: whitespace 경고 없음

## 잔여 위험

- Stage 2는 순수 수학 helper만 검증했다. 실제 image decode/canvas crop과 content overlay 연결은 Stage 3에서 구현한다.
- 실제 Chrome zoom smoke는 Stage 4에서 가능한 범위로 수행하고, 자동화 한계가 있으면 helper fixture 근거와 함께 문서화한다.

## 다음 단계 영향

- Stage 3은 `clipPageRectToViewport()`로 selected page rect를 visible viewport rect로 바꾸고, `getSourceCropRect()`로 screenshot source pixel rect를 계산한다.
- Stage 3에서 canvas crop 구현 시 source rect는 `floor(left/top)`, `ceil(right/bottom)` 정책을 그대로 사용해야 한다.

## 승인 요청

- Stage 2 산출물과 검증 결과를 승인하면 Stage 3으로 진행한다.
