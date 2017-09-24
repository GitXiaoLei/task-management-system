'use strict'

const BaseError = require('./base_error')

class ParamError extends BaseError {
  /**
   * 构造函数
   * @param {Number} code 错误码
   * @param {String} message 错误消息
   * @param {error} orierror 原始错误
   * @return instance
   */
  constructor (code, message, orierror) {
    super(ParamError.name, code, message, orierror)

    this.name = ParamError.name
    this.code = code
    this.message = message || (orierror && orierror.message) || '未知的类型错误(ParamError)'
    this.severity = 3
  }
}

module.exports = ParamError
