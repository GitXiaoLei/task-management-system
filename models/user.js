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
    
};

module.exports = User;