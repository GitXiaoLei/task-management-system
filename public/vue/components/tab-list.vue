<template>
  <div class="tab-list" :style="{ width: width + 'px' }">
    <Card>
      <h2 slot="title">
        {{title}}
        <span style="float: right;">
          <slot name="headButton"></slot>
        </span>
      </h2>
      <Tabs type="card">
        <TabPane
          v-for="(lists, index) of data"
          :key="lists.id"
          :label="tabsName[index]">
          <ul class="head">
            <li>作业名称</li>
            <li>过期时间</li>
          </ul>
          <ul
            v-for="list of lists" :key="list.id" 
            class="ul-list"
            @click="liSelected(list, $event)">
            <li>{{list.task_name}}</li>
            <li class="overdue-time bb aa">{{list.overdue_time}}</li>
            <div v-show="list.length === 0" style="text-align: center;">暂无记录</div>
            <Button type="error" size="small" class="button-del" @click.stop="liDel(list, $event)">删除</Button>
          </ul>
        </TabPane>
      </Tabs>
    </Card>
  </div>
</template>
<script>
export default {
  name: "tabList",
  props: {
    title: { // 卡片的标题
      type: String,
      default: '卡片默认标题'
    },
    data: { // 选项卡列表中渲染的数据
      type: Array,
      required: true
    },
    tabsName: { // 选项卡的标题名字
      type: Array
    },
    width: { // 宽度
      type: [String, Number],
      default: 300
    }
  },
  data () {
    return {

    }
  },
  methods: {
    liSelected (row, event) {
      this.$emit('li-selected', row, event)
    },
    liDel (row, event) {
      this.$emit('li-del', row, event)
    }
  }
};
</script>

<style scoped>
.button-del {
  display: none;
  position: absolute;
  right: 0;
  top: 0;
}
ul.head {
  font-weight: bold;
}
ul.head li {
  padding: 4px;
}
.ul-list {
  cursor: pointer;
  position: relative;
}
.ul-list.selected {
  background: #dddee1;
}
.ul-list:hover {
  background: #dddee1;
}
.ul-list:hover .button-del {
  display: inline-block;
}
ul {
  overflow: hidden;
}
ul li{
  float: left;
  width: 50%;
  line-height: 24px;
}
</style>
