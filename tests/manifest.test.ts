import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const testDir = fileURLToPath(new URL(".", import.meta.url));
const manifestPath = resolve(testDir, "../manifest.json");
const defaultLocaleMessagesPath = resolve(testDir, "../_locales/en/messages.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as {
  name?: string;
  description?: string;
  default_locale?: string;
  action?: {
    default_title?: string;
  };
  commands?: Record<
    string,
    {
      description?: string;
      suggested_key?: {
        default?: string;
        mac?: string;
      };
    }
  >;
};
const defaultLocaleMessages = JSON.parse(readFileSync(defaultLocaleMessagesPath, "utf8")) as Record<
  string,
  {
    message?: string;
  }
>;

describe("extension manifest", () => {
  it("uses Chrome extension i18n fields for user-facing metadata", () => {
    expect(manifest.default_locale).toBe("en");
    expect(manifest.name).toBe("__MSG_extensionName__");
    expect(manifest.description).toBe("__MSG_extensionDescription__");
    expect(manifest.action?.default_title).toBe("__MSG_extensionActionTitle__");
    expect(manifest.commands?.["open-crop"]?.description).toBe("__MSG_commandOpenCrop__");
  });

  it("defines every manifest i18n key in the default locale", () => {
    const messageKeys = collectManifestMessageKeys(manifest);

    expect(messageKeys).toEqual([
      "commandOpenCrop",
      "extensionActionTitle",
      "extensionDescription",
      "extensionName"
    ]);

    for (const key of messageKeys) {
      expect(defaultLocaleMessages[key]?.message).toBeTruthy();
    }
  });

  it("suggests Command+Shift+S as the macOS crop shortcut", () => {
    expect(manifest.commands?.["open-crop"]?.suggested_key).toEqual({
      default: "Ctrl+Shift+S",
      mac: "Command+Shift+S"
    });
  });
});

function collectManifestMessageKeys(value: unknown): string[] {
  const keys = new Set<string>();
  collectMessageKeys(value, keys);

  return [...keys].sort();
}

function collectMessageKeys(value: unknown, keys: Set<string>): void {
  if (typeof value === "string") {
    for (const match of value.matchAll(/__MSG_([A-Za-z0-9_]+)__/g)) {
      keys.add(match[1]);
    }
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectMessageKeys(item, keys);
    }
    return;
  }

  if (typeof value !== "object" || value === null) {
    return;
  }

  for (const item of Object.values(value)) {
    collectMessageKeys(item, keys);
  }
}
