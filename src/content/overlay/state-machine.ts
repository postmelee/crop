import { rectFromEdges, type PageRect } from "../../firefox-derived/window-dimensions";

export type CropOverlayStatus =
  | "idle"
  | "hovering"
  | "draggingReady"
  | "dragging"
  | "selected"
  | "closing";

export interface CropOverlayPoint {
  readonly x: number;
  readonly y: number;
}

export interface CropOverlayState {
  readonly status: CropOverlayStatus;
  readonly hoverRect: PageRect | null;
  readonly selectedRect: PageRect | null;
  readonly dragStart: CropOverlayPoint | null;
}

export function createInitialOverlayState(): CropOverlayState {
  return {
    status: "idle",
    hoverRect: null,
    selectedRect: null,
    dragStart: null
  };
}

export type CropOverlayEvent =
  | {
      readonly type: "hover";
      readonly rect: PageRect | null;
    }
  | {
      readonly type: "select";
      readonly rect?: PageRect | null;
    }
  | {
      readonly type: "dragStart";
      readonly point: CropOverlayPoint;
    }
  | {
      readonly type: "dragMove";
      readonly point: CropOverlayPoint;
    }
  | {
      readonly type: "dragEnd";
    }
  | {
      readonly type: "resetSelection";
    }
  | {
      readonly type: "cancel";
    };

const DRAG_SELECTION_THRESHOLD = 40;

export function transitionOverlayState(
  state: CropOverlayState,
  event: CropOverlayEvent
): CropOverlayState {
  if (state.status === "closing") {
    return state;
  }

  switch (event.type) {
    case "hover":
      if (state.status !== "idle" && state.status !== "hovering") {
        return state;
      }

      return event.rect
        ? {
            status: "hovering",
            hoverRect: event.rect,
            selectedRect: null,
            dragStart: null
          }
        : createInitialOverlayState();

    case "select": {
      const selectedRect = event.rect ?? state.hoverRect;

      return selectedRect
        ? {
            status: "selected",
            hoverRect: null,
            selectedRect,
            dragStart: null
          }
        : state;
    }

    case "dragStart":
      return {
        status: "draggingReady",
        hoverRect: state.hoverRect,
        selectedRect: null,
        dragStart: event.point
      };

    case "dragMove": {
      if (
        (state.status !== "draggingReady" && state.status !== "dragging") ||
        !state.dragStart
      ) {
        return state;
      }

      const selectedRect = rectFromEdges(
        state.dragStart.x,
        state.dragStart.y,
        event.point.x,
        event.point.y
      );

      if (
        state.status === "draggingReady" &&
        getRectDistance(selectedRect) <= DRAG_SELECTION_THRESHOLD
      ) {
        return state;
      }

      return {
        status: "dragging",
        hoverRect: null,
        selectedRect,
        dragStart: state.dragStart
      };
    }

    case "dragEnd":
      if (state.status === "dragging" && state.selectedRect) {
        return {
          status: "selected",
          hoverRect: null,
          selectedRect: state.selectedRect,
          dragStart: null
        };
      }

      if (state.status === "draggingReady") {
        return state.hoverRect
          ? {
              status: "selected",
              hoverRect: null,
              selectedRect: state.hoverRect,
              dragStart: null
            }
          : createInitialOverlayState();
      }

      return state;

    case "resetSelection":
      return state.status === "selected" ? createInitialOverlayState() : state;

    case "cancel":
      return {
        status: "closing",
        hoverRect: null,
        selectedRect: null,
        dragStart: null
      };
  }
}

function getRectDistance(rect: PageRect): number {
  return Math.hypot(rect.width, rect.height);
}
