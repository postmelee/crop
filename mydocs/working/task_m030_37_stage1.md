# Task #37 Stage 1 보고서 - 공식 문서와 현행 산출물 재대조

GitHub Issue: [#37](https://github.com/postmelee/crop/issues/37)
구현계획서: [`task_m030_37_impl.md`](../plans/task_m030_37_impl.md)
Stage: 1

## 단계 목적

Stage 1은 Chrome Web Store Developer Dashboard 입력값을 확정하기 전, 최신 공식 문서와 현재 저장소 산출물의 기준선을 다시 세우는 단계다. #9 Store 준비 산출물과 PR #38 downscale fallback 반영 상태를 대조하고, Stage 2에서 확정·보정해야 할 gap을 분리했다.

이번 단계에서는 실제 Dashboard 입력값을 확정하지 않았다. 실제 로그인된 Developer Dashboard 화면은 직접 확인하지 못했으므로, 공식 문서 기준과 `작업지시자 확인 필요` 항목을 분리했다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `mydocs/tech/task_m030_37_chrome_web_store_dashboard.md` | 공식 문서 URL/확인일, Dashboard 확인 한계, category 재대조, PR #38 반영 gap, 권한/privacy 기준선, Stage 2 결정 항목을 신규 정리 |
| `mydocs/orders/20260604.md` | #37 비고를 Stage 1 재대조 후 승인 대기 상태로 갱신 |
| `mydocs/working/task_m030_37_stage1.md` | Stage 1 산출물, 검증 결과, 잔여 위험, 다음 단계 영향 기록 |

## 본문 변경 정도 / 본문 무손실 여부

신규 기술 노트 168 lines를 작성했다. #9 기술 노트, #9 최종 보고서, #35 최종 보고서, README family, `PRIVACY.md`, `manifest.json`의 기존 본문은 수정하지 않았다.

오늘할일은 #37 행의 비고만 갱신했다. 기존 #35, #9 완료 행은 보존했다.

## 검증 결과

실행 명령:

```bash
gh issue view 37 --repo postmelee/crop --json number,title,state,labels,milestone,body
gh pr view 38 --repo postmelee/crop --json number,title,state,mergedAt,baseRefName,headRefName,body
rg -n "explicit size errors|명시적인 크기 오류|maximum canvas|downscale|large canvas|full page|전체 페이지" README*.md PRIVACY.md mydocs/tech mydocs/report/task_m020_35_report.md
rg -n "activeTab|scripting|clipboardWrite|downloads|debugger|<all_urls>|host_permissions" manifest.json README.md README.ko.md README.zh-CN.md README.ja.md PRIVACY.md mydocs/tech
git diff --check
```

결과:

- OK: #37은 `OPEN`, milestone `M030 — Release Preparation`, labels `documentation`, `enhancement` 상태로 확인했다.
- OK: PR #38은 `MERGED`, base `devel`, head `publish/task35`, merged at `2026-06-04T06:00:34Z`로 확인했다.
- OK: downscale/large canvas grep으로 README family는 PR #38 기준 downscale fallback 문구가 반영됐음을 확인했다.
- OK: 같은 grep에서 `PRIVACY.md`와 `mydocs/tech/task_m030_9_chrome_web_store.md`에는 `explicit size errors` 표현이 남아 있어 Stage 2 보정 대상으로 분리했다.
- OK: 권한 grep으로 현재 manifest 권한은 `activeTab`, `scripting`, `clipboardWrite`, `downloads`이고, 문서상 `debugger`, `<all_urls>`, broad `host_permissions` 미요청 기준이 유지됨을 확인했다.
- OK: `git diff --check` 경고 없음.

## 잔여 위험

- 실제 로그인된 Chrome Web Store Developer Dashboard 화면은 직접 확인하지 않았다. Stage 2에서 공식 문서 기준값과 실제 Dashboard 확인 필요 항목을 분리해야 한다.
- Store Listing guide는 graphic assets에 YouTube video field를 포함하지만, Supplying Images guide의 mandatory image 기준과 표현 차이가 있다. 실제 submit blocker 여부는 Stage 2에서 `작업지시자 확인 필요`로 남긴다.
- `PRIVACY.md`에는 PR #38 이후 outdated인 `explicit size errors` 표현이 남아 있다. Stage 2에서 browser limitation 문구를 downscale fallback 기준으로 최소 보정해야 한다.
- Store screenshot과 small promotional image는 여전히 제출 전 blocker다.

## 다음 단계 영향

- Stage 2는 #37 기술 노트를 기준으로 Dashboard 입력값 표를 확정한다.
- category는 `Art & Design`을 1차 후보, `Tools`를 fallback 후보로 두고 실제 Dashboard 선택 가능성과 작업지시자 의도를 확인한다.
- #9 Store detailed description 초안은 그대로 복사하지 않고, PR #38 downscale fallback과 해상도 저하 tradeoff를 반영한 최종 copy로 재작성한다.
- `PRIVACY.md` limitation 문구를 최소 수정한다.
- 실제 upload/review submit, Store screenshot/small promo 제작은 계속 제외한다.

## 승인 요청

- Stage 1 산출물과 검증 결과를 승인하면 Stage 2 `Dashboard 입력값 표 확정`으로 진행한다.
