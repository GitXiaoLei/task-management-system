'use strict'

const Output = require('../../middlewares/output')
const RBAC = require('../../middlewares/rbac')
const User = require('../../models/user')
// const Async = require('async')

const route = (app) => {
  // 首页
  app.get('/', (req, res) => {
    // console.log(req._role)
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
      Output.render('user/teacher')
    }
    // 学生
    if (req._role[0] === 'student') {
      Output.render('user/student')
    }
  })
  // 老师个人中心页面
  app.get('/teacher/personal', async (req, res) => {
    // 没有登录
    if (!req._authInfo) {
      Output.apiErr({ code: 0, message: '请先登录' })
      return
    }
    // 权限控制
    if (!req._canVisit) {
      Output.apiErr({ code: 0, message: '你没有权限访问' })
      return
    }
    try {
      const userData = await User.getUserById(req._userInfo.user_id)
      const subjectsClasses = await User.getSubject(req._userInfo.user_id)
      const data = {
        userData: userData[0],
        subjectsClasses: subjectsClasses
      }
      Output.render('user/personal', data)
    } catch (e) {
      Output.apiErr(e)
    }
  })
  // 学生页面
  app.get('/student', async (req, res) => {
    // 没有登录
    if (!req._authInfo) {
      Output.apiErr({ code: 0, message: '请先登录' })
      return
    }
    // 权限控制
    if (!req._canVisit) {
      Output.apiErr({ code: 0, message: '你没有权限访问' })
      return
    }
    try {
      Output.render('user/student')
    } catch (e) {
      Output.apiErr(e)
    }
  })
  // 老师布置作业页面
  app.get('/teacher/publish_task', async (req, res) => {
     // 没有登录
    if (!req._authInfo) {
      Output.apiErr({ code: 0, message: '请先登录' })
      return
    }
    // 权限控制
    if (!req._canVisit) {
      Output.apiErr({ code: 0, message: '你没有权限访问' })
      return
    }
    try {
      const userData = await User.getUserById(req._userInfo.user_id)
      const subjects = await User.getSubjects(req._userInfo.user_id)
      Output.render('user/publish_task', {
        userData: userData[0],
        subjects: subjects
      })
    } catch (e) {
      Output.apiErr(e)
    }
  })
}

module.exports = route
