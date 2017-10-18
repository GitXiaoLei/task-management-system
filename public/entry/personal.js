import './common'
import '../style/personal.scss'
import $ from 'jquery'
import jconfirm from '../utils/popup'

const task = {
  // 初始化
  init () {
    this.data = {
      subjectList: [],
      curSubjectList: [],
      curClassList: [],
      curSubjectId: 0
    }
    this.data.curSubjectList = this.getCurSubjectList()
    this.eventBinding()
  },
  // 事件绑定
  eventBinding () {
    // 个人信息修改
    ;(function () {
      // 是否能够显示“修改按钮”
      let canModifi = true
      let priVal
      // 显示“修改”按钮
      $(document).on('mouseover', '.form-group', function () {
        if (!canModifi) {
          return
        }
        $(this).find('.btn.change').show()
      })
      // 隐藏“修改按钮”
      $(document).on('mouseout', '.form-group', function () {
        $(this).find('.btn.change').hide()
      })
      // 点击“修改”按钮
      $(document).on('click', '.btn.change', function () {
        const $this = $(this)
        canModifi = false
        // 记录原始值priVal
        priVal = $this.prevAll('input').val()
        $this.hide()
        $this.siblings('.info-val').hide()
        $this.siblings('input,.confirm-cancel').show()
      })
      // 点击“取消”按钮
      $(document).on('click', '.confirm-cancel .cancel', function () {
        canModifi = true
        let $formGroup = $(this).closest('.form-group')
        $formGroup.find('input').hide()
        $formGroup.find('.confirm-cancel').hide()
        $formGroup.find('.info-val').show()
      })
      // 点击“确定”按钮
      $(document).on('click', '.confirm-cancel .confirm', function () {
        const $formGroup = $(this).closest('.form-group')
        // 没有进行用户信息的修改
        if ($formGroup.find('input').val() === priVal) {
          canModifi = true
          $formGroup.find('input').hide()
          $formGroup.find('.confirm-cancel').hide()
          $formGroup.find('.info-val').show()
          return
        }
        let url = ''
        let filed = $formGroup.data('type')
        switch (filed) {
          case 'username':
            url = '/api/user/username/update'
            break
          case 'real_name':
            url = '/api/user/real_name/update'
            break
          case 'sex':
            url = '/api/user/sex/update'
            break
          case 'department':
            url = '/api/user/department/update'
            break
          case 'phone_num':
            url = '/api/user/phone_num/update'
            break
          case 'qq_num':
            url = '/api/user/qq_num/update'
        }
        const data = {}
        data[filed] = $formGroup.find('input').val()
        // 发送修改个人信息的ajax请求
        $.post(url, data, (data) => {
          if (data.code !== 1) {
            console.log(data.message)
            jconfirm.failTips('修改失败')
            return
          }
          canModifi = true
          $formGroup.find('input').hide()
          $formGroup.find('.confirm-cancel').hide()
          $formGroup.find('.info-val').show()
          $formGroup.find('.info-val').html($formGroup.find('input').val())
          jconfirm.successTips(data.message)
        })
      })
    })()
    // 所教课程
    ;(function () {
      // 点击“添加”按钮：进行添加课程
      $(document).on('click', '.add-subject', function () {
        // 弹窗，里面渲染课程列表
        $.confirm({
          title: '课程列表',
          buttons: {
            '关闭': function () {}
          },
          content: function () {
            const self = this
            $.ajax({
              url: '/api/subject/list',
              method: 'get'
            })
            .done(function (data) {
              if (data.code !== 1) {
                jconfirm.failTips('获取课程列表失败')
                return
              }
              data = task.compareDealSubject(data)
              const html = require('../template/personal/subject_list_injc.art')(data)
              self.setContentAppend(html)
            })
            .fail(function () {
              jconfirm.failTips('获取课程列表失败')
            })
          }
        })
      })
      // 点击单个课程，添加/删除 此课程
      $(document).on('click', '.in-jc.subject-single', function () {
        const $this = $(this)
        const curId = $this.data('subjectid')
        const addData = {
          subject_name: $this.find('.name').html(),
          subject_num: $this.find('.num').html()
        }
        // 删除课程
        if ($this.hasClass('selected')) {
          const data = { subject_id: $this.data('subjectid') }
          $.post('/api/teacher_subject/del', data, (data) => {
            if (data.code !== 1) {
              jconfirm.failTips('删除课程失败')
              return
            }
            jconfirm.successTips('删除课程成功')
            $this.removeClass('selected')
            // 删除本地数据
            // task.data.curSubjectList.forEach((subject, i) => {
            //   if (subject.subject_id === curId) {
            //     task.data.curSubjectList.splice(i, 1)
            //   }
            // })
            // 重新渲染
            // task.renderCurSubjectList()
          })
        } else {
        // 添加课程
          const data = { subject_id: $this.data('subjectid') }
          $.post('/api/teacher_subject/add', data, (data) => {
            if (data.code !== 1) {
              jconfirm.failTips('添加课程失败')
              return
            }
            jconfirm.successTips('添加课程成功')
            // $this.addClass('selected')
            // 添加本地数据
            // console.log(task.data.curSubjectList)
            // addData.subject_id = data.data.insertId
            // task.data.curSubjectList.push(addData)
            // console.log(task.data.curSubjectList)
            // 重新渲染
            // task.renderCurSubjectList()
          })
        }
      })
    })()
    // 所教班级
    ;(function () {
      // 点击“添加”班级按钮
      $(document).on('click', '.add-class', function () {
        // 记录当前所教课程的班级列表
        task.data.curClassList = task.getCurClassList(this)
        // 记录当前的subject_id
        task.data.curSubjectId = $(this).prevAll('div').data('subjectid')
        // 弹窗，里面渲染班级列表
        $.confirm({
          title: '班级列表',
          buttons: {
            '关闭': function () {}
          },
          content: function () {
            const self = this
            $.ajax({
              url: '/api/class/list',
              method: 'get'
            })
            .done(function (data) {
              if (data.code !== 1) {
                jconfirm.failTips('获取班级列表失败')
                return
              }
              data = task.compareDealClass(data)
              const html = require('../template/personal/class_list_injc.art')(data)
              self.setContentAppend(html)
            })
            .fail(function () {
              jconfirm.failTips('获取班级列表失败')
            })
          }
        })
      })
      // 点击单个课程，添加/删除 此班级
      $(document).on('click', '.in-jc.class-single', function () {
        const $this = $(this)
        const curId = $this.data('classid')
        const data = {
          subject_id: task.data.curSubjectId,
          class_id: $(this).data('classid')
        }
        // 删除班级
        if ($this.hasClass('selected')) {
          $.post('/api/teacher_subject_class/del', data, (data) => {
            if (data.code !== 1) {
              jconfirm.failTips('删除课程失败')
              return
            }
            jconfirm.successTips('删除课程成功')
            window.location.reload()
            // $this.removeClass('selected')
            // 删除本地数据
            // task.data.curClassList.forEach((klass, i) => {
            //   if (klass.class_id === curId) {
            //     task.data.curClassList.splice(i, 1)
            //   }
            // })
            // 重新渲染
            // task.renderCurClassList()
          })
        } else {
        // 添加班级
          const addData = {
            class_id: $this.data('classid'),
            class_name: $this.find('.name').html()
          }
          $.post('/api/teacher_subject_class/add', data, (data) => {
            if (data.code !== 1) {
              jconfirm.failTips('添加课程失败')
              return
            }
            jconfirm.successTips('添加课程成功')
            $this.addClass('selected')
            // 添加本地数据
            // console.log(task.data.curClassList)
            // task.data.curClassList.push(addData)
            // console.log(task.data.curClassList)
            // 重新渲染
            // task.renderCurClassList()
          })
        }
      })
    })()
  },
  // 获取当前老师所教的课程：在本地数据中获取
  getCurSubjectList () {
    const arr = []
    $('.out-jc.subject-single').each(function (i, ele) {
      const obj = {
        subject_id: $(this).data('subjectid'),
        subject_name: $(this).find('.name').html(),
        subject_num: $(this).find('.num').html()
      }
      arr.push(obj)
    })
    return arr
  },
  // 获取当前老师所教课程的班级列表：在本地数据中获取
  getCurClassList (ele) {
    const arr = []
    $(ele).prevAll('div').find('span').each(function (i, ele) {
      const obj = {
        class_id: $(ele).data('classid'),
        class_name: $(ele).html()
      }
      arr.push(obj)
    })
    return arr
  },
  // 对比老师所教的课程与所有课程
  compareDealSubject (data) {
    const dataList = data.data
    const curDataList = task.data.curSubjectList
    for (let i = 0, l1 = curDataList.length; i < l1; i++) {
      for (let j = 0, l2 = dataList.length; j < l2; j++) {
        if (!dataList[j].active) {
          if (dataList[j].subject_id === curDataList[i].subject_id) {
            dataList[j].active = 1
            break
          } else {
            dataList[j].active = 2
          }
        }
      }
    }
    data.data = dataList
    return data
  },
  // 对比老师所教的班级与所有班级
  compareDealClass (data) {
    const dataList = data.data
    const curDataList = task.data.curClassList
    for (let i = 0, l1 = curDataList.length; i < l1; i++) {
      for (let j = 0, l2 = dataList.length; j < l2; j++) {
        if (!dataList[j].active) {
          if (dataList[j].class_id === curDataList[i].class_id) {
            dataList[j].active = 1
            break
          } else {
            dataList[j].active = 2
          }
        }
      }
    }
    data.data = dataList
    return data
  },
  // 渲染老师当前所教的科目
  renderCurSubjectList () {
    const data = {}
    data.subjects = task.data.curSubjectList
    const html = require('../template/personal/subject_list_cur.art')(data)
    $('#subject-list').html(html)
  },
  // 渲染老师当前所教的班级
  renderCurClassList () {
    const data = {}
    data.classes = task.data.curClassList
    const html = require('../template/personal/class_list_cur.art')(data)
    $('#class-list').html(html)
  },
  reload () {
    window.location.reload()
  }
}
task.init()
