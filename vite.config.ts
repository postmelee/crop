import { defineConfig, type Plugin } from "vite";
import enMessages from "./_locales/en/messages.json" with { type: "json" };
import jaMessages from "./_locales/ja/messages.json" with { type: "json" };
import koMessages from "./_locales/ko/messages.json" with { type: "json" };
import zhCnMessages from "./_locales/zh_CN/messages.json" with { type: "json" };
import manifest from "./manifest.json" with { type: "json" };

const localeMessages = [
  ["en", enMessages],
  ["ko", koMessages],
  ["ja", jaMessages],
  ["zh_CN", zhCnMessages]
] as const;

function extensionManifest(): Plugin {
  return {
    name: "crop-extension-manifest",
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "manifest.json",
        source: `${JSON.stringify(manifest, null, 2)}\n`
      });
    }
  };
}

function extensionLocales(): Plugin {
  return {
    name: "crop-extension-locales",
    generateBundle() {
      for (const [locale, messages] of localeMessages) {
        this.emitFile({
          type: "asset",
          fileName: `_locales/${locale}/messages.json`,
          source: `${JSON.stringify(messages, null, 2)}\n`
        });
      }
    }
  };
}

function contentScriptWrapper(): Plugin {
  return {
    name: "crop-content-script-wrapper",
    renderChunk(code, chunk) {
      if (chunk.name !== "content/inject") {
        return null;
      }

      // Keep a stable marker after minification so wrapper checks do not rely on formatting.
      return {
        code: `(() => {\n"content/inject";\n${code}\n})();\n`,
        map: null
      };
    }
  };
}

export default defineConfig({
  plugins: [extensionManifest(), extensionLocales(), contentScriptWrapper()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        "background/service-worker": "src/background/service-worker.ts",
        "content/inject": "src/content/inject.ts"
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name][extname]"
      }
    }
  }
});
