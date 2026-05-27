import type { ViewportRect } from "../../firefox-derived/window-dimensions";

export type CropOverlayStatus = "idle" | "hovering" | "selected" | "closing";

export interface CropOverlayState {
  readonly status: CropOverlayStatus;
  readonly hoverRect: ViewportRect | null;
  readonly selectedRect: ViewportRect | null;
}

export function createInitialOverlayState(): CropOverlayState {
  return {
    status: "idle",
    hoverRect: null,
    selectedRect: null
  };
}

export type CropOverlayEvent =
  | {
      readonly type: "hover";
      readonly rect: ViewportRect | null;
    }
  | {
      readonly type: "select";
      readonly rect?: ViewportRect | null;
    }
  | {
      readonly type: "cancel";
    };

export function transitionOverlayState(
  state: CropOverlayState,
  event: CropOverlayEvent
): CropOverlayState {
  if (state.status === "closing") {
    return state;
  }

  switch (event.type) {
    case "hover":
      if (state.status === "selected") {
        return state;
      }

      return event.rect
        ? {
            status: "hovering",
            hoverRect: event.rect,
            selectedRect: null
          }
        : createInitialOverlayState();

    case "select": {
      const selectedRect = event.rect ?? state.hoverRect;

      return selectedRect
        ? {
            status: "selected",
            hoverRect: null,
            selectedRect
          }
        : state;
    }

    case "cancel":
      return {
        status: "closing",
        hoverRect: null,
        selectedRect: null
      };
  }
}
