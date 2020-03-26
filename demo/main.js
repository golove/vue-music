import Vue from 'vue'
import App from './Demo'
import axios from 'axios'
import Music from '../src'
Vue.use(Music)
//respone拦截器==>对响应做处理
axios.interceptors.response.use(
  response => {  //成功请求到数据
    console.log(response)
    if (response.status == 200) {
      return response.data
    } else {
      return "请求错误"
    }
  },
  error => {  //响应错误处理
    if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
      let originalRequest = error.config;
      return "error"

    }
  }
);
Vue.prototype.$axios = axios

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
