# Third-Party Notices

This file records third-party source material, licenses, and attribution
requirements for `crop`.

## Mozilla Firefox Screenshots

Status: planned source adaptation. No Firefox source file has been copied into
this repository as of Phase 0.

Planned upstream references:

- `browser/components/screenshots/overlayHelpers.mjs`
- `browser/components/screenshots/ScreenshotsOverlayChild.sys.mjs`
- `browser/components/screenshots/overlay/overlay.css`
- `browser/components/screenshots/screenshots-buttons.js`
- `browser/components/screenshots/screenshots-buttons.css`

License:

- Mozilla Public License 2.0
- Local copy: `LICENSE-MPL-2.0`
- License URL: https://mozilla.org/MPL/2.0/

Required handling:

- Firefox-derived or modified files must live under `src/firefox-derived/`.
- Firefox-derived or modified files must retain an MPL 2.0 notice.
- Chrome-specific files outside `src/firefox-derived/` should not contain MPL
  code unless that file is intentionally treated as MPL-covered.
- When source is imported, record the exact upstream repository URL, commit or
  revision, source path, local path, and modification summary in this file.

Trademark and affiliation:

- `crop` is not affiliated with, endorsed by, or sponsored by Mozilla or
  Firefox.
- Mozilla and Firefox names are used only for factual source attribution,
  license notices, and technical references.
