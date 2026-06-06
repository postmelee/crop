# Task #37 Chrome Web Store Dashboard 입력값 재대조 노트

GitHub Issue: [#37](https://github.com/postmelee/crop/issues/37)
마일스톤: M030
확인일: 2026-06-04 KST
추가 확인일: 2026-06-06 KST
기준 브랜치: `local/task37`
기준 커밋: `5fd786f`
최신 `devel` 병합 커밋: `ae27732`

## 조사 배경

#9는 Chrome Web Store 배포 준비 문서, `PRIVACY.md`, Store listing/privacy/permission draft, release package checklist, manifest/Store icon asset을 정리했다. #9 PR #36은 `devel`에 merge됐고, 이후 로컬 검증 중 발견된 full-page oversized canvas failure는 #35 PR #38에서 downscale fallback으로 보정되어 `devel`에 반영됐다.

이번 Stage 1의 목적은 Dashboard 입력값을 바로 확정하는 것이 아니라, 최신 공식 문서와 현재 저장소 산출물의 기준선을 다시 세우고 Stage 2에서 확정해야 할 gap을 분리하는 것이다.

## 확인 대상

공식 문서:

- Chrome Web Store Program Policies: <https://developer.chrome.com/docs/webstore/program-policies/policies>
- Prepare your extension: <https://developer.chrome.com/docs/webstore/prepare>
- Publish in the Chrome Web Store: <https://developer.chrome.com/docs/webstore/publish>
- Complete your listing information: <https://developer.chrome.com/docs/webstore/cws-dashboard-listing/>
- Fill out the privacy fields: <https://developer.chrome.com/docs/webstore/cws-dashboard-privacy/>
- Prepare to publish: set up distribution: <https://developer.chrome.com/docs/webstore/cws-dashboard-distribution>
- Provide test instructions: <https://developer.chrome.com/docs/webstore/cws-dashboard-test-instructions>
- Chrome Web Store review process: <https://developer.chrome.com/docs/webstore/review-process>
- Supplying Images: <https://developer.chrome.com/docs/webstore/images>
- Best Practices / category guidance: <https://developer.chrome.com/docs/webstore/best-practices>

저장소 산출물:

- `manifest.json`
- `README.md`, `README.ko.md`, `README.zh-CN.md`, `README.ja.md`
- `PRIVACY.md`
- `NOTICE`, `THIRD_PARTY.md`, `LICENSE-MPL-2.0`
- `mydocs/tech/task_m030_9_chrome_web_store.md`
- `mydocs/report/task_m030_9_report.md`
- `mydocs/report/task_m020_35_report.md`
- `mydocs/tech/task_m020_8_quality_matrix.md`

GitHub 상태:

- #37: open, milestone `M030 — Release Preparation`, labels `documentation`, `enhancement`
- PR #38: merged, base `devel`, head `publish/task35`, merged at `2026-06-04T06:00:34Z`
- PR #42: merged, base `devel`, head `publish/task40`, merged at `2026-06-05T08:13:57Z`
- PR #43: merged, base `devel`, head `publish/task39`, merged at `2026-06-06T08:14:56Z`
- PR #44: merged, base `devel`, head `publish/task41`, merged at `2026-06-06T08:57:00Z`

## 실제 Dashboard 확인 상태

이 Stage에서는 로그인된 Chrome Web Store Developer Dashboard 실제 화면을 직접 확인하지 않았다. 공식 문서 기준으로 항목명을 정리하되, 실제 Dashboard UI에서 필수 여부나 dropdown 값이 문서와 다르게 보이는 항목은 Stage 2에서 `작업지시자 확인 필요`로 분리한다.

현재 실제 화면 확인 필요 후보:

- Store Listing의 YouTube video field가 실제 submit blocker인지 여부
- category dropdown의 현재 값과 최종 선택 가능 label
- distribution visibility와 region 기본값
- privacy policy URL 입력 위치와 developer account page URL 상태
- upload 후 review submit dialog의 deferred publishing checkbox 상태

## 공식 문서 재대조 요약

| 영역 | 공식 기준 요약 | #37 적용 판단 |
|---|---|---|
| Program policies | metadata와 Dashboard 입력값은 최신·정확해야 하고, single purpose를 자세히 적어야 한다. user data를 다루면 privacy policy를 제공하고 Limited Use와 최소 권한 원칙을 지켜야 한다. | #9 privacy/permission draft를 유지하되, PR #38 이후 full-page limitation 문구를 갱신해야 한다. |
| Package | upload ZIP은 extension files를 포함하고 `manifest.json`이 ZIP root에 있어야 한다. | Stage 3에서 fresh zip 절차와 root contents를 재확인한다. |
| Store Listing | detailed description, primary category, item language, graphic assets를 입력한다. | Stage 2에서 English listing copy와 category를 확정한다. locale별 listing은 후속으로 분리한다. |
| Privacy fields | single purpose, permission justification, remote code 여부, data usage certification, privacy policy URL을 정리한다. | `crop`은 remote code를 쓰지 않는 방향으로 선언하고, local processing/no telemetry/no server upload 기준을 유지한다. |
| Distribution | Public/Unlisted/Private visibility와 region을 선택한다. 모든 visibility는 같은 policy review를 거친다. | 기본 후보는 Public + all regions로 보되 Stage 2에서 작업지시자 의도 확인 항목으로 둔다. |
| Test instructions | publishing 필수는 아니며, reviewer가 제한 credential이나 paid account 없이 기능을 확인하기 어렵다면 제공한다. | `crop`은 account/paid feature가 없으므로 필수 입력 후보는 아니다. 수동 smoke 절차는 Stage 3 checklist에 둔다. |
| Review | broad host permissions와 sensitive permissions는 review time을 늘릴 수 있고, `<all_urls>` 같은 broad host access는 위험하게 취급된다. | 현재 `activeTab` 기반으로 broad host permission을 피하는 점을 permission justification에 유지한다. |
| Images | Store icon, screenshot, small promo image가 핵심 준비 항목이다. screenshot은 1280x800 또는 640x400, small promo는 440x280이다. | icon은 #9 Stage 5.2에서 해소, screenshot과 small promo는 제출 전 blocker로 유지한다. |

## 2026-06-06 추가 merge 영향

Stage 1 보고 후 preview 관련 버그 수정 PR들이 `devel`에 merge됐다. `local/task37`에는 `origin/devel`을 병합해 PR #42~#44를 반영했다.

| PR | 내용 | #37 관련성 | Stage 2/3 반영 |
|---|---|---|---|
| #42 | full page preview blank band 원인 분리. 저장 PNG는 정상이고 preview rendering artifact로 분류 | 직접 관련 있음. Store copy에서 저장 PNG 결함으로 오해되지 않게 preview와 Save/Copy 결과를 분리해야 한다. | Store copy와 smoke checklist에서 preview-only 이슈였고 #44에서 해결됐다고 정리 |
| #43 | preview modal backdrop dismiss, inline padding, visible preview bottom reserve, modal center alignment 보정 | 직접 관련 있음. Store screenshot 후보나 manual smoke에서 최신 preview layout을 기준으로 삼아야 한다. | Store screenshot 제작 전 기준 UI로 기록, smoke checklist에 backdrop dismiss와 visible preview layout 확인 추가 |
| #44 | full page preview를 tiled renderer로 전환해 긴 페이지 scroll blank band 제거. Save/Copy는 stitched PNG `dataUrl` 경로 유지 | 직접 관련 있음. Full-page preview 품질 설명과 수동 smoke checklist에 반영해야 한다. | Stage 2 detailed description에는 과도한 구현 detail을 넣지 않되, Stage 3 checklist에 full page preview scroll blank band 없음과 Save/Copy stitched PNG 유지 확인 추가 |

영향 결론:

- 권한, privacy data handling, upload package 기본 정책에는 직접 변화가 없다.
- `manifest.json` 권한은 계속 `activeTab`, `scripting`, `clipboardWrite`, `downloads`다.
- Store copy는 "full-page capture preview"와 "Save/Copy output PNG"를 혼동하지 않게 작성한다.
- Store screenshot 또는 manual smoke 자료를 만들 때는 #43/#44 이후 preview modal layout과 tiled full-page preview를 최신 기준으로 사용한다.
- `mydocs/orders/20260604.md`는 최신 `devel` 병합으로 #39/#40 완료 행과 #37 진행 행을 모두 보존한 상태가 됐다.

## Category 재대조

#9 기술 노트에는 category 후보가 `Productivity 또는 Tools 계열`로 남아 있다. 공식 Best Practices 문서 기준으로 2023년 중 category 체계가 바뀌었고, 기존 Productivity는 여러 category로 분리됐다. Screenshot/image capture 관련 설명은 `Art & Design`이 이미지·사진 보기/편집/정리/공유와 screenshot capture를 포함한다고 설명한다.

Stage 2 후보:

| 후보 | 판단 |
|---|---|
| `Art & Design` | 1차 후보. screenshot capture와 image output 기능 설명에 가장 직접적으로 맞는다. |
| `Tools` | fallback 후보. `crop`을 범용 utility로 볼 때 가능하지만 공식 설명상 "다른 category에 맞지 않는 tools"라 1차 후보로는 약하다. |
| `Workflow & Planning` | 생산성 계열 후속 후보. screenshot capture 자체와 직접성이 약하다. |
| `Productivity` | 현재 category label로 직접 선택 가능하다고 가정하지 않는다. 실제 Dashboard에 남아 있는지 확인 필요. |

## PR #38 반영 필요점

PR #38은 oversized full-page capture가 계획 단계에서 실패하지 않고 stitching 단계에서 output downscale을 적용해 단일 PNG를 만들도록 보정했다. 따라서 Store copy와 privacy/limitation 문구는 다음 기준으로 맞춰야 한다.

- "large canvas가 있으면 explicit size error로 실패"가 기본 설명이면 outdated다.
- "browser canvas limit을 넘는 경우 단일 PNG 유지를 위해 자동 downscale할 수 있음"이 최신 설명이다.
- "downscale 때문에 원본 DPR 해상도보다 낮아질 수 있음"을 tradeoff로 남긴다.
- lazy loading, animation, layout shift, sticky/fixed 변화 같은 stitched capture 품질 한계는 계속 유효하다.
- 실제 oversized full-page PNG dimension smoke는 아직 수동 후보로 남아 있다.

현행 grep 결과:

| 파일 | 상태 | Stage 2 조치 |
|---|---|---|
| `README.md`, `README.ko.md`, `README.zh-CN.md`, `README.ja.md` | PR #38 기준 downscale fallback 문구 반영됨 | Store copy와 충돌하지 않는지 유지 검토 |
| `PRIVACY.md` | `explicit size errors` 표현이 남아 있음 | browser limitation 문구를 downscale fallback 기준으로 최소 보정 필요 |
| `mydocs/tech/task_m030_9_chrome_web_store.md` | Stage 2 Store detailed description 초안에 `explicit size errors` 표현이 남아 있음 | #9 문서를 덮어쓰기보다 #37 기술 노트의 최종 Dashboard copy에서 최신 문구로 대체 |
| `mydocs/tech/task_m020_8_quality_matrix.md` | P6-40 downscale fallback 기준 반영됨 | Stage 3 smoke checklist에서 참조 |
| `mydocs/report/task_m020_35_report.md` | PR #38 최종 근거 문서 | Stage 2 copy 판단 근거로 유지 |

## 권한과 privacy 기준선

현재 `manifest.json` 권한:

```json
["activeTab", "scripting", "clipboardWrite", "downloads"]
```

요청하지 않는 권한:

- `debugger`
- `<all_urls>`
- broad `host_permissions`
- `tabs`

Stage 2 permission justification 기준:

| 권한 | 현재 사용처 | Dashboard justification 방향 |
|---|---|---|
| `activeTab` | 사용자가 action icon 또는 shortcut으로 실행한 현재 tab에 overlay injection과 visible-tab capture를 수행 | user gesture 후 현재 tab에서 screenshot selection/capture를 제공하기 위한 임시 접근 |
| `scripting` | `chrome.scripting.executeScript()`로 content overlay 주입 | 사용자가 실행한 active tab에 screenshot selection overlay를 주입하기 위해 필요 |
| `clipboardWrite` | Copy action에서 generated PNG를 clipboard에 write | 사용자가 Copy를 누를 때만 generated PNG를 system clipboard에 쓰기 위해 필요 |
| `downloads` | Save action에서 generated PNG download | 사용자가 Save를 누를 때만 generated PNG를 downloaded file로 저장하기 위해 필요 |

Stage 2 privacy 기준:

- screenshot pixels, page geometry, generated PNG는 screenshot selection/capture라는 single purpose 제공을 위해 browser local context에서 처리한다.
- 서버 upload, telemetry, analytics, advertising, account, payment 기능은 없다.
- Copy/Save는 사용자의 명시 action으로 clipboard/download 위치에 image를 내보낸다.
- Limited Use statement는 `PRIVACY.md`의 현재 문구를 유지하되, limitation 문구만 PR #38 기준으로 보정한다.

## #9 산출물과 현재 gap

| 항목 | #9 상태 | 현재 판단 |
|---|---|---|
| `PRIVACY.md` | Store privacy policy 후보 작성 완료 | PR #38 반영으로 limitation 문구 1곳 보정 필요 |
| Store copy 초안 | #9 기술 노트에 English short/detailed/single purpose 초안 존재 | Stage 2에서 #37 최종 copy로 재작성하고 old large canvas 표현 제거 |
| Permission justification | 4개 권한 draft 존재 | 현재 manifest와 일치, Stage 2에서 Dashboard 입력값 표로 확정 |
| Manifest icon / Store icon | #9 Stage 5.2에서 dark icon 기반 해소 | Stage 3 package contents에서 재확인 |
| Store screenshot | 없음 | 제출 전 blocker |
| Small promotional image | 없음 | 제출 전 blocker |
| Homepage URL | GitHub repository 후보 | Stage 2에서 최종 후보로 정리, 실제 입력은 승인 필요 |
| Support URL | GitHub Issues 후보 | Stage 2에서 최종 후보로 정리, 실제 입력은 승인 필요 |
| Privacy policy URL | PR merge 후 stable GitHub URL 후보 | Stage 2에서 `devel` 기준 URL 후보 정리 |
| Source map 포함 | #9에서 포함 정책 문서화 | Stage 3 package review에서 재확인 |

## Stage 2로 넘길 결정 항목

| 항목 | Stage 1 판단 | Stage 2 작업 |
|---|---|---|
| Detailed description | #9 초안을 그대로 쓰면 PR #38 이후 outdated 문구가 남음 | downscale fallback과 제한사항을 반영해 최종 copy 작성 |
| Category | `Art & Design` 1차 후보, `Tools` fallback | 실제 Dashboard 후보값과 작업지시자 의도를 반영해 최종 선택안 작성 |
| Privacy limitation copy | `PRIVACY.md`의 explicit size error 표현 outdated | 최소 문구 보정 |
| YouTube video | listing guide는 graphic assets에 video를 포함하지만 image guide mandatory set과 차이가 있음 | 실제 Dashboard 필수 여부를 `작업지시자 확인 필요`로 분리 |
| Distribution | Public + all regions 후보 | Stage 2에서 승인 필요 항목으로 명시 |
| Test instructions | account/paid gate가 없어 필수 아님 | reviewer용 간단 smoke instruction 필요 여부 결정 |

## Stage 2 Dashboard 입력값 확정

Stage 2에서는 실제 Dashboard upload/review submit을 수행하지 않고, 작업지시자가 입력하거나 최종 승인할 값을 표로 확정한다. 실제 Dashboard 화면에서 dropdown 값이나 필수 여부가 다르면 해당 항목은 작업지시자 확인 후 조정한다.

### Store Listing - 기본 입력값

| Dashboard 항목 | 입력값 또는 후보 | 상태 | 근거/비고 |
|---|---|---|---|
| Item language | English | 확정 후보 | `manifest.json`의 `default_locale`은 `en`이다. |
| Primary category | `Art & Design` | 확정 후보 | Chrome Web Store category guide에서 screenshot capture가 `Art & Design` 설명에 직접 포함된다. `Tools`는 fallback 후보로만 둔다. |
| Short description | `Select, preview, copy, and save precise screenshots from the current page.` | 확정 후보 | 132자 제한 안. current page screenshot single purpose와 visible/full-page preview를 모두 포괄한다. |
| Homepage URL | `https://github.com/postmelee/crop` | 확정 후보 | 별도 product site가 없고 source availability와 README/NOTICE 접근성이 가장 명확하다. 실제 입력은 작업지시자 승인 필요. |
| Support URL | `https://github.com/postmelee/crop/issues` | 확정 후보 | 별도 support channel이 없으므로 public GitHub Issues를 support channel 후보로 둔다. 실제 입력은 작업지시자 승인 필요. |
| Privacy policy URL | `https://github.com/postmelee/crop/blob/devel/PRIVACY.md` | 확정 후보 | PR merge 후 `devel` 기준 stable URL 후보. release tag를 만들면 tag URL로 교체 가능하다. |
| Official URL | 미입력 | 작업지시자 확인 필요 | verified publisher/site 설정이 확인되지 않았다. |

### Store Listing - English detailed description

아래 문구를 English default listing의 detailed description 후보로 둔다.

```text
crop helps you capture precise screenshots from the page you are viewing.
Open the overlay from the extension icon or keyboard shortcut, select a page
element or draw a custom region, preview the result, then copy or save the PNG.

Main features:
- Select a visible page element by hovering and clicking.
- Draw a custom capture region.
- Move or resize the selected region before capture.
- Capture the visible viewport.
- Capture the current top-level document as a full-page screenshot by scrolling and stitching visible-tab captures.
- Capture selected page regions that extend outside the current viewport.
- Preview visible and full-page captures before copying or saving.
- Copy the generated PNG to the system clipboard or save it as a downloaded file.

Privacy:
Screenshots are processed locally in your browser. crop does not upload
screenshots or page data to a server and does not include telemetry or
analytics. The image leaves the page only when you explicitly choose Copy or
Save.

Current limits:
- Chrome blocks extension injection on restricted pages such as chrome:// pages and Chrome Web Store pages.
- Cross-origin iframe contents and closed shadow DOM internals cannot be inspected from the content script.
- Full-page capture covers the current top-level document. Very large stitched captures may be downscaled to keep the result as one PNG, and dynamic pages with lazy loading, animations, sticky layout changes, or layout shifts can produce imperfect captures.
```

판단:

- #9 detailed description의 `explicit size errors` 표현을 제거했다.
- #42~#44를 반영해 preview를 언급하되 tiled renderer 같은 내부 구현 detail은 Store copy에 넣지 않는다.
- Save/Copy 결과는 generated PNG로 설명하고 preview artifact와 output PNG를 혼동하지 않게 했다.
- Mozilla/Firefox 이름을 Store listing copy에 사용하지 않는다.

### Localized listing assets

공식 Store Listing 문서 기준, extension이 locale을 지원하면 해당 locale별 description, screenshots, promotional video를 넣을 수 있다. 각 locale은 extension ZIP 안의 `_locales/LOCALE_CODE` directory와 연결된다.

현재 `crop`이 포함하는 locale resource:

| Locale directory | Dashboard locale 의미 | 현재 asset 준비 상태 | Stage 2 판단 |
|---|---|---|---|
| `_locales/en` | English | 작업지시자가 English screenshot/video 준비 완료 | English localized screenshots와 English localized promo video 입력 가능 |
| `_locales/ko` | Korean | 작업지시자가 Korean screenshot/video 준비 완료 | Korean localized screenshots와 Korean localized promo video 입력 가능 |
| `_locales/ja` | Japanese | asset 준비 미확인 | 이번 task에서는 localized screenshot/video 입력 대상에서 제외, global fallback 또는 후속 |
| `_locales/zh_CN` | Simplified Chinese | asset 준비 미확인 | 이번 task에서는 localized screenshot/video 입력 대상에서 제외, global fallback 또는 후속 |

입력 방침:

- English locale 선택 후 English screenshots와 English YouTube promo video URL을 localized field에 넣을 수 있다.
- Korean locale 선택 후 Korean screenshots와 Korean YouTube promo video URL을 localized field에 넣을 수 있다.
- localized video와 localized screenshots가 있으면 Store listing에서 global video/screenshots보다 먼저 표시된다.
- Japanese/Simplified Chinese는 별도 localized asset이 없으므로 global screenshot/video fallback 또는 후속 localized asset 제작으로 처리한다.
- locale별 metadata는 제공 기능 집합이 크게 달라 보이면 안 되므로 English/Korean copy와 assets는 같은 기능 범위를 보여야 한다.

중요 제약:

- Screenshots와 promotional video는 locale별 설정 가능하다.
- Small promotional image와 marquee promotional image는 locale-specific이 아니다.
- 따라서 English/Korean small promo가 각각 있어도 Dashboard에는 언어별로 나누어 넣지 못한다. 하나의 global small promotional image를 골라야 하며, 다국어 대응을 위해 텍스트를 줄이거나 가장 중요한 시장 언어를 선택하는 방향이 안전하다.

### Graphic assets

| 자산 | 공식 기준 | 현재 상태 | Stage 2 판단 |
|---|---|---|---|
| Extension icon | 128x128 icon이 package에 필요 | #9 Stage 5.2에서 `public/icons/crop-128.png`와 manifest icons 해소 | Stage 3 package contents에서 재확인 |
| Store screenshot | 최소 1개, 1280x800 또는 640x400 | 작업지시자가 English/Korean 준비 완료 | locale별 screenshots로 입력 가능. 실제 upload는 제외 |
| Small promotional image | 440x280 required | 준비 상태 확인 필요 | locale별 설정 불가. 하나의 global image 필요 |
| Marquee promotional image | 1400x560 optional | 준비 상태 확인 필요 | locale별 설정 불가. optional |
| Promo video | YouTube URL field | 작업지시자가 English/Korean 준비 완료 | locale별 promo video 입력 가능. 실제 Dashboard 필수 여부는 확인 필요 |

### Privacy practices

| Dashboard/privacy 항목 | 입력값 |
|---|---|
| Single purpose | `crop provides one purpose: selecting, previewing, copying, and saving screenshots from the current page. Users invoke the extension on the active tab, choose a page element, custom region, visible viewport, or current top-level full page, and then copy or save the generated PNG.` |
| Data collection/use disclosure | `crop processes screenshot pixels, page geometry, and generated PNG data locally in the browser to provide screenshot selection and capture. It does not transmit, sell, or share this data.` |
| Remote code | No remote code. Extension logic is bundled in the submitted package. |
| Limited Use certification | `crop uses information accessed through Chrome extension APIs only to provide or improve its single purpose: selecting and capturing screenshots from the current page.` |
| Privacy policy URL | `https://github.com/postmelee/crop/blob/devel/PRIVACY.md` |
| User action disclosure | Copy writes the generated PNG to the system clipboard. Save asks Chrome to download the generated PNG file. |

### Permission justification

| Permission | Dashboard justification draft |
|---|---|
| `activeTab` | Required to access the current tab only after the user invokes crop from the extension icon or keyboard shortcut, so the extension can display the screenshot overlay and capture the active page. |
| `scripting` | Required to inject the screenshot selection overlay content script into the active tab after the user invokes the extension. |
| `clipboardWrite` | Required only when the user clicks Copy, to write the generated PNG screenshot to the system clipboard. |
| `downloads` | Required only when the user clicks Save, to save the generated PNG screenshot as a downloaded file. |

### Distribution and submit

| Dashboard 항목 | 입력값 또는 후보 | 상태 |
|---|---|---|
| Visibility | Public | 작업지시자 승인 필요 |
| Regions | All regions | 작업지시자 승인 필요 |
| Trusted testers | 미사용 | Public release 후보라 기본 미사용 |
| Test instructions | Optional. Reviewer credential이 필요 없는 extension이므로 기본 미입력, 필요 시 Stage 3 smoke checklist 요약 입력 | 작업지시자 확인 필요 |
| Deferred publishing | 실제 review submit 시 선택 | 작업지시자 확인 필요 |

## Stage 2 결론

- #37은 #9의 Store 준비 산출물을 재사용하되, PR #38 이후 large canvas/downscale 설명을 Stage 2 입력값에서 최신화했다.
- README family와 Phase 6 품질 매트릭스는 PR #38 기준으로 이미 갱신되어 있다.
- `PRIVACY.md`는 Stage 2에서 browser/page limitation 문구 중 `explicit size errors` 표현을 downscale fallback 기준으로 보정했다.
- #9 기술 노트는 선행 이력으로 유지하고, 최종 Dashboard 입력값은 새 #37 기술 노트에서 확정한다.
- English/Korean screenshots와 promo video는 locale별 입력 가능하다.
- Small promotional image와 marquee promotional image는 locale-specific이 아니므로 하나의 global asset만 선택해야 한다.
- Store icon/manifest icon은 해소됐지만 global small promotional image와 실제 upload/review submit은 제출 전 승인 필요 항목으로 남는다.
- 실제 Dashboard 화면은 아직 직접 확인하지 않았으므로, Stage 2에서는 공식 문서 기준값과 `작업지시자 확인 필요` 값을 분리했다.

## Stage 3 Package/Upload checklist

Stage 3에서는 `origin/devel` merge와 PR #42~#44 반영 이후의 현재 `local/task37` 기준으로 fresh build와 fresh ZIP을 다시 검증했다. 실제 Chrome Web Store upload, Dashboard 저장, review submit은 수행하지 않았다.

### Fresh build and ZIP command

제출 후보 ZIP은 `dist/` 내부 파일을 ZIP root로 삼아 fresh write 방식으로 생성한다. 기존 ZIP에 update하는 방식은 제거된 파일 entry가 남을 수 있으므로 사용하지 않는다.

```bash
npm run build
python3 -c 'from pathlib import Path; from zipfile import ZipFile, ZIP_DEFLATED; root=Path("dist"); z=ZipFile("/tmp/crop-0.1.0-cws.zip","w",ZIP_DEFLATED); [z.write(p,p.relative_to(root).as_posix()) for p in sorted(root.rglob("*")) if p.is_file()]; z.close()'
unzip -l /tmp/crop-0.1.0-cws.zip
```

2026-06-06 KST 검증 결과:

- `npm run build` 통과.
- `/tmp/crop-0.1.0-cws.zip` 생성 통과.
- ZIP root에 `manifest.json`이 존재한다.
- ZIP은 runtime package 13 files만 포함한다.

### ZIP contents

`unzip -l /tmp/crop-0.1.0-cws.zip` 기준 contents:

| Path | 판단 |
|---|---|
| `_locales/en/messages.json` | OK: default locale 포함 |
| `_locales/ja/messages.json` | OK: Japanese locale 포함 |
| `_locales/ko/messages.json` | OK: Korean locale 포함 |
| `_locales/zh_CN/messages.json` | OK: Simplified Chinese locale 포함 |
| `background/service-worker.js` | OK: background service worker bundle |
| `background/service-worker.js.map` | OK: source map 포함 |
| `content/inject.js` | OK: content script bundle |
| `content/inject.js.map` | OK: source map 포함 |
| `icons/crop-16.png` | OK: 16x16 RGBA PNG |
| `icons/crop-32.png` | OK: 32x32 RGBA PNG |
| `icons/crop-48.png` | OK: 48x48 RGBA PNG |
| `icons/crop-128.png` | OK: 128x128 RGBA PNG, Store icon 후보 |
| `manifest.json` | OK: ZIP root manifest |

제외 확인:

- `node_modules/` 없음.
- `mydocs/` 없음.
- repository root의 `README*`, `PRIVACY.md`, `NOTICE`, `THIRD_PARTY.md`, `LICENSE*`, `package*.json`, `vite.config.ts`, `tsconfig.json` 없음.
- public source와 privacy/source availability는 ZIP에 넣지 않고 Store URL과 public repository로 제공한다.

### `dist/manifest.json` review

| 항목 | 값 | 판단 |
|---|---|---|
| `manifest_version` | `3` | OK |
| `name` | `__MSG_extensionName__` | OK: i18n metadata |
| `version` | `0.1.0` | OK: package version |
| `default_locale` | `en` | OK: `_locales/en` 존재 |
| `description` | `__MSG_extensionDescription__` | OK: i18n metadata |
| `icons` | 16/32/48/128 | OK: package에 모두 포함 |
| `action.default_icon` | 16/32/48/128 | OK: package에 모두 포함 |
| `permissions` | `activeTab`, `scripting`, `clipboardWrite`, `downloads` | OK: Stage 2 justification과 일치 |
| `background.service_worker` | `background/service-worker.js` | OK |
| `commands.open-crop` | default `Ctrl+Shift+S`, mac `Command+Shift+S` | OK |
| `host_permissions` | 없음 | OK |
| `content_scripts` | 없음 | OK: user gesture 후 `scripting` injection |
| `debugger`, `<all_urls>`, `tabs` | 없음 | OK |

### Source map policy

현재 0.1.0 제출 후보 package는 source map을 포함한다.

판단:

- source map은 Store review와 release debugging에 도움이 된다.
- source code는 public repository로 공개할 예정이고, 현재 source map에 secret이나 credential을 포함하지 않는다.
- source map은 bundle source를 더 쉽게 읽게 하므로 package 노출면을 넓힌다.
- source map 제외가 필요하면 build policy 변경이므로 별도 승인 또는 구현계획서 갱신 후 처리한다.

### Asset and listing checklist

| 항목 | 현재 상태 | Dashboard 처리 |
|---|---|---|
| Extension icon / Store icon | `icons/crop-128.png` 포함, #9 Stage 5.2에서 해소 | Store icon field에 128x128 후보로 사용 |
| English screenshots | 작업지시자 준비 완료 | English locale의 Localized screenshots에 입력 가능 |
| Korean screenshots | 작업지시자 준비 완료 | Korean locale의 Localized screenshots에 입력 가능 |
| English promo video | 작업지시자 준비 완료 | English locale의 Localized promo video URL에 입력 가능 |
| Korean promo video | 작업지시자 준비 완료 | Korean locale의 Localized promo video URL에 입력 가능 |
| Global small promotional image | 준비 상태 확인 필요 | 440x280 PNG/JPEG 1개 필요. locale별 분기 불가 |
| Marquee promotional image | 준비 상태 확인 필요 | 1400x560 optional. locale별 분기 불가 |
| Japanese/Simplified Chinese screenshots/video | 준비 미확인 | global fallback 또는 후속 asset 제작 |
| Privacy policy URL | `https://github.com/postmelee/crop/blob/devel/PRIVACY.md` 후보 | PR merge 후 stable URL로 입력. release tag가 있으면 tag URL 후보 |
| Homepage URL | `https://github.com/postmelee/crop` 후보 | 작업지시자 승인 후 입력 |
| Support URL | `https://github.com/postmelee/crop/issues` 후보 | 작업지시자 승인 후 입력 |

### Dashboard 직접 입력 타이밍

| 시점 | 작업지시자 Dashboard 작업 | 허용/보류 |
|---|---|---|
| Stage 3 승인 전 | 실제 값 확인, field 존재 여부 확인 | 확인만 가능. 저장/제출 보류 |
| Stage 3 승인 후 | Store Listing, localized screenshots/video, Privacy, Distribution draft 입력 | 가능. 단, 실제 upload와 review submit은 보류 |
| Stage 4 최종 검증 승인 후 | ZIP upload, 최종 Dashboard 값 확인, review submit | 별도 승인 후 가능 |
| PR merge 후 | privacy policy URL을 `devel` 또는 release tag 기준 stable URL로 최종 보정 | 실제 제출 직전 확인 |

Dashboard에서 실제 확인해야 할 항목:

- YouTube video field가 실제 submit blocker인지 여부.
- `Art & Design` category label 선택 가능 여부.
- Official URL dropdown 사용 가능 여부.
- Korean locale 선택 시 Localized screenshots와 Localized promo video field 노출 여부.
- Deferred publishing checkbox 또는 publish timing option 위치.

### Reviewer smoke checklist

reviewer에게 test instructions를 제공해야 할 경우 아래 요약을 사용한다. 계정, 결제, 서버 credential이 필요 없으므로 기본은 optional이다.

```text
Load the extension, open any normal web page, click the crop toolbar icon or use the keyboard shortcut, select an element or draw a region, preview it, then use Copy or Save. Also test the visible viewport and full-page buttons. The extension does not require an account or network service.
```

### Submit 전 수동 smoke checklist

| 구분 | 체크 항목 | 상태 |
|---|---|---|
| Load | `npm run build` 후 Chrome `chrome://extensions`에서 `dist/` unpacked load | 제출 전 수동 확인 필요 |
| Launch | action icon으로 overlay 실행 | 제출 전 수동 확인 필요 |
| Shortcut | `Ctrl+Shift+S` / macOS `Command+Shift+S` shortcut 확인 | 제출 전 수동 확인 필요 |
| Element selection | hover highlight와 click selection | 제출 전 수동 확인 필요 |
| Custom region | drag custom region, move, resize | 제출 전 수동 확인 필요 |
| Visible preview | visible viewport preview가 중앙 정렬되고 하단/inline padding이 깨지지 않음 | 제출 전 수동 확인 필요 |
| Preview backdrop | preview modal 바깥 backdrop click으로 dismiss 가능 | 제출 전 수동 확인 필요 |
| Full page preview | 긴 페이지 full-page tiled preview에서 흰색/회색 blank band가 보이지 않음 | 제출 전 수동 확인 필요 |
| Copy | selected/visible/full-page PNG clipboard write | 제출 전 수동 확인 필요 |
| Save | selected/visible/full-page PNG download | 제출 전 수동 확인 필요 |
| Full page output | Save/Copy가 preview DOM이 아니라 stitched PNG `dataUrl` 경로를 사용 | 제출 전 수동 확인 필요 |
| Oversized output | browser canvas limit 초과 후보에서 단일 PNG downscale fallback 동작 | 제출 전 수동 확인 필요 |
| Selected out-of-viewport | viewport 밖 selected page rectangle stitching | 제출 전 수동 확인 필요 |
| Restricted page | `chrome://` 및 Chrome Web Store page 제한 동작 | 제출 전 수동 확인 필요 |
| iframe limit | cross-origin iframe 내부 selection 제한 | 제출 전 수동 확인 필요 |
| Policy copy | Store listing/privacy/permission copy와 실제 동작 일치 | 제출 전 수동 review 필요 |
| Package | upload zip contents review | Stage 3 자동 확인 완료, 제출 전 재확인 필요 |

## Stage 3 결론

- 현재 `dist/` build와 `/tmp/crop-0.1.0-cws.zip` fresh package는 Chrome Web Store upload 구조와 맞다.
- ZIP root에는 `manifest.json`이 있고 `_locales`, `icons`, background/content bundles, source maps만 포함된다.
- 권한은 계속 `activeTab`, `scripting`, `clipboardWrite`, `downloads`이고 `debugger`, `<all_urls>`, broad `host_permissions`는 없다.
- English/Korean localized screenshots와 localized promo video는 Dashboard draft 입력 가능 항목이다.
- global small promotional image 1개는 계속 제출 전 blocker다.
- 실제 Dashboard upload와 review submit은 Stage 4 최종 검증과 작업지시자 승인 전까지 보류한다.
