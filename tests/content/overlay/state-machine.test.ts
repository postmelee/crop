import { describe, expect, it } from "vitest";
import { rectFromEdges } from "../../../src/firefox-derived/window-dimensions";
import {
  createInitialOverlayState,
  transitionOverlayState
} from "../../../src/content/overlay/state-machine";

describe("transitionOverlayState", () => {
  const rect = rectFromEdges(10, 20, 110, 80);
  const nextRect = rectFromEdges(30, 40, 180, 120);

  it("starts in idle with no active rects", () => {
    expect(createInitialOverlayState()).toEqual({
      status: "idle",
      hoverRect: null,
      selectedRect: null,
      dragStart: null,
      selectionAdjustment: null
    });
  });

  it("enters hovering when a hover rect is available", () => {
    expect(transitionOverlayState(createInitialOverlayState(), { type: "hover", rect })).toEqual({
      status: "hovering",
      hoverRect: rect,
      selectedRect: null,
      dragStart: null,
      selectionAdjustment: null
    });
  });

  it("returns to idle when hover rect is cleared", () => {
    const hovering = transitionOverlayState(createInitialOverlayState(), {
      type: "hover",
      rect
    });

    expect(transitionOverlayState(hovering, { type: "hover", rect: null })).toEqual(
      createInitialOverlayState()
    );
  });

  it("selects the current hover rect", () => {
    const hovering = transitionOverlayState(createInitialOverlayState(), {
      type: "hover",
      rect
    });

    expect(transitionOverlayState(hovering, { type: "select" })).toEqual({
      status: "selected",
      hoverRect: null,
      selectedRect: rect,
      dragStart: null,
      selectionAdjustment: null
    });
  });

  it("keeps a selected rect stable while hover events continue", () => {
    const selected = transitionOverlayState(createInitialOverlayState(), {
      type: "select",
      rect
    });

    expect(transitionOverlayState(selected, { type: "hover", rect: nextRect })).toBe(selected);
  });

  it("resets a selected rect back to idle", () => {
    const selected = transitionOverlayState(createInitialOverlayState(), {
      type: "select",
      rect
    });

    expect(transitionOverlayState(selected, { type: "resetSelection" })).toEqual(
      createInitialOverlayState()
    );
  });

  it("ignores resetSelection outside selected state", () => {
    const hovering = transitionOverlayState(createInitialOverlayState(), {
      type: "hover",
      rect
    });

    expect(transitionOverlayState(hovering, { type: "resetSelection" })).toBe(hovering);
  });

  it("moves to closing when canceled", () => {
    expect(transitionOverlayState(createInitialOverlayState(), { type: "cancel" })).toEqual({
      status: "closing",
      hoverRect: null,
      selectedRect: null,
      dragStart: null,
      selectionAdjustment: null
    });
  });

  it("enters draggingReady on pointer down and keeps the current hover candidate", () => {
    const hovering = transitionOverlayState(createInitialOverlayState(), {
      type: "hover",
      rect
    });

    expect(
      transitionOverlayState(hovering, {
        type: "dragStart",
        point: { x: 10, y: 20 }
      })
    ).toEqual({
      status: "draggingReady",
      hoverRect: rect,
      selectedRect: null,
      dragStart: { x: 10, y: 20 },
      selectionAdjustment: null
    });
  });

  it("keeps draggingReady until the pointer moves past the Firefox drag threshold", () => {
    const draggingReady = transitionOverlayState(createInitialOverlayState(), {
      type: "dragStart",
      point: { x: 10, y: 20 }
    });

    expect(
      transitionOverlayState(draggingReady, {
        type: "dragMove",
        point: { x: 30, y: 30 }
      })
    ).toBe(draggingReady);
  });

  it("enters dragging with a region after the pointer passes the drag threshold", () => {
    const draggingReady = transitionOverlayState(createInitialOverlayState(), {
      type: "dragStart",
      point: { x: 10, y: 20 }
    });

    expect(
      transitionOverlayState(draggingReady, {
        type: "dragMove",
        point: { x: 90, y: 120 }
      })
    ).toEqual({
      status: "dragging",
      hoverRect: null,
      selectedRect: rectFromEdges(10, 20, 90, 120),
      dragStart: { x: 10, y: 20 },
      selectionAdjustment: null
    });
  });

  it("normalizes the dragged region when the pointer moves above and left of the start", () => {
    const draggingReady = transitionOverlayState(createInitialOverlayState(), {
      type: "dragStart",
      point: { x: 120, y: 140 }
    });

    expect(
      transitionOverlayState(draggingReady, {
        type: "dragMove",
        point: { x: 40, y: 50 }
      })
    ).toEqual({
      status: "dragging",
      hoverRect: null,
      selectedRect: rectFromEdges(40, 50, 120, 140),
      dragStart: { x: 120, y: 140 },
      selectionAdjustment: null
    });
  });

  it("keeps rect normalization when the drag endpoint advances after scrolling", () => {
    const draggingReady = transitionOverlayState(createInitialOverlayState(), {
      type: "dragStart",
      point: { x: 340, y: 920 }
    });

    expect(
      transitionOverlayState(draggingReady, {
        type: "dragMove",
        point: { x: 420, y: 1480 }
      })
    ).toEqual({
      status: "dragging",
      hoverRect: null,
      selectedRect: rectFromEdges(340, 920, 420, 1480),
      dragStart: { x: 340, y: 920 },
      selectionAdjustment: null
    });
  });

  it("selects the dragged region on pointer up", () => {
    const draggingReady = transitionOverlayState(createInitialOverlayState(), {
      type: "dragStart",
      point: { x: 10, y: 20 }
    });
    const dragging = transitionOverlayState(draggingReady, {
      type: "dragMove",
      point: { x: 90, y: 120 }
    });

    expect(transitionOverlayState(dragging, { type: "dragEnd" })).toEqual({
      status: "selected",
      hoverRect: null,
      selectedRect: rectFromEdges(10, 20, 90, 120),
      dragStart: null,
      selectionAdjustment: null
    });
  });

  it("selects the hovered element on pointer up when drag never starts", () => {
    const hovering = transitionOverlayState(createInitialOverlayState(), {
      type: "hover",
      rect
    });
    const draggingReady = transitionOverlayState(hovering, {
      type: "dragStart",
      point: { x: 10, y: 20 }
    });

    expect(transitionOverlayState(draggingReady, { type: "dragEnd" })).toEqual({
      status: "selected",
      hoverRect: null,
      selectedRect: rect,
      dragStart: null,
      selectionAdjustment: null
    });
  });

  it("starts a selected move adjustment with the current selected rect as the baseline", () => {
    const selected = transitionOverlayState(createInitialOverlayState(), {
      type: "select",
      rect
    });

    expect(
      transitionOverlayState(selected, {
        type: "selectionMoveStart",
        point: { x: 30, y: 40 }
      })
    ).toEqual({
      status: "moving",
      hoverRect: null,
      selectedRect: rect,
      dragStart: null,
      selectionAdjustment: {
        mode: "move",
        startRect: rect,
        startPoint: { x: 30, y: 40 }
      }
    });
  });

  it("moves the selected rect from the adjustment baseline", () => {
    const selected = transitionOverlayState(createInitialOverlayState(), {
      type: "select",
      rect
    });
    const moving = transitionOverlayState(selected, {
      type: "selectionMoveStart",
      point: { x: 30, y: 40 }
    });

    expect(
      transitionOverlayState(moving, {
        type: "selectionAdjustMove",
        point: { x: 55, y: 18 }
      })
    ).toEqual({
      status: "moving",
      hoverRect: null,
      selectedRect: rectFromEdges(35, -2, 135, 58),
      dragStart: null,
      selectionAdjustment: {
        mode: "move",
        startRect: rect,
        startPoint: { x: 30, y: 40 }
      }
    });
  });

  it("starts a selected resize adjustment with the active handle", () => {
    const selected = transitionOverlayState(createInitialOverlayState(), {
      type: "select",
      rect
    });

    expect(
      transitionOverlayState(selected, {
        type: "selectionResizeStart",
        handle: "south-east",
        point: { x: 110, y: 80 }
      })
    ).toEqual({
      status: "resizing",
      hoverRect: null,
      selectedRect: rect,
      dragStart: null,
      selectionAdjustment: {
        mode: "resize",
        handle: "south-east",
        startRect: rect,
        startPoint: { x: 110, y: 80 }
      }
    });
  });

  it("resizes the selected rect from the adjustment baseline", () => {
    const selected = transitionOverlayState(createInitialOverlayState(), {
      type: "select",
      rect
    });
    const resizing = transitionOverlayState(selected, {
      type: "selectionResizeStart",
      handle: "north-west",
      point: { x: 10, y: 20 }
    });

    expect(
      transitionOverlayState(resizing, {
        type: "selectionAdjustMove",
        point: { x: 24, y: 34 }
      })
    ).toEqual({
      status: "resizing",
      hoverRect: null,
      selectedRect: rectFromEdges(24, 34, 110, 80),
      dragStart: null,
      selectionAdjustment: {
        mode: "resize",
        handle: "north-west",
        startRect: rect,
        startPoint: { x: 10, y: 20 }
      }
    });
  });

  it("returns to selected when a move or resize adjustment ends", () => {
    const selected = transitionOverlayState(createInitialOverlayState(), {
      type: "select",
      rect
    });
    const moving = transitionOverlayState(selected, {
      type: "selectionMoveStart",
      point: { x: 30, y: 40 }
    });
    const adjusted = transitionOverlayState(moving, {
      type: "selectionAdjustMove",
      point: { x: 40, y: 50 }
    });

    expect(transitionOverlayState(adjusted, { type: "selectionAdjustEnd" })).toEqual({
      status: "selected",
      hoverRect: null,
      selectedRect: rectFromEdges(20, 30, 120, 90),
      dragStart: null,
      selectionAdjustment: null
    });
  });

  it("ignores selected adjustment events when no selected rect is active", () => {
    const idle = createInitialOverlayState();

    expect(
      transitionOverlayState(idle, {
        type: "selectionMoveStart",
        point: { x: 30, y: 40 }
      })
    ).toBe(idle);
    expect(
      transitionOverlayState(idle, {
        type: "selectionResizeStart",
        handle: "north",
        point: { x: 30, y: 40 }
      })
    ).toBe(idle);
    expect(
      transitionOverlayState(idle, {
        type: "selectionAdjustMove",
        point: { x: 30, y: 40 }
      })
    ).toBe(idle);
    expect(transitionOverlayState(idle, { type: "selectionAdjustEnd" })).toBe(idle);
  });
});
