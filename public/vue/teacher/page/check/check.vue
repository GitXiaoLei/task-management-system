<template>
  <contents>
    <!-- list-warp -->
    <div class="list-wrap">
      <!-- 作业列表 -->
      <tab-list
        title="已发布的作业"
        :data="[ publishedTask ]"
        :tabs-name="['作业列表']"
        @li-selected="getTaskClass"
        :del-btn-show="false"
        class="my-list"
        style="margin-top: 10px;">
      </tab-list>
      <!-- 班级列表 -->
      <list
        :data="classData"
        row-field="class_name"
        @row-selected="getClassStudent"
        style="margin-top: 20px;"
        class="my-list">
        <h2 slot="head" style="padding-left: 16px;">班级列表</h2>
        <span slot="status" class=""></span>
      </list>
      <!-- 学生列表 -->
      <list
        :data="studentData"
        row-field="real_name"
        @row-selected="getStudentAnswer"
        style="margin-top: 20px;"
        class="my-list"
        :show-status="true">
        <h2 slot="head" style="padding-left: 16px;">学生列表</h2>
      </list>
    </div>
    <!-- 题目和答案 -->
    <div class="qa">
      <div class="qa-title">
        <div v-show="answerData.length !== 0">
          <span>[{{taskName}}]</span>
          <span class="qa-title-span"></span>
          <span v-show="answerData.length !== 0">{{ studentRealName }}</span>
        </div>
        &nbsp;
      </div>
      <div class="qa-body">
        <div v-show="answerData.length === 0" style="text-align: center;">请选择一个学生</div>
        <div
          class="answer-list"
          v-for="(answer, index) of answerData"
          :key="answer.id"
          >
          <div class="question" :class="'question-' + index">
            {{answer.question}}
          </div>
          <div class="answer" :class="'answer-' + index">
            {{answer.answer}}
          </div>
          <Poptip placement="left" class="score-input-btn" >
            <Button type="primary" :disabled="isChecked === 1" @click="score = answer.score">{{ answer.score + '分' }}</Button>
            <div slot="content">
              <Input v-model="answer.score" size="large" placeholder="large size" style="width: 60px;" :number="true"></Input>
              <Button type="ghost" size="small" @click="submitScore(answer, index)">确定</Button>
            </div>
          </Poptip>
        </div>
      </div>
      <div class="qa-footer">
        <Button type="ghost" style="float: right;margin: 4px 10px 0 0;" @click="addChecked" v-show="isChecked === 0 && canSubmit">提交</Button>
        <Button type="ghost" disabled style="float: right;margin: 4px 10px 0 0;" v-show="isChecked === 1 && canSubmit">已提交</Button>
      </div>
    </div>
  </contents>
</template>

<style scoped>
.qa-title-span {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #41b883;
}
.score-input-btn {
  position: absolute;
  right: 0;
  top: 16px;
}
.answer-list {
  border-bottom: 1px solid #dddee1;
  padding: 20px 0;
  position: relative;
}
.qa-footer {
  border-top: 1px solid #dddee1;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 518px;
  text-align: center;
}
.qa-body {
  padding: 16px;
  position: absolute;
  left: 0;
  top: 47px;
  right: 0;
  bottom: 40px;
  background: #f3f3f3;
  overflow: auto;
}
.qa-title {
  line-height: 46px;
  font-weight: bold;
  text-align: center;
  border-bottom: 1px solid #dddee1;
}
.qa {
  position: absolute;
  min-height: 560px;
  overflow: hidden;
  right: 10px;
  top: 10px;
  width: 600px;
  border: 1px solid #dddee1;
  border-radius: 4px;
}
.list-wrap {
  position: relative;
}
.list-wrap .my-list {
  background: #fff;
  margin-left: 10px;
  /* position: absolute; */
  transition: .3s;
}
.my-list h2 {
  text-align: right;
  padding: 0 16px;
}
/* .list-wrap .my-list:nth-of-type(1) {
  left: 10px;
  top: 10px;
}
.list-wrap .my-list:nth-of-type(2) {
  left: 20px;
  top: 20px;
}
.list-wrap .my-list:nth-of-type(3) {
  left: 30px;
  top: 30px;
} */
</style>

<script>
import check from "./check"
export default check
</script>