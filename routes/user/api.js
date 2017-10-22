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
      user_id: req._userInfo.user_id,
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
  app.post('/api/teacher_subject_class/add', async (req, res) => {
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
      user_id: req._userInfo.user_id,
      subject_id: req.body.subject_id,
      class_id: req.body.class_id,
      created_time: Moment().unix()
    }
    try {
      const result = User.addTSC(insertData)
      Output.apiData(result, '为课程添加班级成功')
    } catch (e) {
      Output.apiErr(e)
    }
  })
  // 老师获取自己所教的课程
  app.get('/api/teacher_subject/list', async (req, res) => {
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
    console.log(req._userInfo.user_id)
    try {
      const subjects = await User.getSubjects(req._userInfo.user_id)
      Output.apiData(subjects, '获取自己所教课程成功')
    } catch (e) {
      Output.apiErr(e)
    }
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
    const conditions = {
      user_id: req._userInfo.user_id,
      subject_id: req.body.subject_id
    }
    try {
      // 获取teacher_subject表中的记录
      const teacherSubjectArr = await User.getTeacherSubjectById(conditions)
      const teacherSubjectIdArr = []
      teacherSubjectArr.forEach((teacherSubject) => {
        teacherSubjectIdArr.push(teacherSubject.subject_id)
      })
      // 没有要删除的科目
      if (teacherSubjectIdArr.length === 0) {
        Output.apiData({}, '你没有相关的科目需要删除', 0)
      }
      const result = await Promise.all([User.delTeacherSubject(conditions), User.delTeacherSubjectClass(teacherSubjectIdArr)])
      Output.apiData(result, '删除课程成功')
    } catch (e) {
      Output.apiErr(e)
    }
  })
  // 老师删除自己的某个科目下的某个班级
  app.post('/api/teacher_subject_class/del', async (req, res) => {
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
    const conditions = {
      user_id: req._userInfo.user_id,
      subject_id: req.body.subject_id,
      class_id: req.body.class_id
    }
    try {
      const result = await User.delSubjectClassById(conditions)
      Output.apiData(result, '删除该课程下的该班级成功')
    } catch (e) {
      Output.apiErr(e)
    }
  })
  // 老师为某个科目添加题目
  app.post('/api/question/add', async (req, res) => {
    // 没有登录没有登录
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
      question: req.body.question,
      answer: req.body.answer,
      type: req.body.type,
      subject_id: req.body.subject_id,
      user_id: req._userInfo.user_id,
      created_time: Moment().unix(),
      updated_time: Moment().unix()
    }
    try {
      const result = await User.addQuestion(insertData)
      Output.apiData(result, '为该课程添加题目成功')
    } catch (e) {
      Output.apiErr(e)
    }
  })
  // 老师修改自己添加的题目
  app.post('/api/question/update', async (req, res) => {
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
    const updateData = Object.assign({}, req.body)
    delete updateData.question_id
    updateData.updated_time = Moment().unix()
    const conditions = { 
      question_id: req.body.question_id,
      user_id: req._userInfo.user_id
    }
    try {
      const result = await User.updateQuestion(updateData, conditions)
      Output.apiData(result, '修改题目成功')
    } catch (e) {
      Output.apiErr(e)
    }
  })
  // 老师删除自己添加的题目
  app.post('/api/question/del', async (req, res) => {
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
    const conditions = { 
      question_id: req.body.question_id,
      user_id: req._userInfo.user_id
    }
    try {
      const result = await User.delQuestion(conditions)
      Output.apiData(result, '删除题目成功')
    } catch (e) {
      Output.apiErr(e)
    }
  })
  // 老师获取题目列表
  app.get('/api/question/list', async (req, res) => {
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
    const conditions = { subject_id: req.query.subject_id }
    try {
      const result = await User.getQuestionList(conditions)
      Output.apiData(result, '获取该课程的题目列表成功')
    } catch (e) {
      Output.apiErr(e)
    }
  })
  // 老师获取自己某个科目下所教的班级列表
  app.get('/api/subject_class/list', async (req, res) => {
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
    console.log(req.query.subject_id)
    try {
      const result = await User.getClasses(req.query.subject_id)
      Output.apiData(result, '获取班级列表成功')
    } catch (e) {
      Output.apiErr(e)
    }
  })
  // 老师获取某个科目下的所有题目
  app.get('/api/subject_question/list', async (req, res) => {
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
      const result = await User.getQuestions(req.query.subject_id)
      Output.apiData(result, '获取问题列表成功')
    } catch (e) {
      Output.apiErr(e)
    }
  })
  // 老师获取某个课程下的所有选择题、判断题、填空题、主观题
  app.get('/api/subject_question/*/list', async (req, res) => {
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
    const conditions = {
      subjectId: req.query.subjectId,
      questionIds: req.query.questionIds.split(',')
    }
    // 根据请求地址，判断题目类型
    switch (req.path) {
      case '/api/subject_question/choose/list':
      conditions.type = 0
      break
      case '/api/subject_question/judge/list':
      conditions.type = 1
      break
      case '/api/subject_question/fill/list':
      conditions.type = 2
      break
      case '/api/subject_question/words/list':
      conditions.type = 3
    }
    console.log(conditions)
    try {
      const result = await User.getQuestions(conditions)
      result.type = conditions.type
      Output.apiData(result, '获取问题列表成功'+conditions.type)
    } catch (e) {
      Output.apiErr(e)
    }
  })
  // 用户修改用户名、真实姓名、性别、所属院系、电话号码、qq号码
  app.post('/api/user/*/update', async (req, res) => {
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
    const updateData = {}
    Object.assign(updateData, req.body)
    try {
      const result = await User.updateUserInfo(updateData, { user_id: req._userInfo.user_id })
      Output.apiData(result, '修改成功')
    } catch (e) {
      Output.apiErr(e)
    }
  })
  // 创建一条作业记录
  app.post('/api/task/add', async (req, res) => {
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
      user_id: req._userInfo.user_id,
      task_name: req.body.task_name,
      created_time: Moment().unix(),
      updated_time: Moment().unix()
    }
    try {
      const result = await User.addTask(insertData)
      Output.apiData(result, '创建作业成功')
    } catch (e) {
      Output.apiErr(e)
    }
  })
  // 为作业添加班级
  app.post('/api/task_class/add', async (req, res) => {
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
      task_id: req.body.task_id,
      class_id: req.body.class_id,
      created_time: Moment().unix()
    }
    try {
      const result = await User.addTaskClass(insertData)
      Output.apiData(result, '为作业添加班级成功')
    } catch (e) {
      Output.apiErr(e)
    }
  })
  // 为作业删除班级
  app.post('/api/task_class/del', async (req, res) => {
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
    const conditions = { 
      task_id: req.body.task_id,
      class_id: req.body.class_id
    }
    try {
      const result = await User.delTaskClass(conditions)
      Output.apiData(result, '为作业删除班级成功')
    } catch (e) {
      Output.apiErr(e)
    }
  })
  // 获取最近5条作业记录
  app.get('/api/task/recent', async (req, res) => {
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
    const conditions = {
      user_id: req._userInfo.user_id
    }
    try {
      const result = await User.getTask5(conditions)
      Output.apiData(result, '获取5条作业记录成功')
    } catch (e) {
      Output.apiErr(e)
    }
  })
  // 获取某条作业记录的详细信息
  app.get('/api/task/info', async (req, res) => {
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
    const taskId = req.query.task_id
    try {
      // 本次作业所对应的课程
      const curSubject = await User.getSubjectByTaskId(taskId)
      // 此课程所对应的所有班级
      const classes = await User.getClasses(curSubject[0].subject_id)
      // 本次作业所选的班级
      const curClasses = await User.getCurClasses(taskId)
      // 本次作业所选的题目
      const curQuestions = await User.getCurQuestions(taskId)
      // 本次作业是否被发布
      const isPublish = await User.isPublish(taskId)
      const data = {
        curSubject,
        classes,
        curClasses,
        curQuestions,
        isPublish
      }
      Output.apiData(data, '获取该作业详细信息成功')
    } catch (e) {
      Output.apiErr(e)
    }
  })
  // 为某次作业添加题目
  app.post('/api/task_question/add', async (req, res) => {
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
      task_id: req.body.task_id,
      question_id: req.body.question_id
    }
    try {
      const result = await User.addTaskQuestion(insertData)
      Output.apiData(result, '添加题目成功')
    } catch (e) {
      Output.apiErr(e)
    }
  })
  // 为某次作业删除题目
  app.post('/api/task_question/del', async (req, res) => {
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
    const conditions = {
      task_id: req.body.task_id,
      question_id: req.body.question_id
    }
    try {
      const result = await User.delTaskQuestion(conditions)
      Output.apiData(result, '删除题目成功')
    } catch (e) {
      Output.apiErr(e)
    }
  })
  // 发布作业
  app.post('/api/task/publish', async (req, res) => {
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
      const result = await User.publishTask(req.body.task_id)
      Output.apiData(result, '发布作业成功')
    } catch (e) {
      Output.apiErr(e)
    }
  })
  // 获取用户信息
  app.get('/api/user/info', async (req, res) => {
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
      const result = await User.getUserById(req._userInfo.user_id)
      Output.apiData(result, '获取用户信息成功')
    } catch (e) {
      Output.apiErr(e)
    }
  })
  // 修改用户信息
  app.post('/api/student/update', async (req, res) => {
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
    const updateData = {
      username: req.body.userName,
      real_name: req.body.realName,
      sex: req.body.sex,
      department_name: req.body.departmentName,
      class_name: req.body.className,
      phone_num: req.body.phoneNum,
      qq_num: req.body.qqNum
    }
    const conditions = { user_id: req._userInfo.user_id }
    try {
      const result = await User.updateUserInfo(updateData, conditions)
      Output.apiData(result, '修改用户信息成功')
    } catch (e) {
      Output.apiErr(e)
    }
  })
  // 获取老师个人中心页面初始化数据：老师个人信息、所教课程、所教班级
  app.get('/api/teacher/personal', async (req, res) => {
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
      const subjectClassData = await User.getSubjectClass(req._userInfo.user_id)
      const data = {
        userData,
        subjectClassData
      }
      Output.apiData(data, '获取页面信息成功')
    } catch (e) {
      Output.apiErr(e)
    }
  })
  
}

module.exports = route
