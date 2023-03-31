import { registerComponent } from './../../../utils/plugins'
import type { App, Plugin } from 'vue-demi'

import AudioItem from './AudioItem.vue'

export default {
  install(app: App) {
    registerComponent(app, AudioItem)
  }
} as Plugin

export { AudioItem as MVAudioItem }
