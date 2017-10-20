import Vue from 'vue'
import Router from 'vue-router'

// const app = () => import('./app.vue')
// const personal = () => import('./page/personal/personal.vue')

import app from './app.vue'

import app from './app.vue'
import home from './page/home/home.vue'
import publish from './page/publish/publish.vue'
import check from './page/check/check.vue'
import grade from './page/grade/grade.vue'
import personal from './page/personal/personal.vue'
import notFound from '../components/notFound.vue'


Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      component: home
    },
    {
      path: '/teacher/publish',
      component: publish
    },
    {
      path: '/teacher/check',
      component: check
    },
    {
      path: '/teacher/grade',
      component: grade
    },
    {
      path: '/teacher/personal',
      component: personal
    },
    ,
    {
      path: '*',
      component: notFound
    }
  ]
})
