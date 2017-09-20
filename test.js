const jwt = require('jsonwebtoken');

// jwt生成token
const token = jwt.sign({
    name: 123
}, 'secret', {
    expiresIn: '5h'//到期时间
});

console.log(token);
setTimeout(() => {
    jwt.verify(token, 'secret', (err, decoded) => {
        if(!err) {
                console.log(decoded);
        }
    })
}, 6000)
    
