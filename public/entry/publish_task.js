import Vue from 'vue'
import App from '../vue/publish_task/publish_task.vue'

import './common'
import 'simplemde/dist/simplemde.min.css'
import SimpleMDE from 'simplemde'
import iView from 'iview'
import 'iview/dist/styles/iview.css'

import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

Vue.use(mavonEditor)
Vue.use(iView)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
