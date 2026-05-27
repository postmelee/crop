import type { ViewportRect } from "../../firefox-derived/window-dimensions";

export interface HighlightPresentation {
  readonly hidden: boolean;
  readonly transform: string;
  readonly width: string;
  readonly height: string;
}

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

function toCssPixel(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  return `${Object.is(rounded, -0) ? 0 : rounded}px`;
}
