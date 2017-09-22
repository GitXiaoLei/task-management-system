const jwt = require('jsonwebtoken');
const Auth = require('./middlewares/auth');

const token = Auth.generateToken(1);
console.log(token);
console.log(Auth.verify(token));