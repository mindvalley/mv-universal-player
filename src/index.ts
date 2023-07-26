import * as components from './components'
import './assets/main.css'
import svgSprite from '@mindvalley/design-system/dist/svg-sprite/svg-defs.svg'
import SvgSprite from 'vue-svg-sprite'

import type { App } from 'vue-demi'

const defaultComponents: any = components
const MVUniversalPlayer = {
  install(app: App) {
    app.use(SvgSprite, {
      url: svgSprite
    })

    Object.keys(defaultComponents).forEach((name) => {
      app.component(name, defaultComponents[name])
    })
  }
}

export default MVUniversalPlayer
export { useDetectBrowser } from './composables/use-detect-browser'
export { useGlobal } from './composables/use-global'

export {
  MVAudioPlayer,
  MVAudioFastForwardButton,
  MVAudioItem,
  MVAudioPlayButton,
  MVAudioProgressBar,
  MVAudioRewindButton,
  MVAudioResource,
  MVAudioDescription,
  MVMeditationMixer,
  MVMeditationTrackItem,
  MVMeditationVolumeSlider,
  MVCarousel,
  MVCarouselSlide
} from './components'
