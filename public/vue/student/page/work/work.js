import contents from '../../../components/content.vue'
// import { getUserInfo, updateStudentInfo } from '../../api.js'
import { getWorkWebData, getTaskQuestion, addAnswer, addIsSubmit, getTaskQuestionAnswer } from '../../api.js'
import moment from 'moment'
import showdown from 'showdown'
import $ from 'jquery'
const converter = new showdown.Converter()
export default {
  name: 'work',
  components: { contents },
  data() {
    return {
      noSubmitTaskList: [], // 没提交的作业记录
      submitedTaskList: [], // 已提交的作业记录
      questionMod: false, // 题目modal的显示与隐藏
      taskTitle: '', // 被选中作业的题目
      overdueTime: '', // 作业过期时间
      questionList: [], // 题目列表
      submitBtn: true, // “交”按钮是否显示
      percent: 0, // 进度条百分比
      progressShow: false, // 是否显示进度条
      isBorder: false, // 是否显示每个问题的下面的边框
      cardShow: false, // 答题card是否显示
      answerVal: '', // 回答的值
      toolbars: { // markdown工具栏
        preview: true, // 预览
        bold: true, // 粗体
        header: true, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        code: true, // code
        ol: true, // 有序列表
        ul: true, // 无序列表
        subfield: true, // 单双栏模式
      },
      questionNum: 0, // 第n题
      questionId: 0, // 问题id
      taskId: 0, // 作业id
      questionIndex: -1, // 题目索引
      taskIndex: -1, // 作业索引,
      isOverDueTime: false, // 作业是否过期
    }
  },
  methods: {
    // 交作业
    addIsSubmit () {
      const params = { task_id: this.taskId }
      addIsSubmit(params)
      .then((data) => {
        data = data.data
        if (data.code !== 1) {
          this.errorMsg('交作业失败')
          return
        }
        this.successMsg('交作业成功')
        this.cardShow = false
        this.questionMod = false
        // 修改本地数据
        this.noSubmitTaskList.forEach((noSubmitTask, i, arr) => {
          if (noSubmitTask.task_id === this.taskId) {
            this.submitedTaskList.push(arr.splice(i, 1)[0])
          }
        })
      })
    },
    // 点击取消题目的modal
    cancelMod () {
      this.questionMod = false
      this.cardShow = false
      $('.ivu-modal-content').css({
        transition: '.3s',
        transform: 'translateX(0)'
      })
      $('.cardMarkdown').css({
        transition: '.3s',
        transform: 'translate(0, 0)'
      })
    },
    // 提交回答
    addAnswer () {
      if (this.answerVal === '') {
        this.errorMsg('答案不能为空')
        return
      }
      const params = {
        answer: this.answerVal,
        task_id: this.taskId,
        question_id: this.questionId
      }
      addAnswer(params)
      .then((data) => {
        data = data.data
        if (data.code !== 1) {
          this.errorMsg('提交答案失败')
          return
        }
        this.successMsg('提交答案成功')
        this.questionList[this.questionIndex].replay = this.answerVal
        this.questionList.forEach((question, i) => {
          const questionHtml = converter.makeHtml(question.question)
          const replayHtml = converter.makeHtml(question.replay)
          $('.question-' + i).html(questionHtml)
          $('.replay-' + i).html(replayHtml)
        })
        $('.question-list').removeClass('selected')
      })
      .catch((e) => {
        console.error(e)
      })
    },
    // 取消提交答案
    cancelSubmit () {
      this.cardShow = false
      $('.ivu-modal-content').css({
        transition: '.3s',
        transform: 'translateX(0)'
      })
      $('.cardMarkdown').css({
        transition: '.3s',
        transform: 'translate(0, 0)'
      })
    },
    // 实现cardMarkdown
    cardShowFn (question, index, event) {
      this.questionIndex = index
      this.questionId = question.question_id
      this.cardShow = true
      this.questionNum = index + 1
      $('.ivu-modal-content').css({
        transition: '.3s',
        transform: 'translateX(-250px)'
      })
      $('.cardMarkdown').css({
        transition: '.3s',
        transform: 'translate(70px, -150px)'
      })
      // 样式
      $('.question-list').removeClass('selected')
      $(event.srcElement).closest('.question-list').addClass('selected')
    },
    // 获取某次作业的题目
    getTaskQuestion (taskId, taskName, overdueTime, isSubmit, index, event) {
      overdueTime = moment(overdueTime).unix()
      const curTime = moment().unix()
      // 超期
      if (curTime > overdueTime) {
        this.errorMsg('作业已过期，不能提交答案')
        this.isOverDueTime = true
        // 获取题目和答案（过期了能够看到答案）
        const params = { task_id: taskId }
        getTaskQuestionAnswer(params)
        .then((data) => {
          data = data.data
          if (data.code !== 1) {
            this.errorMsg('获取题目和标准答案失败')
            return
          }
          this.taskId = taskId
          this.progressShow = true
          this.questionList = data.data
          this.questionList.forEach((question, i) => {
            question.question = (i+1) + '、' + question.question 
          })
          if (isSubmit) {
            this.submitBtn = false
          } else {
            this.submitBtn = true
          }
          const timer = setInterval(() => {
            this.percent += 100
            if (this.percent === 100) {
              clearInterval(timer)
              this.percent = 0
              this.progressShow = false
              this.isBorder = true
              this.questionList.forEach((question, i) => {
                const questionHtml = converter.makeHtml(question.question)
                const replayHtml = converter.makeHtml(question.replay)
                question.answer = '【参考答案】<br>' + question.answer
                const answerHtml = converter.makeHtml(question.answer)
                $('.question-' + i).html(questionHtml)
                $('.replay-' + i).html(replayHtml)
                $('.answer-' + i).html(answerHtml)
              })
            }
          }, 200)
        })
        .catch((e) => {
          this.errorMsg((e))
        })
        this.questionMod = true
        this.taskTitle = taskName
        this.overdueTime = moment(overdueTime).format('YYYY-MM-DD')
      // 未过期
      } else {
        this.isOverDueTime = false
        this.taskIndex = index
        this.isBorder = false
        $('.question').html('')
        $('.answer').html('')
        const params = { task_id: taskId }
        getTaskQuestion(params)
        .then((data) => {
          data = data.data
          if (data.code !== 1) {
            this.errorMsg('获取题目失败')
            return
          }
          this.taskId = taskId
          this.progressShow = true
          this.questionList = data.data
          this.questionList.forEach((question, i) => {
            question.question = (i+1) + '、' + question.question 
          })
          if (isSubmit) {
            this.submitBtn = false
          } else {
            this.submitBtn = true
          }
          const timer = setInterval(() => {
            this.percent += 100
            if (this.percent === 100) {
              clearInterval(timer)
              this.percent = 0
              this.progressShow = false
              this.isBorder = true
              this.questionList.forEach((question, i) => {
                const questionHtml = converter.makeHtml(question.question)
                const replayHtml = converter.makeHtml(question.replay)
                $('.question-' + i).html(questionHtml)
                $('.replay-' + i).html(replayHtml)
              })
            }
          }, 200)
        })
        .catch((e) => {
          this.errorMsg((e))
        })
        this.questionMod = true
        this.taskTitle = taskName
        this.overdueTime = moment(overdueTime).format('YYYY-MM-DD')
      }
    },
    // 成功消息提示
    successMsg(msg) {
      this.$Message.success(msg)
    },
    // 失败消息提示
    errorMsg(msg) {
      this.$Message.error(msg)
    },
    // 将从后台获取到的时间戳转换为一定格式的字符串
    timeFormat (arrObj) {
      arrObj.forEach((obj) => {
        obj.overdue_time = moment.unix(obj.overdue_time).format('YYYY-MM-DD')
      })
    }
  },
  computed: {
    
  },
  created() {
    getWorkWebData()
    .then((data) => {
      data = data.data
      if (data.code !== 1) {
        this.errorMsg('获取页面初始化数据失败')
        return
      }
      this.noSubmitTaskList = data.data.noSubmited
      this.submitedTaskList = data.data.submited
      // 格式化时间戳
      this.timeFormat(this.noSubmitTaskList)
      this.timeFormat(this.submitedTaskList)
    })
    .catch((e) => {
      this.errorMsg(e)
    })    
  }
}
