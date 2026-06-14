# Task #75 Stage 1 완료보고서 - Privacy 문서 적용 버전과 날짜 갱신

GitHub Issue: [#75](https://github.com/postmelee/crop/issues/75)
구현계획서: [`task_m030_75_impl.md`](../plans/task_m030_75_impl.md)
Stage: 1

## 단계 목적

Chrome Web Store 제출 전 고정 Privacy URL인 `main/PRIVACY.md`가 현재 release 기준을 명확히 나타내도록 `PRIVACY.md` 4개 언어 섹션의 업데이트 날짜와 적용 버전 문구를 갱신했다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `PRIVACY.md` | 영어, 한국어, 일본어, 중국어 섹션의 최종 업데이트 날짜를 2026-06-14 기준으로 갱신하고 `crop` v0.1.1 및 이후 버전 적용 문구를 추가 |
| `mydocs/orders/20260614.md` | #75 비고를 Stage 1 완료 후 승인 대기 상태로 갱신 |
| `mydocs/working/task_m030_75_stage1.md` | Stage 1 변경, 검증, 잔여 위험 기록 |

## 본문 변경 정도 / 본문 무손실 여부

본문 재작성은 하지 않았다. 각 언어 섹션에서 날짜 1줄을 갱신하고 첫 설명 문단 뒤에 적용 버전 문장만 추가했다.

기존 privacy/data handling, local processing, no server upload, no telemetry/analytics, permission 설명, no `debugger`/`<all_urls>`/`host_permissions` 문구는 유지했다.

추가한 적용 버전 문구:

- English: `This policy applies to crop v0.1.1 and later, unless it is replaced by a newer policy.`
- Korean: `이 방침은 더 새로운 방침으로 대체되기 전까지 crop v0.1.1 및 이후 버전에 적용됩니다.`
- Japanese: `このポリシーは、より新しいポリシーに置き換えられるまで、crop v0.1.1 以降に適用されます。`
- Chinese: `除非被更新的政策取代，本政策适用于 crop v0.1.1 及更高版本。`

실제 문서에서는 프로젝트 문서 스타일에 맞춰 `crop`을 backtick으로 감싸고 일부 문장을 줄바꿈했다.

## 검증 결과

실행 명령:

```bash
rg -n "v0.1.1|June 14, 2026|2026년 6월 14일|2026年6月14日" PRIVACY.md
rg -n "server|telemetry|analytics|debugger|<all_urls>|host_permissions|activeTab|scripting|clipboardWrite|downloads" PRIVACY.md
git diff --check
```

결과:

- OK: `PRIVACY.md`에서 4개 언어 섹션 모두 2026-06-14 업데이트 날짜와 `v0.1.1` 적용 문구가 확인됐다.
- OK: `server`, `telemetry`, `analytics`, `debugger`, `<all_urls>`, `host_permissions`, `activeTab`, `scripting`, `clipboardWrite`, `downloads` 관련 기존 privacy/permission 문구가 유지되어 있음을 확인했다.
- OK: `git diff --check`가 경고 없이 통과했다.

## 잔여 위험

- 다국어 번역의 법무적 정밀성은 별도 전문 검토를 거치지 않았다. 다만 이번 변경은 적용 버전과 날짜 명시로 한정했고, privacy/data handling 의미는 변경하지 않았다.

## 다음 단계 영향

- Stage 2에서는 `mydocs/manual/release_pipeline_guide.md`에 Chrome Web Store Privacy URL 기본값을 `main/PRIVACY.md`로 유지하고 release마다 `PRIVACY.md`의 Last updated와 적용 버전 문구를 확인한다는 규칙을 추가한다.
- Stage 1 승인 전에는 Stage 2 파일을 수정하지 않는다.

## 승인 요청

- Stage 1 산출물과 검증 결과를 승인하면 Stage 2로 진행한다.
