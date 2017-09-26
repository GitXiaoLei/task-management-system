<template>
  <div>
    <!-- 有权限访问该页面 -->
    <div v-if="canVisit === 1">
      department
    </div>
    <div v-else-if="canVisit === 0">你没有权限访问该页面</div>
    <div v-else></div>
  </div>
</template>

<script>
export default {
  name: 'department',
  data () {
    return {
      canVisit: -1
    }
  },
  created () {
    this
    .checkAuth('/admin/department')
    .then((code) => {
      // 验证成功，且有权限访问
      if (code === 1) {
        // this.getRole()
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
