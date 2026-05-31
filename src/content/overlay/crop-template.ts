import overlayStyles from "./crop-overlay.css?raw";
import {
  SELECTION_RESIZE_HANDLES,
  type SelectionResizeHandle
} from "./selection-transform";
import {
  createScreenshotsCancelIconSvg,
  createScreenshotsCopyIconSvg,
  createScreenshotsDownloadIconSvg,
  createScreenshotsFullPageIconSvg,
  createScreenshotsPreviewFaceSvg,
  createScreenshotsVisibleIconSvg
} from "../../firefox-derived/screenshots-ui-assets";

export const ROOT_ID = "__crop_root__";
export const ROOT_ATTRIBUTE = "data-crop-root";
export const PANEL_ATTRIBUTE = "data-crop-panel";
export const FLASH_CLASS = "crop-panel--flash";
export const TOAST_ROOT_ID = "__crop_toast__";
export const TOAST_ATTRIBUTE = "data-crop-toast-root";

type CropActionName = "copy" | "save" | "cancel";

export interface CropOverlayTemplate {
  readonly panel: HTMLElement;
  readonly highlight: HTMLElement;
  readonly selectionControls: CropSelectionControlsTemplate;
  readonly actions: HTMLElement;
  readonly actionStatus: HTMLElement;
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

  const selectionControls = createSelectionControlsTemplate();
  selectionMask.container.append(highlight, selectionControls.container);

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
    mode: "full-page"
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

  const copyButton = createActionButton("copy", "복사");
  const saveButton = createActionButton("save", "저장");
  const cancelButton = createActionButton("cancel", "취소", true);
  const primaryActionGroup = createActionGroup("primary");
  const secondaryActionGroup = createActionGroup("secondary");
  const actionStatus = document.createElement("div");
  actionStatus.className = "crop-action-status";
  actionStatus.hidden = true;
  actionStatus.setAttribute("role", "status");
  actionStatus.setAttribute("aria-live", "polite");

  instructions.append(instructionMain, instructionSub);
  prompt.append(face, instructions, promptCancelButton);
  panel.append(visibleModeButton, fullPageModeButton);
  secondaryActionGroup.append(cancelButton);
  primaryActionGroup.append(copyButton, saveButton);
  actions.append(secondaryActionGroup, primaryActionGroup, actionStatus);
  shell.append(
    dim,
    frame,
    selectionMask.container,
    prompt,
    actions,
    panel
  );
  shadowRoot.append(style, shell);

  return { panel, highlight, selectionControls, actions, actionStatus, prompt, selectionMask };
}

export interface CropSelectionMaskTemplate {
  readonly container: HTMLElement;
  readonly top: HTMLElement;
  readonly right: HTMLElement;
  readonly bottom: HTMLElement;
  readonly left: HTMLElement;
}

export interface CropSelectionControlsTemplate {
  readonly container: HTMLElement;
  readonly moveSurface: HTMLElement;
  readonly sizeBadge: HTMLElement;
  readonly handles: Readonly<Record<SelectionResizeHandle, HTMLButtonElement>>;
}

export interface CropToastTemplate {
  readonly host: HTMLElement;
}

export function createCropToastTemplate(message: string): CropToastTemplate {
  const host = document.createElement("div");
  host.id = TOAST_ROOT_ID;
  host.setAttribute(TOAST_ATTRIBUTE, "true");

  const shadowRoot = host.attachShadow({ mode: "open" });
  const style = document.createElement("style");
  style.textContent = overlayStyles;

  const toast = document.createElement("div");
  toast.id = "confirmation-hint";
  toast.className = "crop-confirmation-hint";
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");

  const checkmarkContainer = document.createElement("span");
  checkmarkContainer.id = "confirmation-hint-checkmark-animation-container";
  checkmarkContainer.className = "crop-confirmation-checkmark-container";
  checkmarkContainer.setAttribute("aria-hidden", "true");

  const checkmark = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  checkmark.id = "confirmation-hint-checkmark-image";
  checkmark.classList.add("crop-confirmation-checkmark");
  checkmark.setAttribute("viewBox", "0 0 14 14");
  checkmark.setAttribute("width", "14");
  checkmark.setAttribute("height", "14");

  const checkmarkPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  checkmarkPath.setAttribute("d", "M2.1 7.1L5.2 10.2L11.9 3.4");
  checkmarkPath.setAttribute("fill", "none");
  checkmarkPath.setAttribute("stroke", "currentColor");
  checkmarkPath.setAttribute("stroke-width", "2");
  checkmarkPath.setAttribute("stroke-linecap", "round");
  checkmarkPath.setAttribute("stroke-linejoin", "round");
  checkmark.append(checkmarkPath);
  checkmarkContainer.append(checkmark);

  const messageContainer = document.createElement("span");
  messageContainer.id = "confirmation-hint-message-container";
  messageContainer.className = "crop-confirmation-message-container";

  const description = document.createElement("span");
  description.id = "confirmation-hint-message";
  description.className = "crop-confirmation-message";
  description.textContent = message;

  messageContainer.append(description);
  toast.append(checkmarkContainer, messageContainer);
  shadowRoot.append(style, toast);

  return {
    host
  };
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

function createActionButton(
  action: CropActionName,
  label: string,
  iconOnly = false
): HTMLButtonElement {
  const button = document.createElement("button");

  button.className = `crop-action crop-action--${action}`;
  button.type = "button";
  button.setAttribute("data-crop-action", action);
  button.setAttribute("title", label);
  button.setAttribute("aria-label", label);
  button.addEventListener("blur", () => {
    delete button.dataset.cropFocusVisible;
  });

  const icon = createActionIcon(action);
  const actionLabel = document.createElement("span");
  actionLabel.className = "crop-action-label";
  actionLabel.textContent = label;

  if (iconOnly) {
    actionLabel.classList.add("crop-action-label--hidden");
  }

  button.append(icon, actionLabel);

  return button;
}

function createActionIcon(action: CropActionName): SVGSVGElement {
  switch (action) {
    case "cancel":
      return createScreenshotsCancelIconSvg(document);
    case "copy":
      return createScreenshotsCopyIconSvg(document);
    case "save":
      return createScreenshotsDownloadIconSvg(document);
  }
}

function createActionGroup(kind: "primary" | "secondary"): HTMLElement {
  const group = document.createElement("div");

  group.className = `crop-action-group crop-action-group--${kind}`;

  return group;
}

function createSelectionMaskTemplate(): CropSelectionMaskTemplate {
  const container = document.createElement("div");
  container.className = "crop-selection-container";
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

function createSelectionControlsTemplate(): CropSelectionControlsTemplate {
  const container = document.createElement("div");
  container.className = "crop-selection-controls";
  container.hidden = true;

  const moveSurface = document.createElement("div");
  moveSurface.className = "crop-selection-move-surface";
  moveSurface.setAttribute("data-crop-selection-move", "true");
  moveSurface.setAttribute("aria-hidden", "true");

  const sizeBadge = document.createElement("div");
  sizeBadge.className = "crop-selection-size";
  sizeBadge.hidden = true;
  sizeBadge.setAttribute("aria-hidden", "true");

  const handles = Object.fromEntries(
    SELECTION_RESIZE_HANDLES.map((handle) => [handle, createResizeHandle(handle)])
  ) as Record<SelectionResizeHandle, HTMLButtonElement>;

  container.append(
    moveSurface,
    sizeBadge,
    ...SELECTION_RESIZE_HANDLES.map((handle) => handles[handle])
  );

  return {
    container,
    moveSurface,
    sizeBadge,
    handles
  };
}

function createResizeHandle(handle: SelectionResizeHandle): HTMLButtonElement {
  const button = document.createElement("button");

  button.className = `crop-resize-handle crop-resize-handle--${handle}`;
  button.type = "button";
  button.setAttribute("data-crop-resize-handle", handle);
  button.setAttribute("aria-label", `${getResizeHandleLabel(handle)} 크기 조절`);
  button.title = `${getResizeHandleLabel(handle)} 크기 조절`;

  return button;
}

function getResizeHandleLabel(handle: SelectionResizeHandle): string {
  switch (handle) {
    case "north":
      return "위쪽";
    case "south":
      return "아래쪽";
    case "east":
      return "오른쪽";
    case "west":
      return "왼쪽";
    case "north-east":
      return "오른쪽 위";
    case "north-west":
      return "왼쪽 위";
    case "south-east":
      return "오른쪽 아래";
    case "south-west":
      return "왼쪽 아래";
  }
}
