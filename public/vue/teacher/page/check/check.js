import contents from '../../../components/content.vue'
import tabList from '../../../components/tab-list.vue'
import list from '../../../components/list.vue'

// import { getUserInfo, updateStudentInfo } from '../../api.js'
import { getCheckWebData, getTaskClass, getClassStudent, getStudentAnswer, submitScore, addChecked } from '../../api.js'
import moment from 'moment'
export default {
  name: 'check',
  components: { contents, tabList, list },
  data() {
    return {
      publishedTask: [],
      classData: [],
      studentData: [],
      taskId: 0,
      answerData: [],
      score: 0,
      studentRealName: '', // 学生姓名
      userId: 0, // 学生id
      isChecked: 0,
      taskName: '',
      canSubmit: false, // 是否能够点击提交按钮
    }
  },
  methods: {
    // 提交批改完的作业
    addChecked () {
      const params = {
        task_id: this.taskId,
        user_id: this.userId
      }
      addChecked(params)
      .then((data) => {
        data = data.data
        if (data.code !== 1) {
          this.errorMsg(data.message)
          return
        }
        this.successMsg('提交成功')
        this.isChecked = 1
      })
      .catch((e) => {
        console.error(e)
      })
    },
    // 提交分数
    submitScore (row, index) {
      console.log(typeof row.score)
      if (row.score === '' || (typeof row.score) !== 'number') {
        this.errorMsg('请输入整数格式的数字')
        return
      }
      const params = {
        question_id: row.question_id,
        task_id: this.taskId,
        user_id: this.userId,
        score: row.score
      }
      submitScore(params)
      .then((data) => {
        data = data.data
        if (data.code !== 1) {
          this.errorMsg(data.message)
          return
        }
        this.successMsg('成功！')
        $('body').trigger('click')
      })
    },
    // 获取某个学生在某个作业的答案
    getStudentAnswer (row, event) {
      let $this = $(event.srcElement)
      if (!$this.hasClass('list-li')) {
        $this = $this.parent()
      }
      // 已经选择了
      if ($this.hasClass('selected')) {
        return
      }
      // 未提交
      if (!$this.find('.status').hasClass('active')) {
        this.errorMsg('该学生未提交作业。')
        return
      }
      const params = {
        user_id: row.user_id,
        task_id: this.taskId
      }
      getStudentAnswer(params)
      .then((data) => {
        data = data.data
        if (data.code !== 1) {
          this.errorMsg('获取学生所做作业失败')
          return
        }
        this.successMsg('获取学生答案成功')
        this.answerData = data.data.questionArr
        this.isChecked = data.data.isChecked
        this.studentRealName = row.real_name
        this.userId = row.user_id
        this.canSubmit = true
        // 给问题、答案加上序号
        this.answerData.forEach((answer, i) => {
          answer.question = i + '、' + answer.question
        })
        $this.siblings().removeClass('selected')
        $this.addClass('selected')
      })
      .catch((e) => {
        console.error(e)
      })
    },
    // 获取某个班级的学生
    getClassStudent (row, event) {
      const $this = $(event.srcElement)
      if ($this.hasClass('selected')) {
        return
      }
      const params = { 
        class_id: row.class_id, 
        task_id: this.taskId
      }
      getClassStudent(params)
      .then((data) => {
        data = data.data
        if (data.code !== 1) {
          this.errorMsg('获取本班学生失败')
          return
        }
        this.successMsg('获取本班学生成功')
        this.studentData = data.data
        this.answerData = []
        this.canSubmit = false
        $('.my-list:nth-of-type(3) .list-li').removeClass('selected')
        $this.siblings().removeClass('selected')
        $this.addClass('selected')
      })
      .catch((e) => {
        console.error(e)
      })
    },
    // 获取作业所对应的班级
    getTaskClass (row, event) {
      const $parent = $(event.srcElement).parent()
      // 已经被选中了
      if ($parent.hasClass('selected')) {
        return
      }
      const params = { task_id: row.task_id }
      getTaskClass(params)
      .then((data) => {
        data = data.data
        if (data.code !== 1) {
          this.errorMsg('获取班级失败')
          return
        }
        this.successMsg('获取班级成功')
        this.classData = data.data
        this.studentData = []
        this.answerData = []
        this.taskId = row.task_id
        this.taskName = row.task_name
        this.canSubmit = false
        $('.list-li').removeClass('selected')
        $parent.siblings().removeClass('selected')
        $parent.addClass('selected')
      })
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
  created () {
    document.title = '批改作业'
  },
  mounted () {
    getCheckWebData()
    .then((data) => {
      data = data.data
      if (data.code !== 1) {
        console.error('获取页面初始化数据失败')
        return
      }
      this.publishedTask = data.data
      this.timeFormat(this.publishedTask)
    })
    .catch((e) => {
      console.error(e)
    })
  }
}