<template>
  <div>
    <!-- 有权限访问页面才会渲染出来 -->
    <div v-if="canVisit === 1">
      <!-- 添加角色 -->
      <h2>添加角色</h2>
      <el-form :inline="true" :model="addRoleForm" ref="addRoleForm" class="add-form">
        <el-form-item label="角色名" required>
          <el-input v-model="addRoleForm.role_name" placeholder="请输入角色名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addRole('addRoleForm')">添加</el-button>
        </el-form-item>
      </el-form>
      <!-- 角色列表 -->
      <h2>角色列表</h2>
      <el-table
        :data="roleData"
        class="main-table">
        <el-table-column
          prop="role_id"
          label="ID">
        </el-table-column>
        <el-table-column
          prop="role_name"
          label="角色名">
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button v-if="scope.row.role_id !== 1" size="small" type="danger" @click="delRole(scope.$index, scope.row)">删除</el-button>
            <el-button size="small" type="primary" @click="editDialog(scope.$index, scope.row)">权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加/删除 权限dialog -->
      <el-dialog
        title="更新角色的权限"
        :visible.sync="dialogVisible">
        <!-- 权限列表 -->
        <el-form ref="accessForm">
          <el-checkbox-group v-model="checkboxArr">
            <el-checkbox
              class="label"
              v-for="access in accessData"
              :key="access.id"
              :label="access.access_id"
              name="access"
              @change="updateRoleAccess">【ID:{{ access.access_id }}】{{ access.access_url }}<span style="float: right;">【{{ access.access_title }}】</span></el-checkbox>
          </el-checkbox-group>
        </el-form>
      </el-dialog>
    </div>
    <!-- 没有权限访问该页面 -->
    <div v-else-if="canVisit === 0">你没有权限访问该页面！</div>
    <!-- 过渡页面 -->
    <div v-else></div>
  </div>
</template>

<script>
import { getRole, addRole, delRole, getAccess, getRoleAccess, addRoleAccess, delRoleAccess } from '../api'
export default {
  name: 'role',
  data () {
    return {
      roleData: [],
      addRoleForm: {
        role_name: ''
      },
      accessData: [],
      checkboxArr: [],
      dialogVisible: false,
      tempRow: {},
      canVisit: -1
    }
  },
  methods: {
    // 获取角色
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
    // 添加角色
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
    // 删除角色：同时要将该角色的权限删除掉
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
    // 显示更新角色权限的dialog
    editDialog (i, row) {
      const that = this
      this.dialogVisible = true
      this.checkboxArr = []
      this.tempRow = row
      // 获取所有权限
      new Promise((resolve, reject) => {
        getAccess()
        .then((data) => {
          data = data.data
          if (data.code !== 1) {
            that.errorMsg(data.message)
            reject(data.message)
            return
          }
          that.accessData = data.data
          resolve()
        })
        .catch((err) => {
          that.errorMsg(err)
          reject(err)
        })
      })
      // 获取某个角色的所有权限
      .then((data) => {
        getRoleAccess({ role_id: row.role_id })
        .then((data) => {
          data = data.data
          if (data.code !== 1) {
            that.errorMsg(data.message)
            return
          }
          data.data.forEach((item) => {
            that.checkboxArr.push(item.access_id)
          })
        })
        .catch((err) => {
          that.errorMsg(err)
        })
      })
      .catch((err) => {
        that.errorMsg(err)
      })
    },
    // 更新某个角色的权限
    updateRoleAccess (e) {
      const targetEl = e.srcElement
      // 添加该权限
      if (targetEl.checked) {
        addRoleAccess({ role_id: this.tempRow.role_id, access_id: targetEl.value })
        .then((data) => {
          data = data.data
          if (data.code !== 1) {
            this.errorMsg(data.message)
            targetEl.checked = false
            return
          }
          this.successMsg(data.message)
        })
        .catch((err) => {
          this.errorMsg(err)
        })
      } else {
      // 删除该权限
        delRoleAccess({ role_id: this.tempRow.role_id, access_id: targetEl.value })
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
    .checkAuth('/admin/role')
    .then((code) => {
      // 验证成功，且有权限访问
      if (code === 1) {
        this.getRole()
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

<style>
/* label{
  display: block;
  padding: 4px 0 2px 0px;
  border-bottom: 1px solid #eef1f6;
}
label:hover{
  background: #eef1f6;
}
.el-checkbox{
  margin-left: 0;
}
.el-dialog__body{
  max-height: 460px;
  overflow: auto;
} */
</style>
