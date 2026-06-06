# Task #40 피드백

## 대상

- 관련 이슈: #40
- 관련 Stage: Stage 4 이후 추가 검증, Stage 5 보정, Stage 6 되돌림
- 관련 PR: 해당 없음
- 작성자: 작업지시자
- 작성일: 2026-06-05

## 피드백 요약

작업지시자가 `/private/tmp/crop-task40/dist`를 Chrome 확장으로 로드해 직접 검증한 결과, 매우 긴 페이지의 전체 페이지 preview에서 blank band가 계속 보였다. Stage 2 이후에는 흰 band가 회색 band로 바뀌었고, Stage 5 이후에도 같은 위치에 회색 band가 남았다. 저장된 PNG 파일은 이 수정 전부터 정상이라고 확인됐다.

## 최종 판단

| 구분 | 판단 |
|---|---|
| 저장 PNG | 정상. stitching 결과에 band가 박힌 문제로 보지 않는다. |
| Stage 2 preview background 완화 | 흰색을 회색 surface로 바꾸는 시각적 완화였고 근본 해결이 아니었다. |
| Stage 5 tile capture wait 강화 | capture layer 보정이지만, 실제 문제는 preview `<img>` edge paint fallback이어서 원인 layer와 맞지 않았다. |
| 실제 원인 | 초대형 단일 `<img>` preview를 빠르게 스크롤할 때 Chrome이 새로 노출되는 edge raster/paint를 즉시 채우지 못해 preview surface 배경이 band처럼 보인다. |
| 처리 방향 | Stage 2/5 제품 코드는 되돌리고, modal preview만 tile 조각으로 표시하는 후속 이슈로 분리한다. |

## 후속 이슈

- 이슈: [#41](https://github.com/postmelee/crop/issues/41)
- 제목: `Full page preview를 tiled renderer로 전환해 긴 페이지 스크롤 paint artifact 제거`
- 포함: Save/Copy용 stitched PNG는 유지하고, preview modal만 capture tile dataUrl들을 여러 작은 이미지 조각으로 표시한다.
- 제외: 초장문 단일 PNG 해상도 개선, multi-part export, PDF export, Chrome 권한 확대.

## 후속 확인

- 후속 이슈에서 tiled preview renderer를 구현한 뒤, 동일한 긴 GitHub 페이지에서 full page preview scroll을 수동 검증한다.
- 저장 PNG 정상 여부는 기존 full page Save smoke와 자동 stitching tests로 계속 분리해 확인한다.
