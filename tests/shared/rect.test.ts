import { describe, expect, it } from "vitest";
import {
  clipPageRectToViewport,
  getViewportRect,
  intersectRects,
  normalizeRect,
  pageRectToViewportRect,
  rectFromEdges,
  viewportRectToPageRect
} from "../../src/shared/rect";

describe("shared rect helpers", () => {
  const viewport = {
    clientWidth: 800,
    clientHeight: 600,
    scrollX: 40,
    scrollY: 160
  };

  it("normalizes reversed rect-like values", () => {
    expect(normalizeRect({ left: 80, top: 50, right: 20, bottom: 10 })).toEqual(
      rectFromEdges(20, 10, 80, 50)
    );
  });

  it("intersects rects and rejects edge-only intersections", () => {
    expect(
      intersectRects(
        rectFromEdges(10, 10, 120, 80),
        rectFromEdges(100, 40, 200, 140)
      )
    ).toEqual(rectFromEdges(100, 40, 120, 80));
    expect(
      intersectRects(
        rectFromEdges(10, 10, 120, 80),
        rectFromEdges(120, 40, 200, 140)
      )
    ).toBeNull();
  });

  it("builds viewport-local bounds from CSS viewport metrics", () => {
    expect(getViewportRect(viewport)).toEqual(rectFromEdges(0, 0, 800, 600));
  });

  it("projects rects between page and viewport coordinate spaces", () => {
    const pageRect = rectFromEdges(140, 220, 340, 420);

    expect(pageRectToViewportRect(pageRect, viewport)).toEqual(
      rectFromEdges(100, 60, 300, 260)
    );
    expect(viewportRectToPageRect(rectFromEdges(100, 60, 300, 260), viewport)).toEqual(pageRect);
  });

  it("clips page-coordinate selections to the visible viewport", () => {
    expect(
      clipPageRectToViewport(rectFromEdges(120, 300, 480, 1160), {
        clientWidth: 1000,
        clientHeight: 900,
        scrollX: 0,
        scrollY: 180
      })
    ).toEqual(rectFromEdges(120, 120, 480, 900));
  });

  it("returns null when a page-coordinate selection is outside the viewport", () => {
    expect(
      clipPageRectToViewport(rectFromEdges(120, 1200, 480, 1300), {
        clientWidth: 1000,
        clientHeight: 900,
        scrollX: 0,
        scrollY: 180
      })
    ).toBeNull();
  });
});
