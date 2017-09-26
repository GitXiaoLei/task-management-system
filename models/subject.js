'use strict'

const async = require('async')
const DB = require('../db')

// 表名
const _dbtable = 'subject'

/**
 * 院系模型
 */
const Subject = {
    /**
     * 获取所有的院系
     */
  getAll () {
      return new Promise((resolve, reject) => {
          DB
                .instance('r')
                .select(_dbtable)
                .then((subjects) => {
                  resolve(subjects)
                })
                .catch((err) => {
                  reject(err)
                })
        })
    },
    // 添加科目
  addOne (data) {
      return new Promise((resolve, reject) => {
          DB
                .instance('w')
                .insert(_dbtable, data)
                .then((result) => {
                  resolve(result)
                })
                .catch((err) => {
                  reject(err)
                })
        })
    },
    /**
     * 删除一个科目
     *
     * @param {Object} conditions
     */
  delOne (conditions) {
      return new Promise((resolve, reject) => {
          DB
                .instance('w')
                .delete(_dbtable, conditions)
                .then((result) => {
                  resolve(result)
                })
                .catch((err) => {
                  reject(err)
                })
        })
    }
}

module.exports = Subject
