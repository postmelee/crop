# Task #9 Stage 2 보고서 - Privacy policy와 Store copy 작성

GitHub Issue: [#9](https://github.com/postmelee/crop/issues/9)
구현계획서: [`task_m030_9_impl.md`](../plans/task_m030_9_impl.md)
Stage: 2

## 단계 목적

Stage 1의 Chrome Web Store 정책·현행 산출물 매핑을 기준으로 공개 privacy policy 후보와 Store Dashboard 입력 초안을 작성한다. 이번 Stage는 실제 Chrome Web Store Dashboard 입력이나 제출이 아니라, PR merge 후 사용할 수 있는 문구와 검증 가능한 policy 파일을 준비하는 단계다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `PRIVACY.md` | English privacy policy 신규 작성. local browser processing, no upload, no telemetry/analytics, Copy/Save user action, 권한 설명, Limited Use 문구, browser/page limitation, repository contact를 명시했다. |
| `README.md` | Privacy 섹션에 `PRIVACY.md` 링크를 추가했다. |
| `README.ko.md` | 개인정보 섹션에 `PRIVACY.md` 링크를 추가했다. |
| `README.zh-CN.md` | 隐私 섹션에 `PRIVACY.md` 링크를 추가했다. |
| `README.ja.md` | プライバシー 섹션에 `PRIVACY.md` 링크를 추가했다. |
| `mydocs/tech/task_m030_9_chrome_web_store.md` | Stage 2 Store short description, detailed description, single purpose statement, permission justification, privacy fields draft, category/URL 후보, localization scope를 추가했다. |
| `mydocs/working/task_m030_9_stage2.md` | Stage 2 완료 보고서와 검증 결과를 기록했다. |

## 본문 변경 정도 / 본문 무손실 여부

`PRIVACY.md`와 Stage 2 Store copy는 신규 작성이다. README family는 기존 privacy 문구를 보존하고 policy 링크 한 문장만 추가했다. 기존 manifest, source, license notice 본문은 변경하지 않았다.

Store listing copy에는 Mozilla/Firefox를 언급하지 않았고, full-page capture는 단일 목적인 screenshot capture의 capture mode로만 설명했다. Category, Homepage URL, Support URL, Official URL은 후보와 보류 항목으로만 남겼다.

## 검증 결과

실행 명령:

```bash
rg -n "server|telemetry|analytics|local|clipboard|download|Chrome Web Store|privacy|permission" PRIVACY.md mydocs/tech/task_m030_9_chrome_web_store.md README.md README.ko.md README.zh-CN.md README.ja.md
rg -n "Mozilla|Firefox|official|affiliated|endorsed|sponsored" PRIVACY.md mydocs/tech/task_m030_9_chrome_web_store.md README.md README.ko.md README.zh-CN.md README.ja.md NOTICE THIRD_PARTY.md
rg -n "activeTab|scripting|clipboardWrite|downloads|debugger|<all_urls>|host_permissions" manifest.json PRIVACY.md mydocs/tech/task_m030_9_chrome_web_store.md README.md
git diff --check
```

결과:

- OK: privacy grep에서 `PRIVACY.md`, README family, Store copy 초안이 local processing, no server upload, no telemetry/analytics, clipboard/download user action, Chrome Web Store privacy/permission 문맥을 포함함을 확인했다.
- OK: branding grep에서 `PRIVACY.md`에는 Mozilla/Firefox 제휴 암시가 없고, README/NOTICE/THIRD_PARTY의 Mozilla/Firefox 언급은 attribution, license, non-affiliation 문맥으로 유지됨을 확인했다.
- OK: 권한 grep에서 manifest 권한은 `activeTab`, `scripting`, `clipboardWrite`, `downloads`이며, `PRIVACY.md`와 Store justification 초안도 같은 4개 권한만 설명함을 확인했다.
- OK: `debugger`, `<all_urls>`, `host_permissions`는 요청하지 않는 권한 설명과 regression 문맥으로만 등장하고 manifest 요청 권한으로는 등장하지 않았다.
- OK: `git diff --check`가 경고 없이 통과했다.

추가 확인:

- README family diff는 privacy policy 링크 한 문장 추가로 제한됨을 확인했다.
- `PRIVACY.md`는 Chrome Web Store privacy policy URL 후보로 사용할 수 있도록 repository root에 배치했다.

## 잔여 위험

- `PRIVACY.md`의 실제 Chrome Web Store privacy policy URL은 PR merge 후 stable branch URL로 확정해야 한다.
- Category, Homepage URL, Support URL, Official URL은 실제 Dashboard 제출 단계에서 확정해야 한다.
- localized Store listing copy는 이번 Stage에서 작성하지 않았다. README/locales는 준비되어 있지만 Store localized copy와 localized screenshots는 후속 후보로 남긴다.
- Store icon/screenshot/small promo image blocker는 Stage 1에서 확인한 그대로 남아 있다.

## 다음 단계 영향

- Stage 3은 `mydocs/tech/task_m030_9_chrome_web_store.md`의 package/release gap과 Stage 2 copy 상태를 기준으로 release package checklist, zip contents review, source availability checklist를 확정한다.
- Stage 3에서 `NOTICE`, `THIRD_PARTY.md`, `LICENSE-MPL-2.0`, source map 포함 정책을 배포 관점에서 다시 점검한다.
- Stage 4는 privacy policy URL 후보, Store asset blocker, Dashboard 입력 보류 항목을 최종 blocker/후속 작업으로 분류한다.

## 승인 요청

- Stage 2 산출물과 검증 결과를 승인하면 Stage 3 `Release package와 source availability checklist`로 진행한다.
