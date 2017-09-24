'use strict'

const Output = require('../../middlewares/output')
const RBAC = require('../../middlewares/rbac')

const route = (app) => {
  /**
   * 首页
   */
  app.get('/', (req, res) => {
    console.log('请求了首页')
    console.log(req._role)
    // 游客
    if (typeof req._role === 'string' && req._role === 'guest') {
      Output.render('user/index')
      return
    }
    // 超级管理员
    if (RBAC.isSuperAdmin(req._role)) {
      Output.render('admin/index')
      return
    }
    // 管理员
    if (RBAC.isAdmin(req._role)) {
      Output.apiData('你仅仅是管理员哦~')
    }
    Output.apiData('你是老师或学生')
    // if(!req._canVisit) {
    //     Output.apiErr({ code: 0, message: '你没有权限访问该资源' });
    // }
    // Output.apiData({}, '你有权限访问该资源');
  })
}

module.exports = route
