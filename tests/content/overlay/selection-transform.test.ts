import { describe, expect, it } from "vitest";
import { rectFromEdges } from "../../../src/firefox-derived/window-dimensions";
import {
  DEFAULT_MIN_SELECTION_SIZE,
  SELECTION_KEYBOARD_FAST_STEP,
  SELECTION_KEYBOARD_STEP,
  isSelectionResizeHandle,
  moveSelectionRect,
  moveSelectionRectByDelta,
  resizeSelectionRect,
  resizeSelectionRectByDelta
} from "../../../src/content/overlay/selection-transform";

describe("selection transform helpers", () => {
  const rect = rectFromEdges(10, 20, 110, 80);

  it("recognizes the supported Firefox-style resize handles", () => {
    expect(isSelectionResizeHandle("north")).toBe(true);
    expect(isSelectionResizeHandle("south-east")).toBe(true);
    expect(isSelectionResizeHandle("center")).toBe(false);
    expect(isSelectionResizeHandle(null)).toBe(false);
  });

  it("keeps keyboard step constants explicit for later event wiring", () => {
    expect(SELECTION_KEYBOARD_STEP).toBe(1);
    expect(SELECTION_KEYBOARD_FAST_STEP).toBe(10);
  });

  it("moves a selected page rect by pointer delta without resizing it", () => {
    expect(
      moveSelectionRect(rect, { x: 20, y: 30 }, { x: 45, y: 10 })
    ).toEqual(rectFromEdges(35, 0, 135, 60));
  });

  it("moves a selected page rect by an explicit delta", () => {
    expect(moveSelectionRectByDelta(rect, { x: -4, y: 12 })).toEqual(
      rectFromEdges(6, 32, 106, 92)
    );
  });

  it("resizes east and south edges while preserving the opposite edges", () => {
    expect(
      resizeSelectionRect(rect, "south-east", { x: 110, y: 80 }, { x: 140, y: 120 })
    ).toEqual(rectFromEdges(10, 20, 140, 120));
  });

  it("resizes west and north edges while preserving the opposite edges", () => {
    expect(
      resizeSelectionRect(rect, "north-west", { x: 10, y: 20 }, { x: -15, y: 4 })
    ).toEqual(rectFromEdges(-15, 4, 110, 80));
  });

  it("resizes a single edge without changing the perpendicular axis", () => {
    expect(resizeSelectionRectByDelta(rect, "east", { x: 16, y: 40 })).toEqual(
      rectFromEdges(10, 20, 126, 80)
    );
  });

  it("clamps resize before an edge can flip past the default minimum size", () => {
    expect(resizeSelectionRectByDelta(rect, "west", { x: 120, y: 0 })).toEqual(
      rectFromEdges(110 - DEFAULT_MIN_SELECTION_SIZE, 20, 110, 80)
    );
    expect(resizeSelectionRectByDelta(rect, "north", { x: 0, y: 90 })).toEqual(
      rectFromEdges(10, 80 - DEFAULT_MIN_SELECTION_SIZE, 110, 80)
    );
  });

  it("accepts custom minimum dimensions for resize clamping", () => {
    expect(
      resizeSelectionRectByDelta(
        rect,
        "south-east",
        { x: -200, y: -200 },
        { minWidth: 24, minHeight: 32 }
      )
    ).toEqual(rectFromEdges(10, 20, 34, 52));
  });
});
