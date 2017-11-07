<template>
  <div class="list" :style="{ width: width + 'px' }">
    <!-- head -->
    <div class="list-head">
      <slot name="head"></slot>
    </div>
    <!-- body -->
    <div class="list-body">
      <div v-show="data.length === 0">暂无数据</div>
      <div
        class="list-li"
        v-for="list of data"
        :key="list.id"
        @click="selected(list, $event)">
        <span v-show="showStatus" class="status" :class="{ active: list.is_submit === 1 }"></span>
        {{ list[rowField] }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'list',
  props: {
    data: { // 列表数据
      type: Array,
      required: true
    },
    rowField: { // 显示的属性名称
      type: String,
      required: true
    },
    width: { // 宽度
      type: [String, Number],
      default: 300
    },
    showStatus: { // 状态，如提交了的显示绿色，未提交的显示灰色
      type: Boolean,
      default: false
    }
  },
  data () {
    return {

    }
  },
  methods: {
    selected (row, event) {
      // 点击某一行，触发row-selected自定义事件
      this.$emit('row-selected', row, event)
    }
  }
}
</script>

<style scoped>
.list {
  border: 1px solid #dddee1;
  border-color: #e9eaec;
  border-radius: 4px;
  transition: all .2s ease-in-out;
}
.list:hover {
  box-shadow: 0 1px 6px rgba(0,0,0,.2);
}
.list-head {
  line-height: 50px;
  border-bottom: 1px solid #dddee1;
}
.list-body {
  padding: 16px;
}
.list-li {
  line-height: 24px;
  cursor: pointer;
}
.list-li.selected {
  background: #dddee1;
}
.list-li:hover {
  background: #dddee1;
}
.status {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 10px;
  background: #eee;
}
.status.active {
  background: #41b883;
}
</style>
