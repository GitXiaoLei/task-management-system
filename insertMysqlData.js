const DB = require('./db');
const Moment = require('moment');

let recordCount = 120;
let tbname = 'user';
let addTime = 0;


/**
 * 生成老师、学生数据
 */
function genTeacherData() {
    let dtArr = ['1院系', '2院系', '3院系', '4院系', '5院系', '6院系'];
    let classArr = ['1班', '2班', '3班', '4班', '5班', '6班'];
    let words = 'abcdefghijklmnopqrstuvwxyz';
    let num = '1234567890';
    let data = {
        role: Math.random() > 0.5 ? 1 : 2,
        username: generateUtil.username(words),
        password: generateUtil.password(num),
        real_name: generateUtil.realname(words),
        sex: generateUtil.sex(),
        department: generateUtil.department(dtArr),
        created: Moment().unix() + (++addTime),//防止每条记录创建的时间一样
        modified: Moment().unix() + addTime
    };
    console.log('++++++++++++++++++++++++')
    
    // 学生才有class
    if(data.role === 2) {
        data.class = classArr[generateUtil.random(0, 5)];
    }
    return data;
}

/**
 * 生成数据的工具函数：随机
 */
var generateUtil = {
    // 生成sex
    sex() {
        return this.random(0, 2);
    },
    // 生成随机数
    random(min, max) {
        let randomNum = Math.random() * (max + 1 - min) + min;
        return Math.floor(randomNum);
    },
    // 生成username
    username(words) {
        let len = 5;
        let username = '';
        for(let i = 0; i < len; i++) {
            let pos = this.random(0, 25);
            username += words[pos];
        }
        return username;
    },
    // 生成password
    password(num) {
        let len = 4;
        let password = '';
        for(let i = 0; i < len; i++) {
            let pos = this.random(0, 9);
            password += num[pos];
        }
        return password;
    },
    // 生成real_name
    realname(words) {
        let len = 3;
        let realname = '';
        for(let i = 0; i < len; i++) {
            let pos = this.random(0, 25);
            realname += words[pos];
        }
        return realname;
    },
    // 生成院系
    department(arr) {
        return arr[this.random(0, 5)];
    }
};

for(let i = 0; i < recordCount; i++) {
    let data = genTeacherData();
    DB
        .instance('w')
        .insert(tbname, data)
        .then((result) => {
            console.log('success', i);
        })
        .catch((err) => {
            console.log(err);
        });
}