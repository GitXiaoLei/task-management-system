<template>
  <contents>
    <tab-list
      title="tabList的标题"
      :data="data"
      :tabs-name="['未完成', '已完成']"
      @li-selected="liClick"
      @li-del="liDel">
        <Button @click="ccc" type="primary" size="small" slot="headButton">创建作业</Button>
      </tab-list>
  </contents>
</template>

<style scoped>
</style>

<script>
import check from "./check"
export default check
</script>