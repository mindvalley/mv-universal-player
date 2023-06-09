import type { Preview } from '@storybook/vue'
import './../public/assets/main.css'
import Vue from 'vue'
import svgSprite from '@mindvalley/design-system/dist/svg-sprite/svg-defs.svg'
import SvgSprite from 'vue-svg-sprite'

Vue.use(SvgSprite, {
  url: svgSprite
})

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^[A-Z]*.*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/
      }
    }
  }
}

export default preview
