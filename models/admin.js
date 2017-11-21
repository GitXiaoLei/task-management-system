'use strict'

const DB = require('../db')
const Async = require('async')
const Util = require('../public/utils/util')
const moment = require('moment')

/**
 * Admin模型
 */
const Admin = {
  // 获取所有权限
  getAccess () {
    return new Promise((resolve, reject) => {
      DB
      .instance('r')
      .select('access', {}, { access_id: 0 })
      .then((accessArr) => {
        resolve(accessArr)
      })
      .catch((err) => {
        reject(err)
      })
    })
  },
  // 获取所有班级
  getClass () {
    return new Promise((resolve, reject) => {
      DB
      .instance('r')
      .select('class', {}, { class_id: 0 })
      .then((classArr) => {
        resolve(classArr)
      })
      .catch((err) => {
        reject(err)
      })
    })
  },
  /**
   * 添加权限
   */
  addAccess (insetData) {
    return new Promise((resolve, reject) => {
      DB
      .instance('w')
      .insert('access', insetData)
      .then((result) => {
        resolve(result)
      })
      .catch((err) => {
        reject(err)
      })
    })
  },
  /**
   * 更新权限
   * @param {Object} updateData 要更新的字段，如{ access_title: '登录页' }
   * @param {Object} conditions 条件，如{ access_id: 1 }
   * @return Promise
   */
  updateAccess (updateData, conditions) {
    return new Promise((resolve, reject) => {
      DB
      .instance('w')
      .update('access', updateData, conditions)
      .then((result) => {
        resolve(result)
      })
      .catch((err) => {
        reject(err)
      })
    })
  },
  /**
   * 删除权限
   * @param {Object} conditions 条件，如{ access_id: 1 }
   * @return Promise
   */
  delAccess (conditions) {
    return new Promise((resolve, reject) => {
      DB
      .instance('w')
      .delete('access', conditions)
      .then((result) => {
        resolve(result)
      })
      .catch((err) => {
        reject(err)
      })
    })
  },

  // 获取所有角色
  getRole () {
    return new Promise((resolve, reject) => {
      DB
      .instance('r')
      .select('role', {}, { role_id: 0 })
      .then((roleArr) => {
        resolve(roleArr)
      })
      .catch((err) => {
        reject(err)
      })
    })
  },
  /**
   * 添加角色
   * @param {Object} insetData 插入的数据，如{ role_name: 'teacher' }
   * @return Promise
   */
  addRole (insetData) {
    return new Promise((resolve, reject) => {
      DB
      .instance('w')
      .insert('role', insetData)
      .then((result) => {
        resolve(result)
      })
      .catch((err) => {
        reject(err)
      })
    })
  },
  /**
   * 删除角色
   * @param {Object} conditions 条件，如{ role_id: 1 }
   * @return Promise
   */
  delRole (conditions) {
    return new Promise((resolve, reject) => {
      DB
      .instance('w')
      .delete('role', conditions)
      .then((result) => {
        resolve(result)
      })
      .catch((err) => {
        reject(err)
      })
    })
  },
  /**
   * 给角色添加权限
   * @param {Object} insertData 数据
   * @return Promise
   */
  roleAccessAdd (insertData) {
    return new Promise((resolve, reject) => {
      DB
      .instance('w')
      .insert('role_access', insertData)
      .then((result) => {
        resolve(result)
      })
      .catch((err) => {
        reject(err)
      })
    })
  },
  // 获取某个角色的所有权限
  getRoleAccess (roleId) {
    return new Promise((resolve, reject) => {
      Async.waterfall([
        // 从role_access表中通过角色id获取权限id
        (cb) => {
          DB
          .instance('r')
          .select('role_access', { role_id: roleId })
          .then((roleAccessArr) => {
            // 改角色没有相关权限
            if (roleAccessArr.length === 0) {
              resolve(roleAccessArr)
              return
            }
            // 获取所有的权限id
            let accessIdArr = []
            roleAccessArr.forEach((roleAccess) => {
              accessIdArr.push(roleAccess.access_id)
            })
            accessIdArr = Util.removeSome(accessIdArr)
            cb(null, accessIdArr)
          })
          .catch((err) => {
            reject(err)
          })
        },
        // 根据上面获得的权限id，来获取权限的详细信息
        (accessIdArr, cb) => {
          let sql = 'SELECT * FROM `' + 'access' + '` WHERE '
          accessIdArr.forEach((accessId, i, arr) => {
            if (arr.length - 1 !== i) {
              sql += ' access_id = ' + accessId + ' OR '
            } else {
              sql += ' access_id = ' + accessId
            }
          })
          DB
          .instance('r')
          .query(sql)
          .then((accessData) => {
            cb(null, accessData)
          })
          .catch((err) => {
            reject(err)
          })
        }
      ], (err, accessData) => {
        if (err) {
          reject(err)
        }
        resolve(accessData)
      })
    })
  },
  // 获取某个用户的所有角色
  getUserRole (userId) {
    return new Promise((resolve, reject) => {
      Async.waterfall([
        // 从user_role表中通过用户id获取角色id
        (cb) => {
          DB
          .instance('r')
          .select('user_role', { user_id: userId })
          .then((userRoleArr) => {
            // 该用户没有相关角色
            if (userRoleArr.length === 0) {
              resolve(userRoleArr)
              return
            }
            // 获取所有的角色id
            let roleIdArr = []
            userRoleArr.forEach((userRole) => {
              roleIdArr.push(userRole.role_id)
            })
            roleIdArr = Util.removeSome(roleIdArr)
            cb(null, roleIdArr)
          })
          .catch((err) => {
            reject(err)
          })
        },
        // 根据上面获得的角色id，来获取角色的详细信息
        (roleIdArr, cb) => {
          let sql = 'SELECT * FROM `' + 'role' + '` WHERE '
          roleIdArr.forEach((roleId, i, arr) => {
            if (arr.length - 1 !== i) {
              sql += ' role_id = ' + roleId + ' OR '
            } else {
              sql += ' role_id = ' + roleId
            }
          })
          DB
          .instance('r')
          .query(sql)
          .then((roleData) => {
            cb(null, roleData)
          })
          .catch((err) => {
            reject(err)
          })
        }
      ], (err, roleData) => {
        if (err) {
          reject(err)
        }
        resolve(roleData)
      })
    })
  },
  // 为某个角色添加某个权限
  addRoleAccess (insertData) {
    return new Promise((resolve, reject) => {
      DB
      .instance('w')
      .insert('role_access', insertData)
      .then((result) => {
        resolve(result)
      })
      .catch((err) => {
        reject(err)
      })
    })
  },
  // 为某个用户添加某个角色
  addUserRole (insertData) {
    return new Promise((resolve, reject) => {
      DB
      .instance('w')
      .insert('user_role', insertData)
      .then((result) => {
        resolve(result)
      })
      .catch((err) => {
        reject(err)
      })
    })
  },
  // 删除某个角色的某个权限
  delRoleAccess (insertData) {
    const sql = 'DELETE FROM `role_access` WHERE ' + 'role_id = ' + insertData.role_id + ' AND ' + 'access_id = ' + insertData.access_id
    return new Promise((resolve, reject) => {
      DB
      .instance('w')
      .query(sql)
      .then((result) => {
        resolve(result)
      })
      .catch((err) => {
        reject(err)
      })
    })
  },
  // 删除某个用户的某个角色
  delUserRole (conditions) {
    const sql = 'DELETE FROM `user_role` WHERE ' + ' user_id = ' + conditions.user_id + ' AND ' + ' role_id = ' + conditions.role_id
    return new Promise((resolve, reject) => {
      DB
      .instance('w')
      .query(sql)
      .then((result) => {
        resolve(result)
      })
      .catch((err) => {
        reject(err)
      })
    })
  },
  // 删除某个角色对应的所有的权限
  delRoleAccessByRoleId (conditions) {
    const sql = 'DELETE FROM `role_access` WHERE role_id = ' + conditions.role_id
    return new Promise((resolve, reject) => {
      DB
      .instance('w')
      .query(sql)
      .then((result) => {
        resolve(result)
      })
      .catch((err) => {
        reject(err)
      })
    })
  },
  // 根据access_id，删除role_access表中的记录
  delRoleAccessByAccessId (conditions) {
    const sql = 'DELETE FROM `role_access` WHERE access_id = ' + conditions.access_id
    return new Promise((resolve, reject) => {
      DB
      .instance('w')
      .query(sql)
      .then((result) => {
        resolve(result)
      })
      .catch((err) => {
        reject(err)
      })
    })
  },
  // 根据user_id，删除user_role表中的记录
  delUserRoleByUserId (conditions) {
    const sql = 'DELETE FROM `user_role` WHERE user_id = ' + conditions.user_id
    return new Promise((resolve, reject) => {
      DB
      .instance('w')
      .query(sql)
      .then((result) => {
        resolve(result)
      })
      .catch((err) => {
        reject(err)
      })
    })
  },
  // 获取院系列表
  getDepartment () {
    return new Promise((resolve, reject) => {
      DB
      .instance('r')
      .select('department', {}, { department_id: 0 })
      .then((departmentArr) => {
        resolve(departmentArr)
      })
      .catch((err) => {
        reject(err)
      })
    })
  },
  // 获取科目列表
  getSubject () {
    return new Promise((resolve, reject) => {
      DB
      .instance('r')
      .select('subject', {}, { subject_id: 0 })
      .then((subjectArr) => {
        resolve(subjectArr)
      })
      .catch((err) => {
        reject(err)
      })
    })
  },
  // 获取用户列表
  getUser () {
    return new Promise((resolve, reject) => {
      DB
      .instance('r')
      .select('user', {}, { user_id: 0 })
      .then((userArr) => {
        resolve(userArr)
      })
      .catch((err) => {
        reject(err)
      })
    })
  },
  // 添加院系
  addDepartment (insertData) {
    return new Promise((resolve, reject) => {
      DB
      .instance('w')
      .insert('department', insertData)
      .then((result) => {
        resolve(result)
      })
      .catch((err) => {
        reject(err)
      })
    })
  },
  // 添加科目
  addSubject (insertData) {
    return new Promise((resolve, reject) => {
      DB
      .instance('w')
      .insert('subject', insertData)
      .then((result) => {
        resolve(result)
      })
      .catch((err) => {
        reject(err)
      })
    })
  },
  // 添加班级
  addClass (insertData) {
    return new Promise((resolve, reject) => {
      DB
      .instance('w')
      .insert('class', insertData)
      .then((result) => {
        resolve(result)
      })
      .catch((err) => {
        reject(err)
      })
    })
  },
  // 添加用户
  addUser (insertData) {
    return new Promise((resolve, reject) => {
      DB
      .instance('w')
      .insert('user', insertData)
      .then((result) => {
        resolve(result)
      })
      .catch((err) => {
        reject(err)
      })
    })
  },
  // 批量添加用户
  async addUsers (userObjArr) {
    try {
      const resultArr = []
      for (let i = 0, len = userObjArr.length; i < len; i++) {
        const sql = 'select class_id from class where class_name="' + userObjArr[i].class_name + '"'
        const classIdArr = await DB.instance('r').query(sql)
        // 班级不存在
        console.log(classIdArr)
        if (classIdArr.length === 0) {
          return resultArr
        }
        const insertData = {
          username: userObjArr[i].username,
          real_name: userObjArr[i].real_name,
          student_num: userObjArr[i].student_num,
          sex: userObjArr[i].sex,
          class_name: userObjArr[i].class_name,
          department_name: userObjArr[i].department_name,
          phone_num: userObjArr[i].phone_num,
          qq_num: userObjArr[i].qq_num,
          created_time: moment().unix(),
          updated_time: moment().unix(),
          class_id: classIdArr[0].class_id
        }
        const result = await DB.instance('w').insert('user', insertData)
        resultArr.push(result)
      }
      return resultArr
    } catch (e) {
      throw new Error(e)
    }
  },
  // 删除院系
  delDepartment (conditions) {
    return new Promise((resolve, reject) => {
      DB
      .instance('w')
      .delete('department', conditions)
      .then((result) => {
        resolve(result)
      })
      .catch((err) => {
        reject(err)
      })
    })
  },
  // 删除科目
  delSubject (conditions) {
    return new Promise((resolve, reject) => {
      DB
      .instance('w')
      .delete('subject', conditions)
      .then((result) => {
        resolve(result)
      })
      .catch((err) => {
        reject(err)
      })
    })
  },
  // 删除班级
  delClass (conditions) {
    return new Promise((resolve, reject) => {
      DB
      .instance('w')
      .delete('class', conditions)
      .then((result) => {
        resolve(result)
      })
      .catch((err) => {
        reject(err)
      })
    })
  },
  // 删除用户
  delUser (conditions) {
    return new Promise((resolve, reject) => {
      DB
      .instance('w')
      .delete('user', conditions)
      .then((result) => {
        resolve(result)
      })
      .catch((err) => {
        reject(err)
      })
    })
  },
  // 更新用户信息
  updateUser (updateData, conditions) {
    return new Promise((resolve, reject) => {
      DB
      .instance('w')
      .update('user', updateData, conditions)
      .then((result) => {
        resolve(result)
      })
      .catch((err) => {
        reject(err)
      })
    })
  },
  // 查询一个用户是否存在
  async getOne (conditions) {
    try {
      const userData = await DB.instance('r').select('user', conditions)
      return userData
    } catch (e) {
      await e
    }
  }
}

module.exports = Admin
