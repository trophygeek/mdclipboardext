import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

/**
 * ARCHITECTURAL STRATEGY: THE GREAT WALL (FINAL OPTIMIZED VERSION)
 * * 1. THE CORE:
 * Isolates React and its absolute prerequisites into 'vendor-core'.
 * This is the only 3rd-party code shared between the popup and options.
 * * 2. THE WALL:
 * Forces all other heavy libraries (@mdxeditor, @emotion, radix, etc.)
 * into 'vendor-heavy'. Since the popup does not import these,
 * the popup's footprint remains ~200KB instead of 2.5MB+.
 * * 3. POLYFILL REMOVAL:
 * Disables the modulepreload polyfill. Modern Chrome supports this
 * natively, removing dead weight and an unnecessary JS file from the build.
 */
export default defineConfig({
  plugins: [react()],
  root: "src",
  publicDir: "../public", // Relative to root
  build: {
    outDir: "../dist/", // Relative to root

    // Modern Chrome optimization: Remove unnecessary polyfill
    modulePreload: {
      polyfill: false,
    },

    rollupOptions: {
      input: {
        popup: resolve(__dirname, "src/popup.html"),
        options: resolve(__dirname, "src/options.html"),
      },
      output: {
        // Entry points remain at root for manifest.json compatibility
        entryFileNames: `[name].js`,
        // Chunks and assets go to subdirectories to keep the dist root clean
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,

        manualChunks(id) {
          // A. THE CORE: Only the framework.
          // This keeps the popup startup time near-instant.
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/") ||
            id.includes("node_modules/scheduler/") ||
            id.includes("object-assign")
          ) {
            return "vendor-core";
          }

          // B. THE WALL: Everything else from node_modules.
          // By eliminating the 'common' bucket, we prevent Rollup from
          // bridging the heavy editor logic into the popup's context.
          if (id.includes("node_modules")) {
            return "vendor-heavy";
          }
        },
      },
    },
    // High limit acknowledged for the heavy editor chunk
    chunkSizeWarningLimit: 5000,
    minify: "esbuild",
    emptyOutDir: true,
  },
});
