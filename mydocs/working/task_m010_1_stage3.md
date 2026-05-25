# Task #1 Stage 3 보고서

GitHub Issue: [#1](https://github.com/postmelee/crop/issues/1)
구현계획서: [`task_m010_1_impl.md`](../plans/task_m010_1_impl.md)
Stage: 3

## 단계 목적

Stage 3은 Phase 0 기반 세팅 중 Chrome 전용 코드와 Firefox-derived 코드의 디렉터리 경계를 만드는 단계다. 실제 Firefox 원본 코드는 복사하지 않고, 향후 포팅 시 필요한 MPL-2.0 고지와 upstream 기록 규칙을 `src/firefox-derived/README.md`에 명시했다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `README.md` | 초기 source layout과 Firefox-derived 코드 분리 원칙 추가 |
| `src/background/.gitkeep` | background service worker 코드 위치 생성 |
| `src/content/.gitkeep` | content script 코드 위치 생성 |
| `src/content/overlay/.gitkeep` | Shadow DOM overlay UI 코드 위치 생성 |
| `src/shared/.gitkeep` | shared helper 코드 위치 생성 |
| `src/firefox-derived/README.md` | Firefox Screenshots upstream 후보, MPL-2.0 헤더 유지 규칙, Chrome extension 경계 정책 추가 |

## 본문 변경 정도 / 본문 무손실 여부

`README.md`는 기존 내용을 유지하고 Source Layout 섹션만 추가했다. `src/firefox-derived/README.md`는 신규 문서이며, 아직 Firefox 원본을 복사하지 않았다는 상태를 명시했다. 제품 runtime 코드, manifest, overlay 구현, Firefox helper 포팅은 하지 않았다.

## 검증 결과

실행 명령:

```bash
find src -maxdepth 3 -print
test -f src/firefox-derived/README.md
rg "MPL-2.0|Firefox Screenshots|overlayHelpers|Chrome extension" src/firefox-derived/README.md
git diff --check
npm run typecheck
npm run build
```

결과:

- OK: `src/background`, `src/content`, `src/content/overlay`, `src/shared`, `src/firefox-derived` 경로가 생성됐다.
- OK: `src/firefox-derived/README.md`가 존재한다.
- OK: Firefox Screenshots, `overlayHelpers`, MPL-2.0, Chrome extension 경계 문구가 확인됐다.
- OK: `git diff --check`가 경고 없이 통과했다.
- OK: `npm run typecheck`가 성공했다.
- OK: `npm run build`가 Phase 0 virtual entry로 성공했다.

## 잔여 위험

- Firefox 원본 코드는 아직 복사하지 않았으므로 실제 upstream revision 기록은 후속 Phase 2 포팅 작업에서 추가해야 한다.
- `.gitkeep` 파일은 디렉터리 경계 보존용 임시 파일이다. 실제 소스가 추가되면 필요한 경우 제거할 수 있다.

## 다음 단계 영향

- Stage 4에서 전체 Phase 0 산출물을 최종 검증하고 보고서를 작성한다.
- 후속 Phase 1은 `src/background/`, `src/content/`, `src/shared/`를 실제 MV3 entrypoint와 helper 코드로 채우면 된다.
- 후속 Phase 2는 `src/firefox-derived/README.md`의 규칙에 따라 Firefox-derived 코드를 추가해야 한다.

## 승인 요청

- Stage 3 산출물과 검증 결과를 승인하면 다음 단계로 진행한다.
