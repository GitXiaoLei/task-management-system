<template>
  <div id="app">
    <router-view></router-view>
		<div>{{ data }}</div>
    <el-button @click="g">获取</el-button>
  </div>
</template>

<script>
import { getAccessList } from './api'
export default {
  name: 'app',
  data () {
    return {
      data: 'hello'
    }
  },
  methods: {
    g () {
      getAccessList()
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