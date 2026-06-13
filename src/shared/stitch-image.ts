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

export interface StitchOutputLimitOptions {
  readonly maxOutputDimension?: number;
  readonly maxOutputArea?: number;
}

export interface StitchOutputPixelPlan extends OutputPixelSize {
  readonly sourceScale: StitchImageScale;
  readonly outputScale: StitchImageScale;
  readonly downscaleRatio: number;
  readonly downscaled: boolean;
}

export interface StitchCapturedTileInput {
  readonly dataUrl: string;
  readonly viewportCropRect: CropRectLike;
  readonly destinationCssRect: CropRectLike;
  readonly captureViewportCssSize: ViewportCssSize;
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
  readonly sourceScale: StitchImageScale;
  readonly outputScale: StitchImageScale;
  readonly downscaleRatio: number;
  readonly downscaled: boolean;
}

export interface StitchPreviewTileLayoutInput {
  readonly viewportCropRect: CropRectLike;
  readonly destinationCssRect: CropRectLike;
  readonly captureViewportCssSize: ViewportCssSize;
  readonly outputScale: StitchImageScale;
}

export interface StitchPreviewTileLayout {
  readonly tileRect: CropRect;
  readonly imageRect: CropRect;
}

export function getStitchOutputPixelSize(
  outputCssSize: OutputCssSize,
  scale: StitchImageScale
): OutputPixelSize {
  const outputPlan = getStitchOutputPixelPlan(outputCssSize, scale);

  return {
    width: outputPlan.width,
    height: outputPlan.height
  };
}

export function getStitchOutputPixelPlan(
  outputCssSize: OutputCssSize,
  sourceScale: StitchImageScale,
  options: StitchOutputLimitOptions = {}
): StitchOutputPixelPlan {
  const estimatedWidth = Math.round(outputCssSize.width * sourceScale.scaleX);
  const estimatedHeight = Math.round(outputCssSize.height * sourceScale.scaleY);

  if (estimatedWidth <= 0 || estimatedHeight <= 0) {
    throw new Error("Stitched screenshot output must be non-empty.");
  }

  const maxDimension = getPositiveLimit(
    options.maxOutputDimension,
    MAX_CAPTURE_DIMENSION,
    "maximum canvas dimension"
  );
  const maxArea = getPositiveLimit(options.maxOutputArea, MAX_CAPTURE_AREA, "maximum canvas area");
  const downscaleRatio = getOutputDownscaleRatio(
    {
      width: estimatedWidth,
      height: estimatedHeight
    },
    {
      maxDimension,
      maxArea
    }
  );
  const outputScale = {
    scaleX: sourceScale.scaleX * downscaleRatio,
    scaleY: sourceScale.scaleY * downscaleRatio
  };
  const outputSize = getRoundedOutputSize(outputCssSize, outputScale);

  if (outputSize.width <= 0 || outputSize.height <= 0) {
    throw new Error("Stitched screenshot output must be non-empty.");
  }

  if (exceedsOutputLimits(outputSize, maxDimension, maxArea)) {
    throw new Error("Stitched screenshot exceeds the maximum canvas size.");
  }

  return {
    ...outputSize,
    sourceScale: {
      scaleX: sourceScale.scaleX,
      scaleY: sourceScale.scaleY
    },
    outputScale,
    downscaleRatio,
    downscaled: downscaleRatio < 1
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

export function getStitchPreviewTileLayout(
  input: StitchPreviewTileLayoutInput
): StitchPreviewTileLayout {
  const tileRect = getStitchDestinationPixelRect(
    input.destinationCssRect,
    input.outputScale
  );
  const sourceDisplayRect = getStitchDestinationPixelRect(
    input.viewportCropRect,
    input.outputScale
  );
  const imageLeft = normalizeSignedZero(-sourceDisplayRect.left);
  const imageTop = normalizeSignedZero(-sourceDisplayRect.top);
  const imageWidth = Math.round(
    input.captureViewportCssSize.clientWidth * input.outputScale.scaleX
  );
  const imageHeight = Math.round(
    input.captureViewportCssSize.clientHeight * input.outputScale.scaleY
  );

  return {
    tileRect,
    imageRect: rectFromEdges(
      imageLeft,
      imageTop,
      imageLeft + imageWidth,
      imageTop + imageHeight
    )
  };
}

function normalizeSignedZero(value: number): number {
  return Object.is(value, -0) ? 0 : value;
}

export async function stitchCapturedTiles(
  input: StitchCapturedTilesInput
): Promise<StitchCapturedTilesResult> {
  if (input.tiles.length === 0) {
    throw new Error("Full page stitching requires at least one captured tile.");
  }

  const firstImage = await loadImage(input.tiles[0].dataUrl);
  const sourceScale = getScaleFromImage(firstImage, input.tiles[0].captureViewportCssSize);
  const outputPlan = getStitchOutputPixelPlan(input.outputCssSize, sourceScale);
  const canvas = document.createElement("canvas");
  canvas.width = outputPlan.width;
  canvas.height = outputPlan.height;

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
      viewportCssSize: tile.captureViewportCssSize
    });

    if (!tileSourceRect) {
      throw new Error("Captured tile source rect is outside the viewport image.");
    }

    const destinationRect = getStitchDestinationPixelRect(
      tile.destinationCssRect,
      outputPlan.outputScale
    );

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
    outputWidth: outputPlan.width,
    outputHeight: outputPlan.height,
    drawnTiles,
    scale: outputPlan.sourceScale,
    sourceScale: outputPlan.sourceScale,
    outputScale: outputPlan.outputScale,
    downscaleRatio: outputPlan.downscaleRatio,
    downscaled: outputPlan.downscaled
  };
}

function getOutputDownscaleRatio(
  size: OutputPixelSize,
  limits: {
    readonly maxDimension: number;
    readonly maxArea: number;
  }
): number {
  const dimensionRatio = Math.min(
    1,
    limits.maxDimension / size.width,
    limits.maxDimension / size.height
  );
  const area = size.width * size.height;
  const areaRatio = area > limits.maxArea ? Math.sqrt(limits.maxArea / area) : 1;
  let ratio = Math.min(dimensionRatio, areaRatio);

  if (ratio >= 1) {
    return 1;
  }

  // Leave a tiny margin so integer rounding cannot push the canvas back over the limit.
  ratio *= 0.999999;

  return Math.max(Number.EPSILON, ratio);
}

function getRoundedOutputSize(
  outputCssSize: OutputCssSize,
  scale: StitchImageScale
): OutputPixelSize {
  return {
    width: Math.round(outputCssSize.width * scale.scaleX),
    height: Math.round(outputCssSize.height * scale.scaleY)
  };
}

function exceedsOutputLimits(
  size: OutputPixelSize,
  maxDimension: number,
  maxArea: number
): boolean {
  return (
    size.width > maxDimension ||
    size.height > maxDimension ||
    size.width * size.height > maxArea
  );
}

function getPositiveLimit(value: number | undefined, fallback: number, label: string): number {
  if (value === undefined) {
    return fallback;
  }

  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`Stitched screenshot ${label} must be positive.`);
  }

  return value;
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
