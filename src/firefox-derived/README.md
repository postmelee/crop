# Firefox-derived code

This directory is the boundary for code adapted from Mozilla Firefox
Screenshots. Firefox-derived files in this directory are tracked separately so
the MPL-covered boundary stays visible to contributors and build tooling.

## Task #4 Upstream Source

- Repository: https://github.com/mozilla-firefox/firefox
- Commit: `e28b34ab33dbf49364999070168cbb7e11e8e5bd`
- Source path:
  `browser/components/screenshots/overlayHelpers.mjs`
- Source URL:
  https://github.com/mozilla-firefox/firefox/blob/e28b34ab33dbf49364999070168cbb7e11e8e5bd/browser/components/screenshots/overlayHelpers.mjs
- Reference view:
  https://searchfox.org/firefox-main/source/browser/components/screenshots/overlayHelpers.mjs

## Local Adaptation Targets

| Local path | Upstream scope | Task #4 responsibility |
|---|---|---|
| `overlay-helpers.ts` | Element hit-test, `getBestRectForElement`, small/large element and heading/article heuristics | Chrome MV3-safe helper functions for Phase 3 overlay UI |
| `region.ts` | `Region` geometry class | Visible viewport-only region math |
| `window-dimensions.ts` | `WindowDimensions` class | Explicit viewport dimensions for Chrome content scripts |

## Excluded Upstream Sources

The following Firefox Screenshots files are not imported in Task #4:

- `browser/components/screenshots/ScreenshotsHelperChild.sys.mjs`
- `browser/components/screenshots/overlay/overlay.css`
- `browser/components/screenshots/screenshots-buttons.js`
- `browser/components/screenshots/screenshots-buttons.css`

`ScreenshotsHelperChild.sys.mjs` may be used only as context for understanding
Firefox's privileged iframe lookup path. This project does not port Firefox
actors, XPCOM, `ChromeUtils`, `Services`, `mozInnerScreenX/Y`, or privileged
closed shadow root access.

## License

Firefox-derived files in this directory are governed by the Mozilla Public
License 2.0. See the repository root `LICENSE-MPL-2.0`.

Every copied or modified source file in this directory must keep an MPL-2.0
notice, preferably:

```ts
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
```

or:

```ts
// SPDX-License-Identifier: MPL-2.0
```

## Adaptation Boundary

This directory is for Firefox-derived algorithms, geometry helpers, and style
fragments that require MPL tracking. Chrome extension runtime code belongs in:

- `src/background/`
- `src/content/`
- `src/content/overlay/`
- `src/shared/`

Chrome-specific files outside `src/firefox-derived/` should not contain copied
MPL code unless the file is intentionally treated as MPL-covered.

## Expected Modifications

When the Firefox Screenshots helpers are ported for this Chrome extension, the
adaptation is expected to:

- convert Firefox module syntax to TypeScript where needed
- remove Firefox privileged APIs such as JSWindowActor, ChromeUtils, Services,
  and document anonymous content APIs
- avoid closed shadow root and privileged iframe access that is not available
  to a Chrome extension content script
- keep the MVP limited to visible viewport selection and capture
