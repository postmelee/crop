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

const ACTION_BUTTONS_EDGE_MARGIN = 8;
const ACTION_BUTTONS_GAP = 8;

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

function toCssPixel(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  return `${Object.is(rounded, -0) ? 0 : rounded}px`;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
