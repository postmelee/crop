export const PNG_MIME_TYPE = "image/png";

export interface ClipboardWriter {
  write(data: ClipboardItem[]): Promise<void>;
}

export interface ClipboardItemConstructor {
  new (items: Record<string, Blob>): ClipboardItem;
}

export interface ClipboardWriteDependencies {
  readonly clipboard?: ClipboardWriter;
  readonly ClipboardItem?: ClipboardItemConstructor;
}

export function dataUrlToBlob(dataUrl: string): Blob {
  const match = /^data:([^,]*),(.*)$/s.exec(dataUrl);

  if (!match) {
    throw new Error("Invalid data URL.");
  }

  const metadata = match[1] ?? "";
  const encodedData = match[2] ?? "";
  const metadataParts = metadata.split(";").filter(Boolean);
  const mimeType = metadataParts[0]?.includes("/") ? metadataParts[0].toLowerCase() : "";
  const isBase64 = metadataParts.some((part) => part.toLowerCase() === "base64");
  const bytes = isBase64 ? decodeBase64Data(encodedData) : decodeTextData(encodedData);

  return new Blob([copyBytesToArrayBuffer(bytes)], {
    type: mimeType
  });
}

export function pngDataUrlToBlob(dataUrl: string): Blob {
  const blob = dataUrlToBlob(dataUrl);

  if (blob.type !== PNG_MIME_TYPE) {
    throw new Error("Expected a PNG data URL.");
  }

  return blob;
}

export async function writePngDataUrlToClipboard(
  dataUrl: string,
  dependencies: ClipboardWriteDependencies = getDefaultClipboardDependencies()
): Promise<Blob> {
  const blob = pngDataUrlToBlob(dataUrl);

  await writePngBlobToClipboard(blob, dependencies);

  return blob;
}

export async function writePngBlobToClipboard(
  blob: Blob,
  dependencies: ClipboardWriteDependencies = getDefaultClipboardDependencies()
): Promise<void> {
  if (blob.type !== PNG_MIME_TYPE) {
    throw new Error("Only PNG image blobs can be copied to the clipboard.");
  }

  const clipboard = dependencies.clipboard;

  if (!clipboard?.write) {
    throw new Error("Clipboard write API is unavailable.");
  }

  const ClipboardItemConstructor = dependencies.ClipboardItem;

  if (!ClipboardItemConstructor) {
    throw new Error("ClipboardItem API is unavailable.");
  }

  try {
    await clipboard.write([
      new ClipboardItemConstructor({
        [PNG_MIME_TYPE]: blob
      })
    ]);
  } catch (error) {
    throw new Error(`Clipboard write failed: ${formatClipboardError(error)}`);
  }
}

function getDefaultClipboardDependencies(): ClipboardWriteDependencies {
  return {
    clipboard: globalThis.navigator?.clipboard,
    ClipboardItem: globalThis.ClipboardItem
  };
}

function decodeBase64Data(encodedData: string): Uint8Array {
  if (typeof globalThis.atob !== "function") {
    throw new Error("Base64 decoder is unavailable.");
  }

  let normalizedData = encodedData.replace(/\s/g, "");

  try {
    normalizedData = decodeURIComponent(normalizedData);
  } catch {
    // Base64 data does not have to be URI-encoded.
  }

  let binaryData = "";

  try {
    binaryData = globalThis.atob(normalizedData);
  } catch {
    throw new Error("Could not decode base64 data URL.");
  }

  const bytes = new Uint8Array(binaryData.length);

  for (let index = 0; index < binaryData.length; index += 1) {
    bytes[index] = binaryData.charCodeAt(index);
  }

  return bytes;
}

function decodeTextData(encodedData: string): Uint8Array {
  try {
    return new TextEncoder().encode(decodeURIComponent(encodedData));
  } catch {
    throw new Error("Could not decode data URL.");
  }
}

function copyBytesToArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);

  return buffer;
}

function formatClipboardError(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === "string" && error) {
    return error;
  }

  return "Unknown clipboard error.";
}
