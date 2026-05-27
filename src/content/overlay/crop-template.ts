import overlayStyles from "./crop-overlay.css?raw";

export const ROOT_ID = "__crop_root__";
export const ROOT_ATTRIBUTE = "data-crop-root";
export const PANEL_ATTRIBUTE = "data-crop-panel";
export const FLASH_CLASS = "crop-panel--flash";

export interface CropOverlayTemplate {
  readonly panel: HTMLElement;
  readonly highlight: HTMLElement;
  readonly actions: HTMLElement;
}

export function createCropOverlayTemplate(
  shadowRoot: ShadowRoot,
  removeOverlay: () => void
): CropOverlayTemplate {
  const style = document.createElement("style");
  style.textContent = overlayStyles;

  const shell = document.createElement("div");
  shell.className = "crop-shell";

  const dim = document.createElement("div");
  dim.className = "crop-dim";

  const frame = document.createElement("div");
  frame.className = "crop-frame";

  const highlight = document.createElement("div");
  highlight.className = "crop-highlight";
  highlight.hidden = true;
  highlight.setAttribute("aria-hidden", "true");

  const panel = document.createElement("div");
  panel.className = "crop-panel";
  panel.setAttribute(PANEL_ATTRIBUTE, "true");
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "crop");

  const brand = document.createElement("div");
  brand.className = "crop-brand";

  const mark = document.createElement("span");
  mark.className = "crop-mark";
  mark.setAttribute("aria-hidden", "true");

  const label = document.createElement("span");
  label.textContent = "crop";

  const closeButton = document.createElement("button");
  closeButton.className = "crop-close";
  closeButton.type = "button";
  closeButton.textContent = "x";
  closeButton.setAttribute("aria-label", "Close crop overlay");
  closeButton.addEventListener("click", removeOverlay);

  const actions = document.createElement("div");
  actions.className = "crop-actions";
  actions.hidden = true;
  actions.setAttribute("role", "toolbar");
  actions.setAttribute("aria-label", "Crop actions");

  const copyButton = createActionButton("copy", "Copy");
  const saveButton = createActionButton("save", "Save");
  const cancelButton = createActionButton("cancel", "Cancel");

  brand.append(mark, label);
  panel.append(brand, closeButton);
  actions.append(copyButton, saveButton, cancelButton);
  shell.append(dim, frame, highlight, actions, panel);
  shadowRoot.append(style, shell);
  panel.classList.add(FLASH_CLASS);

  return { panel, highlight, actions };
}

function createActionButton(action: string, label: string): HTMLButtonElement {
  const button = document.createElement("button");

  button.className = `crop-action crop-action--${action}`;
  button.type = "button";
  button.textContent = label;
  button.setAttribute("data-crop-action", action);

  return button;
}
