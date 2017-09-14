'use strict'

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const port = 3000;

// 中间件
// app.use(restime());
app.use(bodyParser.raw({
    type: 'text/xml'
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * api路由
 */
require('./routes/api/department')(app);

app.listen(port, (err) => {
    if(err) {
        console.log('监听端口失败');
    }
    console.log('正在监听...');
})