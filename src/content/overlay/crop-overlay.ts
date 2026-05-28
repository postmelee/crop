import {
  createCropOverlayTemplate,
  createCropToastTemplate,
  type CropOverlayTemplate,
  FLASH_CLASS,
  PANEL_ATTRIBUTE,
  ROOT_ATTRIBUTE,
  ROOT_ID,
  TOAST_ROOT_ID
} from "./crop-template";
import {
  applyActionButtonsPresentation,
  applyEyeOffsetPresentation,
  applyHighlightPresentation,
  applySelectionMaskPresentation,
  type ElementSize
} from "./positioning";
import {
  getBestRectForElement,
  getElementFromPoint
} from "../../firefox-derived/overlay-helpers";
import {
  pageRectToViewportRect,
  readWindowDimensions,
  type PageRect,
  type ViewportRect
} from "../../firefox-derived/window-dimensions";
import {
  createInitialOverlayState,
  transitionOverlayState,
  type CropOverlayState
} from "./state-machine";
import {
  pngDataUrlToBlob,
  writePngDataUrlToClipboard
} from "../../shared/clipboard";
import { cropPngDataUrl } from "../../shared/crop-image";
import { createPngFilename } from "../../shared/filename";
import { clipPageRectToViewport, type CropRect, type ViewportMetrics } from "../../shared/rect";

interface PointerPosition {
  readonly x: number;
  readonly y: number;
}

const CROP_CAPTURE_VISIBLE_TAB_MESSAGE = "crop.captureVisibleTab";

type CropAction = "copy" | "save" | "cancel";
type CaptureAction = Exclude<CropAction, "cancel">;

interface CropCaptureVisibleTabRequest {
  readonly type: typeof CROP_CAPTURE_VISIBLE_TAB_MESSAGE;
}

type CropCaptureVisibleTabResponse =
  | {
      readonly ok: true;
      readonly dataUrl: string;
    }
  | {
      readonly ok: false;
      readonly error: string;
    };

type CropRuntimeMessage = CropCaptureVisibleTabRequest;

interface CropContentChromeApi {
  readonly runtime?: {
    readonly lastError?: {
      readonly message?: string;
    };
    sendMessage(message: CropRuntimeMessage): Promise<unknown>;
  };
}

interface CropCapturePipelineResult {
  readonly action: CaptureAction;
  readonly dataUrl: string;
  readonly viewportRect: CropRect;
  readonly sourceRect: CropRect;
  readonly outputWidth: number;
  readonly outputHeight: number;
}

interface CropCaptureHost extends HTMLElement {
  __cropLastCaptureResult?: CropCapturePipelineResult;
}

declare const chrome: CropContentChromeApi | undefined;

const FALLBACK_ACTIONS_SIZE: ElementSize = {
  width: 242,
  height: 50
};
const PANEL_FLASH_DEBOUNCE_MS = 800;
const TOAST_AUTO_DISMISS_MS = 2400;
const FIREFOX_DETECT_VIEWPORT_MARGIN = 100;
const FIREFOX_MIN_MAX_DETECT_HEIGHT = 700;
const FIREFOX_MIN_MAX_DETECT_WIDTH = 1000;

function flashExistingOverlay(existingRoot: HTMLElement): boolean {
  if (existingRoot.getAttribute(ROOT_ATTRIBUTE) !== "true") {
    console.warn(`[crop] Cannot mount overlay: #${ROOT_ID} already exists.`);
    return true;
  }

  const panel = existingRoot.shadowRoot?.querySelector<HTMLElement>(`[${PANEL_ATTRIBUTE}]`);

  if (!panel) {
    existingRoot.remove();
    return false;
  }

  restartPanelFlash(panel);

  return true;
}

function restartPanelFlash(panel: HTMLElement): void {
  const now = panel.ownerDocument.defaultView?.performance.now() ?? performance.now();
  const lastFlashAt = Number(panel.dataset.cropPanelLastFlashAt ?? Number.NEGATIVE_INFINITY);

  if (panel.dataset.cropPanelFlashing === "true" || now - lastFlashAt < PANEL_FLASH_DEBOUNCE_MS) {
    return;
  }

  panel.dataset.cropPanelLastFlashAt = String(now);
  panel.dataset.cropPanelFlashing = "true";

  const finish = (): void => {
    panel.classList.remove(FLASH_CLASS);
    delete panel.dataset.cropPanelFlashing;
  };

  panel.addEventListener("animationend", finish, { once: true });
  panel.addEventListener("animationcancel", finish, { once: true });
  panel.classList.remove(FLASH_CLASS);
  void panel.offsetWidth;
  panel.classList.add(FLASH_CLASS);
}

export function mountCropOverlay(): void {
  const existingRoot = document.getElementById(ROOT_ID);

  if (existingRoot instanceof HTMLElement && flashExistingOverlay(existingRoot)) {
    return;
  }

  const host = document.createElement("div");
  host.id = ROOT_ID;
  host.setAttribute(ROOT_ATTRIBUTE, "true");
  const captureHost = host as CropCaptureHost;

  const shadowRoot = host.attachShadow({ mode: "open" });
  let template: CropOverlayTemplate | null = null;
  let pendingPointer: PointerPosition | null = null;
  let lastPointer: PointerPosition | null = null;
  let animationFrameId: number | null = null;
  let overlayState: CropOverlayState = createInitialOverlayState();
  let suppressNextDocumentClick = false;
  let suppressDocumentClickTimeoutId: number | null = null;
  let pendingCapture = false;
  let overlayRemoved = false;

  const removeOverlay = (): void => {
    if (overlayRemoved) {
      return;
    }

    overlayRemoved = true;
    window.removeEventListener("keydown", handleKeyDown, true);
    window.removeEventListener("pointerdown", handlePointerDown, true);
    window.removeEventListener("pointermove", handlePointerMove, true);
    window.removeEventListener("pointerup", handlePointerUp, true);
    window.removeEventListener("click", handleClick, true);
    window.removeEventListener("scroll", handleViewportChange, true);
    window.removeEventListener("resize", handleViewportChange, true);
    clearSuppressedDocumentClick();
    cancelPendingHoverUpdate();
    host.remove();
  };

  const requestClose = (): void => {
    overlayState = transitionOverlayState(overlayState, { type: "cancel" });
    renderOverlayState();
    removeOverlay();
  };

  const handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== "Escape") {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    requestClose();
  };

  const handlePointerMove = (event: PointerEvent): void => {
    const pointer = {
      x: event.clientX,
      y: event.clientY
    };
    lastPointer = pointer;
    const pagePointer = toPagePoint(pointer);

    updatePromptEyes(pointer);

    if (overlayState.status === "draggingReady" || overlayState.status === "dragging") {
      event.preventDefault();
      event.stopPropagation();
      overlayState = transitionOverlayState(overlayState, {
        type: "dragMove",
        point: pagePointer
      });
      renderOverlayState();
      return;
    }

    if (overlayState.status === "selected") {
      return;
    }

    if (isCropOverlayEvent(event, host)) {
      clearHover();
      return;
    }

    queueHoverUpdate(pointer);
  };

  const handlePointerDown = (event: PointerEvent): void => {
    if (isCropOverlayEvent(event, host) || event.button !== 0) {
      return;
    }

    if (overlayState.status === "selected") {
      event.preventDefault();
      event.stopPropagation();
      suppressFollowingDocumentClick();

      const pagePointer = toPagePoint({
        x: event.clientX,
        y: event.clientY
      });

      if (
        overlayState.selectedRect &&
        !isPointInsidePageRect(pagePointer, overlayState.selectedRect)
      ) {
        overlayState = transitionOverlayState(overlayState, { type: "resetSelection" });
        cancelPendingHoverUpdate();
        renderOverlayState();
      }

      return;
    }

    event.preventDefault();
    event.stopPropagation();
    cancelPendingHoverUpdate();
    overlayState = transitionOverlayState(overlayState, {
      type: "dragStart",
      point: toPagePoint({
        x: event.clientX,
        y: event.clientY
      })
    });
    renderOverlayState();
  };

  const handlePointerUp = (event: PointerEvent): void => {
    if (overlayState.status !== "draggingReady" && overlayState.status !== "dragging") {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    overlayState = transitionOverlayState(overlayState, { type: "dragEnd" });
    cancelPendingHoverUpdate();
    renderOverlayState();
  };

  const queueHoverUpdate = (pointer: PointerPosition): void => {
    pendingPointer = pointer;

    if (animationFrameId !== null) {
      return;
    }

    animationFrameId = window.requestAnimationFrame(processHoverUpdate);
  };

  const processHoverUpdate = (): void => {
    animationFrameId = null;

    if (!pendingPointer || !template) {
      return;
    }

    const pointer = pendingPointer;
    pendingPointer = null;
    overlayState = transitionOverlayState(overlayState, {
      type: "hover",
      rect: resolveHoverRect(pointer, host)
    });
    renderOverlayState();
  };

  const clearHover = (): void => {
    cancelPendingHoverUpdate();
    lastPointer = null;
    overlayState = transitionOverlayState(overlayState, {
      type: "hover",
      rect: null
    });
    renderOverlayState();
  };

  const handleClick = (event: MouseEvent): void => {
    const action = getCropActionFromEvent(event);

    if (action) {
      event.preventDefault();
      event.stopPropagation();

      if (action === "cancel") {
        requestClose();
      } else {
        startCaptureAction(action);
      }

      return;
    }

    if (isCropOverlayEvent(event, host)) {
      return;
    }

    if (event.button !== 0) {
      return;
    }

    if (suppressNextDocumentClick) {
      event.preventDefault();
      event.stopPropagation();
      clearSuppressedDocumentClick();
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (overlayState.status === "selected") {
      return;
    }

    overlayState = transitionOverlayState(overlayState, {
      type: "select",
      rect: overlayState.hoverRect ?? resolveHoverRect({ x: event.clientX, y: event.clientY }, host)
    });
    cancelPendingHoverUpdate();
    renderOverlayState();
  };

  const startCaptureAction = (action: CaptureAction): void => {
    if (pendingCapture || overlayState.status !== "selected" || !overlayState.selectedRect) {
      return;
    }

    const selectedRect = overlayState.selectedRect;
    pendingCapture = true;
    setActionStatus(null);
    setCapturePending(true);

    void performCaptureAction(action, selectedRect)
      .catch((error) => {
        if (overlayRemoved) {
          return;
        }

        recordCaptureFailure(error, action);
        console.warn(`[crop] Failed to ${action} selected area: ${formatCaptureError(error)}.`);
      })
      .finally(() => {
        pendingCapture = false;

        if (!overlayRemoved) {
          setCapturePending(false);
          renderOverlayState();
        }
      });
  };

  const performCaptureAction = async (
    action: CaptureAction,
    selectedRect: PageRect
  ): Promise<void> => {
    const previousVisibility = host.style.visibility;
    host.style.visibility = "hidden";

    try {
      await waitForNextPaint();
      const result = await captureSelectedRegion(action, selectedRect);

      if (overlayRemoved) {
        return;
      }

      recordCaptureSuccess(result);

      if (result.action === "copy") {
        await writePngDataUrlToClipboard(result.dataUrl);
        host.dataset.cropClipboardStatus = "ok";
        showCompletionToast({
          result,
          message: "복사 완료",
          status: "copied"
        });
        removeOverlay();
        return;
      }

      const filename = downloadPngDataUrl(result.dataUrl, document.title);
      host.dataset.cropDownloadStatus = "ok";
      host.dataset.cropDownloadFilename = filename;
      showCompletionToast({
        result,
        message: "저장 완료",
        status: "saved",
        filename
      });
      removeOverlay();
    } catch (error) {
      if (!overlayRemoved) {
        host.style.visibility = previousVisibility;
      }

      throw error;
    }
  };

  const recordCaptureSuccess = (result: CropCapturePipelineResult): void => {
    captureHost.__cropLastCaptureResult = result;
    host.dataset.cropCaptureStatus = "ok";
    host.dataset.cropCaptureAction = result.action;
    host.dataset.cropCaptureWidth = String(result.outputWidth);
    host.dataset.cropCaptureHeight = String(result.outputHeight);
    delete host.dataset.cropCaptureError;
    delete host.dataset.cropClipboardStatus;
    delete host.dataset.cropDownloadStatus;
    delete host.dataset.cropDownloadFilename;
    setActionStatus(null);
  };

  const recordCaptureFailure = (error: unknown, action: CaptureAction): void => {
    host.dataset.cropCaptureStatus = "error";
    host.dataset.cropCaptureError = formatCaptureError(error);

    if (action === "copy") {
      host.dataset.cropClipboardStatus = "error";
      delete host.dataset.cropDownloadStatus;
      delete host.dataset.cropDownloadFilename;
      setActionStatus("복사 실패. Save로 저장할 수 있습니다.", action);
    } else {
      host.dataset.cropDownloadStatus = "error";
      delete host.dataset.cropClipboardStatus;
      setActionStatus("저장 실패. 다시 시도하세요.", action);
    }
  };

  const captureSelectedRegion = async (
    action: CaptureAction,
    selectedRect: PageRect
  ): Promise<CropCapturePipelineResult> => {
    const viewport = getViewportMetrics();
    const viewportRect = clipPageRectToViewport(selectedRect, viewport);

    if (!viewportRect) {
      throw new Error("Selected area is outside the visible viewport.");
    }

    const captureResponse = await requestVisibleTabCapture();

    if (!captureResponse.ok) {
      throw new Error(captureResponse.error);
    }

    const cropResult = await cropPngDataUrl({
      dataUrl: captureResponse.dataUrl,
      viewportCropRect: viewportRect,
      viewportCssSize: {
        clientWidth: viewport.clientWidth,
        clientHeight: viewport.clientHeight
      }
    });

    return {
      action,
      dataUrl: cropResult.dataUrl,
      viewportRect,
      sourceRect: cropResult.sourceRect,
      outputWidth: cropResult.outputWidth,
      outputHeight: cropResult.outputHeight
    };
  };

  const setCapturePending = (isPending: boolean): void => {
    if (!template) {
      return;
    }

    if (isPending) {
      host.dataset.cropCapturePending = "true";
      template.actions.setAttribute("aria-busy", "true");
    } else {
      delete host.dataset.cropCapturePending;
      template.actions.removeAttribute("aria-busy");
    }

    for (const button of template.actions.querySelectorAll<HTMLButtonElement>(
      '[data-crop-action="copy"], [data-crop-action="save"]'
    )) {
      button.disabled = isPending;
    }
  };

  const setActionStatus = (message: string | null, action?: CaptureAction): void => {
    if (!template) {
      return;
    }

    if (!message) {
      template.actionStatus.hidden = true;
      template.actionStatus.textContent = "";
      delete template.actionStatus.dataset.cropActionStatus;
      return;
    }

    template.actionStatus.hidden = false;
    template.actionStatus.textContent = message;

    if (action) {
      template.actionStatus.dataset.cropActionStatus = action;
    }
  };

  const renderOverlayState = (): void => {
    host.setAttribute("data-crop-state", overlayState.status);

    if (template) {
      const windowDimensions = readWindowDimensions();
      const activeRect = projectPageRectToViewport(
        overlayState.selectedRect ?? overlayState.hoverRect,
        windowDimensions
      );
      const selectionRect =
        overlayState.status === "selected" || overlayState.status === "dragging"
          ? projectPageRectToViewport(overlayState.selectedRect, windowDimensions)
          : null;
      const visibleSelectionRect = selectionRect
        ? windowDimensions.clipRectToViewport(selectionRect)
        : null;
      applyHighlightPresentation(template.highlight, activeRect);
      applySelectionMaskPresentation(template.selectionMask, visibleSelectionRect);
      template.highlight.classList.toggle(
        "crop-highlight--selected",
        overlayState.status === "selected" || overlayState.status === "dragging"
      );
      updateActionButtons(template, overlayState.status === "selected" ? visibleSelectionRect : null);
    }
  };

  const handleViewportChange = (): void => {
    if (overlayState.status === "idle" || overlayState.status === "hovering") {
      if (lastPointer) {
        queueHoverUpdate(lastPointer);
      }
      return;
    }

    renderOverlayState();
  };

  const cancelPendingHoverUpdate = (): void => {
    pendingPointer = null;

    if (animationFrameId === null) {
      return;
    }

    window.cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  };

  const suppressFollowingDocumentClick = (): void => {
    clearSuppressedDocumentClick();
    suppressNextDocumentClick = true;
    suppressDocumentClickTimeoutId = window.setTimeout(clearSuppressedDocumentClick, 800);
  };

  const clearSuppressedDocumentClick = (): void => {
    suppressNextDocumentClick = false;

    if (suppressDocumentClickTimeoutId === null) {
      return;
    }

    window.clearTimeout(suppressDocumentClickTimeoutId);
    suppressDocumentClickTimeoutId = null;
  };

  const updatePromptEyes = (pointer: PointerPosition): void => {
    if (!template) {
      return;
    }

    const windowDimensions = readWindowDimensions();
    applyEyeOffsetPresentation(template.prompt, pointer, {
      clientWidth: windowDimensions.clientWidth,
      clientHeight: windowDimensions.clientHeight
    });
  };

  template = createCropOverlayTemplate(shadowRoot);
  document.documentElement.append(host);
  renderOverlayState();
  window.addEventListener("keydown", handleKeyDown, true);
  window.addEventListener("pointerdown", handlePointerDown, true);
  window.addEventListener("pointermove", handlePointerMove, true);
  window.addEventListener("pointerup", handlePointerUp, true);
  window.addEventListener("click", handleClick, true);
  window.addEventListener("scroll", handleViewportChange, true);
  window.addEventListener("resize", handleViewportChange, true);
}

function resolveHoverRect(
  pointer: PointerPosition,
  host: HTMLElement
): PageRect | null {
  const hit = getPageElementFromPoint(pointer, host);

  if (!hit.element || isCropOverlayElement(hit.element, host)) {
    return null;
  }

  const windowDimensions = readWindowDimensions();
  return getBestRectForElement(hit.element, {
    windowDimensions,
    coordinateSpace: "page",
    thresholds: getHoverDetectionThresholds(windowDimensions)
  });
}

function getHoverDetectionThresholds(windowDimensions = readWindowDimensions()) {
  return {
    maxDetectHeight: Math.max(
      windowDimensions.clientHeight + FIREFOX_DETECT_VIEWPORT_MARGIN,
      FIREFOX_MIN_MAX_DETECT_HEIGHT
    ),
    maxDetectWidth: Math.max(
      windowDimensions.clientWidth + FIREFOX_DETECT_VIEWPORT_MARGIN,
      FIREFOX_MIN_MAX_DETECT_WIDTH
    )
  };
}

function getPageElementFromPoint(pointer: PointerPosition, host: HTMLElement) {
  const previousDisplay = host.style.display;
  host.style.display = "none";

  try {
    return getElementFromPoint(pointer.x, pointer.y);
  } finally {
    host.style.display = previousDisplay;
  }
}

function toPagePoint(pointer: PointerPosition): PointerPosition {
  const windowDimensions = readWindowDimensions();
  return {
    x: pointer.x + windowDimensions.scrollX,
    y: pointer.y + windowDimensions.scrollY
  };
}

function projectPageRectToViewport(
  rect: PageRect | null,
  windowDimensions = readWindowDimensions()
): ViewportRect | null {
  return rect ? pageRectToViewportRect(rect, windowDimensions) : null;
}

function isPointInsidePageRect(point: PointerPosition, rect: PageRect): boolean {
  return (
    point.x >= rect.left &&
    point.x <= rect.right &&
    point.y >= rect.top &&
    point.y <= rect.bottom
  );
}

function isCropOverlayEvent(event: Event, host: HTMLElement): boolean {
  return event.composedPath().includes(host);
}

function isCropOverlayElement(element: Element, host: HTMLElement): boolean {
  const rootNode = element.getRootNode();
  if (rootNode instanceof ShadowRoot && rootNode.host === host) {
    return true;
  }

  return element === host || element.closest(`[${ROOT_ATTRIBUTE}="true"]`) === host;
}

function updateActionButtons(template: CropOverlayTemplate, rect: ViewportRect | null): void {
  if (!rect) {
    applyActionButtonsPresentation(
      template.actions,
      null,
      { clientWidth: 0, clientHeight: 0 },
      FALLBACK_ACTIONS_SIZE
    );
    return;
  }

  template.actions.hidden = false;
  const windowDimensions = readWindowDimensions();
  const actionsRect = template.actions.getBoundingClientRect();
  const actionsSize = {
    width: actionsRect.width || FALLBACK_ACTIONS_SIZE.width,
    height: actionsRect.height || FALLBACK_ACTIONS_SIZE.height
  };

  applyActionButtonsPresentation(
    template.actions,
    rect,
    {
      clientWidth: windowDimensions.clientWidth,
      clientHeight: windowDimensions.clientHeight
    },
    actionsSize
  );
}

interface CompletionToastOptions {
  readonly result: CropCapturePipelineResult;
  readonly message: string;
  readonly status: "copied" | "saved";
  readonly filename?: string;
}

function showCompletionToast(options: CompletionToastOptions): void {
  document.getElementById(TOAST_ROOT_ID)?.remove();

  const toast = createCropToastTemplate(options.message);
  toast.host.dataset.cropToastStatus = options.status;
  toast.host.dataset.cropToastAction = options.result.action;
  toast.host.dataset.cropToastWidth = String(options.result.outputWidth);
  toast.host.dataset.cropToastHeight = String(options.result.outputHeight);

  if (options.filename) {
    toast.host.dataset.cropToastFilename = options.filename;
  }

  let dismissTimeoutId: number | null = null;

  const removeToast = (): void => {
    if (dismissTimeoutId !== null) {
      window.clearTimeout(dismissTimeoutId);
      dismissTimeoutId = null;
    }

    toast.host.remove();
  };

  toast.closeButton.addEventListener("click", removeToast);
  document.documentElement.append(toast.host);
  dismissTimeoutId = window.setTimeout(removeToast, TOAST_AUTO_DISMISS_MS);
}

function downloadPngDataUrl(dataUrl: string, title: string): string {
  pngDataUrlToBlob(dataUrl);
  const filename = createPngFilename(title);
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.rel = "noopener";
  link.style.display = "none";
  document.documentElement.append(link);
  link.click();
  link.remove();

  return filename;
}

function getCropActionFromEvent(event: Event): CropAction | null {
  for (const eventTarget of event.composedPath()) {
    if (!(eventTarget instanceof HTMLElement)) {
      continue;
    }

    const action = eventTarget.dataset.cropAction;

    if (action === "copy" || action === "save" || action === "cancel") {
      return action;
    }
  }

  return null;
}

async function requestVisibleTabCapture(): Promise<CropCaptureVisibleTabResponse> {
  if (typeof chrome === "undefined" || !chrome.runtime?.sendMessage) {
    throw new Error("Chrome runtime messaging is unavailable.");
  }

  const response = await chrome.runtime.sendMessage(createCaptureVisibleTabRequest());

  if (!isCropCaptureVisibleTabResponse(response)) {
    throw new Error("Invalid capture response from background service worker.");
  }

  return response;
}

function createCaptureVisibleTabRequest(): CropCaptureVisibleTabRequest {
  return {
    type: CROP_CAPTURE_VISIBLE_TAB_MESSAGE
  };
}

function isCropCaptureVisibleTabResponse(
  message: unknown
): message is CropCaptureVisibleTabResponse {
  if (typeof message !== "object" || message === null || !("ok" in message)) {
    return false;
  }

  if (message.ok === true) {
    return "dataUrl" in message && typeof message.dataUrl === "string";
  }

  if (message.ok === false) {
    return "error" in message && typeof message.error === "string";
  }

  return false;
}

function waitForNextPaint(): Promise<void> {
  return new Promise((resolve) => {
    window.requestAnimationFrame(() => {
      window.setTimeout(resolve, 0);
    });
  });
}

function getViewportMetrics(): ViewportMetrics {
  const windowDimensions = readWindowDimensions();

  return {
    clientWidth: windowDimensions.clientWidth,
    clientHeight: windowDimensions.clientHeight,
    scrollX: windowDimensions.scrollX,
    scrollY: windowDimensions.scrollY
  };
}

function formatCaptureError(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === "string" && error.length > 0) {
    return error;
  }

  if (typeof chrome !== "undefined" && chrome.runtime?.lastError?.message) {
    return chrome.runtime.lastError.message;
  }

  return "Unknown error";
}
