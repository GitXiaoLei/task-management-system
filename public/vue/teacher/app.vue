<template>
  <div>
    <div class="layout">
      <div class="layout-ceiling">
        <div class="layout-ceiling-main">
          <router-link to="/">首页</router-link>
          <router-link to="/teacher/publish">布置作业</router-link>
          <router-link to="/teacher/check">批改作业</router-link>
          <router-link to="/teacher/grade">查看成绩</router-link>
          <router-link to="/teacher/personal">个人中心</router-link>
          <Dropdown placement="bottom-end" trigger="click">
            <a href="javascript:;">
              {{userName}} 老师
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
import { loginout } from './api.js'
export default {
  name: 'app',
  data () {
    return {
      userName: 'xl'
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
</style>
