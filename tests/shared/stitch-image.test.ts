import { describe, expect, it } from "vitest";
import {
  getStitchDestinationPixelRect,
  getStitchOutputPixelPlan,
  getStitchOutputPixelSize,
  getStitchPreviewTileLayout,
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

  it("keeps the source scale when output fits within canvas limits", () => {
    expect(
      getStitchOutputPixelPlan(
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
      height: 1188,
      sourceScale: {
        scaleX: 1.25,
        scaleY: 1.25
      },
      outputScale: {
        scaleX: 1.25,
        scaleY: 1.25
      },
      downscaleRatio: 1,
      downscaled: false
    });
  });

  it("downscales oversized output dimensions while preserving aspect ratio", () => {
    const plan = getStitchOutputPixelPlan(
      {
        width: 1000,
        height: 20000
      },
      {
        scaleX: 2,
        scaleY: 2
      }
    );

    expect(plan.downscaled).toBe(true);
    expect(plan.downscaleRatio).toBeLessThan(1);
    expect(plan.width).toBeLessThanOrEqual(MAX_CAPTURE_DIMENSION);
    expect(plan.height).toBeLessThanOrEqual(MAX_CAPTURE_DIMENSION);
    expect(plan.width * plan.height).toBeLessThanOrEqual(MAX_CAPTURE_AREA);
    expect(plan.outputScale.scaleX / plan.sourceScale.scaleX).toBeCloseTo(
      plan.outputScale.scaleY / plan.sourceScale.scaleY
    );
  });

  it("downscales oversized output area while preserving aspect ratio", () => {
    const plan = getStitchOutputPixelPlan(
      {
        width: 20000,
        height: 20000
      },
      {
        scaleX: 1,
        scaleY: 1
      }
    );

    expect(plan.downscaled).toBe(true);
    expect(plan.width).toBeLessThanOrEqual(MAX_CAPTURE_DIMENSION);
    expect(plan.height).toBeLessThanOrEqual(MAX_CAPTURE_DIMENSION);
    expect(plan.width * plan.height).toBeLessThanOrEqual(MAX_CAPTURE_AREA);
    expect(plan.outputScale.scaleX).toBeCloseTo(plan.outputScale.scaleY);
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

  it("keeps adjacent destination tiles edge-aligned after pixel snapping", () => {
    const scale = {
      scaleX: 1.5,
      scaleY: 1.5
    };
    const firstTile = getStitchDestinationPixelRect(rectFromEdges(0, 0, 333.3, 400), scale);
    const secondTile = getStitchDestinationPixelRect(
      rectFromEdges(333.3, 0, 666.6, 400),
      scale
    );

    expect(firstTile.right).toBe(secondTile.left);
    expect(firstTile.bottom).toBe(secondTile.bottom);
  });

  it("keeps adjacent destination tiles edge-aligned after downscaling", () => {
    const plan = getStitchOutputPixelPlan(
      {
        width: 1000,
        height: 1000
      },
      {
        scaleX: 1,
        scaleY: 1
      },
      {
        maxOutputArea: 250_000
      }
    );
    const firstTile = getStitchDestinationPixelRect(
      rectFromEdges(0, 0, 500, 1000),
      plan.outputScale
    );
    const secondTile = getStitchDestinationPixelRect(
      rectFromEdges(500, 0, 1000, 1000),
      plan.outputScale
    );

    expect(plan.downscaled).toBe(true);
    expect(plan.width * plan.height).toBeLessThanOrEqual(250_000);
    expect(firstTile.right).toBe(secondTile.left);
    expect(secondTile.right).toBe(plan.width);
    expect(firstTile.bottom).toBe(plan.height);
    expect(secondTile.bottom).toBe(plan.height);
  });

  it("uses the stitched destination rect as the preview tile wrapper", () => {
    const outputScale = {
      scaleX: 1.5,
      scaleY: 1.5
    };
    const destinationCssRect = rectFromEdges(0, 800.2, 500, 950);
    const layout = getStitchPreviewTileLayout({
      viewportCropRect: rectFromEdges(0, 250.2, 500, 399.6),
      destinationCssRect,
      viewportCssSize: {
        clientWidth: 500,
        clientHeight: 400
      },
      outputScale
    });

    expect(layout.tileRect).toEqual(
      getStitchDestinationPixelRect(destinationCssRect, outputScale)
    );
    expect(layout.imageRect).toEqual(rectFromEdges(0, -375, 750, 225));
    expect(layout.imageRect.bottom).toBe(layout.tileRect.height);
  });

  it("keeps preview tile wrappers edge-aligned after downscaling", () => {
    const plan = getStitchOutputPixelPlan(
      {
        width: 1000,
        height: 1000
      },
      {
        scaleX: 1,
        scaleY: 1
      },
      {
        maxOutputArea: 250_000
      }
    );
    const firstTile = getStitchPreviewTileLayout({
      viewportCropRect: rectFromEdges(0, 0, 500, 1000),
      destinationCssRect: rectFromEdges(0, 0, 500, 1000),
      viewportCssSize: {
        clientWidth: 500,
        clientHeight: 1000
      },
      outputScale: plan.outputScale
    });
    const secondTile = getStitchPreviewTileLayout({
      viewportCropRect: rectFromEdges(0, 0, 500, 1000),
      destinationCssRect: rectFromEdges(500, 0, 1000, 1000),
      viewportCssSize: {
        clientWidth: 500,
        clientHeight: 1000
      },
      outputScale: plan.outputScale
    });

    expect(plan.downscaled).toBe(true);
    expect(firstTile.tileRect.right).toBe(secondTile.tileRect.left);
    expect(secondTile.tileRect.right).toBe(plan.width);
    expect(firstTile.imageRect.width).toBe(firstTile.tileRect.width);
    expect(secondTile.imageRect.width).toBe(secondTile.tileRect.width);
  });

  it("rejects empty and over-limit output sizes", () => {
    expect(() => validateOutputPixelSize({ width: 0, height: 10 })).toThrow("non-empty");
    expect(() =>
      getStitchOutputPixelPlan(
        {
          width: 0,
          height: 10
        },
        {
          scaleX: 1,
          scaleY: 1
        }
      )
    ).toThrow("non-empty");
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
