import { describe, expect, it } from "vitest";
import { rectFromEdges } from "../../../src/firefox-derived/window-dimensions";
import {
  getActionButtonsPresentation,
  getEyeOffsetPresentation,
  getHighlightPresentation,
  getSelectionControlsPresentation,
  getSelectionSizePresentation
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
      transform: "translate(100px, 180px)"
    });
  });

  it("moves action buttons into the selected rect near the viewport bottom", () => {
    expect(
      getActionButtonsPresentation(rectFromEdges(120, 540, 320, 580), viewport, actionsSize)
    ).toEqual({
      hidden: false,
      transform: "translate(100px, 520px)"
    });
  });

  it("right-aligns action buttons to the visible selected edge inside the viewport", () => {
    expect(
      getActionButtonsPresentation(rectFromEdges(760, 100, 790, 140), viewport, actionsSize)
    ).toEqual({
      hidden: false,
      transform: "translate(570px, 140px)"
    });
  });

  it("clamps action buttons to the lower viewport edge when the selected rect is below view", () => {
    expect(
      getActionButtonsPresentation(rectFromEdges(120, 660, 320, 720), viewport, actionsSize)
    ).toEqual({
      hidden: false,
      transform: "translate(100px, 548px)"
    });
  });

  it("clamps action buttons to the upper viewport edge when the selected rect is above view", () => {
    expect(
      getActionButtonsPresentation(rectFromEdges(120, -120, 320, -60), viewport, actionsSize)
    ).toEqual({
      hidden: false,
      transform: "translate(100px, 8px)"
    });
  });

  it("clamps action buttons when neither above nor below has enough room", () => {
    expect(
      getActionButtonsPresentation(rectFromEdges(120, 10, 320, 590), viewport, actionsSize)
    ).toEqual({
      hidden: false,
      transform: "translate(100px, 530px)"
    });
  });
});

describe("getSelectionControlsPresentation", () => {
  it("uses the same viewport projection contract as the selected highlight", () => {
    expect(getSelectionControlsPresentation(rectFromEdges(10.125, 20.5, 110.125, 70.75))).toEqual({
      hidden: false,
      transform: "translate(10.13px, 20.5px)",
      width: "100px",
      height: "50.25px"
    });
  });

  it("hides controls when the selected rect has no visible viewport intersection", () => {
    expect(getSelectionControlsPresentation(null)).toEqual({
      hidden: true,
      transform: "",
      width: "",
      height: ""
    });
  });
});

describe("getSelectionSizePresentation", () => {
  it("shows Firefox-style floored selected dimensions when the visible rect can fit the badge", () => {
    expect(
      getSelectionSizePresentation(
        rectFromEdges(10.4, 20.2, 111, 81),
        rectFromEdges(10, 20, 120, 90)
      )
    ).toEqual({
      hidden: false,
      text: "100 x 60"
    });
  });

  it("hides the badge when there is no visible selected rect", () => {
    expect(getSelectionSizePresentation(rectFromEdges(10, 20, 110, 80), null)).toEqual({
      hidden: true,
      text: ""
    });
  });

  it("hides the badge when the visible selection is too small", () => {
    expect(
      getSelectionSizePresentation(
        rectFromEdges(10, 20, 110, 80),
        rectFromEdges(10, 20, 50, 40)
      )
    ).toEqual({
      hidden: true,
      text: ""
    });
  });
});

describe("getEyeOffsetPresentation", () => {
  const viewport = {
    clientWidth: 800,
    clientHeight: 600
  };

  it("keeps pupils centered when the pointer is at viewport center", () => {
    expect(getEyeOffsetPresentation({ x: 400, y: 300 }, viewport)).toEqual({
      x: "0px",
      y: "0px"
    });
  });

  it("moves pupils toward the pointer within the Firefox-style viewport scale", () => {
    expect(getEyeOffsetPresentation({ x: 800, y: 600 }, viewport)).toEqual({
      x: "5px",
      y: "5px"
    });
    expect(getEyeOffsetPresentation({ x: 0, y: 0 }, viewport)).toEqual({
      x: "-5px",
      y: "-5px"
    });
  });

  it("falls back to a centered pupil offset for invalid viewport dimensions", () => {
    expect(
      getEyeOffsetPresentation(
        { x: 800, y: 600 },
        {
          clientWidth: 0,
          clientHeight: 0
        }
      )
    ).toEqual({
      x: "0px",
      y: "0px"
    });
  });
});
