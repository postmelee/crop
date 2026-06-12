import { type OutputCssSize } from "../../shared/stitch-image";
import {
  normalizeRect,
  rectFromEdges,
  type CropRect,
  type CropRectLike
} from "../../shared/rect";

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

export type PageRectTileScrollStrategy = "segment-start" | "minimal-scroll";

export interface PageRectTilePlanOptions {
  readonly scrollStrategy?: PageRectTileScrollStrategy;
}

export interface CapturedFullPageTile {
  readonly tile: FullPageTile;
  readonly dataUrl: string;
  readonly actualScrollX: number;
  readonly actualScrollY: number;
  readonly viewportCropRect: CropRect;
  readonly destinationCssRect: CropRect;
}

export interface FullPageCaptureLoopResult {
  readonly plan: FullPageTilePlan;
  readonly tiles: readonly CapturedFullPageTile[];
}

export interface FullPageCaptureLoopOptions {
  readonly captureVisibleTab: () => Promise<string>;
  readonly readMetrics?: () => FullPageMetrics;
  readonly scrollTo?: (x: number, y: number) => void | Promise<void>;
  readonly waitForPaint?: () => Promise<void>;
  readonly setOverlayHidden?: (hidden: boolean) => void;
  readonly setScrollBehaviorDisabled?: (disabled: boolean) => void;
  readonly beforeCaptureTile?: (tile: FullPageTile, index: number) => void | Promise<void>;
  readonly afterCaptureTile?: (tile: FullPageTile, index: number) => void | Promise<void>;
}

export interface PageRectCaptureLoopOptions extends FullPageCaptureLoopOptions {
  readonly pageRect: CropRectLike;
  readonly tilePlanOptions?: PageRectTilePlanOptions;
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

const TILE_FIT_EPSILON = 0.5;

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
  metrics: FullPageMetrics
): FullPageTilePlan {
  return createPageRectTilePlan(metrics, getFullPageBounds(metrics));
}

export function createPageRectTilePlan(
  metrics: FullPageMetrics,
  pageRect: CropRectLike,
  options: PageRectTilePlanOptions = {}
): FullPageTilePlan {
  if (metrics.viewportWidth <= 0 || metrics.viewportHeight <= 0) {
    throw new Error("Full page capture requires a non-empty viewport.");
  }

  const normalizedBounds = normalizeRect(pageRect);
  const bounds = {
    ...normalizedBounds,
    devicePixelRatio: metrics.devicePixelRatio
  };

  validateCaptureBounds(bounds);

  const xSegments = createSegments(
    normalizedBounds.left,
    normalizedBounds.right,
    metrics.viewportWidth
  );
  const ySegments = createSegments(
    normalizedBounds.top,
    normalizedBounds.bottom,
    metrics.viewportHeight
  );
  const tiles: FullPageTile[] = [];
  const useMinimalScrollX =
    options.scrollStrategy === "minimal-scroll" && bounds.width <= metrics.viewportWidth;
  const useMinimalScrollY =
    options.scrollStrategy === "minimal-scroll" && bounds.height <= metrics.viewportHeight;

  for (let yIndex = 0; yIndex < ySegments.length; yIndex += 1) {
    const ySegment = ySegments[yIndex];
    const scrollY = getTileAxisScroll({
      segmentStart: ySegment.start,
      segmentEnd: ySegment.end,
      viewportSize: metrics.viewportHeight,
      currentScroll: metrics.scrollY,
      scrollMin: metrics.scrollMinY,
      scrollMax: metrics.scrollMaxY,
      useMinimalScroll: useMinimalScrollY
    });

    for (let xIndex = 0; xIndex < xSegments.length; xIndex += 1) {
      const xSegment = xSegments[xIndex];
      const scrollX = getTileAxisScroll({
        segmentStart: xSegment.start,
        segmentEnd: xSegment.end,
        viewportSize: metrics.viewportWidth,
        currentScroll: metrics.scrollX,
        scrollMin: metrics.scrollMinX,
        scrollMax: metrics.scrollMaxX,
        useMinimalScroll: useMinimalScrollX
      });
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

export async function captureFullPageTiles(
  options: FullPageCaptureLoopOptions
): Promise<FullPageCaptureLoopResult> {
  return captureTiles(options, (metrics) => createFullPageTilePlan(metrics));
}

export async function capturePageRectTiles(
  options: PageRectCaptureLoopOptions
): Promise<FullPageCaptureLoopResult> {
  return captureTiles(options, (metrics) =>
    createPageRectTilePlan(metrics, options.pageRect, {
      scrollStrategy: "minimal-scroll",
      ...options.tilePlanOptions
    })
  );
}

async function captureTiles(
  options: FullPageCaptureLoopOptions,
  createTilePlan: (metrics: FullPageMetrics) => FullPageTilePlan
): Promise<FullPageCaptureLoopResult> {
  const readMetrics = options.readMetrics ?? readFullPageMetrics;
  const scrollTo = options.scrollTo ?? defaultScrollTo;
  const waitForPaint = options.waitForPaint ?? waitForNextPaint;
  const initialMetrics = readMetrics();
  const plan = createTilePlan(initialMetrics);
  const tiles: CapturedFullPageTile[] = [];

  options.setScrollBehaviorDisabled?.(true);

  try {
    await waitForPaint();

    for (let index = 0; index < plan.tiles.length; index += 1) {
      const tile = plan.tiles[index];

      await scrollTo(tile.scrollX, tile.scrollY);
      await waitForPaint();

      if (options.beforeCaptureTile) {
        await options.beforeCaptureTile(tile, index);
        await waitForPaint();
      }

      let dataUrl: string;

      try {
        if (options.setOverlayHidden) {
          options.setOverlayHidden(true);
          await waitForPaint();
        }

        dataUrl = await options.captureVisibleTab();
      } finally {
        if (options.setOverlayHidden) {
          options.setOverlayHidden(false);
        }

        await options.afterCaptureTile?.(tile, index);

        if (options.setOverlayHidden) {
          await waitForPaint();
        }
      }

      tiles.push(
        createCapturedFullPageTile({
          tile,
          dataUrl,
          metrics: readMetrics()
        })
      );
    }

    return {
      plan,
      tiles
    };
  } finally {
    try {
      await scrollTo(initialMetrics.scrollX, initialMetrics.scrollY);
      await waitForPaint();
    } finally {
      options.setScrollBehaviorDisabled?.(false);
      options.setOverlayHidden?.(false);
    }
  }
}

export function createCapturedFullPageTile(input: {
  readonly tile: FullPageTile;
  readonly dataUrl: string;
  readonly metrics: FullPageMetrics;
}): CapturedFullPageTile {
  const viewportCropRect = rectFromEdges(
    input.tile.pageRect.left - input.metrics.scrollX,
    input.tile.pageRect.top - input.metrics.scrollY,
    input.tile.pageRect.right - input.metrics.scrollX,
    input.tile.pageRect.bottom - input.metrics.scrollY
  );

  if (!isViewportCropRectVisible(viewportCropRect, input.metrics)) {
    throw new Error("Captured tile no longer fits inside the visible viewport.");
  }

  return {
    tile: input.tile,
    dataUrl: input.dataUrl,
    actualScrollX: input.metrics.scrollX,
    actualScrollY: input.metrics.scrollY,
    viewportCropRect,
    destinationCssRect: input.tile.destinationCssRect
  };
}

function validateCaptureBounds(bounds: CropRect): void {
  if (bounds.width <= 0 || bounds.height <= 0) {
    throw new Error("Full page capture requires a non-empty document.");
  }
}

function getTileAxisScroll(input: {
  readonly segmentStart: number;
  readonly segmentEnd: number;
  readonly viewportSize: number;
  readonly currentScroll: number;
  readonly scrollMin: number;
  readonly scrollMax: number;
  readonly useMinimalScroll: boolean;
}): number {
  if (!input.useMinimalScroll) {
    return clamp(input.segmentStart, input.scrollMin, input.scrollMax);
  }

  const minimumVisibleScroll = input.segmentEnd - input.viewportSize;
  const maximumVisibleScroll = input.segmentStart;

  return clamp(
    clamp(input.currentScroll, minimumVisibleScroll, maximumVisibleScroll),
    input.scrollMin,
    input.scrollMax
  );
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

function isViewportCropRectVisible(rect: CropRect, metrics: FullPageMetrics): boolean {
  return (
    rect.left >= -TILE_FIT_EPSILON &&
    rect.top >= -TILE_FIT_EPSILON &&
    rect.right <= metrics.viewportWidth + TILE_FIT_EPSILON &&
    rect.bottom <= metrics.viewportHeight + TILE_FIT_EPSILON
  );
}

function defaultScrollTo(x: number, y: number): void {
  window.scrollTo(x, y);
}

function waitForNextPaint(): Promise<void> {
  return new Promise((resolve) => {
    window.requestAnimationFrame(() => {
      window.setTimeout(resolve, 0);
    });
  });
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
