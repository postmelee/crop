# Task #40 피드백

## 대상

- 관련 이슈: #40
- 관련 Stage: Stage 4 이후 추가 보정
- 관련 PR: 해당 없음
- 작성자: 작업지시자
- 작성일: 2026-06-05

## 피드백 요약

작업지시자가 `/private/tmp/crop-task40/dist`를 Chrome 확장으로 로드해 직접 검증했지만, 엄청 긴 페이지의 전체 페이지 preview에서 흰 band가 여전히 보인다고 보고했다. 짧은 페이지에서는 포착되지 않으므로 preview image background fallback보다 full page tile capture 중 scroll 직후 paint가 안정되기 전에 `captureVisibleTab()`이 실행되는 문제로 판단한다.

## 상세 피드백

| 위치 | 내용 | 기대 결과 |
|---|---|---|
| `src/content/overlay/full-page-capture.ts` | 긴 페이지에서 tile capture 직전 paint settle이 부족해 흰 placeholder tile이 캡처될 수 있다. | full page/selected page rect tile capture가 최소 2 animation frame을 기다린 뒤 viewport를 캡처한다. |
| `tests/content/overlay/full-page-capture.test.ts` | 기본 tile capture wait contract가 테스트로 고정되지 않았다. | 기본 wait가 여러 animation frame 뒤에 settle되는지 회귀 테스트로 확인한다. |
| 작업 진행 방식 | 작업지시자가 수동 검증 후 만족스럽지 않으면 되돌릴 수 있어야 한다. | Stage 5 단일 커밋으로 묶어 `git revert` 한 번으로 되돌릴 수 있게 한다. |

## 우선순위

- must-fix: 긴 페이지 full page capture에서 흰 placeholder band가 결과에 들어가는 가능성을 줄인다.
- should-fix: visible viewport capture 경로와 일반 selected visible crop 경로는 건드리지 않는다.
- note: 초장문 단일 PNG 해상도 저하는 별도 한계이며 이번 피드백의 직접 수정 범위가 아니다.

## 반영 기준

- full page/selected page rect tile capture 기본 wait가 `requestAnimationFrame` 2회를 기다린다.
- focused test와 전체 test가 통과한다.
- `npm run build`로 `/private/tmp/crop-task40/dist`가 갱신된다.
- 변경은 단일 Stage 5 커밋으로 남는다.

## 후속 확인

- 작업지시자가 `/private/tmp/crop-task40/dist`를 다시 로드하고, 문제가 재현된 긴 GitHub 페이지에서 전체 페이지 preview scroll을 수동 검증한다.
