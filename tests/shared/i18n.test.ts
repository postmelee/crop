import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import {
  getCropMessage,
  getCropMessageNames,
  type CropI18nMessageName
} from "../../src/shared/i18n";

interface LocaleMessage {
  readonly message?: string;
  readonly placeholders?: Record<
    string,
    {
      readonly content?: string;
    }
  >;
}

interface TestChromeApi {
  readonly i18n: {
    getMessage(name: string, substitutions?: string | string[]): string;
  };
}

const testDir = fileURLToPath(new URL(".", import.meta.url));
const repoRoot = resolve(testDir, "../..");
const localeNames = ["en", "ko", "ja", "zh_CN"] as const;
const originalChrome = (globalThis as typeof globalThis & { chrome?: TestChromeApi }).chrome;

afterEach(() => {
  const globalWithChrome = globalThis as typeof globalThis & { chrome?: TestChromeApi };

  if (originalChrome) {
    globalWithChrome.chrome = originalChrome;
  } else {
    delete globalWithChrome.chrome;
  }
});

describe("extension i18n messages", () => {
  it("keeps every supported locale on the same message key set", () => {
    const defaultKeys = Object.keys(readLocaleMessages("en")).sort();

    expect(defaultKeys).toEqual([...getCropMessageNames()].sort());

    for (const locale of localeNames) {
      const messages = readLocaleMessages(locale);
      expect(Object.keys(messages).sort()).toEqual(defaultKeys);

      for (const key of defaultKeys) {
        expect(messages[key]?.message).toBeTruthy();
      }
    }
  });

  it("keeps placeholder names aligned with the default locale", () => {
    const defaultMessages = readLocaleMessages("en");

    for (const locale of localeNames) {
      const messages = readLocaleMessages(locale);

      for (const key of Object.keys(defaultMessages)) {
        expect(Object.keys(messages[key]?.placeholders ?? {}).sort()).toEqual(
          Object.keys(defaultMessages[key]?.placeholders ?? {}).sort()
        );
      }
    }
  });

  it("formats fallback messages when chrome.i18n is unavailable", () => {
    expect(getCropMessage("actionCopy")).toBe("Copy");
    expect(getCropMessage("actionTitleWithShortcut", ["Copy", "Ctrl+C"])).toBe("Copy (Ctrl+C)");
    expect(getCropMessage("resizeHandleLabel", "Top right")).toBe("Top right resize handle");
  });

  it("uses chrome.i18n messages when the extension API is available", () => {
    const calls: Array<{
      readonly name: string;
      readonly substitutions?: string | string[];
    }> = [];
    const globalWithChrome = globalThis as typeof globalThis & { chrome?: TestChromeApi };
    globalWithChrome.chrome = {
      i18n: {
        getMessage(name, substitutions) {
          calls.push({ name, substitutions });
          return name === "actionCopy" ? "Localized copy" : "";
        }
      }
    };

    expect(getCropMessage("actionCopy")).toBe("Localized copy");
    expect(getCropMessage("actionSave")).toBe("Save");
    expect(calls).toEqual([
      { name: "actionCopy", substitutions: undefined },
      { name: "actionSave", substitutions: undefined }
    ]);
  });

  it("passes placeholder substitutions to chrome.i18n before falling back", () => {
    const calls: Array<{
      readonly name: string;
      readonly substitutions?: string | string[];
    }> = [];
    const globalWithChrome = globalThis as typeof globalThis & { chrome?: TestChromeApi };
    globalWithChrome.chrome = {
      i18n: {
        getMessage(name, substitutions) {
          calls.push({ name, substitutions });
          return name === "actionTitleWithShortcut" ? "Localized shortcut" : "";
        }
      }
    };

    expect(getCropMessage("actionTitleWithShortcut", ["Copy", "Ctrl+C"])).toBe(
      "Localized shortcut"
    );
    expect(getCropMessage("resizeHandleLabel", "Top right")).toBe("Top right resize handle");
    expect(calls).toEqual([
      {
        name: "actionTitleWithShortcut",
        substitutions: ["Copy", "Ctrl+C"]
      },
      {
        name: "resizeHandleLabel",
        substitutions: ["Top right"]
      }
    ]);
  });
});

function readLocaleMessages(locale: (typeof localeNames)[number]): Record<CropI18nMessageName, LocaleMessage> {
  return JSON.parse(
    readFileSync(resolve(repoRoot, `_locales/${locale}/messages.json`), "utf8")
  ) as Record<CropI18nMessageName, LocaleMessage>;
}
