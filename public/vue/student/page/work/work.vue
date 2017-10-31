<template>
  <contents>
    <!-- 题目列表 -->
    <div>
      
    </div>
    <!-- 作业情况列表 -->
    <div class="task-list">
      <Card>
        <h2 slot="title">作业情况</h2>
        <Tabs type="card">
          <TabPane label="未交">
            <ul class="head"><li>作业名称</li><li>过期时间</li></ul>
            <ul 
              v-for="(noSubmitTask, index) of noSubmitTaskList" :key="noSubmitTask.id" 
              class="ul-list no-publish"
              @click="getTaskQuestion(noSubmitTask.task_id, noSubmitTask.task_name, noSubmitTask.overdue_time, 0, index,  $event)">
              <li>{{noSubmitTask.task_name}}</li>
              <li class="overdue-time">{{noSubmitTask.overdue_time}}</li>
            </ul>
            <div v-show="noSubmitTaskList.length === 0" style="text-align: center;">暂无记录</div>
          </TabPane>
          <TabPane label="已交">
            <ul class="head"><li>作业名称</li><li>过期时间</li></ul>
            <ul 
              v-for="submitedTask of submitedTaskList" :key="submitedTask.id" 
              class="ul-list"
              @click="getTaskQuestion(submitedTask.task_id, submitedTask.task_name,  submitedTask.overdue_time, 1,$event)">
              <li>{{submitedTask.task_name}}</li>
              <li class="overdue-time">{{submitedTask.overdue_time}}</li>
            </ul>
          </TabPane>
        </Tabs>
      </Card>
    </div>
    


    <!-- 答题card -->
    <Card :bordered="false" class="cardMarkdown" v-show="cardShow" :padding="0">
      <h3 slot="title">第{{questionNum}}题</h3>
      <mavon-editor v-model="answerVal" :editable="true" :toolbars="toolbars"></mavon-editor>
      <div style="overflow: hidden; margin: 10px 0;">
        <Button type="primary" size="small" style="float: right; margin-right: 10px;" @click="addAnswer">提交</Button>
        <Button type="text" size="small" style="float: right; margin-right: 10px;" @click="cancelSubmit">取消</Button>
      </div>
    </Card>
  </contents>
</template>

<style>
.cardMarkdown {
  width: 400px; 
  position: absolute; 
  left: 50%; 
  top: 50%; 
  transform: translate(-50%, -50%);
  z-index: 1001;
}
.replay-btn, .have-replay-btn {
  position: absolute;
  right: 10px;
  top: 24px;
  display: none;
}
.have-replay-btn {
  display: inline-block;
}
.ivu-modal-body {
  background: #f3f3f3;
}
.question-list {
  position: relative;
  border-bottom: 1px solid #dddee1;
  padding: 20px 0;
}
.question-list:hover {
  background: #e5e5e5;
}
.question-list.selected {
  background: #e5e5e5;
}
.question-list:hover .replay-btn {
  display: inline-block;
}
.task-list {
  width: 400px;
  margin: 40px 0 0 0;
}
ul.head {
  font-weight: bold;
}
ul.head li {
  padding: 4px;
}
.ul-list.selected {
  background: #dddee1;
}
.ul-list:hover {
  background: #dddee1;
}
.ul-list:hover > .del-task {
  display: inline-block;
}
.ul-list {
  cursor: pointer;
  position: relative;
}
ul li{
  float: left;
  width: 50%;
  line-height: 24px;
}
</style>

<script>
import work from "./work"
export default work
</script>