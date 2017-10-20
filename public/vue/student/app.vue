<template>
  <div>
    <div class="layout">
      <div class="layout-ceiling">
        <div class="layout-ceiling-main">
          <a href="#">做作业</a> |
          <a href="#">查看作业</a> |
          <a href="#">个人中心</a>
          <Dropdown placement="bottom-end" trigger="click">
            <a href="javascript:;">
              {{userName}} 同学
              <Icon type="arrow-down-b"></Icon>
            </a>
            <DropdownMenu slot="list">
              <DropdownItem>退出登录</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import app from "./app.js"
export default {
  name: 'app',
  data () {
    return {
      userName: 'xl'
    }
  }
}
// export default app;
</script>

<style lang="less">
@primary-color: #464c5b;
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
