export interface EdgeScrollPoint {
  readonly x: number;
  readonly y: number;
}

export interface EdgeScrollViewport {
  readonly clientWidth: number;
  readonly clientHeight: number;
}

export interface EdgeScrollOptions {
  readonly threshold?: number;
  readonly maxStep?: number;
}

export interface EdgeScrollDelta {
  readonly x: number;
  readonly y: number;
  readonly active: boolean;
}

export const EDGE_SCROLL_THRESHOLD = 80;
export const EDGE_SCROLL_MAX_STEP = 24;

const INACTIVE_EDGE_SCROLL_DELTA: EdgeScrollDelta = {
  x: 0,
  y: 0,
  active: false
};

export function getEdgeScrollDelta(
  pointer: EdgeScrollPoint,
  viewport: EdgeScrollViewport,
  options: EdgeScrollOptions = {}
): EdgeScrollDelta {
  const threshold = options.threshold ?? EDGE_SCROLL_THRESHOLD;
  const maxStep = options.maxStep ?? EDGE_SCROLL_MAX_STEP;

  if (
    !isUsableNumber(pointer.x) ||
    !isUsableNumber(pointer.y) ||
    !isUsableNumber(viewport.clientWidth) ||
    !isUsableNumber(viewport.clientHeight) ||
    !isUsableNumber(threshold) ||
    !isUsableNumber(maxStep) ||
    viewport.clientWidth <= 0 ||
    viewport.clientHeight <= 0 ||
    threshold <= 0 ||
    maxStep <= 0
  ) {
    return INACTIVE_EDGE_SCROLL_DELTA;
  }

  const x = getAxisScrollDelta(pointer.x, viewport.clientWidth, threshold, maxStep);
  const y = getAxisScrollDelta(pointer.y, viewport.clientHeight, threshold, maxStep);

  return {
    x,
    y,
    active: x !== 0 || y !== 0
  };
}

function getAxisScrollDelta(
  pointerPosition: number,
  viewportSize: number,
  threshold: number,
  maxStep: number
): number {
  const effectiveThreshold = Math.min(threshold, viewportSize / 2);

  if (effectiveThreshold <= 0) {
    return 0;
  }

  if (pointerPosition < effectiveThreshold) {
    return -getScaledStep(effectiveThreshold - pointerPosition, effectiveThreshold, maxStep);
  }

  const lowerEdgeStart = viewportSize - effectiveThreshold;

  if (pointerPosition > lowerEdgeStart) {
    return getScaledStep(pointerPosition - lowerEdgeStart, effectiveThreshold, maxStep);
  }

  return 0;
}

function getScaledStep(distanceIntoEdge: number, threshold: number, maxStep: number): number {
  const ratio = Math.min(1, Math.max(0, distanceIntoEdge / threshold));

  if (ratio <= 0) {
    return 0;
  }

  return Math.max(1, Math.round(maxStep * ratio));
}

function isUsableNumber(value: number): boolean {
  return Number.isFinite(value);
}
