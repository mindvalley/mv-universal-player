import { Preview, setup } from '@storybook/vue3'
import FloatingVue from 'floating-vue'
import './../public/assets/main.css'
import svgSprite from '@mindvalley/design-system/dist/icons/sprites/ui-icons.svg'
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
  app.use(FloatingVue, {
    disabled: window.innerWidth < 1280,
    themes: {
      tooltip: {
        triggers: ['hover', 'click', 'focus', 'touch']
      }
    }
  })
})

export default preview
