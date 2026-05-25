# Firefox-derived code

This directory is reserved for code adapted from Mozilla Firefox Screenshots.

No Mozilla Firefox source file has been copied into this repository as of
Phase 0. Future imports must update this file, `NOTICE`, and `THIRD_PARTY.md`
with exact upstream source paths, upstream revision, local paths, and a
modification summary.

## Planned Upstream Sources

- `browser/components/screenshots/overlayHelpers.mjs`
- `browser/components/screenshots/ScreenshotsOverlayChild.sys.mjs`
- `browser/components/screenshots/overlay/overlay.css`
- `browser/components/screenshots/screenshots-buttons.js`
- `browser/components/screenshots/screenshots-buttons.css`

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
