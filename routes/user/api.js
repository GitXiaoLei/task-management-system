'use strict'

const Auth = require('../../middlewares/auth')
const User = require('../../models/user')
const Moment = require('moment')
const Output = require('../../middlewares/output')

const route = (app) => {
  // 用户登录
  app.post('/login', (req, res) => {
    const username = req.body.username
    const password = req.body.password
    User
    .getOne(username)
    .then((userData) => {
      // 在数据库中没有找到该用户
      if (!userData) {
        Output.apiErr({ code: 0, message: '用户名或密码错误' })
      }
      // 密码不正确
      if (userData.password !== password) {
        Output.apiErr({ code: 0, message: '用户名或密码错误' })
      }
      const token = Auth.generateToken(userData.user_id)
      // 将token放在cookie里
      Output.cookie('authorization', token, new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))
      Output.apiData({}, '登录成功')
    })
    .catch((err) => {
      Output.apiErr(err)
    })
  })
  // 退出登录
  app.get('/loginout', (req, res) => {
    // 将token设置为空
    Output.cookie('authorization', '', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))
    Output.apiData({}, '退出成功')
  })
  // 老师添加自己所教的科目
  app.post('/api/teacher_subject/add', (req, res) => {
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
    const insertData = {
      user_id: req.body.user_id,
      subject_id: req.body.subject_id,
      created_time: Moment().unix()
    }
    User
    .addTeacherSubject(insertData)
    .then((result) => {
      Output.apiData(result, '添加科目成功')
    })
    .catch((err) => {
      Output.apiErr(err)
    })
  })
  // 老师为自己的某个科目添加班级
  app.post('/api/subject_class/add', (req, res) => {
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
    const insertData = {
      subject_id: req.body.subject_id,
      class_id: req.body.class_id,
      created_time: Moment().unix()
    }
    User
    .addSubjectClass(insertData)
    .then((result) => {
      Output.apiData(result, '添加班级成功')
    })
    .catch((err) => {
      Output.apiErr(err)
    })
  })
  // 老师删除自己所教的科目,同时也要删除subject_class表中对应的记录
  app.post('/api/teacher_subject/del', async (req, res) => {
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
    const conditions = { teacher_subject_id: req.body.teacher_subject_id }
    try {
      // 获取teacher_subject表中的记录
      const teacherSubjectArr = await User.getTeacherSubjectById(conditions)
      const subjectIdArr = []
      teacherSubjectArr.forEach((teacherSubject) => {
        subjectIdArr.push(teacherSubject.subject_id)
      })
      // 没有要删除的科目
      if (subjectIdArr.length === 0) {
        Output.apiData({}, '你没有相关的科目需要删除', 0)
      }
      const result = await Promise.all([User.delTeacherSubject(conditions), User.delSubjectClassBySubjectIdArr(subjectIdArr)])
      Output.apiData(result, '删除科目成功')
    } catch (e) {
      Output.apiErr(e)
    }
  })
  // 老师删除自己的某个科目下的某个班级
  app.post('/api/subject_class/del', (req, res) => {
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
    const conditions = { subject_class_id: req.body.subject_class_id }
    User
    .delSubjectClassById(conditions)
    .then((result) => {
      Output.apiData(result, '删除班级成功')
    })
    .catch((err) => {
      Output.apiErr(err)
    })
  })
}

module.exports = route
