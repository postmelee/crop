import { describe, expect, it, vi } from "vitest";
import {
  dataUrlToBlob,
  pngDataUrlToBlob,
  PNG_MIME_TYPE,
  writePngBlobToClipboard,
  writePngDataUrlToClipboard,
  type ClipboardItemConstructor
} from "../../src/shared/clipboard";

class FakeClipboardItem {
  static lastItems: Record<string, Blob> | null = null;

  constructor(items: Record<string, Blob>) {
    FakeClipboardItem.lastItems = items;
  }
}

describe("clipboard helpers", () => {
  const pngDataUrl = "data:image/png;base64,AAECAw==";

  it("decodes data URLs into blobs", async () => {
    const blob = dataUrlToBlob(pngDataUrl);

    expect(blob.type).toBe(PNG_MIME_TYPE);
    expect([...new Uint8Array(await blob.arrayBuffer())]).toEqual([0, 1, 2, 3]);
  });

  it("rejects invalid or non-PNG data URLs for PNG clipboard use", () => {
    expect(() => dataUrlToBlob("not-a-data-url")).toThrow("Invalid data URL.");
    expect(() => pngDataUrlToBlob("data:text/plain,hello")).toThrow("Expected a PNG data URL.");
  });

  it("writes PNG blobs to the ClipboardItem API", async () => {
    FakeClipboardItem.lastItems = null;
    const write = vi.fn<Clipboard["write"]>(async () => undefined);
    const blob = pngDataUrlToBlob(pngDataUrl);

    await writePngBlobToClipboard(blob, {
      clipboard: { write },
      ClipboardItem: FakeClipboardItem as unknown as ClipboardItemConstructor
    });

    expect(write).toHaveBeenCalledTimes(1);
    expect(FakeClipboardItem.lastItems?.[PNG_MIME_TYPE]).toBe(blob);
  });

  it("converts PNG data URLs before writing them to the clipboard", async () => {
    FakeClipboardItem.lastItems = null;
    const write = vi.fn<Clipboard["write"]>(async () => undefined);

    const blob = await writePngDataUrlToClipboard(pngDataUrl, {
      clipboard: { write },
      ClipboardItem: FakeClipboardItem as unknown as ClipboardItemConstructor
    });

    expect(blob.type).toBe(PNG_MIME_TYPE);
    expect(FakeClipboardItem.lastItems?.[PNG_MIME_TYPE]).toBe(blob);
  });

  it("normalizes clipboard capability and write failures", async () => {
    const blob = pngDataUrlToBlob(pngDataUrl);

    await expect(writePngBlobToClipboard(blob, {})).rejects.toThrow(
      "Clipboard write API is unavailable."
    );
    await expect(
      writePngBlobToClipboard(blob, {
        clipboard: {
          write: async () => undefined
        }
      })
    ).rejects.toThrow("ClipboardItem API is unavailable.");
    await expect(
      writePngBlobToClipboard(blob, {
        clipboard: {
          write: async () => {
            throw new Error("permission denied");
          }
        },
        ClipboardItem: FakeClipboardItem as unknown as ClipboardItemConstructor
      })
    ).rejects.toThrow("Clipboard write failed: permission denied");
  });
});
