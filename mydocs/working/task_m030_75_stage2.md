# Task #75 Stage 2 완료보고서 - release Privacy URL 규칙 추가

GitHub Issue: [#75](https://github.com/postmelee/crop/issues/75)
구현계획서: [`task_m030_75_impl.md`](../plans/task_m030_75_impl.md)
Stage: 2

## 단계 목적

반복 release 때 Chrome Web Store Privacy URL과 `PRIVACY.md`의 적용 version/date 갱신을 누락하지 않도록 `mydocs/manual/release_pipeline_guide.md`에 운영 규칙을 추가했다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `mydocs/manual/release_pipeline_guide.md` | Chrome Web Store Privacy URL 기본값을 `main/PRIVACY.md`로 고정하고, tag URL의 역할과 release마다 Last updated/version 확인 규칙을 추가 |
| `mydocs/orders/20260614.md` | #75 비고를 Stage 2 완료 후 승인 대기 상태로 갱신 |
| `mydocs/working/task_m030_75_stage2.md` | Stage 2 변경, 검증, 잔여 위험 기록 |

## 본문 변경 정도 / 본문 무손실 여부

기존 release pipeline 구조는 유지했다. `main` 또는 release tag 기준 URL을 허용하던 표현은 Store Dashboard 기본값과 예외 용도를 분리하는 방식으로 보정했다.

핵심 변경:

- Chrome Web Store Privacy URL 기본값은 `https://github.com/postmelee/crop/blob/main/PRIVACY.md`로 명시했다.
- tag URL은 GitHub Release note, 감사 기록, 특정 version snapshot 확인용으로 분리했다.
- Store Dashboard Privacy URL을 tag URL로 바꾸려면 별도 승인을 받도록 했다.
- release마다 `PRIVACY.md`의 Last updated와 적용 version 문구를 최신 release 기준으로 확인하도록 했다.
- `v0.1.1`에서 적용한 Last updated/version 갱신 작업이 이후 release마다 반복되어야 하는 근거를 release runbook에 남겼다.

Chrome Web Store Dashboard upload, `Submit for review`, release asset 교체, tag 이동은 수행하지 않았다.

## 검증 결과

실행 명령:

```bash
rg -n "main/PRIVACY.md|Last updated|적용|v\\{version\\}|Chrome Web Store Privacy URL|privacy policy URL|tag URL" mydocs/manual/release_pipeline_guide.md
rg -n "main/PRIVACY.md|tag URL|Last updated|v0.1.1|Privacy URL|수행하지" mydocs/working/task_m030_75_stage2.md
git diff --check
```

결과:

- OK: `release_pipeline_guide.md`에서 `main/PRIVACY.md` 기본 URL, `tag URL` 역할, `Last updated`, 적용 version 확인 규칙이 확인됐다.
- OK: Stage 2 보고서에 `main/PRIVACY.md`, `tag URL`, `Last updated`, `v0.1.1`, `Privacy URL`, `수행하지` 기준을 기록했다.
- OK: `git diff --check`가 경고 없이 통과했다.

## 잔여 위험

- 기존 #37 Dashboard 기술 노트에는 과거 release tag URL 후보 문구가 일부 남아 있다. 이번 Stage의 범위는 반복 release 매뉴얼 보정이므로, #37 task 산출물 재작성은 하지 않았다.

## 다음 단계 영향

- Stage 3에서는 `PRIVACY.md`와 `release_pipeline_guide.md`를 함께 최종 검증하고, Chrome Web Store 제출과 release asset/tag 변경을 수행하지 않았음을 최종 보고서에 명시한다.
- Stage 2 승인 전에는 최종 보고서 작성과 PR 게시 준비로 넘어가지 않는다.

## 승인 요청

- Stage 2 산출물과 검증 결과를 승인하면 Stage 3으로 진행한다.
