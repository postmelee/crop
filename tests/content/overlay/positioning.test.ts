import { describe, expect, it } from "vitest";
import { rectFromEdges } from "../../../src/firefox-derived/window-dimensions";
import {
  getActionButtonsPresentation,
  getHighlightPresentation
} from "../../../src/content/overlay/positioning";

describe("getHighlightPresentation", () => {
  it("hides the highlight when no rect is available", () => {
    expect(getHighlightPresentation(null)).toEqual({
      hidden: true,
      transform: "",
      width: "",
      height: ""
    });
  });

  it("converts a viewport rect into stable CSS placement values", () => {
    expect(getHighlightPresentation(rectFromEdges(10.125, 20.5, 110.125, 70.75))).toEqual({
      hidden: false,
      transform: "translate(10.13px, 20.5px)",
      width: "100px",
      height: "50.25px"
    });
  });

  it("normalizes negative zero after pixel rounding", () => {
    expect(getHighlightPresentation(rectFromEdges(-0.001, -0.001, 40, 30))).toMatchObject({
      transform: "translate(0px, 0px)"
    });
  });
});

describe("getActionButtonsPresentation", () => {
  const viewport = {
    clientWidth: 800,
    clientHeight: 600
  };
  const actionsSize = {
    width: 220,
    height: 44
  };

  it("hides the action buttons when no selected rect is available", () => {
    expect(getActionButtonsPresentation(null, viewport, actionsSize)).toEqual({
      hidden: true,
      transform: ""
    });
  });

  it("places action buttons below a selected rect when there is room", () => {
    expect(
      getActionButtonsPresentation(rectFromEdges(120, 100, 320, 180), viewport, actionsSize)
    ).toEqual({
      hidden: false,
      transform: "translate(120px, 188px)"
    });
  });

  it("flips action buttons above a selected rect near the viewport bottom", () => {
    expect(
      getActionButtonsPresentation(rectFromEdges(120, 540, 320, 580), viewport, actionsSize)
    ).toEqual({
      hidden: false,
      transform: "translate(120px, 488px)"
    });
  });

  it("clamps action buttons inside the viewport edge margin", () => {
    expect(
      getActionButtonsPresentation(rectFromEdges(760, 100, 790, 140), viewport, actionsSize)
    ).toEqual({
      hidden: false,
      transform: "translate(572px, 148px)"
    });
  });
});
