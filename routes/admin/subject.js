'use strict'

const Async = require('async');
const Department = require('../../models/subject');

const route = (app) => {
    /**
     * 院系管理页面
     */
    app.get('/admin/subject', (req, res) => {
        let obj = { type: 2 };
        res.render('admin/department.art', obj);
    });
};

module.exports = route;