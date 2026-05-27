import { intersectRects, rectFromEdges, type CropRect, type CropRectLike } from "./rect";

export interface ImageNaturalSize {
  readonly naturalWidth: number;
  readonly naturalHeight: number;
}

export interface ViewportCssSize {
  readonly clientWidth: number;
  readonly clientHeight: number;
}

export interface ImageViewportScale {
  readonly scaleX: number;
  readonly scaleY: number;
}

export interface SourceCropRectInput {
  readonly viewportCropRect: CropRectLike;
  readonly imageNaturalSize: ImageNaturalSize;
  readonly viewportCssSize: ViewportCssSize;
}

export function getImageViewportScale(
  imageNaturalSize: ImageNaturalSize,
  viewportCssSize: ViewportCssSize
): ImageViewportScale | null {
  if (
    imageNaturalSize.naturalWidth <= 0 ||
    imageNaturalSize.naturalHeight <= 0 ||
    viewportCssSize.clientWidth <= 0 ||
    viewportCssSize.clientHeight <= 0
  ) {
    return null;
  }

  return {
    scaleX: imageNaturalSize.naturalWidth / viewportCssSize.clientWidth,
    scaleY: imageNaturalSize.naturalHeight / viewportCssSize.clientHeight
  };
}

export function getSourceCropRect(input: SourceCropRectInput): CropRect | null {
  const scale = getImageViewportScale(input.imageNaturalSize, input.viewportCssSize);

  if (!scale) {
    return null;
  }

  const sourceRect = rectFromEdges(
    Math.floor(input.viewportCropRect.left * scale.scaleX),
    Math.floor(input.viewportCropRect.top * scale.scaleY),
    Math.ceil(input.viewportCropRect.right * scale.scaleX),
    Math.ceil(input.viewportCropRect.bottom * scale.scaleY)
  );

  return intersectRects(
    sourceRect,
    rectFromEdges(0, 0, input.imageNaturalSize.naturalWidth, input.imageNaturalSize.naturalHeight)
  );
}
