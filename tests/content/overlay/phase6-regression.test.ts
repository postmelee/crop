import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  getBestRectForElement,
  getElementFromPoint
} from "../../../src/firefox-derived/overlay-helpers";
import {
  getEdgeScrollDelta,
  getEdgeScrollPagePoint
} from "../../../src/content/overlay/edge-scroll";
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

const testDir = dirname(fileURLToPath(import.meta.url));
const phase6FixtureHtml = readFileSync(
  resolve(testDir, "../../fixtures/phase6_edge_cases.html"),
  "utf8"
);
const overlayCss = readFileSync(
  resolve(testDir, "../../../src/content/overlay/crop-overlay.css"),
  "utf8"
);
const overlayTemplate = readFileSync(
  resolve(testDir, "../../../src/content/overlay/crop-template.ts"),
  "utf8"
);
const overlayRuntime = readFileSync(
  resolve(testDir, "../../../src/content/overlay/crop-overlay.ts"),
  "utf8"
);
const firefoxUiAssets = readFileSync(
  resolve(testDir, "../../../src/firefox-derived/screenshots-ui-assets.ts"),
  "utf8"
);
const manifestJson = JSON.parse(
  readFileSync(resolve(testDir, "../../../manifest.json"), "utf8")
) as {
  permissions?: string[];
  host_permissions?: string[];
};

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

  it("uses the last pointer and latest scroll position for edge auto-scroll drag updates", () => {
    const lastPointer = {
      x: 760,
      y: 590
    };
    const scrollDelta = getEdgeScrollDelta(lastPointer, {
      clientWidth: 800,
      clientHeight: 600
    });

    expect(scrollDelta.active).toBe(true);
    expect(scrollDelta.x).toBeGreaterThan(0);
    expect(scrollDelta.y).toBeGreaterThan(0);
    expect(
      getEdgeScrollPagePoint(lastPointer, {
        scrollX: 120,
        scrollY: 440
      })
    ).toEqual({
      x: 880,
      y: 1030
    });
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

  it("keeps selected resize and keyboard adjustment smoke targets in the fixture", () => {
    for (const fixtureName of [
      "selected-adjustment-section",
      "selected-adjustment-target",
      "selected-adjustment-small-target",
      "selected-adjustment-edge-target"
    ]) {
      expect(phase6FixtureHtml).toContain(`data-crop-fixture="${fixtureName}"`);
    }
  });

  it("keeps same-origin iframe smoke targets in the fixture", () => {
    for (const fixtureName of [
      "same-document-iframe",
      "iframe-body",
      "iframe-card",
      "iframe-button"
    ]) {
      expect(phase6FixtureHtml).toContain(`data-crop-fixture="${fixtureName}"`);
    }

    expect(phase6FixtureHtml).toContain("Same-origin target");
    expect(phase6FixtureHtml).toContain("crop should select this srcdoc content");
    expect(phase6FixtureHtml).not.toContain("MVP fallback");
  });

  it("keeps the Firefox-style crosshair cursor contract on the overlay surface", () => {
    expect(overlayCss).toContain("cursor: crosshair;");
    expect(overlayCss).toContain(':host([data-crop-state="draggingReady"])');
    expect(overlayCss).toContain(':host([data-crop-state="dragging"])');
    expect(overlayCss).toContain("cursor: grabbing;");
  });

  it("keeps the viewport frame hidden during selected adjustment states", () => {
    const frameHideRule = /:host\(\[data-crop-state="draggingReady"\]\) \.crop-frame,[\s\S]*?:host\(\[data-crop-state="resizing"\]\) \.crop-frame \{\s*display: none;\s*\}/;

    for (const state of ["draggingReady", "dragging", "selected", "moving", "resizing"]) {
      expect(overlayCss).toContain(`:host([data-crop-state="${state}"]) .crop-frame`);
    }

    expect(overlayCss).toMatch(frameHideRule);
  });

  it("keeps selection mask and highlight in a Firefox-style shared container", () => {
    expect(overlayTemplate).toContain('container.className = "crop-selection-container";');
    expect(overlayTemplate).toContain(
      "selectionMask.container.append(highlight, selectionControls.container);"
    );
    expect(overlayCss).toContain(".crop-selection-container");
    expect(overlayCss).toContain("overflow: clip;");
    expect(overlayCss).toContain(".crop-highlight");
    expect(overlayCss).toContain("position: absolute;");
    expect(overlayCss).toContain(".crop-dim {\n  position: fixed;");
    expect(overlayRuntime).toContain("applyDocumentOverlayPresentation(host, windowDimensions);");
    expect(overlayRuntime).toContain('host.dataset.cropMeasuring = "true";');
    expect(overlayCss).toContain(':host([data-crop-measuring="true"])');
    expect(overlayRuntime).toContain("const activePageRect");
    expect(overlayRuntime).toContain("const selectionPageRect");
    expect(overlayCss).not.toContain("will-change: transform, width, height;");
    expect(overlayRuntime).toContain('nullRectMode: selectionMaskNullRectMode');
    expect(overlayRuntime).toContain("containerSize: {");
    expect(overlayRuntime).toContain('? "solid"');
  });

  it("keeps action buttons above the selection move layer when they overlap", () => {
    expect(overlayCss).toContain("--crop-layer-highest: 4;");
    expect(overlayCss).toMatch(
      /\.crop-selection-controls \{[\s\S]*?z-index: var\(--crop-layer-high\);[\s\S]*?\}/
    );
    expect(overlayCss).toMatch(/\.crop-actions \{[\s\S]*?z-index: var\(--crop-layer-highest\);/);
  });

  it("uses iframe hit-test rects as parent viewport rects before page conversion", () => {
    expect(overlayRuntime).toContain("viewportRectToPageRect");
    expect(overlayRuntime).toContain("if (hit.rect) {");
    expect(overlayRuntime).toContain("return viewportRectToPageRect(hit.rect, windowDimensions);");
  });

  it("keeps the copy completion notification Firefox-like and omits it for save", () => {
    expect(overlayRuntime).toContain('message: "스크린샷이 복사되었습니다!"');
    expect(overlayRuntime).toContain('status: "copied"');
    expect(overlayRuntime).toContain("requestAnimationFrame");
    expect(overlayRuntime).toContain('setAttribute("animate", "true")');
    expect(overlayRuntime).not.toContain('"저장 완료"');
    expect(overlayRuntime).not.toContain('status: "saved"');
    expect(overlayTemplate).toContain('toast.id = "confirmation-hint";');
    expect(overlayTemplate).toContain(
      'checkmarkContainer.id = "confirmation-hint-checkmark-animation-container";'
    );
    expect(overlayTemplate).toContain('checkmark.id = "confirmation-hint-checkmark-image";');
    expect(overlayTemplate).toContain('messageContainer.id = "confirmation-hint-message-container";');
    expect(overlayTemplate).toContain('description.id = "confirmation-hint-message";');
    expect(overlayTemplate).not.toContain("crop-toast-close");
    expect(overlayCss).toContain(':host([data-crop-toast-root="true"])');
    expect(overlayCss).toContain(".crop-confirmation-hint");
    expect(overlayCss).toContain("padding: 6px 10px;");
    expect(overlayCss).toContain("border: 1px solid #0060df;");
    expect(overlayCss).toContain("background: #0060df;");
    expect(overlayCss).toContain("font-size: 12px;");
    expect(overlayCss).toContain("font-weight: 400;");
    expect(overlayCss).toContain("line-height: 18px;");
    expect(overlayCss).toContain("width: 14px;");
    expect(overlayCss).toContain("height: 14px;");
    expect(overlayCss).toContain("margin-inline: 7px 0;");
    expect(overlayCss).toContain("steps(18)");
    expect(overlayCss).toContain("300ms");
    expect(overlayCss).toContain("60ms");
    expect(overlayCss).toContain("transform: scale(0.8);");
    expect(overlayCss).toContain("pointer-events: none;");
    expect(overlayCss).not.toContain(".crop-toast-title");
    expect(overlayCss).not.toContain(".crop-toast-close");
  });

  it("keeps Firefox-derived action button icons and focus-visible styling wired", () => {
    expect(firefoxUiAssets).toContain("ACTION_CANCEL_SVG");
    expect(firefoxUiAssets).toContain("ACTION_COPY_SVG");
    expect(firefoxUiAssets).toContain("ACTION_DOWNLOAD_SVG");
    expect(firefoxUiAssets).toContain("createScreenshotsCopyIconSvg");
    expect(firefoxUiAssets).toContain("createScreenshotsDownloadIconSvg");
    expect(overlayCss).toContain(
      "--crop-firefox-button-background-color: color-mix(in srgb, currentColor 7%, transparent);"
    );
    expect(overlayCss).toContain("--crop-firefox-primary-background-color: #5abad7;");
    expect(overlayCss).toContain('.crop-action[data-crop-focus-visible="true"]');
    expect(overlayCss).toContain("outline: 2px solid var(--crop-firefox-focus-outline-color);");
  });

  it("keeps MVP extension permissions free of debugger and all-url host access", () => {
    expect(manifestJson.permissions ?? []).not.toContain("debugger");
    expect(manifestJson.permissions ?? []).not.toContain("<all_urls>");
    expect(manifestJson.host_permissions ?? []).not.toContain("<all_urls>");
  });
});
