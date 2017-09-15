'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');

const app = express();
// 监听端口
const port = 3000;

// 中间件
// app.use(restime());
app.use(bodyParser.raw({
    type: 'text/xml'
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/static', express.static('public'));
app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.set('views', 'public/views');

/**
 * api路由
 */
require('./routes/admin/department')(app);

app.listen(port, (err) => {
    if(err) {
        console.log('监听端口失败');
    }
    console.log('正在监听...');
})