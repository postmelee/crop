/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

export interface RectLike {
  readonly left: number;
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
}

export interface ViewportRect extends RectLike {
  readonly width: number;
  readonly height: number;
}

export interface WindowDimensionsInput {
  readonly clientWidth?: number | null;
  readonly clientHeight?: number | null;
  readonly scrollWidth?: number | null;
  readonly scrollHeight?: number | null;
  readonly scrollX?: number | null;
  readonly scrollY?: number | null;
  readonly scrollMinX?: number | null;
  readonly scrollMinY?: number | null;
  readonly scrollMaxX?: number | null;
  readonly scrollMaxY?: number | null;
  readonly devicePixelRatio?: number | null;
}

interface WindowLike {
  readonly innerWidth: number;
  readonly innerHeight: number;
  readonly scrollX: number;
  readonly scrollY: number;
  readonly devicePixelRatio: number;
  readonly document: {
    readonly documentElement: {
      readonly clientWidth: number;
      readonly clientHeight: number;
      readonly scrollWidth: number;
      readonly scrollHeight: number;
    };
    readonly body?: {
      readonly scrollWidth: number;
      readonly scrollHeight: number;
    } | null;
  };
}

export class WindowDimensions {
  #clientWidth = 0;
  #clientHeight = 0;
  #scrollWidth = 0;
  #scrollHeight = 0;
  #scrollX = 0;
  #scrollY = 0;
  #scrollMinX = 0;
  #scrollMinY = 0;
  #scrollMaxX = 0;
  #scrollMaxY = 0;
  #devicePixelRatio = 1;

  constructor(dimensions?: WindowDimensionsInput | null) {
    if (dimensions) {
      this.dimensions = dimensions;
    }
  }

  set dimensions(dimensions: WindowDimensionsInput | null) {
    if (!dimensions) {
      this.reset();
      return;
    }

    if (dimensions.clientWidth != null) {
      this.#clientWidth = toNonNegative(dimensions.clientWidth);
    }
    if (dimensions.clientHeight != null) {
      this.#clientHeight = toNonNegative(dimensions.clientHeight);
    }
    if (dimensions.scrollWidth != null) {
      this.#scrollWidth = toNonNegative(dimensions.scrollWidth);
    }
    if (dimensions.scrollHeight != null) {
      this.#scrollHeight = toNonNegative(dimensions.scrollHeight);
    }
    if (dimensions.scrollX != null) {
      this.#scrollX = toFiniteNumber(dimensions.scrollX);
    }
    if (dimensions.scrollY != null) {
      this.#scrollY = toFiniteNumber(dimensions.scrollY);
    }
    if (dimensions.scrollMinX != null) {
      this.#scrollMinX = toFiniteNumber(dimensions.scrollMinX);
    }
    if (dimensions.scrollMinY != null) {
      this.#scrollMinY = toFiniteNumber(dimensions.scrollMinY);
    }
    if (dimensions.scrollMaxX != null) {
      this.#scrollMaxX = toNonNegative(dimensions.scrollMaxX);
    }
    if (dimensions.scrollMaxY != null) {
      this.#scrollMaxY = toNonNegative(dimensions.scrollMaxY);
    }
    if (dimensions.devicePixelRatio != null) {
      this.#devicePixelRatio = Math.max(1, toFiniteNumber(dimensions.devicePixelRatio));
    }

    this.#scrollWidth = Math.max(this.#scrollWidth, this.#clientWidth);
    this.#scrollHeight = Math.max(this.#scrollHeight, this.#clientHeight);
  }

  get dimensions(): Required<WindowDimensionsInput> {
    return {
      clientWidth: this.clientWidth,
      clientHeight: this.clientHeight,
      scrollWidth: this.scrollWidth,
      scrollHeight: this.scrollHeight,
      scrollX: this.scrollX,
      scrollY: this.scrollY,
      scrollMinX: this.scrollMinX,
      scrollMinY: this.scrollMinY,
      scrollMaxX: this.scrollMaxX,
      scrollMaxY: this.scrollMaxY,
      devicePixelRatio: this.devicePixelRatio
    };
  }

  get clientWidth(): number {
    return this.#clientWidth;
  }

  get clientHeight(): number {
    return this.#clientHeight;
  }

  get scrollWidth(): number {
    return this.#scrollWidth;
  }

  get scrollHeight(): number {
    return this.#scrollHeight;
  }

  get scrollX(): number {
    return this.#scrollX - this.#scrollMinX;
  }

  get pageScrollX(): number {
    return this.#scrollX;
  }

  get scrollY(): number {
    return this.#scrollY - this.#scrollMinY;
  }

  get pageScrollY(): number {
    return this.#scrollY;
  }

  get scrollMinX(): number {
    return this.#scrollMinX;
  }

  get scrollMinY(): number {
    return this.#scrollMinY;
  }

  get scrollMaxX(): number {
    return this.#scrollMaxX;
  }

  get scrollMaxY(): number {
    return this.#scrollMaxY;
  }

  get devicePixelRatio(): number {
    return this.#devicePixelRatio;
  }

  get viewportRect(): ViewportRect {
    return rectFromEdges(0, 0, this.#clientWidth, this.#clientHeight);
  }

  get pageViewportRect(): ViewportRect {
    return rectFromEdges(
      this.pageScrollX,
      this.pageScrollY,
      this.pageScrollX + this.#clientWidth,
      this.pageScrollY + this.#clientHeight
    );
  }

  isInViewport(rect: RectLike): boolean {
    return rectsIntersect(normalizeRect(rect), this.viewportRect);
  }

  clipRectToViewport(rect: RectLike): ViewportRect | null {
    return intersectRects(normalizeRect(rect), this.viewportRect);
  }

  reset(): void {
    this.#clientWidth = 0;
    this.#clientHeight = 0;
    this.#scrollWidth = 0;
    this.#scrollHeight = 0;
    this.#scrollX = 0;
    this.#scrollY = 0;
    this.#scrollMinX = 0;
    this.#scrollMinY = 0;
    this.#scrollMaxX = 0;
    this.#scrollMaxY = 0;
    this.#devicePixelRatio = 1;
  }
}

export function readWindowDimensions(win: WindowLike = window): WindowDimensions {
  const documentElement = win.document.documentElement;
  const body = win.document.body;
  const clientWidth = documentElement.clientWidth || win.innerWidth;
  const clientHeight = documentElement.clientHeight || win.innerHeight;
  const scrollWidth = Math.max(documentElement.scrollWidth, body?.scrollWidth ?? 0, clientWidth);
  const scrollHeight = Math.max(
    documentElement.scrollHeight,
    body?.scrollHeight ?? 0,
    clientHeight
  );

  return new WindowDimensions({
    clientWidth,
    clientHeight,
    scrollWidth,
    scrollHeight,
    scrollX: win.scrollX,
    scrollY: win.scrollY,
    scrollMaxX: Math.max(0, scrollWidth - clientWidth),
    scrollMaxY: Math.max(0, scrollHeight - clientHeight),
    devicePixelRatio: win.devicePixelRatio
  });
}

export function normalizeRect(rect: RectLike): ViewportRect {
  return rectFromEdges(
    Math.min(rect.left, rect.right),
    Math.min(rect.top, rect.bottom),
    Math.max(rect.left, rect.right),
    Math.max(rect.top, rect.bottom)
  );
}

export function intersectRects(first: RectLike, second: RectLike): ViewportRect | null {
  const a = normalizeRect(first);
  const b = normalizeRect(second);
  const left = Math.max(a.left, b.left);
  const top = Math.max(a.top, b.top);
  const right = Math.min(a.right, b.right);
  const bottom = Math.min(a.bottom, b.bottom);

  if (right <= left || bottom <= top) {
    return null;
  }

  return rectFromEdges(left, top, right, bottom);
}

export function rectsIntersect(first: RectLike, second: RectLike): boolean {
  return intersectRects(first, second) !== null;
}

export function rectFromEdges(
  left: number,
  top: number,
  right: number,
  bottom: number
): ViewportRect {
  return {
    left,
    top,
    right,
    bottom,
    width: Math.max(0, right - left),
    height: Math.max(0, bottom - top)
  };
}

function toNonNegative(value: number): number {
  return Math.max(0, toFiniteNumber(value));
}

function toFiniteNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}
