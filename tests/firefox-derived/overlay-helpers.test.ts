import { describe, expect, it } from "vitest";
import {
  getAccessibleIframeDocument,
  getBestRectForElement,
  getElementFromPoint,
  getVisibleRectForElement,
  projectIframeViewportRectToParentViewport,
  projectPointIntoIframeViewport,
  resetDetectThresholds,
  setMaxDetectHeight,
  setMaxDetectWidth
} from "../../src/firefox-derived/overlay-helpers";
import { rectFromEdges, WindowDimensions } from "../../src/firefox-derived/window-dimensions";
import { asDocument, asElement, fixtureElement, FixtureDocument } from "./dom-fixtures";

const viewport = new WindowDimensions({
  clientWidth: 800,
  clientHeight: 600
});

describe("getElementFromPoint", () => {
  it("returns the element from a normal document hit-test", () => {
    const target = fixtureElement("div", rectFromEdges(10, 10, 120, 80));
    const result = getElementFromPoint(20, 20, asDocument(new FixtureDocument(target)));

    expect(result).toEqual({
      element: asElement(target),
      rect: null
    });
  });

  it("walks into open shadow roots and returns the deepest element", () => {
    const host = fixtureElement("crop-host", rectFromEdges(0, 0, 400, 300));
    const button = fixtureElement("button", rectFromEdges(20, 20, 100, 70));
    host.attachShadowElement(button);

    const result = getElementFromPoint(30, 30, asDocument(new FixtureDocument(host)));

    expect(result.element).toBe(asElement(button));
    expect(result.rect).toBeNull();
  });

  it("keeps iframe elements as unsupported host fallbacks", () => {
    const iframe = fixtureElement("iframe", rectFromEdges(0, 0, 500, 400));
    const result = getElementFromPoint(30, 30, asDocument(new FixtureDocument(iframe)));

    expect(result.element).toBe(asElement(iframe));
    expect(result.rect).toBeNull();
    expect(result.unsupportedReason).toBe("iframe");
  });

  it("keeps iframe elements inside open shadow roots as unsupported fallbacks", () => {
    const host = fixtureElement("crop-host", rectFromEdges(0, 0, 500, 400));
    const iframe = fixtureElement("iframe", rectFromEdges(20, 20, 300, 200));
    host.attachShadowElement(iframe);

    const result = getElementFromPoint(30, 30, asDocument(new FixtureDocument(host)));

    expect(result.element).toBe(asElement(iframe));
    expect(result.rect).toBeNull();
    expect(result.unsupportedReason).toBe("iframe");
  });
});

describe("iframe coordinate contract", () => {
  it("returns a same-origin fixture iframe document when it is accessible", () => {
    const target = fixtureElement("article", rectFromEdges(20, 20, 180, 120));
    const iframeDocument = new FixtureDocument(target);
    const iframe = fixtureElement("iframe", rectFromEdges(100, 50, 500, 350))
      .setFrameContentDocument(iframeDocument);

    expect(getAccessibleIframeDocument(asElement(iframe)!)).toBe(asDocument(iframeDocument));
  });

  it("treats inaccessible iframe content as a normal unsupported boundary", () => {
    const iframe = fixtureElement("iframe", rectFromEdges(100, 50, 500, 350))
      .setInaccessibleFrameContent();

    expect(getAccessibleIframeDocument(asElement(iframe)!)).toBeNull();
  });

  it("does not expose a document for non-iframe elements", () => {
    const target = fixtureElement("div", rectFromEdges(100, 50, 500, 350));

    expect(getAccessibleIframeDocument(asElement(target)!)).toBeNull();
  });

  it("projects parent viewport pointers into iframe viewport coordinates", () => {
    const iframe = fixtureElement("iframe", rectFromEdges(100, 50, 500, 350))
      .setClientOffset(4, 6);

    expect(projectPointIntoIframeViewport(asElement(iframe)!, 154, 96)).toEqual({
      x: 50,
      y: 40
    });
  });

  it("projects iframe viewport rects into parent viewport coordinates", () => {
    const iframe = fixtureElement("iframe", rectFromEdges(100, 50, 500, 350))
      .setClientOffset(4, 6);

    expect(
      projectIframeViewportRectToParentViewport(
        asElement(iframe)!,
        rectFromEdges(20, 25, 120, 90)
      )
    ).toEqual(rectFromEdges(124, 81, 224, 146));
  });
});

describe("getVisibleRectForElement", () => {
  it("clips element rects to the visible viewport", () => {
    const element = fixtureElement("div", rectFromEdges(-20, 10, 100, 100));

    expect(getVisibleRectForElement(asElement(element)!, viewport)).toEqual(
      rectFromEdges(0, 10, 100, 100)
    );
  });
});

describe("getBestRectForElement", () => {
  it("promotes small elements to a stable parent candidate", () => {
    const parent = fixtureElement("section", rectFromEdges(10, 10, 260, 160));
    const child = parent.append(fixtureElement("span", rectFromEdges(20, 20, 60, 40)));

    expect(getBestRectForElement(asElement(child), { windowDimensions: viewport })).toEqual(
      rectFromEdges(10, 10, 260, 160)
    );
  });

  it("avoids selecting heading elements by themselves when a parent is available", () => {
    const parent = fixtureElement("section", rectFromEdges(0, 0, 420, 240));
    const heading = parent.append(fixtureElement("h1", rectFromEdges(20, 20, 360, 70)));

    expect(getBestRectForElement(asElement(heading), { windowDimensions: viewport })).toEqual(
      rectFromEdges(0, 0, 420, 240)
    );
  });

  it("prefers role=\"article\" ancestors when they fit thresholds", () => {
    const article = fixtureElement("article", rectFromEdges(0, 0, 500, 360), {
      role: "article"
    });
    const section = article.append(fixtureElement("section", rectFromEdges(40, 40, 420, 280)));
    const target = section.append(fixtureElement("p", rectFromEdges(60, 60, 360, 220)));

    expect(getBestRectForElement(asElement(target), { windowDimensions: viewport })).toEqual(
      rectFromEdges(0, 0, 500, 360)
    );
  });

  it("falls back to the previous usable rect when a parent is too large", () => {
    const parent = fixtureElement("main", rectFromEdges(0, 0, 1600, 1200));
    const target = parent.append(fixtureElement("div", rectFromEdges(50, 50, 240, 140)));

    expect(getBestRectForElement(asElement(target), { windowDimensions: viewport })).toEqual(
      rectFromEdges(50, 50, 240, 140)
    );
  });

  it("uses a provided previous rect when the current element is too large", () => {
    const target = fixtureElement("main", rectFromEdges(0, 0, 1600, 1200));

    expect(
      getBestRectForElement(asElement(target), {
        windowDimensions: viewport,
        previousRect: rectFromEdges(40, 40, 160, 90)
      })
    ).toEqual(rectFromEdges(40, 40, 160, 90));
  });

  it("uses a viewport fallback when the initial element is larger than thresholds", () => {
    const target = fixtureElement("main", rectFromEdges(0, 0, 1600, 1200));

    expect(getBestRectForElement(asElement(target), { windowDimensions: viewport })).toEqual(
      rectFromEdges(0, 0, 800, 600)
    );
  });

  it("can return page-coordinate rects without clipping visible element bounds", () => {
    const scrolledViewport = new WindowDimensions({
      clientWidth: 800,
      clientHeight: 600,
      scrollWidth: 1000,
      scrollHeight: 1800,
      scrollX: 0,
      scrollY: 320
    });
    const target = fixtureElement("section", rectFromEdges(120, -180, 520, 460));

    expect(
      getBestRectForElement(asElement(target), {
        windowDimensions: scrolledViewport,
        coordinateSpace: "page"
      })
    ).toEqual(rectFromEdges(120, 140, 520, 780));
  });

  it("can extend a previous rect with the next sibling when the parent is too large", () => {
    const parent = fixtureElement("main", rectFromEdges(0, 0, 1600, 1200));
    const first = parent.append(fixtureElement("div", rectFromEdges(50, 50, 240, 70)));
    parent.append(fixtureElement("div", rectFromEdges(250, 50, 390, 70)));

    expect(getBestRectForElement(asElement(first), { windowDimensions: viewport })).toEqual(
      rectFromEdges(50, 50, 390, 70)
    );
  });

  it("rejects final rects smaller than the absolute threshold", () => {
    const target = fixtureElement("span", rectFromEdges(0, 0, 20, 5));

    expect(getBestRectForElement(asElement(target), { windowDimensions: viewport })).toBeNull();
  });

  it("allows max detection thresholds to be adjusted for tests and future UI tuning", () => {
    const target = fixtureElement("main", rectFromEdges(0, 0, 700, 500));

    setMaxDetectWidth(600);
    setMaxDetectHeight(400);

    expect(getBestRectForElement(asElement(target), { windowDimensions: viewport })).toEqual(
      rectFromEdges(0, 0, 600, 400)
    );

    resetDetectThresholds();
  });
});
