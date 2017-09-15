'use strict'

const Async = require('async');
const Department = require('../../models/department');

const route = (app) => {
    /**
     * 院系管理页面
     */
    app.get('/admin/department', (req, res) => {
        let obj = { type: 1 };
        res.render('admin/department.art', obj);
    });
};

module.exports = route;