import { defineConfig, type Plugin } from "vite";

const phase0Entry = "virtual:crop-phase0-entry";
const resolvedPhase0Entry = `\0${phase0Entry}`;

function phase0Entrypoint(): Plugin {
  return {
    name: "crop-phase0-entrypoint",
    resolveId(id) {
      if (id === phase0Entry) {
        return resolvedPhase0Entry;
      }

      return null;
    },
    load(id) {
      if (id === resolvedPhase0Entry) {
        return "export {};";
      }

      return null;
    },
    generateBundle(_options, bundle) {
      for (const fileName of Object.keys(bundle)) {
        delete bundle[fileName];
      }
    }
  };
}

export default defineConfig({
  plugins: [phase0Entrypoint()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: phase0Entry,
      output: {
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name][extname]"
      }
    }
  }
});
