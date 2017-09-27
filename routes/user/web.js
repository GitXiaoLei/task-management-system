'use strict'

const Output = require('../../middlewares/output')
const RBAC = require('../../middlewares/rbac')

const route = (app) => {
  /**
   * 首页
   */
  app.get('/', (req, res) => {
    console.log(req._role)
    // 游客
    if (typeof req._role === 'string' && req._role === 'guest') {
      Output.render('user/index', {
        title: '还没有登录'
      })
      return
    }
    // 超级管理员
    if (RBAC.isSuperAdmin(req._role)) {
      Output.render('admin/index')
      return
    }
    // 管理员
    if (RBAC.isAdmin(req._role)) {
      Output.render('admin/index')
      return
    }
    // 老师
    if (req._role[0] === 'teacher') {
      Output.render('user/index', {
        userInfo: req._userInfo,
        title: '老师，你已经登录了'
      })
    }
    // 学生
    if (req._role[0] === 'student') {
      Output.render('user/index', {
        userInfo: req._userInfo,
        title: '同学，你已经登录了'
      })
    }
  })
}

module.exports = route
