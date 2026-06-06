# crop Privacy Policy

Last updated: June 6, 2026

This privacy policy applies to `crop`, a Chrome Manifest V3 extension for
selecting and capturing screenshots from the current page.

## Summary

`crop` processes screenshots locally in your browser. It does not upload
screenshots, page content, or browsing data to a server. It does not include
telemetry, analytics, advertising, accounts, payments, or background tracking.

The image leaves the page only when you explicitly choose Copy or Save:

- Copy writes the generated PNG to your system clipboard.
- Save asks Chrome to download the generated PNG file.

## Data Processed By The Extension

When you invoke `crop`, the extension may temporarily process the following
data in the active tab:

- Screenshot pixels captured from the visible tab.
- Page geometry needed to highlight elements, draw a custom region, resize or
  move a selected region, and crop or stitch the screenshot.
- The generated PNG image that results from your explicit capture action.

This processing is limited to the extension's single purpose: selecting and
capturing screenshots from the current page.

## Data Collection And Sharing

`crop` does not collect, sell, rent, transfer, or share user data with third
parties. It does not send screenshot data, page data, or usage data to the
developer or to any analytics service.

`crop` does not use remote servers for screenshot processing. Screenshot
capture, cropping, and stitching happen locally in the browser.

## Clipboard And Downloads

If you choose Copy, Chrome and your operating system may keep the copied image
in the system clipboard according to their normal clipboard behavior.

If you choose Save, Chrome downloads the generated PNG file according to your
browser download settings.

## Chrome Extension Permissions

`crop` uses the following Chrome extension permissions:

| Permission | Why it is needed |
|---|---|
| `activeTab` | Grants temporary access to the current tab after you invoke the extension. |
| `scripting` | Injects the screenshot selection overlay into the active tab. |
| `clipboardWrite` | Allows Copy to write the generated PNG to the clipboard. |
| `downloads` | Allows Save to download the generated PNG file. |

`crop` does not request `debugger`, `<all_urls>`, broad host permissions, or
`host_permissions`.

## Limited Use

`crop` uses information accessed through Chrome extension APIs only to provide
or improve its single purpose: selecting and capturing screenshots from the
current page. This use is intended to comply with the Chrome Web Store User
Data Policy, including the Limited Use requirements.

## Browser And Page Limitations

Chrome blocks extension injection on restricted pages such as `chrome://`
pages and Chrome Web Store pages. `crop` also cannot inspect cross-origin
iframe contents or closed shadow DOM internals from a content script.

Full-page capture uses visible-tab captures plus scrolling and stitching.
If the stitched output would exceed browser canvas limits, `crop` may
downscale the PNG to keep it as a single image. Dynamic pages with lazy
loading, animations, or sticky layout changes can still produce imperfect
captures.

## Contact

For questions, issues, or source information, use the public repository:

<https://github.com/postmelee/crop>
