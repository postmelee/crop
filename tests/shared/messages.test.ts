import { describe, expect, it } from "vitest";
import {
  CROP_CAPTURE_VISIBLE_TAB_MESSAGE,
  createCaptureVisibleTabRequest,
  isCropCaptureVisibleTabRequest,
  isCropCaptureVisibleTabResponse
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
});
