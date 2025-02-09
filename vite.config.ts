import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: 'src',
  publicDir: '../public', // relative to root
  build: {
    outDir: '../dist/', // relative to root
    rollupOptions: {
      input: {
//        background: resolve(__dirname, 'src/background.ts'),
        popup: resolve(__dirname, 'src/popup.html'),
        options: resolve(__dirname, 'src/options.html'),
//        content: resolve(__dirname, 'src/content.ts'),
      },
      output: {
        entryFileNames: `[name].js`, //  Output filenames directly to dist
        chunkFileNames: `[name].js`, //  Output filenames directly to dist
        assetFileNames: `[name].[ext]`, // Keep original extension for assets
      },
    },
    emptyOutDir: true,
  },
})
