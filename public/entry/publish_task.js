import './common'
import '../style/publish_task.scss'
import 'simplemde/dist/simplemde.min.css'
import SimpleMDE from 'simplemde'
const task = {
  data: {
    subjectId: 0,
    classIds: []
  },
  init () {
    this.eventBinding()
    // markdown编辑器
    const simplemde = new SimpleMDE()
  },
  eventBinding () {
    // 选择课程
    ;(function () {
      $(document).on('click', '.subject', function () {
        const $this = $(this)
        const $siblings = $this.siblings()
        this.dataset.subjectId = $this.data('subjectid')
        // 有课程已经选择了
        if ($siblings.hasClass('selected')) {
          $siblings.removeClass('selected')
          $this.addClass('selected')
          task.data.subjectId = $this.data('subjectid')
          return
        }
        // 点击已经选择的课程
        if ($this.hasClass('selected')) {
          $this.removeClass('selected')
          task.data.subjectId = 0
        } else {
        // 没有选择课程
          $this.addClass('selected')
          task.data.subjectId = $this.data('subjectid')
        }
      })
    })()
    // 点击创建作业
    ;(function () {
      // 点击创建作业按钮
      $(document).on('click', '.create-task>a', function () {
        console.log(task.data.subjectId)
        $.post('/api/task/add', { subject_id: task.data.subjectId }, function (data) {
          if (data.code !== 1) {
            console.log('创建作业失败')
          }
          // 记录task_id
          $('.choose').data('taskid', data.data.insertId)
          task.getClassList(task.data.subjectId)
        })
        $('.choose').show()
        $(this).hide()
      })
    })()
    // 选择班级
    ;(function () {
      $(document).on('click', '.class', function () {
        const $this = $(this)
        if ($this.hasClass('selected')) {
          $this.removeClass('selected')
          task.removeEle(task.data.classIds, $this.data('classid'))
        } else {
          $this.addClass('selected')
          task.data.classIds.push($this.data('classid'))
        }
        console.log(task.data.classIds)
      })
    })()
    // 获取该课程的题目
    ;(function () {
      $(document).on('click', '.get-question', function () {
        task.getQuestionList(task.data.subjectId)
      })
    })()
  },
  // 请求班级列表
  getClassList (subjectid) {
    $.get('/api/subject_class/list', { subject_id: subjectid }, function (data) {
      if (data.code !== 1) {
        console.log('获取班级列表失败')
        return
      }
      const classData = { classes: data.data }
      const html = require('../template/publish_task/class_list.art')(classData)
      $('#class-list').html(html)
    })
  },
  // 请求问题列表
  getQuestionList (subjectid) {
    $.get('/api/subject_question/list', { subject_id: subjectid }, function (data) {
      if (data.code !== 1) {
        console.log('获取问题列表失败')
        return
      }
      const questionData = { questions: data.data }
      const html = require('../template/publish_task/question_list.art')(questionData)
      $('#question-list').html(html)
    })
  },
  // 移除数组中的某个与参数相等的值
  removeEle (arr, ele) {
    arr.forEach((e, i, arr) => {
      if (e === ele) {
        arr.splice(i, 1)
      }
    })
  }
}
task.init()




