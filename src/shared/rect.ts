export interface CropRectLike {
  readonly left: number;
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
}

export interface CropRect extends CropRectLike {
  readonly width: number;
  readonly height: number;
}

export interface ViewportMetrics {
  readonly clientWidth: number;
  readonly clientHeight: number;
  readonly scrollX: number;
  readonly scrollY: number;
}

export function rectFromEdges(
  left: number,
  top: number,
  right: number,
  bottom: number
): CropRect {
  return {
    left,
    top,
    right,
    bottom,
    width: Math.max(0, right - left),
    height: Math.max(0, bottom - top)
  };
}

export function normalizeRect(rect: CropRectLike): CropRect {
  return rectFromEdges(
    Math.min(rect.left, rect.right),
    Math.min(rect.top, rect.bottom),
    Math.max(rect.left, rect.right),
    Math.max(rect.top, rect.bottom)
  );
}

export function intersectRects(first: CropRectLike, second: CropRectLike): CropRect | null {
  const normalizedFirst = normalizeRect(first);
  const normalizedSecond = normalizeRect(second);
  const left = Math.max(normalizedFirst.left, normalizedSecond.left);
  const top = Math.max(normalizedFirst.top, normalizedSecond.top);
  const right = Math.min(normalizedFirst.right, normalizedSecond.right);
  const bottom = Math.min(normalizedFirst.bottom, normalizedSecond.bottom);

  if (right <= left || bottom <= top) {
    return null;
  }

  return rectFromEdges(left, top, right, bottom);
}

export function getViewportRect(viewport: Pick<ViewportMetrics, "clientWidth" | "clientHeight">): CropRect {
  return rectFromEdges(0, 0, Math.max(0, viewport.clientWidth), Math.max(0, viewport.clientHeight));
}

export function pageRectToViewportRect(rect: CropRectLike, viewport: ViewportMetrics): CropRect {
  const normalized = normalizeRect(rect);

  return rectFromEdges(
    normalized.left - viewport.scrollX,
    normalized.top - viewport.scrollY,
    normalized.right - viewport.scrollX,
    normalized.bottom - viewport.scrollY
  );
}

export function viewportRectToPageRect(rect: CropRectLike, viewport: ViewportMetrics): CropRect {
  const normalized = normalizeRect(rect);

  return rectFromEdges(
    normalized.left + viewport.scrollX,
    normalized.top + viewport.scrollY,
    normalized.right + viewport.scrollX,
    normalized.bottom + viewport.scrollY
  );
}

export function clipPageRectToViewport(
  pageRect: CropRectLike,
  viewport: ViewportMetrics
): CropRect | null {
  return intersectRects(pageRectToViewportRect(pageRect, viewport), getViewportRect(viewport));
}
