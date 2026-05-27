import { defineConfig, type Plugin } from "vite";
import manifest from "./manifest.json" with { type: "json" };

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
  plugins: [extensionManifest(), contentScriptWrapper()],
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
