'use strict'

const Async = require('async')
const DB = require('../db')
// const Auth = require('../middlewares/auth')
const Output = require('../middlewares/output')
const Util = require('../public/utils/util')

/**
 * RBAC 处理权限的中间件
 */

const RBAC = {
  /**
   * 初始化
   */
  init (req, res, next) {
    // 未登录
    if (!req._authInfo) {
      // 没有权限访问资源
      req._canVisit = false
      // 用户角色名设置为guest(游客)：只有游客的类型才为字符串，其他角色的都为数组类型
      req._role = 'guest'
      next()
    } else {
    // 已登录
      // 请求权限
      RBAC
      .getSudo(req._authInfo.uid)
      .then((accessUrlArr) => {
        // 将改地址改用户能不能访问的布尔值挂载到req对象下：true表示能访问该地址，false表示不能访问该地址
        req._canVisit = RBAC.canVisit(accessUrlArr, req.path)
        // 请求角色
        RBAC
        .getRole(req._authInfo.uid)
        .then((roleNameArr) => {
          req._role = roleNameArr
          next()
        })
        .catch((err) => {
          Output.apiErr(err)
        })
      })
      .catch((err) => {
        Output.apiErr(err)
      })
    }
  },
  /**
   * 获取用户的权限：也就是能够请求的地址
   * @param {Number} uid 用户id
   */
  getSudo (uid) {
    return new Promise((resolve, reject) => {
      Async.waterfall([
        // 根据 用户id 获取用户的 角色id：表user_role
        (cb) => {
          DB
          .instance('r')
          .select('user_role', { user_id: uid })
          .then((userRoleData) => {
            let roleIdArr = []
            userRoleData.forEach((userRole) => {
              roleIdArr.push(userRole.role_id)
            })
            cb(null, roleIdArr)
          })
          .catch((err) => {
            reject(err)
          })
        },
        // 根据用户的 角色id 获取用户的 权限id：表role_access
        (roleIdArr, cb) => {
          // console.log(roleIdArr)
          let sql = 'SELECT * FROM `' + 'role_access' + '` WHERE '
          roleIdArr.forEach((roleId, i, arr) => {
            if (arr.length - 1 !== i) {
              sql += 'role_id = ' + roleId + ' OR '
            } else {
              sql += ' role_id = ' + roleId
            }
          })
          DB
          .instance('r')
          .query(sql)
          .then((roleAccessData) => {
            let accessIdArr = []
            roleAccessData.forEach((roleAccess) => {
              accessIdArr.push(roleAccess.access_id)
            })
            // 去除重复的access_id
            accessIdArr = Util.removeSome(accessIdArr)
            cb(null, accessIdArr)
          })
          .catch((err) => {
            reject(err)
          })
        },
        // 根据用户的 权限id 获取用户的 权限(也就是能够请求的地址)：表access
        (accessIdArr, cb) => {
          if (accessIdArr.length === 0) {
            resolve(accessIdArr)
          }
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
            let accessUrlArr = []
            accessData.forEach((access) => {
              accessUrlArr.push(access.access_url)
            })
            accessUrlArr = Util.removeSome(accessUrlArr)
            cb(null, accessUrlArr)
          })
          .catch((err) => {
            reject(err)
          })
        }
      ], (err, accessUrlArr) => {
        if (err) {
          reject(err)
        }
        resolve(accessUrlArr)
      })
    })
  },
  /**
   * 获取用户角色名
   * @param {Number} uid 用户id
   */
  getRole (uid) {
    return new Promise((resolve, reject) => {
      Async.waterfall([
        // 根据uid获取 用户角色的id：表user_role
        (cb) => {
          DB
          .instance('r')
          .select('user_role', { user_id: uid })
          .then((userRoles) => {
            const roleIdArr = []
            userRoles.forEach((userRole) => {
              roleIdArr.push(userRole.role_id)
            })
            cb(null, roleIdArr)
          })
          .catch((err) => {
            reject(err)
          })
        },
        // 根据角色的id获取 角色名：表role
        (roleIdArr, cb) => {
          let sql = 'SELECT * FROM `' + 'role' + '` WHERE '
          roleIdArr.forEach((roleId, i, arr) => {
            if (arr.length - 1 !== i) {
              sql += ' role_id = ' + roleId + ' or '
            } else {
              sql += ' role_id = ' + roleId
            }
          })
          DB
          .instance('r')
          .query(sql)
          .then((roleNames) => {
            const roleNameArr = []
            roleNames.forEach((roleName) => {
              roleNameArr.push(roleName.role_name)
            })
            cb(null, roleNameArr)
          })
          .catch((err) => {
            reject(err)
          })
        }
      ], (err, roleNameArr) => {
        if (err) {
          reject(err)
        }
        resolve(roleNameArr)
      })
    })
  },
  /**
   * 是否能够访问相关资源
   * @param {Array} accessData 从数据库中获取的权限url列表
   * @param {String} path 访问资源的地址
   * @return Boolean true：能够访问，false：不能访问
   */
  canVisit (accessUrlArr, path) {
    let can = false
    accessUrlArr.forEach((url) => {
      if (url === path) {
        can = true
      }
    })
    return can
  },
  /**
   * 判断用户是否是超级管理员
   * @param {Array} roleNameArr 角色名
   */
  isSuperAdmin (roleNameArr) {
    let flag = false
    roleNameArr.forEach((roleName) => {
      if (roleName === 'superAdmin') {
        flag = true
      }
    })
    return flag
  },
  /**
   * 判断用户是否仅仅是管理员
   * @param {Array} roleNameArr 角色名
   */
  isAdmin (roleNameArr) {
    let superFlag = false
    let adminFlag = false
    roleNameArr.forEach((roleName) => {
      if (roleName === 'superAdmin') {
        superFlag = true
      }
      if (roleName === 'admin') {
        adminFlag = true
      }
    })
    return !superFlag && adminFlag
  }
}

module.exports = RBAC
