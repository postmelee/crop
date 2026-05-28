export const CROP_CAPTURE_VISIBLE_TAB_MESSAGE = "crop.captureVisibleTab";

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

export type CropRuntimeMessage = CropCaptureVisibleTabRequest;

export function createCaptureVisibleTabRequest(): CropCaptureVisibleTabRequest {
  return {
    type: CROP_CAPTURE_VISIBLE_TAB_MESSAGE
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
