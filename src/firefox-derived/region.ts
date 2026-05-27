/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import {
  intersectRects,
  normalizeRect,
  rectFromEdges,
  type RectLike,
  type ViewportRect,
  WindowDimensions
} from "./window-dimensions";

export interface RegionDimensions {
  readonly left?: number | null;
  readonly top?: number | null;
  readonly right?: number | null;
  readonly bottom?: number | null;
}

export class Region {
  #x1 = 0;
  #x2 = 0;
  #y1 = 0;
  #y2 = 0;
  #xOffset = 0;
  #yOffset = 0;
  readonly #windowDimensions: WindowDimensions;

  constructor(windowDimensions: WindowDimensions, dimensions?: RegionDimensions | null) {
    this.#windowDimensions = windowDimensions;
    if (dimensions) {
      this.dimensions = dimensions;
    }
  }

  static fromRect(windowDimensions: WindowDimensions, rect: RectLike): Region {
    const normalized = normalizeRect(rect);
    return new Region(windowDimensions, normalized);
  }

  set dimensions(dimensions: RegionDimensions | null) {
    if (!dimensions) {
      this.resetDimensions();
      return;
    }

    if (dimensions.left != null) {
      this.left = dimensions.left;
    }
    if (dimensions.top != null) {
      this.top = dimensions.top;
    }
    if (dimensions.right != null) {
      this.right = dimensions.right;
    }
    if (dimensions.bottom != null) {
      this.bottom = dimensions.bottom;
    }
  }

  get dimensions(): ViewportRect {
    return rectFromEdges(this.left, this.top, this.right, this.bottom);
  }

  get isRegionValid(): boolean {
    return this.width > 0 && this.height > 0;
  }

  get area(): number {
    return this.width * this.height;
  }

  get distance(): number {
    return Math.hypot(this.width, this.height);
  }

  get xOffset(): number {
    return this.#xOffset;
  }

  set xOffset(value: number) {
    this.#xOffset = value;
  }

  get yOffset(): number {
    return this.#yOffset;
  }

  set yOffset(value: number) {
    this.#yOffset = value;
  }

  get top(): number {
    return Math.min(this.#y1, this.#y2);
  }

  set top(value: number) {
    this.#y1 = this.#clampY(value);
  }

  get left(): number {
    return Math.min(this.#x1, this.#x2);
  }

  set left(value: number) {
    this.#x1 = this.#clampX(value);
  }

  get right(): number {
    return Math.max(this.#x1, this.#x2);
  }

  set right(value: number) {
    this.#x2 = this.#clampX(value);
  }

  get bottom(): number {
    return Math.max(this.#y1, this.#y2);
  }

  set bottom(value: number) {
    this.#y2 = this.#clampY(value);
  }

  get width(): number {
    return Math.abs(this.#x2 - this.#x1);
  }

  get height(): number {
    return Math.abs(this.#y2 - this.#y1);
  }

  get x1(): number {
    return this.#x1;
  }

  get x2(): number {
    return this.#x2;
  }

  get y1(): number {
    return this.#y1;
  }

  get y2(): number {
    return this.#y2;
  }

  resetDimensions(): void {
    this.#x1 = 0;
    this.#x2 = 0;
    this.#y1 = 0;
    this.#y2 = 0;
    this.#xOffset = 0;
    this.#yOffset = 0;
  }

  sortCoords(): void {
    if (this.#x1 > this.#x2) {
      [this.#x1, this.#x2] = [this.#x2, this.#x1];
    }
    if (this.#y1 > this.#y2) {
      [this.#y1, this.#y2] = [this.#y2, this.#y1];
    }
  }

  containsPoint(x: number, y: number): boolean {
    return x >= this.left && x <= this.right && y >= this.top && y <= this.bottom;
  }

  containsRect(rect: RectLike): boolean {
    const normalized = normalizeRect(rect);

    return (
      normalized.left >= this.left &&
      normalized.right <= this.right &&
      normalized.top >= this.top &&
      normalized.bottom <= this.bottom
    );
  }

  intersectsRect(rect: RectLike): boolean {
    return intersectRects(this.dimensions, rect) !== null;
  }

  intersection(rect: RectLike): ViewportRect | null {
    return intersectRects(this.dimensions, rect);
  }

  clipToViewport(): ViewportRect | null {
    return this.#windowDimensions.clipRectToViewport(this.dimensions);
  }

  #clampX(value: number): number {
    return clamp(value, 0, this.#windowDimensions.clientWidth);
  }

  #clampY(value: number): number {
    return clamp(value, 0, this.#windowDimensions.clientHeight);
  }
}

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    return min;
  }

  return Math.min(max, Math.max(min, value));
}
