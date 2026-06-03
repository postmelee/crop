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
  createScreenshotsRetryIconSvg,
  createScreenshotsVisibleIconSvg
} from "../../firefox-derived/screenshots-ui-assets";
import { getCropMessage, type CropI18nMessageName } from "../../shared/i18n";

export const ROOT_ID = "__crop_root__";
export const ROOT_ATTRIBUTE = "data-crop-root";
export const PANEL_ATTRIBUTE = "data-crop-panel";
export const FLASH_CLASS = "crop-panel--flash";
export const TOAST_ROOT_ID = "__crop_toast__";
export const TOAST_ATTRIBUTE = "data-crop-toast-root";

type CropActionName = "copy" | "save" | "cancel" | "retry";

export interface CropOverlayTemplate {
  readonly panel: HTMLElement;
  readonly highlight: HTMLElement;
  readonly selectionControls: CropSelectionControlsTemplate;
  readonly actions: HTMLElement;
  readonly actionStatus: HTMLElement;
  readonly prompt: HTMLElement;
  readonly preview: CropPreviewTemplate;
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
  panel.setAttribute("aria-label", getCropMessage("overlayCaptureModesLabel"));

  const visibleModeButton = createModeButton({
    label: getCropMessage("modeVisible"),
    mode: "visible",
    active: true
  });
  const fullPageModeButton = createModeButton({
    label: getCropMessage("modeFullPage"),
    mode: "full-page"
  });

  const prompt = document.createElement("div");
  prompt.className = "crop-prompt";
  prompt.setAttribute("role", "dialog");
  prompt.setAttribute("aria-label", getCropMessage("promptAreaSelectionLabel"));

  const face = createPromptFace();

  const instructions = document.createElement("div");
  instructions.className = "crop-prompt-instructions";

  const instructionMain = document.createElement("span");
  instructionMain.textContent = getCropMessage("promptInstructionMain");

  const instructionSub = document.createElement("span");
  instructionSub.textContent = getCropMessage("promptInstructionSub");

  const promptCancelButton = document.createElement("button");
  promptCancelButton.className = "crop-prompt-cancel";
  promptCancelButton.type = "button";
  promptCancelButton.textContent = getCropMessage("actionCancel");
  promptCancelButton.setAttribute("data-crop-action", "cancel");

  const actions = document.createElement("div");
  actions.className = "crop-actions";
  actions.hidden = true;
  actions.setAttribute("role", "toolbar");
  actions.setAttribute("aria-label", getCropMessage("actionsToolbarLabel"));

  const copyButton = createActionButton("copy");
  const saveButton = createActionButton("save");
  const cancelButton = createActionButton("cancel", true);
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
  const preview = createPreviewTemplate();
  shell.append(
    dim,
    frame,
    selectionMask.container,
    prompt,
    actions,
    preview.container,
    panel
  );
  shadowRoot.append(style, shell);

  return { panel, highlight, selectionControls, actions, actionStatus, prompt, preview, selectionMask };
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

export interface CropPreviewTemplate {
  readonly container: HTMLElement;
  readonly dialog: HTMLElement;
  readonly image: HTMLImageElement;
  readonly actions: HTMLElement;
  readonly status: HTMLElement;
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

function createPreviewTemplate(): CropPreviewTemplate {
  const container = document.createElement("div");
  container.className = "crop-preview";
  container.hidden = true;
  container.setAttribute("role", "dialog");
  container.setAttribute("aria-label", getCropMessage("previewDialogLabel"));

  const dialog = document.createElement("div");
  dialog.className = "crop-preview-dialog";

  const surface = document.createElement("div");
  surface.className = "crop-preview-surface";

  const image = document.createElement("img");
  image.className = "crop-preview-image";
  image.alt = getCropMessage("previewImageAlt");

  const footer = document.createElement("div");
  footer.className = "crop-preview-footer";

  const actions = document.createElement("div");
  actions.className = "crop-preview-actions";
  actions.setAttribute("role", "toolbar");
  actions.setAttribute("aria-label", getCropMessage("previewActionsToolbarLabel"));

  const retryButton = createActionButton("retry", true);
  const cancelButton = createActionButton("cancel", true);
  const copyButton = createActionButton("copy");
  const saveButton = createActionButton("save");
  const secondaryActionGroup = createActionGroup("secondary");
  const primaryActionGroup = createActionGroup("primary");
  const status = document.createElement("div");
  status.className = "crop-preview-status";
  status.hidden = true;
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");

  secondaryActionGroup.append(retryButton, cancelButton);
  primaryActionGroup.append(copyButton, saveButton);
  actions.append(secondaryActionGroup, primaryActionGroup, status);
  footer.append(actions);
  surface.append(image);
  dialog.append(footer, surface);
  container.append(dialog);

  return {
    container,
    dialog,
    image,
    actions,
    status
  };
}

function createActionButton(
  action: CropActionName,
  iconOnly = false
): HTMLButtonElement {
  const button = document.createElement("button");
  const label = getActionLabel(action);

  button.className = `crop-action crop-action--${action}`;
  button.type = "button";
  button.setAttribute("data-crop-action", action);
  button.setAttribute("title", getActionTitle(action, label));
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
    case "retry":
      return createScreenshotsRetryIconSvg(document);
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

function getActionTitle(action: CropActionName, label: string): string {
  switch (action) {
    case "cancel":
      return getCropMessage("actionTitleWithShortcut", [
        label,
        isMacLikePlatform() ? "esc" : "Esc"
      ]);
    case "copy":
      return getCropMessage("actionTitleWithShortcut", [label, getAccelShortcut("C")]);
    case "save":
      return getCropMessage("actionTitleWithShortcut", [label, getAccelShortcut("S")]);
    case "retry":
      return label;
  }
}

function getActionLabel(action: CropActionName): string {
  switch (action) {
    case "cancel":
      return getCropMessage("actionCancel");
    case "retry":
      return getCropMessage("actionRetry");
    case "copy":
      return getCropMessage("actionCopy");
    case "save":
      return getCropMessage("actionSave");
  }
}

function getAccelShortcut(key: string): string {
  return isMacLikePlatform() ? `⌘${key}` : `Ctrl+${key}`;
}

function isMacLikePlatform(): boolean {
  const platform = globalThis.navigator?.platform ?? "";

  return /Mac|iPhone|iPad|iPod/i.test(platform);
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
  const label = getResizeHandleLabel(handle);
  button.setAttribute("aria-label", label);
  button.title = label;

  return button;
}

function getResizeHandleLabel(handle: SelectionResizeHandle): string {
  const direction = getCropMessage(getResizeHandleDirectionMessageName(handle));

  return getCropMessage("resizeHandleLabel", direction);
}

function getResizeHandleDirectionMessageName(handle: SelectionResizeHandle): CropI18nMessageName {
  switch (handle) {
    case "north":
      return "resizeDirectionNorth";
    case "south":
      return "resizeDirectionSouth";
    case "east":
      return "resizeDirectionEast";
    case "west":
      return "resizeDirectionWest";
    case "north-east":
      return "resizeDirectionNorthEast";
    case "north-west":
      return "resizeDirectionNorthWest";
    case "south-east":
      return "resizeDirectionSouthEast";
    case "south-west":
      return "resizeDirectionSouthWest";
  }
}
