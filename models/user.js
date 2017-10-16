'use strict'

const DB = require('../db')
const Async = require('async')
const Util = require('../public/utils/util')

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
  // 老师获取自己所教的课程id，通过user_id
  async getTeacherSubjectIdArr (uid) {
    try {
      const teacherSubjectArr = await DB.instance('r').select('teacher_subject', { user_id: uid })
      const subjectIdArr = []
      if (teacherSubjectArr.length !== 0) {
        teacherSubjectArr.forEach((teacherSubject) => {
          subjectIdArr.push(teacherSubject.subject_id)
        })
      }
      return subjectIdArr
    } catch (e) {
      throw new Error(e)
    }
  },
  // 老师添加自己所教的课程：teacher_subject表
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
    let sql = 'DELETE FROM `teacher_subject` WHERE user_id = ' + conditions.user_id + ' AND subject_id = ' + conditions.subject_id
    try {
      return await DB.instance('w').query(sql)
    } catch (e) {
      throw new Error(e)
    }
  },
  // 老师删除自己的某个科目下的某个班级：teacher_subject表
  async delSubjectClassById (conditions) {
    try {
      const tsIds = DB.instance('r').query('select teacher_subject_id from teacher_subject where user_id = ' + conditions.user_id + ' and subject_id = ' + conditions.subject_id)
      const result = DB.instance('w').query('delete from teacher_subject_class where teacher_subject_id = ' + tsIds[0] + ' and class_id = ' + conditions.class_id)
      return result
    } catch (e) {
      throw new Error(e)
    }
  },
  // 获取teacher_subject表中的记录
  async getTeacherSubjectById (conditions) {
    try {
      return await DB.instance('r').select('teacher_subject', conditions)
    } catch (e) {
      throw new Error(e)
    }
  },
  // 通过subject_id的数组来删除teacher_subject_class表的记录
  async delTeacherSubjectClass (IdArr) {
    let sql = 'DELETE FROM `teacher_subject_class` WHERE '
    IdArr.forEach((teacherSubjectId, i, arr) => {
      if (arr.length - 1 !== i) {
        sql += ' teacher_subject_id = ' + teacherSubjectId + ' OR '
      } else {
        sql += ' teacher_subject_id = ' + teacherSubjectId
      }
    })
    console.log(sql)
    try {
      return await DB.instance('w').query(sql)
    } catch (e) {
      throw new Error(e)
    }
  },
  // 添加题目
  async addQuestion (insertData) {
    try {
      return await DB.instance('w').insert('question', insertData)
    } catch (e) {
      throw new Error(e)
    }
  },
  // 更新题目
  updateQuestion (updateData, conditions) {
    return new Promise((resolve, reject) => {
      DB
      .instance('w')
      .update('question', updateData, conditions)
      .then((result) => {
        resolve(result)
      })
      .catch((e) => {
        reject(e)
      })
    })
  },
  // 删除题目
  delQuestion (conditions) {
    return new Promise((resolve, reject) => {
      DB
      .instance('w')
      .delete('question', conditions)
      .then((result) => {
        resolve(result)
      })
      .catch((e) => {
        reject(e)
      })
    })
  },
  // 获取题目列表
  getQuestion () {
    return new Promise((resolve, reject) => {
      DB
      .instance('w')
      .select('question')
      .then((questionArr) => {
        resolve(questionArr)
      })
      .catch((e) => {
        reject(e)
      })
    })
  },
  // 通过id数组获取课程
  async getSubjectByIdArr (subjectIdArr) {
    try {
      const subjects = await DB.instance('r').selectOr('subject', 'subject_id', subjectIdArr)
      return subjects
    } catch (e) {
      throw new Error(e)
    }
  },
  // 获取某个老师的所教的科目列表
  async getSubject (uid) {
    let sql = 'SELECT * FROM subject WHERE subject_id in (SELECT subject_id FROM teacher_subject WHERE user_id = ' + uid + ')'
    try {
      const subjects = await DB.instance('r').query(sql)
      for (let i = 0,l = subjects.length; i < l; i++) {
        subjects[i].classes = await DB.instance('r').query('select * from class where class_id in (select class_id from teacher_subject_class where teacher_subject_id in (select teacher_subject_id from teacher_subject where subject_id = ' + subjects[i].subject_id + '))')
      }
      return subjects
    } catch (e) {
      throw new Error(e)
    }
  },
  // 获取某个老师的某个课程下的班级列表
  async getClasses (uid) {
    const classes = {}
    try {
      const teacherSubjects = await DB.instance('r').select('teacher_subject', {}, { teacher_subject_id: 0 })
      const ids = [],
            subjectIds = []
      for(let i = 0, l = teacherSubjects.length; i < l; i++) {
        ids.push(teacherSubjects[i].teacher_subject_id)
        subjectIds.push(teacherSubjects[i].subject_id)
      }
      for (let i = 0, l = subjectIds.length; i < l; i++) {
        const subjectName = await DB.instance('r').query('select subject')
      }
    } catch (e) {
      throw new Error(e)
    }
  },
  // 更新用户的username、real_name、sex、department、phone_num、qq_num
  async updateUserInfo (updateData, conditions) {
    try {
      const result = await DB.instance('w').update('user', updateData, conditions)
      return result
    } catch (e) {
      throw new Error(e)
    }
  },
  // 为某个课程添加班级
  async addTSC (insertData) {
    try {
      const tsIds = await DB.instance('r').query('select teacher_subject_id from teacher_subject where user_id = ' + insertData.user_id + ' and subject_id = ' + insertData.subject_id)
      const result = await DB.instance('r').insert('teacher_subject_class', {
        teacher_subject_id: tsIds[0],
        class_id: insertData.class_id,
        created_time: insertData.created_time
      })
      return result
    } catch (e) {
      throw new Error(e)
    }
  }
}

module.exports = User
