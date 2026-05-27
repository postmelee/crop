import type { ViewportRect } from "../../firefox-derived/window-dimensions";

export interface HighlightPresentation {
  readonly hidden: boolean;
  readonly transform: string;
  readonly width: string;
  readonly height: string;
}

export interface ViewportSize {
  readonly clientWidth: number;
  readonly clientHeight: number;
}

export interface ElementSize {
  readonly width: number;
  readonly height: number;
}

export interface ActionButtonsPresentation {
  readonly hidden: boolean;
  readonly transform: string;
}

export interface SelectionMaskElements {
  readonly container: HTMLElement;
  readonly top: HTMLElement;
  readonly right: HTMLElement;
  readonly bottom: HTMLElement;
  readonly left: HTMLElement;
}

export interface Point {
  readonly x: number;
  readonly y: number;
}

export interface EyeOffsetPresentation {
  readonly x: string;
  readonly y: string;
}

const ACTION_BUTTONS_EDGE_MARGIN = 8;
const ACTION_BUTTONS_GAP = 8;
const EYE_OFFSET_SCALE = 10;

export function getHighlightPresentation(rect: ViewportRect | null): HighlightPresentation {
  if (!rect) {
    return {
      hidden: true,
      transform: "",
      width: "",
      height: ""
    };
  }

  return {
    hidden: false,
    transform: `translate(${toCssPixel(rect.left)}, ${toCssPixel(rect.top)})`,
    width: toCssPixel(rect.width),
    height: toCssPixel(rect.height)
  };
}

export function applyHighlightPresentation(element: HTMLElement, rect: ViewportRect | null): void {
  const presentation = getHighlightPresentation(rect);

  element.hidden = presentation.hidden;
  element.style.transform = presentation.transform;
  element.style.width = presentation.width;
  element.style.height = presentation.height;
}

export function getActionButtonsPresentation(
  rect: ViewportRect | null,
  viewport: ViewportSize,
  elementSize: ElementSize
): ActionButtonsPresentation {
  if (!rect) {
    return {
      hidden: true,
      transform: ""
    };
  }

  const maxX = Math.max(
    ACTION_BUTTONS_EDGE_MARGIN,
    viewport.clientWidth - elementSize.width - ACTION_BUTTONS_EDGE_MARGIN
  );
  const x = clamp(rect.left, ACTION_BUTTONS_EDGE_MARGIN, maxX);
  const belowY = rect.bottom + ACTION_BUTTONS_GAP;
  const aboveY = rect.top - elementSize.height - ACTION_BUTTONS_GAP;
  const maxY = Math.max(
    ACTION_BUTTONS_EDGE_MARGIN,
    viewport.clientHeight - elementSize.height - ACTION_BUTTONS_EDGE_MARGIN
  );
  const y =
    belowY + elementSize.height + ACTION_BUTTONS_EDGE_MARGIN <= viewport.clientHeight
      ? belowY
      : aboveY >= ACTION_BUTTONS_EDGE_MARGIN
        ? aboveY
        : clamp(belowY, ACTION_BUTTONS_EDGE_MARGIN, maxY);

  return {
    hidden: false,
    transform: `translate(${toCssPixel(x)}, ${toCssPixel(y)})`
  };
}

export function applyActionButtonsPresentation(
  element: HTMLElement,
  rect: ViewportRect | null,
  viewport: ViewportSize,
  elementSize: ElementSize
): void {
  const presentation = getActionButtonsPresentation(rect, viewport, elementSize);

  element.hidden = presentation.hidden;
  element.style.transform = presentation.transform;
}

export function applySelectionMaskPresentation(
  elements: SelectionMaskElements,
  rect: ViewportRect | null
): void {
  elements.container.hidden = !rect;

  if (!rect) {
    for (const part of [elements.top, elements.right, elements.bottom, elements.left]) {
      part.removeAttribute("style");
    }
    return;
  }

  elements.top.style.left = "0";
  elements.top.style.top = "0";
  elements.top.style.width = "100vw";
  elements.top.style.height = toCssPixel(rect.top);

  elements.right.style.left = toCssPixel(rect.right);
  elements.right.style.top = toCssPixel(rect.top);
  elements.right.style.width = `calc(100vw - ${toCssPixel(rect.right)})`;
  elements.right.style.height = toCssPixel(rect.height);

  elements.bottom.style.left = "0";
  elements.bottom.style.top = toCssPixel(rect.bottom);
  elements.bottom.style.width = "100vw";
  elements.bottom.style.height = `calc(100vh - ${toCssPixel(rect.bottom)})`;

  elements.left.style.left = "0";
  elements.left.style.top = toCssPixel(rect.top);
  elements.left.style.width = toCssPixel(rect.left);
  elements.left.style.height = toCssPixel(rect.height);
}

export function getEyeOffsetPresentation(
  pointer: Point,
  viewport: ViewportSize
): EyeOffsetPresentation {
  if (viewport.clientWidth <= 0 || viewport.clientHeight <= 0) {
    return {
      x: "0px",
      y: "0px"
    };
  }

  const x = Math.floor(
    (EYE_OFFSET_SCALE * (pointer.x - viewport.clientWidth / 2)) / viewport.clientWidth
  );
  const y = Math.floor(
    (EYE_OFFSET_SCALE * (pointer.y - viewport.clientHeight / 2)) / viewport.clientHeight
  );

  return {
    x: toCssPixel(x),
    y: toCssPixel(y)
  };
}

export function applyEyeOffsetPresentation(
  element: HTMLElement,
  pointer: Point,
  viewport: ViewportSize
): void {
  const presentation = getEyeOffsetPresentation(pointer, viewport);

  element.style.setProperty("--crop-eye-x", presentation.x);
  element.style.setProperty("--crop-eye-y", presentation.y);
}

function toCssPixel(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  return `${Object.is(rounded, -0) ? 0 : rounded}px`;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
