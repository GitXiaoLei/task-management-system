'use strict'

let _req = null
let _res = null

const Output = {
  /**
   * 初始化
   */
  init (req, res, next) {
    _req = req
    _res = res
    next()
  },
  /**
   * 设置cookie
   * @param {String} name 名字
   * @param {String} val 值
   * @param {Number} expires 毫秒数
   */
  cookie (name, val, expires) {
    _res.cookie(name, val, {
      path: '/',
      expires: expires,
      httpOnly: true
    })
  },
  /**
   * 输出api响应：前端成功请求到数据
   * @param {Object} data 数据
   * @param {String} message 提示消息
   * @return null
   */
  apiData (data = {}, message = '') {
    _res.json({
      code: 1,
      message: message,
      data: data
    })
  },
  /**
   * 输出api错误响应：前端请求数据失败
   * @param {Error} err 错误，集成自BaseError的错误类实例
   * @param {Object} data 数据
   * @return null
   */
  apiErr (err = {}, data) {
    let code = err.code || 0
    let message = err.message || '未知错误'
    _res.json({
      code: code,
      message: message,
      data: data
    })
  },
  /**
   * 输出页面
   * @param {String} view 页面路径
   * @param {Object} data 传入页面的数据
   * @return null
   */
  render (view, data = {}) {
    _res.render(view, data)
  },
  /**
   * 重定向
   * @param  {string} url [重定向地址]
   * @return null
   */
  redirect: (url) => {
    _res.redirect(url)
  }
}

module.exports = Output
