# Task #40 Stage 2 보고서

GitHub Issue: [#40](https://github.com/postmelee/crop/issues/40)
구현계획서: [`task_m020_40_impl.md`](../plans/task_m020_40_impl.md)
Stage: 2

## 단계 목적

Stage 1에서 확인한 `.crop-preview-image`의 흰색 paint fallback을 제거한다. full page preview 스크롤 중 이미지 raster가 한 프레임 늦어도 부모 surface의 어두운 배경이 보이도록 하고, 회귀 테스트로 preview image가 `#ffffff` fallback을 다시 쓰지 못하게 고정한다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `src/content/overlay/crop-overlay.css` | `.crop-preview-image` background를 `#ffffff`에서 `transparent`로 변경 |
| `tests/content/overlay/phase6-regression.test.ts` | preview image CSS block이 `background: transparent;`를 포함하고 `background: #ffffff;`를 포함하지 않는지 검증 추가 |
| `mydocs/working/task_m020_40_stage2.md` | Stage 2 변경, 검증 결과, 잔여 위험 기록 |

## 본문 변경 정도 / 본문 무손실 여부

CSS 변경은 `.crop-preview-image`의 fallback background 한 줄만 바꿨다. `.crop-preview-surface`의 `overflow: auto`, `overscroll-behavior: contain`, dark background, visible viewport override의 `overflow: hidden`, `max-height: 100%`, `object-fit: contain`은 유지했다.

테스트 변경은 기존 full page preview pipeline regression test 안에 preview image block 검증을 추가했다. 기존 string checks는 제거하지 않았다.

## 검증 결과

실행 명령:

```bash
PATH=/private/tmp/node_modules/.bin:$PATH npm run typecheck
PATH=/private/tmp/node_modules/.bin:$PATH npm test -- tests/content/overlay/phase6-regression.test.ts
rg "crop-preview-image|crop-preview-surface|#ffffff|transparent|background: #44414f|visible\\]\\) \\.crop-preview" src/content/overlay/crop-overlay.css tests/content/overlay/phase6-regression.test.ts
git diff --check
```

결과:

- OK: `npm run typecheck` 통과.
- OK: `npm test -- tests/content/overlay/phase6-regression.test.ts` 통과, `26 tests` passed.
- OK: grep 결과에서 `.crop-preview-image`는 `background: transparent;`이고, preview image block test가 `background: #ffffff;`를 금지한다.
- OK: `.crop-preview-surface`의 `background: #44414f`, visible preview no-scroll override, object-fit contract가 유지됐다.
- OK: `git diff --check` 통과.

참고:

- `/private/tmp/crop-task40`에는 `node_modules`가 없어 최초 `npm run typecheck`와 `npm test`가 각각 `tsc: command not found`, `vitest: command not found`로 실패했다.
- 원본 worktree의 설치본을 `/private/tmp/node_modules` symlink로 연결하고, cwd는 `/private/tmp/crop-task40`로 유지해 재검증했다. 실패 원인은 코드가 아니라 분리 worktree 의존성 경로였다.

## 잔여 위험

- 이 단계는 CSS fallback과 regression string test를 고정했다. 실제 Chrome compositor에서 한 프레임 flicker가 사라졌는지는 Stage 4 수동 smoke에서 최종 확인해야 한다.
- 저장 PNG 자체 seam 또는 transparent gap 가능성은 아직 별도로 확인하지 않았다. Stage 3에서 조건부로 판단한다.

## 다음 단계 영향

- Stage 3은 `stitch-image.ts` 변경이 필요한지 판단한다.
- Stage 2 변경만으로는 저장 PNG 데이터가 바뀌지 않는다.
- Stage 3에서 저장 PNG gap 근거가 없으면 stitching 경로는 변경하지 않는 결론을 보고한다.

## 승인 요청

- Stage 2 산출물과 검증 결과를 승인하면 Stage 3 저장 PNG seam 방어 필요성 판단으로 진행한다.
