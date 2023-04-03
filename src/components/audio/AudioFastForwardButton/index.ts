import { registerComponent } from './../../../utils/plugins'
import type { App, Plugin } from 'vue-demi'

import AudioFastForwardButton from './AudioFastForwardButton.vue'

export default {
  install(app: App) {
    registerComponent(app, 'MVAudioFastForwardButton', AudioFastForwardButton)
  }
} as Plugin

export { AudioFastForwardButton as MVAudioFastForwardButton }
