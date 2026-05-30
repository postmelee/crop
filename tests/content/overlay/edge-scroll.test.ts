import { describe, expect, it } from "vitest";
import {
  EDGE_SCROLL_MAX_STEP,
  getEdgeScrollDelta
} from "../../../src/content/overlay/edge-scroll";

describe("getEdgeScrollDelta", () => {
  const viewport = {
    clientWidth: 800,
    clientHeight: 600
  };

  it("stays inactive when the pointer is inside the safe viewport area", () => {
    expect(getEdgeScrollDelta({ x: 400, y: 300 }, viewport)).toEqual({
      x: 0,
      y: 0,
      active: false
    });
  });

  it("returns an upward delta near the top edge", () => {
    expect(getEdgeScrollDelta({ x: 400, y: 20 }, viewport)).toEqual({
      x: 0,
      y: -18,
      active: true
    });
  });

  it("returns a downward delta near the bottom edge", () => {
    expect(getEdgeScrollDelta({ x: 400, y: 580 }, viewport)).toEqual({
      x: 0,
      y: 18,
      active: true
    });
  });

  it("returns horizontal deltas near the left and right edges", () => {
    expect(getEdgeScrollDelta({ x: 10, y: 300 }, viewport)).toEqual({
      x: -21,
      y: 0,
      active: true
    });
    expect(getEdgeScrollDelta({ x: 790, y: 300 }, viewport)).toEqual({
      x: 21,
      y: 0,
      active: true
    });
  });

  it("combines horizontal and vertical deltas near a corner", () => {
    expect(getEdgeScrollDelta({ x: 10, y: 590 }, viewport)).toEqual({
      x: -21,
      y: 21,
      active: true
    });
  });

  it("clamps pointers outside the viewport to the max scroll step", () => {
    expect(getEdgeScrollDelta({ x: -100, y: 700 }, viewport)).toEqual({
      x: -EDGE_SCROLL_MAX_STEP,
      y: EDGE_SCROLL_MAX_STEP,
      active: true
    });
  });

  it("scales with custom threshold and max step values", () => {
    expect(
      getEdgeScrollDelta(
        { x: 50, y: 300 },
        viewport,
        {
          threshold: 100,
          maxStep: 10
        }
      )
    ).toEqual({
      x: -5,
      y: 0,
      active: true
    });
  });

  it("caps the edge threshold to half of the viewport size", () => {
    expect(
      getEdgeScrollDelta(
        { x: 0, y: 30 },
        {
          clientWidth: 100,
          clientHeight: 60
        },
        {
          threshold: 200,
          maxStep: 20
        }
      )
    ).toEqual({
      x: -20,
      y: 0,
      active: true
    });
  });

  it("stays inactive for invalid viewport or option values", () => {
    expect(getEdgeScrollDelta({ x: 0, y: 0 }, { clientWidth: 0, clientHeight: 600 })).toEqual({
      x: 0,
      y: 0,
      active: false
    });
    expect(
      getEdgeScrollDelta({ x: 0, y: 0 }, viewport, {
        threshold: 0
      })
    ).toEqual({
      x: 0,
      y: 0,
      active: false
    });
    expect(
      getEdgeScrollDelta({ x: Number.NaN, y: 0 }, viewport)
    ).toEqual({
      x: 0,
      y: 0,
      active: false
    });
  });
});
