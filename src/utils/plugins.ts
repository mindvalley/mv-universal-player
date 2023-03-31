import type { App, Component, Plugin } from 'vue-demi'

export const registerPlugin = (app: App, plugin: Plugin) => {
  app.use(plugin)
}

export const registerComponent = (app: App, component: Component) => {
  app.component(component.name || '', component)
}
