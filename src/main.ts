import { createApp } from 'vue-demi'
import App from './App.vue'
import svgSprite from '@mindvalley/design-system/dist/icons/sprites/ui-icons.svg'
import { svgSpriteDirectivePlugin } from 'vue-svg-sprite'
import FloatingVue from 'floating-vue'
import './assets/main.css'
import 'floating-vue/dist/style.css'

const app = createApp(App)
app.use(svgSpriteDirectivePlugin, {
  url: svgSprite
})

app.use(FloatingVue, {
  disabled: window.innerWidth < 768,
  themes: {
    tooltip: {
      triggers: ['hover', 'click', 'focus', 'touch']
    }
  }
})

app.mount('#app')
