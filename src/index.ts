import * as components from './components'
import '@/assets/main.css'

import type { App } from 'vue-demi'
const defaultComponents: any = components
const MVUniversalPlayer = {
  install(app: App) {
    Object.keys(defaultComponents).forEach((name) => {
      app.component(name, defaultComponents[name])
    })
  }
}

export default MVUniversalPlayer

export {
  MVAudioPlayer,
  MVAudioFastForwardButton,
  MVAudioItem,
  MVAudioPlayButton,
  MVAudioProgressBar,
  MVAudioRewindButton,
  MVAudioResource,
  MVAuthorDetails
} from './components'
