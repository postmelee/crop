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

export interface SelectionInteractionOptions {
  readonly hitArea?: number;
}

export interface SelectionKeyboardInput {
  readonly key: string;
  readonly shiftKey?: boolean;
  readonly altKey?: boolean;
  readonly ctrlKey?: boolean;
  readonly metaKey?: boolean;
}

export type SelectionInteraction =
  | {
      readonly type: "move";
    }
  | {
      readonly type: "resize";
      readonly handle: SelectionResizeHandle;
    };

export type SelectionKeyboardAdjustment =
  | {
      readonly type: "move";
      readonly delta: SelectionTransformDelta;
    }
  | {
      readonly type: "resize";
      readonly handle: SelectionResizeHandle;
      readonly delta: SelectionTransformDelta;
    };

export const DEFAULT_MIN_SELECTION_SIZE = 8;
export const SELECTION_RESIZE_HIT_AREA = 8;
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

export function getSelectionInteractionAtPoint(
  rect: PageRect,
  point: SelectionTransformPoint,
  options: SelectionInteractionOptions = {}
): SelectionInteraction | null {
  const hitArea = getHitArea(options.hitArea);
  const inExpandedHorizontalRange = point.x >= rect.left - hitArea && point.x <= rect.right + hitArea;
  const inExpandedVerticalRange = point.y >= rect.top - hitArea && point.y <= rect.bottom + hitArea;

  if (!inExpandedHorizontalRange || !inExpandedVerticalRange) {
    return null;
  }

  const nearNorth = Math.abs(point.y - rect.top) <= hitArea;
  const nearSouth = Math.abs(point.y - rect.bottom) <= hitArea;
  const nearWest = Math.abs(point.x - rect.left) <= hitArea;
  const nearEast = Math.abs(point.x - rect.right) <= hitArea;

  if (nearNorth && nearWest) {
    return { type: "resize", handle: "north-west" };
  }
  if (nearNorth && nearEast) {
    return { type: "resize", handle: "north-east" };
  }
  if (nearSouth && nearWest) {
    return { type: "resize", handle: "south-west" };
  }
  if (nearSouth && nearEast) {
    return { type: "resize", handle: "south-east" };
  }
  if (nearNorth) {
    return { type: "resize", handle: "north" };
  }
  if (nearSouth) {
    return { type: "resize", handle: "south" };
  }
  if (nearWest) {
    return { type: "resize", handle: "west" };
  }
  if (nearEast) {
    return { type: "resize", handle: "east" };
  }

  if (isPointInsideRect(rect, point)) {
    return { type: "move" };
  }

  return null;
}

export function getSelectionKeyboardAdjustment(
  input: SelectionKeyboardInput
): SelectionKeyboardAdjustment | null {
  if (input.ctrlKey || input.metaKey) {
    return null;
  }

  const step = input.shiftKey ? SELECTION_KEYBOARD_FAST_STEP : SELECTION_KEYBOARD_STEP;

  switch (input.key) {
    case "ArrowUp":
      return input.altKey
        ? { type: "resize", handle: "north", delta: { x: 0, y: -step } }
        : { type: "move", delta: { x: 0, y: -step } };
    case "ArrowDown":
      return input.altKey
        ? { type: "resize", handle: "south", delta: { x: 0, y: step } }
        : { type: "move", delta: { x: 0, y: step } };
    case "ArrowLeft":
      return input.altKey
        ? { type: "resize", handle: "west", delta: { x: -step, y: 0 } }
        : { type: "move", delta: { x: -step, y: 0 } };
    case "ArrowRight":
      return input.altKey
        ? { type: "resize", handle: "east", delta: { x: step, y: 0 } }
        : { type: "move", delta: { x: step, y: 0 } };
    default:
      return null;
  }
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

function getHitArea(value: number | undefined): number {
  return value != null && Number.isFinite(value) && value >= 0
    ? value
    : SELECTION_RESIZE_HIT_AREA;
}

function isPointInsideRect(rect: PageRect, point: SelectionTransformPoint): boolean {
  return (
    point.x >= rect.left &&
    point.x <= rect.right &&
    point.y >= rect.top &&
    point.y <= rect.bottom
  );
}
