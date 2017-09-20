'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const Output = require('./middlewares/output');
const session = require('express-session');
const ckParser = require('cookie-parser');
const helmet = require('helmet');

const app = express();
// 监听端口
const port = 3000;

// 中间件
app.use(bodyParser.raw({
    type: 'text/xml'
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(helmet());

app.set('view engine', 'art');
app.engine('art', require('express-art-template'));
app.set('views', 'public/views');

app.use('/static', express.static('public'));

app.use(ckParser());
// session
app.use(session({
    secret: 'tmssess',
    cookie: { maxAge: 1440*60*1000, httpOnly: true },
    saveUninitialized: false,
    resave: false
}));

// response输出响应封装
app.use(Output.init);

// 重定向到首页
app.get('/', (req, res) => {
    // Output.redirect('/home');
    console.log(req.session);
    if(req.session.isVisit) {
        Output.apiData(`第${++req.session.isVisit}次访问~`)
    }else {
        req.session.isVisit = 1;
        Output.apiData(`第${++req.session.isVisit}次访问~`)
    }
    console.log(req.cookies);

});

// 首页
app.get('/home', (req, res) => {
    if(!req.session.role && req.session.role !== 0) {
        Output.render('user/index.art', {
            name: '没有登录...'
        });
    }
    // 管理员
    if(req.session.role === 0) {
        Output.render('user/index.art', {
            name: '管理员 - 登录了！！！'
        });
    }
    // 老师
    if(req.session.role === 1) {
        Output.render('user/index.art', {
            name: '老师 - 登录了！！！'
        });
    }
    // 学生
    if(req.session.role === 2) {
        Output.render('user/index.art', {
            name: '学生 - 登录了！！！'
        });
    }
});
app.post('/home/login', (req, res) => {

});

/**
 * 路由
 */
require('./routes/admin/department')(app);
require('./routes/admin/subject')(app);
require('./routes/admin/teacher')(app);
require('./routes/admin/student')(app);

app.listen(port, (err) => {
    if(err) {
        console.log('监听端口失败');
    }
    console.log('正在监听...');
})