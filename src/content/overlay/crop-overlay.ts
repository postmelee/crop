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
  applyDocumentOverlayPresentation,
  applyEyeOffsetPresentation,
  applyHighlightPresentation,
  applySelectionControlsPresentation,
  applySelectionMaskPresentation,
  applySelectionSizePresentation,
  type ElementSize
} from "./positioning";
import { getEdgeScrollDelta, getEdgeScrollPagePoint } from "./edge-scroll";
import {
  getSelectionKeyboardAdjustment,
  getSelectionInteractionAtPoint,
  isSelectionResizeHandle,
  type SelectionResizeHandle
} from "./selection-transform";
import {
  getBestRectForElement,
  getElementFromPoint
} from "../../firefox-derived/overlay-helpers";
import {
  captureFullPageTiles,
  capturePageRectTiles,
  type FullPageCaptureLoopResult
} from "./full-page-capture";
import {
  intersectRects,
  pageRectToViewportRect,
  readWindowDimensions,
  viewportRectToPageRect,
  type PageRect,
  type ViewportRect,
  type WindowDimensions
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
import { cropPngDataUrl, type ViewportCssSize } from "../../shared/crop-image";
import { createPngFilename } from "../../shared/filename";
import { getCropMessage } from "../../shared/i18n";
import {
  clipPageRectToViewport,
  getViewportRect,
  pageRectToViewportRect as pageRectToSharedViewportRect,
  type CropRect,
  type ViewportMetrics
} from "../../shared/rect";
import {
  getStitchPreviewTileLayout,
  stitchCapturedTiles,
  type StitchCapturedTilesResult,
  type StitchImageScale
} from "../../shared/stitch-image";

interface PointerPosition {
  readonly x: number;
  readonly y: number;
}

type CropAction = "copy" | "save" | "cancel" | "retry";
type CaptureAction = Exclude<CropAction, "cancel" | "retry">;
type CaptureMode = "visible" | "full-page";

const CROP_CAPTURE_VISIBLE_TAB_MESSAGE = "crop.captureVisibleTab";
const CROP_DOWNLOAD_PNG_MESSAGE = "crop.downloadPng";

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

interface CropDownloadPngRequest {
  readonly type: typeof CROP_DOWNLOAD_PNG_MESSAGE;
  readonly dataUrl: string;
  readonly filename: string;
}

type CropDownloadPngResponse =
  | {
      readonly ok: true;
      readonly downloadId: number;
    }
  | {
      readonly ok: false;
      readonly error: string;
    };

type CropRuntimeMessage = CropCaptureVisibleTabRequest | CropDownloadPngRequest;

interface CropContentChromeApi {
  readonly runtime?: {
    readonly lastError?: {
      readonly message?: string;
    };
    sendMessage(message: CropRuntimeMessage): Promise<unknown>;
  };
}

interface CropSingleImagePreviewModel {
  readonly kind: "single-image";
  readonly dataUrl: string;
}

interface CropTiledPreviewTile {
  readonly dataUrl: string;
  readonly viewportCropRect: CropRect;
  readonly destinationCssRect: CropRect;
  readonly viewportCssSize: {
    readonly clientWidth: number;
    readonly clientHeight: number;
  };
}

interface CropTiledPreviewModel {
  readonly kind: "tiled";
  readonly outputWidth: number;
  readonly outputHeight: number;
  readonly outputScale: StitchImageScale;
  readonly tiles: readonly CropTiledPreviewTile[];
}

type CropPreviewModel = CropSingleImagePreviewModel | CropTiledPreviewModel;

interface CropCapturePipelineResult {
  readonly action: CaptureAction;
  readonly mode: CaptureMode;
  readonly dataUrl: string;
  readonly previewModel?: CropPreviewModel;
  readonly viewportRect?: CropRect;
  readonly sourceRect?: CropRect;
  readonly outputWidth: number;
  readonly outputHeight: number;
  readonly tileCount?: number;
  readonly sourceScale?: StitchImageScale;
  readonly outputScale?: StitchImageScale;
  readonly downscaleRatio?: number;
  readonly downscaled?: boolean;
}

interface CaptureOverlayVisibilityOptions {
  readonly keepHiddenOnSuccess?: boolean;
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
const RECT_EDGE_EPSILON = 0.001;

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
  let edgeScrollFrameId: number | null = null;
  let lastDragPointer: PointerPosition | null = null;
  let overlayState: CropOverlayState = createInitialOverlayState();
  let suppressNextDocumentClick = false;
  let suppressDocumentClickTimeoutId: number | null = null;
  let pendingCapture = false;
  let overlayRemoved = false;
  let previousRenderedStatus: CropOverlayState["status"] | null = null;
  let selectedCaptureMode: CaptureMode = "visible";
  let previousCaptureVisibility: string | null = null;
  let captureOverlayHiddenDepth = 0;
  let previousDocumentScrollBehavior: string | null = null;
  let captureDocumentChromeStyle: HTMLStyleElement | null = null;
  let previewCaptureResult: CropCapturePipelineResult | null = null;
  let suppressedPageChromeElements:
    | Array<{
        readonly element: HTMLElement;
        readonly visibility: string;
      }>
    | null = null;

  const readOverlayWindowDimensions = (): WindowDimensions => {
    const previousMeasuringState = host.dataset.cropMeasuring;
    host.dataset.cropMeasuring = "true";

    try {
      return readWindowDimensions();
    } finally {
      if (previousMeasuringState === undefined) {
        delete host.dataset.cropMeasuring;
      } else {
        host.dataset.cropMeasuring = previousMeasuringState;
      }
    }
  };

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
    window.removeEventListener("wheel", handleWheel, true);
    window.removeEventListener("scroll", handleViewportChange, true);
    window.removeEventListener("resize", handleViewportChange, true);
    clearSuppressedDocumentClick();
    cancelPendingHoverUpdate();
    stopEdgeScroll();
    setCapturePageChromeSuppressed(false);
    setCaptureDocumentChromeSuppressed(false);
    host.remove();
  };

  const requestClose = (): void => {
    overlayState = transitionOverlayState(overlayState, { type: "cancel" });
    renderOverlayState();
    removeOverlay();
  };

  const handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      requestClose();
      return;
    }

    const previewShortcutAction = getPreviewKeyboardAction(event);

    if (previewCaptureResult && previewShortcutAction) {
      event.preventDefault();
      event.stopPropagation();
      startPreviewAction(previewShortcutAction);
      return;
    }

    const selectedShortcutAction = getCaptureKeyboardAction(event);

    if (
      selectedShortcutAction &&
      overlayState.status === "selected" &&
      overlayState.selectedRect &&
      !shouldIgnoreCaptureKeyboardTarget(event.target)
    ) {
      event.preventDefault();
      event.stopPropagation();
      startCaptureAction(selectedShortcutAction);
      return;
    }

    const keyboardAdjustment = getSelectionKeyboardAdjustment({
      key: event.key,
      shiftKey: event.shiftKey,
      altKey: event.altKey,
      ctrlKey: event.ctrlKey,
      metaKey: event.metaKey
    });

    if (
      !keyboardAdjustment ||
      overlayState.status !== "selected" ||
      !overlayState.selectedRect ||
      shouldIgnoreSelectionKeyboardTarget(event.target)
    ) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    overlayState = transitionOverlayState(overlayState, {
      type: "selectionKeyboardAdjust",
      adjustment: keyboardAdjustment
    });
    renderOverlayState();
  };

  const handlePointerMove = (event: PointerEvent): void => {
    const pointer = {
      x: event.clientX,
      y: event.clientY
    };
    lastPointer = pointer;
    const pagePointer = toPagePoint(pointer, readOverlayWindowDimensions());

    updatePromptEyes(pointer);

    if (overlayState.status === "draggingReady" || overlayState.status === "dragging") {
      event.preventDefault();
      event.stopPropagation();
      overlayState = transitionOverlayState(overlayState, {
        type: "dragMove",
        point: pagePointer
      });
      renderOverlayState();
      updateEdgeScroll(pointer);
      return;
    }

    if (isSelectionAdjusting(overlayState)) {
      event.preventDefault();
      event.stopPropagation();
      overlayState = transitionOverlayState(overlayState, {
        type: "selectionAdjustMove",
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
    if (event.button !== 0) {
      return;
    }

    if (overlayState.status === "selected") {
      const pagePointer = toPagePoint(
        {
          x: event.clientX,
          y: event.clientY
        },
        readOverlayWindowDimensions()
      );
      const explicitResizeHandle = getSelectionResizeHandleFromEvent(event);
      const isExplicitMove = isSelectionMoveEvent(event);

      if (getCropActionFromEvent(event)) {
        return;
      }

      if (explicitResizeHandle) {
        event.preventDefault();
        event.stopPropagation();
        suppressFollowingDocumentClick();
        cancelPendingHoverUpdate();
        stopEdgeScroll();
        overlayState = transitionOverlayState(overlayState, {
          type: "selectionResizeStart",
          handle: explicitResizeHandle,
          point: pagePointer
        });
        renderOverlayState();
        return;
      }

      if (isExplicitMove) {
        event.preventDefault();
        event.stopPropagation();
        suppressFollowingDocumentClick();
        cancelPendingHoverUpdate();
        stopEdgeScroll();
        overlayState = transitionOverlayState(overlayState, {
          type: "selectionMoveStart",
          point: pagePointer
        });
        renderOverlayState();
        return;
      }

      if (isCropOverlayEvent(event, host)) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      suppressFollowingDocumentClick();

      const selectionInteraction = overlayState.selectedRect
        ? getSelectionInteractionAtPoint(overlayState.selectedRect, pagePointer)
        : null;

      if (!selectionInteraction) {
        overlayState = transitionOverlayState(overlayState, { type: "resetSelection" });
        selectedCaptureMode = "visible";
        cancelPendingHoverUpdate();
        renderOverlayState();
        return;
      }

      cancelPendingHoverUpdate();
      stopEdgeScroll();
      overlayState =
        selectionInteraction.type === "resize"
          ? transitionOverlayState(overlayState, {
              type: "selectionResizeStart",
              handle: selectionInteraction.handle,
              point: pagePointer
            })
          : transitionOverlayState(overlayState, {
              type: "selectionMoveStart",
              point: pagePointer
            });
      renderOverlayState();
      return;
    }

    if (isCropOverlayEvent(event, host)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    cancelPendingHoverUpdate();
    stopEdgeScroll();
    selectedCaptureMode = "visible";
    overlayState = transitionOverlayState(overlayState, {
      type: "dragStart",
      point: toPagePoint(
        {
          x: event.clientX,
          y: event.clientY
        },
        readOverlayWindowDimensions()
      )
    });
    renderOverlayState();
  };

  const handlePointerUp = (event: PointerEvent): void => {
    if (isSelectionAdjusting(overlayState)) {
      event.preventDefault();
      event.stopPropagation();
      overlayState = transitionOverlayState(overlayState, { type: "selectionAdjustEnd" });
      cancelPendingHoverUpdate();
      renderOverlayState();
      return;
    }

    if (overlayState.status !== "draggingReady" && overlayState.status !== "dragging") {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    stopEdgeScroll();
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
      rect: resolveHoverRect(pointer, host, readOverlayWindowDimensions())
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
      } else if (action === "retry") {
        if (previewCaptureResult?.mode === "visible") {
          startVisibleViewportPreview();
        } else {
          startFullPagePreview();
        }
      } else if (previewCaptureResult) {
        startPreviewAction(action);
      } else {
        startCaptureAction(action);
      }

      return;
    }

    const mode = getCropModeFromEvent(event);

    if (mode) {
      event.preventDefault();
      event.stopPropagation();

      if (mode === "full-page") {
        startFullPagePreview();
      } else {
        startVisibleViewportPreview();
      }

      return;
    }

    if (previewCaptureResult && !pendingCapture && isPreviewBackdropEvent(event)) {
      event.preventDefault();
      event.stopPropagation();
      requestClose();
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
      rect:
        overlayState.hoverRect ??
        resolveHoverRect(
          {
            x: event.clientX,
            y: event.clientY
          },
          host,
          readOverlayWindowDimensions()
        )
    });
    selectedCaptureMode = "visible";
    previewCaptureResult = null;
    setPreviewCaptureResult(null);
    cancelPendingHoverUpdate();
    renderOverlayState();
  };

  const handleWheel = (event: WheelEvent): void => {
    if (!previewCaptureResult || !isCropOverlayEvent(event, host)) {
      return;
    }

    event.stopPropagation();

    if (!isPreviewScrollableEvent(event)) {
      event.preventDefault();
    }
  };

  const startVisibleViewportPreview = (): void => {
    if (pendingCapture) {
      return;
    }

    pendingCapture = true;
    selectedCaptureMode = "visible";
    previewCaptureResult = null;
    setPreviewCaptureResult(null);
    setModeCapturePending(true);
    setActionStatus(null);
    overlayState = transitionOverlayState(overlayState, { type: "resetSelection" });
    cancelPendingHoverUpdate();
    stopEdgeScroll();
    renderOverlayState();

    void captureVisibleViewportRegion("copy")
      .then((result) => {
        if (overlayRemoved) {
          return;
        }

        previewCaptureResult = result;
        recordCaptureSuccess(result);
        setPreviewCaptureResult(result);
      })
      .catch((error) => {
        if (overlayRemoved) {
          return;
        }

        recordCaptureFailure(error, "copy");
        console.warn(`[crop] Failed to capture visible viewport: ${formatCaptureError(error)}.`);
      })
      .finally(() => {
        pendingCapture = false;

        if (!overlayRemoved) {
          setModeCapturePending(false);
          renderOverlayState();
        }
      });
  };

  const startFullPagePreview = (): void => {
    if (pendingCapture) {
      return;
    }

    pendingCapture = true;
    selectedCaptureMode = "full-page";
    previewCaptureResult = null;
    setPreviewCaptureResult(null);
    setModeCapturePending(true);
    setActionStatus(null);
    overlayState = transitionOverlayState(overlayState, { type: "resetSelection" });
    cancelPendingHoverUpdate();
    stopEdgeScroll();
    renderOverlayState();

    void captureFullPageRegion("copy")
      .then((result) => {
        if (overlayRemoved) {
          return;
        }

        previewCaptureResult = result;
        recordCaptureSuccess(result);
        setPreviewCaptureResult(result);
      })
      .catch((error) => {
        if (overlayRemoved) {
          return;
        }

        selectedCaptureMode = "visible";
        recordCaptureFailure(error, "copy");
        console.warn(`[crop] Failed to capture full page: ${formatCaptureError(error)}.`);
      })
      .finally(() => {
        pendingCapture = false;

        if (!overlayRemoved) {
          setModeCapturePending(false);
          renderOverlayState();
        }
      });
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
    try {
      const result = await captureSelectedRegion(action, selectedRect, {
        keepHiddenOnSuccess: true
      });

      if (overlayRemoved) {
        return;
      }

      recordCaptureSuccess(result);

      if (result.action === "copy") {
        await writePngDataUrlToClipboard(result.dataUrl);
        host.dataset.cropClipboardStatus = "ok";
        showCompletionToast({
          result,
          message: getCropMessage("copySuccessToast"),
          status: "copied"
        });
        removeOverlay();
        return;
      }

      const filename = await requestPngDownload(result.dataUrl, document.title);
      host.dataset.cropDownloadStatus = "ok";
      host.dataset.cropDownloadFilename = filename;
      removeOverlay();
    } catch (error) {
      setCaptureOverlayHidden(false);
      throw error;
    }
  };

  const startPreviewAction = (action: CaptureAction): void => {
    if (pendingCapture || !previewCaptureResult) {
      return;
    }

    pendingCapture = true;
    setPreviewStatus(null);
    setPreviewPending(true);

    void performPreviewAction(action, previewCaptureResult)
      .catch((error) => {
        if (overlayRemoved) {
          return;
        }

        recordCaptureFailure(error, action);
        setPreviewStatus(getCaptureFailureMessage(action), action);
      })
      .finally(() => {
        pendingCapture = false;

        if (!overlayRemoved) {
          setPreviewPending(false);
        }
      });
  };

  const performPreviewAction = async (
    action: CaptureAction,
    previewResult: CropCapturePipelineResult
  ): Promise<void> => {
    const result = {
      ...previewResult,
      action
    };

    recordCaptureSuccess(result);

    if (action === "copy") {
      await writePngDataUrlToClipboard(result.dataUrl);
      host.dataset.cropClipboardStatus = "ok";
      showCompletionToast({
        result,
        message: getCropMessage("copySuccessToast"),
        status: "copied"
      });
      removeOverlay();
      return;
    }

    const filename = await requestPngDownload(result.dataUrl, document.title);
    host.dataset.cropDownloadStatus = "ok";
    host.dataset.cropDownloadFilename = filename;
    removeOverlay();
  };

  const recordCaptureSuccess = (result: CropCapturePipelineResult): void => {
    captureHost.__cropLastCaptureResult = result;
    host.dataset.cropCaptureStatus = "ok";
    host.dataset.cropCaptureAction = result.action;
    host.dataset.cropCaptureMode = result.mode;
    host.dataset.cropCaptureWidth = String(result.outputWidth);
    host.dataset.cropCaptureHeight = String(result.outputHeight);
    if (result.tileCount != null) {
      host.dataset.cropCaptureTileCount = String(result.tileCount);
    } else {
      delete host.dataset.cropCaptureTileCount;
    }
    if (result.downscaled != null) {
      host.dataset.cropCaptureDownscaled = String(result.downscaled);
    } else {
      delete host.dataset.cropCaptureDownscaled;
    }
    if (result.downscaleRatio != null) {
      host.dataset.cropCaptureDownscaleRatio = String(result.downscaleRatio);
    } else {
      delete host.dataset.cropCaptureDownscaleRatio;
    }
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
      setActionStatus(getCaptureFailureMessage(action), action);
    } else {
      host.dataset.cropDownloadStatus = "error";
      delete host.dataset.cropClipboardStatus;
      setActionStatus(getCaptureFailureMessage(action), action);
    }
  };

  const captureSelectedRegion = async (
    action: CaptureAction,
    selectedRect: PageRect,
    visibilityOptions: CaptureOverlayVisibilityOptions = {}
  ): Promise<CropCapturePipelineResult> => {
    const viewport = getViewportMetrics();
    const viewportRect = clipPageRectToViewport(selectedRect, viewport);

    if (!viewportRect || !isPageRectFullyInsideViewport(selectedRect, viewport, viewportRect)) {
      return captureSelectedPageRectRegion(action, selectedRect, visibilityOptions);
    }

    return captureVisibleSelectedRegion(action, selectedRect, visibilityOptions);
  };

  const captureVisibleSelectedRegion = async (
    action: CaptureAction,
    selectedRect: PageRect,
    visibilityOptions: CaptureOverlayVisibilityOptions
  ): Promise<CropCapturePipelineResult> => {
    const cropResult = await captureWithOverlayHidden(async () => {
      const viewport = getViewportMetrics();
      const viewportRect = clipPageRectToViewport(selectedRect, viewport);
      const captureViewportCssSize = getCaptureViewportCssSize(viewport);

      if (!viewportRect) {
        throw new Error("Selected area is outside the visible viewport.");
      }

      await waitForNextPaint();
      const captureResponse = await requestVisibleTabCapture();

      if (!captureResponse.ok) {
        throw new Error(captureResponse.error);
      }

      return {
        viewportRect,
        cropResult: await cropPngDataUrl({
          dataUrl: captureResponse.dataUrl,
          viewportCropRect: viewportRect,
          viewportCssSize: captureViewportCssSize
        })
      };
    }, visibilityOptions);

    return {
      action,
      mode: "visible",
      dataUrl: cropResult.cropResult.dataUrl,
      viewportRect: cropResult.viewportRect,
      sourceRect: cropResult.cropResult.sourceRect,
      outputWidth: cropResult.cropResult.outputWidth,
      outputHeight: cropResult.cropResult.outputHeight
    };
  };

  const captureSelectedPageRectRegion = async (
    action: CaptureAction,
    selectedRect: PageRect,
    visibilityOptions: CaptureOverlayVisibilityOptions
  ): Promise<CropCapturePipelineResult> => {
    let stitchResult: StitchCapturedTilesResult;

    try {
      setCaptureDocumentChromeSuppressed(true);

      const captureResult = await capturePageRectTiles({
        pageRect: selectedRect,
        captureVisibleTab: captureVisibleTabDataUrl,
        setOverlayHidden: setCaptureOverlayHidden,
        setScrollBehaviorDisabled: setCaptureScrollBehaviorDisabled,
        beforeCaptureTile: () => {
          setCapturePageChromeSuppressed(true);
        },
        afterCaptureTile: () => {
          setCapturePageChromeSuppressed(false);
        }
      });

      stitchResult = await stitchCapturedTiles({
        outputCssSize: captureResult.plan.outputCssSize,
        tiles: captureResult.tiles.map((tile) => ({
          dataUrl: tile.dataUrl,
          viewportCropRect: tile.viewportCropRect,
          destinationCssRect: tile.destinationCssRect,
          viewportCssSize: captureResult.plan.viewportCssSize
        }))
      });

      if (visibilityOptions.keepHiddenOnSuccess) {
        setCaptureOverlayHidden(true);
      }
    } finally {
      setCapturePageChromeSuppressed(false);
      setCaptureDocumentChromeSuppressed(false);
    }

    return {
      action,
      mode: "visible",
      dataUrl: stitchResult.dataUrl,
      outputWidth: stitchResult.outputWidth,
      outputHeight: stitchResult.outputHeight,
      tileCount: stitchResult.drawnTiles,
      sourceScale: stitchResult.sourceScale,
      outputScale: stitchResult.outputScale,
      downscaleRatio: stitchResult.downscaleRatio,
      downscaled: stitchResult.downscaled
    };
  };

  const captureVisibleViewportRegion = async (
    action: CaptureAction
  ): Promise<CropCapturePipelineResult> => {
    const captureResult = await captureWithOverlayHidden(async () => {
      const viewport = getViewportMetrics();
      const viewportRect = getViewportRect(viewport);
      const captureViewportCssSize = getCaptureViewportCssSize(viewport);

      await waitForNextPaint();
      const captureResponse = await requestVisibleTabCapture();

      if (!captureResponse.ok) {
        throw new Error(captureResponse.error);
      }

      return {
        viewportRect,
        cropResult: await cropPngDataUrl({
          dataUrl: captureResponse.dataUrl,
          viewportCropRect: viewportRect,
          viewportCssSize: captureViewportCssSize
        })
      };
    });

    return {
      action,
      mode: "visible",
      dataUrl: captureResult.cropResult.dataUrl,
      previewModel: {
        kind: "single-image",
        dataUrl: captureResult.cropResult.dataUrl
      },
      viewportRect: captureResult.viewportRect,
      sourceRect: captureResult.cropResult.sourceRect,
      outputWidth: captureResult.cropResult.outputWidth,
      outputHeight: captureResult.cropResult.outputHeight
    };
  };

  const captureFullPageRegion = async (
    action: CaptureAction
  ): Promise<CropCapturePipelineResult> => {
    let captureResult: FullPageCaptureLoopResult;
    let stitchResult: StitchCapturedTilesResult;

    try {
      setCaptureDocumentChromeSuppressed(true);

      captureResult = await captureFullPageTiles({
        captureVisibleTab: captureVisibleTabDataUrl,
        setOverlayHidden: setCaptureOverlayHidden,
        setScrollBehaviorDisabled: setCaptureScrollBehaviorDisabled,
        beforeCaptureTile: (_tile, index) => {
          setCapturePageChromeSuppressed(index > 0);
        },
        afterCaptureTile: () => {
          setCapturePageChromeSuppressed(false);
        }
      });

      stitchResult = await stitchCapturedTiles({
        outputCssSize: captureResult.plan.outputCssSize,
        tiles: captureResult.tiles.map((tile) => ({
          dataUrl: tile.dataUrl,
          viewportCropRect: tile.viewportCropRect,
          destinationCssRect: tile.destinationCssRect,
          viewportCssSize: captureResult.plan.viewportCssSize
        }))
      });
    } finally {
      setCapturePageChromeSuppressed(false);
      setCaptureDocumentChromeSuppressed(false);
    }

    return {
      action,
      mode: "full-page",
      dataUrl: stitchResult.dataUrl,
      previewModel: {
        kind: "tiled",
        outputWidth: stitchResult.outputWidth,
        outputHeight: stitchResult.outputHeight,
        outputScale: stitchResult.outputScale,
        tiles: captureResult.tiles.map((tile) => ({
          dataUrl: tile.dataUrl,
          viewportCropRect: tile.viewportCropRect,
          destinationCssRect: tile.destinationCssRect,
          viewportCssSize: captureResult.plan.viewportCssSize
        }))
      },
      outputWidth: stitchResult.outputWidth,
      outputHeight: stitchResult.outputHeight,
      tileCount: stitchResult.drawnTiles,
      sourceScale: stitchResult.sourceScale,
      outputScale: stitchResult.outputScale,
      downscaleRatio: stitchResult.downscaleRatio,
      downscaled: stitchResult.downscaled
    };
  };

  const captureVisibleTabDataUrl = async (): Promise<string> => {
    const response = await requestVisibleTabCapture();

    if (!response.ok) {
      throw new Error(response.error);
    }

    return response.dataUrl;
  };

  const captureWithOverlayHidden = async <Result>(
    capture: () => Promise<Result>,
    visibilityOptions: CaptureOverlayVisibilityOptions = {}
  ): Promise<Result> => {
    setCaptureOverlayHidden(true);
    let completed = false;

    try {
      const result = await capture();
      completed = true;
      return result;
    } finally {
      if (!visibilityOptions.keepHiddenOnSuccess || !completed) {
        setCaptureOverlayHidden(false);
      }
    }
  };

  const setCaptureOverlayHidden = (hidden: boolean): void => {
    if (hidden) {
      if (captureOverlayHiddenDepth === 0) {
        previousCaptureVisibility = host.style.visibility;
        host.style.visibility = "hidden";
      }

      captureOverlayHiddenDepth += 1;
      return;
    }

    if (captureOverlayHiddenDepth === 0) {
      return;
    }

    captureOverlayHiddenDepth -= 1;

    if (captureOverlayHiddenDepth > 0) {
      return;
    }

    host.style.visibility = previousCaptureVisibility ?? "";
    previousCaptureVisibility = null;
  };

  const setCaptureScrollBehaviorDisabled = (disabled: boolean): void => {
    const documentElement = document.documentElement;

    if (disabled) {
      if (previousDocumentScrollBehavior === null) {
        previousDocumentScrollBehavior = documentElement.style.scrollBehavior;
      }

      documentElement.style.scrollBehavior = "auto";
      return;
    }

    if (previousDocumentScrollBehavior === null) {
      return;
    }

    documentElement.style.scrollBehavior = previousDocumentScrollBehavior;
    previousDocumentScrollBehavior = null;
  };

  const setCaptureDocumentChromeSuppressed = (suppressed: boolean): void => {
    if (suppressed) {
      if (captureDocumentChromeStyle) {
        return;
      }

      const style = document.createElement("style");
      style.setAttribute("data-crop-capture-style", "true");
      style.textContent = `
        html, body, * {
          scrollbar-width: none !important;
        }

        ::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
      `;
      (document.head ?? document.documentElement).append(style);
      captureDocumentChromeStyle = style;
      return;
    }

    captureDocumentChromeStyle?.remove();
    captureDocumentChromeStyle = null;
  };

  const setCapturePageChromeSuppressed = (suppressed: boolean): void => {
    if (suppressed) {
      if (suppressedPageChromeElements) {
        return;
      }

      suppressedPageChromeElements = collectFullPageChromeElements(host).map((element) => ({
        element,
        visibility: element.style.visibility
      }));

      for (const entry of suppressedPageChromeElements) {
        entry.element.style.visibility = "hidden";
      }

      return;
    }

    if (!suppressedPageChromeElements) {
      return;
    }

    for (const entry of suppressedPageChromeElements) {
      entry.element.style.visibility = entry.visibility;
    }

    suppressedPageChromeElements = null;
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

  const setModeCapturePending = (isPending: boolean): void => {
    if (isPending) {
      host.dataset.cropModeCapturePending = "true";
      return;
    }

    delete host.dataset.cropModeCapturePending;
  };

  const setPreviewCaptureResult = (result: CropCapturePipelineResult | null): void => {
    if (!template) {
      return;
    }

    if (!result) {
      delete host.dataset.cropPreview;
      delete host.dataset.cropPreviewRenderer;
      template.preview.container.hidden = true;
      template.preview.image.removeAttribute("src");
      template.preview.image.hidden = false;
      clearPreviewTiledLayer();
      setPreviewStatus(null);
      return;
    }

    host.dataset.cropPreview = "true";
    template.preview.container.hidden = false;
    renderPreviewModel(result.previewModel ?? { kind: "single-image", dataUrl: result.dataUrl });
    setPreviewStatus(null);
  };

  const clearPreviewTiledLayer = (): void => {
    if (!template) {
      return;
    }

    template.preview.tiled.hidden = true;
    template.preview.tiled.replaceChildren();
    template.preview.tiled.removeAttribute("style");
    delete template.preview.tiled.dataset.cropTileCount;
    delete template.preview.tiled.dataset.cropPreviewScale;
  };

  const renderPreviewModel = (model: CropPreviewModel): void => {
    if (!template) {
      return;
    }

    if (model.kind === "tiled") {
      renderTiledPreviewModel(model);
      return;
    }

    host.dataset.cropPreviewRenderer = "image";
    clearPreviewTiledLayer();
    template.preview.image.hidden = false;
    template.preview.image.src = model.dataUrl;
  };

  const renderTiledPreviewModel = (model: CropTiledPreviewModel): void => {
    if (!template) {
      return;
    }

    host.dataset.cropPreviewRenderer = "tiled";
    template.preview.image.removeAttribute("src");
    template.preview.image.hidden = true;
    template.preview.tiled.hidden = false;
    template.preview.tiled.replaceChildren();
    const previewScale = getTiledPreviewDisplayScale(model.outputWidth);
    template.preview.tiled.style.width = toCssPixel(model.outputWidth * previewScale);
    template.preview.tiled.style.height = toCssPixel(model.outputHeight * previewScale);
    template.preview.tiled.dataset.cropTileCount = String(model.tiles.length);
    template.preview.tiled.dataset.cropPreviewScale = formatFiniteNumber(previewScale);

    const tileLayer = document.createElement("div");
    tileLayer.className = "crop-preview-tiled-layer";
    tileLayer.style.width = toCssPixel(model.outputWidth);
    tileLayer.style.height = toCssPixel(model.outputHeight);
    tileLayer.style.transform = `scale(${formatFiniteNumber(previewScale)})`;

    const fragment = document.createDocumentFragment();

    for (const tile of model.tiles) {
      const tileLayout = getStitchPreviewTileLayout({
        viewportCropRect: tile.viewportCropRect,
        destinationCssRect: tile.destinationCssRect,
        viewportCssSize: tile.viewportCssSize,
        outputScale: model.outputScale
      });
      const tileElement = document.createElement("div");
      tileElement.className = "crop-preview-tile";
      tileElement.style.left = toCssPixel(tileLayout.tileRect.left);
      tileElement.style.top = toCssPixel(tileLayout.tileRect.top);
      tileElement.style.width = toCssPixel(tileLayout.tileRect.width);
      tileElement.style.height = toCssPixel(tileLayout.tileRect.height);

      const tileImage = document.createElement("img");
      tileImage.className = "crop-preview-tile-image";
      tileImage.alt = "";
      tileImage.decoding = "async";
      tileImage.draggable = false;
      tileImage.src = tile.dataUrl;
      tileImage.style.left = toCssPixel(tileLayout.imageRect.left);
      tileImage.style.top = toCssPixel(tileLayout.imageRect.top);
      tileImage.style.width = toCssPixel(tileLayout.imageRect.width);
      tileImage.style.height = toCssPixel(tileLayout.imageRect.height);

      tileElement.append(tileImage);
      fragment.append(tileElement);
    }

    tileLayer.append(fragment);
    template.preview.tiled.append(tileLayer);
  };

  const getTiledPreviewDisplayScale = (outputWidth: number): number => {
    if (!Number.isFinite(outputWidth) || outputWidth <= 0) {
      return 1;
    }

    const previewTemplate = template;

    if (!previewTemplate) {
      return 1;
    }

    const surfaceStyle = getComputedStyle(previewTemplate.preview.surface);
    const horizontalPadding =
      parseCssPixelValue(surfaceStyle.paddingLeft) + parseCssPixelValue(surfaceStyle.paddingRight);
    const availableWidth = previewTemplate.preview.surface.clientWidth - horizontalPadding;

    if (!Number.isFinite(availableWidth) || availableWidth <= 0) {
      return 1;
    }

    return Math.min(1, availableWidth / outputWidth);
  };

  const setPreviewPending = (isPending: boolean): void => {
    if (!template) {
      return;
    }

    if (isPending) {
      template.preview.actions.setAttribute("aria-busy", "true");
    } else {
      template.preview.actions.removeAttribute("aria-busy");
    }
  };

  const setPreviewStatus = (message: string | null, action?: CaptureAction): void => {
    if (!template) {
      return;
    }

    if (!message) {
      template.preview.status.hidden = true;
      template.preview.status.textContent = "";
      delete template.preview.status.dataset.cropActionStatus;
      return;
    }

    template.preview.status.hidden = false;
    template.preview.status.textContent = message;

    if (action) {
      template.preview.status.dataset.cropActionStatus = action;
    }
  };

  const renderOverlayState = (): void => {
    const previousStatus = previousRenderedStatus;
    previousRenderedStatus = overlayState.status;
    host.setAttribute("data-crop-state", overlayState.status);
    host.dataset.cropCaptureMode = selectedCaptureMode;

    if (template) {
      const windowDimensions = readOverlayWindowDimensions();
      applyDocumentOverlayPresentation(host, windowDimensions);
      updateModeButtons(template, selectedCaptureMode);

      if (previewCaptureResult) {
        template.selectionMask.container.hidden = true;
        applyHighlightPresentation(template.highlight, null);
        applySelectionControlsPresentation(template.selectionControls.container, null);
        applySelectionSizePresentation(template.selectionControls.sizeBadge, null, null);
        updateActionButtons(template, null, {
          clientWidth: windowDimensions.clientWidth,
          clientHeight: windowDimensions.clientHeight
        });
        return;
      }

      const activePageRect = overlayState.selectedRect ?? overlayState.hoverRect;
      const selectionPageRect = isSelectionVisibleStatus(overlayState.status)
        ? overlayState.selectedRect
        : null;
      const visibleSelectionPageRect = selectionPageRect
        ? intersectRects(selectionPageRect, windowDimensions.pageViewportRect)
        : null;
      const selectionViewportRect = selectionPageRect
        ? projectPageRectToViewport(selectionPageRect, windowDimensions)
        : null;
      const selectionMaskNullRectMode =
        isSelectionVisibleStatus(overlayState.status) &&
        selectionPageRect &&
        !visibleSelectionPageRect
          ? "solid"
          : "hidden";
      template.selectionMask.container.hidden = !activePageRect;
      applyHighlightPresentation(template.highlight, activePageRect);
      applySelectionControlsPresentation(
        template.selectionControls.container,
        isSelectionActionVisibleStatus(overlayState.status) && selectedCaptureMode !== "full-page"
          ? selectionPageRect
          : null
      );
      applySelectionSizePresentation(
        template.selectionControls.sizeBadge,
        isSelectionActionVisibleStatus(overlayState.status) && selectedCaptureMode !== "full-page"
          ? overlayState.selectedRect
          : null,
        visibleSelectionPageRect
      );
      applySelectionMaskPresentation(template.selectionMask, selectionPageRect, {
        nullRectMode: selectionMaskNullRectMode,
        containerSize: {
          width: windowDimensions.scrollWidth,
          height: windowDimensions.scrollHeight
        }
      });
      template.highlight.classList.toggle(
        "crop-highlight--selected",
        isSelectionVisibleStatus(overlayState.status)
      );
      updateActionButtons(
        template,
        isSelectionActionVisibleStatus(overlayState.status) ? selectionViewportRect : null,
        {
          clientWidth: windowDimensions.clientWidth,
          clientHeight: windowDimensions.clientHeight
        }
      );

      if (overlayState.status === "selected" && previousStatus !== "selected") {
        focusFirefoxReferenceActionButton(template);
      }
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

  const updateEdgeScroll = (pointer: PointerPosition): void => {
    lastDragPointer = pointer;
    const windowDimensions = readOverlayWindowDimensions();
    const edgeScrollDelta = getEdgeScrollDelta(pointer, {
      clientWidth: windowDimensions.clientWidth,
      clientHeight: windowDimensions.clientHeight
    });

    if (!edgeScrollDelta.active) {
      cancelEdgeScrollFrame();
      return;
    }

    if (edgeScrollFrameId !== null) {
      return;
    }

    edgeScrollFrameId = window.requestAnimationFrame(processEdgeScroll);
  };

  const processEdgeScroll = (): void => {
    edgeScrollFrameId = null;

    if (
      overlayRemoved ||
      !lastDragPointer ||
      (overlayState.status !== "draggingReady" && overlayState.status !== "dragging")
    ) {
      return;
    }

    const beforeScroll = readOverlayWindowDimensions();
    const edgeScrollDelta = getEdgeScrollDelta(lastDragPointer, {
      clientWidth: beforeScroll.clientWidth,
      clientHeight: beforeScroll.clientHeight
    });

    if (!edgeScrollDelta.active) {
      return;
    }

    window.scrollBy(edgeScrollDelta.x, edgeScrollDelta.y);
    const afterScroll = readOverlayWindowDimensions();
    const didScroll =
      beforeScroll.scrollX !== afterScroll.scrollX || beforeScroll.scrollY !== afterScroll.scrollY;

    if (!didScroll) {
      return;
    }

    overlayState = transitionOverlayState(overlayState, {
      type: "dragMove",
      point: getEdgeScrollPagePoint(lastDragPointer, afterScroll)
    });
    renderOverlayState();
    edgeScrollFrameId = window.requestAnimationFrame(processEdgeScroll);
  };

  const stopEdgeScroll = (): void => {
    lastDragPointer = null;
    cancelEdgeScrollFrame();
  };

  const cancelEdgeScrollFrame = (): void => {
    if (edgeScrollFrameId === null) {
      return;
    }

    window.cancelAnimationFrame(edgeScrollFrameId);
    edgeScrollFrameId = null;
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

    const windowDimensions = readOverlayWindowDimensions();
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
  window.addEventListener("wheel", handleWheel, { capture: true, passive: false });
  window.addEventListener("scroll", handleViewportChange, true);
  window.addEventListener("resize", handleViewportChange, true);
}

function resolveHoverRect(
  pointer: PointerPosition,
  host: HTMLElement,
  windowDimensions = readWindowDimensions()
): PageRect | null {
  const hit = getPageElementFromPoint(pointer, host);

  if (!hit.element || isCropOverlayElement(hit.element, host)) {
    return null;
  }

  if (hit.rect) {
    return viewportRectToPageRect(hit.rect, windowDimensions);
  }

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

function toPagePoint(
  pointer: PointerPosition,
  windowDimensions = readWindowDimensions()
): PointerPosition {
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

function isSelectionVisibleStatus(status: CropOverlayState["status"]): boolean {
  return status === "selected" || status === "dragging" || isSelectionAdjustmentStatus(status);
}

function isSelectionActionVisibleStatus(status: CropOverlayState["status"]): boolean {
  return status === "selected" || isSelectionAdjustmentStatus(status);
}

function isSelectionAdjusting(state: CropOverlayState): boolean {
  return isSelectionAdjustmentStatus(state.status);
}

function isSelectionAdjustmentStatus(status: CropOverlayState["status"]): boolean {
  return status === "moving" || status === "resizing";
}

function isCropOverlayEvent(event: Event, host: HTMLElement): boolean {
  return event.composedPath().some((eventTarget) => {
    if (!(eventTarget instanceof HTMLElement) || eventTarget === host) {
      return false;
    }

    if (
      eventTarget.dataset.cropAction ||
      eventTarget.dataset.cropMode ||
      eventTarget.dataset.cropResizeHandle ||
      eventTarget.dataset.cropSelectionMove ||
      eventTarget.hasAttribute(PANEL_ATTRIBUTE)
    ) {
      return true;
    }

    return (
      eventTarget.classList.contains("crop-actions") ||
      eventTarget.classList.contains("crop-action-group") ||
      eventTarget.classList.contains("crop-action-status") ||
      eventTarget.classList.contains("crop-preview") ||
      eventTarget.classList.contains("crop-preview-dialog") ||
      eventTarget.classList.contains("crop-preview-surface") ||
      eventTarget.classList.contains("crop-preview-footer") ||
      eventTarget.classList.contains("crop-preview-actions") ||
      eventTarget.classList.contains("crop-preview-status")
    );
  });
}

function isPreviewScrollableEvent(event: Event): boolean {
  return event.composedPath().some((eventTarget) => {
    return (
      eventTarget instanceof HTMLElement &&
      eventTarget.classList.contains("crop-preview-surface")
    );
  });
}

function isPreviewBackdropEvent(event: Event): boolean {
  const [eventTarget] = event.composedPath();
  return eventTarget instanceof HTMLElement && eventTarget.classList.contains("crop-preview");
}

function isCropOverlayElement(element: Element, host: HTMLElement): boolean {
  const rootNode = element.getRootNode();
  if (rootNode instanceof ShadowRoot && rootNode.host === host) {
    return true;
  }

  return element === host || element.closest(`[${ROOT_ATTRIBUTE}="true"]`) === host;
}

function collectFullPageChromeElements(host: HTMLElement): HTMLElement[] {
  const body = document.body;

  if (!body) {
    return [];
  }

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const chromeElements: HTMLElement[] = [];

  for (const element of body.querySelectorAll<HTMLElement>("*")) {
    if (!(element instanceof HTMLElement) || isCropOverlayElement(element, host)) {
      continue;
    }

    const style = window.getComputedStyle(element);

    if (style.display === "none" || style.visibility === "hidden") {
      continue;
    }

    if (style.position !== "fixed" && style.position !== "sticky") {
      continue;
    }

    if (!isViewportRectVisible(element.getBoundingClientRect(), viewportWidth, viewportHeight)) {
      continue;
    }

    chromeElements.push(element);
  }

  return chromeElements;
}

function isViewportRectVisible(
  rect: DOMRect,
  viewportWidth: number,
  viewportHeight: number
): boolean {
  return rect.width > 0 && rect.height > 0 && rect.right > 0 && rect.bottom > 0 &&
    rect.left < viewportWidth && rect.top < viewportHeight;
}

function updateActionButtons(
  template: CropOverlayTemplate,
  rect: ViewportRect | null,
  viewport: { readonly clientWidth: number; readonly clientHeight: number }
): void {
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
  const actionsRect = template.actions.getBoundingClientRect();
  const actionsSize = {
    width: actionsRect.width || FALLBACK_ACTIONS_SIZE.width,
    height: actionsRect.height || FALLBACK_ACTIONS_SIZE.height
  };

  applyActionButtonsPresentation(
    template.actions,
    rect,
    viewport,
    actionsSize
  );
}

function updateModeButtons(template: CropOverlayTemplate, selectedMode: CaptureMode): void {
  for (const button of template.panel.querySelectorAll<HTMLButtonElement>("[data-crop-mode]")) {
    button.setAttribute(
      "aria-pressed",
      button.dataset.cropMode === selectedMode ? "true" : "false"
    );
  }
}

function focusFirefoxReferenceActionButton(template: CropOverlayTemplate): void {
  for (const button of template.actions.querySelectorAll<HTMLButtonElement>(".crop-action")) {
    delete button.dataset.cropFocusVisible;
  }

  const copyButton = template.actions.querySelector<HTMLButtonElement>('[data-crop-action="copy"]');

  if (!copyButton || copyButton.disabled) {
    return;
  }

  copyButton.dataset.cropFocusVisible = "true";
  copyButton.focus({ preventScroll: true });
}

function getCaptureFailureMessage(action: CaptureAction): string {
  return getCropMessage(action === "copy" ? "copyFailureSaveHint" : "saveFailureRetryHint");
}

interface CompletionToastOptions {
  readonly result: CropCapturePipelineResult;
  readonly message: string;
  readonly status: "copied";
}

function showCompletionToast(options: CompletionToastOptions): void {
  document.getElementById(TOAST_ROOT_ID)?.remove();

  const toast = createCropToastTemplate(options.message);
  toast.host.dataset.cropToastStatus = options.status;
  toast.host.dataset.cropToastAction = options.result.action;
  toast.host.dataset.cropToastWidth = String(options.result.outputWidth);
  toast.host.dataset.cropToastHeight = String(options.result.outputHeight);

  let dismissTimeoutId: number | null = null;

  const removeToast = (): void => {
    if (dismissTimeoutId !== null) {
      window.clearTimeout(dismissTimeoutId);
      dismissTimeoutId = null;
    }

    toast.host.remove();
  };

  document.documentElement.append(toast.host);
  window.requestAnimationFrame(() => {
    toast.host.shadowRoot
      ?.getElementById("confirmation-hint-checkmark-animation-container")
      ?.setAttribute("animate", "true");
  });
  dismissTimeoutId = window.setTimeout(removeToast, TOAST_AUTO_DISMISS_MS);
}

async function requestPngDownload(dataUrl: string, title: string): Promise<string> {
  pngDataUrlToBlob(dataUrl);
  const filename = createPngFilename(title);

  if (typeof chrome === "undefined" || !chrome.runtime?.sendMessage) {
    throw new Error("Chrome runtime messaging is unavailable.");
  }

  const response = await chrome.runtime.sendMessage(createDownloadPngRequest(dataUrl, filename));

  if (!isCropDownloadPngResponse(response)) {
    throw new Error("Invalid download response from background service worker.");
  }

  if (!response.ok) {
    throw new Error(response.error);
  }

  return filename;
}

function getCropActionFromEvent(event: Event): CropAction | null {
  for (const eventTarget of event.composedPath()) {
    if (!(eventTarget instanceof HTMLElement)) {
      continue;
    }

    const action = eventTarget.dataset.cropAction;

    if (action === "copy" || action === "save" || action === "cancel" || action === "retry") {
      return action;
    }
  }

  return null;
}

function getCropModeFromEvent(event: Event): CaptureMode | null {
  for (const eventTarget of event.composedPath()) {
    if (!(eventTarget instanceof HTMLElement)) {
      continue;
    }

    const mode = eventTarget.dataset.cropMode;

    if (mode === "visible" || mode === "full-page") {
      return mode;
    }
  }

  return null;
}

function getSelectionResizeHandleFromEvent(event: Event): SelectionResizeHandle | null {
  for (const eventTarget of event.composedPath()) {
    if (!(eventTarget instanceof HTMLElement)) {
      continue;
    }

    const handle = eventTarget.dataset.cropResizeHandle ?? null;

    if (isSelectionResizeHandle(handle)) {
      return handle;
    }
  }

  return null;
}

function isSelectionMoveEvent(event: Event): boolean {
  return event.composedPath().some((eventTarget) => {
    return (
      eventTarget instanceof HTMLElement &&
      eventTarget.dataset.cropSelectionMove === "true"
    );
  });
}

function shouldIgnoreSelectionKeyboardTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  if (shouldIgnoreCaptureKeyboardTarget(target)) {
    return true;
  }

  return Boolean(target.closest("[data-crop-action]"));
}

function shouldIgnoreCaptureKeyboardTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  if (target.isContentEditable) {
    return true;
  }

  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  );
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

function createDownloadPngRequest(dataUrl: string, filename: string): CropDownloadPngRequest {
  return {
    type: CROP_DOWNLOAD_PNG_MESSAGE,
    dataUrl,
    filename
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

function isCropDownloadPngResponse(message: unknown): message is CropDownloadPngResponse {
  if (typeof message !== "object" || message === null || !("ok" in message)) {
    return false;
  }

  if (message.ok === true) {
    return "downloadId" in message && typeof message.downloadId === "number";
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

function getCaptureViewportCssSize(fallback: ViewportMetrics): ViewportCssSize {
  return {
    clientWidth: getUsableCaptureViewportDimension(window.innerWidth, fallback.clientWidth),
    clientHeight: getUsableCaptureViewportDimension(window.innerHeight, fallback.clientHeight)
  };
}

function getUsableCaptureViewportDimension(value: number, fallback: number): number {
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function isPageRectFullyInsideViewport(
  pageRect: PageRect,
  viewport: ViewportMetrics,
  visibleViewportRect: CropRect
): boolean {
  return areRectEdgesApproximatelyEqual(
    pageRectToSharedViewportRect(pageRect, viewport),
    visibleViewportRect
  );
}

function areRectEdgesApproximatelyEqual(first: CropRect, second: CropRect): boolean {
  return (
    Math.abs(first.left - second.left) <= RECT_EDGE_EPSILON &&
    Math.abs(first.top - second.top) <= RECT_EDGE_EPSILON &&
    Math.abs(first.right - second.right) <= RECT_EDGE_EPSILON &&
    Math.abs(first.bottom - second.bottom) <= RECT_EDGE_EPSILON
  );
}

function toCssPixel(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  return `${Object.is(rounded, -0) ? 0 : rounded}px`;
}

function parseCssPixelValue(value: string): number {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatFiniteNumber(value: number): string {
  if (!Number.isFinite(value)) {
    return "1";
  }

  return String(Math.round(value * 10000) / 10000);
}

function getPreviewKeyboardAction(event: KeyboardEvent): CaptureAction | null {
  return getCaptureKeyboardAction(event);
}

function getCaptureKeyboardAction(event: KeyboardEvent): CaptureAction | null {
  if (!getAccelKey(event)) {
    return null;
  }

  switch (event.key) {
    case "c":
      return "copy";
    case "s":
      return "save";
    default:
      return null;
  }
}

function getAccelKey(event: KeyboardEvent): boolean {
  return isMacLikePlatform() ? event.metaKey : event.ctrlKey;
}

function isMacLikePlatform(): boolean {
  const platform = globalThis.navigator?.platform ?? "";

  return /Mac|iPhone|iPad|iPod/i.test(platform);
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
