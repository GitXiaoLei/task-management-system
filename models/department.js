'use strict'

const async = require('async')
const DB = require('../db')

// 表名
const _dbtable = 'department'

/**
 * 院系模型
 */
const Department = {
  /**
   * 获取所有的院系
   */
  getAll () {
    return new Promise((resolve, reject) => {
      DB
        .instance('r')
        .select(_dbtable)
        .then((rows) => {
          resolve(rows)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  /**
   * 添加院系
   * @param {Object} data 院系信息
   * @return Promise
   */
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
   * 删除一个院系
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

module.exports = Department
