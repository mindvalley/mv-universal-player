import * as components from './components'
import './assets/main.css'
import svgSprite from '@mindvalley/design-system/dist/icons/sprites/ui-icons.svg'
import { svgSpriteDirectivePlugin } from 'vue-svg-sprite'
import FloatingVue from 'floating-vue'

import type { App } from 'vue-demi'

const defaultComponents: any = components
export interface MVUniversalPlayerOptions {
  svgSpriteOptions: {
    url: string
  }
}

const MVUniversalPlayer = {
  install(app: App, options: MVUniversalPlayerOptions) {
    app.use(FloatingVue, {
      disabled: window.innerWidth < 1280,
      themes: {
        tooltip: {
          triggers: ['hover', 'click', 'focus', 'touch']
        }
      }
    })

    app.use(svgSpriteDirectivePlugin, {
      url: options?.svgSpriteOptions?.url ?? svgSprite
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
  MVAudioPreviewCard,
  MVAudioRewindButton,
  MVAudioResource,
  MVAudioDescription,
  MVMeditationMixer,
  MVMeditationTrackItem,
  MVMeditationVolumeSlider,
  MVCarousel,
  MVCarouselSlide,
  MVVideoPlayer,
  MVVideoItem,
  MVVideoMakerItem,
  MVVideoResource,
  MVVideoControls,
  MVVideoDescription,
  MVSoundscapeResource,
  MVMeditationResource
} from './components'
