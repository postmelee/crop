import {
  getImageViewportScale,
  getSourceCropRect,
  type ImageNaturalSize,
  type ImageViewportScale,
  type ViewportCssSize
} from "./crop-image";
import { rectFromEdges, type CropRect, type CropRectLike } from "./rect";

export const MAX_CAPTURE_DIMENSION = 32767;
export const MAX_CAPTURE_AREA = 268_435_456;

export type StitchImageScale = ImageViewportScale;

export interface OutputCssSize {
  readonly width: number;
  readonly height: number;
}

export interface OutputPixelSize {
  readonly width: number;
  readonly height: number;
}

export interface StitchCapturedTileInput {
  readonly dataUrl: string;
  readonly viewportCropRect: CropRectLike;
  readonly destinationCssRect: CropRectLike;
  readonly viewportCssSize: ViewportCssSize;
}

export interface StitchCapturedTilesInput {
  readonly tiles: readonly StitchCapturedTileInput[];
  readonly outputCssSize: OutputCssSize;
}

export interface StitchCapturedTilesResult {
  readonly dataUrl: string;
  readonly outputWidth: number;
  readonly outputHeight: number;
  readonly drawnTiles: number;
  readonly scale: StitchImageScale;
}

export function getStitchOutputPixelSize(
  outputCssSize: OutputCssSize,
  scale: StitchImageScale
): OutputPixelSize {
  const width = Math.round(outputCssSize.width * scale.scaleX);
  const height = Math.round(outputCssSize.height * scale.scaleY);

  validateOutputPixelSize({ width, height });

  return {
    width,
    height
  };
}

export function validateOutputPixelSize(size: OutputPixelSize): void {
  if (size.width <= 0 || size.height <= 0) {
    throw new Error("Stitched screenshot output must be non-empty.");
  }

  if (
    size.width > MAX_CAPTURE_DIMENSION ||
    size.height > MAX_CAPTURE_DIMENSION ||
    size.width * size.height > MAX_CAPTURE_AREA
  ) {
    throw new Error("Stitched screenshot exceeds the maximum canvas size.");
  }
}

export function getStitchSourcePixelRect(input: {
  readonly viewportCropRect: CropRectLike;
  readonly imageNaturalSize: ImageNaturalSize;
  readonly viewportCssSize: ViewportCssSize;
}): CropRect | null {
  return getSourceCropRect(input);
}

export function getStitchDestinationPixelRect(
  destinationCssRect: CropRectLike,
  scale: StitchImageScale
): CropRect {
  return rectFromEdges(
    Math.round(destinationCssRect.left * scale.scaleX),
    Math.round(destinationCssRect.top * scale.scaleY),
    Math.round(destinationCssRect.right * scale.scaleX),
    Math.round(destinationCssRect.bottom * scale.scaleY)
  );
}

export async function stitchCapturedTiles(
  input: StitchCapturedTilesInput
): Promise<StitchCapturedTilesResult> {
  if (input.tiles.length === 0) {
    throw new Error("Full page stitching requires at least one captured tile.");
  }

  const firstImage = await loadImage(input.tiles[0].dataUrl);
  const scale = getScaleFromImage(firstImage, input.tiles[0].viewportCssSize);
  const outputSize = getStitchOutputPixelSize(input.outputCssSize, scale);
  const canvas = document.createElement("canvas");
  canvas.width = outputSize.width;
  canvas.height = outputSize.height;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Could not create stitch canvas context.");
  }

  let drawnTiles = 0;

  for (let index = 0; index < input.tiles.length; index += 1) {
    const tile = input.tiles[index];
    const image = index === 0 ? firstImage : await loadImage(tile.dataUrl);
    const tileSourceRect = getStitchSourcePixelRect({
      viewportCropRect: tile.viewportCropRect,
      imageNaturalSize: {
        naturalWidth: image.naturalWidth,
        naturalHeight: image.naturalHeight
      },
      viewportCssSize: tile.viewportCssSize
    });

    if (!tileSourceRect) {
      throw new Error("Captured tile source rect is outside the viewport image.");
    }

    const destinationRect = getStitchDestinationPixelRect(tile.destinationCssRect, scale);

    context.drawImage(
      image,
      tileSourceRect.left,
      tileSourceRect.top,
      tileSourceRect.width,
      tileSourceRect.height,
      destinationRect.left,
      destinationRect.top,
      destinationRect.width,
      destinationRect.height
    );
    drawnTiles += 1;
  }

  return {
    dataUrl: canvas.toDataURL("image/png"),
    outputWidth: outputSize.width,
    outputHeight: outputSize.height,
    drawnTiles,
    scale
  };
}

function getScaleFromImage(
  image: ImageNaturalSize,
  viewportCssSize: ViewportCssSize
): StitchImageScale {
  const scale = getImageViewportScale(image, viewportCssSize);

  if (!scale) {
    throw new Error("Could not determine captured tile image scale.");
  }

  return scale;
}

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      resolve(image);
    };
    image.onerror = () => {
      reject(new Error("Could not decode captured tile image."));
    };
    image.src = dataUrl;
  });
}
