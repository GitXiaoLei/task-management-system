import './common'
import '../style/personal.scss'
import $ from 'jquery'
import jconfirm from '../utils/popup'

const task = {
  // 初始化
  init () {
    this.data = {
      subjectList: [],
      curSubjectList: []
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
            jconfirm.failTips('修改失败', 300)
            return
          }
          canModifi = true
          $formGroup.find('input').hide()
          $formGroup.find('.confirm-cancel').hide()
          $formGroup.find('.info-val').show()
          $formGroup.find('.info-val').html($formGroup.find('input').val())
          jconfirm.successTips(data.message, 300)
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
              console.log(data)
              data = task.compareDeal(data)
              const html = require('../template/personal/subject_list_injc.art')(data)
              self.setContentAppend(html)
            })
            .fail(function () {
              jconfirm.failTips('获取课程列表失败')
            })
          }
        })
      })
      // 点击单个课程，添加此课程
      $(document).on('click', '.in-jc.subject-single', function () {
        const $this = $(this)
        // 删除课程
        if ($this.hasClass('selected')) {

        } else {
        // 添加课程
          const data = { subject_id: $this.data('subjectid') }
          $.post('/api/teacher_subject/add', data, (data) => {
            if (data.code !== 1) {
              jconfirm.failTips('添加课程失败', 50)
              return
            }
            jconfirm.successTips('添加课程成功', 50)
            $this.addClass('selected')
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
        subject_name: $(this).find('span:nth-of-type(1)').html(),
        subject_num: $(this).find('span:nth-of-type(2)').html()
      }
      arr.push(obj)
    })
    return arr
  },
  // 对比老师所教的课程与所有课程
  compareDeal (data) {
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
  }
}
task.init()
