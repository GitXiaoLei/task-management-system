<template>
  <div id="app">
    <router-view></router-view>
		<div>{{ data }}</div>
    <el-button @click="get">获取</el-button>
  </div>
</template>

<script>

export default {
  name: 'app',
  data () {
    return {
      data: 'hello'
    }
  },
  methods: {
    get () {
      const instance = this.Axios.create({
        baseURL: 'http://localhost:3000',
        withCredentials: true
      })
      instance
      .get('/admin/access/list')
      .then((data) => {
        console.log(data)
      })
      .catch((err) => {
        console.error(err)
      })
    }
  }
}
</script>

<style>

</style>