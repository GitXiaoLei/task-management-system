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
    try {
      return await DB.instance('w').delete('teacher_subject', conditions)
    } catch (e) {
      throw new Error(e)
    }
  },
  // 老师删除自己的某个科目下的某个班级：teacher_subject表
  async delSubjectClassById (conditions) {
    try {
      return await DB.instance('w').delete('subject_class', conditions)
    } catch (e) {
      throw new Error(e)
    }
  },
  // 获取teacher_subject表中的记录
  async getTeacherSubjectById (id) {
    try {
      return await DB.instance('r').select('teacher_subject')
    } catch (e) {
      throw new Error(e)
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
    try {
      const teacherSubjectArr = await this.getTeacherSubjectById(uid)
      const subjectIdArr = []
      if (teacherSubjectArr.length !== 0) {
        teacherSubjectArr.forEach((teacherSubject) => {
          subjectIdArr.push(teacherSubject.subject_id)
        })
      }
      const subjects = await this.getSubjectByIdArr(subjectIdArr)
      console.log(subjects)
      return subjects
    } catch (e) {
      throw new Error(e)
    }
  },
  // 获取某个老师的某个课程下的班级列表
  getClasses (uid) {
    return new Promise((resolve, reject) => {
      Async.waterfall([
        // 通过uid获取subject_id数组
        (cb) => {
          DB
          .instance('w')
          .select('teacher_subject', { user_id: uid })
          .then((rows) => {
            let subjectIdArr = []
            if (rows.length === 0) {
              cb(null, subjectIdArr)
              return
            }
            rows.forEach((row) => {
              subjectIdArr.push(row.subject_id)
            })
            subjectIdArr = Util.removeSome(subjectIdArr)
            cb(null, subjectIdArr)
          })
          .catch((e) => {
            reject(e)
          })
        },
        // 通过subjectIdArr获取class_id数组
        (subjectIdArr, cb) => {
          if (subjectIdArr.length === 0) {
            cb(null, [])
            return
          }
          DB
          .instance('r')
          .selectOr('subject_class', 'subject_id', subjectIdArr)
          .then((rows) => {
            const classIdArr = []
            if (rows.length === 0) {
              cb(null, classIdArr)
              return
            }
            rows.forEach((row) => {
              classIdArr.push(row.class_id)
            })
            cb(null, classIdArr)
          })
          .catch((e) => {
            reject(e)
          })
        },
        // 通过classIdArr获取班级信息
        (classIdArr, cb) => {
          if (classIdArr.length === 0) {
            cb(null, [])
            return
          }
          DB
          .instance('r')
          .selectOr('class', 'class_id', classIdArr)
          .then((classes) => {
            cb(null, classes)
          })
          .catch((e) => {
            reject(e)
          })
        }
      ], (e, classes) => {
        if (e) {
          reject(e)
          return
        }
        resolve(classes)
      })
    })
  },
  // 更新用户的username、real_name、sex、department、phone_num、qq_num
  async updateUserInfo (updateData, conditions) {
    try {
      const result = await DB.instance('w').update('user', updateData, conditions)
      return result
    } catch (e) {
      throw new Error(e)
    }
  }
}

module.exports = User
