import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const testDir = fileURLToPath(new URL(".", import.meta.url));
const manifestPath = resolve(testDir, "../manifest.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as {
  commands?: Record<
    string,
    {
      suggested_key?: {
        default?: string;
        mac?: string;
      };
    }
  >;
};

describe("extension manifest", () => {
  it("suggests Command+Shift+S as the macOS crop shortcut", () => {
    expect(manifest.commands?.["open-crop"]?.suggested_key).toEqual({
      default: "Ctrl+Shift+S",
      mac: "Command+Shift+S"
    });
  });
});
