import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  root: "src",
  publicDir: false, // Don't duplicate public asset copying
  build: {
    outDir: "../dist",
    emptyOutDir: false, // DO NOT wipe popup's build out of dist/
    modulePreload: {
      polyfill: false,
    },
    rollupOptions: {
      input: {
        options: resolve(__dirname, "src/options.html"),
      },
      output: {
        entryFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`, // Directly put css in dist
        codeSplitting: false,
      },
    },
    chunkSizeWarningLimit: 5000,
    minify: "esbuild",
  },
});
