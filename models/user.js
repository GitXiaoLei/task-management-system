'use strict'

const Async = require('async');
const DB = require('../db');
const Util = require('../helper/util');

// 表名
const _dbtable = 'user';

/**
 * 用户模型
 */
const User = {
    /**
     * 
     * @param {Number} uid 获取一个用户的信息
     */
    getOne(username) {
        return new Promise((resolve, reject) => {
            DB
            .instance('r')
            .select(_dbtable, { username: username })
            .then((userData) => {
                resolve(userData[0]);
            })
            .catch((err) => {
                reject(err);
            });
        }); 
    },
    /**
     * 获取用户的权限：也就是能够请求的地址
     * @param {Number} uid 用户id
     */
    getSudo(uid) {
        return new Promise((resolve, reject) => {
            Async.waterfall([
                // 根据 用户id 获取用户的 角色id：表user_role
                (cb) => {
                    DB
                    .instance('w')
                    .select('user_role', { user_id: uid })
                    .then((userRoleData) => {
                        let roleIdArr = [];
                        userRoleData.forEach((userRole) => {
                            roleIdArr.push(userRole.role_id);
                        });
                        cb(null, roleIdArr);
                    })
                    .catch((err) => {
                        reject(err);
                    });
                },
                //根据用户的 角色id 获取用户的 权限id：表role_access
                (roleIdArr, cb) => {
                    let sql = 'SELECT * FROM `' + 'role_access' + '` WHERE ';
                    roleIdArr.forEach((roleId, i, arr) => {
                        if(arr.length - 1 !== i) {
                            sql += 'role_id = ' + roleId + ' OR ';
                        }else {
                            sql += ' role_id = ' + roleId;
                        }
                    });
                    DB
                    .instance('w')
                    .query(sql)
                    .then((roleAccessData) => {
                        let accessIdArr = [];
                        roleAccessData.forEach((roleAccess) => {
                            accessIdArr.push(roleAccess.access_id);
                        });
                        // 去除重复的access_id
                        accessIdArr = Util.removeSome(accessIdArr);
                        cb(null, accessIdArr);
                    })
                    .catch((err) => {
                        reject(err);
                    });
                },
                // 根据用户的 权限id 获取用户的 权限(也就是能够请求的地址)：表access
                (accessIdArr, cb) => {
                    let sql = 'SELECT * FROM `' + 'access' + '` WHERE ';
                    accessIdArr.forEach((accessId, i, arr) => {
                        if(arr.length - 1 !== i) {
                            sql += ' access_id = ' + accessId + ' OR ';
                        }else {
                            sql += ' access_id = ' + accessId;
                        }
                    });
                    DB
                    .instance('w')
                    .query(sql)
                    .then((accessData) => {
                        let accessUrlArr = [];
                        accessData.forEach((access) => {
                            accessUrlArr.push(access.access_url);
                        });
                        accessUrlArr = Util.removeSome(accessUrlArr);
                        cb(null, accessUrlArr);
                    })
                    .catch((err) => {
                        reject(err);
                    });
                }
            ], (err, accessUrlArr) => {
                if(err) {
                    reject(err);
                }
                resolve(accessUrlArr);
            });

        });
    },
};

module.exports = User;