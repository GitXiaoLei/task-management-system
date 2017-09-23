<template>
  <div id="app">
    <router-view></router-view>
		<div>{{ data }}</div>
  	</div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      data: 'hello'
    }
  }
}
</script>

<style>

</style>
