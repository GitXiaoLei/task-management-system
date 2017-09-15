'use strict'

const Async = require('async');
const Department = require('../../models/teacher');

const route = (app) => {
    /**
     * 院系管理页面
     */
    app.get('/admin/teacher', (req, res) => {
        let obj = { type: 3 };
        res.render('admin/department.art', obj);
    });
};

module.exports = route;