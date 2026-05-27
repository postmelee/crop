import { describe, expect, it } from "vitest";
import {
  intersectRects,
  normalizeRect,
  pageRectToViewportRect,
  readWindowDimensions,
  rectFromEdges,
  rectsIntersect,
  viewportRectToPageRect,
  WindowDimensions
} from "../../src/firefox-derived/window-dimensions";

describe("WindowDimensions", () => {
  it("keeps viewport dimensions separate from page scroll offsets", () => {
    const dimensions = new WindowDimensions({
      clientWidth: 640,
      clientHeight: 480,
      scrollWidth: 1200,
      scrollHeight: 1600,
      scrollX: 200,
      scrollY: 300,
      devicePixelRatio: 2
    });

    expect(dimensions.viewportRect).toEqual(rectFromEdges(0, 0, 640, 480));
    expect(dimensions.pageViewportRect).toEqual(rectFromEdges(200, 300, 840, 780));
    expect(dimensions.devicePixelRatio).toBe(2);
  });

  it("normalizes invalid input into safe viewport defaults", () => {
    const dimensions = new WindowDimensions({
      clientWidth: -1,
      clientHeight: Number.NaN,
      scrollWidth: 10,
      scrollHeight: 20,
      scrollX: Number.POSITIVE_INFINITY,
      scrollY: -10,
      devicePixelRatio: 0
    });

    expect(dimensions.clientWidth).toBe(0);
    expect(dimensions.clientHeight).toBe(0);
    expect(dimensions.scrollWidth).toBe(10);
    expect(dimensions.scrollHeight).toBe(20);
    expect(dimensions.pageScrollX).toBe(0);
    expect(dimensions.pageScrollY).toBe(-10);
    expect(dimensions.devicePixelRatio).toBe(1);
  });

  it("detects and clips viewport-local rects", () => {
    const dimensions = new WindowDimensions({
      clientWidth: 100,
      clientHeight: 80
    });

    expect(dimensions.isInViewport({ left: 20, top: 10, right: 30, bottom: 20 })).toBe(true);
    expect(dimensions.isInViewport({ left: 100, top: 10, right: 120, bottom: 20 })).toBe(false);
    expect(dimensions.clipRectToViewport({ left: -10, top: 20, right: 40, bottom: 100 })).toEqual(
      rectFromEdges(0, 20, 40, 80)
    );
  });

  it("projects rects between viewport and page coordinate spaces", () => {
    const dimensions = new WindowDimensions({
      clientWidth: 320,
      clientHeight: 240,
      scrollWidth: 900,
      scrollHeight: 1200,
      scrollX: 40,
      scrollY: 160
    });

    expect(viewportRectToPageRect(rectFromEdges(10, -20, 210, 180), dimensions)).toEqual(
      rectFromEdges(50, 140, 250, 340)
    );
    expect(pageRectToViewportRect(rectFromEdges(50, 140, 250, 340), dimensions)).toEqual(
      rectFromEdges(10, -20, 210, 180)
    );
  });

  it("normalizes and intersects rect-like values", () => {
    const reversed = normalizeRect({ left: 50, top: 40, right: 10, bottom: 5 });

    expect(reversed).toEqual(rectFromEdges(10, 5, 50, 40));
    expect(rectsIntersect(reversed, { left: 45, top: 30, right: 70, bottom: 70 })).toBe(true);
    expect(intersectRects(reversed, { left: 45, top: 30, right: 70, bottom: 70 })).toEqual(
      rectFromEdges(45, 30, 50, 40)
    );
    expect(intersectRects(reversed, { left: 60, top: 30, right: 70, bottom: 70 })).toBeNull();
  });

  it("reads safe dimensions from a window-like object", () => {
    const dimensions = readWindowDimensions({
      innerWidth: 320,
      innerHeight: 240,
      scrollX: 12,
      scrollY: 34,
      devicePixelRatio: 2,
      document: {
        documentElement: {
          clientWidth: 300,
          clientHeight: 200,
          scrollWidth: 900,
          scrollHeight: 1200
        },
        body: {
          scrollWidth: 800,
          scrollHeight: 1000
        }
      }
    });

    expect(dimensions.dimensions).toMatchObject({
      clientWidth: 300,
      clientHeight: 200,
      scrollWidth: 900,
      scrollHeight: 1200,
      scrollX: 12,
      scrollY: 34,
      scrollMaxX: 600,
      scrollMaxY: 1000,
      devicePixelRatio: 2
    });
  });

  it("uses body scroll dimensions when they exceed documentElement dimensions", () => {
    const dimensions = readWindowDimensions({
      innerWidth: 320,
      innerHeight: 240,
      scrollX: 0,
      scrollY: 0,
      devicePixelRatio: 1,
      document: {
        documentElement: {
          clientWidth: 320,
          clientHeight: 240,
          scrollWidth: 320,
          scrollHeight: 240
        },
        body: {
          scrollWidth: 700,
          scrollHeight: 900
        }
      }
    });

    expect(dimensions.scrollWidth).toBe(700);
    expect(dimensions.scrollHeight).toBe(900);
    expect(dimensions.scrollMaxX).toBe(380);
    expect(dimensions.scrollMaxY).toBe(660);
  });
});
