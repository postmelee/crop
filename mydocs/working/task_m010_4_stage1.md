# Task #4 Stage 1 보고서

GitHub Issue: [#4](https://github.com/postmelee/crop/issues/4)
구현계획서: [`task_m010_4_impl.md`](../plans/task_m010_4_impl.md)
Stage: 1

## 단계 목적

Stage 1은 Firefox-derived helper 포팅 전에 upstream source, commit
revision, local adaptation target, MPL 2.0 경계를 먼저 고정하는 단계다.
이번 단계에서는 Task #4의 실제 import 기준을
`browser/components/screenshots/overlayHelpers.mjs` 하나로 좁히고, CSS,
buttons, privileged actor 파일은 이번 task의 import 대상에서 제외했다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `NOTICE` | Task #4의 upstream repository, commit SHA, source path, local derived target을 추가 |
| `THIRD_PARTY.md` | primary upstream source, local adaptation target별 scope와 modification summary, context-only 제외 파일을 기록 |
| `src/firefox-derived/README.md` | derived source 경계, Task #4 upstream source, local target, 제외 upstream source를 정리 |
| `mydocs/orders/20260527.md` | 오늘할일 비고를 Stage 1 완료 후 승인 대기 상태로 갱신 |

## 본문 변경 정도 / 본문 무손실 여부

문서 작업만 수행했다. Phase 0에서 남겨 둔 planned source 문구를 Task #4의
확정 source boundary로 교체했으며, 라이선스 원문이나 MPL 헤더 예시는
삭제하지 않았다. 실제 TypeScript helper 파일은 아직 생성하지 않았고 Stage 2와
Stage 3에서 추가한다.

## 검증 결과

upstream revision 확인:

```bash
git ls-remote https://github.com/mozilla-firefox/firefox.git refs/heads/main
```

결과:

- OK: `refs/heads/main`이 `e28b34ab33dbf49364999070168cbb7e11e8e5bd`를 가리키는 것을 확인했다.
- OK: 해당 commit 기반 source URL을 `NOTICE`, `THIRD_PARTY.md`, `src/firefox-derived/README.md`에 기록했다.

실행 명령:

```bash
rg "MPL-2.0|Mozilla Public License|overlayHelpers" src/firefox-derived THIRD_PARTY.md NOTICE
git diff --check
```

결과:

- OK: `NOTICE`, `THIRD_PARTY.md`, `src/firefox-derived/README.md`에서 MPL 2.0 고지와 `overlayHelpers.mjs` 출처 기록이 확인됐다.
- OK: `git diff --check`가 경고 없이 통과했다.

## 잔여 위험

- Stage 1은 문서상 source boundary만 확정했다. 실제 MPL header가 붙은 TypeScript source 파일은 Stage 2와 Stage 3에서 생성해야 한다.
- GitHub `main` 기준으로 SHA를 고정했으므로, 나중에 upstream이 변경되더라도 이번 task는 `e28b34ab33dbf49364999070168cbb7e11e8e5bd` 기준으로 구현한다.

## 다음 단계 영향

- Stage 2는 `overlayHelpers.mjs`의 `Region`/`WindowDimensions`를 직접 포팅하되, visible viewport-only 모델로 축소한다.
- Stage 2에서 추가되는 `region.ts`와 `window-dimensions.ts`는 MPL 2.0 notice를 파일 상단에 포함해야 한다.
- Firefox privileged API, closed shadow root access, cross-origin iframe traversal, full-page capture, scroll stitching은 계속 제외한다.

## 승인 요청

- Stage 1 산출물과 검증 결과를 승인하면 Stage 2로 진행한다.
