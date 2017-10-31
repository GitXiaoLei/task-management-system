const fs = require('fs')

fs.readFile('./db.js', (err, data) => {
  if (err) {
    return console.error(err)
  }
  console.log('异步读取：' + data.toString())
})