import { describe, expect, it } from "vitest";
import {
  CROP_CAPTURE_VISIBLE_TAB_MESSAGE,
  CROP_DOWNLOAD_PNG_MESSAGE,
  createCaptureVisibleTabRequest,
  createDownloadPngRequest,
  isCropCaptureVisibleTabRequest,
  isCropCaptureVisibleTabResponse,
  isCropDownloadPngRequest,
  isCropDownloadPngResponse
} from "../../src/shared/messages";

describe("runtime capture messages", () => {
  it("creates and recognizes visible tab capture requests", () => {
    const request = createCaptureVisibleTabRequest();

    expect(request).toEqual({
      type: CROP_CAPTURE_VISIBLE_TAB_MESSAGE
    });
    expect(isCropCaptureVisibleTabRequest(request)).toBe(true);
    expect(isCropCaptureVisibleTabRequest({ type: "other" })).toBe(false);
  });

  it("recognizes visible tab capture responses", () => {
    expect(
      isCropCaptureVisibleTabResponse({
        ok: true,
        dataUrl: "data:image/png;base64,abc"
      })
    ).toBe(true);
    expect(
      isCropCaptureVisibleTabResponse({
        ok: false,
        error: "capture failed"
      })
    ).toBe(true);
    expect(
      isCropCaptureVisibleTabResponse({
        ok: true,
        error: "missing dataUrl"
      })
    ).toBe(false);
  });

  it("creates and recognizes PNG download requests", () => {
    const request = createDownloadPngRequest("data:image/png;base64,abc", "capture.png");

    expect(request).toEqual({
      type: CROP_DOWNLOAD_PNG_MESSAGE,
      dataUrl: "data:image/png;base64,abc",
      filename: "capture.png"
    });
    expect(isCropDownloadPngRequest(request)).toBe(true);
    expect(isCropDownloadPngRequest({ ...request, dataUrl: "https://example.com/image.png" })).toBe(
      false
    );
    expect(isCropDownloadPngRequest({ ...request, filename: "" })).toBe(false);
  });

  it("recognizes PNG download responses", () => {
    expect(
      isCropDownloadPngResponse({
        ok: true,
        downloadId: 42
      })
    ).toBe(true);
    expect(
      isCropDownloadPngResponse({
        ok: false,
        error: "download failed"
      })
    ).toBe(true);
    expect(
      isCropDownloadPngResponse({
        ok: true,
        dataUrl: "missing download id"
      })
    ).toBe(false);
  });
});
