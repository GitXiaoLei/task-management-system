<template>
  <div>
    <div class="layout">
      <div class="layout-ceiling">
        <div class="layout-ceiling-main">
          <router-link to="/home">首页</router-link>
          <router-link to="/student/work" :class="{'do-task': havaTask}">做作业</router-link>
          <router-link to="/student/grade">查看作业</router-link>
          <router-link to="/student/personal">个人中心</router-link>
          <Dropdown placement="bottom-end" trigger="click">
            <a href="javascript:;">
              {{userData.username}} 同学
              <Icon type="arrow-down-b"></Icon>
            </a>
            <DropdownMenu slot="list">
              <DropdownItem @click.native="loginout">退出登录</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { loginout, getUserData } from "../teacher/api.js"
import { getStudentTaskId } from './api.js'
export default {
  name: 'app',
  data () {
    return {
      userData: {},
      havaTask: true
    }
  },
  methods: {
    loginout () {
      loginout()
      .then((data) => {
        data = data.data
        if (data.code !== 1) {
          this.errorMsg('退出登录失败')
          return
        }
        window.location.href = '/'
      })
    },
    // 成功消息提示
    successMsg (msg) {
      this.$Message.success(msg)
    },
    // 失败消息提示
    errorMsg (msg) {
      this.$Message.error(msg)
    }
  },
  created () {
    // 获取用户信息
    getUserData()
    .then((data) => {
      data = data.data
      if (data.code !== 1) {
        this.errorMsg('获取个人信息失败')
        return
      }
      this.userData = data.data[0]
    })
    .catch((e) => {
      this.errorMsg(e)
    })
    // 获取用户是否有未提交的作业
    getStudentTaskId()
    .then((data) => {
      data = data.data
      if (data.code !== 1) {
        this.errorMsg('获取个人信息失败')
        return
      }
      this.havaTask = data.data.is_submit
    })
    .catch((e) => {
      this.errorMsg(e)
    })
  }
}
</script>

<style scoped>
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  /* overflow: hidden; */
}
.layout-ceiling {
  background: #464c5b;
  padding: 14px 0;
  overflow: hidden;
}
.layout-ceiling-main {
  float: right;
  margin-right: 15px;
}
.layout-ceiling-main a {
  /* color: #9ba7b5; */
  color: #eee;
  margin-left: 20px;
}
.do-task {
  position: relative;
}
.do-task:after {
  content: '';
  display: block;
  position: absolute;
  right: -5px;
  top: -3px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #f00;
}
</style>
