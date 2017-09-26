'use strict'

const DB = require('../db')
const Async = require('async')
const Util = require('../public/utils/util')

/**
 * 院系模型
 */
const Admin = {
  // 获取所有权限
  getAccess () {
    return new Promise((resolve, reject) => {
      DB
      .instance('r')
      .select('access')
      .then((accessArr) => {
        resolve(accessArr)
      })
      .catch((err) => {
        reject(err)
      })
    })
  },
  /**
   * 添加权限
   * @param {Object} insetData 插入的数据，如{ access_title: '首页', access_url: '/' }
   * @return Promise
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
      .select('role')
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
  // 获取院系列表
  getDepartment () {
    return new Promise((resolve, reject) => {
      DB
      .instance('r')
      .select('department')
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
      .select('subject')
      .then((subjectArr) => {
        resolve(subjectArr)
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
  }
}

module.exports = Admin
