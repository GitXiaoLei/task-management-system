<template>
  <div>
    <!-- 添加角色 -->
    <el-form :inline="true" :model="addRoleForm" ref="addRoleForm">
      <el-form-item label="角色名" required>
        <el-input v-model="addRoleForm.role_name" placeholder="请输入角色名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addRole('addRoleForm')">添加</el-button>
      </el-form-item>
    </el-form>
    <!-- 角色列表 -->
    <el-table
      :data="roleData">
      <el-table-column
        prop="role_id"
        label="ID"
        width="180">
      </el-table-column>
      <el-table-column
        prop="role_name"
        label="角色名"
        width="180">
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button v-if="scope.row.role_id !== 1" size="small" type="danger" @click="delRole(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getRole, addRole, delRole } from '../api'
export default {
  name: 'role',
  data () {
    return {
      roleData: [],
      addRoleForm: {
        role_name: ''
      }
    }
  },
  methods: {
    // 获取权限
    getRole () {
      getRole()
      .then((data) => {
        data = data.data
        if (data.code !== 1) {
          this.errorMsg(data.message)
          return
        }
        this.roleData = data.data
      })
      .catch((err) => {
        this.errorMsg(err)
      })
    },
    // 添加权限
    addRole (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return
        }
        // 发送请求
        addRole({ role_name: this.addRoleForm.role_name })
        .then((data) => {
          data = data.data
          if (data.code !== 1) {
            this.errorMsg(data.message)
            return
          }
          this.successMsg(data.message)
          this.getRole()
        })
        .catch((err) => {
          this.errorMsg(err)
        })
      })
    },
    // 删除权限
    delRole (i, row) {
      delRole({ role_id: row.role_id })
      .then((data) => {
        data = data.data
        if (data.code !== 1) {
          this.errorMsg(data.message)
          return
        }
        this.successMsg(data.message)
        // 删除本地数据
        this.roleData.splice(i, 1)
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
    this.getRole()
  }
}
</script>

<style scoped>

</style>
