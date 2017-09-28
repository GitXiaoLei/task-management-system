<template>
  <div>
    <!-- 有权限访问该页面 -->
    <div v-if="canVisit === 1">
      <!-- 添加院系 -->
      <h2>添加院系</h2>
      <el-form :inline="true" :model="addDepartmentForm" ref="addDepartmentForm" class="add-form">
        <el-form-item label="院系名称" required>
          <el-input v-model="addDepartmentForm.name" placeholder="请输入院系名称"></el-input>
        </el-form-item>
        <el-button type="primary" @click="addDepartment('addDepartmentForm')">添加</el-button>
        </el-form-item>
      </el-form>
      <!-- 院系列表 -->
      <h2>院系列表</h2>
      <el-table
        :data="departmentData"
        class="main-table">
        <el-table-column
          prop="department_id"
          label="ID">
        </el-table-column>
        <el-table-column
          prop="department_name"
          label="院系名称">
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button size="small" type="danger" @click="delDepartment(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-else-if="canVisit === 0">你没有权限访问该页面</div>
    <div v-else></div>
  </div>
</template>

<script>
import { getDepartment, addDepartment, delDepartment } from '../api'
export default {
  name: 'department',
  data () {
    return {
      departmentData: [],
      addDepartmentForm: {
        name: ''
      },
      canVisit: -1
    }
  },
  methods: {
    // 获取院系列表
    getDepartment () {
      getDepartment()
      .then((data) => {
        data = data.data
        if (data.code !== 1) {
          this.errorMsg(data.message)
          return
        }
        this.departmentData = data.data
      })
      .catch((err) => {
        this.errorMsg(err)
      })
    },
    // 添加院系
    addDepartment (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return
        }
        // 发送请求
        addDepartment({ department_name: this.addDepartmentForm.name })
        .then((data) => {
          data = data.data
          if (data.code !== 1) {
            this.errorMsg(data.message)
            return
          }
          this.successMsg(data.message)
          this.getDepartment()
        })
        .catch((err) => {
          this.errorMsg(err)
        })
      })
    },
    // 删除科目
    delDepartment (i, row) {
      delDepartment({ department_id: row.department_id })
      .then((data) => {
        data = data.data
        if (data.code !== 1) {
          this.errorMsg(data.message)
          return
        }
        this.successMsg(data.message)
        // 删除本地数据
        this.departmentData.splice(i, 1)
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
    .checkAuth('/admin/department')
    .then((code) => {
      // 验证成功，且有权限访问
      if (code === 1) {
        this.getDepartment()
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
