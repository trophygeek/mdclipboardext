import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

/**
 * ARCHITECTURAL STRATEGY: THE GREAT WALL
 * * FINAL STATE:
 * - vendor-core: Strictly React and its immediate shims (193kB).
 * - vendor-heavy: All other dependencies (2.5MB).
 * - Result: Popup load reduced by >90% by ensuring the editor logic
 * never enters the popup's dependency graph.
 */
export default defineConfig({
  plugins: [react()],
  root: "src",
  publicDir: "../public", // Relative to root
  build: {
    outDir: "../dist/", // Relative to root
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "src/popup.html"),
        options: resolve(__dirname, "src/options.html"),
      },
      output: {
        // Entry points remain at root for manifest.json compatibility
        entryFileNames: `[name].js`,
        // Chunks and assets go to subdirectories
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,

        manualChunks(id) {
          // 1. THE CORE: Only React.
          // This is the ONLY shared library allowed in the popup context.
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/") ||
            id.includes("node_modules/scheduler/") ||
            id.includes("object-assign")
          ) {
            return "vendor-core";
          }

          // 2. THE WALL: Everything else from node_modules.
          // Consolidating all other libraries here prevents circular dependencies
          // and stops 'common' chunk leakage into the popup.
          if (id.includes("node_modules")) {
            return "vendor-heavy";
          }
        },
      },
    },
    // We increase this limit as vendor-heavy contains the massive mdxeditor.
    chunkSizeWarningLimit: 5000,
    minify: "esbuild",
    emptyOutDir: true,
  },
});
