import {
  createCropOverlayTemplate,
  type CropOverlayTemplate,
  FLASH_CLASS,
  PANEL_ATTRIBUTE,
  ROOT_ATTRIBUTE,
  ROOT_ID
} from "./crop-template";
import { applyHighlightPresentation } from "./positioning";
import {
  getBestRectForElement,
  getElementFromPoint
} from "../../firefox-derived/overlay-helpers";
import { readWindowDimensions, type ViewportRect } from "../../firefox-derived/window-dimensions";

interface PointerPosition {
  readonly x: number;
  readonly y: number;
}

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

  const removeOverlay = (): void => {
    window.removeEventListener("keydown", handleKeyDown, true);
    window.removeEventListener("pointermove", handlePointerMove, true);
    cancelPendingHoverUpdate();
    host.remove();
  };

  const handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== "Escape") {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    removeOverlay();
  };

  const handlePointerMove = (event: PointerEvent): void => {
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
    applyHighlightPresentation(template.highlight, resolveHoverRect(pointer, host));
  };

  const clearHover = (): void => {
    cancelPendingHoverUpdate();

    if (template) {
      applyHighlightPresentation(template.highlight, null);
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

  template = createCropOverlayTemplate(shadowRoot, removeOverlay);
  document.documentElement.append(host);
  window.addEventListener("keydown", handleKeyDown, true);
  window.addEventListener("pointermove", handlePointerMove, true);
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
