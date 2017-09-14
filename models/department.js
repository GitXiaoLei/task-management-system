'use strict'

const async = require('async');
const DB = require('../db');

// 表名
const _dbtable = 'department';

/**
 * 院系模型
 */
const Department = {
    /**
     * 获取所有的院系
     */
    getAll() {
        return new Promise((resolve, reject) => {
            console.log('1~');
            DB
                .instance('r')
                .select(_dbtable)
                .then((rows) => {
                    resolve(rows);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
};

module.exports = Department;