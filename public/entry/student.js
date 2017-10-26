import Vue from 'vue'
import App from '../vue/student/app.vue'
import router from '../vue/student/router.js'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import '../common/style/common.scss'

// markdown
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
Vue.use(mavonEditor)

Vue.use(iView)
// 加载进度条
router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  next()
})
router.afterEach(route => {
  iView.LoadingBar.finish()
})

Vue.config.productionTip = false

new Vue({
  router,
  render: (createElement) => createElement(App)
}).$mount('#app')
