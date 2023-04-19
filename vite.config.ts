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
      optimizeDeps: {
        exclude: ['vue-demi']
      },
      build: {
        lib: {
          entry: resolve(__dirname, 'src/index.ts'),
          formats: ['es', 'cjs'],
          name: 'MV Universal Player',
          fileName: (format) => `mv-universal-player.${format}.js`
        },
        rollupOptions: {
          external: ['vue', 'vue-demi'],
          output: {
            preserveModules: false,
            exports: 'named',
            globals: {
              vue: 'Vue'
            }
          }
        }
      }
    }
  }
})
