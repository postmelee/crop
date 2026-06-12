# Task #68 최종 보고서

GitHub Issue: [#68](https://github.com/postmelee/crop/issues/68)
수행계획서: [`task_m020_68.md`](../plans/task_m020_68.md)
구현계획서: [`task_m020_68_impl.md`](../plans/task_m020_68_impl.md)
마일스톤: M020
상태: 자동 검증 완료, 작업지시자 수동 smoke 대기

## 요약

macOS `Show scroll bars: Always` 환경에서 이미지 선택 Copy/Save 결과 오른쪽에 흰 여백이 붙는 문제를 source pixel mapping 기준 분리로 보정했다. 원인은 `chrome.tabs.captureVisibleTab()` PNG 폭은 classic scrollbar gutter를 포함한 `window.innerWidth` 계열인데, 기존 crop scale 계산은 콘텐츠 viewport인 `documentElement.clientWidth` 계열을 사용한 데 있었다.

수정 후 DOM 선택, overlay 배치, tile planning은 콘텐츠 viewport 기준을 유지하고, 캡처 PNG source mapping에는 capture viewport size를 별도로 전달한다. 흰 픽셀 trim, 이미지 wrapper 휴리스틱 변경, `debugger` 또는 `<all_urls>` 권한 추가는 하지 않았다.

## 작업 요약

- 대상 이슈: #68
- 마일스톤: M020
- 단계 수: 4
- 작업 목적: Always scroll bars 환경에서 캡처 bitmap viewport와 DOM 콘텐츠 viewport 차이로 생기는 우측 여백을 좌표 변환 기준 분리로 제거한다.

## 변경 파일 목록과 영향 범위

| 경로 | 변경 요약 | 영향 범위 |
|---|---|---|
| `src/content/overlay/crop-overlay.ts` | visible selected/viewport crop에 `window.innerWidth/window.innerHeight` 기반 capture viewport size를 전달하고, tiled stitching/preview도 captured tile의 `captureViewportCssSize`를 사용하도록 변경했다. | selected Copy/Save, visible viewport preview, full-page/selected stitching preview |
| `src/content/overlay/full-page-capture.ts` | `FullPageMetrics`, `FullPageTilePlan`, `CapturedFullPageTile`에 `captureViewportCssSize`를 추가해 tile planning viewport와 source mapping viewport를 분리했다. | full-page capture, viewport 밖 selected stitching |
| `src/shared/stitch-image.ts` | stitching source crop과 tiled preview image sizing 입력을 `captureViewportCssSize`로 명명하고 해당 값을 사용하도록 변경했다. | stitched output, tiled preview layout |
| `tests/shared/crop-image.test.ts` | classic scrollbar 환경에서 capture viewport 기준이면 `720px`, content viewport 기준이면 `726px`가 되는 source mapping 회귀를 추가했다. | automated regression |
| `tests/shared/stitch-image.test.ts` | tiled source crop과 preview image sizing이 capture viewport 기준을 쓰는지 회귀 테스트를 추가했다. | automated regression |
| `tests/content/overlay/full-page-capture.test.ts` | tile planning은 content viewport 기준을 유지하고 capture source viewport는 별도 필드로 보존하는지 테스트했다. | automated regression |
| `tests/content/overlay/phase6-regression.test.ts` | visible/tiled capture runtime이 capture viewport size를 source mapping에 전달하는지 source regression을 추가했다. | automated regression |
| `mydocs/plans/task_m020_68.md`, `mydocs/plans/task_m020_68_impl.md` | 수행계획서와 구현계획서를 작성했다. | task planning |
| `mydocs/working/task_m020_68_stage*.md`, `mydocs/report/task_m020_68_report.md`, `mydocs/orders/20260612.md` | 단계 보고, 최종 보고, 오늘할일 상태를 기록했다. | hyper-waterfall records |

## 문서 위치 검증

이번 task에서는 공식 제품 문서 루트(`docs/`, `specs/`, `site/`, `website/`, `adr`)를 새로 만들지 않았다.

| 파일 | 계획된 위치 | 실제 위치 | 결과 | 근거 |
|---|---|---|---|---|
| `mydocs/plans/task_m020_68.md` | `mydocs/plans/` | `mydocs/plans/` | OK | 수행계획서 위치 |
| `mydocs/plans/task_m020_68_impl.md` | `mydocs/plans/` | `mydocs/plans/` | OK | 구현계획서 위치 |
| `mydocs/working/task_m020_68_stage*.md` | `mydocs/working/` | `mydocs/working/` | OK | 단계 보고서 위치 |
| `mydocs/report/task_m020_68_report.md` | `mydocs/report/` | `mydocs/report/` | OK | 최종 보고서 위치 |
| `mydocs/orders/20260612.md` | `mydocs/orders/` | `mydocs/orders/` | OK | 오늘할일 위치 |

## 변경 전·후 정량 비교

| 지표 | 변경 전 | 변경 후 |
|---|---|---|
| Always scroll bars 재현 fixture의 선택 CSS 폭 | `720px` | `720px` |
| 기존 content viewport 기준 source crop 폭 | `726px`로 과대 mapping | capture viewport 기준 `720px`로 mapping |
| visible crop source viewport | `ViewportMetrics.clientWidth/clientHeight` | `window.innerWidth/window.innerHeight`, 비정상 값은 기존 값 fallback |
| tiled source viewport | `FullPageTilePlan.viewportCssSize` 재사용 | `CapturedFullPageTile.captureViewportCssSize` 사용 |
| tile planning viewport | content viewport 기준 | 동일 유지 |
| #68 전용 회귀 테스트 | 없음 | crop/stitch/full-page/phase6에 Always scroll bars source mapping 회귀 추가 |
| MV3 권한 | `activeTab`, `scripting`, `clipboardWrite`, `downloads` | 동일, `debugger`/`<all_urls>` 미추가 |

## 단계 산출물

| Stage | 보고서 | 요약 |
|---|---|---|
| Stage 1 | [`task_m020_68_stage1.md`](../working/task_m020_68_stage1.md) | Always scroll bars source mapping 회귀 fixture와 기대값 고정 |
| Stage 2 | [`task_m020_68_stage2.md`](../working/task_m020_68_stage2.md) | visible selected/viewport crop에서 capture viewport 기준 보정 |
| Stage 3 | [`task_m020_68_stage3.md`](../working/task_m020_68_stage3.md) | full-page/selected stitching과 tiled preview의 capture viewport 계약 분리 |
| Stage 4 | [`task_m020_68_stage4.md`](../working/task_m020_68_stage4.md) | 통합 자동 검증, 최종 보고서, 오늘할일 상태 정리 |

## 검증 결과

| 수용 기준 | 결과 |
|---|---|
| macOS `Show scroll bars: Always`, Chrome zoom 100%에서 선택 이미지 오른쪽에 scrollbar gutter 유래 여백이 포함되지 않는다 | 수동 대기 — 작업지시자가 직접 Copy/Save smoke 진행 예정 |
| selected visible capture와 visible viewport preview는 콘텐츠 viewport rect를 선택하되, source pixel mapping은 capture viewport size 기준을 사용한다 | OK — `getCaptureViewportCssSize()`, `cropPngDataUrl()` caller, phase6 regression |
| viewport 밖 selected stitching과 full-page stitching은 tile segment 크기와 capture source mapping 크기를 분리한다 | OK — `captureViewportCssSize` metrics/plan/tile 계약, full-page/stitch tests |
| Copy와 Save는 같은 corrected PNG data URL을 사용한다 | OK — existing Copy/Save data URL flow 유지, phase6 preview action regression |
| 흰 픽셀 trim, 이미지 wrapper 휴리스틱 변경, 권한 확대는 하지 않는다 | OK — 좌표 변환만 변경, 권한 grep과 manifest regression 통과 |
| `debugger`, `<all_urls>`, broad host permission은 추가하지 않는다 | OK — manifest/runtime grep과 phase6 permission regression |

### 자동 검증

최근 통과 명령:

```bash
npm run build
npm run typecheck
npm test
rg -n "debugger|<all_urls>|host_permissions|captureVisibleTab" manifest.json src tests
rg -n "#68|Always scroll|capture viewport|scrollbar|innerWidth|captureViewport" src tests mydocs/plans/task_m020_68.md mydocs/plans/task_m020_68_impl.md mydocs/report/task_m020_68_report.md
git diff --check
```

결과:

- OK: `npm run build` 통과.
- OK: `npm run typecheck` 통과.
- OK: `npm test` 17개 파일, 222개 테스트 통과.
- OK: 권한 경계 grep 통과. `debugger`, `<all_urls>` 권한 추가 없음.
- OK: #68 핵심 경로 grep 통과. Always scroll bars fixture, visible/tiled capture runtime, capture viewport 계약 반영 확인.
- OK: `git diff --check` 통과.

### 환경 확인

- `defaults read -g AppleShowScrollBars`: `Always`
- Chrome 재현 페이지에서 CDP로 확인한 viewport: `window.innerWidth=1452`, `document.documentElement.clientWidth=1437`
- 대상 이미지: `alt="고객 기업 환경에 맞게 구축 "` / `BigDataPlatform1_webimage_3.png`

### 수동 smoke

작업지시자가 직접 진행하기로 한 항목이다.

1. macOS `System Settings > Appearance > Show scroll bars`를 `Always`로 둔다.
2. Chrome을 완전히 종료 후 재실행한다.
3. Chrome zoom 100%에서 `https://www.lgcns.com/kr/service/biz-data/big-data-platform`를 연다.
4. "고객 기업 환경에 맞게 구축" 이미지를 선택한다.
5. `Copy`와 `Save`를 각각 실행한다.
6. 저장 PNG 오른쪽에 순백 gutter가 붙지 않고 원본 이미지 표시 비율과 일치하는지 확인한다.
7. 가능하면 출력 이미지 폭이 선택 CSS 폭에 DPR을 곱한 값과 일치하는지 확인한다.

## 잔여 위험과 후속 작업

### 잔여 위험

- 실제 Copy/Save PNG smoke는 작업지시자 직접 검증 결과가 아직 반영되지 않았다.
- Chrome UI에서 어떤 `crop` 확장이 로드됐는지에 따라 smoke 결과가 달라질 수 있으므로, 검증 시 반드시 현재 브랜치의 `dist/`를 reload한 unpacked extension으로 확인해야 한다.
- lazy loading, animation, layout shift가 있는 실제 문서에서는 tiled capture 경로에서 tile 간 픽셀 차이가 생길 수 있다.

### 후속 작업 후보

- 작업지시자 수동 smoke 결과가 정상이라면 PR 본문에 확인 환경과 결과를 기록한다.
- 수동 smoke에서 문제가 재현되면 로드된 extension ID와 `dist/` reload 상태, `window.innerWidth/clientWidth`, 저장 PNG dimension을 함께 기록해 Stage 2/3 계약을 재점검한다.

## 작업지시자 승인 요청

- 수동 smoke 결과와 최종 보고서가 승인되면 PR 게시 절차로 진행한다.
