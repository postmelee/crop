import {
  createCropOverlayTemplate,
  type CropOverlayTemplate,
  FLASH_CLASS,
  PANEL_ATTRIBUTE,
  ROOT_ATTRIBUTE,
  ROOT_ID
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

interface PointerPosition {
  readonly x: number;
  readonly y: number;
}

type CropAction = "copy" | "save" | "cancel";

const FALLBACK_ACTIONS_SIZE: ElementSize = {
  width: 242,
  height: 50
};
const PANEL_FLASH_DEBOUNCE_MS = 800;
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

  const shadowRoot = host.attachShadow({ mode: "open" });
  let template: CropOverlayTemplate | null = null;
  let pendingPointer: PointerPosition | null = null;
  let lastPointer: PointerPosition | null = null;
  let animationFrameId: number | null = null;
  let overlayState: CropOverlayState = createInitialOverlayState();

  const removeOverlay = (): void => {
    window.removeEventListener("keydown", handleKeyDown, true);
    window.removeEventListener("pointerdown", handlePointerDown, true);
    window.removeEventListener("pointermove", handlePointerMove, true);
    window.removeEventListener("pointerup", handlePointerUp, true);
    window.removeEventListener("click", handleClick, true);
    window.removeEventListener("scroll", handleViewportChange, true);
    window.removeEventListener("resize", handleViewportChange, true);
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
      }

      return;
    }

    if (isCropOverlayEvent(event, host)) {
      return;
    }

    if (event.button !== 0) {
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
