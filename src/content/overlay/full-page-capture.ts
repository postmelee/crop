import {
  MAX_CAPTURE_AREA,
  MAX_CAPTURE_DIMENSION,
  type OutputCssSize,
  type StitchImageScale
} from "../../shared/stitch-image";
import { rectFromEdges, type CropRect } from "../../shared/rect";

export interface FullPageMetricsInput {
  readonly viewportWidth?: number | null;
  readonly viewportHeight?: number | null;
  readonly scrollWidth?: number | null;
  readonly scrollHeight?: number | null;
  readonly scrollX?: number | null;
  readonly scrollY?: number | null;
  readonly scrollMinX?: number | null;
  readonly scrollMinY?: number | null;
  readonly scrollMaxX?: number | null;
  readonly scrollMaxY?: number | null;
  readonly devicePixelRatio?: number | null;
}

export interface FullPageMetrics {
  readonly viewportWidth: number;
  readonly viewportHeight: number;
  readonly scrollWidth: number;
  readonly scrollHeight: number;
  readonly scrollX: number;
  readonly scrollY: number;
  readonly scrollMinX: number;
  readonly scrollMinY: number;
  readonly scrollMaxX: number;
  readonly scrollMaxY: number;
  readonly devicePixelRatio: number;
}

export interface FullPageBounds extends CropRect {
  readonly devicePixelRatio: number;
}

export interface FullPageTile {
  readonly indexX: number;
  readonly indexY: number;
  readonly pageRect: CropRect;
  readonly viewportCropRect: CropRect;
  readonly destinationCssRect: CropRect;
  readonly scrollX: number;
  readonly scrollY: number;
}

export interface FullPageTilePlan {
  readonly bounds: FullPageBounds;
  readonly viewportCssSize: {
    readonly clientWidth: number;
    readonly clientHeight: number;
  };
  readonly outputCssSize: OutputCssSize;
  readonly tiles: readonly FullPageTile[];
}

export interface FullPageTilePlanOptions {
  readonly maxOutputDimension?: number;
  readonly maxOutputArea?: number;
}

interface FullPageElementLike {
  readonly clientWidth: number;
  readonly clientHeight: number;
  readonly scrollWidth: number;
  readonly scrollHeight: number;
}

interface FullPageDocumentLike {
  readonly documentElement: FullPageElementLike;
  readonly body?: Pick<FullPageElementLike, "scrollWidth" | "scrollHeight"> | null;
  readonly scrollingElement?: FullPageElementLike | null;
}

interface FullPageWindowLike {
  readonly innerWidth: number;
  readonly innerHeight: number;
  readonly scrollX: number;
  readonly scrollY: number;
  readonly devicePixelRatio: number;
  readonly document: FullPageDocumentLike;
}

export function readFullPageMetrics(win: FullPageWindowLike = window): FullPageMetrics {
  const documentElement = win.document.documentElement;
  const scrollingElement = win.document.scrollingElement;
  const body = win.document.body;
  const viewportWidth = firstPositive(
    documentElement.clientWidth,
    scrollingElement?.clientWidth,
    win.innerWidth
  );
  const viewportHeight = firstPositive(
    documentElement.clientHeight,
    scrollingElement?.clientHeight,
    win.innerHeight
  );
  const scrollWidth = Math.max(
    viewportWidth,
    toNonNegative(documentElement.scrollWidth),
    toNonNegative(scrollingElement?.scrollWidth),
    toNonNegative(body?.scrollWidth)
  );
  const scrollHeight = Math.max(
    viewportHeight,
    toNonNegative(documentElement.scrollHeight),
    toNonNegative(scrollingElement?.scrollHeight),
    toNonNegative(body?.scrollHeight)
  );

  return createFullPageMetrics({
    viewportWidth,
    viewportHeight,
    scrollWidth,
    scrollHeight,
    scrollX: win.scrollX,
    scrollY: win.scrollY,
    devicePixelRatio: win.devicePixelRatio
  });
}

export function createFullPageMetrics(input: FullPageMetricsInput): FullPageMetrics {
  const viewportWidth = toNonNegative(input.viewportWidth);
  const viewportHeight = toNonNegative(input.viewportHeight);
  const scrollMinX = toFiniteNumber(input.scrollMinX, 0);
  const scrollMinY = toFiniteNumber(input.scrollMinY, 0);
  const scrollWidth = Math.max(toNonNegative(input.scrollWidth), viewportWidth);
  const scrollHeight = Math.max(toNonNegative(input.scrollHeight), viewportHeight);
  const defaultScrollMaxX = scrollMinX + Math.max(0, scrollWidth - viewportWidth);
  const defaultScrollMaxY = scrollMinY + Math.max(0, scrollHeight - viewportHeight);
  const scrollMaxX = Math.max(scrollMinX, toFiniteNumber(input.scrollMaxX, defaultScrollMaxX));
  const scrollMaxY = Math.max(scrollMinY, toFiniteNumber(input.scrollMaxY, defaultScrollMaxY));

  return {
    viewportWidth,
    viewportHeight,
    scrollWidth,
    scrollHeight,
    scrollX: clamp(toFiniteNumber(input.scrollX, scrollMinX), scrollMinX, scrollMaxX),
    scrollY: clamp(toFiniteNumber(input.scrollY, scrollMinY), scrollMinY, scrollMaxY),
    scrollMinX,
    scrollMinY,
    scrollMaxX,
    scrollMaxY,
    devicePixelRatio: Math.max(1, toFiniteNumber(input.devicePixelRatio, 1))
  };
}

export function getFullPageBounds(metrics: FullPageMetrics): FullPageBounds {
  const left = metrics.scrollMinX;
  const top = metrics.scrollMinY;

  return {
    ...rectFromEdges(left, top, left + metrics.scrollWidth, top + metrics.scrollHeight),
    devicePixelRatio: metrics.devicePixelRatio
  };
}

export function createFullPageTilePlan(
  metrics: FullPageMetrics,
  options: FullPageTilePlanOptions = {}
): FullPageTilePlan {
  if (metrics.viewportWidth <= 0 || metrics.viewportHeight <= 0) {
    throw new Error("Full page capture requires a non-empty viewport.");
  }

  const bounds = getFullPageBounds(metrics);
  validateEstimatedOutputSize(bounds, metrics.devicePixelRatio, options);

  const xSegments = createSegments(bounds.left, bounds.right, metrics.viewportWidth);
  const ySegments = createSegments(bounds.top, bounds.bottom, metrics.viewportHeight);
  const tiles: FullPageTile[] = [];

  for (let yIndex = 0; yIndex < ySegments.length; yIndex += 1) {
    const ySegment = ySegments[yIndex];
    const scrollY = clamp(ySegment.start, metrics.scrollMinY, metrics.scrollMaxY);

    for (let xIndex = 0; xIndex < xSegments.length; xIndex += 1) {
      const xSegment = xSegments[xIndex];
      const scrollX = clamp(xSegment.start, metrics.scrollMinX, metrics.scrollMaxX);
      const pageRect = rectFromEdges(
        xSegment.start,
        ySegment.start,
        xSegment.end,
        ySegment.end
      );

      tiles.push({
        indexX: xIndex,
        indexY: yIndex,
        pageRect,
        viewportCropRect: rectFromEdges(
          pageRect.left - scrollX,
          pageRect.top - scrollY,
          pageRect.right - scrollX,
          pageRect.bottom - scrollY
        ),
        destinationCssRect: rectFromEdges(
          pageRect.left - bounds.left,
          pageRect.top - bounds.top,
          pageRect.right - bounds.left,
          pageRect.bottom - bounds.top
        ),
        scrollX,
        scrollY
      });
    }
  }

  return {
    bounds,
    viewportCssSize: {
      clientWidth: metrics.viewportWidth,
      clientHeight: metrics.viewportHeight
    },
    outputCssSize: {
      width: bounds.width,
      height: bounds.height
    },
    tiles
  };
}

function validateEstimatedOutputSize(
  bounds: FullPageBounds,
  devicePixelRatio: number,
  options: FullPageTilePlanOptions
): void {
  const scale: StitchImageScale = {
    scaleX: devicePixelRatio,
    scaleY: devicePixelRatio
  };
  const width = Math.round(bounds.width * scale.scaleX);
  const height = Math.round(bounds.height * scale.scaleY);
  const maxDimension = options.maxOutputDimension ?? MAX_CAPTURE_DIMENSION;
  const maxArea = options.maxOutputArea ?? MAX_CAPTURE_AREA;

  if (width <= 0 || height <= 0) {
    throw new Error("Full page capture requires a non-empty document.");
  }

  if (width > maxDimension || height > maxDimension || width * height > maxArea) {
    throw new Error("Full page capture exceeds the maximum canvas size.");
  }
}

function createSegments(start: number, end: number, size: number): ReadonlyArray<{
  readonly start: number;
  readonly end: number;
}> {
  const segments: Array<{ start: number; end: number }> = [];

  for (let segmentStart = start; segmentStart < end; segmentStart += size) {
    segments.push({
      start: segmentStart,
      end: Math.min(end, segmentStart + size)
    });
  }

  return segments;
}

function firstPositive(...values: ReadonlyArray<number | null | undefined>): number {
  for (const value of values) {
    const normalized = toNonNegative(value);

    if (normalized > 0) {
      return normalized;
    }
  }

  return 0;
}

function toNonNegative(value: number | null | undefined): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, value);
}

function toFiniteNumber(value: number | null | undefined, fallback: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return fallback;
  }

  return value;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
