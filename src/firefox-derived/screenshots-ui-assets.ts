/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

const PREVIEW_FACE_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <g>
    <path d="M11.4.9v2.9h-6c-.9 0-1.5.8-1.5 1.5v6H.8V3.8C.8 2.1 2.2.7 3.9.7h7.6v.2z" class="face-line-color"/>
    <path d="M63.2 11.4h-3.1v-6c0-.8-.6-1.5-1.5-1.5h-6v-3h7.6c1.7 0 3.1 1.4 3.1 3.1z" class="face-line-color"/>
    <path d="M52.6 63.2v-3.1h6c.9 0 1.5-.6 1.5-1.5v-6h3.1v7.6c0 1.7-1.4 3.1-3.1 3.1z" class="face-line-color"/>
    <path d="M.8 52.7h3.1v6c0 .9.6 1.5 1.5 1.5h6v3.1H3.8c-1.7 0-3.1-1.4-3.1-3.1z" class="face-line-color"/>
    <path d="M33.3 49.2H33c-4.6-.1-7.8-3.6-7.9-3.8-.6-.8-.6-2 .1-2.7.8-.8 1.9-.6 2.6.1 0 0 2.3 2.6 5.2 2.6 1.8 0 3.6-.9 5.2-2.6.8-.8 1.9-.8 2.7 0 .8.8.8 1.9 0 2.7-2.2 2.4-4.9 3.7-7.6 3.7z" class="face-line-color" style="display:inline"/>
    <ellipse id="leftEye" cx="23" cy="26" class="face-line-color" rx="5" ry="7"/>
    <ellipse id="rightEye" cx="43" cy="26" class="face-line-color" rx="5" ry="7"/>
    <ellipse id="leftPupil" cx="25" cy="30" class="face-pupil-color" rx="3" ry="3"/>
    <ellipse id="rightPupil" cx="45" cy="30" class="face-pupil-color" rx="3" ry="3"/>
  </g>
</svg>`;

const MENU_VISIBLE_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 46 46"><path d="M5 12c0-.6.5-1 1-1h34c.6 0 1 .5 1 1v24c0 .6-.5 1-1 1H6c-.6 0-1-.5-1-1V12zm2 23V13h32v22H7z" fill="context-fill"/><path d="M7 35h32V13H7z" fill="context-stroke #00fdff"/><path id="dash" d="M38 19h1v-2h-1v2zm0 3h1v-2h-1v2zm0 3h1v-2h-1v2zm0 3h1v-2h-1v2zm0 3h1v-2h-1v2zm0 3h1v-2h-1v2zm-1 1h2v-1h-2v1zm-3 0h2v-1h-2v1zm-3 0h2v-1h-2v1zm-3 0h2v-1h-2v1zm-3 0h2v-1h-2v1zm-3 0h2v-1h-2v1zm-3 0h2v-1h-2v1zm-3 0h2v-1h-2v1zm-3 0h2v-1h-2v1zm-3 0h2v-1h-2v1zm-2-3H7v3h2v-1H8v-2zm-1-1h1v-2H7v2zm0-3h1v-2H7v2zm0-3h1v-2H7v2zm0-3h1v-2H7v2zm0-3h1v-2H7v2zm2-6H7v3h1v-2h1v-1zm1 1h2v-1h-2v1zm3 0h2v-1h-2v1zm3 0h2v-1h-2v1zm3 0h2v-1h-2v1zm3 0h2v-1h-2v1zm3 0h2v-1h-2v1zm3 0h2v-1h-2v1zm3 0h2v-1h-2v1zm3 0h2v-1h-2v1zm5-1h-2v1h1v2h1v-3z" fill="context-fill" opacity="0.5"/></svg>`;

const MENU_FULLPAGE_SVG = `
<svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 46 46"><path id="bg" d="M7 42h32V5.1H7z" fill="context-stroke #00fdff"/><g id="frame" transform="translate(0 6)"><path d="M40 5c.5 0 1 .4 1 1v24c0 .5-.5 1-1 1H6c-.6 0-1-.5-1-1V6c0-.6.4-1 1-1h34zM7 29h32V7H7v22z" fill="context-fill"/><path id="Fill-4" fill="context-fill" d="M7 7h32V5H7z"/><path id="Fill-6" fill="context-fill" d="M7 31h32v-2H7z"/></g><path id="dash" d="M38 11h1V9h-1v2zm0 3h1v-2h-1v2zm0 3h1v-2h-1v2zm0 3h1v-2h-1v2zm0 3h1v-2h-1v2zm0 3h1v-2h-1v2zm0 3h1v-2h-1v2zm0 3h1v-2h-1v2zm0 3h1v-2h-1v2zm0 3h1v-2h-1v2zm0 3h1v-2h-1v2zm-1 1h2v-1h-2v1zm-3 0h2v-1h-2v1zm-3 0h2v-1h-2v1zm-3 0h2v-1h-2v1zm-3 0h2v-1h-2v1zm-3 0h2v-1h-2v1zm-3 0h2v-1h-2v1zm-3 0h2v-1h-2v1zm-3 0h2v-1h-2v1zm-3 0h2v-1h-2v1zm-2-3H7v3h2v-1H8v-2zm-1-1h1v-2H7v2zm0-3h1v-2H7v2zm0-3h1v-2H7v2zm0-3h1v-2H7v2zm0-3h1v-2H7v2zm0-3h1v-2H7v2zm0-3h1v-2H7v2zm0-3h1v-2H7v2zm0-3h1v-2H7v2zm0-3h1V9H7v2zm2-6H7v3h1V6h1V5zm1 1h2V5h-2v1zm3 0h2V5h-2v1zm3 0h2V5h-2v1zm3 0h2V5h-2v1zm3 0h2V5h-2v1zm3 0h2V5h-2v1zm3 0h2V5h-2v1zm3 0h2V5h-2v1zm3 0h2V5h-2v1zm5-1h-2v1h1v2h1V5z" fill="context-fill" opacity="0.5"/></svg>`;

const ACTION_CANCEL_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="context-fill" fill-opacity="context-fill-opacity">
  <path d="m9.108 7.776 4.709-4.709a.626.626 0 0 0-.884-.885L8.244 6.871l-.488 0-4.689-4.688a.625.625 0 1 0-.884.885L6.87 7.754l0 .491-4.687 4.687a.626.626 0 0 0 .884.885L7.754 9.13l.491 0 4.687 4.687a.627.627 0 0 0 .885 0 .626.626 0 0 0 0-.885L9.108 8.223l0-.447z"/>
</svg>`;

const ACTION_RELOAD_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="context-fill" fill-opacity="context-fill-opacity">
  <path d="M10.707 6 14.7 6l.3-.3 0-3.993a.5.5 0 0 0-.854-.354l-1.459 1.459A6.95 6.95 0 0 0 8 1C4.141 1 1 4.141 1 8s3.141 7 7 7a6.97 6.97 0 0 0 6.968-6.322.626.626 0 0 0-.562-.682.635.635 0 0 0-.682.562A5.726 5.726 0 0 1 8 13.75c-3.171 0-5.75-2.579-5.75-5.75S4.829 2.25 8 2.25a5.71 5.71 0 0 1 3.805 1.445l-1.451 1.451a.5.5 0 0 0 .353.854z"/>
</svg>`;

const ACTION_COPY_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="context-fill" fill-opacity="context-fill-opacity">
  <path d="M6.035 1.25c-1 0-1.812.812-1.812 1.813h1.5c0-.173.14-.313.312-.313h5.95c.172 0 .313.14.313.313v7.65c0 .172-.14.312-.313.312v1.5c1 0 1.813-.812 1.813-1.813v-7.65c0-1-.812-1.812-1.813-1.812h-5.95z"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M3.063 4.225c-1.001 0-1.813.812-1.813 1.813v7.65c0 1 .812 1.812 1.813 1.812h5.95c1 0 1.812-.812 1.812-1.812v-7.65c0-1.001-.812-1.813-1.813-1.813h-5.95zM2.75 6.038c0-.173.14-.313.313-.313h5.95c.172 0 .312.14.312.313v7.65c0 .172-.14.312-.313.312h-5.95a.313.313 0 0 1-.312-.312v-7.65z"/>
</svg>`;

const ACTION_DOWNLOAD_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="context-fill" fill-opacity="context-fill-opacity">
  <path d="M8.25.625a.625.625 0 0 0-1.25 0l0 8.323-3.308-3.309a.626.626 0 0 0-.885.885L7.285 11l.681 0 4.477-4.476a.626.626 0 0 0-.885-.885L8.25 8.947l0-8.322z"/>
  <path d="M12.25 15a2 2 0 0 0 2-2l0-1.375a.625.625 0 0 0-1.25 0l0 1.525-.6.6-9.55 0-.6-.6 0-1.525a.625.625 0 0 0-1.25 0L1 13a2 2 0 0 0 2 2l9.25 0z"/>
</svg>`;

export function createScreenshotsPreviewFaceSvg(doc: Document = document): SVGSVGElement {
  return createSvgElement(PREVIEW_FACE_SVG, "crop-screenshots-face-svg", doc);
}

export function createScreenshotsVisibleIconSvg(doc: Document = document): SVGSVGElement {
  return createIconSvgElement(MENU_VISIBLE_SVG, "crop-screenshots-visible-icon", doc);
}

export function createScreenshotsFullPageIconSvg(doc: Document = document): SVGSVGElement {
  return createIconSvgElement(MENU_FULLPAGE_SVG, "crop-screenshots-fullpage-icon", doc);
}

export function createScreenshotsCancelIconSvg(doc: Document = document): SVGSVGElement {
  return createActionIconSvgElement(ACTION_CANCEL_SVG, "crop-screenshots-cancel-icon", doc);
}

export function createScreenshotsRetryIconSvg(doc: Document = document): SVGSVGElement {
  return createActionIconSvgElement(ACTION_RELOAD_SVG, "crop-screenshots-retry-icon", doc);
}

export function createScreenshotsCopyIconSvg(doc: Document = document): SVGSVGElement {
  return createActionIconSvgElement(ACTION_COPY_SVG, "crop-screenshots-copy-icon", doc);
}

export function createScreenshotsDownloadIconSvg(doc: Document = document): SVGSVGElement {
  return createActionIconSvgElement(ACTION_DOWNLOAD_SVG, "crop-screenshots-download-icon", doc);
}

function createActionIconSvgElement(markup: string, className: string, doc: Document): SVGSVGElement {
  const svg = createIconSvgElement(markup, className, doc);
  svg.classList.add("crop-action-icon");

  return svg;
}

function createIconSvgElement(markup: string, className: string, doc: Document): SVGSVGElement {
  const svg = createSvgElement(markup, className, doc);

  for (const element of [
    svg,
    ...Array.from(svg.querySelectorAll<SVGElement>("[fill], [fill-opacity]"))
  ]) {
    const fill = element.getAttribute("fill") ?? "";

    if (fill.startsWith("context-stroke")) {
      element.setAttribute("fill", "var(--crop-screenshots-icon-background-color)");
    } else if (fill.startsWith("context-fill")) {
      element.setAttribute("fill", "currentColor");
      element.setAttribute("fill-rule", "evenodd");
      element.setAttribute("clip-rule", "evenodd");
    }

    if (element.getAttribute("fill-opacity")?.startsWith("context-fill-opacity")) {
      element.removeAttribute("fill-opacity");
    }
  }

  return svg;
}

function createSvgElement(markup: string, className: string, doc: Document): SVGSVGElement {
  const template = doc.createElement("template");
  template.innerHTML = markup.trim();
  const svg = template.content.firstElementChild;

  if (!(svg instanceof SVGSVGElement)) {
    throw new Error("Invalid Firefox screenshots SVG asset");
  }

  svg.classList.add(className);

  return svg;
}
