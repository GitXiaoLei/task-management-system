import Vue from 'vue'
import Router from 'vue-router'

const User = r => require.ensure([], () => r(require('@/components/user.vue')), 'User')
const Role = r => require.ensure([], () => r(require('@/components/role.vue')), 'Role')
const NotFound = r => require.ensure([], () => r(require('@/components/404.vue')), 'NotFound')
const Access = r => require.ensure([], () => r(require('@/components/access.vue')), 'Access')
const Department = r => require.ensure([], () => r(require('@/components/department.vue')), 'Department')

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
      component: User
    },
    {
      path: '/admin/role',
      component: Role
    },
    {
      path: '/admin/access',
      component: Access
    },
    {
      path: '/admin/department',
      component: Department
    },
    // 404
    { path: '*', component: NotFound }
  ]
})
