'use strict'

const RBAC = require('../../middlewares/rbac')
const User = require('../../models/user')

const route = (app) => {
  // 首页
  app.get('/', (req, res) => {
    // 游客
    if (typeof req._role === 'string' && req._role === 'guest') {
      res.render('user/index', {
        title: '还没有登录'
      })
      return
    }
    // 超级管理员
    if (RBAC.isSuperAdmin(req._role)) {
      res.render('admin/index')
      return
    }
    // 管理员
    if (RBAC.isAdmin(req._role)) {
      res.render('admin/index')
      return
    }
    // 老师
    if (req._role[0] === 'teacher') {
      res.render('user/teacher')
    }
    // 学生
    if (req._role[0] === 'student') {
      res.render('user/student')
    }
  })
  // 老师个人中心页面
  app.get('/teacher/personal', async (req, res) => {
    // 没有登录
    if (!req._authInfo) {
      res.apiErr({ code: 0, message: '请先登录' })
      return
    }
    // 权限控制
    if (!req._canVisit) {
      res.apiErr({ code: 0, message: '你没有权限访问' })
      return
    }
    try {
      const userData = await User.getUserById(req._userInfo.user_id)
      delete userData.password
      const subjectsClasses = await User.getSubject(req._userInfo.user_id)
      const data = {
        userData: userData[0],
        subjectsClasses: subjectsClasses
      }
      res.render('user/personal', data)
    } catch (e) {
      res.apiErr(e)
    }
  })
  // 学生页面
  app.get('/student', async (req, res) => {
    // 没有登录
    if (!req._authInfo) {
      res.apiErr({ code: 0, message: '请先登录' })
      return
    }
    // 权限控制
    if (!req._canVisit) {
      res.apiErr({ code: 0, message: '你没有权限访问' })
      return
    }
    try {
      res.render('user/student')
    } catch (e) {
      res.apiErr(e)
    }
  })
  // 老师布置作业页面
  app.get('/teacher/publish_task', async (req, res) => {
     // 没有登录
    if (!req._authInfo) {
      res.apiErr({ code: 0, message: '请先登录' })
      return
    }
    // 权限控制
    if (!req._canVisit) {
      res.apiErr({ code: 0, message: '你没有权限访问' })
      return
    }
    try {
      const userData = await User.getUserById(req._userInfo.user_id)
      const subjects = await User.getSubjects(req._userInfo.user_id)
      res.render('user/publish_task', {
        userData: userData[0],
        subjects: subjects
      })
    } catch (e) {
      res.apiErr(e)
    }
  })
}

module.exports = route
