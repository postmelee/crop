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

export default defineConfig({
  plugins: [extensionManifest()],
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
