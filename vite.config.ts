import { fileURLToPath, URL } from 'node:url'

import { build, defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // treat all tags with a dash as custom elements
          isCustomElement: (tag) => tag.includes('-')
        }
      }
    })
  ],
  build: {
    lib: {
      entry: './src/main.ts',
      name: 'mv-universal-player',
      // the proper extensions will be added
      fileName: 'mv-universal-player'
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
