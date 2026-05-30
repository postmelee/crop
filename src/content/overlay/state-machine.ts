import {
  normalizeRect,
  rectFromEdges,
  type PageRect
} from "../../firefox-derived/window-dimensions";
import {
  moveSelectionRect,
  resizeSelectionRect,
  type SelectionResizeHandle
} from "./selection-transform";

export type CropOverlayStatus =
  | "idle"
  | "hovering"
  | "draggingReady"
  | "dragging"
  | "selected"
  | "moving"
  | "resizing"
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
  readonly selectionAdjustment: CropSelectionAdjustment | null;
}

export type CropSelectionAdjustment =
  | {
      readonly mode: "move";
      readonly startRect: PageRect;
      readonly startPoint: CropOverlayPoint;
    }
  | {
      readonly mode: "resize";
      readonly handle: SelectionResizeHandle;
      readonly startRect: PageRect;
      readonly startPoint: CropOverlayPoint;
    };

export function createInitialOverlayState(): CropOverlayState {
  return {
    status: "idle",
    hoverRect: null,
    selectedRect: null,
    dragStart: null,
    selectionAdjustment: null
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
      readonly type: "selectionMoveStart";
      readonly point: CropOverlayPoint;
    }
  | {
      readonly type: "selectionResizeStart";
      readonly handle: SelectionResizeHandle;
      readonly point: CropOverlayPoint;
    }
  | {
      readonly type: "selectionAdjustMove";
      readonly point: CropOverlayPoint;
    }
  | {
      readonly type: "selectionAdjustEnd";
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
            dragStart: null,
            selectionAdjustment: null
          }
        : createInitialOverlayState();

    case "select": {
      const selectedRect = event.rect ?? state.hoverRect;

      return selectedRect
        ? {
            status: "selected",
            hoverRect: null,
            selectedRect,
            dragStart: null,
            selectionAdjustment: null
          }
        : state;
    }

    case "dragStart":
      return {
        status: "draggingReady",
        hoverRect: state.hoverRect,
        selectedRect: null,
        dragStart: event.point,
        selectionAdjustment: null
      };

    case "dragMove": {
      if (
        (state.status !== "draggingReady" && state.status !== "dragging") ||
        !state.dragStart
      ) {
        return state;
      }

      const selectedRect = normalizeRect(
        rectFromEdges(state.dragStart.x, state.dragStart.y, event.point.x, event.point.y)
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
        dragStart: state.dragStart,
        selectionAdjustment: null
      };
    }

    case "dragEnd":
      if (state.status === "dragging" && state.selectedRect) {
        return {
          status: "selected",
          hoverRect: null,
          selectedRect: state.selectedRect,
          dragStart: null,
          selectionAdjustment: null
        };
      }

      if (state.status === "draggingReady") {
        return state.hoverRect
          ? {
              status: "selected",
              hoverRect: null,
              selectedRect: state.hoverRect,
              dragStart: null,
              selectionAdjustment: null
            }
          : createInitialOverlayState();
      }

      return state;

    case "selectionMoveStart":
      if (state.status !== "selected" || !state.selectedRect) {
        return state;
      }

      return {
        status: "moving",
        hoverRect: null,
        selectedRect: state.selectedRect,
        dragStart: null,
        selectionAdjustment: {
          mode: "move",
          startRect: state.selectedRect,
          startPoint: event.point
        }
      };

    case "selectionResizeStart":
      if (state.status !== "selected" || !state.selectedRect) {
        return state;
      }

      return {
        status: "resizing",
        hoverRect: null,
        selectedRect: state.selectedRect,
        dragStart: null,
        selectionAdjustment: {
          mode: "resize",
          handle: event.handle,
          startRect: state.selectedRect,
          startPoint: event.point
        }
      };

    case "selectionAdjustMove": {
      if (
        (state.status !== "moving" && state.status !== "resizing") ||
        !state.selectionAdjustment
      ) {
        return state;
      }

      const selectedRect =
        state.selectionAdjustment.mode === "move"
          ? moveSelectionRect(
              state.selectionAdjustment.startRect,
              state.selectionAdjustment.startPoint,
              event.point
            )
          : resizeSelectionRect(
              state.selectionAdjustment.startRect,
              state.selectionAdjustment.handle,
              state.selectionAdjustment.startPoint,
              event.point
            );

      return {
        ...state,
        selectedRect
      };
    }

    case "selectionAdjustEnd":
      if (
        (state.status !== "moving" && state.status !== "resizing") ||
        !state.selectedRect
      ) {
        return state;
      }

      return {
        status: "selected",
        hoverRect: null,
        selectedRect: state.selectedRect,
        dragStart: null,
        selectionAdjustment: null
      };

    case "resetSelection":
      return state.status === "selected" ? createInitialOverlayState() : state;

    case "cancel":
      return {
        status: "closing",
        hoverRect: null,
        selectedRect: null,
        dragStart: null,
        selectionAdjustment: null
      };
  }
}

function getRectDistance(rect: PageRect): number {
  return Math.hypot(rect.width, rect.height);
}
