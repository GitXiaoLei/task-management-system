'use strict'

const async = require('async');
const DB = require('../db');
const Moment = require('moment');

// 表名
const tableName = 'user';

/**
 * 院系模型
 */
const Student = {
    /**
     * 获取学生的账号信息(分页)
     */
    getStudentInfo(page, limit) {
        return new Promise((resolve, reject) => {

            DB
                .instance('r')
                .selectOnePage(tableName, { role: 2 }, { created: 0 }, page, limit)
                .then((students) => {
                    resolve(students);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    /**
     * 获取老师数量
     */
    getStudentCount() {
        return new Promise((resolve, reject) => {
            DB
                .instance('r')
                .selectCount(tableName, { role: 2 })
                .then((count) => {
                    resolve(count);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    /**
     * 添加一位学生的账号
     * @param {Object} data 账号信息，如：{ username: 'Tom', age: 21 }
     * @return Promise
     */
    addOne(data) {
        // 账号创建时间
        data.created = Moment().unix();
        data.modified = data.created;
        data.role = 2;
        return new Promise((resolve, reject) => {
            DB
                .instance('w')
                .insert(tableName, data)
                .then((result) => {
                    resolve(result);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
     /**
     * 更新一位学生的账号
     * @param {Object} data 修改的数据，如：{ name: 'Jack', age: 31 }
     * @param {Object} conditions where条件，如{ uid: 1 }，修改uid为1用户的信息
     */
    UpdateOne(data, conditions) {
        // 账号信息修改时间
        data.modified = Moment().unix();
        return new Promise((resolve, reject) => {
            DB
                .instance('w')
                .update(tableName, data, conditions)
                .then((result) => {
                    resolve(result);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    /**
     * 删除一位学生的账号
     */
    delOne(conditions) {
        return new Promise((resolve, reject) => {
            DB
                .instance('w')
                .delete(tableName, conditions)
                .then((result) => {
                    resolve(result);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
};

module.exports = Student;