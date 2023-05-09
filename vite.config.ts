import { defineConfig, type ConfigEnv } from 'vite'
import createVuePlugin from '@vitejs/plugin-vue2'
import { resolve } from 'node:path'
import dts from 'vite-plugin-dts'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ command }: ConfigEnv) => {
  if (command === 'serve') {
    return {
      plugins: [createVuePlugin()],
      resolve: {
        alias: {
          '@': fileURLToPath(new URL('./src', import.meta.url))
        }
      }
    }
  } else {
    return {
      plugins: [createVuePlugin(), dts()],
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
            preserveModules: true,
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
