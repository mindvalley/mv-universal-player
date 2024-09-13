import { createApp } from 'vue'
import App from './App.vue'
import svgSprite from '@mindvalley/design-system/dist/icons/sprites/ui-icons.svg'
import { svgSpriteDirectivePlugin } from 'vue-svg-sprite'
import './assets/main.css'
import { tooltip } from './directives/tooltip'

const app = createApp(App)

app.use(svgSpriteDirectivePlugin, {
  url: svgSprite
})

app.directive('tooltip', tooltip)

app.mount('#app')
