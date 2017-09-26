<template>
  <div>
    <!-- 有权限访问该页面 -->
    <div v-if="canVisit === 1">
      <!-- 添加用户 -->
      <el-form :inline="true" :model="addUserForm" ref="addUserForm">
        <el-form-item label="用户名" required>
          <el-input v-model="addAccessForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-button type="primary" @click="addUser('addUserForm')">添加</el-button>
        </el-form-item>
      </el-form>
      <!-- 用户列表 -->
      <el-table
        :data="userData">
        <el-table-column
          prop="user_id"
          label="ID"
          width="180">
        </el-table-column>
        <el-table-column
          prop="user_name"
          label="用户名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="user_password"
          label="密码">
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
            <el-button size="small" type="danger" @click="delUser(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-else-if="canVisit === 0">你没有权限访问该页面</div>
    <div v-else></div>
  </div>
</template>

<script>
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
      dialogVisible: false,
      editIndex: -1,
      canVisit: -1
    }
  },
  methods: {
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
        // this.getUser()
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
