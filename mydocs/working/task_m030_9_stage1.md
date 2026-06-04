# Task #9 Stage 1 보고서 - Store 정책과 현행 산출물 매핑

GitHub Issue: [#9](https://github.com/postmelee/crop/issues/9)
구현계획서: [`task_m030_9_impl.md`](../plans/task_m030_9_impl.md)
Stage: 1

## 단계 목적

Chrome Web Store 공식 문서의 제출 요구사항과 현재 `crop` 산출물을 대조해 Stage 2~4에서 사용할 기준을 고정한다. 이번 Stage는 Store copy 전문 작성이 아니라, single purpose, privacy, 권한 justification, asset inventory, package gap, source availability 점검 항목을 정리하는 단계다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `mydocs/tech/task_m030_9_chrome_web_store.md` | Chrome Web Store 공식 문서 확인일, 제출 요구사항, 현재 manifest/README/locale/license/source 상태, 권한 매핑, privacy/data 매핑, asset blocker, Stage 2~4 입력값을 정리했다. |
| `mydocs/working/task_m030_9_stage1.md` | Stage 1 완료 보고서와 검증 결과를 기록했다. |

## 본문 변경 정도 / 본문 무손실 여부

신규 기술 노트와 신규 단계 보고서만 추가했다. 기존 README, manifest, source, license notice 본문은 변경하지 않았다. 공식 문서 내용은 URL과 확인일을 남기고 `crop` 적용 관점으로 요약했다.

## 검증 결과

실행 명령:

```bash
gh issue view 9 --repo postmelee/crop --json number,title,state,labels,milestone,body
rg -n "activeTab|scripting|clipboardWrite|downloads|debugger|<all_urls>|host_permissions" manifest.json README.md README.ko.md README.zh-CN.md README.ja.md src tests
rg -n "Mozilla|Firefox|affiliated|endorsed|sponsored|telemetry|server|privacy" README.md README.ko.md README.zh-CN.md README.ja.md NOTICE THIRD_PARTY.md
rg -n "icons|default_locale|__MSG_|_locales" manifest.json vite.config.ts _locales tests
git diff --check
```

결과:

- OK: `gh issue view 9`에서 이슈 #9가 open 상태이고 `M030 — Release Preparation`, `documentation`, `enhancement` 기준을 유지함을 확인했다.
- OK: 권한 grep에서 manifest 권한은 `activeTab`, `scripting`, `clipboardWrite`, `downloads`이고, README family가 같은 권한 설명을 담고 있음을 확인했다.
- OK: `debugger`, `<all_urls>`, `host_permissions`는 README 제한 문구와 regression test의 부재 검증으로만 등장했고 manifest 요청 권한으로는 등장하지 않았다.
- OK: branding/privacy grep에서 README family, `NOTICE`, `THIRD_PARTY.md`가 no telemetry/server upload와 Mozilla/Firefox non-affiliation 및 source attribution 문맥을 담고 있음을 확인했다.
- OK: locale/manifest grep에서 `default_locale: en`, `__MSG_*__`, `_locales` build copy/test wiring을 확인했다.
- OK: `git diff --check`가 경고 없이 통과했다.

추가 확인:

- 공식 문서 기준으로 privacy policy URL, Store listing, Store asset, ZIP root manifest, single purpose, minimum permission, MV3 self-contained code 요구사항을 Stage 1 노트에 기록했다.
- 현재 이미지 파일과 manifest `icons` 정의가 없음을 확인했고, Store icon/screenshot/small promo image를 실제 제출 전 blocker로 분류했다.
- source grep에서 remote logic fetch/eval은 발견되지 않았고, Mozilla URL은 MPL/source attribution 문맥으로만 확인했다.

## 잔여 위험

- Chrome Web Store 문서 중 listing guide와 images guide의 video 필수성 표현이 다르다. Stage 1에서는 video를 Dashboard 확인 항목으로 두고 blocker로 단정하지 않았다.
- Store category, homepage URL, support URL, official URL은 아직 결정되지 않았다.
- asset 제작은 이번 task 범위가 아니므로 실제 제출 전 별도 승인 또는 후속 task가 필요할 수 있다.

## 다음 단계 영향

- Stage 2는 `mydocs/tech/task_m030_9_chrome_web_store.md`의 privacy/data 매핑을 기준으로 루트 `PRIVACY.md`와 Store copy 초안을 작성한다.
- Stage 2 권한 justification은 `activeTab`, `scripting`, `clipboardWrite`, `downloads` 4개만 대상으로 한다.
- Stage 3은 package/release gap에 기록한 `dist/` root zip, `_locales` 포함, source map 포함 정책을 기준으로 checklist를 확정한다.
- Stage 4는 asset blocker와 실제 제출 전 승인 항목을 최종 보고서에 반영한다.

## 승인 요청

- Stage 1 산출물과 검증 결과를 승인하면 Stage 2 `Privacy policy와 Store copy 작성`으로 진행한다.
