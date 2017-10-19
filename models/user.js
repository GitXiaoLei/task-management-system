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
  // 老师获取自己所教的课程列表
  async getSubjects (uid) {
    let sql = 'select * from subject where subject_id in (select subject_id from teacher_subject where user_id = ' + uid + ')'
    try {
      const subjects = await DB.instance('r').query(sql)
      return subjects
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
  // 老师删除自己的某个科目下的某个班级
  async delSubjectClassById (conditions) {
    try {
      let sql = 'select teacher_subject_id from teacher_subject where user_id = ' + conditions.user_id + ' and subject_id = ' + conditions.subject_id
      const tsIds = await DB.instance('r').query(sql)
      const result = await DB.instance('w').query('delete from teacher_subject_class where teacher_subject_id = ' + tsIds[0].teacher_subject_id + ' and class_id = ' + conditions.class_id)
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
  async updateQuestion (updateData, conditions) {
    let sql = 'UPDATE question SET'
    Object.keys(updateData).forEach((k, i, arr) => {
      if (arr.length - 1 === i) {
        sql += ' ' + k + '=' + "'" + updateData[k] + "'"
      } else {
        sql += ' ' + k + '=' + "'" + updateData[k] + "'" + ','
      }
    })
    sql += ' WHERE '
    Object.keys(conditions).forEach((k, i, arr) => {
      if (arr.length - 1 === i) {
        sql +=  k + ' = ' + conditions[k]
      } else {
        sql +=  k + ' = ' + conditions[k] + ' and '
      }
    })
    try {
      return DB.instance('w').query(sql)
    } catch (e) {
      throw new Error(e)
    }
  },
  // 删除题目
  delQuestion (conditions) {
    let sql = 'delete from question where'
    Object.keys(conditions).forEach((k, i, arr) => {
      if (arr.length - 1 === i) {
        sql += ' ' + k + '=' + conditions[k]
      } else {
        sql += ' ' + k + '=' + conditions[k] + ' and '
      }
    })
    try {
      return DB.instance('w').query(sql)
    } catch (e) {
      throw new Error(e)
    }
  },
  // 获取题目列表
  async getQuestionList (conditions) {
    try {
      return DB.instance('r').select('question', conditions)
    } catch (e) {
      throw new Error(e)
    }
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
  async getQuestions (conditions) {
    let sql = 'select * from question where subject_id=' + conditions.subjectId + ' and type=' + conditions.type
    if (conditions.questionIds[0]) {
      conditions.questionIds.forEach((id, i, arr) => {
        sql += ' and question_id != ' + id
      })
    }
    try {
      const questions = await DB.instance('r').query(sql)
      return questions
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
  async getClasses (subjectId) {
    let sql = 'select * from class where class_id in (select class_id from teacher_subject_class where teacher_subject_id in (select teacher_subject_id from teacher_subject where subject_id = ' + subjectId + '))'
    try {
      const classes = await DB.instance('r').query(sql)
      return classes
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
        teacher_subject_id: tsIds[0].teacher_subject_id,
        class_id: insertData.class_id,
        created_time: insertData.created_time
      })
      return result
    } catch (e) {
      throw new Error(e)
    }
  },
  // 创建一条作业记录
  async addTask (insertData) {
    try {
      return await DB.instance('w').insert('task', insertData)
    } catch (e) {
      throw new Error(e)
    }
  },
  async addTaskClass (insertData) {
    try {
      return await DB.instance('w').insert('task_class', insertData)
    } catch (e) {
      throw new Error(e)
    }
  },
  async delTaskClass (conditions) {
    let sql = 'delete from task_class where task_id=' + conditions.task_id + ' and class_id=' + conditions.class_id 
    try {
      return await DB.instance('w').query(sql)
    } catch (e) {
      throw new Error(e)
    }
  },
  async getTask5 (conditions) {
    try {
      return DB.instance('r').select('task', conditions, { task_id: 1 }, {offset: 0, count: 5})
    } catch (e) {
      throw new Error(e)
    }
  },
  async getSubjectByTaskId (taskId) {
    let sql = 'select * from subject where subject_id in (select subject_id from task where task_id=' + taskId + ')'
    try {
      return DB.instance('r').query(sql)
    } catch (e) {
      throw new Error(e)
    }
  },
  // 获取某次课程所选的班级列表
  async getCurClasses (taskId) {
    let sql = 'select * from class where class_id in (select class_id from task_class where task_id=' + taskId + ')'
    try {
      return DB.instance('r').query(sql)
    } catch (e) {
      throw new Error(e)
    }
  },
  // 获取某次作业所选的题目
  async getCurQuestions (taskId) {
    let sql = 'select * from question where question_id in (select question_id from task_question where task_id=' + taskId + ')'
    try {
      return DB.instance('r').query(sql)
    } catch (e) {
      throw new Error(e)
    }
  },
  // 为某次作业添加题目
  async addTaskQuestion (insertData) {
    try {
      return DB.instance('r').insert('task_question', insertData)
    } catch (e) {
      throw new Error(e)
    }
  },
  // 为某次作业删除题目
  async delTaskQuestion (conditions) {
    let sql = 'delete from task_question where task_id=' + conditions.task_id + ' and question_id=' + conditions.question_id
    try {
      return DB.instance('r').query(sql)
    } catch (e) {
      throw new Error(e)
    }
  },
  // 发布作业
  async publishTask (taskId) {
    let sql = 'update task set is_publish=1 where task_id=' + taskId 
    try {
      return DB.instance('r').query(sql)
    } catch (e) {
      throw new Error(e)
    }
  },
  // 获取本次作业是否被发布了
  async isPublish (taskId) {
    let sql = 'select is_publish from task where task_id=' + taskId 
    try {
      return DB.instance('r').query(sql)
    } catch (e) {
      throw new Error(e)
    }
  }
  
}

module.exports = User
