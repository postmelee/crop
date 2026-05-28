const DEFAULT_FALLBACK_PREFIX = "crop-screenshot";
const DEFAULT_MAX_BASE_LENGTH = 120;
const PNG_EXTENSION = ".png";
const RESERVED_WINDOWS_BASENAMES = new Set([
  "CON",
  "PRN",
  "AUX",
  "NUL",
  "COM1",
  "COM2",
  "COM3",
  "COM4",
  "COM5",
  "COM6",
  "COM7",
  "COM8",
  "COM9",
  "LPT1",
  "LPT2",
  "LPT3",
  "LPT4",
  "LPT5",
  "LPT6",
  "LPT7",
  "LPT8",
  "LPT9"
]);

export interface CreatePngFilenameOptions {
  readonly fallbackPrefix?: string;
  readonly maxBaseLength?: number;
  readonly now?: Date;
}

export interface SanitizePngFilenameOptions {
  readonly fallbackBaseName?: string;
  readonly maxBaseLength?: number;
}

export function createPngFilename(
  title: string | null | undefined,
  options: CreatePngFilenameOptions = {}
): string {
  const fallbackPrefix = options.fallbackPrefix ?? DEFAULT_FALLBACK_PREFIX;
  const fallbackBaseName = `${fallbackPrefix}-${formatPngFilenameTimestamp(
    options.now ?? new Date()
  )}`;

  return sanitizePngFilename(title ?? "", {
    fallbackBaseName,
    maxBaseLength: options.maxBaseLength
  });
}

export function sanitizePngFilename(
  input: string,
  options: SanitizePngFilenameOptions = {}
): string {
  const maxBaseLength = Math.max(1, options.maxBaseLength ?? DEFAULT_MAX_BASE_LENGTH);
  const fallbackBaseName = options.fallbackBaseName ?? DEFAULT_FALLBACK_PREFIX;
  let baseName = sanitizeBaseName(input);

  if (!baseName) {
    baseName = sanitizeBaseName(fallbackBaseName) || DEFAULT_FALLBACK_PREFIX;
  }

  if (isReservedWindowsBaseName(baseName)) {
    baseName = `${baseName}-file`;
  }

  baseName = trimUnsafeFilenameEdges(baseName.slice(0, maxBaseLength));

  if (!baseName || isReservedWindowsBaseName(baseName)) {
    baseName = DEFAULT_FALLBACK_PREFIX.slice(0, maxBaseLength);
  }

  return `${baseName}${PNG_EXTENSION}`;
}

export function formatPngFilenameTimestamp(date: Date): string {
  return [
    String(date.getUTCFullYear()).padStart(4, "0"),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0"),
    "-",
    String(date.getUTCHours()).padStart(2, "0"),
    String(date.getUTCMinutes()).padStart(2, "0"),
    String(date.getUTCSeconds()).padStart(2, "0")
  ].join("");
}

function sanitizeBaseName(input: string): string {
  const cleaned = input
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/[<>:"/\\|?*]+/g, " ")
    .replace(/\s+/g, " ");
  const withoutPngExtension = trimUnsafeFilenameEdges(cleaned).replace(
    /(?:\s*\.png)+$/gi,
    ""
  );

  return trimUnsafeFilenameEdges(withoutPngExtension);
}

function trimUnsafeFilenameEdges(input: string): string {
  return input.trim().replace(/^[. ]+/, "").replace(/[. ]+$/, "");
}

function isReservedWindowsBaseName(input: string): boolean {
  return RESERVED_WINDOWS_BASENAMES.has(input.toUpperCase());
}
