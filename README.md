# crop

`crop` is a Chrome MV3 extension project for visible-area screenshot capture with element selection. The target MVP is a lightweight browser extension that lets a user open an overlay, hover DOM elements, select a visible region, and copy or save the resulting PNG.

This repository is in Phase 0. It currently defines the project rules, licensing baseline, and build/setup direction before runtime extension code is implemented.

## MVP Direction

Included in the MVP:

- Chrome Manifest V3 extension
- action icon and keyboard command entry points
- Shadow DOM overlay UI
- hover-based DOM element highlight
- selected region Copy, Save, and Cancel actions
- visible viewport capture only
- `activeTab`, `scripting`, and `clipboardWrite` permission strategy

Excluded from the MVP:

- full page capture
- scroll stitching
- `debugger` permission
- `<all_urls>` host permission
- telemetry or server upload

## Repository Method

This repository follows Hyper-Waterfall. Work is tracked through GitHub Issues, task branches, daily orders, plans, implementation plans, stage reports, final reports, and pull requests.

Key local references:

- `AGENTS.md`: repository rules for coding agents
- `mydocs/manual/`: Hyper-Waterfall manuals
- `mydocs/plans/`: task plans and implementation plans
- `mydocs/working/`: stage reports
- `mydocs/report/`: final reports

## Development Status

Phase 0 prepares the repository:

- TypeScript and Vite build baseline
- license and third-party notices
- source directory boundaries
- Firefox-derived code policy

Runtime files such as `manifest.json`, background service worker, content script injection, overlay UI, and capture/crop behavior are intentionally deferred to later tasks.

## Branding

The product name is `crop`.

This project is not affiliated with, endorsed by, or sponsored by Mozilla or Firefox. Mozilla and Firefox names appear only in licensing, attribution, and technical source-reference contexts where needed to identify upstream material.

## License

New code in this repository is intended to be distributed under the MIT License unless a file says otherwise. See `LICENSE`.

Files adapted from Mozilla Firefox Screenshots source code must keep Mozilla Public License 2.0 notices and live under `src/firefox-derived/`. See `LICENSE-MPL-2.0`, `NOTICE`, and `THIRD_PARTY.md`.
