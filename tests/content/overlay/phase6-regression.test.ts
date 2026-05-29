import { describe, expect, it } from "vitest";
import {
  getBestRectForElement,
  getElementFromPoint
} from "../../../src/firefox-derived/overlay-helpers";
import {
  rectFromEdges as firefoxRectFromEdges,
  WindowDimensions
} from "../../../src/firefox-derived/window-dimensions";
import { getSourceCropRect } from "../../../src/shared/crop-image";
import {
  clipPageRectToViewport,
  rectFromEdges as sharedRectFromEdges
} from "../../../src/shared/rect";
import {
  asDocument,
  asElement,
  fixtureElement,
  FixtureDocument
} from "../../firefox-derived/dom-fixtures";

describe("Phase 6 overlay regression coverage", () => {
  it("clips a page selection that extends outside every viewport edge before source mapping", () => {
    const viewport = {
      clientWidth: 1000,
      clientHeight: 700,
      scrollX: 300,
      scrollY: 500
    };
    const pageSelection = sharedRectFromEdges(220, 460, 1520, 1280);
    const viewportSelection = clipPageRectToViewport(pageSelection, viewport);

    expect(viewportSelection).toEqual(sharedRectFromEdges(0, 0, 1000, 700));
    if (!viewportSelection) {
      throw new Error("Expected a visible viewport intersection.");
    }

    expect(
      getSourceCropRect({
        viewportCropRect: viewportSelection,
        imageNaturalSize: {
          naturalWidth: 2500,
          naturalHeight: 1750
        },
        viewportCssSize: {
          clientWidth: viewport.clientWidth,
          clientHeight: viewport.clientHeight
        }
      })
    ).toEqual(sharedRectFromEdges(0, 0, 2500, 1750));
  });

  it("keeps zoom-like screenshot mapping stable for fractional CSS crop edges", () => {
    expect(
      getSourceCropRect({
        viewportCropRect: sharedRectFromEdges(123.2, 48.4, 777.8, 333.3),
        imageNaturalSize: {
          naturalWidth: 1875,
          naturalHeight: 1125
        },
        viewportCssSize: {
          clientWidth: 1250,
          clientHeight: 750
        }
      })
    ).toEqual(sharedRectFromEdges(184, 72, 1167, 500));
  });

  it("uses the browser visual rect for transformed elements", () => {
    const viewport = new WindowDimensions({
      clientWidth: 1000,
      clientHeight: 800
    });
    const visualRect = firefoxRectFromEdges(134.25, 80.5, 496.75, 190.25);
    const transformedElement = fixtureElement("div", visualRect);

    expect(
      getBestRectForElement(asElement(transformedElement), {
        windowDimensions: viewport
      })
    ).toEqual(visualRect);
  });

  it("walks through nested open shadow roots to the deepest hit target", () => {
    const outerHost = fixtureElement("crop-outer", firefoxRectFromEdges(0, 0, 500, 400));
    const innerHost = fixtureElement("crop-inner", firefoxRectFromEdges(40, 40, 320, 260));
    const button = fixtureElement("button", firefoxRectFromEdges(80, 80, 180, 130));
    outerHost.attachShadowElement(innerHost);
    innerHost.attachShadowElement(button);

    const result = getElementFromPoint(
      90,
      90,
      asDocument(new FixtureDocument(outerHost))
    );

    expect(result.element).toBe(asElement(button));
    expect(result.rect).toBeNull();
    expect(result.unsupportedReason).toBeUndefined();
  });
});
