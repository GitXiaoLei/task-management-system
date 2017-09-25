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
        <router-link to="/admin/subject">科目管理</router-link>
      </el-menu-item>
    </el-menu>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      activeIndex: '1'
    }
  },
  methods: {
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
