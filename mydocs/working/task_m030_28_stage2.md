# Task #28 Stage 2 완료 보고서

GitHub Issue: [#28](https://github.com/postmelee/crop/issues/28)
구현계획서: [`task_m030_28_impl.md`](../plans/task_m030_28_impl.md)
Stage: 2

## 단계 목적

Stage 2는 Stage 1에서 만든 English README 초안을 사용자 관점에서 다시 다듬고, Chrome Web Store 배포 준비 문구의 기반으로 재사용할 수 있도록 기능 설명, 권한 설명, privacy/local processing, limitations, attribution/license 문맥을 보정하는 단계다.

이번 단계에서는 다국어 README 파일을 만들지 않고, Stage 3에서 번역할 English 기준 문구를 더 안정화하는 데 집중했다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `README.md` | 첫 문단, release status, language placeholder, feature bullets, source loading, shortcut 안내, permissions, limitations, workflow, attribution heading을 더 명확한 English 문구로 보정했다. |
| `mydocs/orders/20260603.md` | #28 비고를 Stage 2 완료 보고 후 Stage 3 승인 대기 상태로 갱신했다. |
| `mydocs/working/task_m030_28_stage2.md` | Stage 2 변경 내용, 검증 결과, 잔여 위험을 기록했다. |

## 본문 변경 정도 / 본문 무손실 여부

`README.md`는 Stage 1 산출물 156줄에서 158줄로 보정됐다. 전면 재작성은 Stage 1에서 이미 수행했고, Stage 2는 문구 정제와 기능/권한 표현 보강에 한정했다.

주요 보정 사항:

- 첫 문단을 "precise page screenshots" 중심으로 간결하게 수정했다.
- Chrome Web Store 상태를 "not listed yet"로 표현해 배포 완료로 오해될 여지를 줄였다.
- `Install From Source`를 `Load from source`로 바꿔 현재 unpacked extension 상태에 맞췄다.
- 선택 영역이 viewport 밖으로 이어질 때 scroll/stitching으로 selected page rectangle을 캡처한다는 현재 구현 상태를 기능 목록에 추가했다.
- `activeTab` 설명을 "current tab after invoke"로 구체화했다.
- 제한사항에서 Chrome Web Store restricted page와 privileged browser-native screenshot API 문구를 더 명확히 했다.

## 검증 결과

실행 명령:

```bash
git diff -- README.md
rg -n "activeTab|scripting|clipboardWrite|downloads|debugger|<all_urls>|host_permissions" README.md manifest.json
rg -n "Chrome Web Store|published|available|install from|Mozilla|Firefox|official|endorsed|sponsored|affiliated" README.md
rg -n "server|telemetry|local|privacy|permission|limitation|license|MPL|NOTICE|THIRD_PARTY" README.md
git diff --check
```

결과:

- OK: README diff는 Stage 1 초안의 문구 보정 범위로 제한됐다.
- OK: 권한 grep에서 README 권한 표와 `manifest.json` 권한 목록이 일치했다.
- OK: README는 `debugger`, `<all_urls>`, `host_permissions`를 요청하지 않는다고 명시하거나 해당 권한이 없음을 확인하는 문맥만 포함한다.
- OK: Chrome Web Store 관련 문구는 "release preparation", "not listed yet", restricted page limitation 문맥으로만 확인됐다.
- OK: Mozilla/Firefox 관련 문구는 `src/firefox-derived/`, attribution/license, "not affiliated with, endorsed by, or sponsored by" disclaimer 문맥으로만 확인됐다.
- OK: privacy/license grep에서 local processing, no server upload, no telemetry, permission, license, MPL, `NOTICE`, `THIRD_PARTY.md` 문맥이 확인됐다.
- OK: `git diff --check`가 경고 없이 통과했다.

## 잔여 위험

- 다국어 README 파일은 아직 없다. Stage 3에서 English README를 기준으로 `README.ko.md`, `README.zh-CN.md`, `README.ja.md`를 작성하고 실제 링크를 연결해야 한다.
- README에는 아직 실제 app icon, screenshot, feature video가 없다. 이는 사용자 제공 자산을 받은 뒤 별도 branding task에서 처리한다.
- Stage 3 번역 과정에서 기능 범위나 privacy 문구가 원문과 달라질 위험이 있다. 같은 섹션 구조와 핵심 키워드 대조가 필요하다.

## 다음 단계 영향

- Stage 3은 이번 Stage 2 README를 기준 원문으로 사용한다.
- Stage 3에서 루트 README 상단의 translation placeholder를 실제 language links로 바꿔야 한다.
- Stage 3 번역은 기능 범위, 권한 설명, privacy/local processing, limitations, attribution/license 문구를 English 원문과 맞춰야 한다.

## 승인 요청

- Stage 2 산출물과 검증 결과를 승인하면 Stage 3 — 다국어 README 작성과 링크 연결로 진행한다.
