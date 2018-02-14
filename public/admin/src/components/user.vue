<template>
  <div>
    <!-- 有权限访问该页面 -->
    <div v-if="canVisit === 1">
      <!-- 添加用户 -->
      <h2>添加单个用户</h2>
      <el-form :inline="true" :model="addUserForm" :rules="rules" ref="addUserForm" class="add-form">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-button type="primary" @click="addUser('addUserForm')">添加</el-button>
        </el-form-item>
      </el-form>
      <!-- <el-popover
        ref="popover"
        placement="right"
        title="Excel文件格式说明"
        width="800"
        trigger="click">
        <img src="../../../common/img/admin-help.png" alt="" style="width: 800px;">
        <p style="font-weight: bold; margin-top: 10px;">*请严格按照上面图片的格式导入用户</p>
      </el-popover> -->
      <h2>批量添加用户
        <!-- <i style="color: #20a0ff; cursor: pointer;" v-popover:popover class="el-icon-information"></i> -->
      </h2>
      <div class="file-wrap">
        <input type="file" @change="readFile" @drag="readFile">
        <div>点击选择文件</div>
      </div>
      <!-- 用户列表 -->
      <h2>用户列表</h2>
      <el-table
        :data="userData"
        border
        class="main-table">
        <el-table-column
          prop="user_id"
          label="ID">
        </el-table-column>
        <el-table-column
          prop="username"
          label="用户名">
        </el-table-column>
        <el-table-column
          prop="real_name"
          label="真实姓名">
        </el-table-column>
        <el-table-column
          prop="sex"
          label="性别">
        </el-table-column>
        <el-table-column
          prop="department_name"
          label="所属院系">
        </el-table-column>
        <el-table-column
          prop="class_name"
          label="所属班级">
        </el-table-column>
        <el-table-column
          prop="student_num"
          label="学号">
        </el-table-column>
        <el-table-column
          prop="phone_num"
          label="电话号码">
        </el-table-column>
        <el-table-column
          prop="qq_num"
          label="QQ号码">
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template scope="scope">
            <el-button size="small" @click="editDialog(scope.$index, scope.row)">编辑</el-button>
            <el-button size="small" @click="chooseRoleDialog(scope.$index, scope.row)">角色</el-button>
            <el-button size="small" type="danger" @click="delUser(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 编辑dialog -->
      <el-dialog
        title="编辑用户信息"
        :visible.sync="editDialogVisible">
        <!-- 编辑的表单 -->
        <el-form :model="editUserForm" ref="editUserForm" label-position="right" class="dialog-form">
          <el-form-item label="用户名" required>
            <el-input v-model="editUserForm.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="真实姓名" required>
            <el-input v-model="editUserForm.real_name" placeholder="请输入真实姓名"></el-input>
          </el-form-item>
          <el-form-item label="学号" required>
            <el-input v-model="editUserForm.student_num" placeholder="请输入学号"></el-input>
          </el-form-item>
          <el-form-item label="性别" required>
            <el-select v-model="editUserForm.sex">
              <el-option
                v-for="sex in sexArr"
                :key="sex.id"
                :label="sex.label"
                :value="sex.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属院系" required>
            <el-select v-model="editUserForm.department_name">
              <el-option
                v-for="department in departmentArr"
                :key="department.id"
                :label="department.department_name"
                :value="department.department_name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属班级" required>
            <el-input v-model="editUserForm.class_name" placeholder="请输入班级名称"></el-input>
          </el-form-item>
          <el-form-item label="电话号码" required>
            <el-input v-model="editUserForm.phone_num" placeholder="请输入电话号码"></el-input>
          </el-form-item>
          <el-form-item label="QQ号码" required>
            <el-input v-model="editUserForm.qq_num" placeholder="请输入QQ号码"></el-input>
          </el-form-item>
        </el-form>
        <!-- dialog footer -->
        <span slot="footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="updateUser">提交</el-button>
        </span>
      </el-dialog>

      <!-- 添加/删除 用户角色 -->
      <el-dialog
        title="更新用户的角色"
        :visible.sync="roleDialogVisible">
        <!-- 角色列表 -->
        <el-form ref="accessForm">
          <el-checkbox-group v-model="checkboxArr">
            <el-checkbox
              class="label"
              v-for="role in roleData"
              :key="role.id"
              :label="role.role_id"
              name="role"
              @change="updateUserRole">【ID:{{ role.role_id }}】{{ role.role_name }}</el-checkbox>
          </el-checkbox-group>
        </el-form>
      </el-dialog>
    </div>
    <div v-else-if="canVisit === 0">你没有权限访问该页面</div>
    <div v-else></div>
  </div>
</template>

<script>
import { getUser, addUser, delUser, getDepartment, updateUser, getRole, getUserRole, addUserRole, delUserRole, addUsers } from '../api'
import XLSX from 'xlsx'
export default {
  name: 'user',
  data () {
    return {
      userData: [],
      addUserForm: {
        username: ''
      },
      editUserForm: {
        username: '',
        real_name: '',
        sex: 0,
        department_name: '',
        class_name: '',
        student_id: '',
        phone_num: '',
        qq_num: '',
        student_num: ''
      },
      editDialogVisible: false,
      roleDialogVisible: false,
      editIndex: -1,
      canVisit: -1,
      departmentArr: [],
      sexArr: [],
      checkboxArr: [],
      roleData: [], // 角色信息
      tempRow: {},
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 得到“批量添加用户”中后台所要的数据
    getAddUsersParams (arr) {
      const datas = []
      for (let i = 0, len = arr.length; i < len; i++) {
        const obj = {
          username: arr[i][0],
          real_name: arr[i][1],
          student_num: arr[i][2],
          sex: arr[i][3],
          class_name: arr[i][4],
          department_name: arr[i][5],
          phone_num: arr[i][6],
          qq_num: arr[i][7]
        }
        datas.push(obj)
      }
      if (datas[0].username !== '用户名' || datas[0].real_name !== '真实姓名' || datas[0].student_num !== '学号' || datas[0].sex !== '性别' || datas[0].class_name !== '班级' || datas[0].department_name !== '院系' || datas[0].phone_num !== '电话号码' || datas[0].qq_num !== 'qq号码') {
        this.errorMsg('Excel文件格式不正确，请按照规则的格式进行导入。')
        return false
      }
      datas.shift()
      return datas
    },
    // 读取文件
    readFile (e) {
      const that = this
      const rABS = true
      const files = e.target.files
      const f = files[0]
      const reader = new FileReader()
      reader.onload = function (e) {
        let data = e.target.result
        if (!rABS) {
          data = new Uint8Array(data)
        }
        const workbook = XLSX.read(data, {type: rABS ? 'binary' : 'array'})
        /* DO SOMETHING WITH workbook HERE */
        const firstWorksheet = workbook.Sheets[workbook.SheetNames[0]]
        const arr = XLSX.utils.sheet_to_json(firstWorksheet, { header: 1 })
        arr.length = arr.length
        console.log(arr)
        const datas = that.getAddUsersParams(arr)
        if (!datas) {
          return
        }
        const params = {
          userObjArr: datas
        }
        addUsers(params)
        .then((data) => {
          data = data.data
          if (data.code !== 1) {
            that.getUser()
            that.$notify({
              message: data.message,
              type: 'warning',
              duration: 0
            })
            return
          }
          that.successMsg('批量添加用户成功！')
          that.getUser()
        })
        .catch((e) => {
          console.error(e)
        })
      }
      if (rABS) {
        reader.readAsBinaryString(f)
      } else {
        reader.readAsArrayBuffer(f)
      }
    },
    // 获取用户
    getUser () {
      getUser()
      .then((data) => {
        data = data.data
        if (data.code !== 1) {
          this.errorMsg(data.message)
          return
        }
        // 去除uid为1的用户，即超级管理员
        data.data.forEach((data, i, arr) => {
          if (data.user_id === 1) {
            arr.splice(i, 1)
          }
        })
        this.userData = data.data
        this.userData.forEach((user) => {
          if (user.sex === 0) {
            user.sex = '未设置'
          } else if (user.sex === 1) {
            user.sex = '男'
          } else {
            user.sex = '女'
          }
        })
      })
      .catch((err) => {
        this.errorMsg(err)
      })
    },
    // 添加用户
    addUser (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 发送请求
          addUser({ username: this.addUserForm.username })
          .then((data) => {
            data = data.data
            if (data.code !== 1) {
              this.errorMsg(data.message)
              return
            }
            this.successMsg(data.message)
            this.getUser()
          })
          .catch((err) => {
            this.errorMsg(err)
          })
        }
      })
    },
    // 删除用户：同时也要删除user_role表中user_id所对应的数据
    delUser (i, row) {
      delUser({ user_id: row.user_id })
      .then((data) => {
        data = data.data
        if (data.code !== 1) {
          this.errorMsg(data.message)
          return
        }
        this.successMsg(data.message)
        // 删除本地数据
        this.userData.splice(i, 1)
      })
      .catch((err) => {
        this.errorMsg(err)
      })
    },
    // 显示编辑的dialog
    editDialog (i, row) {
      this.editUserForm = row
      this.sexArr = [
        { value: 0, label: '不设置' },
        { value: 1, label: '男' },
        { value: 2, label: '女' }
      ]
      // 请求院系
      getDepartment()
      .then((data) => {
        data = data.data
        if (data.code !== 1) {
          this.errorMsg(data.message)
          return
        }
        this.departmentArr = data.data
        this.editDialogVisible = true
      })
      .catch((err) => {
        this.errorMsg(err)
      })
    },
    // 更新用户信息
    updateUser () {
      updateUser(this.editUserForm)
      .then((data) => {
        data = data.data
        if (data.code !== 1) {
          this.errorMsg(data.message)
          return
        }
        this.successMsg(data.message)
        this.editDialogVisible = false
        this.getUser()
      })
      .catch((err) => {
        this.errorMsg(err)
      })
    },
    // 显示更新用户角色的dialog
    chooseRoleDialog (i, row) {
      const that = this
      this.roleDialogVisible = true
      this.checkboxArr = []
      this.tempRow = row
      new Promise((resolve, reject) => {
        getRole()
        .then((data) => {
          data = data.data
          if (data.code !== 1) {
            that.errorMsg(data.message)
            reject(data.message)
          }
          data.data.forEach((data, i, arr) => {
            if (data.role_id === 1) {
              arr.splice(i, 1)
            }
          })
          that.roleData = data.data
          resolve()
        })
        .catch((err) => {
          that.errorMsg(err)
          reject
        })
      })
      // 获取该用户所拥有的角色
      .then((data) => {
        getUserRole({ user_id: row.user_id })
        .then((data) => {
          data = data.data
          if (data.code !== 1) {
            that.errorMsg(data.message)
            return
          }
          data.data.forEach((item) => {
            that.checkboxArr.push(item.role_id)
          })
        })
      })
      .catch((err) => {
        this.errorMsg(err)
      })
      // this.chooseRoleDialog = true
    },
    // 添加、删除某个用户的某个角色
    updateUserRole (e) {
      const targetEl = e.srcElement
      // 添加该角色
      if (targetEl.checked) {
        addUserRole({ user_id: this.tempRow.user_id, role_id: targetEl.value })
        .then((data) => {
          data = data.data
          if (data.code !== 1) {
            this.errorMsg('移除角色成功')
            targetEl.checked = false
            return
          }
          this.successMsg('添加角色成功')
        })
        .catch((err) => {
          this.errorMsg(err)
        })
      } else {
      // 删除该角色
        delUserRole({ user_id: this.tempRow.user_id, role_id: targetEl.value })
        .then((data) => {
          data = data.data
          if (data.code !== 1) {
            this.errorMsg(data.message)
            targetEl.checked = true
            return
          }
          this.successMsg(data.message)
        })
        .catch((err) => {
          this.errorMsg(err)
        })
      }
    },
    // 成功消息提示
    successMsg (msg) {
      this.$message({
        message: msg,
        type: 'success'
      })
    },
    // 失败、错误消息提示
    errorMsg (msg) {
      this.$message({
        message: msg,
        type: 'error'
      })
    }
  },
  created () {
    this
    .checkAuth('/admin/user')
    .then((code) => {
      // 验证成功，且有权限访问
      if (code === 1) {
        this.getUser()
        this.canVisit = 1
      } else if (code === -1) {
      // 没有登录，跳转至登录页面
        window.location.href = '/'
      } else if (code === 0) {
      // 没有权限访问该页面
        this.canVisit = 0
      }
    })
    .catch((err) => {
      this.errorMsg(err)
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.file-wrap {
  position: relative;
  height: 120px;
  overflow: hidden;
}
.file-wrap input {
  width: 420px;
  height: 120px;
  line-height: 120px;
  border: 2px dashed #dddee1;
  border-radius: 10px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  cursor: pointer;
  z-index: 1;
}
.file-wrap div {
  width: 420px;
  height: 116px;
  line-height: 120px;
  text-align: center;
  border: 2px dashed #dddee1;
  border-radius: 10px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  opacity: 1;
  cursor: pointer;
}
</style>
