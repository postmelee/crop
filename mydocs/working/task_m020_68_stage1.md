# Task #68 Stage 1 보고서

GitHub Issue: [#68](https://github.com/postmelee/crop/issues/68)
구현계획서: [`task_m020_68_impl.md`](../plans/task_m020_68_impl.md)
Stage: 1

## 단계 목적

Always scroll bars 환경에서 발생한 우측 여백의 원인을 source pixel mapping 수식으로 고정했다. 이번 단계는 런타임 구현을 바꾸지 않고, `captureVisibleTab()` 비트맵 기준 viewport와 DOM 콘텐츠 viewport가 다를 때 어떤 값이 올바른지 테스트로 명확히 남기는 것이 목적이었다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `tests/shared/crop-image.test.ts` | `1452px` capture viewport와 `1440px` content viewport fixture를 추가해 올바른 `720px` crop과 잘못된 `726px` crop을 비교했다. |
| `tests/shared/stitch-image.test.ts` | tiled stitching source crop helper도 capture viewport size 기준을 써야 한다는 fixture를 추가했다. |
| `tests/content/overlay/full-page-capture.test.ts` | classic scrollbar 환경에서도 tile planning은 콘텐츠 viewport `1440px` 기준을 유지한다는 계약을 고정했다. |
| `tests/content/overlay/phase6-regression.test.ts` | Phase 6 회귀에 Always scroll bars source mapping 기준을 추가했다. |

## 본문 변경 정도 / 본문 무손실 여부

코드 동작은 변경하지 않았다. 테스트만 추가했으며 기존 테스트와 fixture는 유지했다. Stage 2/3에서 구현할 기준을 명확히 하기 위해 `clientWidth=1440`, capture viewport width `1452`, selected rect `36..756` 조건을 반복 가능한 회귀 fixture로 남겼다.

## 검증 결과

실행 명령:

```bash
npm test -- tests/shared/crop-image.test.ts tests/shared/stitch-image.test.ts tests/content/overlay/full-page-capture.test.ts tests/content/overlay/phase6-regression.test.ts
rg -n "Always scroll|capture viewport|clientWidth|innerWidth|scrollbar" tests src mydocs/plans/task_m020_68_impl.md
git diff --check
```

결과:

- OK: focused test 4개 파일이 모두 통과했다. `tests/shared/crop-image.test.ts` 12 tests, `tests/shared/stitch-image.test.ts` 12 tests, `tests/content/overlay/full-page-capture.test.ts` 16 tests, `tests/content/overlay/phase6-regression.test.ts` 30 tests, 총 70 tests 통과.
- OK: grep에서 Stage 1 신규 fixture와 기존 `crop-overlay.ts`의 현재 `clientWidth` 사용 지점을 확인했다. 다음 단계 보정 대상은 `captureVisibleSelectedRegion()`과 `captureVisibleViewportRegion()`의 `cropPngDataUrl()` 호출부다.
- OK: `git diff --check` 경고 없음.

## 잔여 위험

- Stage 1은 테스트 기준만 고정했으므로 실제 Always scroll bars 여백은 아직 수정되지 않았다.
- `full-page-capture.ts`는 tile planning을 콘텐츠 viewport 기준으로 유지해야 하며, Stage 3에서 capture source mapping viewport를 별도로 전달해야 한다.
- 수동 Chrome smoke는 구현 완료 후 Stage 4에서 수행한다.

## 다음 단계 영향

- Stage 2는 visible selected/visible viewport capture에서 source mapping용 viewport size를 `window.innerWidth/innerHeight` 계열로 분리해야 한다.
- Stage 2 후에도 tiled capture는 아직 기존 계약을 쓸 수 있으므로, Stage 3에서 full-page/viewport 밖 selected stitching의 capture viewport 계약을 별도로 정리한다.

## 승인 요청

- Stage 1 산출물과 검증 결과를 승인하면 Stage 2로 진행한다.
