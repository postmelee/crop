# Task #37 Stage 4.1 보고서 - 제출 직전 Dashboard 보정

GitHub Issue: [#37](https://github.com/postmelee/crop/issues/37)
구현계획서: [`task_m030_37_impl.md`](../plans/task_m030_37_impl.md)
Stage: 4.1

## 단계 목적

Stage 4 완료 후 작업지시자가 Chrome Web Store Developer Dashboard를 직접 입력하는 과정에서 확인한 privacy policy URL, category, user data checkbox, 다국어 개인정보처리방침 범위를 제출 직전 기준으로 보정한다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `PRIVACY.md` | 영어 원문을 유지하고 한국어, 일본어, 중국어 개인정보처리방침 전문을 추가했다. |
| `mydocs/tech/task_m030_37_chrome_web_store_dashboard.md` | privacy policy URL을 `main` 기준으로 보정하고, category를 `Tools` 1차 후보로 변경했으며, `Website content`만 체크하는 privacy disclosure 기준을 추가했다. |
| `mydocs/report/task_m030_37_report.md` | 최종 Dashboard 직접 입력 가이드를 Stage 4.1 기준으로 갱신하고, 최종 보고서 수용 기준과 단계 이력에 Stage 4.1을 추가했다. |
| `mydocs/orders/20260607.md` | #37 Stage 4.1 보정 완료 상태를 기록했다. |

## 본문 변경 정도 / 본문 무손실 여부

- `PRIVACY.md`의 영어 원문은 삭제하지 않고 유지했다.
- `PRIVACY.md`에는 한국어, 일본어, 중국어 전문 번역을 추가했다.
- Store listing의 영어/한국어 detailed description은 작업지시자가 수정한 한국어 설명 기준으로 다시 낮췄다.
- 기존 Stage 1~4 이력과 package 검증 결과는 보존하고, 제출 직전 보정값만 Stage 4.1로 추가했다.

## 검증 결과

실행 명령:

```bash
rg -n 'blob/devel|devel/PRIVACY|PR merge 전|PR merge 후 `https://github.com/postmelee/crop/blob/devel|Category \| `Art & Design`|Fallback category \| `Tools`|telemetry나 analytics|content script는|현재 보이는 뷰포트|오버레이' mydocs/tech/task_m030_37_chrome_web_store_dashboard.md mydocs/report/task_m030_37_report.md PRIVACY.md
rg -n '^# crop Privacy Policy|^# crop 개인정보처리방침|^# crop プライバシーポリシー|^# crop 隐私政策' PRIVACY.md
rg -n 'Website content|github.com/postmelee/crop/blob/main/PRIVACY.md|Category \||Fallback category|User activity|Web history' mydocs/tech/task_m030_37_chrome_web_store_dashboard.md mydocs/report/task_m030_37_report.md
git diff --check
```

결과:

- OK: Dashboard 입력값 범위에서 `devel` privacy URL, `Art & Design` 1차 category, `telemetry나 analytics`, `content script는`, `오버레이` 같은 이전 Store copy 표현이 남지 않았다.
- OK: `PRIVACY.md`가 영어, 한국어, 일본어, 중국어 H1 섹션을 포함한다.
- OK: Dashboard guide와 최종 보고서가 `Website content`만 체크하고 `User activity`, `Web history` 등은 체크하지 않는 기준을 포함한다.
- OK: Dashboard guide와 최종 보고서가 `https://github.com/postmelee/crop/blob/main/PRIVACY.md` 후보를 포함한다.
- OK: `git diff --check` 공백 오류 없음.

## 잔여 위험

- `main` 기준 privacy policy URL은 #37 PR merge 후 `devel` -> `main` 반영이 끝난 뒤에만 최신 내용을 가리킨다.
- 실제 Chrome Web Store Dashboard upload, 저장, review submit은 아직 수행하지 않았다.
- global small promotional image 440x280, publisher contact email 인증, 제출 직전 smoke는 계속 submit 전 blocker다.

## 다음 단계 영향

- 최종 Dashboard 입력 시 privacy policy URL은 `https://github.com/postmelee/crop/blob/main/PRIVACY.md`를 사용하되, `main` 반영 전에는 제출하지 않는다.
- Privacy tab의 user data type은 `Website content`만 체크한다.
- Category는 `Tools`를 1차 선택하고, 필요 시 `Art & Design`을 fallback으로 둔다.

## 승인 요청

- Stage 4.1 산출물과 검증 결과를 승인하면 `publish/task37` 브랜치를 게시하고 `devel` 대상 PR을 생성한다.
