import type { App, Component, Plugin } from 'vue-demi'

export const registerPlugin = (app: App, plugin: Plugin) => {
  app.use(plugin)
}

export const registerComponent = (app: App, name: string, component: Component) => {
  console.log('register ----')
  console.log(name)
  app.component(name, component)
}
