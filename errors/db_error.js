'use strict'

const BaseError = require('./base_error')

class DBError extends BaseError {
  /**
   * 构造函数
   * @param {Number} code 错误码
   * @param {String} message 错误消息
   * @param {error} orierror 原始错误
   */
  constructor (code, message, orierror) {
    super(DBError.name, code, message, orierror)

    this.name = DBError.name
    this.code = code
    this.message = message || (orierror && orierror.message) || '未知的数据库错误(DBError)'
    this.severity = 5
  }
}

module.exports = DBError
