import Vue from 'vue'
import App from '../vue/student/app.vue'
import router from '../vue/student/router.js'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
// import '../my-theme/index.less'
import '../common/style/common.scss'

Vue.use(iView)
Vue.config.productionTip = false

new Vue({
  router,
  render: (createElement) => createElement(App)
}).$mount('#app')
