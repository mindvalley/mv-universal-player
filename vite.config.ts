import { defineConfig, type ConfigEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import dts from 'vite-plugin-dts'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ command }: ConfigEnv) => {
  if (command === 'serve') {
    return {
      plugins: [vue()],
      resolve: {
        alias: {
          '@': fileURLToPath(new URL('./src', import.meta.url))
        }
      }
    }
  } else {
    return {
      plugins: [vue(), dts()],
      build: {
        lib: {
          entry: resolve(__dirname, 'src/index.ts'),
          name: 'MV Universal Player',
          fileName: 'mv-universal-player'
        },
        rollupOptions: {
          external: ['vue'],
          output: {
            globals: {
              vue: 'Vue'
            }
          }
        }
      }
    }
  }
})
