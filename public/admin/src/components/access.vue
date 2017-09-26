<template>
  <div>
    <!-- 有权限访问 -->
    <div v-if="canVisit === 1">
      <!-- 添加权限 -->
      <el-form :inline="true" :model="addAccessForm" ref="addAccessForm">
        <el-form-item label="标题" required>
          <el-input v-model="addAccessForm.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="URL" required>
          <el-input v-model="addAccessForm.url" placeholder="请输入地址"></el-input>
        </el-form-item><el-form-item>
        <el-button type="primary" @click="addAccess('addAccessForm')">添加</el-button>
        </el-form-item>
      </el-form>
      <!-- 权限列表 -->
      <el-table
        :data="accessData">
        <el-table-column
          prop="access_id"
          label="ID"
          width="180">
        </el-table-column>
        <el-table-column
          prop="access_title"
          label="标题"
          width="180">
        </el-table-column>
        <el-table-column
          prop="access_url"
          label="地址">
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button size="small" @click="editDialog(scope.$index, scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="delAccess(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 编辑dialog -->
      <el-dialog
        title="编辑权限"
        :visible.sync="dialogVisible">
        <!-- 编辑的表单 -->
        <el-form :inline="true" :model="editAccessForm" ref="editAccessForm">
          <el-form-item label="标题" required>
            <el-input v-model="editAccessForm.access_title" placeholder="请输入标题"></el-input>
          </el-form-item>
          <el-form-item label="URL" required>
            <el-input v-model="editAccessForm.access_url" placeholder="请输入地址"></el-input>
          </el-form-item>
        </el-form>
        <!-- dialog footer -->
        <span slot="footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="updateAccess">提交</el-button>
        </span>
      </el-dialog>
    </div>
    <div v-else-if="canVisit === 0">你没有权限访问该页面</div>
    <div v-else></div>
  </div>
</template>

<script>
import { getAccess, addAccess, delAccess, updateAccess } from '../api'
export default {
  name: 'access',
  data () {
    return {
      accessData: [],
      addAccessForm: {
        title: '',
        url: ''
      },
      editAccessForm: {
        access_id: -1,
        access_title: '',
        access_url: ''
      },
      dialogVisible: false,
      editIndex: -1,
      canVisit: -1
    }
  },
  methods: {
    // 获取权限
    getAccess () {
      getAccess()
      .then((data) => {
        data = data.data
        if (data.code !== 1) {
          this.errorMsg(data.message)
          return
        }
        this.accessData = data.data
      })
      .catch((err) => {
        this.errorMsg(err)
      })
    },
    // 添加权限
    addAccess (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return
        }
        // 发送请求
        addAccess({
          access_title: this.addAccessForm.title,
          access_url: this.addAccessForm.url
        })
        .then((data) => {
          data = data.data
          if (data.code !== 1) {
            this.errorMsg(data.message)
            return
          }
          this.successMsg(data.message)
          this.getAccess()
        })
        .catch((err) => {
          this.errorMsg(err)
        })
      })
    },
    // 删除权限：要同时删除role_access中access_id对应的记录
    delAccess (i, row) {
      delAccess({ access_id: row.access_id })
      .then((data) => {
        data = data.data
        if (data.code !== 1) {
          this.errorMsg(data.message)
          return
        }
        this.successMsg(data.message)
        // 删除本地数据
        this.accessData.splice(i, 1)
      })
      .catch((err) => {
        this.errorMsg(err)
      })
    },
    // 显示编辑dialog
    editDialog (i, row) {
      this.editAccessForm = row
      this.dialogVisible = true
      this.editIndex = i
    },
    // 更新权限
    updateAccess () {
      updateAccess(this.editAccessForm)
      .then((data) => {
        data = data.data
        this.dialogVisible = false
        if (data.code !== 1) {
          this.errorMsg(data.message)
          return
        }
        // 更新本地数据
        this.successMsg(data.message)
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
    .checkAuth('/admin/access')
    .then((code) => {
      // 验证成功，且有权限访问
      if (code === 1) {
        this.getAccess()
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

<style scoped>
</style>

