'use strict'

const Async = require('async');
const Department = require('../../models/student');

const route = (app) => {
    /**
     * 院系管理页面
     */
    app.get('/admin/student', (req, res) => {
        let obj = { type: 4 };
        res.render('admin/department.art', obj);
    });
};

module.exports = route;