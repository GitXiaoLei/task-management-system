import $ from 'jquery'

// 登录
$(document).on('click', '.login', function () {
  $.post({
    url: '/login',
    data: {
      username: $('#username').val(),
      password: $('#password').val()
    },
    success: function (data) {
      console.log(data)
      data = data.data
      window.location.href = '/'
    },
    error: function (data) {
      console.error(data)
    }
  })
})
// 退出登录
$(document).on('click', '.loginout', function () {
  $.get({
    url: '/loginout',
    success (data) {
      window.location.href = '/'
    },
    error (e) {
      console.log(e)
    }
  })
})
