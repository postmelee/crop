export type CropOverlayStatus = "idle";

export interface CropOverlayState {
  readonly status: CropOverlayStatus;
}

export function createInitialOverlayState(): CropOverlayState {
  return {
    status: "idle"
  };
}
