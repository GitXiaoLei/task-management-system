// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUi from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import axios from 'axios'
Vue.config.productionTip = false
Vue.use(ElementUi)
Vue.prototype.Axios = axios
// 开发时的请求地址：跨域地址
const DEV_URL = 'http://localhost:3000'
// 生产时的请求地址：没有跨域
/* eslint-disable no-unused-vars */
const PRO_URL = ''

Vue.prototype.MAIN_URL = DEV_URL

Vue.prototype.Axios.default.baseURL = 'http://localhost:3000'
Vue.prototype.Axios.default.withCredentials = true
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
