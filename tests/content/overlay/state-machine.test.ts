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
      dragStart: null
    });
  });

  it("enters hovering when a hover rect is available", () => {
    expect(transitionOverlayState(createInitialOverlayState(), { type: "hover", rect })).toEqual({
      status: "hovering",
      hoverRect: rect,
      selectedRect: null,
      dragStart: null
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
      dragStart: null
    });
  });

  it("keeps a selected rect stable while hover events continue", () => {
    const selected = transitionOverlayState(createInitialOverlayState(), {
      type: "select",
      rect
    });

    expect(transitionOverlayState(selected, { type: "hover", rect: nextRect })).toBe(selected);
  });

  it("moves to closing when canceled", () => {
    expect(transitionOverlayState(createInitialOverlayState(), { type: "cancel" })).toEqual({
      status: "closing",
      hoverRect: null,
      selectedRect: null,
      dragStart: null
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
      dragStart: { x: 10, y: 20 }
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
      dragStart: { x: 10, y: 20 }
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
      dragStart: null
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
      dragStart: null
    });
  });
});
