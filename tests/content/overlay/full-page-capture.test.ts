import { describe, expect, it } from "vitest";
import {
  createFullPageMetrics,
  createFullPageTilePlan,
  getFullPageBounds,
  readFullPageMetrics
} from "../../../src/content/overlay/full-page-capture";
import { rectFromEdges } from "../../../src/shared/rect";

describe("full page capture helpers", () => {
  it("reads full page metrics from document and body dimensions", () => {
    const metrics = readFullPageMetrics({
      innerWidth: 320,
      innerHeight: 240,
      scrollX: 12,
      scrollY: 34,
      devicePixelRatio: 2,
      document: {
        documentElement: {
          clientWidth: 300,
          clientHeight: 200,
          scrollWidth: 300,
          scrollHeight: 200
        },
        body: {
          scrollWidth: 900,
          scrollHeight: 1200
        },
        scrollingElement: null
      }
    });

    expect(metrics).toEqual({
      viewportWidth: 300,
      viewportHeight: 200,
      scrollWidth: 900,
      scrollHeight: 1200,
      scrollX: 12,
      scrollY: 34,
      scrollMinX: 0,
      scrollMinY: 0,
      scrollMaxX: 600,
      scrollMaxY: 1000,
      devicePixelRatio: 2
    });
  });

  it("normalizes metrics and clamps scroll positions to the document range", () => {
    expect(
      createFullPageMetrics({
        viewportWidth: 500,
        viewportHeight: 400,
        scrollWidth: 1200,
        scrollHeight: 900,
        scrollX: 9999,
        scrollY: Number.NEGATIVE_INFINITY,
        devicePixelRatio: 0
      })
    ).toMatchObject({
      viewportWidth: 500,
      viewportHeight: 400,
      scrollWidth: 1200,
      scrollHeight: 900,
      scrollX: 700,
      scrollY: 0,
      scrollMaxX: 700,
      scrollMaxY: 500,
      devicePixelRatio: 1
    });
  });

  it("uses a Firefox-style full page bounds contract", () => {
    const metrics = createFullPageMetrics({
      viewportWidth: 500,
      viewportHeight: 400,
      scrollWidth: 1200,
      scrollHeight: 900,
      devicePixelRatio: 2
    });

    expect(getFullPageBounds(metrics)).toEqual({
      ...rectFromEdges(0, 0, 1200, 900),
      devicePixelRatio: 2
    });
  });

  it("plans vertical tiles with a bottom partial tile source crop", () => {
    const plan = createFullPageTilePlan(
      createFullPageMetrics({
        viewportWidth: 500,
        viewportHeight: 400,
        scrollWidth: 500,
        scrollHeight: 950
      })
    );

    expect(plan.outputCssSize).toEqual({ width: 500, height: 950 });
    expect(plan.viewportCssSize).toEqual({ clientWidth: 500, clientHeight: 400 });
    expect(plan.tiles).toHaveLength(3);
    expect(plan.tiles[0]).toMatchObject({
      indexX: 0,
      indexY: 0,
      scrollX: 0,
      scrollY: 0,
      pageRect: rectFromEdges(0, 0, 500, 400),
      viewportCropRect: rectFromEdges(0, 0, 500, 400),
      destinationCssRect: rectFromEdges(0, 0, 500, 400)
    });
    expect(plan.tiles[2]).toMatchObject({
      indexX: 0,
      indexY: 2,
      scrollX: 0,
      scrollY: 550,
      pageRect: rectFromEdges(0, 800, 500, 950),
      viewportCropRect: rectFromEdges(0, 250, 500, 400),
      destinationCssRect: rectFromEdges(0, 800, 500, 950)
    });
  });

  it("plans horizontal and vertical overflow without gaps", () => {
    const plan = createFullPageTilePlan(
      createFullPageMetrics({
        viewportWidth: 500,
        viewportHeight: 400,
        scrollWidth: 1200,
        scrollHeight: 900
      })
    );
    const bottomRight = plan.tiles.at(-1);

    expect(plan.tiles).toHaveLength(9);
    expect(bottomRight).toMatchObject({
      indexX: 2,
      indexY: 2,
      scrollX: 700,
      scrollY: 500,
      pageRect: rectFromEdges(1000, 800, 1200, 900),
      viewportCropRect: rectFromEdges(300, 300, 500, 400),
      destinationCssRect: rectFromEdges(1000, 800, 1200, 900)
    });
  });

  it("rejects empty viewports and oversized estimated output", () => {
    expect(() =>
      createFullPageTilePlan(
        createFullPageMetrics({
          viewportWidth: 0,
          viewportHeight: 400,
          scrollWidth: 800,
          scrollHeight: 900
        })
      )
    ).toThrow("non-empty viewport");

    expect(() =>
      createFullPageTilePlan(
        createFullPageMetrics({
          viewportWidth: 500,
          viewportHeight: 400,
          scrollWidth: 1200,
          scrollHeight: 900,
          devicePixelRatio: 2
        }),
        {
          maxOutputDimension: 1000
        }
      )
    ).toThrow("maximum canvas size");
  });
});
