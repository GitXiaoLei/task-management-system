<template>
  <div>
    <!-- 有权限访问该页面 -->
    <div v-if="canVisit === 1">
      <!-- 添加用户 -->
      <el-form :inline="true" :model="addUserForm" ref="addUserForm">
        <el-form-item label="用户名" required>
          <el-input v-model="addUserForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-button type="primary" @click="addUser('addUserForm')">添加</el-button>
        </el-form-item>
      </el-form>
      <!-- 用户列表 -->
      <el-table
        :data="userData"
        border>
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
          prop="student_id"
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
        <el-table-column label="操作">
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
        <el-form :model="editUserForm" ref="editUserForm" label-position="right">
          <el-form-item label="用户名" required>
            <el-input v-model="editUserForm.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="真实姓名" required>
            <el-input v-model="editUserForm.real_name" placeholder="请输入真实姓名"></el-input>
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
    </div>
    <div v-else-if="canVisit === 0">你没有权限访问该页面</div>
    <div v-else></div>
  </div>
</template>

<script>
import { getUser, addUser, delUser, getDepartment, updateUser } from '../api'
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
        qq_num: ''
      },
      editDialogVisible: false,
      editIndex: -1,
      canVisit: -1,
      departmentArr: [],
      sexArr: []
    }
  },
  methods: {
    // 获取用户
    getUser () {
      getUser()
      .then((data) => {
        data = data.data
        if (data.code !== 1) {
          this.errorMsg(data.message)
          return
        }
        this.userData = data.data
      })
      .catch((err) => {
        this.errorMsg(err)
      })
    },
    // 添加用户
    addUser (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return
        }
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
      })
    },
    // 删除用户
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
      })
      .catch((err) => {
        this.errorMsg(err)
      })
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

</style>
