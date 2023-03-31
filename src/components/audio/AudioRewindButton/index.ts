import { registerComponent } from './../../../utils/plugins'
import type { App, Plugin } from 'vue-demi'

import AudioRewindButton from './AudioRewindButton.vue'

export default {
  install(app: App) {
    registerComponent(app, AudioRewindButton)
  }
} as Plugin

export { AudioRewindButton as MVAudioRewindButton }
