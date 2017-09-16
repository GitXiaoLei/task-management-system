'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();
// 监听端口
const port = 3000;

// 中间件
app.use(bodyParser.raw({
    type: 'text/xml'
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'art');
app.engine('art', require('express-art-template'));
app.set('views', 'public/views');

app.use('/static', express.static('public'));


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