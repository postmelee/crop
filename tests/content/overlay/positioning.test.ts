import { describe, expect, it } from "vitest";
import { rectFromEdges } from "../../../src/firefox-derived/window-dimensions";
import {
  applyDocumentOverlayPresentation,
  applySelectionMaskPresentation,
  getActionButtonsPresentation,
  getDocumentOverlayPresentation,
  getEyeOffsetPresentation,
  getHighlightPresentation,
  getSelectionControlsPresentation,
  getSelectionSizePresentation
} from "../../../src/content/overlay/positioning";

interface FakeElement {
  hidden: boolean;
  style: Record<string, string>;
  removeAttribute(name: string): void;
}

function createFakeElement(): HTMLElement & FakeElement {
  return {
    hidden: false,
    style: {},
    removeAttribute(name: string): void {
      if (name === "style") {
        this.style = {};
      }
    }
  } as unknown as HTMLElement & FakeElement;
}

describe("getDocumentOverlayPresentation", () => {
  it("sizes the overlay root to the document coordinate space", () => {
    expect(
      getDocumentOverlayPresentation({
        scrollMinX: -12.25,
        scrollMinY: 0,
        scrollWidth: 1440.5,
        scrollHeight: 3200
      })
    ).toEqual({
      left: "-12.25px",
      top: "0px",
      width: "1440.5px",
      height: "3200px"
    });
  });

  it("applies document dimensions to the overlay root style", () => {
    const element = createFakeElement();

    applyDocumentOverlayPresentation(element, {
      scrollMinX: 0,
      scrollMinY: 0,
      scrollWidth: 1000,
      scrollHeight: 2200
    });

    expect(element.style).toMatchObject({
      left: "0px",
      top: "0px",
      width: "1000px",
      height: "2200px"
    });
  });
});

describe("getHighlightPresentation", () => {
  it("hides the highlight when no rect is available", () => {
    expect(getHighlightPresentation(null)).toEqual({
      hidden: true,
      left: "",
      top: "",
      width: "",
      height: ""
    });
  });

  it("converts a viewport rect into stable CSS placement values", () => {
    expect(getHighlightPresentation(rectFromEdges(10.125, 20.5, 110.125, 70.75))).toEqual({
      hidden: false,
      left: "10.13px",
      top: "20.5px",
      width: "100px",
      height: "50.25px"
    });
  });

  it("normalizes negative zero after pixel rounding", () => {
    expect(getHighlightPresentation(rectFromEdges(-0.001, -0.001, 40, 30))).toMatchObject({
      left: "0px",
      top: "0px"
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
      left: "10.13px",
      top: "20.5px",
      width: "100px",
      height: "50.25px"
    });
  });

  it("hides controls when the selected rect has no visible viewport intersection", () => {
    expect(getSelectionControlsPresentation(null)).toEqual({
      hidden: true,
      left: "",
      top: "",
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

describe("applySelectionMaskPresentation", () => {
  it("positions Firefox-style background pieces in the shared selection container space", () => {
    const elements = {
      container: createFakeElement(),
      top: createFakeElement(),
      right: createFakeElement(),
      bottom: createFakeElement(),
      left: createFakeElement()
    };

    applySelectionMaskPresentation(elements, rectFromEdges(10.125, 20.5, 110.125, 70.75));

    expect(elements.top.hidden).toBe(false);
    expect(elements.top.style).toMatchObject({
      left: "0",
      top: "0",
      width: "100%",
      height: "20.5px"
    });
    expect(elements.right.style).toMatchObject({
      left: "110.13px",
      top: "20.5px",
      width: "calc(100% - 110.13px)",
      height: "50.25px"
    });
    expect(elements.bottom.style).toMatchObject({
      left: "0",
      top: "70.75px",
      width: "100%",
      height: "calc(100% - 70.75px)"
    });
    expect(elements.left.style).toMatchObject({
      left: "0",
      top: "20.5px",
      width: "10.13px",
      height: "50.25px"
    });
  });

  it("uses numeric document bounds for right and bottom mask pieces during resize", () => {
    const elements = {
      container: createFakeElement(),
      top: createFakeElement(),
      right: createFakeElement(),
      bottom: createFakeElement(),
      left: createFakeElement()
    };

    applySelectionMaskPresentation(elements, rectFromEdges(10, 20, 110, 70), {
      containerSize: {
        width: 300,
        height: 220
      }
    });

    expect(elements.top.style).toMatchObject({
      width: "300px",
      height: "20px"
    });
    expect(elements.right.style).toMatchObject({
      left: "110px",
      width: "190px",
      height: "50px"
    });
    expect(elements.bottom.style).toMatchObject({
      top: "70px",
      width: "300px",
      height: "150px"
    });
  });

  it("hides only the background pieces when no visible selection rect is available", () => {
    const elements = {
      container: createFakeElement(),
      top: createFakeElement(),
      right: createFakeElement(),
      bottom: createFakeElement(),
      left: createFakeElement()
    };

    elements.container.hidden = false;
    elements.top.style.height = "10px";
    applySelectionMaskPresentation(elements, null);

    expect(elements.container.hidden).toBe(false);
    for (const part of [elements.top, elements.right, elements.bottom, elements.left]) {
      expect(part.hidden).toBe(true);
      expect(part.style).toEqual({});
    }
  });

  it("keeps a solid dark overlay when an active selection is outside the viewport", () => {
    const elements = {
      container: createFakeElement(),
      top: createFakeElement(),
      right: createFakeElement(),
      bottom: createFakeElement(),
      left: createFakeElement()
    };

    elements.right.style.width = "20px";
    applySelectionMaskPresentation(elements, null, { nullRectMode: "solid" });

    expect(elements.top.hidden).toBe(false);
    expect(elements.top.style).toMatchObject({
      left: "0",
      top: "0",
      width: "100%",
      height: "100%"
    });
    for (const part of [elements.right, elements.bottom, elements.left]) {
      expect(part.hidden).toBe(true);
      expect(part.style).toEqual({});
    }
  });

  it("uses numeric document bounds for a solid offscreen overlay", () => {
    const elements = {
      container: createFakeElement(),
      top: createFakeElement(),
      right: createFakeElement(),
      bottom: createFakeElement(),
      left: createFakeElement()
    };

    applySelectionMaskPresentation(elements, null, {
      nullRectMode: "solid",
      containerSize: {
        width: 320,
        height: 240
      }
    });

    expect(elements.top.style).toMatchObject({
      width: "320px",
      height: "240px"
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
