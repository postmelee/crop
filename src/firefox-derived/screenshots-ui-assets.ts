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

export function createScreenshotsPreviewFaceSvg(doc: Document = document): SVGSVGElement {
  return createSvgElement(PREVIEW_FACE_SVG, "crop-screenshots-face-svg", doc);
}

export function createScreenshotsVisibleIconSvg(doc: Document = document): SVGSVGElement {
  return createIconSvgElement(MENU_VISIBLE_SVG, "crop-screenshots-visible-icon", doc);
}

export function createScreenshotsFullPageIconSvg(doc: Document = document): SVGSVGElement {
  return createIconSvgElement(MENU_FULLPAGE_SVG, "crop-screenshots-fullpage-icon", doc);
}

function createIconSvgElement(markup: string, className: string, doc: Document): SVGSVGElement {
  const svg = createSvgElement(markup, className, doc);

  for (const element of svg.querySelectorAll("[fill]")) {
    const fill = element.getAttribute("fill") ?? "";

    if (fill.startsWith("context-stroke")) {
      element.setAttribute("fill", "var(--crop-screenshots-icon-background-color)");
    } else if (fill.startsWith("context-fill")) {
      element.setAttribute("fill", "currentColor");
      element.setAttribute("fill-rule", "evenodd");
      element.setAttribute("clip-rule", "evenodd");
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
