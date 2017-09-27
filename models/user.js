'use strict'

const DB = require('../db')

// 表名
const _dbtable = 'user'

/**
 * 用户模型
 */
const User = {
  // 获取一个用户的信息：通过username
  getOne (username) {
    return new Promise((resolve, reject) => {
      DB
      .instance('r')
      .select(_dbtable, { username: username })
      .then((userData) => {
        resolve(userData[0])
      })
      .catch((err) => {
        reject(err)
      })
    })
  },
  // 获取一个用户的信息，通过user_id
  async getUserById (uid) {
    const userInfo = await DB.instance('r').select('user', { user_id: uid })
    return userInfo
  },
  // 老师添加自己所教的科目：teacher_subject表
  addTeacherSubject (insertData) {
    return new Promise((resolve, reject) => {
      DB
      .instance('w')
      .insert('teacher_subject', insertData)
      .then((result) => {
        resolve(result)
      })
      .catch((err) => {
        reject(err)
      })
    })
  },
  // 老师为自己的某个科目添加班级：subject_class表
  addSubjectClass (insertData) {
    return new Promise((resolve, reject) => {
      DB
      .instance('w')
      .insert('subject_class', insertData)
      .then((result) => {
        resolve(result)
      })
      .catch((err) => {
        reject(err)
      })
    })
  },
  // 老师删除自己所教的科目：teacher_subject表
  async delTeacherSubject (conditions) {
    try {
      return await DB.instance('w').delete('teacher_subject', conditions)
    } catch (e) {
      return e
    }
  },
  // 老师删除自己的某个科目下的某个班级：teacher_subject表
  async delSubjectClassById (conditions) {
    try {
      return await DB.instance('w').delete('subject_class', conditions)
    } catch (e) {
      return e
    }
  },
  // 获取teacher_subject表中的记录
  async getTeacherSubjectById (id) {
    try {
      return await DB.instance('r').select('teacher_subject')
    } catch (e) {
      return e
    }
  },
  // 通过subject_id的数组来删除subject_class表的记录
  async delSubjectClassBySubjectIdArr (subjectIdArr) {
    let sql = 'DELETE FROM `subject_class` WHERE '
    subjectIdArr.forEach((subjectId, i, arr) => {
      if (arr.length - 1 !== i) {
        sql += ' subject_id = ' + subjectId + ' OR '
      } else {
        sql += ' subject_id = ' + subjectId
      }
    })
    try {
      return await DB.instance('w').query(sql)
    } catch (e) {
      return e
    }
  }
}

module.exports = User
