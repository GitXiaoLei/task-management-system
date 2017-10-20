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
#content{
  width: 1000px;
  margin: 0 auto;
  min-height: 700px;
  background: #fff;
  overflow: hidden;
}
</style>
