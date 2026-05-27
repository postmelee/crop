# Task #4 Stage 2 보고서

GitHub Issue: [#4](https://github.com/postmelee/crop/issues/4)
구현계획서: [`task_m010_4_impl.md`](../plans/task_m010_4_impl.md)
Stage: 2

## 단계 목적

Stage 2는 Firefox Screenshots `overlayHelpers.mjs`에서 유래한
`Region`/`WindowDimensions` 개념을 Chrome MV3 MVP에 맞는 visible
viewport helper로 구현하는 단계다. 좌표계는 `captureVisibleTab()`과
`getBoundingClientRect()` 흐름에 맞춰 viewport-local 좌표를 기준으로 두고,
page scroll 값은 별도 메타데이터로만 보존했다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `src/firefox-derived/window-dimensions.ts` | MPL 2.0 header 포함, viewport/page viewport dimensions, rect normalization/intersection/clip helper, window-like reader 구현 |
| `src/firefox-derived/region.ts` | MPL 2.0 header 포함, viewport-clamped region model, width/height/area/distance, containment/intersection helper 구현 |
| `tests/firefox-derived/window-dimensions.test.ts` | viewport/page scroll 분리, invalid input normalization, clip/intersection, window-like reader fixture 검증 |
| `tests/firefox-derived/region.test.ts` | reversed coordinate normalization, viewport clipping, containment/intersection, reset/sort/fromRect 검증 |
| `package.json` | `npm run test` 스크립트와 `vitest` dev dependency 추가 |
| `package-lock.json` | `vitest@3.2.4` dependency tree 고정 |
| `mydocs/orders/20260527.md` | 오늘할일 비고를 Stage 2 완료 후 승인 대기 상태로 갱신 |

## 본문 변경 정도 / 본문 무손실 여부

Stage 1에서 고정한 MPL 경계에 맞춰 새 TypeScript 파일 2개를
`src/firefox-derived/`에만 추가했다. Firefox의 full page, scroll stitching,
`mozInnerScreenX/Y`, privileged actor, closed shadow root 접근은 구현하지
않았다. `WindowDimensions`는 viewport-local crop 좌표와 page scroll
metadata를 분리했고, `Region`은 visible viewport 바깥 좌표를 clamp한다.

## 검증 결과

dependency 설치:

```bash
npm install --save-dev vitest@^3.2.4
```

결과:

- OK: `vitest@3.2.4`가 설치됐고 `package-lock.json`에 고정됐다.
- OK: npm audit 결과 취약점 0건으로 보고됐다.
- NOTE: sandbox 기본 네트워크에서는 registry DNS 조회가 실패해, 승인된 네트워크 실행으로 설치를 완료했다.

실행 명령:

```bash
npm run typecheck
npm run test
git diff --check
```

결과:

- OK: `npm run typecheck`가 성공했다.
- OK: `npm run test`가 Vitest v3.2.4로 성공했다.
- OK: `tests/firefox-derived/window-dimensions.test.ts` 6개 테스트가 통과했다.
- OK: `tests/firefox-derived/region.test.ts` 5개 테스트가 통과했다.
- OK: 총 2개 test file, 11개 test가 통과했다.
- OK: `git diff --check`가 경고 없이 통과했다.

추가 확인:

```bash
npm run build
```

결과:

- OK: Vite production build가 성공했고 기존 `dist/manifest.json`, `dist/background/service-worker.js`, `dist/content/inject.js` 산출 구조가 유지됐다.

## 잔여 위험

- Stage 2 테스트는 수치 기반 fixture만 검증한다. 실제 DOM hit-test와 hover 대상 rect 휴리스틱은 Stage 3에서 구현하고 검증해야 한다.
- `Region`/`WindowDimensions`는 visible viewport 모델로 축소했기 때문에 full page나 scroll stitching 요구에는 사용할 수 없다.
- `src/content/inject.ts` 연결은 아직 없다. Stage 3 이후 별도 Phase 3 task에서 overlay UI에 연결한다.

## 다음 단계 영향

- Stage 3의 `overlay-helpers.ts`는 `WindowDimensions.clipRectToViewport()`, `normalizeRect()`, `Region.fromRect()`를 사용해 visible viewport 안의 selection candidate를 계산할 수 있다.
- Stage 3 테스트는 `tests/firefox-derived/` 아래에 이어서 두며, 이번 단계와 동일하게 `npm run test`로 실행한다.
- 추가 DOM 환경 패키지는 아직 도입하지 않았다. Stage 3에서 `jsdom`이 필요해지면 구현계획서 갱신과 승인이 먼저 필요하다.

## 승인 요청

- Stage 2 산출물과 검증 결과를 승인하면 Stage 3으로 진행한다.
