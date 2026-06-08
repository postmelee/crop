# Task #29 Discussions 게시글 후보

GitHub Issue: [#29](https://github.com/postmelee/crop/issues/29)
대상: GitHub Discussions 초안
범위: 실제 게시글 생성은 하지 않고, 게시 전 검토 가능한 후보 문안만 준비한다.

## 운영 원칙

- 실제 게시 전에는 최신 Chrome Web Store 등록 상태, README, 릴리스 노트와 문구가 일치하는지 다시 확인한다.
- `crop`은 제품명으로만 사용한다.
- Mozilla, Firefox, Screenshots 명칭은 제휴나 보증을 암시하지 않고 필요한 출처·기술 맥락에서만 사용한다.
- 보안 민감 정보, 개인 정보, 비공개 페이지 데이터는 Discussions에 올리지 않도록 안내한다.
- 영어 게시를 기본 후보로 두고, 필요하면 같은 thread에 한국어, 중국어, 일본어 요약 댓글을 별도로 추가한다.

## 후보 1 — crop 소개

권장 카테고리: Announcements 또는 General

제목:

```text
Introducing crop: precise page screenshots for Chrome
```

본문 후보:

````md
`crop` is a Chrome Manifest V3 extension for taking precise page screenshots.

It opens an overlay in the current tab, lets you select a DOM element or draw a
custom region, and then copies or saves the selected area as a PNG.

Current highlights:

- Element hover highlighting and click-to-select
- Custom region selection with resize and move controls
- Visible viewport capture
- Full-page capture for the current top-level document
- Scrolled capture for selected areas that extend outside the current viewport
- Copy to clipboard and Save as PNG
- Local processing in the browser, with no screenshot upload or telemetry

Install:

- Chrome Web Store: https://chromewebstore.google.com/detail/crop/pdmniipgbjdcpnhbkkppodechbehagki

The project is intentionally conservative about extension permissions. `crop`
does not request `debugger`, `<all_urls>`, or broad host permissions.

Feedback about selection accuracy, full-page capture edge cases, iframe
behavior, and documentation clarity is welcome.
````

## 후보 2 — 첫 사용 안내

권장 카테고리: Q&A 또는 General

제목:

```text
Getting started with crop
```

본문 후보:

````md
After installing `crop`, open a normal web page and click the extension action
icon, or use the shortcut if it is assigned in Chrome.

Basic flow:

1. Open the overlay.
2. Move over an element and click to select it, or drag to draw a custom region.
3. Adjust the selected region if needed.
4. Click Copy to write a PNG to the clipboard, or Save to download a PNG.
5. Press Escape or use Cancel to close without capturing.

Chrome may leave the shortcut unassigned if it conflicts with an existing
browser or operating system shortcut. You can check it at:

```text
chrome://extensions/shortcuts
```

Some pages are restricted by Chrome and cannot receive extension scripts, such
as `chrome://` pages and Chrome Web Store pages.
````

## 후보 3 — 피드백 요청

권장 카테고리: Ideas 또는 General

제목:

```text
What should crop handle better?
```

본문 후보:

````md
I would like feedback on the capture cases that matter most in real use.

Useful reports include:

- Pages where element selection feels inaccurate
- Sticky headers or fixed UI that appear incorrectly in stitched captures
- Lazy-loaded pages that produce incomplete full-page output
- Same-origin iframe cases that should work but do not
- Documentation gaps in the README, privacy policy, or contribution guide

When sharing feedback, please include:

- Chrome version
- Operating system
- The page type or a public reproduction page if possible
- Whether you used element selection, custom region, visible-page capture, or
  full-page capture

Please do not post private page contents, personal screenshots, or sensitive
security details in Discussions.
````

## 후보 4 — 알려진 제약과 로드맵 공유

권장 카테고리: Announcements 또는 General

제목:

```text
Known limits and near-term direction for crop
```

본문 후보:

````md
`crop` is designed around Chrome Manifest V3 and a narrow permission model.

Known limits:

- Chrome blocks extension injection on restricted pages such as `chrome://`
  pages and Chrome Web Store pages.
- Cross-origin iframe contents cannot be inspected from the content script.
- Closed shadow DOM internals are not accessible.
- Full-page capture stitches visible viewport captures, so pages with lazy
  loading, animation, or sticky layout changes can produce imperfect output.
- Very large stitched captures may need downscaling to stay within browser
  canvas limits.

The near-term direction is to keep screenshot capture reliable while preserving
the privacy and permission stance:

- No screenshot upload
- No telemetry
- No broad host permissions
- No `debugger` permission

Issues and Discussions are welcome when a limit affects a practical workflow.
````

## 후보 5 — 후원 안내

권장 카테고리: General

제목:

```text
Supporting crop development
```

본문 후보:

````md
`crop` is maintained as a small open source project.

The most useful support is practical feedback:

- Clear bug reports with reproduction steps
- Pages that expose selection or stitching edge cases
- Documentation improvements
- Review of permission, privacy, and security wording

GitHub Sponsors is also available for people who want to support maintenance
work financially:

- https://github.com/sponsors/postmelee

Sponsorship is optional and does not change issue or pull request review
priority. Security, privacy, and release-blocking bugs remain the priority.
````
