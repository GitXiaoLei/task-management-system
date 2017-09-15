'use strict'

const Async = require('async');
const Department = require('../../models/department');

const route = (app) => {

    app.get('/admin/department', (req, res) => {
        
        res.render('admin/m_department.html');

        // Department
        //     .getAll()
        //     .then((rows) => {
        //         res.json((rows));
        //     });
    });
};

module.exports = route;