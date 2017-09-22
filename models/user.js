'use strict'

const Async = require('async');
const DB = require('../db');

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
                        userRoleData = userRoleData[0];
                        cb(null, userRoleData.role_id);
                    })  
                    .catch((err) => {
                        reject(err);
                    });
                },
                //根据用户的 角色id 获取用户的 权限id：表role_access
                (role_id, cb) => {
                    DB
                    .instance('w')
                    .select('role_access', { role_id: role_id })
                    .then((roleAccessData) => {
                        roleAccessData = roleAccessData[0];
                        cb(null, roleAccessData.access_id);
                    })
                    .catch((err) => {
                        reject(err);
                    });
                },
                // 根据用户的 权限id 获取用户的 权限(也就是能够请求的地址)：表access
                (access_id, cb) => {
                    DB
                    .instance('w')
                    .select('access', { access_id: access_id })
                    .then((accessData) => {
                        cb(null, accessData);
                    })
                    .catch((err) => {
                        reject(err);
                    });
                }
            ], (err, accessData) => {
                if(err) {
                    reject(err);
                }
                resolve(accessData);
            });

        });
    }
};

module.exports = User;