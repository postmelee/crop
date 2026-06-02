/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import {
  normalizeRect,
  rectFromEdges,
  type RectLike,
  type ViewportRect,
  WindowDimensions,
  viewportRectToPageRect,
  readWindowDimensions
} from "./window-dimensions";

const MIN_DETECT_ABSOLUTE_HEIGHT = 10;
const MIN_DETECT_ABSOLUTE_WIDTH = 30;
const MIN_DETECT_HEIGHT = 30;
const MIN_DETECT_WIDTH = 100;
const DEFAULT_MAX_DETECT_HEIGHT = 700;
const DEFAULT_MAX_DETECT_WIDTH = 1000;
const MAX_IFRAME_TRAVERSAL_DEPTH = 8;
const DO_NOT_AUTOSELECT_TAGS = new Set(["H1", "H2", "H3", "H4", "H5", "H6"]);

let maxDetectHeight = DEFAULT_MAX_DETECT_HEIGHT;
let maxDetectWidth = DEFAULT_MAX_DETECT_WIDTH;

export interface DetectionThresholds {
  readonly minDetectAbsoluteHeight: number;
  readonly minDetectAbsoluteWidth: number;
  readonly minDetectHeight: number;
  readonly minDetectWidth: number;
  readonly maxDetectHeight: number;
  readonly maxDetectWidth: number;
}

export interface BestRectOptions {
  readonly windowDimensions?: WindowDimensions;
  readonly previousRect?: RectLike | null;
  readonly thresholds?: Partial<DetectionThresholds>;
  readonly coordinateSpace?: "viewport" | "page";
}

export interface HitTestResult {
  readonly element: Element | null;
  readonly rect: ViewportRect | null;
  readonly unsupportedReason?: "iframe";
}

export interface IframeViewportPoint {
  readonly x: number;
  readonly y: number;
}

interface ElementPointRoot {
  elementFromPoint(x: number, y: number): Element | null;
}

interface HitTestContext {
  readonly depth: number;
  readonly visitedIframes: ReadonlySet<Element>;
}

export function setMaxDetectHeight(maxHeight: number): void {
  maxDetectHeight = Math.max(0, maxHeight);
}

export function setMaxDetectWidth(maxWidth: number): void {
  maxDetectWidth = Math.max(0, maxWidth);
}

export function resetDetectThresholds(): void {
  maxDetectHeight = DEFAULT_MAX_DETECT_HEIGHT;
  maxDetectWidth = DEFAULT_MAX_DETECT_WIDTH;
}

export function getElementFromPoint(
  x: number,
  y: number,
  root: ElementPointRoot = document
): HitTestResult {
  return getElementFromPointInRoot(x, y, root, {
    depth: 0,
    visitedIframes: new Set()
  });
}

function getElementFromPointInRoot(
  x: number,
  y: number,
  root: ElementPointRoot,
  context: HitTestContext
): HitTestResult {
  let element = root.elementFromPoint(x, y);

  if (!element) {
    return { element: null, rect: null };
  }

  if (isIframeElement(element)) {
    return getIframeHitTestResult(element, x, y, context);
  }

  element = getDeepestOpenShadowElementFromPoint(element, x, y);
  if (isIframeElement(element)) {
    return getIframeHitTestResult(element, x, y, context);
  }

  return { element, rect: null };
}

export function getBestRectForElement(
  element: Element | null,
  options: BestRectOptions = {}
): ViewportRect | null {
  if (!element) {
    return null;
  }

  const thresholds = getThresholds(options.thresholds);
  const windowDimensions = options.windowDimensions ?? readDimensionsForElement(element);
  const coordinateSpace = options.coordinateSpace ?? "viewport";
  let node: Element | null = element;
  let selectedRect = options.previousRect
    ? windowDimensions.clipRectToViewport(options.previousRect)
    : null;
  let selectedNode: Element | null = selectedRect ? element : null;
  let attemptExtend = false;

  while (node) {
    const rawRect = getBoundingClientRect(node);
    if (!rawRect) {
      break;
    }

    const visibleRect = windowDimensions.clipRectToViewport(rawRect);
    if (!visibleRect) {
      break;
    }
    const candidateRect = toCoordinateSpaceRect(rawRect, windowDimensions, coordinateSpace);

    if (isAbsolutelyTooSmall(candidateRect, thresholds)) {
      const parent = getParentElement(node);
      if (!parent) {
        selectedRect = candidateRect;
        selectedNode = node;
        break;
      }
      node = parent;
      continue;
    }

    if (isTooLarge(rawRect, thresholds)) {
      if (selectedRect) {
        attemptExtend = true;
      }
      break;
    }

    selectedRect = candidateRect;
    selectedNode = node;

    if (isBelowPreferredSize(candidateRect, thresholds) || isDoNotAutoselectTag(node)) {
      const parent = getParentElement(node);
      if (parent) {
        node = parent;
        continue;
      }
    }

    break;
  }

  if (!selectedRect || !selectedNode || isAbsolutelyTooSmall(selectedRect, thresholds)) {
    return null;
  }

  const articleRect = getArticleParentRect(
    selectedNode,
    windowDimensions,
    thresholds,
    coordinateSpace
  );
  if (articleRect) {
    return articleRect;
  }

  if (attemptExtend) {
    return tryExtendWithSibling(
      selectedNode,
      selectedRect,
      windowDimensions,
      thresholds,
      coordinateSpace
    );
  }

  return selectedRect;
}

export function getVisibleRectForElement(
  element: Element,
  windowDimensions: WindowDimensions
): ViewportRect | null {
  const rect = getBoundingClientRect(element);
  if (!rect) {
    return null;
  }

  return windowDimensions.clipRectToViewport(rect);
}

export function getAccessibleIframeDocument(element: Element): Document | null {
  if (!isIframeElement(element)) {
    return null;
  }

  try {
    return (element as HTMLIFrameElement).contentDocument ?? null;
  } catch {
    return null;
  }
}

export function projectPointIntoIframeViewport(
  iframe: Element,
  parentViewportX: number,
  parentViewportY: number
): IframeViewportPoint | null {
  const frameRect = getBoundingClientRect(iframe);
  if (!frameRect) {
    return null;
  }

  const origin = getIframeViewportOrigin(iframe, frameRect);
  return {
    x: parentViewportX - origin.x,
    y: parentViewportY - origin.y
  };
}

export function projectIframeViewportRectToParentViewport(
  iframe: Element,
  iframeViewportRect: RectLike
): ViewportRect | null {
  const frameRect = getBoundingClientRect(iframe);
  if (!frameRect) {
    return null;
  }

  const origin = getIframeViewportOrigin(iframe, frameRect);
  const rect = normalizeRect(iframeViewportRect);

  return rectFromEdges(
    origin.x + rect.left,
    origin.y + rect.top,
    origin.x + rect.right,
    origin.y + rect.bottom
  );
}

function getIframeHitTestResult(
  iframe: Element,
  x: number,
  y: number,
  context: HitTestContext
): HitTestResult {
  if (context.depth >= MAX_IFRAME_TRAVERSAL_DEPTH || context.visitedIframes.has(iframe)) {
    return createIframeFallback(iframe);
  }

  const iframeDocument = getAccessibleIframeDocument(iframe);
  if (!iframeDocument) {
    return createIframeFallback(iframe);
  }

  const iframePoint = projectPointIntoIframeViewport(iframe, x, y);
  if (!iframePoint) {
    return createIframeFallback(iframe);
  }

  const visitedIframes = new Set(context.visitedIframes);
  visitedIframes.add(iframe);
  const childHit = getElementFromPointInRoot(iframePoint.x, iframePoint.y, iframeDocument, {
    depth: context.depth + 1,
    visitedIframes
  });

  if (!childHit.element) {
    return createIframeFallback(iframe);
  }

  const childRect = childHit.rect ?? getBoundingClientRect(childHit.element);
  if (!childRect) {
    return childHit.unsupportedReason
      ? { element: childHit.element, rect: null, unsupportedReason: childHit.unsupportedReason }
      : { element: childHit.element, rect: null };
  }

  const rect = projectIframeViewportRectToParentViewport(iframe, childRect);
  if (!rect) {
    return childHit.unsupportedReason
      ? { element: childHit.element, rect: null, unsupportedReason: childHit.unsupportedReason }
      : { element: childHit.element, rect: null };
  }

  return childHit.unsupportedReason
    ? { element: childHit.element, rect, unsupportedReason: childHit.unsupportedReason }
    : { element: childHit.element, rect };
}

function createIframeFallback(element: Element): HitTestResult {
  return { element, rect: null, unsupportedReason: "iframe" };
}

function getDeepestOpenShadowElementFromPoint(
  initialElement: Element,
  x: number,
  y: number
): Element {
  let element = initialElement;
  const visited = new Set<Element>();

  while (!visited.has(element)) {
    visited.add(element);
    const shadowRoot = element.shadowRoot as ElementPointRoot | null;
    const shadowElement = shadowRoot?.elementFromPoint(x, y);

    if (!shadowElement) {
      break;
    }

    element = shadowElement;
    if (isIframeElement(element)) {
      break;
    }
  }

  return element;
}

function getArticleParentRect(
  node: Element,
  windowDimensions: WindowDimensions,
  thresholds: DetectionThresholds,
  coordinateSpace: "viewport" | "page"
): ViewportRect | null {
  let current = getParentElement(node);

  while (current) {
    if (current.getAttribute?.("role") === "article") {
      const rawRect = getBoundingClientRect(current);
      const visibleRect = rawRect ? windowDimensions.clipRectToViewport(rawRect) : null;
      const rect = rawRect
        ? toCoordinateSpaceRect(rawRect, windowDimensions, coordinateSpace)
        : null;

      if (
        rawRect &&
        visibleRect &&
        rect &&
        !isTooLarge(rawRect, thresholds) &&
        !isAbsolutelyTooSmall(rect, thresholds)
      ) {
        return rect;
      }

      return null;
    }

    current = getParentElement(current);
  }

  return null;
}

function tryExtendWithSibling(
  node: Element,
  rect: ViewportRect,
  windowDimensions: WindowDimensions,
  thresholds: DetectionThresholds,
  coordinateSpace: "viewport" | "page"
): ViewportRect {
  const sibling = getNextElementSibling(node);
  if (!sibling) {
    return rect;
  }

  const rawSiblingRect = getBoundingClientRect(sibling);
  if (!rawSiblingRect || !windowDimensions.clipRectToViewport(rawSiblingRect)) {
    return rect;
  }
  const siblingRect = toCoordinateSpaceRect(rawSiblingRect, windowDimensions, coordinateSpace);

  const combined = unionRects(rect, siblingRect);
  if (isTooLarge(combined, thresholds)) {
    return rect;
  }

  return combined;
}

function getBoundingClientRect(element: Element): ViewportRect | null {
  if (!element.getBoundingClientRect) {
    return null;
  }

  const rect = element.getBoundingClientRect();
  return normalizeRect(rect);
}

function getIframeViewportOrigin(iframe: Element, frameRect: ViewportRect): IframeViewportPoint {
  return {
    x: frameRect.left + readElementClientOffset(iframe, "clientLeft"),
    y: frameRect.top + readElementClientOffset(iframe, "clientTop")
  };
}

function readElementClientOffset(
  element: Element,
  property: "clientLeft" | "clientTop"
): number {
  const value = (element as HTMLElement)[property];
  return Number.isFinite(value) ? value : 0;
}

function unionRects(first: ViewportRect, second: ViewportRect): ViewportRect {
  return rectFromEdges(
    Math.min(first.left, second.left),
    Math.min(first.top, second.top),
    Math.max(first.right, second.right),
    Math.max(first.bottom, second.bottom)
  );
}

function toCoordinateSpaceRect(
  rect: ViewportRect,
  windowDimensions: WindowDimensions,
  coordinateSpace: "viewport" | "page"
): ViewportRect {
  return coordinateSpace === "page" ? viewportRectToPageRect(rect, windowDimensions) : rect;
}

function getParentElement(element: Element): Element | null {
  return element.parentElement ?? getElementNode(element.parentNode);
}

function getNextElementSibling(element: Element): Element | null {
  if (element.nextElementSibling) {
    return element.nextElementSibling;
  }

  let node = element.nextSibling;
  while (node) {
    const elementNode = getElementNode(node);
    if (elementNode) {
      return elementNode;
    }
    node = node.nextSibling;
  }

  return null;
}

function getElementNode(node: ParentNode | ChildNode | Node | null): Element | null {
  if (node?.nodeType === 1) {
    return node as Element;
  }

  return null;
}

function isIframeElement(element: Element): boolean {
  return element.tagName.toUpperCase() === "IFRAME";
}

function isDoNotAutoselectTag(element: Element): boolean {
  return DO_NOT_AUTOSELECT_TAGS.has(element.tagName.toUpperCase());
}

function isBelowPreferredSize(rect: ViewportRect, thresholds: DetectionThresholds): boolean {
  return rect.width < thresholds.minDetectWidth || rect.height < thresholds.minDetectHeight;
}

function isAbsolutelyTooSmall(rect: ViewportRect, thresholds: DetectionThresholds): boolean {
  return (
    rect.width < thresholds.minDetectAbsoluteWidth ||
    rect.height < thresholds.minDetectAbsoluteHeight
  );
}

function isTooLarge(rect: ViewportRect, thresholds: DetectionThresholds): boolean {
  return rect.width > thresholds.maxDetectWidth || rect.height > thresholds.maxDetectHeight;
}

function readDimensionsForElement(element: Element): WindowDimensions {
  const elementWindow = element.ownerDocument?.defaultView;

  if (elementWindow) {
    return readWindowDimensions(elementWindow);
  }

  return readWindowDimensions();
}

function getThresholds(overrides: Partial<DetectionThresholds> = {}): DetectionThresholds {
  return {
    minDetectAbsoluteHeight: overrides.minDetectAbsoluteHeight ?? MIN_DETECT_ABSOLUTE_HEIGHT,
    minDetectAbsoluteWidth: overrides.minDetectAbsoluteWidth ?? MIN_DETECT_ABSOLUTE_WIDTH,
    minDetectHeight: overrides.minDetectHeight ?? MIN_DETECT_HEIGHT,
    minDetectWidth: overrides.minDetectWidth ?? MIN_DETECT_WIDTH,
    maxDetectHeight: overrides.maxDetectHeight ?? maxDetectHeight,
    maxDetectWidth: overrides.maxDetectWidth ?? maxDetectWidth
  };
}
