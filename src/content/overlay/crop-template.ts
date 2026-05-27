import overlayStyles from "./crop-overlay.css?raw";
import {
  createScreenshotsFullPageIconSvg,
  createScreenshotsPreviewFaceSvg,
  createScreenshotsVisibleIconSvg
} from "../../firefox-derived/screenshots-ui-assets";

export const ROOT_ID = "__crop_root__";
export const ROOT_ATTRIBUTE = "data-crop-root";
export const PANEL_ATTRIBUTE = "data-crop-panel";
export const FLASH_CLASS = "crop-panel--flash";

export interface CropOverlayTemplate {
  readonly panel: HTMLElement;
  readonly highlight: HTMLElement;
  readonly actions: HTMLElement;
  readonly prompt: HTMLElement;
  readonly selectionMask: CropSelectionMaskTemplate;
}

export function createCropOverlayTemplate(shadowRoot: ShadowRoot): CropOverlayTemplate {
  const style = document.createElement("style");
  style.textContent = overlayStyles;

  const shell = document.createElement("div");
  shell.className = "crop-shell";

  const dim = document.createElement("div");
  dim.className = "crop-dim";

  const frame = document.createElement("div");
  frame.className = "crop-frame";

  const selectionMask = createSelectionMaskTemplate();

  const highlight = document.createElement("div");
  highlight.className = "crop-highlight";
  highlight.hidden = true;
  highlight.setAttribute("aria-hidden", "true");

  const panel = document.createElement("div");
  panel.className = "crop-mode-toolbar";
  panel.setAttribute(PANEL_ATTRIBUTE, "true");
  panel.setAttribute("role", "toolbar");
  panel.setAttribute("aria-label", "crop capture modes");

  const visibleModeButton = createModeButton({
    label: "보이는 영역 선택",
    mode: "visible",
    active: true
  });
  const fullPageModeButton = createModeButton({
    label: "전체 페이지 선택",
    mode: "full-page",
    disabled: true
  });

  const prompt = document.createElement("div");
  prompt.className = "crop-prompt";
  prompt.setAttribute("role", "dialog");
  prompt.setAttribute("aria-label", "crop 영역 선택");

  const face = createPromptFace();

  const instructions = document.createElement("div");
  instructions.className = "crop-prompt-instructions";

  const instructionMain = document.createElement("span");
  instructionMain.textContent = "드래그하거나 클릭해서 영역을 선택하세요.";

  const instructionSub = document.createElement("span");
  instructionSub.textContent = "ESC 키를 누르면 취소됩니다.";

  const promptCancelButton = document.createElement("button");
  promptCancelButton.className = "crop-prompt-cancel";
  promptCancelButton.type = "button";
  promptCancelButton.textContent = "취소";
  promptCancelButton.setAttribute("data-crop-action", "cancel");

  const actions = document.createElement("div");
  actions.className = "crop-actions";
  actions.hidden = true;
  actions.setAttribute("role", "toolbar");
  actions.setAttribute("aria-label", "Crop actions");

  const copyButton = createActionButton("copy", "Copy");
  const saveButton = createActionButton("save", "Save");
  const cancelButton = createActionButton("cancel", "Cancel");

  instructions.append(instructionMain, instructionSub);
  prompt.append(face, instructions, promptCancelButton);
  panel.append(visibleModeButton, fullPageModeButton);
  actions.append(copyButton, saveButton, cancelButton);
  shell.append(dim, frame, selectionMask.container, highlight, prompt, actions, panel);
  shadowRoot.append(style, shell);
  panel.classList.add(FLASH_CLASS);

  return { panel, highlight, actions, prompt, selectionMask };
}

export interface CropSelectionMaskTemplate {
  readonly container: HTMLElement;
  readonly top: HTMLElement;
  readonly right: HTMLElement;
  readonly bottom: HTMLElement;
  readonly left: HTMLElement;
}

interface ModeButtonOptions {
  readonly label: string;
  readonly mode: "visible" | "full-page";
  readonly active?: boolean;
  readonly disabled?: boolean;
}

function createModeButton(options: ModeButtonOptions): HTMLButtonElement {
  const button = document.createElement("button");

  button.className = `crop-mode-button crop-mode-button--${options.mode}`;
  button.type = "button";
  button.setAttribute("data-crop-mode", options.mode);
  button.setAttribute("aria-pressed", options.active ? "true" : "false");

  if (options.disabled) {
    button.setAttribute("aria-disabled", "true");
  }

  const icon = document.createElement("span");
  icon.className = "crop-mode-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.append(
    options.mode === "visible"
      ? createScreenshotsVisibleIconSvg(document)
      : createScreenshotsFullPageIconSvg(document)
  );

  const label = document.createElement("span");
  label.className = "crop-mode-label";
  label.textContent = options.label;

  button.append(icon, label);

  return button;
}

function createPromptFace(): HTMLElement {
  const face = document.createElement("div");
  face.className = "crop-face";
  face.setAttribute("aria-hidden", "true");
  face.append(createScreenshotsPreviewFaceSvg(document));

  return face;
}

function createActionButton(action: string, label: string): HTMLButtonElement {
  const button = document.createElement("button");

  button.className = `crop-action crop-action--${action}`;
  button.type = "button";
  button.textContent = label;
  button.setAttribute("data-crop-action", action);

  return button;
}

function createSelectionMaskTemplate(): CropSelectionMaskTemplate {
  const container = document.createElement("div");
  container.className = "crop-selection-mask";
  container.hidden = true;
  container.setAttribute("aria-hidden", "true");

  const top = createSelectionMaskPart("top");
  const right = createSelectionMaskPart("right");
  const bottom = createSelectionMaskPart("bottom");
  const left = createSelectionMaskPart("left");

  container.append(top, right, bottom, left);

  return {
    container,
    top,
    right,
    bottom,
    left
  };
}

function createSelectionMaskPart(position: string): HTMLElement {
  const part = document.createElement("div");
  part.className = `crop-selection-mask-part crop-selection-mask-part--${position}`;

  return part;
}
