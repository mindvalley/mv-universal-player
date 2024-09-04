import { createApp } from 'vue'
import App from './App.vue'
import svgSprite from '@mindvalley/design-system/dist/svg-sprite/svg-defs.svg'
import SvgSprite from 'vue-svg-sprite'
import './../public/assets/main.css'

const app = createApp(App)

app.use(SvgSprite, {
  url: svgSprite
})

app.mount('#app')
