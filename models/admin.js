'use strict'

const async = require('async');
const DB = require('../db');

/**
 * 院系模型
 */
const Admin = {
    // 获取所有权限
    getAccess() {
        return new Promise((resolve, reject) => {
            DB
            .instance('r')
            .select('access')
            .then((accessArr) =>{
                resolve(accessArr);
            })
            .catch((err) => {
                reject(err);
            });
        });
    },
    /**
     * 添加权限
     * @param {Object} insetData 插入的数据，如{ access_title: '首页', access_url: '/' }
     * @return Promise
     */
    addAccess(insetData) {
        return new Promise((resolve, reject) => {
            DB
            .instance('w')
            .insert('access', insetData)
            .then((result) => {
                resolve(result);
            })
            .catch((err) => {
                reject(err);
            });
        });
    },
    /**
     * 更新权限
     * @param {Object} updateData 要更新的字段，如{ access_title: '登录页' }
     * @param {Object} conditions 条件，如{ access_id: 1 }
     * @return Promise
     */
    updateAccess(updateData, conditions) {
        return new Promise((resolve, reject) => {
            DB
            .instance('w')
            .update('access', updateData, conditions)
            .then((result) => {
                resolve(result);
            })
            .catch((err) => {
                reject(err);
            });
        });
    },
    /**
     * 删除权限
     * @param {Object} conditions 条件，如{ access_id: 1 }
     * @return Promise
     */
    delAccess(conditions) {
        return new Promise((resolve, reject) => {
            DB
            .instance('w')
            .delete('access', conditions)
            .then((result) => {
                resolve(result);
            })
            .catch((err) => {
                reject(err);
            })
        });
    },

    // 获取所有角色
    getRole() {
        return new Promise((resolve, reject) => {
            DB
            .instance('r')
            .select('role')
            .then((roleArr) =>{
                resolve(roleArr);
            })
            .catch((err) => {
                reject(err);
            });
        });
    },
    /**
     * 添加角色
     * @param {Object} insetData 插入的数据，如{ role_name: 'teacher' }
     * @return Promise
     */
    addRole(insetData) {
        return new Promise((resolve, reject) => {
            DB
            .instance('w')
            .insert('role', insetData)
            .then((result) => {
                resolve(result);
            })
            .catch((err) => {
                reject(err);
            });
        });
    },
    /**
     * 删除角色
     * @param {Object} conditions 条件，如{ role_id: 1 }
     * @return Promise
     */
    delRole(conditions) {
        return new Promise((resolve, reject) => {
            DB
            .instance('w')
            .delete('role', conditions)
            .then((result) => {
                resolve(result);
            })
            .catch((err) => {
                reject(err);
            })
        });
    },
};

module.exports = Admin;