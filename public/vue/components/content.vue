<template>
  <div id="content">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'contents',
}
</script>

<style>
body{
  padding-bottom: 50px;
}
#content{
  width: 1000px;
  margin: 0 auto;
  min-height: 500px;
  background: #fff;
  overflow: hidden;
  position: relative;
  padding-bottom: 100px;
}
</style>
