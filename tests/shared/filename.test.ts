import { describe, expect, it } from "vitest";
import {
  createPngFilename,
  formatPngFilenameTimestamp,
  sanitizePngFilename
} from "../../src/shared/filename";

describe("filename helpers", () => {
  it("keeps safe names and normalizes the PNG extension", () => {
    expect(sanitizePngFilename("Turnstile")).toBe("Turnstile.png");
    expect(sanitizePngFilename("Turnstile.PNG")).toBe("Turnstile.png");
    expect(sanitizePngFilename("Turnstile.png.png")).toBe("Turnstile.png");
  });

  it("removes path separators, control characters, and unsafe edges", () => {
    expect(sanitizePngFilename(" ../bad:name/with\ncontrols?.png ")).toBe(
      "bad name with controls.png"
    );
  });

  it("handles reserved Windows basenames", () => {
    expect(sanitizePngFilename("CON")).toBe("CON-file.png");
    expect(sanitizePngFilename("lpt1.png")).toBe("lpt1-file.png");
  });

  it("falls back to timestamped crop names when the title is empty", () => {
    expect(
      createPngFilename("*/", {
        now: new Date("2026-05-28T01:02:03Z")
      })
    ).toBe("crop-screenshot-20260528-010203.png");
  });

  it("truncates long basenames before adding the extension", () => {
    expect(
      sanitizePngFilename("abcdefghijklmnopqrstuvwxyz", {
        maxBaseLength: 8
      })
    ).toBe("abcdefgh.png");
  });

  it("formats timestamps in UTC for deterministic filenames", () => {
    expect(formatPngFilenameTimestamp(new Date("2026-05-28T01:02:03Z"))).toBe(
      "20260528-010203"
    );
  });
});
