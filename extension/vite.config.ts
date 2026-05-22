import { defineConfig, type Plugin } from 'vite'
import { resolve } from 'path'
import { copyFileSync } from 'fs'

function copyManifest(): Plugin {
  return {
    name: 'copy-manifest',
    closeBundle() {
      copyFileSync('./manifest.json', './dist/manifest.json')
    },
  }
}

export default defineConfig({
  plugins: [copyManifest()],
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
