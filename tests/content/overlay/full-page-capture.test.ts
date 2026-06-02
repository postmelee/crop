import { describe, expect, it } from "vitest";
import {
  captureFullPageTiles,
  createCapturedFullPageTile,
  createFullPageMetrics,
  createFullPageTilePlan,
  getFullPageBounds,
  readFullPageMetrics,
  type FullPageMetrics
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

  it("uses actual scroll offsets when preparing a captured tile", () => {
    const plan = createFullPageTilePlan(
      createFullPageMetrics({
        viewportWidth: 500,
        viewportHeight: 400,
        scrollWidth: 500,
        scrollHeight: 950
      })
    );

    expect(
      createCapturedFullPageTile({
        tile: plan.tiles[2],
        dataUrl: "data:image/png;base64,third",
        metrics: createFullPageMetrics({
          viewportWidth: 500,
          viewportHeight: 400,
          scrollWidth: 500,
          scrollHeight: 950,
          scrollY: 550
        })
      })
    ).toMatchObject({
      dataUrl: "data:image/png;base64,third",
      actualScrollX: 0,
      actualScrollY: 550,
      viewportCropRect: rectFromEdges(0, 250, 500, 400),
      destinationCssRect: rectFromEdges(0, 800, 500, 950)
    });
  });

  it("captures every tile and restores scroll, overlay visibility, and scroll behavior", async () => {
    const events: string[] = [];
    let currentScrollX = 0;
    let currentScrollY = 120;
    const readMetrics = (): FullPageMetrics =>
      createFullPageMetrics({
        viewportWidth: 500,
        viewportHeight: 400,
        scrollWidth: 500,
        scrollHeight: 950,
        scrollX: currentScrollX,
        scrollY: currentScrollY
      });

    const result = await captureFullPageTiles({
      readMetrics,
      scrollTo: (x, y) => {
        events.push(`scroll:${x},${y}`);
        currentScrollX = x;
        currentScrollY = y;
      },
      waitForPaint: () => {
        events.push("paint");
        return Promise.resolve();
      },
      setOverlayHidden: (hidden) => {
        events.push(`hidden:${hidden}`);
      },
      setScrollBehaviorDisabled: (disabled) => {
        events.push(`scrollBehaviorDisabled:${disabled}`);
      },
      captureVisibleTab: async () => {
        events.push(`capture:${currentScrollY}`);
        return `data:image/png;base64,${currentScrollY}`;
      }
    });

    expect(result.tiles.map((tile) => tile.actualScrollY)).toEqual([0, 400, 550]);
    expect(result.tiles.map((tile) => tile.dataUrl)).toEqual([
      "data:image/png;base64,0",
      "data:image/png;base64,400",
      "data:image/png;base64,550"
    ]);
    expect(currentScrollY).toBe(120);
    expect(events).toEqual([
      "scrollBehaviorDisabled:true",
      "paint",
      "scroll:0,0",
      "paint",
      "hidden:true",
      "paint",
      "capture:0",
      "hidden:false",
      "paint",
      "scroll:0,400",
      "paint",
      "hidden:true",
      "paint",
      "capture:400",
      "hidden:false",
      "paint",
      "scroll:0,550",
      "paint",
      "hidden:true",
      "paint",
      "capture:550",
      "hidden:false",
      "paint",
      "scroll:0,120",
      "paint",
      "scrollBehaviorDisabled:false",
      "hidden:false"
    ]);
  });

  it("runs per-tile capture hooks and restores hook state after a failed tile", async () => {
    const events: string[] = [];
    let currentScrollY = 0;

    await expect(
      captureFullPageTiles({
        readMetrics: () =>
          createFullPageMetrics({
            viewportWidth: 500,
            viewportHeight: 400,
            scrollWidth: 500,
            scrollHeight: 950,
            scrollY: currentScrollY
          }),
        scrollTo: (_x, y) => {
          events.push(`scroll:${y}`);
          currentScrollY = y;
        },
        waitForPaint: () => {
          events.push("paint");
          return Promise.resolve();
        },
        beforeCaptureTile: (tile, index) => {
          events.push(`before:${index}:${tile.scrollY}`);
        },
        afterCaptureTile: (tile, index) => {
          events.push(`after:${index}:${tile.scrollY}`);
        },
        captureVisibleTab: async () => {
          events.push(`capture:${currentScrollY}`);

          if (currentScrollY === 400) {
            throw new Error("capture failed");
          }

          return `data:image/png;base64,${currentScrollY}`;
        }
      })
    ).rejects.toThrow("capture failed");

    expect(events).toEqual([
      "paint",
      "scroll:0",
      "paint",
      "before:0:0",
      "paint",
      "capture:0",
      "after:0:0",
      "scroll:400",
      "paint",
      "before:1:400",
      "paint",
      "capture:400",
      "after:1:400",
      "scroll:0",
      "paint"
    ]);
  });

  it("restores runtime state when tile capture fails", async () => {
    const events: string[] = [];
    let currentScrollY = 0;

    await expect(
      captureFullPageTiles({
        readMetrics: () =>
          createFullPageMetrics({
            viewportWidth: 500,
            viewportHeight: 400,
            scrollWidth: 500,
            scrollHeight: 950,
            scrollY: currentScrollY
          }),
        scrollTo: (_x, y) => {
          events.push(`scroll:${y}`);
          currentScrollY = y;
        },
        waitForPaint: () => Promise.resolve(),
        setOverlayHidden: (hidden) => {
          events.push(`hidden:${hidden}`);
        },
        setScrollBehaviorDisabled: (disabled) => {
          events.push(`scrollBehaviorDisabled:${disabled}`);
        },
        captureVisibleTab: async () => {
          events.push(`capture:${currentScrollY}`);
          if (currentScrollY === 400) {
            throw new Error("capture failed");
          }

          return `data:image/png;base64,${currentScrollY}`;
        }
      })
    ).rejects.toThrow("capture failed");

    expect(currentScrollY).toBe(0);
    expect(events.at(-3)).toBe("scroll:0");
    expect(events.at(-2)).toBe("scrollBehaviorDisabled:false");
    expect(events.at(-1)).toBe("hidden:false");
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
