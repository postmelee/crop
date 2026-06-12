# Task #66 Stage 3 보고서

GitHub Issue: [#66](https://github.com/postmelee/crop/issues/66)
구현계획서: [`task_m020_66_impl.md`](../plans/task_m020_66_impl.md)
Stage: 3

## 단계 목적

Stage 3은 Stage 2의 selected stitching runtime 보정이 회귀하지 않도록 phase6 regression 계약을 추가하고, 실제 외부 광고 재현을 확인할 수 있는 수동 smoke 기준을 정리하는 단계다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `tests/content/overlay/phase6-regression.test.ts` | selected stitching runtime이 `minimal-scroll` planning을 사용하고 full page planning은 기존 경로를 유지하는 문자열 계약 테스트를 추가했다. |
| `mydocs/tech/task_m020_8_quality_matrix.md` | P6-39 selected scroll capture 항목의 근거에 Task #66 보정을 추가했다. |

## 본문 변경 정도 / 본문 무손실 여부

테스트와 작업 문서 보강이다. runtime 소스는 Stage 3에서 변경하지 않았다.

품질 매트릭스는 기존 P6-39 행의 근거만 좁게 갱신했다. 기존 smoke 절차와 다른 항목의 상태는 변경하지 않았다.

## 검증 결과

실행 명령:

```bash
npm test -- tests/content/overlay/phase6-regression.test.ts
rg "debugger|<all_urls>|host_permissions" manifest.json src tests
git diff --check
```

결과:

- OK — `npm test -- tests/content/overlay/phase6-regression.test.ts`: `1` test file, `30` tests passed.
- OK — `rg "debugger|<all_urls>|host_permissions" manifest.json src tests`: production `manifest.json`/`src`에는 권한 확대가 없고, 회귀 테스트의 금지 assertion만 출력됐다.
- OK — `git diff --check`: 경고 없음.
- 참고 — 분리 worktree에는 `node_modules`가 없어 원본 worktree의 `node_modules`를 임시 symlink로 연결해 테스트를 실행했고, 검증 후 symlink는 제거했다.

## 수동 smoke 기준

- namu.wiki 광고처럼 선택 영역이 한 viewport 안에 들어가지만 현재 viewport 아래쪽으로 일부 벗어난 영역을 선택한 뒤 Save/Copy 결과가 검정 placeholder가 아닌 실제 광고 이미지인지 확인한다.
- 같은 광고 영역이 viewport 안에 완전히 들어온 상태에서도 Save/Copy 결과가 기존처럼 정상인지 비교한다.
- 일반 본문 영역은 선택 영역 일부가 viewport 밖에 있어도 기존처럼 정상 캡처되는지 확인한다.
- 결과 PNG 크기가 선택 CSS 크기 x DPR과 일치하는지 확인한다.
- 캡처 후 시작 scroll position으로 복구되는지 확인한다.
- crop overlay, handles, action buttons, 선택 박스 밖 sticky/fixed page chrome이 결과에 포함되지 않는지 확인한다.

## 잔여 위험

- 실제 광고 iframe/OOPIF 캡처는 외부 광고 로딩과 Chrome compositor 상태에 의존한다. 자동 테스트는 selected 경로의 scroll planning 계약과 권한 경계를 고정하지만, 실제 광고 검정 placeholder 재현 여부는 수동 smoke가 필요하다.
- Stage 2에서 pixel 분석 retry는 보류했다. 수동 smoke에서 검정 placeholder가 계속 재현되면 구현계획서를 갱신하고 selected stitching 한정 retry를 별도 보정으로 진행해야 한다.

## 다음 단계 영향

- Stage 4는 최종 보고서에 Stage 1-3 변경 요약, 자동 검증 결과, 수동 smoke 잔여 여부, retry 보류 판단을 정리한다.
- PR 준비 전 전체 테스트와 권한 grep을 다시 실행한다.

## 승인 요청

- Stage 3 산출물과 검증 결과를 승인하면 Stage 4 최종 보고와 PR 준비로 진행한다.
