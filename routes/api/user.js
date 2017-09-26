'use strict'

const Auth = require('../../middlewares/auth')
const User = require('../../models/user')
const Output = require('../../middlewares/output')

const route = (app) => {
  // 用户登录
  app.post('/login', (req, res) => {
    const username = req.body.username
    const password = req.body.password
    User
    .getOne(username)
    .then((userData) => {
      // 在数据库中没有找到该用户
      if (!userData) {
        Output.apiErr({ code: 0, message: '用户名或密码错误' })
      }
      // 密码不正确
      if (userData.password !== password) {
        Output.apiErr({ code: 0, message: '用户名或密码错误' })
      }
      const token = Auth.generateToken(userData.user_id)
      // 将token放在cookie里
      Output.cookie('authorization', token, new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))
      Output.apiData({}, '登录成功')
    })
    .catch((err) => {
      Output.apiErr(err)
    })
  })
  // 退出登录
  app.get('/loginout', (req, res) => {
    // 将token设置为空
    Output.cookie('authorization', '', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))
    Output.apiData({}, '退出成功')
  })
}

module.exports = route
