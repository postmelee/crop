import { describe, expect, it } from "vitest";
import {
  getStitchDestinationPixelRect,
  getStitchOutputPixelSize,
  getStitchSourcePixelRect,
  MAX_CAPTURE_AREA,
  MAX_CAPTURE_DIMENSION,
  validateOutputPixelSize
} from "../../src/shared/stitch-image";
import { rectFromEdges } from "../../src/shared/rect";

describe("stitch image helpers", () => {
  it("converts output CSS size to rounded output pixels", () => {
    expect(
      getStitchOutputPixelSize(
        {
          width: 1180.4,
          height: 950.5
        },
        {
          scaleX: 1.25,
          scaleY: 1.25
        }
      )
    ).toEqual({
      width: 1476,
      height: 1188
    });
  });

  it("uses nearest source pixels for fractional viewport crop edges", () => {
    expect(
      getStitchSourcePixelRect({
        viewportCropRect: rectFromEdges(0, 250.2, 500, 399.6),
        imageNaturalSize: {
          naturalWidth: 1000,
          naturalHeight: 800
        },
        viewportCssSize: {
          clientWidth: 500,
          clientHeight: 400
        }
      })
    ).toEqual(rectFromEdges(0, 500, 1000, 799));
  });

  it("snaps destination CSS rects to nearest output pixels", () => {
    expect(
      getStitchDestinationPixelRect(
        rectFromEdges(1000, 800.2, 1200.4, 900),
        {
          scaleX: 1.5,
          scaleY: 1.5
        }
      )
    ).toEqual(rectFromEdges(1500, 1200, 1801, 1350));
  });

  it("rejects empty and over-limit output sizes", () => {
    expect(() => validateOutputPixelSize({ width: 0, height: 10 })).toThrow("non-empty");
    expect(() =>
      validateOutputPixelSize({
        width: MAX_CAPTURE_DIMENSION + 1,
        height: 10
      })
    ).toThrow("maximum canvas size");
    expect(() =>
      validateOutputPixelSize({
        width: MAX_CAPTURE_DIMENSION,
        height: Math.floor(MAX_CAPTURE_AREA / MAX_CAPTURE_DIMENSION) + 1
      })
    ).toThrow("maximum canvas size");
  });
});
