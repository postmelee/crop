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
  createInitialOverlayState,
  transitionOverlayState
} from "../../../src/content/overlay/state-machine";
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
const qualityMatrix = readFileSync(
  resolve(testDir, "../../../mydocs/tech/task_m020_8_quality_matrix.md"),
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
const koLocaleMessages = JSON.parse(
  readFileSync(resolve(testDir, "../../../_locales/ko/messages.json"), "utf8")
) as Record<
  string,
  {
    message?: string;
  }
>;
const overlaySource = `${overlayTemplate}\n${overlayRuntime}`;
const overlayI18nMessageKeys = [
  "overlayCaptureModesLabel",
  "modeVisible",
  "modeFullPage",
  "promptAreaSelectionLabel",
  "promptInstructionMain",
  "promptInstructionSub",
  "actionCopy",
  "actionSave",
  "actionCancel",
  "actionRetry",
  "actionsToolbarLabel",
  "previewDialogLabel",
  "previewImageAlt",
  "previewActionsToolbarLabel",
  "actionTitleWithShortcut",
  "resizeHandleLabel",
  "resizeDirectionNorth",
  "resizeDirectionSouth",
  "resizeDirectionEast",
  "resizeDirectionWest",
  "resizeDirectionNorthEast",
  "resizeDirectionNorthWest",
  "resizeDirectionSouthEast",
  "resizeDirectionSouthWest",
  "copySuccessToast",
  "copyFailureSaveHint",
  "saveFailureRetryHint"
] as const;

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
    ).toEqual(sharedRectFromEdges(185, 73, 1167, 500));
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

  it("does not auto-select an initial oversized element beyond Firefox thresholds", () => {
    const viewport = new WindowDimensions({
      clientWidth: 1341,
      clientHeight: 900
    });
    const largeElement = fixtureElement("div", firefoxRectFromEdges(0, 0, 1480, 520));

    expect(
      getBestRectForElement(asElement(largeElement), {
        windowDimensions: viewport,
        thresholds: {
          maxDetectWidth: viewport.clientWidth + 100,
          maxDetectHeight: Math.max(viewport.clientHeight + 100, 700)
        }
      })
    ).toBeNull();
  });

  it("clears hover state when a too-large wrapper has no automatic candidate", () => {
    const viewport = new WindowDimensions({
      clientWidth: 800,
      clientHeight: 600
    });
    const previousHover = firefoxRectFromEdges(40, 40, 260, 160);
    const wrapper = fixtureElement("main", firefoxRectFromEdges(0, 0, 1600, 1200));
    const hovering = transitionOverlayState(createInitialOverlayState(), {
      type: "hover",
      rect: previousHover
    });

    const wrapperCandidate = getBestRectForElement(asElement(wrapper), {
      windowDimensions: viewport
    });

    expect(wrapperCandidate).toBeNull();
    expect(
      transitionOverlayState(hovering, {
        type: "hover",
        rect: wrapperCandidate
      })
    ).toEqual(createInitialOverlayState());
  });

  it("keeps table and card candidates selectable inside a too-large wrapper", () => {
    const viewport = new WindowDimensions({
      clientWidth: 800,
      clientHeight: 600
    });
    const wrapper = fixtureElement("main", firefoxRectFromEdges(0, 0, 1600, 1200));
    const infobox = wrapper.append(
      fixtureElement("table", firefoxRectFromEdges(40, -80, 620, 520))
    );
    const card = wrapper.append(
      fixtureElement("article", firefoxRectFromEdges(660, 120, 1040, 340))
    );

    expect(
      getBestRectForElement(asElement(infobox), {
        windowDimensions: viewport
      })
    ).toEqual(firefoxRectFromEdges(40, -80, 620, 520));
    expect(
      getBestRectForElement(asElement(card), {
        windowDimensions: viewport
      })
    ).toEqual(firefoxRectFromEdges(660, 120, 1040, 340));
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

  it("keeps full page stitching smoke targets in the fixture", () => {
    for (const fixtureName of [
      "full-page-capture-section",
      "full-page-top-marker",
      "full-page-mid-seam-marker",
      "full-page-horizontal-overflow",
      "full-page-bottom-marker",
      "full-page-fixed-marker",
      "sticky-header",
      "offscreen-large-element"
    ]) {
      expect(phase6FixtureHtml).toContain(`data-crop-fixture="${fixtureName}"`);
    }
  });

  it("keeps selected scroll capture smoke targets and quality criteria", () => {
    for (const fixtureName of [
      "selected-scroll-capture-section",
      "selected-scroll-capture-target",
      "selected-scroll-capture-top-marker",
      "selected-scroll-capture-bottom-marker"
    ]) {
      expect(phase6FixtureHtml).toContain(`data-crop-fixture="${fixtureName}"`);
    }

    expect(phase6FixtureHtml).toContain('data-crop-expected-css-size="1520x920"');
    expect(qualityMatrix).toContain("P6-39");
    expect(qualityMatrix).toContain("selected-scroll-capture-target");
    expect(qualityMatrix).toContain("Task #26");
  });

  it("keeps oversized full page downscale fallback quality criteria", () => {
    expect(qualityMatrix).toContain("P6-40");
    expect(qualityMatrix).toContain("full page oversized downscale fallback");
    expect(qualityMatrix).toContain("Task #35");
    expect(qualityMatrix).toContain("getStitchOutputPixelPlan()");
    expect(qualityMatrix).toContain("maximum canvas size");
  });

  it("suppresses sticky and fixed page chrome for every selected stitching tile", () => {
    const selectedCaptureStart = overlayRuntime.indexOf("const captureSelectedPageRectRegion");
    const visibleViewportStart = overlayRuntime.indexOf("const captureVisibleViewportRegion");
    const selectedCaptureBlock = overlayRuntime.slice(
      selectedCaptureStart,
      visibleViewportStart
    );
    const fullPageCaptureStart = overlayRuntime.indexOf("const captureFullPageRegion");
    const visibleTabCaptureStart = overlayRuntime.indexOf("const captureVisibleTabDataUrl");
    const fullPageCaptureBlock = overlayRuntime.slice(
      fullPageCaptureStart,
      visibleTabCaptureStart
    );

    expect(selectedCaptureBlock).toContain("capturePageRectTiles");
    expect(selectedCaptureBlock).toContain("beforeCaptureTile: () =>");
    expect(selectedCaptureBlock).toContain("setCapturePageChromeSuppressed(true)");
    expect(selectedCaptureBlock).not.toContain("setCapturePageChromeSuppressed(index > 0)");

    expect(fullPageCaptureBlock).toContain("captureFullPageTiles");
    expect(fullPageCaptureBlock).toContain("setCapturePageChromeSuppressed(index > 0)");
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

  it("keeps too-large wrapper smoke targets in the fixture", () => {
    for (const fixtureName of [
      "too-large-wrapper-section",
      "too-large-wrapper",
      "too-large-wrapper-infobox",
      "too-large-wrapper-card"
    ]) {
      expect(phase6FixtureHtml).toContain(`data-crop-fixture="${fixtureName}"`);
    }

    expect(phase6FixtureHtml).toContain("Wrapper fallback should stay off");
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

  it("routes user-facing overlay strings through i18n message keys", () => {
    expect(overlayTemplate).toContain('import { getCropMessage');
    expect(overlayRuntime).toContain('import { getCropMessage }');

    for (const key of overlayI18nMessageKeys) {
      expect(overlaySource).toContain(`"${key}"`);
    }

    for (const key of [
      "actionCopy",
      "actionSave",
      "actionCancel",
      "actionRetry",
      "copySuccessToast",
      "promptInstructionMain"
    ]) {
      const koMessage = koLocaleMessages[key]?.message;
      expect(koMessage).toBeTruthy();
      expect(overlaySource).not.toContain(JSON.stringify(koMessage));
    }
  });

  it("keeps the copy completion notification Firefox-like and omits it for save", () => {
    expect(overlayRuntime).toContain('message: getCropMessage("copySuccessToast")');
    expect(overlayRuntime).toContain('status: "copied"');
    expect(overlayRuntime).toContain("getCaptureFailureMessage(action)");
    expect(overlayRuntime).toContain("requestAnimationFrame");
    expect(overlayRuntime).toContain('setAttribute("animate", "true")');
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
    expect(firefoxUiAssets).toContain("ACTION_RELOAD_SVG");
    expect(firefoxUiAssets).toContain("ACTION_COPY_SVG");
    expect(firefoxUiAssets).toContain("ACTION_DOWNLOAD_SVG");
    expect(firefoxUiAssets).toContain("createScreenshotsRetryIconSvg");
    expect(firefoxUiAssets).toContain("createScreenshotsCopyIconSvg");
    expect(firefoxUiAssets).toContain("createScreenshotsDownloadIconSvg");
    expect(overlayCss).toContain(
      "--crop-firefox-button-background-color: color-mix(in srgb, currentColor 7%, transparent);"
    );
    expect(overlayCss).toContain("--crop-firefox-primary-background-color: #5abad7;");
    expect(overlayCss).toContain('.crop-action[data-crop-focus-visible="true"]');
    expect(overlayCss).toContain("outline: 2px solid var(--crop-firefox-focus-outline-color);");
  });

  it("wires full page mode to a Firefox-style capture preview pipeline", () => {
    expect(overlayTemplate).toContain('label: getCropMessage("modeFullPage")');
    expect(overlayTemplate).toContain('mode: "full-page"');
    expect(overlayTemplate).not.toContain('mode: "full-page",\n    disabled: true');
    expect(overlayTemplate).toContain('container.className = "crop-preview";');
    expect(overlayTemplate).toContain('dialog.className = "crop-preview-dialog";');
    expect(overlayTemplate).toContain('createActionButton("retry", true)');
    expect(overlayTemplate).toContain("getActionTitle(action, label)");
    expect(overlayTemplate).toContain('getCropMessage("actionTitleWithShortcut"');
    expect(overlayTemplate).toContain('getAccelShortcut("C")');
    expect(overlayTemplate).toContain('getAccelShortcut("S")');
    expect(overlayTemplate).toContain('isMacLikePlatform() ? "esc" : "Esc"');
    expect(overlayTemplate).toContain("createScreenshotsRetryIconSvg");
    expect(overlayTemplate).not.toContain("function createRetryIconSvg");
    expect(overlayTemplate).toContain('image.className = "crop-preview-image";');
    expect(overlayCss).toContain(".crop-preview");
    expect(overlayCss).toContain(".crop-preview-dialog");
    expect(overlayCss).toContain("align-items: flex-start;");
    expect(overlayCss).toContain("padding: 24px 52px 44px;");
    expect(overlayCss).toContain("width: min(1480px, calc(100vw - 104px));");
    expect(overlayCss).toContain("height: min(860px, calc(100vh - 68px));");
    expect(overlayCss).toContain("--crop-preview-inline-padding: 24px;");
    expect(overlayCss).toContain("padding: 0 var(--crop-preview-inline-padding) 24px;");
    expect(overlayCss).toContain("padding: 8px var(--crop-preview-inline-padding) 6px;");
    expect(overlayCss).toContain("background: #44414f;");
    expect(overlayCss).toContain(':host([data-crop-capture-mode="visible"]) .crop-preview-surface');
    expect(overlayCss).toContain("overflow: hidden;");
    expect(overlayCss).toContain("max-height: 100%;");
    expect(overlayCss).toContain("object-fit: contain;");
    expect(overlayCss).toMatch(/\.crop-preview \{[\s\S]*?cursor: auto;/);
    expect(overlayCss).toContain(".crop-preview-image");
    expect(overlayCss).toContain(".crop-preview-actions");
    expect(overlayCss).toContain(".crop-preview-actions .crop-action-group");
    expect(overlayCss).toContain(".crop-preview-actions .crop-action");
    expect(overlayCss).toContain(".crop-mode-button--full-page");
    expect(overlayCss).toContain("background: #0060df;");
    expect(overlayCss).toContain("background: #0250bb;");
    expect(overlayCss).toContain("background: #054096;");
    expect(overlayCss).toContain("overscroll-behavior: contain;");
    expect(overlayRuntime).toContain('type CaptureMode = "visible" | "full-page";');
    expect(overlayRuntime).toContain("getCropModeFromEvent");
    expect(overlayRuntime).toContain("handleWheel");
    expect(overlayRuntime).toContain("isPreviewScrollableEvent");
    expect(overlayRuntime).toContain("getPreviewKeyboardAction");
    expect(overlayRuntime).toContain("getCaptureKeyboardAction");
    expect(overlayRuntime).toContain("selectedShortcutAction");
    expect(overlayRuntime).toContain("startCaptureAction(selectedShortcutAction)");
    expect(overlayRuntime).toContain("shouldIgnoreCaptureKeyboardTarget");
    expect(overlayRuntime).toContain("getAccelKey(event)");
    expect(overlayRuntime).toContain('case "c":');
    expect(overlayRuntime).toContain('case "s":');
    expect(overlayRuntime).toContain("interface CaptureOverlayVisibilityOptions");
    expect(overlayRuntime).toContain("keepHiddenOnSuccess: true");
    expect(overlayRuntime).toContain("if (!visibilityOptions.keepHiddenOnSuccess || !completed)");
    expect(overlayRuntime).toContain('action === "retry"');
    expect(overlayRuntime).toContain("startVisibleViewportPreview");
    expect(overlayRuntime).toContain("startFullPagePreview");
    expect(overlayRuntime).toContain("startPreviewAction");
    expect(overlayRuntime).toContain("setPreviewCaptureResult");
    expect(overlayRuntime).toContain("captureVisibleViewportRegion");
    expect(overlayRuntime).toContain("getViewportRect(viewport)");
    expect(overlayRuntime).toContain("isPageRectFullyInsideViewport");
    expect(overlayRuntime).toContain("captureSelectedPageRectRegion");
    expect(overlayRuntime).toContain("capturePageRectTiles");
    expect(overlayRuntime).toContain("setModeCapturePending");
    expect(overlayCss).toContain('[data-crop-mode-capture-pending="true"]');
    expect(overlayRuntime).toContain("captureFullPageTiles");
    expect(overlayRuntime).toContain("stitchCapturedTiles");
    expect(overlayRuntime).toContain("captureFullPageRegion");
    expect(overlayRuntime).toContain("downscaled: stitchResult.downscaled");
    expect(overlayRuntime).toContain("downscaleRatio: stitchResult.downscaleRatio");
    expect(overlayRuntime).toContain("outputScale: stitchResult.outputScale");
    expect(overlayRuntime).toContain("sourceScale: stitchResult.sourceScale");
    expect(overlayRuntime).toContain("setCaptureDocumentChromeSuppressed");
    expect(overlayRuntime).toContain("setCaptureScrollBehaviorDisabled");
    expect(overlayRuntime).toContain("beforeCaptureTile");
    expect(overlayRuntime).toContain("afterCaptureTile");
    expect(overlayRuntime).toContain("setCapturePageChromeSuppressed(index > 0)");
    expect(overlayRuntime).toContain("collectFullPageChromeElements");
    expect(overlayRuntime).toContain('style.position !== "fixed" && style.position !== "sticky"');
    expect(overlayRuntime).toContain("host.dataset.cropCaptureMode = result.mode;");
    expect(overlayRuntime).toContain("host.dataset.cropCaptureTileCount");
    expect(overlayRuntime).toContain("host.dataset.cropCaptureDownscaled");
    expect(overlayRuntime).toContain("host.dataset.cropCaptureDownscaleRatio");
    expect(overlayRuntime).not.toContain("getFullPageBounds");

    const previewPendingStart = overlayRuntime.indexOf("const setPreviewPending");
    const previewPendingEnd = overlayRuntime.indexOf("const setPreviewStatus");
    const previewPendingBlock = overlayRuntime.slice(previewPendingStart, previewPendingEnd);

    expect(previewPendingBlock).toContain('setAttribute("aria-busy", "true")');
    expect(previewPendingBlock).not.toContain("button.disabled");
  });

  it("keeps the mode toolbar inside the page viewport below browser chrome", () => {
    expect(overlayCss).toMatch(/\.crop-mode-toolbar \{[\s\S]*?position: fixed;[\s\S]*?top: 8px;/);
    expect(overlayCss).not.toContain("top: -8px;");
  });

  it("keeps MVP extension permissions free of debugger and all-url host access", () => {
    expect(manifestJson.permissions ?? []).not.toContain("debugger");
    expect(manifestJson.permissions ?? []).not.toContain("<all_urls>");
    expect(manifestJson.host_permissions ?? []).not.toContain("<all_urls>");
  });
});
