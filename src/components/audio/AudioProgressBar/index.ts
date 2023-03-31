import { registerComponent } from './../../../utils/plugins'
import type { App, Plugin } from 'vue-demi'

import AudioProgressBar from './AudioProgressBar.vue'

export default {
  install(app: App) {
    registerComponent(app, AudioProgressBar)
  }
} as Plugin

export { AudioProgressBar as MVAudioProgressBar }
