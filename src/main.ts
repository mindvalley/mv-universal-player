import { createApp } from 'vue'
import App from './App.vue'
// import svgSprite from '@mindvalley/design-system/dist/svg-sprite/svg-defs.svg'
// import { svgSpriteDirectivePlugin } from 'vue-svg-sprite'

const app = createApp(App)
// app.use(svgSpriteDirectivePlugin, {
//   url: svgSprite
// })

app.mount('#app')
