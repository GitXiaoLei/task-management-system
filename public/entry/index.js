new Vue({
  el: '#app',
  data: {
    formInline: {
      user: '',
      password: ''
    }
  },
  methods: {
    handleSubmit() {
      var that = this
      if (this.formInline.user === '') {
        this.$Notice.error({
          title: '请输入用户名！'
        })
        return
      }
      if (this.formInline.password === '') {
        this.$Notice.error({
          title: '请输入密码'
        })
        return
      }
      $.post({
        url: '/login',
        data: {
          username: that.formInline.user,
          password: that.formInline.password
        },
        success: function (data) {
          if (data.code !== 1) {
            that.$Message.error('用户名或密码错误')
            return
          } else {
            window.location.href = '/'
          }
        },
        error: function (data) {
          console.error(data)
        }
      })
    }
  }
})

