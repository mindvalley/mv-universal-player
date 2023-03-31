import { registerComponent } from './../../../utils/plugins'
import type { App, Plugin } from 'vue-demi'

import AudioPlayer from './AudioPlayer.vue'

export default {
  install(app: App) {
    registerComponent(app, AudioPlayer)
  }
} as Plugin

export { AudioPlayer as MVAudioPlayer }
