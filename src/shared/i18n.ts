import fallbackMessages from "../../_locales/en/messages.json" with { type: "json" };

interface CropI18nMessage {
  readonly message: string;
  readonly description?: string;
  readonly placeholders?: Record<
    string,
    {
      readonly content: string;
      readonly example?: string;
    }
  >;
}

interface CropI18nChromeApi {
  readonly i18n?: {
    getMessage(name: string, substitutions?: string | string[]): string;
  };
}

type CropI18nFallbackMessages = typeof fallbackMessages;

export type CropI18nMessageName = keyof CropI18nFallbackMessages;
export type CropI18nSubstitutions = string | readonly string[];

const FALLBACK_MESSAGES = fallbackMessages as Record<CropI18nMessageName, CropI18nMessage>;

export function getCropMessage(
  name: CropI18nMessageName,
  substitutions?: CropI18nSubstitutions
): string {
  const chromeMessage = getChromeMessage(name, substitutions);

  if (chromeMessage.length > 0) {
    return chromeMessage;
  }

  return formatFallbackMessage(FALLBACK_MESSAGES[name], substitutions);
}

export function getCropMessageNames(): readonly CropI18nMessageName[] {
  return Object.keys(FALLBACK_MESSAGES) as CropI18nMessageName[];
}

function getChromeMessage(
  name: CropI18nMessageName,
  substitutions?: CropI18nSubstitutions
): string {
  const chromeApi = (globalThis as typeof globalThis & { chrome?: CropI18nChromeApi }).chrome;

  if (!chromeApi?.i18n?.getMessage) {
    return "";
  }

  try {
    const normalizedSubstitutions = normalizeSubstitutions(substitutions);
    const message = chromeApi.i18n.getMessage(
      name,
      normalizedSubstitutions.length > 0 ? normalizedSubstitutions : undefined
    );

    return typeof message === "string" ? message : "";
  } catch {
    return "";
  }
}

function formatFallbackMessage(
  message: CropI18nMessage,
  substitutions?: CropI18nSubstitutions
): string {
  const normalizedSubstitutions = normalizeSubstitutions(substitutions);
  const placeholders = message.placeholders ?? {};

  return message.message.replace(/\$([A-Za-z0-9_]+)\$/g, (match, placeholderName: string) => {
    const placeholder = placeholders[placeholderName];

    if (!placeholder) {
      return match;
    }

    const substitutionIndex = getSubstitutionIndex(placeholder.content);

    if (substitutionIndex === null) {
      return placeholder.content;
    }

    return normalizedSubstitutions[substitutionIndex] ?? "";
  });
}

function normalizeSubstitutions(substitutions?: CropI18nSubstitutions): string[] {
  if (substitutions === undefined) {
    return [];
  }

  return typeof substitutions === "string" ? [substitutions] : [...substitutions];
}

function getSubstitutionIndex(content: string): number | null {
  const match = /^\$(\d+)$/.exec(content);

  if (!match) {
    return null;
  }

  return Number(match[1]) - 1;
}
