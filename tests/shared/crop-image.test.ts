import { describe, expect, it } from "vitest";
import {
  getImageViewportScale,
  getSourceCropRect
} from "../../src/shared/crop-image";
import { rectFromEdges } from "../../src/shared/rect";

describe("crop image helpers", () => {
  it("calculates scale from image natural size and viewport CSS size", () => {
    expect(
      getImageViewportScale(
        { naturalWidth: 1600, naturalHeight: 1200 },
        { clientWidth: 800, clientHeight: 600 }
      )
    ).toEqual({
      scaleX: 2,
      scaleY: 2
    });
  });

  it("scales a viewport crop rect into screenshot source pixels", () => {
    expect(
      getSourceCropRect({
        viewportCropRect: rectFromEdges(100, 50, 300, 250),
        imageNaturalSize: { naturalWidth: 1600, naturalHeight: 1200 },
        viewportCssSize: { clientWidth: 800, clientHeight: 600 }
      })
    ).toEqual(rectFromEdges(200, 100, 600, 500));
  });

  it("uses image dimensions instead of assuming devicePixelRatio", () => {
    expect(
      getSourceCropRect({
        viewportCropRect: rectFromEdges(10, 20, 110, 120),
        imageNaturalSize: { naturalWidth: 1200, naturalHeight: 900 },
        viewportCssSize: { clientWidth: 800, clientHeight: 600 }
      })
    ).toEqual(rectFromEdges(15, 30, 165, 180));
  });

  it("uses capture viewport CSS size so classic scrollbars do not widen the crop", () => {
    const selectedImageRect = rectFromEdges(36, 288.594, 756, 693.594);
    const screenshotNaturalSize = { naturalWidth: 1452, naturalHeight: 982 };

    expect(
      getSourceCropRect({
        viewportCropRect: selectedImageRect,
        imageNaturalSize: screenshotNaturalSize,
        viewportCssSize: {
          clientWidth: 1452,
          clientHeight: 982
        }
      })
    ).toEqual(rectFromEdges(36, 289, 756, 694));
  });

  it("documents the Always scroll bars failure when clientWidth is used as capture width", () => {
    const selectedImageRect = rectFromEdges(36, 288.594, 756, 693.594);
    const screenshotNaturalSize = { naturalWidth: 1452, naturalHeight: 982 };

    expect(
      getSourceCropRect({
        viewportCropRect: selectedImageRect,
        imageNaturalSize: screenshotNaturalSize,
        viewportCssSize: {
          clientWidth: 1440,
          clientHeight: 982
        }
      })?.width
    ).toBe(726);
  });

  it.each([
    { label: "80%", naturalWidth: 800, naturalHeight: 600, expected: rectFromEdges(80, 40, 280, 200) },
    { label: "100%", naturalWidth: 1000, naturalHeight: 750, expected: rectFromEdges(100, 50, 350, 250) },
    { label: "125%", naturalWidth: 1250, naturalHeight: 937.5, expected: rectFromEdges(125, 63, 438, 313) },
    { label: "150%", naturalWidth: 1500, naturalHeight: 1125, expected: rectFromEdges(150, 75, 525, 375) }
  ])("supports $label zoom-like viewport/image ratios", ({ naturalWidth, naturalHeight, expected }) => {
    expect(
      getSourceCropRect({
        viewportCropRect: rectFromEdges(100, 50, 350, 250),
        imageNaturalSize: { naturalWidth, naturalHeight },
        viewportCssSize: { clientWidth: 1000, clientHeight: 750 }
      })
    ).toEqual(expected);
  });

  it("snaps fractional element rect edges to nearest source pixels", () => {
    expect(
      getSourceCropRect({
        viewportCropRect: rectFromEdges(448.5, 228.3359375, 559.2109375, 266.3359375),
        imageNaturalSize: { naturalWidth: 1486, naturalHeight: 1726 },
        viewportCssSize: { clientWidth: 743, clientHeight: 863 }
      })
    ).toEqual(rectFromEdges(897, 457, 1118, 533));
  });

  it("clips source crop rects to screenshot image bounds", () => {
    expect(
      getSourceCropRect({
        viewportCropRect: rectFromEdges(-20, 30, 900, 700),
        imageNaturalSize: { naturalWidth: 1600, naturalHeight: 1200 },
        viewportCssSize: { clientWidth: 800, clientHeight: 600 }
      })
    ).toEqual(rectFromEdges(0, 60, 1600, 1200));
  });

  it("returns null for empty image or viewport inputs", () => {
    expect(
      getImageViewportScale(
        { naturalWidth: 0, naturalHeight: 1200 },
        { clientWidth: 800, clientHeight: 600 }
      )
    ).toBeNull();
    expect(
      getSourceCropRect({
        viewportCropRect: rectFromEdges(100, 50, 300, 250),
        imageNaturalSize: { naturalWidth: 1600, naturalHeight: 1200 },
        viewportCssSize: { clientWidth: 0, clientHeight: 600 }
      })
    ).toBeNull();
  });
});
