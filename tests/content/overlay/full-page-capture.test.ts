import { describe, expect, it, vi } from "vitest";
import {
  captureFullPageTiles,
  capturePageRectTiles,
  createCapturedFullPageTile,
  createFullPageMetrics,
  createFullPageTilePlan,
  createPageRectTilePlan,
  getFullPageBounds,
  readFullPageMetrics,
  TILE_CAPTURE_SETTLE_FRAME_COUNT,
  waitForNextPaint,
  type FullPageMetrics
} from "../../../src/content/overlay/full-page-capture";
import { rectFromEdges } from "../../../src/shared/rect";
import {
  getStitchOutputPixelPlan,
  MAX_CAPTURE_AREA,
  MAX_CAPTURE_DIMENSION
} from "../../../src/shared/stitch-image";

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

  it("plans selected page rect tiles relative to the selected bounds", () => {
    const selectedRect = rectFromEdges(240, 320, 1760, 1240);
    const plan = createPageRectTilePlan(
      createFullPageMetrics({
        viewportWidth: 800,
        viewportHeight: 600,
        scrollWidth: 2000,
        scrollHeight: 1600,
        devicePixelRatio: 2
      }),
      selectedRect
    );
    const bottomRight = plan.tiles.at(-1);

    expect(plan.bounds).toEqual({
      ...selectedRect,
      devicePixelRatio: 2
    });
    expect(plan.outputCssSize).toEqual({ width: 1520, height: 920 });
    expect(plan.viewportCssSize).toEqual({ clientWidth: 800, clientHeight: 600 });
    expect(plan.tiles).toHaveLength(4);
    expect(plan.tiles[0]).toMatchObject({
      indexX: 0,
      indexY: 0,
      scrollX: 240,
      scrollY: 320,
      pageRect: rectFromEdges(240, 320, 1040, 920),
      viewportCropRect: rectFromEdges(0, 0, 800, 600),
      destinationCssRect: rectFromEdges(0, 0, 800, 600)
    });
    expect(bottomRight).toMatchObject({
      indexX: 1,
      indexY: 1,
      scrollX: 1040,
      scrollY: 920,
      pageRect: rectFromEdges(1040, 920, 1760, 1240),
      viewportCropRect: rectFromEdges(0, 0, 720, 320),
      destinationCssRect: rectFromEdges(800, 600, 1520, 920)
    });
  });

  it("clamps selected page rect tile scroll while preserving destination size", () => {
    const selectedRect = rectFromEdges(1200, 900, 1520, 1160);
    const plan = createPageRectTilePlan(
      createFullPageMetrics({
        viewportWidth: 500,
        viewportHeight: 400,
        scrollWidth: 1600,
        scrollHeight: 1200,
        scrollX: 40,
        scrollY: 80
      }),
      selectedRect
    );

    expect(plan.outputCssSize).toEqual({ width: 320, height: 260 });
    expect(plan.tiles).toHaveLength(1);
    expect(plan.tiles[0]).toMatchObject({
      indexX: 0,
      indexY: 0,
      scrollX: 1100,
      scrollY: 800,
      pageRect: selectedRect,
      viewportCropRect: rectFromEdges(100, 100, 420, 360),
      destinationCssRect: rectFromEdges(0, 0, 320, 260)
    });
  });

  it("normalizes reversed selected page rect bounds before planning tiles", () => {
    const plan = createPageRectTilePlan(
      createFullPageMetrics({
        viewportWidth: 500,
        viewportHeight: 400,
        scrollWidth: 1200,
        scrollHeight: 900
      }),
      {
        left: 700,
        top: 650,
        right: 300,
        bottom: 250
      }
    );

    expect(plan.bounds).toEqual({
      ...rectFromEdges(300, 250, 700, 650),
      devicePixelRatio: 1
    });
    expect(plan.outputCssSize).toEqual({ width: 400, height: 400 });
    expect(plan.tiles[0]).toMatchObject({
      scrollX: 300,
      scrollY: 250,
      viewportCropRect: rectFromEdges(0, 0, 400, 400),
      destinationCssRect: rectFromEdges(0, 0, 400, 400)
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

  it("waits for multiple animation frames before the default tile capture settles", async () => {
    const frameCallbacks: Array<() => void> = [];
    const timeoutCallbacks: Array<() => void> = [];
    const requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
      frameCallbacks.push(() => callback(frameCallbacks.length * 16));
      return frameCallbacks.length;
    });
    const setTimeout = vi.fn((callback: () => void) => {
      timeoutCallbacks.push(callback);
      return timeoutCallbacks.length;
    });

    vi.stubGlobal("window", {
      requestAnimationFrame,
      setTimeout
    });

    try {
      const settled = waitForNextPaint();

      expect(requestAnimationFrame).toHaveBeenCalledTimes(1);
      expect(timeoutCallbacks).toHaveLength(0);

      for (let frame = 1; frame < TILE_CAPTURE_SETTLE_FRAME_COUNT; frame += 1) {
        frameCallbacks.shift()?.();
        expect(timeoutCallbacks).toHaveLength(0);
      }

      frameCallbacks.shift()?.();
      expect(requestAnimationFrame).toHaveBeenCalledTimes(TILE_CAPTURE_SETTLE_FRAME_COUNT);
      expect(setTimeout).toHaveBeenCalledTimes(1);

      timeoutCallbacks.shift()?.();
      await settled;
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("captures selected page rect tiles and restores the initial scroll position", async () => {
    const events: string[] = [];
    let currentScrollX = 12;
    let currentScrollY = 34;
    const readMetrics = (): FullPageMetrics =>
      createFullPageMetrics({
        viewportWidth: 500,
        viewportHeight: 400,
        scrollWidth: 1600,
        scrollHeight: 1200,
        scrollX: currentScrollX,
        scrollY: currentScrollY
      });

    const result = await capturePageRectTiles({
      pageRect: rectFromEdges(420, 360, 1120, 960),
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
        events.push(`capture:${currentScrollX},${currentScrollY}`);
        return `data:image/png;base64,${currentScrollX}-${currentScrollY}`;
      }
    });

    expect(result.plan.outputCssSize).toEqual({ width: 700, height: 600 });
    expect(result.tiles.map((tile) => tile.actualScrollX)).toEqual([420, 920, 420, 920]);
    expect(result.tiles.map((tile) => tile.actualScrollY)).toEqual([360, 360, 760, 760]);
    expect(result.tiles.map((tile) => tile.destinationCssRect)).toEqual([
      rectFromEdges(0, 0, 500, 400),
      rectFromEdges(500, 0, 700, 400),
      rectFromEdges(0, 400, 500, 600),
      rectFromEdges(500, 400, 700, 600)
    ]);
    expect(currentScrollX).toBe(12);
    expect(currentScrollY).toBe(34);
    expect(events.at(0)).toBe("scrollBehaviorDisabled:true");
    expect(events.slice(-4)).toEqual([
      "scroll:12,34",
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

  it("rejects empty viewports and empty capture bounds", () => {
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
      createPageRectTilePlan(
        createFullPageMetrics({
          viewportWidth: 500,
          viewportHeight: 400,
          scrollWidth: 800,
          scrollHeight: 900
        }),
        rectFromEdges(100, 100, 100, 240)
      )
    ).toThrow("non-empty document");
  });

  it("plans oversized full page output for stitch-time downscaling", () => {
    const plan = createFullPageTilePlan(
      createFullPageMetrics({
        viewportWidth: 1000,
        viewportHeight: 800,
        scrollWidth: 1000,
        scrollHeight: 20_000,
        devicePixelRatio: 2
      })
    );
    const outputPlan = getStitchOutputPixelPlan(plan.outputCssSize, {
      scaleX: 2,
      scaleY: 2
    });

    expect(plan.outputCssSize).toEqual({ width: 1000, height: 20_000 });
    expect(plan.tiles.length).toBeGreaterThan(1);
    expect(outputPlan.downscaled).toBe(true);
    expect(outputPlan.width).toBeLessThanOrEqual(MAX_CAPTURE_DIMENSION);
    expect(outputPlan.height).toBeLessThanOrEqual(MAX_CAPTURE_DIMENSION);
    expect(outputPlan.width * outputPlan.height).toBeLessThanOrEqual(MAX_CAPTURE_AREA);
  });
});
