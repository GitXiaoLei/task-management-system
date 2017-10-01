<template>
  <div>
    <!-- 有权限访问该页面 -->
    <div v-if="canVisit === 1">
      <!-- 添加班级 -->
      <h2>添加班级</h2>
      <el-form :inline="true" :model="addClassForm" ref="addClassForm" class="add-form">
        <el-form-item label="班级名称" required>
          <el-input v-model="addClassForm.name" placeholder="请输入班级名称"></el-input>
        </el-form-item>
        <el-button type="primary" @click="addClass('addClassForm')">添加</el-button>
        </el-form-item>
      </el-form>
      <!-- 班级列表 -->
      <h2>班级列表</h2>
      <el-table
        :data="classData"
        class="main-table">
        <el-table-column
          prop="class_id"
          label="ID">
        </el-table-column>
        <el-table-column
          prop="class_name"
          label="班级名称">
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button size="small" type="danger" @click="delClass(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-else-if="canVisit === 0">你没有权限访问该页面</div>
    <div v-else></div>
  </div>
</template>

<script>
import { getClass, addClass, delClass } from '../api'
export default {
  name: 'class',
  data () {
    return {
      classData: [],
      addClassForm: {
        name: ''
      },
      canVisit: -1
    }
  },
  methods: {
    // 获取班级列表
    getClass () {
      getClass()
      .then((data) => {
        data = data.data
        if (data.code !== 1) {
          this.errorMsg(data.message)
          return
        }
        this.classData = data.data
      })
      .catch((err) => {
        this.errorMsg(err)
      })
    },
    // 添加院系
    addClass (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return
        }
        // 发送请求
        addClass({ class_name: this.addClassForm.name })
        .then((data) => {
          data = data.data
          if (data.code !== 1) {
            this.errorMsg(data.message)
            return
          }
          this.successMsg(data.message)
          this.getClass()
        })
        .catch((err) => {
          this.errorMsg(err)
        })
      })
    },
    // 删除科目
    delClass (i, row) {
      delClass({ class_id: row.class_id })
      .then((data) => {
        data = data.data
        if (data.code !== 1) {
          this.errorMsg(data.message)
          return
        }
        this.successMsg(data.message)
        // 删除本地数据
        this.classData.splice(i, 1)
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
    .checkAuth('/admin/class')
    .then((code) => {
      // 验证成功，且有权限访问
      if (code === 1) {
        this.getClass()
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
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
