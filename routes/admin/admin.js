'use strict'

const Admin = require('../../models/admin')
const Moment = require('moment')
const Async = require('async')

const route = (app) => {
  // 后台管理(单页应用)页面的token验证
  app.get('/admin/*', (req, res) => {
    // 没有登录
    if (!req._authInfo) {
      res.apiData({}, '你没有权限访问', -1)
    }
    // 没有权限访问
    if (!req._canVisit) {
      res.apiData({}, '你没有权限访问', 0)
      return
    }
    res.apiData({}, '你有权限访问')
  })
  // 获取权限列表
  app.get('/api/access/list', (req, res) => {
    // 没有登录
    if (!req._authInfo) {
      res.apiErr({ code: 0, message: '请先登录' })
      return
    }
    // 超级管理员才能访问
    if (!req._canVisit) {
      res.apiErr({ code: 0, message: '你没有权限访问' })
      return
    }
    Admin
    .getAccess()
    .then((accessArr) => {
      res.apiData(accessArr, '获取成功')
    })
    .catch((err) => {
      res.apiErr(err)
    })
  })
  // 添加权限
  app.post('/api/access/add', (req, res) => {
    // 没有登录
    if (!req._authInfo) {
      res.apiErr({ code: 0, message: '请先登录' })
      return
    }
    // 超级管理员才能访问
    if (!req._canVisit) {
      res.apiErr({ code: 0, message: '你没有权限访问' })
      return
    }
    // 要插入数据库的数据
    const insetData = {
      access_title: req.body.access_title,
      access_url: req.body.access_url,
      created_time: Moment().unix(),
      updated_time: Moment().unix()
    }
    Admin
    .addAccess(insetData)
    .then((result) => {
      res.apiData(result, '添加成功')
    })
    .catch((err) => {
      res.apiErr(err)
    })
  })
  // 更新权限
  app.post('/api/access/update', (req, res) => {
    // 没有登录
    if (!req._authInfo) {
      res.apiErr({ code: 0, message: '请先登录' })
      return
    }
    // 超级管理员才能访问
    if (!req._canVisit) {
      res.apiErr({ code: 0, message: '你没有权限访问' })
      return
    }
    // 要插入数据库的数据
    const updateData = {
      access_title: req.body.access_title || null,
      access_url: req.body.access_url || null,
      updated_time: Moment().unix()
    }
    // 删除不要更新的字段
    for (let k in updateData) {
      if (!updateData[k]) {
        delete updateData[k]
      }
    }
    const conditions = { access_id: req.body.access_id }
    Admin
    .updateAccess(updateData, conditions)
    .then((result) => {
      res.apiData(result, '更新成功')
    })
    .catch((err) => {
      res.apiErr(err)
    })
  })
  // 删除权限
  app.post('/api/access/del', (req, res) => {
    // 没有登录
    if (!req._authInfo) {
      res.apiErr({ code: 0, message: '请先登录' })
      return
    }
    // 超级管理员才能访问
    if (!req._canVisit) {
      res.apiErr({ code: 0, message: '你没有权限访问' })
      return
    }
    const conditions = { access_id: req.body.access_id }
    Async.parallel({
      // 删除access表中的权限信息
      delAccess: (cb) => {
        Admin
        .delAccess(conditions)
        .then((result) => {
          res.apiData(result, '删除成功')
        })
        .catch((err) => {
          res.apiErr(err)
          return false
        })
      },
      // 根据access_id，删除role_access表中的记录
      delRoleAccessByAccessId: (cb) => {
        Admin
        .delRoleAccessByAccessId(conditions)
        .then((result) => {
          res.apiData(result, '删除成功')
        })
        .catch((err) => {
          res.apiErr(err)
          return false
        })
      }
    }, (err, result) => {
      if (err) {
        res.apiErr(err)
        return
      }
      res.apiData(result, '删除权限成功')
    })
  })
  // 获取所有角色
  app.get('/api/role/list', (req, res) => {
    // 没有登录
    if (!req._authInfo) {
      res.apiErr({ code: 0, message: '请先登录' })
      return
    }
    // 超级管理员才能访问
    if (!req._canVisit) {
      res.apiErr({ code: 0, message: '你没有权限访问' })
      return
    }
    Admin
    .getRole()
    .then((roleArr) => {
      res.apiData(roleArr, '获取成功')
    })
    .catch((err) => {
      res.apiErr(err)
    })
  })
  // 添加角色
  app.post('/api/role/add', (req, res) => {
    // 没有登录
    if (!req._authInfo) {
      res.apiErr({ code: 0, message: '请先登录' })
      return
    }
    // 超级管理员才能访问
    if (!req._canVisit) {
      res.apiErr({ code: 0, message: '你没有权限访问' })
      return
    }
    // 要插入数据库的数据
    const insetData = {
      role_name: req.body.role_name,
      created_time: Moment().unix(),
      updated_time: Moment().unix()
    }
    Admin
    .addRole(insetData)
    .then((result) => {
      res.apiData(result, '添加成功')
    })
    .catch((err) => {
      res.apiErr(err)
    })
  })
  // 删除角色
  app.post('/api/role/del', (req, res) => {
    // 没有登录
    if (!req._authInfo) {
      res.apiErr({ code: 0, message: '请先登录' })
      return
    }
    // 超级管理员才能访问
    if (!req._canVisit) {
      res.apiErr({ code: 0, message: '你没有权限访问' })
      return
    }
    const conditions = { role_id: req.body.role_id }
    Async.parallel({
      // 根据role_id，删除role表中的角色信息
      delRole: (cb) => {
        Admin
        .delRole(conditions)
        .then((result) => {
          cb(null, result)
        })
        .catch((err) => {
          res.apiErr(err)
          return false
        })
      },
      // 根据role_id，删除role_access表中的记录
      delRoleAccessByRoleId: (cb) => {
        Admin
        .delRoleAccessByRoleId(conditions)
        .then((result) => {
          cb(null, result)
        })
        .catch((err) => {
          res.apiErr(err)
          return false
        })
      }
    }, (err, result) => {
      if (err) {
        res.apiErr(err)
        return
      }
      res.apiData(result, '删除角色成功')
    })
  })
  // 获取某个角色的所有权限
  app.post('/api/role_access/list', (req, res) => {
    // 没有登录
    if (!req._authInfo) {
      res.apiErr({ code: 0, message: '请先登录' })
      return
    }
    // 超级管理员才能访问
    if (!req._canVisit) {
      res.apiErr({ code: 0, message: '你没有权限访问' })
      return
    }

    const roleId = req.body.role_id
    Admin
    .getRoleAccess(roleId)
    .then((result) => {
      res.apiData(result, '获取成功')
    })
    .catch((err) => {
      res.apiErr(err)
    })
  })
  // 获取某个用户的所有角色
  app.post('/api/user_role/list', (req, res) => {
    // 没有登录
    if (!req._authInfo) {
      res.apiErr({ code: 0, message: '请先登录' })
      return
    }
    // 超级管理员才能访问
    if (!req._canVisit) {
      res.apiErr({ code: 0, message: '你没有权限访问' })
      return
    }
    const userId = req.body.user_id
    Admin
    .getUserRole(userId)
    .then((result) => {
      res.apiData(result, '获取成功')
    })
    .catch((err) => {
      res.apiErr(err)
    })
  })
  // 为某个角色添加某个权限
  app.post('/api/role_access/add', (req, res) => {
    // 没有登录
    if (!req._authInfo) {
      res.apiErr({ code: 0, message: '请先登录' })
      return
    }
    // 超级管理员才能访问
    if (!req._canVisit) {
      res.apiErr({ code: 0, message: '你没有权限访问' })
      return
    }
    const insertData = {
      role_id: req.body.role_id,
      access_id: req.body.access_id,
      created_time: Moment().unix(),
      updated_time: Moment().unix()
    }
    Admin
    .addRoleAccess(insertData)
    .then((result) => {
      res.apiData(result, '添加权限成功')
    })
    .catch((err) => {
      res.apiErr(err)
    })
  })
  // 为某个用户添加某个角色
  app.post('/api/user_role/add', (req, res) => {
    // 没有登录
    if (!req._authInfo) {
      res.apiErr({ code: 0, message: '请先登录' })
      return
    }
    // 超级管理员才能访问
    if (!req._canVisit) {
      res.apiErr({ code: 0, message: '你没有权限访问' })
      return
    }
    const insertData = {
      user_id: req.body.user_id,
      role_id: req.body.role_id,
      created_time: Moment().unix(),
      updated_time: Moment().unix()
    }
    Admin
    .addUserRole(insertData)
    .then((result) => {
      res.apiData(result, '添加权限成功')
    })
    .catch((err) => {
      res.apiErr(err)
    })
  })
  // 删除某个角色的某个权限
  app.post('/api/role_access/del', (req, res) => {
    // 没有登录
    if (!req._authInfo) {
      res.apiErr({ code: 0, message: '请先登录' })
      return
    }
    // 超级管理员才能访问
    if (!req._canVisit) {
      res.apiErr({ code: 0, message: '你没有权限访问' })
      return
    }
    const conditions = {
      role_id: req.body.role_id,
      access_id: req.body.access_id
    }
    Admin
    .delRoleAccess(conditions)
    .then((result) => {
      res.apiData(result, '移除权限成功')
    })
    .catch((err) => {
      res.apiErr(err)
    })
  })
  // 删除某个用户的某个角色
  app.post('/api/user_role/del', (req, res) => {
    // 没有登录
    if (!req._authInfo) {
      res.apiErr({ code: 0, message: '请先登录' })
      return
    }
    // 超级管理员才能访问
    if (!req._canVisit) {
      res.apiErr({ code: 0, message: '你没有权限访问' })
      return
    }
    const conditions = {
      user_id: req.body.user_id,
      role_id: req.body.role_id
    }
    Admin
    .delUserRole(conditions)
    .then((result) => {
      res.apiData(result, '移除权限成功')
    })
    .catch((err) => {
      res.apiErr(err)
    })
  })
  // 获取院系列表
  app.get('/api/department/list', (req, res) => {
    // 没有登录
    if (!req._authInfo) {
      res.apiErr({ code: 0, message: '请先登录' })
      return
    }
    // 超级管理员才能访问
    if (!req._canVisit) {
      res.apiErr({ code: 0, message: '你没有权限访问' })
      return
    }
    Admin
    .getDepartment()
    .then((departmentArr) => {
      res.apiData(departmentArr, '获取院系列表成功')
    })
    .catch((err) => {
      res.apiErr(err)
    })
  })
  // 获取科目列表
  app.get('/api/subject/list', (req, res) => {
    // 没有登录
    if (!req._authInfo) {
      res.apiErr({ code: 0, message: '请先登录' })
      return
    }
    // 超级管理员才能访问
    if (!req._canVisit) {
      res.apiErr({ code: 0, message: '你没有权限访问' })
      return
    }
    Admin
    .getSubject()
    .then((subjectArr) => {
      res.apiData(subjectArr, '获取院系列表成功')
    })
    .catch((err) => {
      res.apiErr(err)
    })
  })
  // 获取用户列表
  app.get('/api/user/list', (req, res) => {
    // 没有登录
    if (!req._authInfo) {
      res.apiErr({ code: 0, message: '请先登录' })
      return
    }
    // 超级管理员才能访问
    if (!req._canVisit) {
      res.apiErr({ code: 0, message: '你没有权限访问' })
      return
    }
    Admin
    .getUser()
    .then((userArr) => {
      res.apiData(userArr, '获取用户列表成功')
    })
    .catch((err) => {
      res.apiErr(err)
    })
  })
  // 获取班级列表
  app.get('/api/class/list', (req, res) => {
    // 没有登录
    if (!req._authInfo) {
      res.apiErr({ code: 0, message: '请先登录' })
      return
    }
    // 超级管理员才能访问
    if (!req._canVisit) {
      res.apiErr({ code: 0, message: '你没有权限访问' })
      return
    }
    Admin
    .getClass()
    .then((classArr) => {
      res.apiData(classArr, '获取班级列表成功')
    })
    .catch((err) => {
      res.apiErr(err)
    })
  })
  // 添加院系
  app.post('/api/department/add', (req, res) => {
    // 没有登录
    if (!req._authInfo) {
      res.apiErr({ code: 0, message: '请先登录' })
      return
    }
    // 超级管理员才能访问
    if (!req._canVisit) {
      res.apiErr({ code: 0, message: '你没有权限访问' })
      return
    }
    const insertData = { department_name: req.body.department_name }
    Admin
    .addDepartment(insertData)
    .then((result) => {
      res.apiData(result, '添加院系成功')
    })
    .catch((err) => {
      res.apiErr(err)
    })
  })
  // 添加课程
  app.post('/api/subject/add', (req, res) => {
    // 没有登录
    if (!req._authInfo) {
      res.apiErr({ code: 0, message: '请先登录' })
      return
    }
    // 超级管理员才能访问
    if (!req._canVisit) {
      res.apiErr({ code: 0, message: '你没有权限访问' })
      return
    }
    const insertData = {
      subject_name: req.body.subject_name,
      subject_num: req.body.subject_num
    }
    Admin
    .addSubject(insertData)
    .then((result) => {
      res.apiData(result, '添加科目成功')
    })
    .catch((err) => {
      res.apiErr(err)
    })
  })
  // 添加班级
  app.post('/api/class/add', (req, res) => {
    // 没有登录
    if (!req._authInfo) {
      res.apiErr({ code: 0, message: '请先登录' })
      return
    }
    // 超级管理员才能访问
    if (!req._canVisit) {
      res.apiErr({ code: 0, message: '你没有权限访问' })
      return
    }
    const insertData = {
      class_name: req.body.class_name,
      created_time: Moment().unix()
    }
    Admin
    .addClass(insertData)
    .then((result) => {
      res.apiData(result, '添加班级成功')
    })
    .catch((err) => {
      res.apiErr(err)
    })
  })
  // 添加用户
  app.post('/api/user/add', (req, res) => {
    // 没有登录
    if (!req._authInfo) {
      res.apiErr({ code: 0, message: '请先登录' })
      return
    }
    // 超级管理员才能访问
    if (!req._canVisit) {
      res.apiErr({ code: 0, message: '你没有权限访问' })
      return
    }
    const insertData = {
      username: req.body.username,
      created_time: Moment().unix(),
      updated_time: Moment().unix()
    }
    Admin
    .addUser(insertData)
    .then((result) => {
      res.apiData(result, '添加用户成功')
    })
    .catch((err) => {
      res.apiErr(err)
    })
  })
  // 批量添加用户
  app.post('/api/userlist/add', async (req, res) => {
    // 没有登录
    if (!req._authInfo) {
      res.apiErr({ code: 0, message: '请先登录' })
      return
    }
    // 超级管理员才能访问
    if (!req._canVisit) {
      res.apiErr({ code: 0, message: '你没有权限访问' })
      return
    }
    try {
      const userObjArr = JSON.parse(req.body.userObjArr).userObjArr
      const result = await Admin.addUsers(userObjArr)
      console.log('result.length: ' + result.length)
      console.log('userObjArr.length: ' + userObjArr.length)
      
      if (result.length < userObjArr.length) {
        res.apiErr({ message: '前 ' + result.length + ' 个学生导入成功，后' + (userObjArr.length - result.length) + '个学生班级名称错误，不能导入！' })
        return
      }
      res.apiData(result, '所有用户添加成功')
    } catch (e) {
      res.apiErr({ message: '用户导入失败' })
    }
  })
  // 删除院系
  app.post('/api/department/del', (req, res) => {
    // 没有登录
    if (!req._authInfo) {
      res.apiErr({ code: 0, message: '请先登录' })
      return
    }
    // 超级管理员才能访问
    if (!req._canVisit) {
      res.apiErr({ code: 0, message: '你没有权限访问' })
      return
    }
    const conditions = { department_id: req.body.department_id }
    Admin
    .delDepartment(conditions)
    .then((result) => {
      res.apiData(result, '删除院系成功')
    })
    .catch((err) => {
      res.apiErr(err)
    })
  })
  // 删除科目
  app.post('/api/subject/del', (req, res) => {
    // 没有登录
    if (!req._authInfo) {
      res.apiErr({ code: 0, message: '请先登录' })
      return
    }
    // 超级管理员才能访问
    if (!req._canVisit) {
      res.apiErr({ code: 0, message: '你没有权限访问' })
      return
    }
    const conditions = { subject_id: req.body.subject_id }
    Admin
    .delSubject(conditions)
    .then((result) => {
      res.apiData(result, '删除科目成功')
    })
    .catch((err) => {
      res.apiErr(err)
    })
  })
  // 删除班级
  app.post('/api/class/del', (req, res) => {
    // 没有登录
    if (!req._authInfo) {
      res.apiErr({ code: 0, message: '请先登录' })
      return
    }
    // 超级管理员才能访问
    if (!req._canVisit) {
      res.apiErr({ code: 0, message: '你没有权限访问' })
      return
    }
    const conditions = { class_id: req.body.class_id }
    Admin
    .delClass(conditions)
    .then((result) => {
      res.apiData(result, '删除班级成功')
    })
    .catch((err) => {
      res.apiErr(err)
    })
  })
  // 删除用户
  app.post('/api/user/del', (req, res) => {
    // 没有登录
    if (!req._authInfo) {
      res.apiErr({ code: 0, message: '请先登录' })
      return
    }
    // 超级管理员才能访问
    if (!req._canVisit) {
      res.apiErr({ code: 0, message: '你没有权限访问' })
      return
    }
    const conditions = { user_id: req.body.user_id }
    Async.parallel({
      // 根据user_id，删除user表中的用户信息
      delUser: (cb) => {
        Admin
        .delUser(conditions)
        .then((result) => {
          cb(null, result)
        })
        .catch((err) => {
          res.apiErr(err)
          return false
        })
      },
      // 根据role_id，删除role_access表中的记录
      delUserRoleByUserId: (cb) => {
        Admin
        .delUserRoleByUserId(conditions)
        .then((result) => {
          cb(null, result)
        })
        .catch((err) => {
          res.apiErr(err)
          return false
        })
      }
    }, (err, result) => {
      if (err) {
        res.apiErr(err)
        return
      }
      res.apiData(result, '删除角色成功')
    })
  })
  // 更新用户信息
  app.post('/api/user/update', (req, res) => {
    // 没有登录
    if (!req._authInfo) {
      res.apiErr({ code: 0, message: '请先登录' })
      return
    }
    // 超级管理员才能访问
    if (!req._canVisit) {
      res.apiErr({ code: 0, message: '你没有权限访问' })
      return
    }
    const updateData = {
      username: req.body.username,
      real_name: req.body.real_name,
      sex: req.body.sex,
      department_name: req.body.department_name,
      class_name: req.body.class_name,
      phone_num: req.body.phone_num,
      qq_num: req.body.qq_num,
      updated_time: Moment().unix()
    }
    const conditions = { user_id: req.body.user_id }
    Admin
    .updateUser(updateData, conditions)
    .then((result) => {
      res.apiData(result, '更新用户信息成功')
    })
    .catch((err) => {
      res.apiErr(err)
    })
  })
  // 给某个用户添加某个角色
  app.post('/api/user_role/add', (req, res) => {
    // 没有登录
    if (!req._authInfo) {
      res.apiErr({ code: 0, message: '请先登录' })
      return
    }
    // 超级管理员才能访问
    if (!req._canVisit) {
      res.apiErr({ code: 0, message: '你没有权限访问' })
      return
    }
    const insertData = {
      user_id: req.body.user_id,
      role_id: req.body.role_id,
      created_time: Moment().unix(),
      updated_time: Moment().unix()
    }
    Admin
    .addUserRole(insertData)
    .then((result) => {
      res.apiData(result, '给用户添加角色成功')
    })
    .catch((err) => {
      res.apiErr(err)
    })
  })
  // 给某个用户删除某个角色
  app.post('/api/user_role/del', (req, res) => {
    // 没有登录
    if (!req._authInfo) {
      res.apiErr({ code: 0, message: '请先登录' })
      return
    }
    // 超级管理员才能访问
    if (!req._canVisit) {
      res.apiErr({ code: 0, message: '你没有权限访问' })
      return
    }
    const conditions = { user_role_id: req.body.user_role_id }
    Admin
    .delUserRole(conditions)
    .then((result) => {
      res.apiData(result, '删除角色成功')
    })
    .catch((err) => {
      res.apiErr(err)
    })
  })
  // 是否存在相同的角色
  app.post('/api/user/same', async (req, res) => {
    // 没有登录
    if (!req._authInfo) {
      res.apiErr({ code: 0, message: '请先登录' })
      return
    }
    // 超级管理员才能访问
    if (!req._canVisit) {
      res.apiErr({ code: 0, message: '你没有权限访问' })
      return
    }
    const conditions = { username: req.body.username }
    try {
      const userData = await Admin.getOne(conditions)
      res.apiData(userData, '用户数据')
    } catch (e) {
      res.apiErr(e)
    }
  })
}

module.exports = route
