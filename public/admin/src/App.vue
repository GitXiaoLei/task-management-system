<template>
  <div id="app">
		<div>App component</div>
    <router-view></router-view>
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