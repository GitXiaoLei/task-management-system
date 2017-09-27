'use strict'

const jwt = require('jsonwebtoken')
const User = require('../models/user')
// const uuid = require('uuid')
// const serverInfo = require('../config/server')

const _secret = 'task'
let _authInfo = null

const Auth = {
  /**
   * 初始化：将“加了密”的token“解密”成对象形式的信息
   */
  async init (req, res, next) {
    let token

    token = req.cookies.authorization
    _authInfo = Auth.verify(token)
    // 将解析后的auth挂在到req对象下
    req._authInfo = _authInfo
    // 将用户的信息挂载到req对象下面
    if (_authInfo) {
      const userInfo = await User.getUserById(_authInfo.uid)
      req._userInfo = {
        user_id: userInfo.user_id,
        username: userInfo.username
      }
    }
    next()
  },
  /**
   * 生成授权令牌
   * @param {Number} uid 用户id
   */
  generateToken (uid) {
    const info = {
      uid: uid,
      expiresIn: '365d'
    }
    const token = jwt.sign(info, _secret)
    return token
  },
  /**
   * 验证授权令牌
   * @param {String} token 授权令牌
   * @return Object tokeninfo，令牌中携带的信息对象
   */
  verify (token) {
    let decoded = false
    try {
      decoded = jwt.verify(token, _secret)
    } catch (e) {
      decoded = false
    }
    return decoded
  },
  /**
   * 获取认证信息
   * @return Object 用户认证信息，包含uid等
   */
  authInfo () {
    return _authInfo
  }

}

module.exports = Auth
