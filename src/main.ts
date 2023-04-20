import Vue from 'vue'
import App from './App.vue'
import svgSprite from '@mindvalley/design-system/dist/svg-sprite/svg-defs.svg'
import SvgSprite from 'vue-svg-sprite'
import '@/assets/main.css'

Vue.use(SvgSprite, {
  url: svgSprite
})
new Vue({
  render: (h) => h(App)
}).$mount('#app')
