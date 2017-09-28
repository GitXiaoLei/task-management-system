<template>
  <div>
    <!-- 有权限访问该页面 -->
    <div v-if="canVisit === 1">
      <!-- 添加科目 -->
      <h2>添加科目</h2>
      <el-form :inline="true" :model="addSubjectForm" ref="addSubjectForm" class="add-form">
        <el-form-item label="科目名称" required>
          <el-input v-model="addSubjectForm.name" placeholder="请输入科目名称"></el-input>
        </el-form-item>
        <el-button type="primary" @click="addSubject('addSubjectForm')">添加</el-button>
        </el-form-item>
      </el-form>
      <!-- 科目列表 -->
      <h2>科目列表</h2>
      <el-table
        :data="subjectData"
        class="main-table">
        <el-table-column
          prop="subject_id"
          label="ID">
        </el-table-column>
        <el-table-column
          prop="subject_name"
          label="科目名称">
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button size="small" type="danger" @click="delSubject(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-else-if="canVisit === 0">你没有权限访问该页面</div>
    <div v-else></div>
  </div>
</template>

<script>
import { getSubject, addSubject, delSubject } from '../api'
export default {
  name: 'subject',
  data () {
    return {
      subjectData: [],
      addSubjectForm: {
        name: ''
      },
      canVisit: -1
    }
  },
  methods: {
    // 获取院系列表
    getSubject () {
      getSubject()
      .then((data) => {
        data = data.data
        if (data.code !== 1) {
          this.errorMsg(data.message)
          return
        }
        this.subjectData = data.data
      })
      .catch((err) => {
        this.errorMsg(err)
      })
    },
    // 添加院系
    addSubject (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return
        }
        // 发送请求
        addSubject({ subject_name: this.addSubjectForm.name })
        .then((data) => {
          data = data.data
          if (data.code !== 1) {
            this.errorMsg(data.message)
            return
          }
          this.successMsg(data.message)
          this.getSubject()
        })
        .catch((err) => {
          this.errorMsg(err)
        })
      })
    },
    // 删除科目
    delSubject (i, row) {
      delSubject({ subject_id: row.subject_id })
      .then((data) => {
        data = data.data
        if (data.code !== 1) {
          this.errorMsg(data.message)
          return
        }
        this.successMsg(data.message)
        // 删除本地数据
        this.subjectData.splice(i, 1)
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
    .checkAuth('/admin/subject')
    .then((code) => {
      // 验证成功，且有权限访问
      if (code === 1) {
        this.getSubject()
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
