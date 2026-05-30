import { rectFromEdges, type PageRect } from "../../firefox-derived/window-dimensions";

export const SELECTION_RESIZE_HANDLES = [
  "north",
  "south",
  "east",
  "west",
  "north-east",
  "north-west",
  "south-east",
  "south-west"
] as const;

export type SelectionResizeHandle = (typeof SELECTION_RESIZE_HANDLES)[number];

export interface SelectionTransformPoint {
  readonly x: number;
  readonly y: number;
}

export interface SelectionTransformDelta {
  readonly x: number;
  readonly y: number;
}

export interface SelectionTransformOptions {
  readonly minWidth?: number;
  readonly minHeight?: number;
}

export const DEFAULT_MIN_SELECTION_SIZE = 8;
export const SELECTION_KEYBOARD_STEP = 1;
export const SELECTION_KEYBOARD_FAST_STEP = 10;

export function isSelectionResizeHandle(value: string | null): value is SelectionResizeHandle {
  return SELECTION_RESIZE_HANDLES.includes(value as SelectionResizeHandle);
}

export function moveSelectionRect(
  startRect: PageRect,
  startPoint: SelectionTransformPoint,
  currentPoint: SelectionTransformPoint
): PageRect {
  return moveSelectionRectByDelta(startRect, {
    x: currentPoint.x - startPoint.x,
    y: currentPoint.y - startPoint.y
  });
}

export function moveSelectionRectByDelta(
  startRect: PageRect,
  delta: SelectionTransformDelta
): PageRect {
  return rectFromEdges(
    startRect.left + delta.x,
    startRect.top + delta.y,
    startRect.right + delta.x,
    startRect.bottom + delta.y
  );
}

export function resizeSelectionRect(
  startRect: PageRect,
  handle: SelectionResizeHandle,
  startPoint: SelectionTransformPoint,
  currentPoint: SelectionTransformPoint,
  options: SelectionTransformOptions = {}
): PageRect {
  return resizeSelectionRectByDelta(
    startRect,
    handle,
    {
      x: currentPoint.x - startPoint.x,
      y: currentPoint.y - startPoint.y
    },
    options
  );
}

export function resizeSelectionRectByDelta(
  startRect: PageRect,
  handle: SelectionResizeHandle,
  delta: SelectionTransformDelta,
  options: SelectionTransformOptions = {}
): PageRect {
  const minWidth = getMinimumSize(options.minWidth);
  const minHeight = getMinimumSize(options.minHeight);
  let left = startRect.left;
  let top = startRect.top;
  let right = startRect.right;
  let bottom = startRect.bottom;

  if (movesWest(handle)) {
    left = Math.min(startRect.right - minWidth, startRect.left + delta.x);
  } else if (movesEast(handle)) {
    right = Math.max(startRect.left + minWidth, startRect.right + delta.x);
  }

  if (movesNorth(handle)) {
    top = Math.min(startRect.bottom - minHeight, startRect.top + delta.y);
  } else if (movesSouth(handle)) {
    bottom = Math.max(startRect.top + minHeight, startRect.bottom + delta.y);
  }

  return rectFromEdges(left, top, right, bottom);
}

function movesNorth(handle: SelectionResizeHandle): boolean {
  return handle === "north" || handle === "north-east" || handle === "north-west";
}

function movesSouth(handle: SelectionResizeHandle): boolean {
  return handle === "south" || handle === "south-east" || handle === "south-west";
}

function movesEast(handle: SelectionResizeHandle): boolean {
  return handle === "east" || handle === "north-east" || handle === "south-east";
}

function movesWest(handle: SelectionResizeHandle): boolean {
  return handle === "west" || handle === "north-west" || handle === "south-west";
}

function getMinimumSize(value: number | undefined): number {
  return value != null && Number.isFinite(value) && value > 0
    ? value
    : DEFAULT_MIN_SELECTION_SIZE;
}
