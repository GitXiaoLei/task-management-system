import contents from '../../../components/content.vue'
import { getUserInfo, updateStudentInfo, confirmPassword, newPassword } from '../../api.js'
export default {
  name: 'personal',
  components: { contents },
  data() {
    return {
      form: { // 表单数据
        userName: 'xl',
        realName: '',
        sex: 0,
        departmentName: '',
        className: '',
        phoneNum: '',
        qqNum: ''
      },
      formSource: {},
      ruleValidate: {
        userName: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        realName: [
          { required: true, message: '真实姓名不能为空', trigger: 'blur' },
        ],
      },
      modifi: false, // 是否修改资料
      password: '', // 密码
      newPassword: '', // 新密码
      isRepassWord: false,
    }
  },
  methods: {
    anewPassword () {
      if (this.newPassword === '') {
        this.errorMsg('请输入新密码')
        return
      }
      newPassword({ newPassword: this.newPassword })
      .then((data) => {
        data = data.data
        if (data.code !== 1) {
          this.errorMsg(data.message)
          return
        }
        this.successMsg('密码修改成功')
        this.isRepassWord = false
        this.password = ''
        this.newPassword = ''
      })
    },
    confirmPassword () {
      if (this.password === '') {
        this.errorMsg('请输入原密码')
        return
      }
      confirmPassword({ password: this.password })
      .then((data) => {
        data = data.data
        if (data.code !== 1) {
          this.errorMsg('原密码错误')
          return
        }
        if (!data.data) {
          this.errorMsg('原密码错误')
          return
        }
        this.successMsg('请输入新密码')
        this.isRepassWord = true
      })
      .catch((e) => {
        console.error(e)
      })
    },
    // 提交按钮
    handleModifi (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$Loading.start()
          const params = Object.assign({}, this.form)
          updateStudentInfo(params)
          .then((data) => {
            data = data.data
            if (data.code !== 1) {
              this.$Loading.error()
              this.errorMsg('修改信息失败')
              return
            }
            this.$Loading.finish()
            this.formSource = Object.assign({}, this.form)
            this.modifi = false
            this.successMsg('修改信息成功')
          })
          .catch((e) => {
            this.errorMsg(e)
          })
        } else {
          this.errorMsg('请输入正确信息')
        }
    })
    },
    // 取消修改
    cancel() {
      this.form = Object.assign({}, this.formSource)
      this.modifi = false
      // 隐藏错误提示框
      $('.ivu-form-item-error-tip').hide()
    },
    // 成功消息提示
    successMsg(msg) {
      this.$Message.success(msg)
    },
    // 失败消息提示
    errorMsg(msg) {
      this.$Message.error(msg)
    }
  },
  computed: {
    calSex() {
      if (this.form.sex === 0) {
        return '未设置'
      } else if (this.form.sex === 1) {
        return '男'
      } else if (this.form.sex === 2) {
        return '女'
      }
    }
  },
  created() {
    document.title = '个人中心'
    getUserInfo()
      .then((data) => {
        data = data.data
        if (data.code !== 1) {
          this.errorMsg('获取个人信息失败')
          return
        }
        data = data.data[0]
        this.form.userName = this.formSource.userName = data.username
        this.form.realName = this.formSource.realName = data.real_name
        this.form.sex = this.formSource.sex = data.sex
        this.form.departmentName = this.formSource.departmentName = data.department_name
        this.form.className = this.formSource.className = data.class_name
        this.form.phoneNum = this.formSource.phoneNum = data.phone_num
        this.form.qqNum = this.formSource.qqNum = data.qq_num
      })
      .catch((e) => {
        this.errorMsg(e)
      })
  }
}