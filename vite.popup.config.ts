import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  root: "src",
  publicDir: "../public", // Copy static assets in the first pass
  build: {
    outDir: "../dist",
    emptyOutDir: true, // Wipe dist/ before starting
    modulePreload: {
      polyfill: false,
    },
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "src/popup.html"),
      },
      output: {
        entryFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`, // Directly put css in dist
        codeSplitting: false,
      },
    },
    minify: "esbuild",
  },
});
