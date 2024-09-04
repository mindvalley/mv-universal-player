import { Preview, setup } from '@storybook/vue3'
import './../public/assets/main.css'
import svgSprite from '@mindvalley/design-system/dist/svg-sprite/svg-defs.svg'
import { svgSpriteDirectivePlugin } from 'vue-svg-sprite'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  }
}

setup((app) => {
  app.use(svgSpriteDirectivePlugin, {
    url: svgSprite
  })
})

export default preview
