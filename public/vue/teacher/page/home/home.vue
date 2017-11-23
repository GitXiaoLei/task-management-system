<template>
  <contents class="index">
    <h2>作业情况</h2>
    <div class="wrap">
      <!-- 有布置的作业 -->
      <div v-if="taskData.length > 0">
        <div
          v-for="task of taskData"
          :key="task.id">
          <h3><span class="task-name">{{task.task_name}}</span> 作业</h3>
          <div
            v-for="cla of task.classes"
            :key="cla.id"
            style="text-indent: 30px;">
            <span class="class-name">{{ cla.class_name }}</span> 班 <span class="count">总共{{ cla.count }}</span> 人；
            有 <span class="finish-count">{{ cla.finishCount }}人完成</span> 了作业；
            您 <span class="check-count">批改了{{ cla.checkCount }}</span> 人的作业
          </div>
        </div>
      </div>
      <!-- 没有布置的作业 -->
      <div v-else>还没有布置作业，<router-link to="/teacher/publish">去布置作业</router-link></div>
    </div>
  </contents>
</template>

<style scoped>
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
.task-name {
  color: #20a0ff;
}
.class-name {
  color: #89b71a;
}
.finish-count,
.count,
.check-count {
  color: #fe7b20;
}
div {
  font-size: 16px;
}
span {
  font-size: 20px;
}
</style>

<script>
import home from "./home";
export default home;
</script>