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
      selectedRect: null
    });
  });

  it("enters hovering when a hover rect is available", () => {
    expect(transitionOverlayState(createInitialOverlayState(), { type: "hover", rect })).toEqual({
      status: "hovering",
      hoverRect: rect,
      selectedRect: null
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
      selectedRect: rect
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
      selectedRect: null
    });
  });
});
