import { defineConfig, type Plugin } from 'vite'
import { resolve } from 'path'
import { copyFileSync, cpSync } from 'fs'

function copyStatic(): Plugin {
  return {
    name: 'copy-static',
    closeBundle() {
      copyFileSync('./manifest.json', './dist/manifest.json')
      cpSync('./icons', './dist/icons', { recursive: true })
    },
  }
}

export default defineConfig({
  plugins: [copyStatic()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        background: resolve(__dirname, 'src/background.ts'),
        'content-script': resolve(__dirname, 'src/content-script.ts'),
        popup: resolve(__dirname, 'src/popup/popup.html'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
    },
  },
})
