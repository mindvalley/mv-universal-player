import { registerComponent } from './../../../utils/plugins'
import type { App, Plugin } from 'vue-demi'

import AudioPlayer from './AudioPlayer.vue'

export default {
  install(app: App) {
    console.log('register mv audio player ----')
    registerComponent(app, 'MVAudioPlayer', AudioPlayer)
  }
} as Plugin

export { AudioPlayer as MVAudioPlayer }
