'use strict'

const Admin = require('../../models/admin')
const Output = require('../../middlewares/output')
const Moment = require('moment')
const Async = require('async')
// const DBError = require('../../errors/db_error');

const route = (app) => {
  // 用户管理页面
  // app.get('/admin/user', (req, res) => {
  //   if (!req._canVisit) {
  //     Output.render('admin/index', {
  //       canVisit: 1
  //     })
  //     return
  //   }
  //   Output.render('admin/index', {
  //     canVisit: true
  //   })
  // })
  // 获取所有权限
  app.get('/api/access/list', (req, res) => {
    console.log('这里？这里？')
    // 没有登录
    if (!req._authInfo) {
      Output.apiErr({ code: 0, message: '请先登录' })
      return
    }
    // 超级管理员才能访问
    // if(!req._canVisit) {
    //     Output.apiErr({ code: 0, message: '你没有权限访问' });
    //     return;
    // }
    Admin
    .getAccess()
    .then((accessArr) => {
      Output.apiData(accessArr, '获取成功')
    })
    .catch((err) => {
      Output.apiErr(err)
    })
  })
  // 添加权限
  app.post('/api/access/add', (req, res) => {
    // 没有登录
    if (!req._authInfo) {
      Output.apiErr({ code: 0, message: '请先登录' })
      return
    }
    // 超级管理员才能访问
    // if (!req._canVisit) {
    //   Output.apiErr({ code: 0, message: '你没有权限访问' })
    //   return
    // }
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
      Output.apiData(result, '添加成功')
    })
    .catch((err) => {
      Output.apiErr(err)
    })
  })
  // 更新权限
  app.post('/api/access/update', (req, res) => {
    // 没有登录
    if (!req._authInfo) {
      Output.apiErr({ code: 0, message: '请先登录' })
      return
    }
    // 超级管理员才能访问
    // if(!req._canVisit) {
    //     Output.apiErr({ code: 0, message: '你没有权限访问' });
    //     return;
    // }
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
      Output.apiData(result, '更新成功')
    })
    .catch((err) => {
      Output.apiErr(err)
    })
  })
  // 删除权限
  app.post('/api/access/del', (req, res) => {
    // 没有登录
    if (!req._authInfo) {
      Output.apiErr({ code: 0, message: '请先登录' })
      return
    }
    // 超级管理员才能访问
    // if(!req._canVisit) {
    //     Output.apiErr({ code: 0, message: '你没有权限访问' });
    //     return;
    // }
    const conditions = { access_id: req.body.access_id }
    Async.parallel({
      // 删除access表中的权限信息
      delAccess: (cb) => {
        Admin
        .delAccess(conditions)
        .then((result) => {
          Output.apiData(result, '删除成功')
        })
        .catch((err) => {
          Output.apiErr(err)
          return false
        })
      },
      // 根据access_id，删除role_access表中的记录
      delRoleAccessByAccessId: (cb) => {
        Admin
        .delRoleAccessByAccessId(conditions)
        .then((result) => {
          Output.apiData(result, '删除成功')
        })
        .catch((err) => {
          Output.apiErr(err)
          return false
        })
      }
    }, (err, result) => {
      if (err) {
        Output.apiErr(err)
        return
      }
      Output.apiData(result, '删除权限成功')
    })
  })
  // 获取所有角色
  app.get('/api/role/list', (req, res) => {
    // 没有登录
    if (!req._authInfo) {
      Output.apiErr({ code: 0, message: '请先登录' })
      return
    }
    // 超级管理员才能访问
    // if(!req._canVisit) {
    //     Output.apiErr({ code: 0, message: '你没有权限访问' });
    //     return;
    // }
    Admin
    .getRole()
    .then((roleArr) => {
      Output.apiData(roleArr, '获取成功')
    })
    .catch((err) => {
      Output.apiErr(err)
    })
  })
  // 添加角色
  app.post('/api/role/add', (req, res) => {
    // 没有登录
    if (!req._authInfo) {
      Output.apiErr({ code: 0, message: '请先登录' })
      return
    }
    // 超级管理员才能访问
    // if(!req._canVisit) {
    //     Output.apiErr({ code: 0, message: '你没有权限访问' });
    //     return;
    // }
    // 要插入数据库的数据
    const insetData = {
      role_name: req.body.role_name,
      created_time: Moment().unix(),
      updated_time: Moment().unix()
    }
    Admin
    .addRole(insetData)
    .then((result) => {
      Output.apiData(result, '添加成功')
    })
    .catch((err) => {
      Output.apiErr(err)
    })
  })
  // 删除角色
  app.post('/api/role/del', (req, res) => {
    // 没有登录
    if (!req._authInfo) {
      Output.apiErr({ code: 0, message: '请先登录' })
      return
    }
    // 超级管理员才能访问
    // if(!req._canVisit) {
    //     Output.apiErr({ code: 0, message: '你没有权限访问' });
    //     return;
    // }
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
          Output.apiErr(err)
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
          Output.apiErr(err)
          return false
        })
      }
    }, (err, result) => {
      if (err) {
        Output.apiErr(err)
        return
      }
      Output.apiData(result, '删除角色成功')
    })
  })
  // 获取某个角色的所有权限
  app.post('/api/role_access/list', (req, res) => {
    // 没有登录
    if (!req._authInfo) {
      Output.apiErr({ code: 0, message: '请先登录' })
      return
    }
    // 超级管理员才能访问
    // if(!req._canVisit) {
    //     Output.apiErr({ code: 0, message: '你没有权限访问' });
    //     return;
    // }

    const roleId = req.body.role_id
    Admin
    .getRoleAccess(roleId)
    .then((result) => {
      Output.apiData(result, '获取成功')
    })
    .catch((err) => {
      Output.apiErr(err)
    })
  })
  // 为某个角色添加某个权限
  app.post('/api/role_access/add', (req, res) => {
    // 没有登录
    if (!req._authInfo) {
      Output.apiErr({ code: 0, message: '请先登录' })
      return
    }
    // 超级管理员才能访问
    // if(!req._canVisit) {
    //     Output.apiErr({ code: 0, message: '你没有权限访问' });
    //     return;
    // }
    const insertData = {
      role_id: req.body.role_id,
      access_id: req.body.access_id,
      created_time: Moment().unix(),
      updated_time: Moment().unix()
    }
    Admin
    .addRoleAccess(insertData)
    .then((result) => {
      Output.apiData(result, '添加权限成功')
    })
    .catch((err) => {
      Output.apiErr(err)
    })
  })
  // 删除某个角色的某个权限
  app.post('/api/role_access/del', (req, res) => {
    // 没有登录
    if (!req._authInfo) {
      Output.apiErr({ code: 0, message: '请先登录' })
      return
    }
    // 超级管理员才能访问
    // if(!req._canVisit) {
    //     Output.apiErr({ code: 0, message: '你没有权限访问' });
    //     return;
    // }
    const conditions = {
      role_id: req.body.role_id,
      access_id: req.body.access_id
    }
    Admin
    .delRoleAccess(conditions)
    .then((result) => {
      Output.apiData(result, '移除权限成功')
    })
    .catch((err) => {
      Output.apiErr(err)
    })
  })
}

module.exports = route
