<template>
  <div id="app">
    <!-- 导航栏 -->
		<el-menu theme="dark" :default-active="activeIndex" mode="horizontal">
      <el-menu-item index="1">
        <router-link to="/admin/user">用户管理</router-link>
      </el-menu-item>
      <el-menu-item index="2">
        <router-link to="/admin/role">角色管理</router-link>
      </el-menu-item>
      <el-menu-item index="3">
        <router-link to="/admin/access">权限管理</router-link>
      </el-menu-item>
      <el-menu-item index="4">
        <router-link to="/admin/department">院系管理</router-link>
      </el-menu-item>
      <el-menu-item index="5">
        <router-link to="/admin/subject">课程管理</router-link>
      </el-menu-item>
      <el-menu-item index="6">
        <router-link to="/admin/class">班级管理</router-link>
      </el-menu-item>
      <el-button @click="loginout" style="float: right; margin: 10px; background-color: #324157; color: #fff;">退出登录</el-button>
    </el-menu>
    <router-view></router-view>
  </div>
</template>

<script>
import { loginout } from './api'
export default {
  name: 'app',
  data () {
    return {
      activeIndex: '1'
    }
  },
  methods: {
    loginout () {
      loginout()
      .then((data) => {
        data = data.data
        if (data.code !== 1) {
          this.errorMsg(data.message)
          return
        }
        this.errorMsg(data.message)
        window.location.href = '/'
      })
      .catch((err) => {
        console.error(err)
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
  }
}
</script>

<style scoped>
.el-menu-item a{
  display: block;
  height: 100%;
}
</style>
