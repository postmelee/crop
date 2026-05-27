# Third-Party Notices

This file records third-party source material, licenses, and attribution
requirements for `crop`.

## Mozilla Firefox Screenshots

Status: source boundary fixed for Task #4 adaptation. Local TypeScript ports
are implemented only under `src/firefox-derived/` and must retain MPL 2.0
notices when added in Stage 2 and Stage 3.

Primary upstream source:

- Repository: https://github.com/mozilla-firefox/firefox
- Commit: `e28b34ab33dbf49364999070168cbb7e11e8e5bd`
- Source path:
  `browser/components/screenshots/overlayHelpers.mjs`
- Source URL:
  https://github.com/mozilla-firefox/firefox/blob/e28b34ab33dbf49364999070168cbb7e11e8e5bd/browser/components/screenshots/overlayHelpers.mjs
- Reference view:
  https://searchfox.org/firefox-main/source/browser/components/screenshots/overlayHelpers.mjs

Local adaptation targets:

| Local path | Upstream source | Adapted scope | Modification summary |
|---|---|---|---|
| `src/firefox-derived/overlay-helpers.ts` | `browser/components/screenshots/overlayHelpers.mjs` | Element hit-test, `getBestRectForElement`, heading/article heuristics | Converted to TypeScript and restricted to normal DOM/open shadow DOM. Firefox actor messaging, closed shadow access, cross-origin iframe traversal, and `mozInnerScreenX/Y` handling are removed. |
| `src/firefox-derived/region.ts` | `browser/components/screenshots/overlayHelpers.mjs` | `Region` geometry model | Converted to TypeScript and limited to visible viewport geometry needed by Chrome MV3 MVP. Full-page and scroll stitching behavior are excluded. |
| `src/firefox-derived/window-dimensions.ts` | `browser/components/screenshots/overlayHelpers.mjs` | `WindowDimensions` viewport model | Converted to TypeScript and represented as explicit viewport inputs. Firefox-specific scroll min/max and privileged window data are omitted unless needed for visible viewport helper tests. |

Context-only upstream references, not imported in Task #4:

- `browser/components/screenshots/ScreenshotsHelperChild.sys.mjs`
  - Documents how Firefox delegates iframe element rect lookup through a
    privileged actor.
  - Task #4 does not port `JSWindowActorChild`, `ScreenshotsHelper`, or
    `mozInnerScreenX/Y`.
- `browser/components/screenshots/overlay/overlay.css`
- `browser/components/screenshots/screenshots-buttons.js`
- `browser/components/screenshots/screenshots-buttons.css`
  - Reserved for later UI work if a separate approved task imports UI
    assets or style fragments.

License:

- Mozilla Public License 2.0
- Local copy: `LICENSE-MPL-2.0`
- License URL: https://mozilla.org/MPL/2.0/

Required handling:

- Firefox-derived or modified files must live under `src/firefox-derived/`.
- Firefox-derived or modified files must retain an MPL 2.0 notice.
- Chrome-specific files outside `src/firefox-derived/` should not contain MPL
  code unless that file is intentionally treated as MPL-covered.
- If a later task imports additional Mozilla source, record the exact upstream
  repository URL, commit or revision, source path, local path, and modification
  summary in this file before implementation.

Trademark and affiliation:

- `crop` is not affiliated with, endorsed by, or sponsored by Mozilla or
  Firefox.
- Mozilla and Firefox names are used only for factual source attribution,
  license notices, and technical references.
