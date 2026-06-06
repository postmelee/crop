# Task #40 Stage 1 보고서

GitHub Issue: [#40](https://github.com/postmelee/crop/issues/40)
구현계획서: [`task_m020_40_impl.md`](../plans/task_m020_40_impl.md)
Stage: 1

## 단계 목적

preview modal을 스크롤할 때 보이는 하얀 blank 띠의 원인을 코드 변경 전에 고정한다. 이번 단계는 구현계획서상 Stage 1이며, 소스 수정 없이 영상 분석 근거와 현재 preview DOM/CSS/stitching contract를 정리해 Stage 2의 수정 범위를 좁히는 목적이다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `mydocs/working/task_m020_40_stage1.md` | 영상 분석 결론, preview DOM/CSS contract, stitching 판단 기준, Stage 2/3 인계 사항 기록 |

## 본문 변경 정도 / 본문 무손실 여부

소스 코드는 변경하지 않았다. 이번 단계의 본문 변경은 신규 Stage 보고서 작성뿐이며, 기존 문서 원문은 수정하지 않았다.

## 영상 분석 결론

- 입력 영상 `화면 기록 2026-06-04 15.11.11.mov`의 duration은 `4.936375s`다.
- 세분화 산출물은 `/private/tmp/crop-preview-scroll-slices/`에 있으며, `0.80s ~ 1.40s` 구간의 modal/right-bottom crop이 남아 있다.
- `/private/tmp/crop-preview-scroll-slices/original_t_1_20_bottom.png`에서 preview image 하단 폭 전체에 가까운 흰 blank 띠가 확인됐다.
- `/private/tmp/crop-preview-scroll-slices/original_t_1_25_bottom.png`에서는 같은 하단 영역이 실제 문서 콘텐츠로 다시 채워졌다.
- 따라서 현상은 modal 외곽 rounded corner clipping이나 footer 모서리 문제가 아니라, scroll 중 새로 노출되는 preview image 영역의 paint/raster fallback이 한 프레임 늦게 보이는 문제로 판단한다.

## 현재 preview contract

- `src/content/overlay/crop-template.ts`는 `crop-preview` container 안에 `crop-preview-dialog`, `crop-preview-surface`, `img.crop-preview-image`, footer/actions/status를 만든다.
- `.crop-preview-dialog`는 `overflow: hidden`, `border-radius: 6px`, `background: #44414f`를 사용한다.
- `.crop-preview-surface`는 full page preview에서 `overflow: auto`, `overscroll-behavior: contain`, `background: #44414f`를 사용한다.
- `.crop-preview-image`는 `display: block`, `max-width: 100%`, `height: auto`, `background: #ffffff`를 사용한다.
- visible viewport mode는 `.crop-preview-surface`에 `overflow: hidden`, `.crop-preview-image`에 `max-height: 100%`, `object-fit: contain`을 적용한다.
- 현재 phase6 regression test는 preview 구조, dark surface background, visible no-scroll, object-fit, overscroll behavior를 확인하지만, `.crop-preview-image`의 흰 fallback background를 금지하는 조건은 없다.

## 현재 stitching contract

- `src/shared/stitch-image.ts`는 `stitchCapturedTiles()`에서 canvas를 만들고 `outputPlan.width/height`를 설정한다.
- 각 tile은 `getStitchSourcePixelRect()`와 `getStitchDestinationPixelRect()`를 거쳐 `context.drawImage()`로 canvas에 배치된다.
- destination rect는 CSS rect edge에 output scale을 곱한 뒤 `Math.round()`로 계산한다.
- 결과는 `canvas.toDataURL("image/png")`로 반환된다.
- Stage 1에서 확인한 현상은 영상상 scroll 중 preview 표시 artifact에 가깝다. 저장 PNG 자체 seam 또는 transparent gap은 Stage 3에서 focused tests와 source inspection으로 별도 판단한다.

## Stage 2 판단 기준

- 우선 `.crop-preview-image`의 `#ffffff` fallback이 스크롤 중 노출되지 않도록 preview rendering을 보정한다.
- 보정은 full page preview scrollability, surface dark background, visible viewport no-scroll, image `object-fit: contain`, toolbar/image inline alignment를 유지해야 한다.
- phase6 regression test에 preview image가 흰 fallback background를 사용하지 않는다는 조건을 추가한다.

## Stage 3 판단 기준

- Stage 2 이후에도 저장 PNG 자체에 seam이 있다는 증거가 생기면 `stitch-image.ts` 보정을 검토한다.
- 증거가 없으면 canvas fill이나 tile draw logic은 변경하지 않는다.
- 저장 PNG 경로를 변경할 경우에는 transparent background 오염 가능성을 별도 테스트로 확인한다.

## 검증 결과

실행 명령:

```bash
rg "crop-preview-image|crop-preview-surface|crop-preview-dialog|background|overflow|overscroll-behavior" src/content/overlay/crop-overlay.css src/content/overlay/crop-template.ts tests/content/overlay/phase6-regression.test.ts
rg "stitchCapturedTiles|getStitchDestinationPixelRect|drawImage|toDataURL|canvas" src/shared/stitch-image.ts tests/shared/stitch-image.test.ts
ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "/var/folders/c2/y83wcw894j1d5bv4_lhqmvg80000gn/T/TemporaryItems/NSIRD_screencaptureui_dpd0Tu/화면 기록 2026-06-04 15.11.11.mov"
find /private/tmp/crop-preview-scroll-slices -maxdepth 2 -type f
git diff --check
```

결과:

- OK: preview DOM은 `dialog > surface > img.crop-preview-image` 구조다.
- OK: dialog/surface는 `#44414f` dark background를 사용하지만 image는 `background: #ffffff`를 사용한다.
- OK: visible viewport mode의 no-scroll override와 `object-fit: contain` contract가 존재한다.
- OK: stitching은 `drawImage()` tile 배치 후 PNG data URL을 반환한다.
- OK: 영상 duration은 `4.936375s`로 확인했고, 기존 세분화 산출물이 존재한다.
- OK: `git diff --check` 통과.

## 잔여 위험

- 실제 paint artifact는 Chrome compositor와 scroll timing에 따라 재현 빈도가 달라질 수 있다.
- 자동 테스트는 한 프레임짜리 raster fallback을 완전히 재현하기 어렵다.
- saved PNG seam 가능성은 아직 배제하지 않았으며, Stage 3에서 조건부로 다시 판단해야 한다.

## 다음 단계 영향

- Stage 2는 preview CSS fallback 보정을 우선 적용한다.
- Stage 2 regression test는 `.crop-preview-image`가 `#ffffff` fallback을 쓰지 않는다는 조건을 포함해야 한다.
- Stage 2는 visible viewport preview no-scroll과 full page preview scroll 동작을 유지해야 한다.
- Stage 3은 Stage 2 결과를 보고 저장 PNG seam 방어 필요성을 판단한다.

## 승인 요청

- Stage 1 산출물과 검증 결과를 승인하면 Stage 2 preview 렌더링 fallback 보정으로 진행한다.
