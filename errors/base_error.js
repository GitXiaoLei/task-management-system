'use strict'

class BaseError extends Error {
  /**
   * 构造函数
   * @param {*} name
   * @param {Number} code 错误码
   * @param {String} message 错误消息
   * @param {error} orierror 原始错误
   * @return BaseError实例
   */
  constructor (name, code, message, orierror) {
    super(message)
    this.code = code
    this.message = message || (orierror && orierror.message) || '未知错误'
    this.orierror = orierror
    this.severity = 1
  }
}

module.exports = BaseError
