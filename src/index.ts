import type { App } from 'vue'
import * as plugins from './components/plugins'
import { registerPlugin } from './utils/plugins'

const MVUniversalPlayer = {
  install: (app: App) => {
    for (const componentKey in plugins) {
      console.log('key ---------')
      console.log(componentKey)
      registerPlugin(app, (plugins as any)[componentKey])
    }
  }
}

export default MVUniversalPlayer
// export all vue components
export * from './components'
// export all components as vue plugin
export * from './components/plugins'
