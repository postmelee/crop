export const CROP_CAPTURE_VISIBLE_TAB_MESSAGE = "crop.captureVisibleTab";
export const CROP_DOWNLOAD_PNG_MESSAGE = "crop.downloadPng";

export interface CropCaptureVisibleTabRequest {
  readonly type: typeof CROP_CAPTURE_VISIBLE_TAB_MESSAGE;
}

export type CropCaptureVisibleTabResponse =
  | {
      readonly ok: true;
      readonly dataUrl: string;
    }
  | {
      readonly ok: false;
      readonly error: string;
    };

export interface CropDownloadPngRequest {
  readonly type: typeof CROP_DOWNLOAD_PNG_MESSAGE;
  readonly dataUrl: string;
  readonly filename: string;
}

export type CropDownloadPngResponse =
  | {
      readonly ok: true;
      readonly downloadId: number;
    }
  | {
      readonly ok: false;
      readonly error: string;
    };

export type CropRuntimeMessage = CropCaptureVisibleTabRequest | CropDownloadPngRequest;
export type CropRuntimeResponse = CropCaptureVisibleTabResponse | CropDownloadPngResponse;

export function createCaptureVisibleTabRequest(): CropCaptureVisibleTabRequest {
  return {
    type: CROP_CAPTURE_VISIBLE_TAB_MESSAGE
  };
}

export function createDownloadPngRequest(dataUrl: string, filename: string): CropDownloadPngRequest {
  return {
    type: CROP_DOWNLOAD_PNG_MESSAGE,
    dataUrl,
    filename
  };
}

export function isCropCaptureVisibleTabRequest(
  message: unknown
): message is CropCaptureVisibleTabRequest {
  return (
    typeof message === "object" &&
    message !== null &&
    "type" in message &&
    message.type === CROP_CAPTURE_VISIBLE_TAB_MESSAGE
  );
}

export function isCropDownloadPngRequest(message: unknown): message is CropDownloadPngRequest {
  return (
    typeof message === "object" &&
    message !== null &&
    "type" in message &&
    message.type === CROP_DOWNLOAD_PNG_MESSAGE &&
    "dataUrl" in message &&
    typeof message.dataUrl === "string" &&
    message.dataUrl.startsWith("data:image/png") &&
    "filename" in message &&
    typeof message.filename === "string" &&
    message.filename.length > 0
  );
}

export function isCropCaptureVisibleTabResponse(
  message: unknown
): message is CropCaptureVisibleTabResponse {
  if (typeof message !== "object" || message === null || !("ok" in message)) {
    return false;
  }

  if (message.ok === true) {
    return "dataUrl" in message && typeof message.dataUrl === "string";
  }

  if (message.ok === false) {
    return "error" in message && typeof message.error === "string";
  }

  return false;
}

export function isCropDownloadPngResponse(message: unknown): message is CropDownloadPngResponse {
  if (typeof message !== "object" || message === null || !("ok" in message)) {
    return false;
  }

  if (message.ok === true) {
    return "downloadId" in message && typeof message.downloadId === "number";
  }

  if (message.ok === false) {
    return "error" in message && typeof message.error === "string";
  }

  return false;
}
