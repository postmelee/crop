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
  applyHighlightPresentation,
  type ElementSize
} from "./positioning";
import {
  getBestRectForElement,
  getElementFromPoint
} from "../../firefox-derived/overlay-helpers";
import { readWindowDimensions, type ViewportRect } from "../../firefox-derived/window-dimensions";
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

  panel.classList.remove(FLASH_CLASS);
  void panel.offsetWidth;
  panel.classList.add(FLASH_CLASS);

  return true;
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
  let animationFrameId: number | null = null;
  let overlayState: CropOverlayState = createInitialOverlayState();

  const removeOverlay = (): void => {
    window.removeEventListener("keydown", handleKeyDown, true);
    window.removeEventListener("pointermove", handlePointerMove, true);
    window.removeEventListener("click", handleClick, true);
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
    if (overlayState.status === "selected") {
      return;
    }

    if (isCropOverlayEvent(event, host)) {
      clearHover();
      return;
    }

    queueHoverUpdate({
      x: event.clientX,
      y: event.clientY
    });
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
      const activeRect = overlayState.selectedRect ?? overlayState.hoverRect;
      applyHighlightPresentation(template.highlight, activeRect);
      template.highlight.classList.toggle(
        "crop-highlight--selected",
        overlayState.status === "selected"
      );
      updateActionButtons(template, overlayState.selectedRect);
    }
  };

  const cancelPendingHoverUpdate = (): void => {
    pendingPointer = null;

    if (animationFrameId === null) {
      return;
    }

    window.cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  };

  template = createCropOverlayTemplate(shadowRoot, requestClose);
  document.documentElement.append(host);
  renderOverlayState();
  window.addEventListener("keydown", handleKeyDown, true);
  window.addEventListener("pointermove", handlePointerMove, true);
  window.addEventListener("click", handleClick, true);
}

function resolveHoverRect(
  pointer: PointerPosition,
  host: HTMLElement
): ViewportRect | null {
  const hit = getElementFromPoint(pointer.x, pointer.y);

  if (!hit.element || isCropOverlayElement(hit.element, host)) {
    return null;
  }

  return getBestRectForElement(hit.element, {
    windowDimensions: readWindowDimensions()
  });
}

function isCropOverlayEvent(event: Event, host: HTMLElement): boolean {
  return event.composedPath().includes(host);
}

function isCropOverlayElement(element: Element, host: HTMLElement): boolean {
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
