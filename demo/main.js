import Vue from 'vue'
import App from './Demo'
import Music from '../src'
Vue.use(Music)



Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
