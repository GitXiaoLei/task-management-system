import contents from '../../../components/content.vue'
import { getPersonalWebData, updateStudentInfo, getSubjectList, delSubject, addSubject, getClassList, addClass, delClass } from '../../api.js'
export default {
  name: 'personal',
  components: { contents },
  data() {
    return {
      form: { // 个人信息表单数据
        username: '',
        real_name: '',
        sex: 0,
        department_name: '',
        class_name: '',
        phone_num: '',
        qq_num: ''
      },
      formSource: {}, // 个人信息表单数据的复制对象
      ruleValidate: { // 修改个人信息时的表单验证规则
        userName: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        realName: [
          { required: true, message: '真实姓名不能为空', trigger: 'blur' },
        ],
      },
      modifi: false, // 是否修改资料
      subjects: [], // 所教课程
      classColumn: [ // 班级表格的表头
        { title: '班级名', key: 'class_name' },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params) => {
            return h('Button', {
              props: {
                type: 'error',
                size: 'small'
              },
              on: {
                click: () => {
                  this.delClass(params.row, params.index)
                }
              }
            }, '删除班级')
          }
        }
      ],
      subjectColumn: [ // 所教课程表格表头
        {
          type: 'expand',
          render: (h, params) => {
            return h('Table', {
              props: {
                data: params.row.classes,
                columns: this.classColumn
              }
            })
          }
        },
        { title: '课程名', key: 'subject_name' },
        { title: '课程号', key: 'subject_num' },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              // 添加班级按钮
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.getClassList(params.row)
                  }
                }
              }, '添加班级'),
              // 删除课程按钮
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.delSubject(params.row, params.index)
                  }
                }
              }, '删除课程')
            ])
            
          }
        }
      ],
      subjectListColumn: [ // 课程列表表头
        { title: '课程名', key: 'subject_name' },
        { title: '课程号', key: 'subject_num' },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params) => {
            // 该课程被选了，就不出现添加按钮
            if (params.row.selected === 1) {
              return h('Button', {
                props: {
                  type: 'ghost',
                  size: 'small',
                  disabled: true
                }
              }, '已添加')
            } else {
            // 该课程没有被选，出现添加按钮
              return h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.addSubject(params.row, params.index)
                  }
                }
              }, '添加')
            }
          }
        }
      ],
      classListColumn: [ // 课程列表表头
        { title: '班级名', key: 'class_name' },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params) => {
            // 该班级被选了，就不出现添加按钮
            if (params.row.selected === 1) {
              return h('Button', {
                props: {
                  type: 'ghost',
                  size: 'small',
                  disabled: true
                }
              }, '已添加')
            } else {
            // 该班级没有被选，出现添加按钮
              return h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.addClass(params.row, params.index)
                  }
                }
              }, '添加')
            }
          }
        }
      ],
      subjectList: [], // 课程列表
      classList: [], // 班级列表
      subjectListMod: false, // 是否显示课程列表的modal
      classListMod: false, // 是否显示班级列表的modal
      subjectId: 0, // 课程id
    }
  },
  methods: {
    expandChange (row, status) {
      this.closeOtherRows(row, status)
    },
    // 点击展开某一行表格的时候，关闭别的已经展开的行
    closeOtherRows (row, status) {
      console.log(row, status)
      if (!status) {
        return
      }
      this.subjects.forEach((subject) => {
        if (row.subject_id !== subject.subject_id) {
          subject._expanded = false
        } else {
          subject._expanded = true
        }
      })
      console.log(this.subjects)
    },
    // 删除某个课程的某个班级
    delClass (row, i) {
      const params = {
        subject_id: row.subject_id,
        class_id: row.class_id
      }
      delClass(params)
      .then((data) => {
        data = data.data
        if (data.code !== 1) {
          this.errorMsg(data.message)
          return
        }
        this.successMsg('删除班级成功')
        // 删除本地数据
        this.subjects.forEach((subject) => {
          if (subject.subject_id == row.subject_id) {
            subject.classes.splice(i, 1)
          }
        })
        // 不加这个的话，先添加课程，再添加班级，再删除班级，班级信息不会即时更新
        this.subjectColumn = [
          {
            type: 'expand',
            render: (h, params) => {
              return h('Table', {
                props: {
                  data: params.row.classes,
                  columns: this.classColumn
                }
              })
            }
          },
          { title: '课程名', key: 'subject_name' },
          { title: '课程号', key: 'subject_num' },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            width: '220',
            render: (h, params) => {
              return h('div', [
                // 添加班级按钮
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.getClassList(params.row)
                    }
                  }
                }, '添加班级'),
                // 删除课程按钮
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.delSubject(params.row, params.index)
                    }
                  }
                }, '删除课程')
              ])
              
            }
          }
        ]
        this.classListMod = false
      })
      .catch((e) => {
        this.errorMsg((e))
      })
    },
    // 为某个课程添加班级
    addClass (row, i) {
      const params = {
        subject_id: this.subjectId,
        class_id: row.class_id
      }
      addClass(params)
      .then((data) => {
        data = data.data
        if (data.code !== 1) {
          this.errorMsg('添加班级失败')
          return
        }
        this.successMsg('添加班级成功')
        // 添加本地数据
        this.subjects.forEach((klass) => {
          if (klass.subject_id == this.subjectId) {
            row.subject_id = this.subjectId
            klass.classes.push(row)
            klass.classes[klass.classes.length - 1].selected = 1
          }
        })
        // 不加这个的话，先添加课程，再添加班级，班级信息不会即时更新
        this.subjectColumn = [
          {
            type: 'expand',
            render: (h, params) => {
              return h('Table', {
                props: {
                  data: params.row.classes,
                  columns: this.classColumn
                }
              })
            }
          },
          { title: '课程名', key: 'subject_name' },
          { title: '课程号', key: 'subject_num' },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                // 添加班级按钮
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.getClassList(params.row)
                    }
                  }
                }, '添加班级'),
                // 删除课程按钮
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.delSubject(params.row, params.index)
                    }
                  }
                }, '删除课程')
              ])
              
            }
          }
        ]
        this.classListMod = false
      })
    },
    // 获取班级列表
    getClassList (row) {
      this.subjectId = row.subject_id
      this.classListMod = true
      getClassList()
      .then((data) => {
        data = data.data
        if (data.code !== 1) {
          this.errorMsg('获取所有班级失败')
          return
        }
        this.classList = data.data
        this.classList.forEach((classAll) => {
          row.classes.forEach((classCur) => {
            if (classAll.class_id === classCur.class_id) {
              classAll.selected = 1
            }
          })
        })
      })
      .catch((e) => {
        this.errorMsg(e)
      })
    },
    // 添加课程
    addSubject (row, i) {
      const params = { subject_id: row.subject_id }
      addSubject(params)
      .then((data) => {
        data = data.data
        if (data.code !== 1) {
          this.errorMsg('添加课程失败')
          return
        }
        this.successMsg('添加课程成功')
        // 添加本地数据
        this.subjects.push(row)
        this.subjects[this.subjects.length - 1].classes = []
        // 修改 课程列表 中的selected属性
        this.subjectList.forEach((subject) => {
          if (subject.subject_id === row.subject_id) {
            subject.selected = 1
          }
        })
        this.subjectListMod = false
      })
      .catch((e) => {
        this.errorMsg(e)
      })
    },
    // 删除课程
    delSubject (row, i) {
      const params = { subject_id: row.subject_id }
      delSubject(params)
      .then((data) => {
        data = data.data
        if (data.code !== 1) {
          this.errorMsg(data.message)
          return
        }
        this.successMsg('删除课程成功')
        // 删除本地数据
        this.subjects.splice(i, 1)
        // 修改 课程列表 中的selected属性
        this.subjectList.forEach((subject) => {
          if (subject.subject_id === row.subject_id) {
            subject.selected = 0
          }
        })
      })
      .catch((e) => {
        this.errorMsg(e)
      })
    },
    // 获取课程列表
    getSubjectList () {
      this.subjectListMod = true
      getSubjectList()
      .then((data) => {
        data = data.data
        if (data.code !== 1) {
          this.errorMsg('获取所有课程失败')
          return
        }
        this.subjectList = data.data
        this.subjectList.forEach((subjectAll) => {
          this.subjects.forEach((subjectCur) => {
            if (subjectAll.subject_id === subjectCur.subject_id) {
              subjectAll.selected = 1
            }
          })
        })
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
    cancel () {
      this.form = Object.assign({}, this.formSource)
      this.modifi = false
      // 隐藏错误提示框
      $('.ivu-form-item-error-tip').hide()
    },
    // 成功消息提示
    successMsg (msg) {
      this.$Message.success(msg)
    },
    // 失败消息提示
    errorMsg (msg) {
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
    getPersonalWebData()
    .then((data) => {
      data = data.data
      if (data.code !== 1) {
        this.errorMsg('获取页面信息失败')
        return
      }
      const userData = data.data.userData[0]
      const subjectClassData = data.data.subjectClassData
      this.subjects = subjectClassData
      this.form.username = this.formSource.username = userData.username
      this.form.real_name = this.formSource.real_name = userData.real_name
      this.form.sex = this.formSource.sex = userData.sex
      this.form.department_name = this.formSource.department_name = userData.department_name
      this.form.phone_num = this.formSource.phone_num = userData.phone_num
      this.form.qq_num = this.formSource.qq_num = userData.qq_num
    })
    .catch((e) => {
      this.errorMsg(e)
    })
  }
}