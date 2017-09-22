const jwt = require('jsonwebtoken');

let token = jwt.sign({
    expiresIn: '1h',
    uid: 1
}, 'secret');

console.log(token);

console.log( jwt.verify(token, 'secret') );