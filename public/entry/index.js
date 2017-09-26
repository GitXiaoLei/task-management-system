import $ from 'jquery'

$(document).on('click', 'button', function () {
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
