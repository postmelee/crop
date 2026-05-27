import { describe, expect, it } from "vitest";
import { Region } from "../../src/firefox-derived/region";
import { rectFromEdges, WindowDimensions } from "../../src/firefox-derived/window-dimensions";

const viewport = new WindowDimensions({
  clientWidth: 200,
  clientHeight: 100
});

describe("Region", () => {
  it("normalizes reversed coordinates and reports geometry", () => {
    const region = new Region(viewport, {
      left: 150,
      top: 80,
      right: 50,
      bottom: 20
    });

    expect(region.dimensions).toEqual(rectFromEdges(50, 20, 150, 80));
    expect(region.width).toBe(100);
    expect(region.height).toBe(60);
    expect(region.area).toBe(6000);
    expect(region.distance).toBeCloseTo(Math.hypot(100, 60));
    expect(region.isRegionValid).toBe(true);
  });

  it("clips coordinates to the visible viewport", () => {
    const region = new Region(viewport, {
      left: -20,
      top: -5,
      right: 250,
      bottom: 120
    });

    expect(region.dimensions).toEqual(rectFromEdges(0, 0, 200, 100));
    expect(region.clipToViewport()).toEqual(rectFromEdges(0, 0, 200, 100));
  });

  it("detects containment and intersections", () => {
    const region = new Region(viewport, {
      left: 20,
      top: 10,
      right: 120,
      bottom: 70
    });

    expect(region.containsPoint(20, 10)).toBe(true);
    expect(region.containsPoint(121, 10)).toBe(false);
    expect(region.containsRect({ left: 25, top: 15, right: 40, bottom: 30 })).toBe(true);
    expect(region.containsRect({ left: 10, top: 15, right: 40, bottom: 30 })).toBe(false);
    expect(region.intersectsRect({ left: 100, top: 60, right: 180, bottom: 90 })).toBe(true);
    expect(region.intersection({ left: 100, top: 60, right: 180, bottom: 90 })).toEqual(
      rectFromEdges(100, 60, 120, 70)
    );
    expect(region.intersectsRect({ left: 121, top: 60, right: 180, bottom: 90 })).toBe(false);
  });

  it("can be reset and sorted explicitly", () => {
    const region = new Region(viewport, {
      left: 80,
      top: 40,
      right: 20,
      bottom: 10
    });

    expect(region.x1).toBe(80);
    expect(region.x2).toBe(20);

    region.sortCoords();

    expect(region.x1).toBe(20);
    expect(region.x2).toBe(80);

    region.xOffset = 12;
    region.yOffset = 34;
    region.resetDimensions();

    expect(region.dimensions).toEqual(rectFromEdges(0, 0, 0, 0));
    expect(region.xOffset).toBe(0);
    expect(region.yOffset).toBe(0);
    expect(region.isRegionValid).toBe(false);
  });

  it("can initialize from an arbitrary rect-like value", () => {
    const region = Region.fromRect(viewport, {
      left: 75,
      top: 55,
      right: 15,
      bottom: 5
    });

    expect(region.dimensions).toEqual(rectFromEdges(15, 5, 75, 55));
  });
});
