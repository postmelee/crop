import { describe, expect, it } from "vitest";
import { rectFromEdges } from "../../../src/firefox-derived/window-dimensions";
import { getHighlightPresentation } from "../../../src/content/overlay/positioning";

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
