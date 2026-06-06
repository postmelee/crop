# Task #37 최종 보고서 - Chrome Web Store Dashboard 입력값과 제출 체크리스트

GitHub Issue: [#37](https://github.com/postmelee/crop/issues/37)
마일스톤: M030

## 작업 요약

- 대상 이슈: #37
- 마일스톤: M030
- 단계 수: 4개 Stage + Stage 1.1 최신 `devel` 반영
- 작업 목적: Chrome Web Store Developer Dashboard에 입력할 Store Listing, Privacy, 권한 justification, package/upload, localized asset, 제출 전 smoke checklist를 최신 bugfix PR 반영 상태로 확정한다.

## 변경 파일 목록과 영향 범위

| 경로 | 변경 요약 | 영향 범위 |
|---|---|---|
| `PRIVACY.md` | full-page capture limitation의 outdated `explicit size errors` 표현을 downscale fallback 기준으로 보정 | Store privacy policy 후보 |
| `mydocs/tech/task_m030_37_chrome_web_store_dashboard.md` | 공식 문서 재대조, PR #42~#44 영향, Dashboard 입력값, package checklist, Dashboard 직접 입력 가이드 작성 | Chrome Web Store 제출 운영 진실 원천 |
| `mydocs/working/task_m030_37_stage1.md` | Stage 1 공식 문서/현행 산출물 재대조 보고 | 단계 기록 |
| `mydocs/working/task_m030_37_stage2.md` | Store Listing/Privacy/Permission/Distribution 입력값 확정 보고 | 단계 기록 |
| `mydocs/working/task_m030_37_stage3.md` | package/upload와 smoke checklist 확정 보고 | 단계 기록 |
| `mydocs/working/task_m030_37_stage4.md` | 통합 검증과 최종 보고 단계 기록 | 단계 기록 |
| `mydocs/orders/20260604.md`, `mydocs/orders/20260606.md` | #37 진행/완료 상태 기록 | 오늘할일 보드 |
| `mydocs/report/task_m030_37_report.md` | 최종 보고서 작성 | PR 전 최종 결과 기록 |

## 문서 위치 검증

| 파일 | 계획된 위치 | 실제 위치 | 결과 | 근거 |
|---|---|---|---|---|
| Dashboard 입력값/체크리스트 | `mydocs/tech/` | `mydocs/tech/task_m030_37_chrome_web_store_dashboard.md` | OK | 제출 운영 산출물이므로 #9 Store 준비 노트와 같은 tech 위치 |
| Privacy policy | 저장소 루트 | `PRIVACY.md` | OK | #9에서 Store privacy policy URL 후보로 승인된 기존 위치 |
| 단계 보고서 | `mydocs/working/` | `mydocs/working/task_m030_37_stage*.md` | OK | 하이퍼-워터폴 단계 보고서 위치 |
| 최종 보고서 | `mydocs/report/` | `mydocs/report/task_m030_37_report.md` | OK | 최종 보고서 위치 |

## Dashboard 직접 입력 가이드

이 절차는 작업지시자가 현재 Chrome Web Store Developer Dashboard에서 직접 따라 하기 위한 최종 가이드다. 실제 `Submit for review`는 PR merge 후 stable privacy URL, global small promo, 제출 직전 smoke, deferred publishing 선택까지 확인한 뒤 진행한다.

### 1. 새 항목과 package upload

| 화면/field | 입력/확인값 |
|---|---|
| 항목 목록 | `+ 새 항목` 클릭 |
| Upload ZIP | `/tmp/crop-0.1.0-cws.zip` |
| Expected name | `crop` |
| Expected version | `0.1.0` |
| Expected permissions | `activeTab`, `scripting`, `clipboardWrite`, `downloads` |
| 중단 기준 | Dashboard가 `debugger`, `<all_urls>`, broad `host_permissions`, `tabs`를 표시하면 제출 중단 |

### 2. Store Listing - English

| Dashboard field | 입력값 |
|---|---|
| Language dropdown | English |
| Item language | English |
| Category | `Art & Design` |
| Fallback category | `Tools` only if `Art & Design` cannot be selected |
| Short description | `Select, preview, copy, and save precise screenshots from the current page.` |
| Homepage URL | `https://github.com/postmelee/crop` |
| Support URL | `https://github.com/postmelee/crop/issues` |
| Privacy policy URL | PR merge 후 `https://github.com/postmelee/crop/blob/devel/PRIVACY.md` 또는 release tag URL |
| Official URL | verified publisher/site 선택지가 없으면 미입력 |

Detailed description:

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

### 3. Store Listing - Korean localized fields

| Dashboard field | 입력값 |
|---|---|
| Language dropdown | Korean |
| Localized screenshots | 작업지시자가 준비한 Korean screenshots |
| Localized promo video | 작업지시자가 준비한 Korean YouTube video URL |
| Localized detailed description | Dashboard가 요구하거나 Korean listing을 완성하려면 아래 draft 사용 |

Korean detailed description draft:

```text
crop은 보고 있는 페이지에서 정확한 스크린샷을 선택하고 캡처할 수 있게 돕습니다.
확장 아이콘 또는 키보드 단축키로 오버레이를 열고, 페이지 요소를 선택하거나
직접 영역을 그린 뒤 결과를 미리 보고 PNG로 복사하거나 저장하세요.

주요 기능:
- 마우스로 페이지 요소를 가리키고 클릭해서 선택합니다.
- 직접 캡처 영역을 그립니다.
- 캡처 전 선택 영역을 이동하거나 크기를 조절합니다.
- 현재 보이는 뷰포트를 캡처합니다.
- 보이는 탭 캡처를 스크롤하며 이어 붙여 현재 최상위 문서를 전체 페이지 스크린샷으로 캡처합니다.
- 현재 뷰포트 밖으로 이어지는 선택 영역도 캡처합니다.
- 보이는 영역과 전체 페이지 캡처를 복사하거나 저장하기 전에 미리 봅니다.
- 생성된 PNG를 시스템 클립보드에 복사하거나 다운로드 파일로 저장합니다.

개인정보:
스크린샷은 브라우저 안에서 로컬 처리됩니다. crop은 스크린샷이나
페이지 데이터를 서버로 업로드하지 않으며 telemetry나 analytics를 포함하지
않습니다. 이미지는 사용자가 명시적으로 Copy 또는 Save를 선택할 때만
페이지 밖으로 나갑니다.

현재 제한:
- Chrome은 chrome:// 페이지와 Chrome Web Store 페이지 같은 제한된 페이지에서 확장 주입을 차단합니다.
- content script는 cross-origin iframe 내부와 closed shadow DOM 내부를 검사할 수 없습니다.
- 전체 페이지 캡처는 현재 최상위 문서를 대상으로 합니다. 매우 큰 stitched capture는 단일 PNG 유지를 위해 축소될 수 있고, lazy loading, animation, sticky layout 변화, layout shift가 있는 동적 페이지에서는 결과가 불완전할 수 있습니다.
```

### 4. Graphic assets

| Asset | 입력/처리 |
|---|---|
| Store icon | `public/icons/crop-128.png` 또는 ZIP의 `icons/crop-128.png` 기준 |
| English screenshots | 준비된 English screenshots, 1280x800 또는 640x400 |
| Korean screenshots | 준비된 Korean screenshots, 1280x800 또는 640x400 |
| English promo video | 준비된 English YouTube URL |
| Korean promo video | 준비된 Korean YouTube URL |
| Small promotional image | 440x280 PNG/JPEG global image 1개. locale별 설정 불가 |
| Marquee promotional image | 1400x560 optional global image. locale별 설정 불가 |

### 5. Privacy

| Dashboard/privacy field | 입력값 |
|---|---|
| Single purpose | `crop provides one purpose: selecting, previewing, copying, and saving screenshots from the current page. Users invoke the extension on the active tab, choose a page element, custom region, visible viewport, or current top-level full page, and then copy or save the generated PNG.` |
| User data collection | No user data is collected or transmitted off-device. If a description field is shown, use the data handling text below. |
| Data handling text | `crop processes screenshot pixels, page geometry, and generated PNG data locally in the browser to provide screenshot selection and capture. It does not transmit, sell, or share this data.` |
| Remote code | No. Extension logic is bundled in the submitted package. |
| Limited Use | `crop uses information accessed through Chrome extension APIs only to provide or improve its single purpose: selecting and capturing screenshots from the current page.` |

Permission justification:

| Permission | 입력값 |
|---|---|
| `activeTab` | `Required to access the current tab only after the user invokes crop from the extension icon or keyboard shortcut, so the extension can display the screenshot overlay and capture the active page.` |
| `scripting` | `Required to inject the screenshot selection overlay content script into the active tab after the user invokes the extension.` |
| `clipboardWrite` | `Required only when the user clicks Copy, to write the generated PNG screenshot to the system clipboard.` |
| `downloads` | `Required only when the user clicks Save, to save the generated PNG screenshot as a downloaded file.` |

### 6. Distribution and submit

| Dashboard field | 후보값 |
|---|---|
| Visibility | Public |
| Regions | All regions |
| Trusted testers | 미사용 |
| Payments / in-app purchases | None / No |
| Test instructions | 기본 미입력. 필수 field면 아래 reviewer smoke text 입력 |
| Deferred publishing | option이 있으면 `Publish manually after review` 또는 deferred publishing ON 권장. 실제 선택은 submit 직전 확인 |

Reviewer smoke text:

```text
Load the extension, open any normal web page, click the crop toolbar icon or use the keyboard shortcut, select an element or draw a region, preview it, then use Copy or Save. Also test the visible viewport and full-page buttons. The extension does not require an account or network service.
```

### 7. Submit 전 중단 기준

- PR merge 전이라 privacy policy URL이 최신 `PRIVACY.md`를 가리키지 않는다.
- global small promotional image 440x280이 준비되지 않았다.
- Dashboard가 예상 밖 권한을 표시한다.
- Store listing copy에 Mozilla/Firefox/Screenshots 브랜드나 제휴 암시가 들어갔다.
- English/Korean screenshots/video가 서로 다른 기능 범위를 암시한다.
- 제출 직전 full-page preview/Save/Copy smoke를 아직 확인하지 않았다.
- deferred publishing / automatic publishing 선택을 아직 결정하지 않았다.

## 검증 결과

| 수용 기준 | 결과 |
|---|---|
| Dashboard 입력값 표가 Store Listing, Privacy practices, Distribution, Package/Upload, Review submit 전 확인 항목을 포함한다 | OK |
| 입력값은 #9 Store copy/privacy policy/permission draft와 충돌하지 않는다 | OK |
| PR #38 이후 full-page downscale fallback 설명이 Store copy/privacy/checklist에 반영된다 | OK |
| `activeTab`, `scripting`, `clipboardWrite`, `downloads` 권한 justification이 현재 manifest와 실제 사용처에 맞다 | OK |
| `debugger`, `<all_urls>`, broad `host_permissions`를 요구하거나 암시하지 않는다 | OK |
| privacy disclosure는 local processing, no server upload, no telemetry/analytics, explicit Copy/Save behavior를 유지한다 | OK |
| PR merge 후 사용할 privacy policy URL 후보가 `devel` 기준 stable URL로 정리된다 | OK |
| Store screenshot, small promotional image, optional marquee/video, localized listing은 필수/선택/후속 항목으로 분리된다 | OK |
| 실제 upload/review submit은 수행하지 않고, 작업지시자 승인 필요 항목으로 남긴다 | OK |

### 단계별 검증 결과

- Stage 1: [task_m030_37_stage1.md](../working/task_m030_37_stage1.md) — 공식 문서와 현행 산출물 재대조, PR #38 downscale gap, 권한/privacy 기준선 분리.
- Stage 1.1: 최신 `origin/devel` merge 후 PR #42~#44 preview bugfix 영향 보정.
- Stage 2: [task_m030_37_stage2.md](../working/task_m030_37_stage2.md) — Dashboard 입력값 표, localized screenshots/video 가능 여부, `PRIVACY.md` limitation 보정.
- Stage 3: [task_m030_37_stage3.md](../working/task_m030_37_stage3.md) — fresh build/ZIP, package contents, manifest review, smoke checklist 확정.
- Stage 4: [task_m030_37_stage4.md](../working/task_m030_37_stage4.md) — build/typecheck/test, package, grep 통합 검증과 Dashboard 직접 입력 가이드 작성.

### 최종 통합 검증

| 주제 | 검증 방법 | 결과 |
|---|---|---|
| Production build | `npm run build` | OK |
| TypeScript 정합성 | `npm run typecheck` | OK |
| 전체 테스트 | `npm test` | OK: 17 files, 213 tests passed |
| Package contents | fresh write zip + `unzip -l` | OK: 13 files, root `manifest.json`, total 436,898 bytes |
| Manifest 권한 | `sed -n '1,240p' dist/manifest.json`, 권한 grep | OK: 4개 권한만 포함 |
| Privacy/branding 문맥 | privacy/branding grep | OK: no server/no telemetry/local processing 유지, Mozilla/Firefox는 attribution/non-affiliation 문맥 |
| Downscale/upload 문맥 | downscale/upload grep | OK: PR #38 fallback, asset blocker, submit 보류, 입력 가이드 반영 |
| Diff 상태 | `git diff --check`, `git status --short` | OK: whitespace 경고 없음, status는 Stage 4 산출 파일 변경만 표시 |

## 잔여 위험과 후속 작업

### 잔여 위험

- 실제 Chrome Web Store Developer Dashboard upload, 저장, review submit은 수행하지 않았다.
- Dashboard 실제 UI의 YouTube video 필수 여부, Official URL dropdown, deferred publishing option은 실제 화면에서 확인해야 한다.
- global small promotional image 440x280 1개는 계속 제출 전 blocker다.
- English/Korean screenshots와 promo video는 작업지시자가 준비했지만, 파일 품질과 YouTube URL 자체는 저장소에서 검증하지 않았다.
- privacy policy URL은 PR merge 후 `devel` 또는 release tag 기준 stable URL로 최종 확인해야 한다.

### 후속 작업 후보

- Stage 4 승인 후 `publish/task37` 브랜치 게시와 `devel` 대상 PR 생성.
- PR merge 후 Chrome Web Store Dashboard에서 privacy policy URL을 stable URL로 최종 입력.
- global small promotional image 440x280 제작/선택.
- 제출 직전 Chrome unpacked extension smoke: action/shortcut, selected/visible/full-page Copy/Save, full-page tiled preview blank band, downscale fallback, restricted page 제한 확인.
- Japanese/Simplified Chinese Store localized screenshots/video 또는 localized description 제작.

## 작업지시자 승인 요청

- 최종 보고서와 수용 기준 검증 결과를 승인하면 `publish/task37` 브랜치를 게시하고 `devel` 대상 PR을 생성한다.
