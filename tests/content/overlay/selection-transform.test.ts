import { describe, expect, it } from "vitest";
import { rectFromEdges } from "../../../src/firefox-derived/window-dimensions";
import {
  DEFAULT_MIN_SELECTION_SIZE,
  SELECTION_RESIZE_HIT_AREA,
  SELECTION_KEYBOARD_FAST_STEP,
  SELECTION_KEYBOARD_STEP,
  getSelectionInteractionAtPoint,
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

  it("keeps the pointer resize hit area explicit for overlay hit-testing", () => {
    expect(SELECTION_RESIZE_HIT_AREA).toBe(8);
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

  it("detects selected interior points as move interactions", () => {
    expect(getSelectionInteractionAtPoint(rect, { x: 60, y: 50 })).toEqual({
      type: "move"
    });
  });

  it("gives corner resize handles precedence over move interactions", () => {
    expect(getSelectionInteractionAtPoint(rect, { x: 12, y: 22 })).toEqual({
      type: "resize",
      handle: "north-west"
    });
    expect(getSelectionInteractionAtPoint(rect, { x: 108, y: 78 })).toEqual({
      type: "resize",
      handle: "south-east"
    });
  });

  it("detects edge resize handles from points just outside the selected rect", () => {
    expect(getSelectionInteractionAtPoint(rect, { x: 60, y: 15 })).toEqual({
      type: "resize",
      handle: "north"
    });
    expect(getSelectionInteractionAtPoint(rect, { x: 115, y: 50 })).toEqual({
      type: "resize",
      handle: "east"
    });
  });

  it("returns null when the pointer is outside the resize hit area", () => {
    expect(getSelectionInteractionAtPoint(rect, { x: 60, y: 10 })).toBeNull();
    expect(getSelectionInteractionAtPoint(rect, { x: 120, y: 50 })).toBeNull();
  });

  it("accepts a custom resize hit area for small selection checks", () => {
    expect(getSelectionInteractionAtPoint(rect, { x: 60, y: 15 }, { hitArea: 4 })).toBeNull();
    expect(getSelectionInteractionAtPoint(rect, { x: 60, y: 17 }, { hitArea: 4 })).toEqual({
      type: "resize",
      handle: "north"
    });
  });
});
