# Task #9 Chrome Web Store 배포 준비 노트

GitHub Issue: [#9](https://github.com/postmelee/crop/issues/9)
마일스톤: M030
확인일: 2026-06-04 KST
기준 브랜치: `local/task9`
기준 커밋: `22d1f00`

## 조사 배경

`crop`은 Chrome MV3 확장 `0.1.0`으로 Chrome Web Store 배포 준비 단계에 있다. 이 문서는 Store 제출 전 필요한 공식 요구사항과 현재 저장소 산출물을 매핑하고, Stage 2~4에서 작성할 privacy policy, Store copy, 권한 설명, release package checklist의 입력값을 고정한다.

Stage 1 범위는 정책·현행 산출물·gap 매핑이다. 최종 Store listing 문구, privacy policy 전문, release zip 생성 절차의 확정은 Stage 2~3에서 수행한다.

## 조사 질문

- Chrome Web Store 제출 전 어떤 Dashboard 항목과 패키지 산출물을 준비해야 하는가?
- 현재 `crop`의 manifest, README, locale, license/source notice, asset 상태는 요구사항과 어떻게 맞물리는가?
- 어떤 항목이 Stage 2~4의 작성 대상이고, 어떤 항목이 실제 제출 전 blocker인가?
- 현재 권한 목록은 single purpose와 최소 권한 원칙에 맞게 설명 가능한가?

## 조사 대상

공식 문서:

- Chrome Web Store Program Policies: <https://developer.chrome.com/docs/webstore/program-policies/policies>
- Prepare your extension: <https://developer.chrome.com/docs/webstore/prepare>
- Publish in the Chrome Web Store: <https://developer.chrome.com/docs/webstore/publish>
- Complete your listing information: <https://developer.chrome.com/docs/webstore/cws-dashboard-listing/>
- Fill out the privacy fields: <https://developer.chrome.com/docs/webstore/cws-dashboard-privacy/>
- Supplying Images: <https://developer.chrome.com/docs/webstore/images>
- Permissions list: <https://developer.chrome.com/docs/extensions/reference/permissions-list>
- The `activeTab` permission: <https://developer.chrome.com/docs/extensions/activeTab>
- `chrome.scripting` API: <https://developer.chrome.com/docs/extensions/reference/scripting/>
- `chrome.tabs` API: <https://developer.chrome.com/docs/extensions/reference/tabs>
- `chrome.downloads` API: <https://developer.chrome.com/docs/extensions/reference/api/downloads>

저장소 산출물:

- `manifest.json`
- `package.json`
- `vite.config.ts`
- `README.md`, `README.ko.md`, `README.zh-CN.md`, `README.ja.md`
- `_locales/en/messages.json`, `_locales/ko/messages.json`, `_locales/ja/messages.json`, `_locales/zh_CN/messages.json`
- `NOTICE`, `THIRD_PARTY.md`, `LICENSE`, `LICENSE-MPL-2.0`
- `src/background/service-worker.ts`, `src/shared/clipboard.ts`, `src/content/overlay/crop-overlay.ts`
- `tests/manifest.test.ts`, `tests/content/overlay/phase6-regression.test.ts`, `tests/shared/i18n.test.ts`

## 공식 요구사항 요약

| 영역 | 공식 문서 기준 | `crop` 적용 판단 |
|---|---|---|
| 제출 패키지 | extension files를 ZIP으로 제출하고 `manifest.json`은 ZIP root에 있어야 한다. | Stage 3에서 `dist/` 내부를 root로 압축하는 절차를 확정한다. |
| Manifest metadata | `name`, `version`, `icons`, `description`을 업로드 전 점검해야 하며 manifest metadata는 Dashboard에서 직접 수정할 수 없다. | `name`/`description`은 `__MSG_*__`, `version`은 `0.1.0`; `icons`는 없음. |
| Store listing | 상세 설명, category, item language, graphic assets, optional URLs를 Dashboard Store Listing tab에 입력한다. | Stage 2에서 listing copy 초안 작성. category와 official/home/support URL은 제출 전 결정 필요. |
| Privacy tab | single purpose와 user data handling을 Privacy tab에서 선언한다. data use disclosure와 privacy policy URL이 필요하다. | Stage 2에서 `PRIVACY.md`와 Dashboard privacy fields 초안을 작성한다. |
| Privacy policy | user data를 다루면 privacy policy가 정확하고 최신이어야 하며, collection/use/sharing을 포괄해야 한다. | screenshot/page data가 capture 대상이므로 privacy policy를 두는 방향이 안전하다. |
| Limited Use | data use는 공개한 single purpose 제공 또는 개선 범위로 제한해야 한다. | `crop`은 서버 전송/telemetry가 없으므로 no transfer/local processing을 명확히 적는다. |
| 최소 권한 | 구현된 기능에 필요한 가장 좁은 권한만 요청해야 하며 future-proof 권한은 피해야 한다. | 현재 권한은 `activeTab`, `scripting`, `clipboardWrite`, `downloads`; broad host/debugger 없음. |
| Single purpose | 좁고 이해하기 쉬운 단일 목적이 필요하며 Privacy tab single purpose field에 상세히 적어야 한다. | "현재 페이지 스크린샷 영역 선택과 캡처"로 정리한다. |
| Listing 정확성 | description, category, developer name, title, icon, screenshots, promotional images, privacy fields가 정확해야 한다. | README와 구현을 기준으로 기능/제한사항을 과장 없이 반영한다. |
| Listing 자산 | description이 비어 있거나 icon/screenshot이 없으면 reject될 수 있다. | 현재 이미지 파일과 manifest icon이 없으므로 asset blocker가 있다. |
| 이미지 자산 | mandatory 항목은 extension icon, small promo image, screenshot으로 정리된다. icon은 128x128 PNG, small promo는 440x280, screenshot은 1280x800 또는 640x400. | 별도 asset task 또는 제출 전 승인 단계 필요. |
| Localized listing | `_locales/LOCALE_CODE`에 맞춰 localized description, screenshots, promo video를 입력할 수 있고 locale 간 기능 설명은 일관되어야 한다. | source locale은 `en`, `ko`, `ja`, `zh_CN`; Stage 2 copy는 최소 English를 만들고 locale 확장은 후속 후보로 둔다. |
| MV3 remote code | MV3 extension 기능은 제출 코드에서 식별 가능해야 하고, 원격 코드 실행은 제한된다. | 현재 source grep에서 remote logic fetch/eval은 없음. Firefox source reference URL은 문서/고지 링크다. |
| Code readability | minification은 허용되지만 기능 은폐/난독화는 금지된다. | Vite bundle과 source map 포함 정책은 Stage 3에서 검토한다. |
| Developer account | publishing/update 전 Google account 2-step verification이 필요하다. | 작업지시자 계정 상태 확인은 실제 제출 승인 단계 항목으로 둔다. |

## 현재 프로젝트 스냅샷

| 항목 | 현재 상태 | 근거 |
|---|---|---|
| 확장명 | `crop` | `README.md`, `_locales/en/messages.json`, `manifest.json` |
| 버전 | `0.1.0` | `manifest.json`, `package.json` |
| Manifest version | MV3 | `manifest.json` |
| Manifest locale | `default_locale: en`, `__MSG_*__` metadata | `manifest.json`, `_locales/*/messages.json` |
| 지원 locale resource | `en`, `ko`, `ja`, `zh_CN` | `_locales/` |
| 권한 | `activeTab`, `scripting`, `clipboardWrite`, `downloads` | `manifest.json` |
| broad host permission | 없음 | `manifest.json`, regression test |
| `debugger` | 없음 | `manifest.json`, regression test |
| `<all_urls>` | 없음 | `manifest.json`, regression test |
| action/shortcut | action click, `Ctrl+Shift+S`, macOS `Command+Shift+S` | `manifest.json`, `src/background/service-worker.ts` |
| capture backend | `chrome.tabs.captureVisibleTab()` | `src/background/service-worker.ts` |
| content script injection | `chrome.scripting.executeScript()` | `src/background/service-worker.ts` |
| Copy | `navigator.clipboard.write()` + `ClipboardItem` | `src/shared/clipboard.ts` |
| Save | `chrome.downloads.download()` | `src/background/service-worker.ts` |
| remote logic fetch/eval | 없음 | `rg "fetch|XMLHttpRequest|sendBeacon|WebSocket|eval|new Function"` |
| image asset files | `public/icons/crop-{16,32,48,128}.png` | Stage 5.2 |
| manifest `icons` | `icons/crop-{16,32,48,128}.png` | `manifest.json` |
| public privacy policy | `PRIVACY.md` | repository root |
| license/source notice | 존재 | `LICENSE`, `LICENSE-MPL-2.0`, `NOTICE`, `THIRD_PARTY.md` |

## 기능·제한사항 매핑

Store copy에 넣을 수 있는 현재 기능:

- action icon 또는 keyboard shortcut으로 현재 tab에서 overlay 실행
- DOM element hover highlight와 click selection
- drag custom region selection
- selected region move/resize/keyboard adjustment
- visible viewport capture
- current top-level document full-page capture via visible-tab tiling/stitching
- viewport 밖 selected page rectangle capture via scrolling/stitching
- Copy to system clipboard
- Save as downloaded PNG
- same-origin 및 `srcdoc` iframe selection
- English, Korean, Japanese, Simplified Chinese extension UI resource

Store copy에 반드시 제한으로 남길 항목:

- `chrome://`, Chrome Web Store page 등 extension injection 제한 페이지에서는 overlay 실행 제한
- cross-origin iframe 내부 selection/full-page stitching 미지원
- closed shadow DOM 내부 미지원
- full-page capture는 top-level document 기준이며 cross-origin iframe document를 별도 full page로 stitch하지 않음
- lazy loading, animations, sticky/fixed layout, large canvas limits가 stitched capture 품질에 영향을 줄 수 있음
- `debugger`, browser-native privileged screenshot API, broad host access를 사용하지 않음

## 권한 매핑

| 권한 | 공식 API/정책 기준 | 현재 사용처 | Store justification 초안 방향 |
|---|---|---|---|
| `activeTab` | user gesture 후 현재 active tab에 임시 접근을 제공하며 `<all_urls>` 대안으로 사용할 수 있다. | action click 또는 shortcut 후 현재 tab에 overlay injection과 `captureVisibleTab()` 수행 | 사용자가 명시적으로 `crop`을 실행한 현재 tab에서만 screenshot overlay와 capture를 제공하기 위해 필요 |
| `scripting` | page context에 script/CSS를 inject하려면 필요하며 `activeTab`으로 임시 host permission을 받을 수 있다. | `chrome.scripting.executeScript({ files: ["content/inject.js"] })` | 현재 tab에 screenshot selection overlay content script를 주입하기 위해 필요 |
| `clipboardWrite` | web Clipboard API로 clipboard에 write/copy를 수행할 때 필요하며 warning은 clipboard 수정이다. | Copy action에서 PNG blob을 `navigator.clipboard.write()`로 기록 | 사용자가 Copy를 누를 때 생성된 PNG screenshot을 system clipboard에 쓰기 위해 필요 |
| `downloads` | `chrome.downloads` API를 사용하려면 필요하며 warning은 downloads 관리다. | Save action에서 `chrome.downloads.download()` 호출 | 사용자가 Save를 누를 때 생성된 PNG screenshot을 다운로드 파일로 저장하기 위해 필요 |

요청하지 않는 권한:

- `debugger`: privileged/debugger capture가 아니므로 제외 유지
- `<all_urls>` 또는 broad `host_permissions`: `activeTab` user gesture model을 사용하므로 제외 유지
- `tabs`: 현재 manifest에는 없음. `activeTab`과 event tab context, `captureVisibleTab()`으로 충분한지 Stage 4까지 회귀 확인

## Privacy/Data 매핑

| 데이터/동작 | 현재 처리 | Stage 2 작성 필요 |
|---|---|---|
| page screenshot pixels | browser local capture/crop/stitch 처리 | collection/use/share 설명. 서버 전송 없음 명시 |
| page DOM geometry/selection | content script 안에서 overlay selection 계산에 사용 | 캡처 기능 제공 목적에 한정됨을 설명 |
| clipboard | 사용자가 Copy를 누를 때 PNG write | explicit user action으로 clipboard에 쓰인다고 설명 |
| downloads | 사용자가 Save를 누를 때 PNG download | explicit user action으로 file download를 시작한다고 설명 |
| telemetry/analytics | 없음 | no telemetry/no analytics 명시 |
| remote server transfer | 없음 | no upload/no third-party transfer 명시 |
| account/payment | 없음 | not collected/not used 명시 |

Privacy policy에 넣을 문장 방향:

- `crop` processes screenshots locally in the browser.
- `crop` does not upload screenshots or page data to a server.
- `crop` does not include telemetry or analytics.
- The image leaves the page only when the user explicitly chooses Copy or Save.
- Data use is limited to the extension's single purpose: selecting and capturing screenshots on the current page.

## Listing/Localization 매핑

| 항목 | 현재 상태 | Stage 2 이후 입력 |
|---|---|---|
| Short description | manifest locale description 있음: "Capture visible elements on the current page." | Store short/detailed copy와 기능 범위 일치 필요. full-page support 반영 여부 검토 |
| Detailed description | README English 있음 | Stage 2에서 Store용 English detailed description 작성 |
| Category | 미정 | 실제 Dashboard 제출 전 선택 필요. 후보: Productivity 또는 Tools 계열 검토 |
| Item language | source default `en` | English 기본 |
| Localized detailed description | README ko/zh-CN/ja와 `_locales` 있음 | 이번 task에서는 English copy를 먼저 확정하고, localized Store copy는 후속 후보로 기록 가능 |
| Localized screenshots/video | 없음 | asset blocker/후속 작업 |
| Homepage URL | 미정 | GitHub repo 또는 별도 site 선택 필요 |
| Support URL | 미정 | GitHub issues/discussions 또는 별도 support URL 선택 필요 |
| Privacy policy URL | 없음 | Stage 2 `PRIVACY.md`, PR merge 후 GitHub URL 후보 |

## Stage 2 Store copy 초안

Stage 2에서 작성한 copy는 English Store listing과 Developer Dashboard 입력의 초안이다. 실제 Dashboard 입력, localized listing 작성, review submit은 별도 승인 단계에서 수행한다.

### Short description

```text
Select, copy, and save precise screenshots from the current page.
```

판단:

- 132자 제한 안에 들어간다.
- current page screenshot selection/capture single purpose와 일치한다.
- full-page capture를 별도 목적처럼 보이게 하지 않는다.

### Detailed description

```text
crop lets you capture precise screenshots from the page you are viewing.
Open the overlay from the extension icon or keyboard shortcut, select a page
element or draw a custom region, then copy or save the resulting PNG.

Main features:
- Select a visible page element by hovering and clicking.
- Draw a custom capture region.
- Move or resize the selected region before capture.
- Capture the visible viewport.
- Capture the current top-level document as a full-page PNG by scrolling and stitching visible-tab captures.
- Capture selected page regions that extend outside the current viewport.
- Copy the generated PNG to the system clipboard or save it as a downloaded file.

Privacy:
Screenshots are processed locally in your browser. crop does not upload
screenshots or page data to a server and does not include telemetry or
analytics. The image leaves the page only when you explicitly choose Copy or
Save.

Current limits:
- Chrome blocks extension injection on restricted pages such as chrome:// pages and Chrome Web Store pages.
- Cross-origin iframe contents and closed shadow DOM internals cannot be inspected from the content script.
- Full-page capture covers the current top-level document. Dynamic pages with lazy loading, animations, sticky layout changes, or large canvas dimensions can produce imperfect captures or explicit size errors.
```

판단:

- 첫 문장에서 기능을 직접 설명한다.
- 권한과 privacy disclosure가 Store listing에서도 드러난다.
- Mozilla/Firefox를 Store listing copy에서 언급하지 않는다.
- keyword spam을 피하기 위해 불필요한 반복 keyword 목록을 넣지 않는다.

### Single purpose statement

```text
crop provides one purpose: selecting and capturing screenshots from the current page. Users invoke the extension on the active tab, choose a page element, custom region, visible viewport, or current top-level full page, and then copy or save the generated PNG.
```

판단:

- "current page screenshot selection and capture" 범위로 좁다.
- visible/full-page/custom region은 같은 single purpose 안의 capture modes로 설명한다.
- background browsing collection, analytics, account, server feature를 암시하지 않는다.

### Permission justification

| Permission | Dashboard justification draft |
|---|---|
| `activeTab` | Required to access the current tab only after the user invokes crop from the extension icon or keyboard shortcut, so the extension can display the screenshot overlay and capture the active page. |
| `scripting` | Required to inject the screenshot selection overlay content script into the active tab after the user invokes the extension. |
| `clipboardWrite` | Required only when the user clicks Copy, to write the generated PNG screenshot to the system clipboard. |
| `downloads` | Required only when the user clicks Save, to save the generated PNG screenshot as a downloaded file. |

### Privacy fields draft

| Dashboard/privacy 항목 | 입력 초안 |
|---|---|
| Privacy policy URL | PR merge 후 `https://github.com/postmelee/crop/blob/devel/PRIVACY.md` 또는 release branch의 stable URL 후보 |
| Data collection disclosure | `crop` processes screenshot pixels, page geometry, and generated PNG data locally in the browser to provide screenshot selection and capture. It does not transmit, sell, or share this data. |
| Limited use certification | `crop` uses information accessed through Chrome extension APIs only to provide or improve its single purpose: selecting and capturing screenshots from the current page. |
| Remote transfer | 없음. server upload, telemetry, analytics, advertising, account, payment 기능 없음 |
| User action disclosure | Copy writes the generated PNG to the system clipboard. Save asks Chrome to download the generated PNG file. |

### Category와 URL 후보

| 항목 | 후보 | 판단 |
|---|---|---|
| Category | Productivity 또는 Tools 계열 | 실제 Dashboard category 목록을 제출 단계에서 확인 후 선택 |
| Homepage URL | `https://github.com/postmelee/crop` | 현재 별도 product site가 없으므로 repository가 가장 정확한 공개 entrypoint |
| Support URL | `https://github.com/postmelee/crop/issues` | 별도 support site가 없으므로 GitHub Issues가 현실적인 후보 |
| Official URL | 미정 | verified publisher/site 상태가 필요하므로 제출 승인 단계에서 확인 |

### Localization scope

- 이번 task에서는 English Store copy를 기준 초안으로 확정한다.
- `_locales/en`, `_locales/ko`, `_locales/ja`, `_locales/zh_CN`와 README family가 있으므로 localized listing은 가능하다.
- localized Store detailed description과 localized screenshots는 asset/copy 범위가 커지므로 후속 후보로 둔다.

## Asset inventory

| 자산 | 공식 기준 | 현재 상태 | 판단 |
|---|---|---|---|
| Manifest icon | prepare guide에서 `icons` 점검 대상 | `manifest.json`에 `icons`와 `action.default_icon` 정의. 사용자 제공 dark icon 기반 `public/icons/crop-{16,32,48,128}.png` 존재 | Stage 5.2에서 해소 상태 유지 |
| Store icon | 128x128 PNG, extension ZIP에 포함 | 사용자 제공 dark icon 기반 `public/icons/crop-128.png` 존재, build 후 `dist/icons/crop-128.png` 포함 | Stage 5.2에서 해소 상태 유지 |
| Screenshot | 최소 1개, 1280x800 또는 640x400 | 이미지 파일 없음 | 제출 전 blocker |
| Small promo image | 440x280 PNG/JPEG | 이미지 파일 없음 | 제출 전 blocker |
| Marquee promo image | 1400x560 optional | 이미지 파일 없음 | optional 후속 |
| Promo video | listing tab의 입력 대상. images guide 기준 mandatory에는 포함되지 않음 | 없음 | Dashboard 실제 필수 여부 제출 전 확인. 현재 blocker로 단정하지 않음 |
| Localized screenshots | locale별 제공 가능 | 없음 | 후속 후보 |

문서 간 주의점:

- Store listing guide는 graphic assets 섹션에 YouTube video field를 함께 설명한다.
- Supplying Images guide는 mandatory image를 extension icon, small promotional image, screenshot으로 정리한다.
- 따라서 Stage 1에서는 video를 "Dashboard 입력 확인 항목"으로 두고, 실제 제출 blocker 판정은 Dashboard 확인 또는 Stage 4 최종 검토에서 확정한다.

## Stage 3 Release package checklist

현재 build 설정과 검증 결과:

- `npm run build`는 `dist/manifest.json`, `dist/background/service-worker.js`, `dist/content/inject.js`, source maps, `_locales/*/messages.json`를 생성한다.
- `vite.config.ts`의 `build.sourcemap`은 `true`다.
- `dist/`는 git ignore 대상이다.
- 2026-06-04 KST Stage 3 검증에서 `npm run build`가 통과했다.
- Stage 3 당시 `/tmp/crop-0.1.0-cws.zip`는 `dist/` 내부를 ZIP root로 압축해 생성했다.
- Stage 5.1 이후 최신 zip은 fresh write 방식으로 재생성한다. 기존 zip update 방식은 제거된 file entry를 보존할 수 있으므로 사용하지 않는다.

Chrome Web Store upload zip 생성 절차:

```bash
npm run build
python3 -c 'from pathlib import Path; from zipfile import ZipFile, ZIP_DEFLATED; root=Path("dist"); z=ZipFile("/tmp/crop-0.1.0-cws.zip","w",ZIP_DEFLATED); [z.write(p,p.relative_to(root).as_posix()) for p in sorted(root.rglob("*")) if p.is_file()]; z.close()'
unzip -l /tmp/crop-0.1.0-cws.zip
```

확인된 zip root contents:

| Path | 판단 |
|---|---|
| `manifest.json` | OK: zip root에 존재 |
| `background/service-worker.js` | OK: background service worker bundle |
| `background/service-worker.js.map` | OK: source map 포함 |
| `content/inject.js` | OK: content script bundle |
| `content/inject.js.map` | OK: source map 포함 |
| `_locales/en/messages.json` | OK: default locale 포함 |
| `_locales/ko/messages.json` | OK: Korean locale 포함 |
| `_locales/ja/messages.json` | OK: Japanese locale 포함 |
| `_locales/zh_CN/messages.json` | OK: Simplified Chinese locale 포함 |

제외 확인:

- `node_modules/` 없음.
- `mydocs/` 없음.
- repository root의 `README*`, `PRIVACY.md`, `NOTICE`, `THIRD_PARTY.md`, `LICENSE*`, `package*.json`, `vite.config.ts`, `tsconfig.json` 없음.
- Store upload zip은 extension runtime package만 담는다. 사용자-facing policy/source availability는 Store listing URL과 public repository로 제공한다.

Source map 포함 정책:

- 현재 0.1.0 제출 후보 package는 source map을 포함한 상태로 문서화한다.
- 이유: source map은 Store review와 debugging에 도움이 되고, source code 자체도 public repository에서 공개될 예정이며, 현재 source map에 secret이나 credential을 포함하지 않는다.
- tradeoff: source map은 bundled source를 더 쉽게 읽게 하므로 package 노출면을 넓힌다.
- source map 제외가 필요하면 Stage 3 범위를 넘어 build policy 변경이 필요하므로 별도 승인 task 또는 구현계획서 갱신 후 처리한다.

## Stage 3 Source availability checklist

| 항목 | 현재 상태 | 판단 |
|---|---|---|
| public source repository | `https://github.com/postmelee/crop` | OK: `PRIVACY.md` contact와 README에서 repository 기준 사용 |
| MIT license | `LICENSE` | OK |
| MPL 2.0 license text | `LICENSE-MPL-2.0` | OK |
| project notice | `NOTICE` | OK: non-affiliation, upstream source, local derived files, MPL link 기록 |
| third-party notice | `THIRD_PARTY.md` | OK: upstream repository/commit/source path/local path/modification summary 기록 |
| derived source boundary | `src/firefox-derived/` | OK |
| derived file headers | `overlay-helpers.ts`, `region.ts`, `window-dimensions.ts`, `screenshots-ui-assets.ts` | OK: MPL header 유지 |
| README attribution | `README.md` | OK: MIT/MPL/NOTICE/THIRD_PARTY and non-affiliation 문구 유지 |
| Privacy/source contact | `PRIVACY.md` | OK: public repository 링크 포함 |
| Store listing source URL | `Homepage URL` 후보: GitHub repository | 제출 승인 단계에서 Dashboard URL로 확정 필요 |

배포 package 관점 판단:

- Chrome Web Store upload zip에는 runtime files만 포함한다.
- MPL/license/source availability는 public repository, README, `NOTICE`, `THIRD_PARTY.md`, `LICENSE-MPL-2.0`, `src/firefox-derived/` headers로 제공한다.
- Store listing의 Homepage URL 또는 Support URL을 public repository로 연결하면 Web Store 사용자와 reviewer가 source와 notices에 접근할 수 있다.
- 현 Stage에서는 `NOTICE`와 `THIRD_PARTY.md` 본문 보강이 필요하지 않다고 판단했다.

## Stage 4 제출 전 blocker 정리

### 제출 차단 blocker

| 항목 | 상태 | 이유 | 처리 방향 |
|---|---|---|---|
| Manifest icon | Stage 5 해소 | `manifest.json`에 `icons`와 `action.default_icon`을 추가했고 package에도 icon file이 포함된다. | 제출 전 package contents 재확인 |
| Store icon | Stage 5.2 해소 | 사용자 제공 dark icon 기반 128x128 PNG인 `public/icons/crop-128.png`를 제작했고 build 후 `dist/icons/crop-128.png`로 포함된다. | 제출 전 Dashboard upload/preview 확인 |
| Store screenshot | 없음 | Store listing에 최소 1개 screenshot이 필요하다. | 1280x800 또는 640x400 screenshot 제작 |
| Small promotional image | 없음 | Chrome Web Store image guide에서 mandatory image로 정리된다. | 440x280 PNG/JPEG 제작 |

### 제출 전 승인 필요 항목

| 항목 | 현재 후보 | 승인 필요 이유 |
|---|---|---|
| Store Dashboard 입력 | Stage 2 Store copy와 permission/privacy draft | 실제 Dashboard 입력은 이번 task 범위에서 제외했으므로 작업지시자 승인 필요 |
| Upload package | `/tmp/crop-0.1.0-cws.zip` 생성 절차 검증 완료 | 실제 upload와 review submit은 별도 승인 필요 |
| Privacy policy URL | PR merge 후 GitHub stable URL | URL은 merge 대상 branch 또는 release URL이 확정된 뒤 입력해야 한다 |
| Category | Productivity 또는 Tools 계열 후보 | 실제 Dashboard category 목록과 작업지시자 의도 확인 필요 |
| Homepage URL | `https://github.com/postmelee/crop` 후보 | public source availability와 연결되지만, 별도 product site를 만들지 않을지 승인 필요 |
| Support URL | `https://github.com/postmelee/crop/issues` 후보 | GitHub Issues를 public support channel로 사용할지 승인 필요 |
| Source map 포함 | 현재 package에 `.map` 포함 | 포함 정책은 Stage 3에서 문서화했지만, 제출 직전 최종 승인 대상 |

### 후속 개선 후보

| 항목 | 판단 |
|---|---|
| Localized Store listing copy | README와 extension locale resource가 있으므로 가능하지만 이번 task에서는 English 기준 초안만 작성했다. |
| Localized screenshots | Store listing localization과 함께 진행하면 좋지만 screenshot asset이 먼저 필요하다. |
| Marquee promotional image | optional asset으로 분류했다. |
| Promo video | Dashboard 입력 가능 항목으로 보류했다. image guide mandatory 항목으로는 분류하지 않았다. |
| Icon polishing/branding guide | 제품명 `crop` 기준으로 별도 brand asset task에서 정리하는 편이 안전하다. |

## Stage 4 수동 smoke checklist

아래 항목은 실제 Chrome Web Store 제출 전 수동 확인 대상이다. Stage 4에서는 자동 검증과 문서 정리를 수행하고, 실제 Chrome extension load/smoke는 제출 승인 또는 asset task 이후 최종 제출 전 확인으로 남긴다.

| 구분 | 체크 항목 | 상태 |
|---|---|---|
| Load | `npm run build` 후 Chrome `chrome://extensions`에서 `dist/` unpacked load | 제출 전 수동 확인 필요 |
| Launch | action icon으로 overlay 실행 | 제출 전 수동 확인 필요 |
| Shortcut | `Ctrl+Shift+S` / macOS `Command+Shift+S` shortcut 확인 | 제출 전 수동 확인 필요 |
| Element selection | hover highlight와 click selection | 제출 전 수동 확인 필요 |
| Custom region | drag custom region, move, resize | 제출 전 수동 확인 필요 |
| Copy | selected/visible/full-page PNG clipboard write | 제출 전 수동 확인 필요 |
| Save | selected/visible/full-page PNG download | 제출 전 수동 확인 필요 |
| Full page | top-level document stitching 결과와 scroll 복구 | 제출 전 수동 확인 필요 |
| Selected out-of-viewport | viewport 밖 selected page rectangle stitching | 제출 전 수동 확인 필요 |
| Restricted page | `chrome://` 및 Chrome Web Store page 제한 동작 | 제출 전 수동 확인 필요 |
| iframe limit | cross-origin iframe 내부 selection 제한 | 제출 전 수동 확인 필요 |
| Policy copy | Store listing/privacy/permission copy와 실제 동작 일치 | Stage 4 문서 검증 완료, 제출 전 수동 review 필요 |
| Package | upload zip contents review | Stage 3/4 자동 확인 완료, 제출 전 재확인 필요 |

## Stage 4 통합 결론

- Store copy, privacy policy, permission justification, release package checklist, source availability 문서는 현재 `crop` 0.1.0 동작과 충돌하지 않는다.
- 실제 Chrome Web Store submit은 아직 수행하면 안 된다. Stage 5에서 icon blocker는 해소했지만 screenshot/small promo image blocker가 남아 있고 Dashboard 입력·upload·review submit은 별도 승인 대상이다.
- 현재 자동 검증 기준에서 source/manifest 권한은 `activeTab`, `scripting`, `clipboardWrite`, `downloads`를 유지한다.
- `debugger`, `<all_urls>`, broad `host_permissions`는 추가하지 않았다.
- `PRIVACY.md`는 PR merge 후 stable GitHub URL로 Store privacy policy URL 후보가 된다.
- Homepage/Support URL을 GitHub repository/issues로 두면 source availability와 support channel을 동시에 제공할 수 있다.
- Stage 5 이후 최종 보고서는 icon blocker 해소 결과와 남은 screenshot/small promo image blocker, 승인 필요 항목을 PR 본문과 최종 보고서에 반영한다.

## Stage 5 브랜드 아이콘 제작 결과

Stage 5에서는 실제 Store 제출 blocker 중 브랜드 아이콘과 manifest icon을 해소했다. Stage 5.1에서는 작업지시자가 제공한 PNG 아이콘을 기준으로 같은 path의 extension icon set을 다시 생성했다. Stage 5.2에서는 작업지시자가 새로 제공한 `/Users/melee/Documents/projects/crop.png` dark icon을 기준으로 같은 path의 extension icon set을 다시 생성했다. 아이콘은 `crop` 제품명만 전제로 한 crop mark 기반 심볼이며, Mozilla/Firefox/Screenshots 명칭이나 제휴를 암시하는 시각 요소를 사용하지 않는다.

### 산출물

| 자산 | 경로 | 용도 |
|---|---|---|
| 16 PNG | `public/icons/crop-16.png` | 사용자 제공 dark PNG 기반 toolbar/action small icon |
| 32 PNG | `public/icons/crop-32.png` | 사용자 제공 dark PNG 기반 Chrome extension icon variant |
| 48 PNG | `public/icons/crop-48.png` | 사용자 제공 dark PNG 기반 Chrome extension management icon variant |
| 128 PNG | `public/icons/crop-128.png` | 사용자 제공 dark PNG 기반 Chrome extension metadata와 Store icon 후보 |

### Manifest 연결

- `manifest.json`에 `icons`를 추가했다.
- `manifest.json`의 `action.default_icon`에 동일한 icon set을 연결했다.
- 기존 권한은 `activeTab`, `scripting`, `clipboardWrite`, `downloads` 그대로 유지했다.
- `debugger`, `<all_urls>`, broad `host_permissions`는 추가하지 않았다.

### 최신 제출 차단 blocker

| 항목 | 상태 | 처리 방향 |
|---|---|---|
| Manifest icon | 해소 | `manifest.json` metadata와 package icon 포함 확인 |
| Store icon | 해소 | `public/icons/crop-128.png`와 `dist/icons/crop-128.png` 확인 |
| Store screenshot | 남음 | 1280x800 또는 640x400 screenshot 제작 필요 |
| Small promotional image | 남음 | 440x280 PNG/JPEG 제작 필요 |

### Package 영향

- Vite의 기본 `public/` copy 동작으로 `dist/icons/crop-{16,32,48,128}.png`가 포함된다.
- Store upload zip에는 `icons/` directory가 root 기준으로 들어간다.
- Stage 5의 이전 SVG 원본은 사용자 제공 PNG 기반 asset과 맞지 않아 제거했다.
- `/tmp/crop-0.1.0-cws.zip`는 기존 zip update가 제거된 file entry를 보존하지 않도록 fresh write 방식으로 생성한다.

## 발견 내용

- 현재 code/manifest 권한은 Store minimum permission 설명이 가능하다.
- `activeTab`과 `scripting` 조합은 현재 tab user gesture injection 모델과 맞다.
- `captureVisibleTab()`은 `activeTab` 또는 `<all_urls>`가 필요한 API이며, `crop`은 broad `<all_urls>` 대신 `activeTab`을 사용한다.
- privacy policy 전문은 Stage 2에서 `PRIVACY.md`로 작성했다. Store privacy policy URL은 PR merge 후 stable URL로 확정해야 한다.
- image asset 중 manifest icon과 Store icon은 Stage 5에서 해소했고 Stage 5.2에서 사용자 제공 dark icon 기준으로 교체했다. screenshot과 small promo image는 실제 제출 전 blocker로 남아 있다.
- README는 Store 미게시 상태, permission, privacy, limitation, Mozilla/Firefox disclaimer를 이미 담고 있다.
- `_locales` 4개 resource가 있으므로 localized Store listing을 제공할 수 있다. 다만 locale 간 기능 설명 일관성이 필요하다.
- `NOTICE`, `THIRD_PARTY.md`, `LICENSE-MPL-2.0`은 Firefox-derived source boundary와 affiliation disclaimer를 담고 있고, Stage 3에서 배포 package/source availability 관점으로도 충분하다고 확인했다.
- remote code/eval/fetch 사용은 발견되지 않았다. Mozilla URL은 MPL header와 source attribution 문서 링크로만 존재한다.

## 결정

- Stage 2는 루트 `PRIVACY.md`를 생성한다.
- Stage 2는 English Store copy를 우선 작성한다. ko/ja/zh-CN localized Store copy는 이번 task에서 필수로 만들지 않고 후속 후보로 둘 수 있다.
- Stage 2 permission justification은 현재 manifest 권한 4개만 대상으로 한다.
- Stage 3은 `dist/` zip root packaging을 기준으로 release checklist를 작성한다.
- Stage 3은 현재 0.1.0 제출 후보 package에서 source map을 포함하는 정책으로 문서화한다.
- Stage 3은 `NOTICE`, `THIRD_PARTY.md`, `LICENSE-MPL-2.0` 본문을 보강하지 않고 기존 source availability 체계를 유지한다.
- Stage 4는 icon/screenshot/small promo image를 실제 제출 차단 blocker로 분류했다. Stage 5에서 icon blocker를 해소했고, Dashboard 입력/upload/review submit은 별도 승인 단계로 유지한다.

## 비결정 또는 보류

- Chrome Web Store category: Stage 2 copy 작성 중 후보를 남기되 실제 Dashboard 선택은 제출 승인 단계에서 결정한다.
- Homepage URL, Support URL, Official URL: GitHub repository/issues를 사용할지 별도 site를 사용할지 제출 승인 단계에서 결정한다.
- Store screenshot/small promo image 제작: 아직 이번 task에서 수행하지 않았다.
- Promo video 필수 여부: 공식 문서 간 표현 차이가 있어 Stage 4 또는 실제 Dashboard 입력 시 확인한다.
- Localized Store listing copy와 localized screenshots: source locale은 준비되어 있으나 asset/copy scope가 커지므로 후속 후보로 둔다.

## 적용 영향

- Stage 2는 `PRIVACY.md`와 Store copy를 이 매핑 기준으로 작성한다.
- Stage 3은 package checklist와 source availability를 이 gap 목록 기준으로 작성한다.
- Stage 5는 icon blocker 해소 결과를 반영하고, 남은 asset blocker와 실제 제출 전 승인 항목을 이 문서의 "Asset inventory"와 "비결정 또는 보류" 기준으로 최종 정리한다.

## 참고 링크

- Chrome Web Store Program Policies: <https://developer.chrome.com/docs/webstore/program-policies/policies>
- Prepare your extension: <https://developer.chrome.com/docs/webstore/prepare>
- Publish in the Chrome Web Store: <https://developer.chrome.com/docs/webstore/publish>
- Complete your listing information: <https://developer.chrome.com/docs/webstore/cws-dashboard-listing/>
- Fill out the privacy fields: <https://developer.chrome.com/docs/webstore/cws-dashboard-privacy/>
- Supplying Images: <https://developer.chrome.com/docs/webstore/images>
- Permissions list: <https://developer.chrome.com/docs/extensions/reference/permissions-list>
- `activeTab`: <https://developer.chrome.com/docs/extensions/activeTab>
- `chrome.scripting`: <https://developer.chrome.com/docs/extensions/reference/scripting/>
- `chrome.tabs`: <https://developer.chrome.com/docs/extensions/reference/tabs>
- `chrome.downloads`: <https://developer.chrome.com/docs/extensions/reference/api/downloads>
