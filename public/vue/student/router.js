import Vue from 'vue'
import Router from 'vue-router'

// const app = () => import('./app.vue')
// const personal = () => import('./page/personal/personal.vue')

import app from './app.vue'
import personal from './page/personal/personal.vue'

const Foo = { template: '<div>foo</div>' }


Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/student/personal'
    },
    {
      path: '/student/personal',
      component: personal
    },
  ]
})
