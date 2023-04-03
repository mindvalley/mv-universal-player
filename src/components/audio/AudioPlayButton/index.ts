import { registerComponent } from './../../../utils/plugins'
import type { App, Plugin } from 'vue-demi'

import AudioPlayButton from './AudioPlayButton.vue'

export default {
  install(app: App) {
    registerComponent(app, 'MVAudioPlayButton', AudioPlayButton)
  }
} as Plugin

export { AudioPlayButton as MVAudioPlayButton }
