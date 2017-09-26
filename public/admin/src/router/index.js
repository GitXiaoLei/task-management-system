import Vue from 'vue'
import Router from 'vue-router'

// const User = r => require.ensure([], () => r(require('@/components/user.vue')), 'User')
// const Role = r => require.ensure([], () => r(require('@/components/role.vue')), 'Role')
// const NotFound = r => require.ensure([], () => r(require('@/components/404.vue')), 'NotFound')
// const Access = r => require.ensure([], () => r(require('@/components/access.vue')), 'Access')
// const Department = r => require.ensure([], () => r(require('@/components/department.vue')), 'Department')
// const Subject = r => require.ensure([], () => r(require('@/components/subject.vue')), 'Subject')

// const User = () => import('@/components/user.vue').then(m => m.default)
// const Role = () => import('@/components/role.vue').then(m => m.default)
// const NotFound = () => import('@/components/404.vue').then(m => m.default)
// const Access = () => import('@/components/access.vue').then(m => m.default)
// const Department = () => import('@/components/department.vue').then(m => m.default)
// const Subject = () => import('@/components/subject.vue').then(m => m.default)

import User from '@/components/user.vue'
import Role from '@/components/role.vue'
import NotFound from '@/components/404.vue'
import Access from '@/components/access.vue'
import Department from '@/components/department.vue'
import Subject from '@/components/subject.vue'

Vue.use(Router)
export default new Router({
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
    {
      path: '/admin/subject',
      component: Subject
    },
    // 404
    { path: '*', component: NotFound }
  ]
})
