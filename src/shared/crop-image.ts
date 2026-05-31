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

export interface CropPngDataUrlInput {
  readonly dataUrl: string;
  readonly viewportCropRect: CropRectLike;
  readonly viewportCssSize: ViewportCssSize;
}

export interface CropPngDataUrlResult {
  readonly dataUrl: string;
  readonly sourceRect: CropRect;
  readonly outputWidth: number;
  readonly outputHeight: number;
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
    Math.round(input.viewportCropRect.left * scale.scaleX),
    Math.round(input.viewportCropRect.top * scale.scaleY),
    Math.round(input.viewportCropRect.right * scale.scaleX),
    Math.round(input.viewportCropRect.bottom * scale.scaleY)
  );

  return intersectRects(
    sourceRect,
    rectFromEdges(0, 0, input.imageNaturalSize.naturalWidth, input.imageNaturalSize.naturalHeight)
  );
}

export async function cropPngDataUrl(input: CropPngDataUrlInput): Promise<CropPngDataUrlResult> {
  const image = await loadImage(input.dataUrl);
  const sourceRect = getSourceCropRect({
    viewportCropRect: input.viewportCropRect,
    imageNaturalSize: {
      naturalWidth: image.naturalWidth,
      naturalHeight: image.naturalHeight
    },
    viewportCssSize: input.viewportCssSize
  });

  if (!sourceRect) {
    throw new Error("Selected area is outside the captured viewport.");
  }

  const outputWidth = Math.max(1, Math.round(sourceRect.width));
  const outputHeight = Math.max(1, Math.round(sourceRect.height));
  const canvas = document.createElement("canvas");
  canvas.width = outputWidth;
  canvas.height = outputHeight;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Could not create crop canvas context.");
  }

  context.drawImage(
    image,
    sourceRect.left,
    sourceRect.top,
    sourceRect.width,
    sourceRect.height,
    0,
    0,
    outputWidth,
    outputHeight
  );

  return {
    dataUrl: canvas.toDataURL("image/png"),
    sourceRect,
    outputWidth,
    outputHeight
  };
}

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      resolve(image);
    };
    image.onerror = () => {
      reject(new Error("Could not decode captured image."));
    };
    image.src = dataUrl;
  });
}
