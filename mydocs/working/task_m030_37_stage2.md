# Task #37 Stage 2 보고서 - Dashboard 입력값 표 확정

GitHub Issue: [#37](https://github.com/postmelee/crop/issues/37)
구현계획서: [`task_m030_37_impl.md`](../plans/task_m030_37_impl.md)
Stage: 2

## 단계 목적

Stage 2는 Chrome Web Store Developer Dashboard에 입력할 Store Listing, Privacy practices, permission justification, Distribution 후보값을 표로 확정하는 단계다. Stage 1과 Stage 1.1에서 분리한 PR #38 downscale fallback, PR #42~#44 preview bugfix 영향, 최신 공식 문서 기준을 반영하되 실제 upload/review submit은 수행하지 않았다.

작업지시자가 English/Korean 스크린샷과 동영상을 이미 준비했다고 알려 주었으므로, Chrome Web Store locale별 asset 입력 가능 여부도 이번 단계에서 확정했다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `mydocs/tech/task_m030_37_chrome_web_store_dashboard.md` | Stage 2 Dashboard 입력값 표 추가. Store Listing 기본값, English detailed description, localized listing assets, graphic assets, privacy practices, permission justification, Distribution/submit 후보와 승인 필요 항목을 정리 |
| `PRIVACY.md` | PR #38 이후 outdated였던 browser/page limitation 문구를 downscale fallback 기준으로 최소 보정하고 `Last updated`를 2026-06-06으로 갱신 |
| `mydocs/orders/20260606.md` | #37 비고를 Stage 2 입력값 확정 후 승인 대기 상태로 갱신 |
| `mydocs/working/task_m030_37_stage2.md` | Stage 2 산출물, 검증 결과, 잔여 위험, 다음 단계 영향을 기록 |

## 본문 변경 정도 / 본문 무손실 여부

`mydocs/tech/task_m030_37_chrome_web_store_dashboard.md`는 Stage 1 재대조 노트 하단에 Stage 2 결론을 추가하는 방식으로 확장했다. #9 기술 노트의 과거 Store copy 초안은 이력으로 보존했고, #37 기술 노트에서 최신 Dashboard 입력값으로 대체했다.

`PRIVACY.md`는 전체 정책 구조와 single purpose, local processing, no server upload, no telemetry/analytics, Copy/Save 설명을 유지했다. 변경은 `Last updated`와 full-page capture limitation 단락의 낡은 `explicit size errors` 표현 제거에 한정했다.

README family, `manifest.json`, `_locales/*/messages.json`, #9/#35 보고서는 수정하지 않았다.

## 검증 결과

실행 명령:

```bash
rg -n "activeTab|scripting|clipboardWrite|downloads|debugger|<all_urls>|host_permissions" manifest.json README.md README.ko.md README.zh-CN.md README.ja.md PRIVACY.md mydocs/tech
rg -n "server|telemetry|analytics|local|privacy|clipboard|download|Mozilla|Firefox|affiliated|endorsed|sponsored" README.md README.ko.md README.zh-CN.md README.ja.md PRIVACY.md NOTICE THIRD_PARTY.md mydocs/tech
rg -n "downscale|maximum canvas|large canvas|full-page|full page|전체 페이지" README*.md PRIVACY.md mydocs/tech/task_m030_37_chrome_web_store_dashboard.md
git diff --check
```

결과:

- OK: 권한 grep에서 `manifest.json` 권한은 계속 `activeTab`, `scripting`, `clipboardWrite`, `downloads`이며, Stage 2 permission justification도 이 4개 권한만 대상으로 한다.
- OK: `debugger`, `<all_urls>`, broad `host_permissions`는 요청 권한으로 추가하지 않았고, 문서에서도 미요청 기준으로 유지했다.
- OK: privacy/branding grep에서 local processing, no server upload, no telemetry/analytics, Copy/Save 명시 action 기준이 `PRIVACY.md`와 #37 Dashboard 입력값에 유지됐다.
- OK: Mozilla/Firefox 표현은 README/NOTICE/THIRD_PARTY와 과거 기술 노트의 출처·비제휴 맥락에 남아 있으며, Stage 2 Store listing copy에는 제품명이나 제휴 암시로 사용하지 않았다.
- OK: downscale grep에서 `PRIVACY.md`와 #37 Dashboard copy가 full-page stitched output downscale fallback을 설명한다. #9 기술 노트의 old copy는 과거 이력으로 남기고 #37 최종 입력값이 이를 대체한다.
- OK: 공식 Store Listing 문서 기준으로 localized description, screenshots, promotional video는 extension locale별 입력이 가능하고 각 locale은 `_locales/LOCALE_CODE` directory와 연결된다. `crop`의 `_locales/en`과 `_locales/ko`에 대해 작업지시자가 준비한 English/Korean screenshots와 promo video를 locale별로 넣을 수 있다.
- OK: 공식 Supplying Images 문서 기준으로 screenshots는 locale-specific 가능하지만 small promotional image와 marquee promotional image는 locale-specific이 아니다. 따라서 English/Korean small promo를 각각 넣는 방식은 사용할 수 없고 global image 1개가 필요하다.
- OK: `git diff --check` 경고 없음.

참조한 공식 문서:

- Chrome Web Store Store Listing: <https://developer.chrome.com/docs/webstore/cws-dashboard-listing/>
- Chrome Web Store Supplying Images: <https://developer.chrome.com/docs/webstore/images>
- Chrome Web Store Best Practices category guide: <https://developer.chrome.com/docs/webstore/best-practices>

## 잔여 위험

- 실제 로그인된 Chrome Web Store Developer Dashboard 화면은 직접 확인하지 않았다. Dropdown label, YouTube video field의 실제 submit blocker 여부, review submit dialog의 deferred publishing 선택지는 실제 화면에서 최종 확인이 필요하다.
- Store Listing 문서는 graphic assets에 YouTube video field를 포함하지만, Supplying Images 문서는 mandatory set을 icon, small promo, screenshot으로 설명한다. 이번 단계에서는 실제 Dashboard 필수 여부를 `작업지시자 확인 필요`로 남겼다.
- English/Korean screenshots와 promo video는 locale별 입력 가능하지만, Japanese/Simplified Chinese asset 준비는 확인되지 않았다. `_locales/ja`, `_locales/zh_CN`은 global fallback 또는 후속 asset 제작 후보로 남는다.
- Small promotional image는 locale별 설정이 불가능하므로 하나의 global 440x280 image를 선택해야 한다.
- 실제 Store screenshot/video 파일 자체는 저장소에 추가하지 않았고 Dashboard upload도 수행하지 않았다.

## 다음 단계 영향

- Stage 3 package/upload checklist는 `dist` fresh build, ZIP root contents, `manifest.json` 권한/icon/locale/version, source map 포함 정책을 다시 확인해야 한다.
- Stage 3 제출 전 smoke checklist에는 #42~#44 반영분을 포함한다: full-page tiled preview scroll blank band 없음, preview modal backdrop dismiss, visible preview layout, Save/Copy stitched PNG path 유지.
- Stage 3 asset checklist에는 English/Korean localized screenshots와 localized promo video 입력, global small promotional image 1개 필요, marquee optional, Japanese/Simplified Chinese fallback 여부를 포함한다.
- 실제 upload/review submit과 deferred publishing 선택은 계속 작업지시자 승인 필요 항목으로 남긴다.

## 승인 요청

- Stage 2 산출물과 검증 결과를 승인하면 Stage 3 `Package/Upload와 제출 전 smoke checklist 확정`으로 진행한다.
