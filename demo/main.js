import Vue from 'vue'
import App from './Demo'
import axios from 'axios'
import Music from '../src'
Vue.use(Music)
Vue.prototype.$axios = axios

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
