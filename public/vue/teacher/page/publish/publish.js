import { getPublishWebData, createTask, getClasses, addTaskClass, delTaskClass, getChoose, getJudge, getFill, getWords, addQuestion, getTask5, getTaskInfo, addTaskQuestion, delQuestion, publishTask, delSubjectQuestion, modifiSubjectQuestion, delTask } from '../../../api.js'
import contents from '../../../components/content.vue'
import tabList from '../../../components/tab-list.vue'
import XLSX from 'xlsx'
import series from 'async/series'
import moment from 'moment'
export default {
  name: 'personal',
  components: { contents, tabList },
  data () {
    return {
      userData: {}, // 用户信息
      isPublish: 0, // 本次作业是否发布了，0表示没有发布，1表示发布了 
      subjects: [], // 老师所教的课程列表
      subjectId: 0, // 选中的课程的id
      taskName: '', // 作业名称
      taskId: 0, // 当前作业的id
      isDisabled: false, // 是否禁用选择课程的按钮
      isCTShow: true, // 创建作业的按钮是否显示
      classes: [], // 老师所教课程下的班级列表
      classIds: [], // 被选中的班级id
      chooseMod: false, // 选择题modal
      judgeMod: false, // 判断题modal
      fillMod: false, // 填空题modal
      wordsMod: false, // 主观题modal
      modifiMod: false, // 修改题目modal
      addMod: false, // 添加题目modal
      questionList: [], // 问题列表问题列表
      questionColumn: [ // 某个课程的所有题目的表格的表头数据
        { title: '问题', key: 'question' },
        { title: '答案', key: 'answer' },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            // 只能删除自己添加的题目
            if (params.row.user_id === this.userData.user_id) {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: (event) => {
                      event.stopPropagation()
                      this.delSubjectQuestion(params.row, params.index)
                    }
                  }
                }, '删除'),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: (event) => {
                      event.stopPropagation()
                      this.modifiSubjectQuestion(params.row, params.index)
                    }
                  }
                }, '修改')
              ])
            } else {
              return h('div', '')
            }
          }
        }
      ],
      curQuestionList: [], // 已选题目列表
      curQuestionColumn: [ // 已选题目表格的表头数据
        { title: '问题', key: 'question' },
        { title: '答案', key: 'answer' },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: (event) => {
                    event.stopPropagation()
                    this.delQuestion(params.row, params.index)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      questionVal: '', // 问题
      answerVal: '', // 答案
      toolbars: { // markdown工具栏
        preview: true, // 预览
        bold: true, // 粗体
        header: true, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        fullscreen: true, // 全屏编辑
        code: true, // code
        ol: true, // 有序列表
        ul: true, // 无序列表
        subfield: true, // 单双栏模式
      },
      questionType: [ // 所有题目类型
        { num: 0, name: '选择题' },
        { num: 1, name: '判断题' },
        { num: 2, name: '填空题' },
        { num: 3, name: '主观题' },
      ],
      questionTypeNum: 0, // 题目类型
      tlBtn: true, // 作业列表按钮 是否显示
      taskes: [], // 最近5次作业记录列表
      isSelected: false, // 某条作业是否被选中
      publishBtn: true, // 发布作业按钮是否显示
      percent: 0, // excel文件导入进度条百分比
      progressShow: false, // 进度条是否显示
      overdueTime: 0, // 过期时间
      publishedTaskList: [], // 已发布的作业列表
      noPublishedTaskList: [], // 未发布的作业列表
      questionId: 0, // 修改的题目的id
    }
  },
  methods: {
    click () {
      
    },
    // 删除作业
    delTask (row, event) {
      const params = { task_id: row.task_id }
      delTask(params)
      .then((data) => {
        data = data.data
        if (data.code !== 1) {
          this.errorMsg('删除作业失败')
          return
        }
        this.successMsg('删除作业成功')
        // 删除本地数据
        this.noPublishedTaskList.forEach((noPublishedTask, i, arr) => {
          if (noPublishedTask.task_id === row.task_id) {
            arr.splice(i, 1)
          }
        })
        this.publishedTaskList.forEach((publishedTask, i, arr) => {
          if (publishedTask.task_id === row.task_id) {
            arr.splice(i, 1)
          }
        })
      })
      .catch((e) => {
        console.error(e)
      })
    },
    // 修改题目
    modifiSubjectQuestion () {
      const params = {
        question_id: this.questionId,
        type: this.questionTypeNum,
        question: this.questionVal,
        answer: this.answerVal
      }
      modifiSubjectQuestion(params)
      .then((data) => {
        data = data.data
        if (data.code !== 1) {
          this.errorMsg('修改题目失败')
          return
        }
        this.successMsg('修改题目成功')
        this.questionTypeNum = 0
        this.questionVal = ''
        this.answerVal = ''
      })
    },
    // 显示修改modal修改自己添加的题目
    showModifiQuestionMod (row, i) {
      this.chooseMod = false
      this.judgeMod = false
      this.fillMod = false
      this.wordsMod = false
      this.modifiMod = true
      this.questionId = row.question_id
      this.questionTypeNum = row.type
      this.questionVal = row.question
      this.answerVal = row.answer
      console.log(this.answerVal)
    },
    // 以文件形式添加问题
    addQuestions (question, answer, type, i) {
      const params = {
        question: question,
        answer: answer,
        type: type,
        subject_id: this.subjectId
      }
      addQuestion(params)
      .then((data) => {
        data = data.data
        if (data.code !== 1) {
          this.errorMsg('添加题目失败')
          return false
        }
        console.log('第 ' + i + ' 个题目上传成功')
        // 将题目添加到本地数据中...
        return true
      })
      .catch((e) => {
        console.error('第 ' + i + ' 个题目上传失败')
        return false
      })
    },
    // 读取文件
    readFile (e) {
      this.progressShow = true
      const that = this
      const rABS = true
      const files = e.target.files
      const f = files[0]
      const reader = new FileReader()
      reader.onload = function (e) {
        let data = e.target.result
        if (!rABS) {
          data = new Uint8Array(data)
        }
        const workbook = XLSX.read(data, {type: rABS ? 'binary' : 'array'})
        /* DO SOMETHING WITH workbook HERE */
        const first_worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const arr = XLSX.utils.sheet_to_json(first_worksheet, { header: 1 })
        console.log(arr)
        // 上传题目
        if (that.subjectId === 0) {
          that.errorMsg('没有选择课程')
          return
        }
        function addQuestions(arrIndex) {
          const index = arrIndex
          return function (cb) {
            const params = {
              question: arr[arrIndex][0],
              answer: arr[arrIndex][1],
              type: arr[arrIndex][2],
              subject_id: that.subjectId
            }
            new Promise((resolve, reject) => {
              addQuestion(params)
              .then((data) => {
                data = data.data
                if (data.code !== 1) {
                  this.errorMsg('添加题目失败')
                  reject('false')
                }
                console.log('第 ' + (arrIndex+1) + ' 个题目上传成功')
                that.percent = parseInt((arrIndex+1)*100/arr.length)
                if (that.percent === 100) {
                  setTimeout(() => {
                    that.progressShow = false
                    that.percent = 0
                  }, 1000)
                  that.successMsg('上传成功')
                }
                resolve('true')
                // 将题目添加到本地数据中...
              })
              .catch((e) => {
                console.error('第 ' + (arrIndex+1) + ' 个题目上传失败')
                reject('false')
              })
            })
            .then((result) => {
              cb(null, true)
            })
            .catch((e) => {
              console.error(e)
              cb(null, false)
            })
          }
        }
        const fnArr = []
        for (let i = 0, l = arr.length; i < l; i++) {
          fnArr.push(addQuestions(i))
        }
        console.log(fnArr)
        series(fnArr, (err, result) => {
          if (err) {
            console.error(err)
            return
          }
          console.log(result)
        })
      }
      if (rABS) {
        reader.readAsBinaryString(f)
       } else {
         reader.readAsArrayBuffer(f)
       }
    },
    // 删除某个课程的并且是自己出的题目
    delSubjectQuestion (row, i) {
      console.log(row, i)
      const params = { question_id: row.question_id }
      delSubjectQuestion(params)
      .then((data) => {
        data = data.data
        if (data.code !== 1) {
          this.errorMsg('删除题目失败')
          return
        }
        this.successMsg('删除题目成功')
        this.questionList.splice(i, 1)
      })
      .catch((e) => {
        this.errorMsg('删除题目失败')
      })
    },
    // 删除已选的某个题目
    delQuestion (row, i) {
      const params = {
        task_id: this.taskId,
        question_id: row.question_id
      }
      delQuestion(params)
      .then((data) => {
        data = data.data
        if (data.code !== 1) {
          this.errorMsg('删除题目失败')
          return
        }
        this.successMsg('删除题目成功')
        this.curQuestionList.splice(i, 1)
      })
      .catch((e) => {
        this.errorMsg(e)
      })
    },
    // 发布作业
    publishTask () {
      if (this.taskId === 0) {
        this.errorMsg('请先选择一次已经创建好的作业，再发布')
        return
      }
      publishTask({ task_id: this.taskId })
      .then((data) => {
        data = data.data
        if (data.code !== 1) {
          this.errorMsg('发布作业失败')
          return
        }
        this.successMsg('发布作业成功')
        this.publishBtn = false
        this.isPublish = 1
        // 禁用已选题目的“删除”按钮
        this.curQuestionColumn = [
          { title: '问题', key: 'question' },
          { title: '答案', key: 'answer' },
          {
            title: '操作',
            key: 'action',
            width: 150,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small',
                    disabled: true
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: (event) => {
                      event.stopPropagation()
                      this.delQuestion(params.row, params.index)
                    }
                  }
                }, '删除')
              ])
            }
          }
        ]
        // 将作业记录从“未发布”移到“已发布”
        this.noPublishedTaskList.forEach((noPublishedTask, i, arr) => {
          if (noPublishedTask.task_id === this.taskId) {
            this.publishedTaskList.unshift(arr.splice(i, 1))
          }
        })
      })
      .catch((e) => {
        this.errorMsg(e)
      })
    },
    // 点击右侧的创建作业按钮，将界面变为创建作业时的界面：也就是将一些数据清空
    toCreateTaskStatus () {
      this.subjectId = 0
      this.taskName = ''
      this.taskId = 0
      this.isDisabled = false
      this.isCTShow = true
      this.classes = []
      this.classIds = []
      this.curQuestionList = []
      this.publishBtn = true
      this.isPublish = 0
      this.overdueTime = 0
      $('.task-record-wrap ul').removeClass('selected')
    },
    // 点击某次作业，获取该作业的详细信息
    getTaskInfo (row, event) {
      const $ele = $(event.srcElement).parent()
      const params = { task_id: row.task_id }
      getTaskInfo(params)
      .then((data) => {
        data = data.data
        if (data.code !== 1) {
          this.errorMsg('获取失败')
          return
        }
        data = data.data
        this.successMsg('获取成功')
        this.isPublish = data.isPublish[0].is_publish
        // 删除按钮状态
        if (this.isPublish === 1) {
          this.curQuestionColumn = [
            { title: '问题', key: 'question' },
            { title: '答案', key: 'answer' },
            {
              title: '操作',
              key: 'action',
              width: 150,
              align: 'center',
              render: (h, params) => {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'error',
                      size: 'small',
                      disabled: true
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: (event) => {
                        event.stopPropagation()
                        this.delQuestion(params.row, params.index)
                      }
                    }
                  }, '删除')
                ])
              }
            }
          ]
        } else {
          this.curQuestionColumn = [
            { title: '问题', key: 'question' },
            { title: '答案', key: 'answer' },
            {
              title: '操作',
              key: 'action',
              width: 150,
              align: 'center',
              render: (h, params) => {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'error',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: (event) => {
                        event.stopPropagation()
                        this.delQuestion(params.row, params.index)
                      }
                    }
                  }, '删除')
                ])
              }
            }
          ]
        }
        this.taskId = row.task_id
        this.subjectId = data.curSubject[0].subject_id
        this.overdueTime = $ele.find('.overdue-time').html()
        this.classes = data.classes
        this.classIds = []
        data.curClasses.forEach((ele) => {
          this.classIds.push(ele.class_id)
        })
        this.curQuestionList = data.curQuestions
        this.isCTShow = false
        this.taskName = row.task_name
        this.isDisabled = true
        this.isSelected = true
        $('.task-record-wrap ul').removeClass('selected')
        $ele.addClass('selected')
      })
      .catch((e) => {
        this.errorMsg(e)
      })
    },
    // 添加题目
    addQuestion () {
      if (this.questionVal === '') {
        this.errorMsg('请输入问题')
        return
      }
      if (this.answerVal === '') {
        this.errorMsg('请输入答案')
        return
      }
      if (this.subjectId === 0) {
        this.errorMsg('未选择科目')
        return
      }
      const params = {
        question: this.questionVal,
        answer: this.answerVal,
        type: this.questionTypeNum,
        subject_id: this.subjectId
      }
      addQuestion(params)
      .then((data) => {
        data = data.data
        if (data.code !== 1) {
          this.errorMsg('添加题目失败')
          return
        }
        this.successMsg(data.message)
        // 将题目添加到本地数据中...
        
      })
      .catch((e) => {
        this.errorMsg('添加题目失败')
      })
    },
    // 创建作业
    createTask () {
      if (this.subjectId === 0) {
        this.errorMsg('请先选择课程')
        return
      }
      if (this.taskName === '') {
        this.errorMsg('请输入作业名称')
        return
      }
      if (typeof this.overdueTime !== 'object') {
        this.errorMsg('请选择过期时间')
        return
      }
      const overdue_time = moment(this.overdueTime).unix()
      const params = { 
        subject_id: this.subjectId,
        task_name: this.taskName,
        overdue_time: overdue_time
      }
      // 创建作业记录
      createTask(params)
      .then((data) => {
        data = data.data
        if (data.code !== 1) {
          this.errorMsg('创建作业失败')
          return
        }
        this.successMsg('创建作业成功')
        this.taskId = data.data.insertId
        this.isDisabled = true
        this.isCTShow = false
        // 将新创建的作业记录加入到“未发布”的列表中
        const obj = {
          task_id: this.taskId,
          task_name: this.taskName,
          overdue_time: moment(this.overdueTime).format('YYYY-MM-DD')
        }
        this.noPublishedTaskList.unshift(obj)
        $('.no-publish.ul-list:nth-of-type(2)').addClass('selected')
        const params = { subject_id: this.subjectId }
        // 获取班级列表
        getClasses(params)
        .then((data) => {
          data = data.data
          if (data.code !== 1) {
            this.errorMsg('获取班级列表失败')
            return
          }
          this.classes = data.data
        })
        .catch((e) => {
          this.errorMsg(e)
        })
      })
      .catch((e) => {
        this.errorMsg(e)
      })
    },
    // 编辑班级：添加或删除
    editClass (classId, e) {
      // 添加班级
      if (!$(e.srcElement).hasClass('ivu-checkbox-wrapper-checked')) {
        const params = {
          task_id: this.taskId,
          class_id: classId
        }
        addTaskClass(params)
        .then((data) => {
          data = data.data
          if (data.code !== 1) {
            this.errorMsg('添加班级失败')
            return
          }
          this.successMsg('添加班级成功')
        })
        .catch((e) => {
          this.errorMsg(e)
        })
      } else {
      // 删除班级
        const params = {
          task_id: this.taskId,
          class_id: classId
        }
        delTaskClass(params)
        .then((data) => {
          data = data.data
          if (data.code !== 1) {
            this.errorMsg('删除班级失败')
            return
          }
          this.successMsg('删除班级成功')
        })
        .catch((e) => {
          this.errorMsg(e)
        })
      }
    },
    // 添加题目modal
    showAddMod () {
      this.addMod = true
    },
    addTaskQuestion (cur, old) {
      const params = {
        question_id: cur.question_id,
        task_id: this.taskId
      }
      addTaskQuestion(params)
      .then((data) => {
        data = data.data
        if (data.code !== 1) {
          this.errorMsg('添加题目失败')
          return
        }
        this.successMsg(data.message)
        // 删除本地数据：选题列表
        this.questionList.forEach((question, i, arr) => {
          if (cur.question_id === question.question_id) {
            arr.splice(i, 1)
          }
        })
        // 添加本地数据：已选题目列表
        this.curQuestionList.push(cur)
      })
      .catch((e) => {
        this.errorMsg('添加题目失败')
      })
    },
    // 选择题
    showChooseMod () {
      const that = this
      if (this.taskId === 0) {
        this.errorMsg('请先创建一次作业或选择之前所创建的作业')
        return
      }
      this.chooseMod = true
      const params = { subjectId: this.subjectId }
      const ids = []
      this.curQuestionList.forEach((question) => {
        ids.push(question.question_id)
      })
      params.questionIds = ids.join(',')
      getChoose(params)
      .then((data) => {
        data = data.data
        if (data.code !== 1) {
          this.errorMsg('获取选择题失败')
          return
        }
        this.questionList = data.data
        this.questionColumn = [
          { title: '问题', key: 'question' },
          { title: '答案', key: 'answer' },
          {
            title: '操作',
            key: 'action',
            width: 150,
            align: 'center',
            render: (h, params) => {
              // 只能删除、修改自己添加的题目
              if (params.row.user_id === that.userData.user_id) {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'error',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: (event) => {
                        event.stopPropagation()
                        this.delSubjectQuestion(params.row, params.index)
                      }
                    }
                  }, '删除'),
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: (event) => {
                        event.stopPropagation()
                        this.showModifiQuestionMod(params.row, params.index)
                      }
                    }
                  }, '修改')
                ])
              } else {
                return h('div', '')
              }
            }
          }
        ]
      })
      .catch((e) => {
        this.errorMsg(e)
      })
    },
    // 判断题
    showJudgeMod () {
      if (this.taskId === 0) {
        this.errorMsg('请先创建一次作业或选择之前所创建的作业')
        return
      }
      this.judgeMod = true
      const params = { subjectId: this.subjectId }
      const ids = []
      this.curQuestionList.forEach((question) => {
        ids.push(question.question_id)
      })
      params.questionIds = ids.join(',')
      getJudge(params)
      .then((data) => {
        data = data.data
        if (data.code !== 1) {
          this.errorMsg('获取判断题失败')
          return
        }
        this.questionList = data.data
      })
      .catch((e) => {
        this.errorMsg(e)
      })
    },
    // 填空题
    showFillMod () {
      if (this.taskId === 0) {
        this.errorMsg('请先创建一次作业或选择之前所创建的作业')
        return
      }
      this.fillMod = true
      const params = { subjectId: this.subjectId }
      const ids = []
      this.curQuestionList.forEach((question) => {
        ids.push(question.question_id)
      })
      params.questionIds = ids.join(',')
      getFill(params)
      .then((data) => {
        data = data.data
        if (data.code !== 1) {
          this.errorMsg('获取填空题失败')
          return
        }
        this.questionList = data.data
      })
      .catch((e) => {
        this.errorMsg(e)
      })
    },
    // 主观题
    showWordsMod () {
      if (this.taskId === 0) {
        this.errorMsg('请先创建一次作业或选择之前所创建的作业')
        return
      }
      this.wordsMod = true
      const params = { subjectId: this.subjectId }
      const ids = []
      this.curQuestionList.forEach((question) => {
        ids.push(question.question_id)
      })
      params.questionIds = ids.join(',')
      getWords(params)
      .then((data) => {
        data = data.data
        if (data.code !== 1) {
          this.errorMsg('获取主观题失败')
          return
        }
        this.questionList = data.data
      })
      .catch((e) => {
        this.errorMsg(e)
      })
    },
    // 成功消息提示
    successMsg (msg) {
      this.$Message.success(msg)
    },
    // 错误消息提示
    errorMsg (msg) {
      this.$Message.error(msg)
    },
    // 将从后台获取到的时间戳转换为一定格式的字符串
    timeFormat (arrObj) {
      arrObj.forEach((obj) => {
        obj.overdue_time = moment.unix(obj.overdue_time).format('YYYY-MM-DD')
      })
    }
  },
  created () {
    document.title = '布置作业'
    // 获取自己所教的课程
    getPublishWebData()
    .then((data) => {
      data = data.data
      if (data.code !== 1) {
        this.errorMsg('页面初始化失败')
        return
      }
      this.userData = data.data.userData[0]
      this.subjects = data.data.subjects
      this.publishedTaskList = data.data.publishedTask
      this.noPublishedTaskList = data.data.noPublishedTask
      // 格式化时间戳
      this.timeFormat(this.publishedTaskList)
      this.timeFormat(this.noPublishedTaskList)
    })
    .catch((e) => {
      this.errorMsg(e)
    })
  }
}