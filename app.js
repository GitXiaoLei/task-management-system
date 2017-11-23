'use strict'

const express = require('express')
const bodyParser = require('body-parser')
// const session = require('express-session')
const ckParser = require('cookie-parser')
const helmet = require('helmet')
/**
 * 自己写的中间件
 */
const Output = require('./middlewares/output')
const Auth = require('./middlewares/auth')
const RBAC = require('./middlewares/rbac')

const app = express()
// 监听端口
const port = 3000

// 中间件
app.use(ckParser())
app.use(bodyParser.raw({
  type: 'text/xml'
}))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(helmet())

app.engine('.html', require('express-art-template'))
app.set('view engine', 'html')
app.set('view options', {
  debug: process.env.NODE_ENV !== 'production'
})
app.set('views', 'public/views')
app.use('/static', express.static('public'))

// 设置跨域访问
app.all('*', function (req, res, next) {
  // 允许跨域
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  // 允许接受跨域的cookie
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('X-Powered-By', '3.2.1')
  // res.header("Content-Type", "application/json;charset=utf-8");
  next()
})

app.use(Output.init)
app.use(Auth.init)
app.use(RBAC.init)

/**
 * 路由
 */
require('./routes/admin/admin')(app)
require('./routes/user/api')(app)
require('./routes/user/web')(app)

app.listen(port, (err) => {
  if (err) {
    console.log('监听端口失败')
  }
  console.log('正在监听...')
})

// 定时任务
// let i = 1
// const schedule = require("node-schedule")
// var rule1     = new schedule.RecurrenceRule()
// var times1    = [1,6,11,16,21,26,31,36,41,46,51,56]
// rule1.second  = times1
// schedule.scheduleJob(rule1, function(){  
//   console.log('执行' + i++)
// });  
