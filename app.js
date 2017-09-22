'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const session = require('express-session');
const ckParser = require('cookie-parser');
const helmet = require('helmet');
/**
 * 自己写的中间件
 */
const Output = require('./middlewares/output');
const Auth = require('./middlewares/auth');

const app = express();
// 监听端口
const port = 3000;

// 中间件
app.use(ckParser());
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

// app.use(ckParser());
// session
// app.use(session({
//     secret: 'tmssess',
//     cookie: { maxAge: 1440*60*1000, httpOnly: true },
//     saveUninitialized: false,
//     resave: false
// }));

app.use(Output.init);
app.use(Auth.init);

/**
 * 路由
 */
require('./routes/api/user')(app);
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