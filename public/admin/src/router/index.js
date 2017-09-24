import Vue from 'vue'
import Router from 'vue-router'
import user from '@/components/user'
import role from '@/components/role'
import notFound from '@/components/404'
// import app from '../App'
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/admin/user'
    },
    {
      path: '/admin',
      redirect: '/admin/user'
    },
    {
      path: '/admin/user',
      component: user
    },
    {
      path: '/admin/role',
      component: role
    },
    // 404
    { path: '*', component: notFound }
  ]
})
