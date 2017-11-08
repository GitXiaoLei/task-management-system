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
  // 为作业添加班级
  async addTaskClass (insertData) {
    try {
      const result1 =  await DB.instance('w').insert('task_class', insertData)
      // 向student_task表中插入记录
      const userIdArr = await DB.instance('r').query('select user_id from user where class_id=' + insertData.class_id)
      const userIds = []
      userIdArr.forEach((userId, i, arr) => {
        userIds.push(userId.user_id)
      })
      let sql = 'insert into student_task(user_id, task_id) values'
      userIds.forEach((userId, i, arr) => {
        if (arr.length - 1 === i) {
          sql += '(' + userId + ', ' + insertData.task_id + ')'
        } else {
          sql += '(' + userId + ', ' + insertData.task_id + '),'
        }
      })
      const result2 = await DB.instance('w').query(sql)
      return { result1, result2 }
    } catch (e) {
      throw new Error(e)
    }
  },
  // 为作业删除班级
  async delTaskClass (conditions) {
    try {
      // 删除task_class表中的数据
      const result1 =  await DB.instance('w').query('delete from task_class where task_id=' + conditions.task_id + ' and class_id=' + conditions.class_id)
      // 删除student_task表中的数据
      const userIdsArr = await DB.instance('w').query('select user_id from user where class_id=' + conditions.class_id)
      const userIds = []
      userIdsArr.forEach((userId, i, arr) => {
        userIds.push(userId.user_id)
      })
      let sql = 'delete from student_task where task_id=' + conditions.task_id + ' and user_id in ('
      userIds.forEach((userId, i, arr) => {
        if (i === arr.length - 1) {
          sql += userId + ')'
        } else {
          sql += userId + ', '
        }
      })
      let result2 = []
      if (userIds.length) {
        result2 = DB.instance('w').query(sql)
      }
      return { result1, result2 }
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
    try {
      // 将task表中的is_publish字段改为1,
      const result1 = await DB.instance('r').query('update task set is_publish=1 where task_id=' + taskId)
      // 向student_task表中添加记录
      // const userIdsArr = await DB.instance('w').query('select user_id from user where class_id in (select class_id from task_class where task_id=' + taskId + ')')
      // const userIds = []
      // userIdsArr.forEach((obj) => {
      //   userIds.push(obj.user_id)
      // })
      // let sql = 'insert into student_task(user_id, task_id) values'
      // userIds.forEach((userId, i, arr) => {
      //   if (arr.length - 1 === i) {
      //     sql += '(' + userId + ', ' + taskId + ')'
      //   } else {
      //     sql += '(' + userId + ', ' + taskId + '),'
      //   }
      // })
      // const result2 = await DB.instance('w').query(sql)
      // return { result1, result2 }
      return result1
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
  },
  // 获取某位老师所教的课程已经课程对应的班级
  async getSubjectClass (userId) {
    const data = []
    try {
      const teacherSubject = await DB.instance('r').query('select * from teacher_subject where user_id=' + userId)
      const sIds = []
      const tsIds = []
      teacherSubject.forEach((teacherSubject) => {
        sIds.push(teacherSubject.subject_id)
        tsIds.push(teacherSubject.teacher_subject_id)
      })
      for (let i = 0, l = sIds.length; i < l; i++) {
        // 获取subject_id所对应的课程信息
        const subject = await DB.instance('r').query('select * from subject where subject_id=' + sIds[i])
        const obj = subject[0]
        // 获取teacher_subject_id所对应的班级信息
        const classes = await DB.instance('r').query('select * from class where class_id in (select class_id from teacher_subject_class where teacher_subject_id='+ tsIds[i] +')')
        obj.classes = classes
        // 给每个班级信息加上subject_id
        obj.classes.forEach((klass) => {
          klass.subject_id = sIds[i]
        })
        data.push(obj)
      }
      return data
    } catch (e) {
      throw new Error(e)
    }
  },
  // 获取课程列表
  async getSubjectList () {
    try {
      return DB.instance('r').select('subject')
    } catch (e) {
      throw new Error(e)
    }
  },
  // 获取已发布的作业列表
  async getPublishedTask (userId) {
    try {
      return DB.instance('r').select('task', { user_id: userId, is_publish: 1 }, { task_id: 1 })
    } catch (e) {
      throw new Error(e)
    }
  },
  // 获取未发布的作业列表
  async getNoPublishedTask (userId) {
    try {
      return DB.instance('r').select('task', { user_id: userId, is_publish: 0 }, { task_id: 1 })
    } catch (e) {
      throw new Error(e)
    }
  },
  // 通过task_id删除task表中的作业记录
  async delTask (taskId) {
    try {
      return DB.instance('r').query('delete from task where task_id=' + taskId)
    } catch (e) {
      throw new Error(e)
    }
  },
  // 通过task_id删除task_class表中的记录
  async delTaskClassByTaskId (taskId) {
    try {
      return DB.instance('r').query('delete from task_class where task_id=' + taskId)
    } catch (e) {
      throw new Error(e)
    }
  },
  // 通过task_id删除task_question表中的记录
  async delTaskQuestionByTaskId (taskId) {
    try {
      return DB.instance('r').query('delete from task_question where task_id=' + taskId)
    } catch (e) {
      throw new Error(e)
    }
  },
  // 查询学生要做的作业id
  async getStudentTask (userId) {
    try {
      return DB.instance('r').query('select is_submit from student_task where user_id=' + userId + ' and is_submit=0')
    } catch (e) {
      throw new Error(e)
    }
  },
  // 获取已经提交了的作业记录
  async getSubmited (userId) {
    try {
      return DB.instance('r').query('select * from task where task_id in (select task_id from student_task where user_id=' + userId + ' and is_submit=1)')
    } catch (e) {
      throw new Error(e)
    }
  },
  // 获取未提交的作业记录
  async getNoSubmited (userId) {
    try {
      return DB.instance('r').query('select * from task where task_id in (select task_id from student_task where user_id=' + userId + ' and is_submit=0)')
    } catch (e) {
      throw new Error(e)
    }
  },
  // 获取某次作业的题目和题目的回答
  async getQuestiones (taskId, userId) {
    try {
      const questionList = await DB.instance('r').query('select * from question where question_id in (select question_id from task_question where task_id=' + taskId + ')')
      for (let i = 0, l = questionList.length; i < l; i++) {
        let sql = 'select answer from answer where question_id=' + questionList[i].question_id + ' and task_id=' + taskId + ' and user_id=' + userId
        let answer = await DB.instance('r').query(sql)
        if (answer.length > 0) {
          questionList[i].answer = answer[0].answer
        } else {
          questionList[i].answer = ''
        }
      }
      return questionList
    } catch (e) {
      throw new Error(e)
    }
  },
  // 提交单个题目的回答
  async addAnswer (insertData) {
    try {
      return DB.instance('w').insert('answer', insertData)
    } catch (e) {
      throw new Error(e)
    }
  },
  // 交作业
  async addIsSubmit (taskId, userId) {
    let sql = 'update student_task set is_submit=1 where task_id=' + taskId + ' and user_id=' + userId
    try {
      return DB.instance('w').query(sql)
    } catch (e) {
      throw new Error(e)
    }
  },
  // 删除student_task表中的数据
  async delStudentTask (taskId) {
    let sql = 'delete from student_task where task_id=' + taskId
    try {
      return DB.instance('w').query(sql)
    } catch (e) {
      throw new Error(e)
    }
  },
  // 获取某个作业所对应的班级
  async getTaskClass (taskId) {
    try {
       return await DB.instance('w').query('select * from class where class_id in (select class_id from task_class where task_id=' + taskId + ')')
    } catch (e) {
      throw new Error(e)
    }
  },
  // 获取某个班级的所有学生
  async getClassStudent (classId, taskId) {
    try {
      const users = await DB.instance('r').query('select * from user where class_id=' + classId)
      for (let i = 0, l = users.length; i < l; i++) {
        delete users[i].password
        let isSubmitObj = await DB.instance('r').query('select is_submit from student_task where user_id=' + users[i].user_id + ' and task_id=' + taskId)
        users[i].is_submit = isSubmitObj[0].is_submit
      }
      return users
    } catch (e) {
      throw new Error(e)
    }
  },
  // 获取某个学生某次作业的答案
  async getStudentAnswer (taskId, userId) {
    try {
      // 获取某次作业的所有题目id
      const questionIdArr = await DB.instance('r').query('select question_id from task_question where task_id=' + taskId)
      const questionArr = []
      for (let i = 0, l = questionIdArr.length; i < l; i++) {
        // 获取题目
        const question = await DB.instance('r').query('select * from question where question_id=' + questionIdArr[i].question_id)
        
        // 获取学生的回答获取学生的回答
        const answer = await DB.instance('r').query('select answer,score from answer where task_id=' + taskId + ' and user_id=' + userId + ' and question_id=' + questionIdArr[i].question_id)
        console.log(answer)
        question[0].answer = answer.length > 0 ? answer[0].answer : ''
        question[0].score = answer.length > 0 ? answer[0].score : ''
        questionArr.push(question[0])
      }
      let isChecked = await DB.instance('r').query('select is_check from student_task where user_id=' + userId + ' and task_id=' + taskId)
      isChecked = isChecked[0].is_check
      return { isChecked, questionArr }
    } catch (e) {
      throw new Error(e)
    }
  },
  // 添加某个同学某次作业某题的分数
  async addAnswerScore (questionId, taskId, userId, score) {
    try {
      // 本次作业的总分数
      let sumScore = await DB.instance('r').query('select score from student_task where user_id=' + userId + ' and task_id=' + taskId)
      // 当前题目的分数
      let curScore = await DB.instance('r').query('select score from answer where question_id=' + questionId + ' and task_id=' + taskId + ' and user_id=' + userId)

      sumScore = parseInt(sumScore[0].score) - curScore[0].score + score
      // 超出100分
      if (sumScore > 100) {
        return false
      }
      // 每一题插入分数
      const result1 = await DB.instance('w').query('update answer set score=' + score + ' where question_id=' + questionId + ' and task_id=' + taskId + ' and user_id=' + userId)
      
      // 添加到总分上去
      const result2 = await DB.instance('w').query('update student_task set score=' + sumScore + ' where user_id=' + userId + ' and task_id=' + taskId)
      
      return { result1, result2 }
    } catch (e) {
      throw new Error(e)
    }
  },
  // 提交批改完的作业
  async addChecked (userId, taskId) {
    try {
      // 本次作业的总分数
      return await DB.instance('r').query('update student_task set is_check=1 where user_id=' + userId + ' and task_id=' + taskId)
    } catch (e) {
      throw new Error(e)
    }
  },
  // 是否可以删除该课程
  async canDelSubject (subjectId) {
    try {
      const data = await DB.instance('r').query('select * from task where subject_id='  + subjectId)
      let flag = false
      if (data.length === 0) {
        flag = true
      }
      return flag
    } catch (e) {
      throw new Error(e)
    }
  },
  // 是否可以删除该班级
  async canDelClass (conditions) {
    try {
      const taskIdArr = await DB.instance('r').query('select task_id from task where subject_id=' + conditions.subject_id + ' and user_id=' + conditions.user_id)
      if (taskIdArr.length === 0) {
        return true
      }
      const taskIds = []
      taskIdArr.forEach((taskId) => {
        taskIds.push(taskId.task_id)
      })
      let flag = true
      for (let i = 0, l = taskIds.length; i < l; i++) {
        let result = await DB.instance('r').query('select * from task_class where task_id=' + taskIds[i] + ' and class_id=' + conditions.class_id)
        if (result.length > 0) {
          flag = false
        }
      }
      return flag
    } catch (e) {
      throw new Error(e)
    }
  },
  // 获取查看成绩页面初始化数据
  async getGradeWebData (userId) {
    try {
      const subjectIdArr = await DB.instance('r').query('select subject_id from teacher_subject where user_id=' + userId)
      const subjectIds = []
      subjectIdArr.forEach((subjectId) => {
        subjectIds.push(subjectId.subject_id)
      })
      if (!subjectIds.length) {
        return []
      }
      let sql = 'select * from subject where subject_id in ('
      subjectIds.forEach((subjectId, i, arr) => {
        if (arr.length - 1 === i) {
          sql += subjectId + ')'
        } else {
          sql += subjectId + ', '
        }
      })
      return await DB.instance('r').query(sql)
    } catch (e) {
      throw new Error(e)
    }
  },
  // 获取成绩单
  // [
  //   ["学号", "姓名", "1", "2", "3", "4", "5", "6", '平均分'],
  //   ["1", '小1', 11, 12, 13, 13, 13, 13, 13, '平均分'],
  //   ["2", '小2', 11, 14, 13, 13, 13, 13, 13, '平均分'],
  //   ["3", '小3', 15, 12, 13, 13, 13, 13, 13, '平均分']
  // ]
  async getReportCard (subjectId, classId, userId) {
    try {
      const userArr = await DB.instance('r').query('select user_id, real_name, student_num from user where class_id=' + classId)

      console.log('userArr:')
      console.log(userArr)
      console.log(userArr.length)

      const taskIdArr = await DB.instance('r').query('select task_id, task_name from task where subject_id=' + subjectId + ' and user_id=' + userId)

      console.log('taskIdArr:')
      console.log(taskIdArr)
      console.log(taskIdArr.length)
      console.log('---------------------------------')
      
      const data = []
      data[0] = ['学号', '姓名']
      for (let i = 0, l1 = userArr.length; i < l1; i++) {
        const singleData = []
        singleData.push(userArr[i].student_num) // 学号
        singleData.push(userArr[i].real_name) // 姓名

        for(let j = 0, l2 = taskIdArr.length; j < l2; j++) {
          let score = await DB.instance('r').query('select score from student_task where user_id=' + userArr[i].user_id + ' and task_id=' + taskIdArr[j].task_id)
          console.log(j)
          if (score.length) {
            let flag = false
            data[0].forEach((data) => {
              if (data === taskIdArr[j].task_name) {
                flag = true
              }
            })
            if (!flag) {
              data[0].push(taskIdArr[j].task_name)
            }
            singleData.push(score[0].score)
          }
        }
        // 平均分
        if (data[0][data[0].length - 1] !== '平均分') {
          data[0].push('平均分')
        }
        const scoreArr = singleData.slice(2)
        console.log(scoreArr)
        let sum = 0, average
        scoreArr.forEach((score) => {
          sum += score
        })
        if (!scoreArr.length) {
          average = 0
        } else {
          average = (sum/scoreArr.length).toFixed(2)
        }
        singleData.push(average)
        data.push(singleData)
      }
      return data
    } catch (e) {
      throw new Error(e)
    }
  },
  // 获取学生查看成绩页面初始化数据
  async getSubjectStudent (userId) {
    try {
       return await DB.instance('r').query('select * from subject where subject_id in(select subject_id from teacher_subject where teacher_subject_id in(select teacher_subject_id from teacher_subject_class where class_id in (select class_id from user where user_id=' + userId + ')))')
    } catch (e) {
      throw new Error(e)
    }
  },
  // 获取学生所属的班级id
  async getStudentClassId (userId) {
    try {
       const classIdArr = await DB.instance('r').query('select class_id from user where user_id=' + userId)
       return classIdArr[0].class_id
    } catch (e) {
      throw new Error(e)
    }
  },
  // 获取学生在该课程下，所被教的老师的id
  async getTeacherUserId (subjectId, classId) {
    try {
       const userIdArr = await DB.instance('r').query('select user_id from teacher_subject where subject_id=' + subjectId + ' and teacher_subject_id in(select teacher_subject_id from teacher_subject_class where class_id='+ classId +')')
       return userIdArr[0].user_id
    } catch (e) {
      throw new Error(e)
    }
  },
  
}

module.exports = User
