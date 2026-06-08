<p align="center">
  <img src="/assets/logo/Crop-iOS-Default-256x256@2x.png" alt="crop logo" width="128" />
</p>

# <div align="center">crop</div>

<p align="center">
  <a href="https://github.com/postmelee/crop/releases/latest">
    <img alt="GitHub Release" src="https://img.shields.io/github/v/release/postmelee/crop?label=release" />
  </a>
  <a href="LICENSE">
    <img alt="License" src="https://img.shields.io/github/license/postmelee/crop" />
  </a>
  <a href="https://chromewebstore.google.com/detail/crop/pdmniipgbjdcpnhbkkppodechbehagki">
    <img alt="Chrome Web Store" src="https://img.shields.io/chrome-web-store/v/pdmniipgbjdcpnhbkkppodechbehagki?label=chrome%20web%20store&logo=googlechrome&logoColor=white" />
  </a>
</p>

`crop` is a Chrome Manifest V3 extension for taking precise page screenshots.
Open the overlay, select a page element or draw a custom region, then copy or
save the resulting PNG.

<div align="center">

English | [한국어](README.ko.md) | [简体中文](README.zh-CN.md) | [日本語](README.ja.md)

</div>

![screenshot](/assets/crop_screenshots/crop_eng_1.png)

## Install from Chrome Web Store

1. Open [`crop` in the Chrome Web Store](https://chromewebstore.google.com/detail/crop/pdmniipgbjdcpnhbkkppodechbehagki).
2. Click Add to Chrome and confirm the installation.
3. Open a normal web page and click the `crop` action icon.

Chrome may leave the suggested shortcut unassigned if it conflicts with an
existing browser or operating system shortcut. You can review extension
shortcuts in `chrome://extensions/shortcuts`.

## What crop does

- Opens from the extension action icon or the `Ctrl+Shift+S` shortcut
  (`Command+Shift+S` on macOS).
- Shows a page overlay in the current tab.
- Highlights DOM elements as you move the pointer.
- Lets you click an element, drag a custom area, resize the selected area, or
  move it before capture.
- Copies the selected PNG to the system clipboard or saves it as a downloaded
  PNG file.
- Captures the visible viewport directly.
- Captures the current top-level document as a full-page PNG by stitching
  visible viewport captures.
- Captures selected areas that extend outside the current viewport by scrolling
  and stitching the selected page rectangle.
- Supports same-origin and `srcdoc` iframe element selection when Chrome allows
  the content script to inspect the iframe document.

## Basic Usage

1. Open a normal web page.
2. Click the `crop` action icon, or press `Ctrl+Shift+S`
   (`Command+Shift+S` on macOS).
3. Choose one of the capture flows:
   - Move over an element and click to select it.
   - Drag to draw a custom region.
   - Use the visible-page button to capture the current viewport.
   - Use the full-page button to capture the current top-level document.
4. Adjust the selected region if needed.
5. Click Copy to write a PNG to the clipboard, or Save to download a PNG.
6. Press Escape or use Cancel to close the overlay without capturing.

## Load from source for development

Use this path when developing `crop`, testing local changes, or loading an
unpacked build manually.

Requirements:

- Node.js 20 or newer
- npm
- Google Chrome or another Chromium browser that can load unpacked extensions

Build the extension:

```bash
npm install
npm run build
```

Load it in Chrome:

1. Open `chrome://extensions`.
2. Enable Developer mode.
3. Click Load unpacked.
4. Select this repository's `dist/` folder.
5. Open a normal web page and click the `crop` action icon.

## Permissions

`crop` uses the following Chrome extension permissions:

| Permission | Why it is needed |
|---|---|
| `activeTab` | Grants temporary access to the current tab after you invoke the extension. |
| `scripting` | Injects the overlay content script into the active tab. |
| `clipboardWrite` | Allows Copy to write the generated PNG to the clipboard. |
| `downloads` | Allows Save to download the generated PNG file. |

The extension does not request `debugger`, `<all_urls>`, or broad host
permissions.

## Privacy

Screenshots are processed locally in your browser. `crop` does not upload
screenshots, send page data to a server, or include telemetry.

The image leaves the page only when you explicitly use Copy or Save:

- Copy writes the PNG to your system clipboard.
- Save asks Chrome to download the PNG file.

See [Privacy Policy](PRIVACY.md) for the full policy.

## Current Limits

- Chrome blocks extension injection on restricted pages such as `chrome://`
  pages and Chrome Web Store pages.
- Cross-origin iframe contents cannot be inspected from the content script.
  `crop` can handle same-origin and `srcdoc` iframe documents, but it cannot
  select inside cross-origin iframe documents.
- Closed shadow DOM internals are not accessible.
- Full-page capture covers the current top-level document. It does not stitch
  cross-origin iframe documents as separate full pages.
- Full-page capture uses `chrome.tabs.captureVisibleTab()` plus scroll
  stitching. If the stitched output would exceed browser canvas limits, `crop`
  downscales the PNG to keep it as a single image. Dynamic pages with lazy
  loading, animations, or sticky layout changes can still produce imperfect
  captures.
- Fixed and sticky page chrome may need special handling during stitched
  captures. `crop` reduces repeated fixed/sticky elements where possible, but it
  does not use privileged browser-native screenshot APIs.

## Development

Useful commands:

```bash
npm run build
npm run typecheck
npm test
```

The source manifest is `manifest.json`. The Chrome load target after build is
`dist/`.

Repository layout:

- `src/background/`: Chrome extension service worker.
- `src/content/`: injected content script entrypoint.
- `src/content/overlay/`: Shadow DOM overlay UI and capture orchestration.
- `src/shared/`: shared message, geometry, crop, filename, and clipboard
  helpers.
- `src/firefox-derived/`: MPL-2.0-covered source adapted from Mozilla Firefox
  Screenshots.
- `tests/`: unit and regression tests.
- `mydocs/`: Hyper-Waterfall planning, reports, technical notes, and task
  history.

This repository follows the Hyper-Waterfall workflow. Tracked work starts from
a GitHub Issue and proceeds through a task branch, daily order, plan,
implementation plan, stage report, final report, and pull request.

## Attribution and license

The product name is `crop`.

`crop` is not affiliated with, endorsed by, or sponsored by Mozilla or Firefox.
Mozilla and Firefox names are used only for factual source attribution, license
notices, and technical references.

New project code is intended to be distributed under the MIT License. See
`LICENSE`.

Files adapted from Mozilla Firefox Screenshots source are kept under
`src/firefox-derived/` and retain Mozilla Public License 2.0 notices. See
`LICENSE-MPL-2.0`, `NOTICE`, and `THIRD_PARTY.md` for details.
