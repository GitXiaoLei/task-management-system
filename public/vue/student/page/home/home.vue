<template>
  <contents>
    <h2>作业情况</h2>
    <div class="wrap">
      您所在的班级 <span>{{ data.class_name }}</span> ，总共 <span>{{ data.count }}</span> 人
      <br>
      <br>
      <div
        v-for="task in data.task"
        :key="task.id">
        <span>{{ task.task_name }}</span>作业，
        全班已有 <span>{{ task.finish_count }}</span> 人完成，
        您 
        <span v-if="task.is_finish === 1" class="finished">已完成</span>
        <span v-if="task.is_finish === 0" class="no-finished">未完成</span>
        <br>
      </div>
    </div>
    
  </contents>
</template>

<style scoped>
.finished {
  color: #46b32a;
}
.no-finished {
  color: #d80000;
}
.ivu-card{
  transition: .3s;
}
h2 {
  margin: 20px 0 0 100px;
}
.wrap {
  width: 800px;
  margin: 20px auto;
  padding: 20px;
  border: 5px solid #333;
  border-radius: 4px;
  background: #464646;
  color: #fff;
}
.wrap div {
  display: inline-block;
}
h3 {
  text-indent: 10px;
  border-left: 4px solid #2d8cf0;
}
div {
  font-size: 16px;
}
span {
  font-size: 20px;
  color: #fe7b20;
}
</style>

<script>
import home from "./home"
export default home
</script>