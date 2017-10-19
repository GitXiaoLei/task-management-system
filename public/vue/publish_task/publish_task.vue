<template>
  <div>
    <!-- 选择课程 -->
    <div style="margin-top: 40px;">
      <h2>选择课程</h2>
      <RadioGroup v-model="subjectId" type="button" size="large">
        <Tooltip
          placement="top"
          v-for="subject of subjects" 
          :key="subject.id" 
          :content="subject.subject_num">
          <Radio :label="subject.subject_id" :disabled="isDisabled">{{subject.subject_name}}</Radio>
        </Tooltip>
      </RadioGroup>
      <Input v-model="taskName" placeholder="请输入作业名称" style="width: 300px" :disabled="isDisabled"></Input>
      <!-- 创建作业按钮 -->
      <Button type="ghost" @click="createTask" v-show="isCTShow">创建作业</Button>
    </div>
    <h1>{{taskName}}</h1>
    <!-- 选择班级 -->
    <div style="margin-top: 40px;">
      <h2>选择班级</h2>
      <CheckboxGroup v-model="classIds">
        <Checkbox
          v-for="klass of classes"
          :key="klass.id"
          :label="klass.class_id"
          @click.native.self="editClass(klass.class_id, $event)">{{klass.class_name}}</Checkbox>
      </CheckboxGroup>
    </div>
    <!-- 选择题目 -->
    <div style="margin-top: 40px;">
      <h2>选择题目</h2>
      <Button type="ghost" @click="showChooseMod" :disabled="isPublish === 1">选择选择题</Button>
      <Button type="ghost" @click="showJudgeMod" :disabled="isPublish === 1">选择判断题</Button>
      <Button type="ghost" @click="showFillMod" :disabled="isPublish === 1">选择填空题</Button>
      <Button type="ghost" @click="showWordsMod" :disabled="isPublish === 1">选择主观题</Button>
      <Button type="primary" @click="showAddMod" :disabled="isPublish === 1">添加题目</Button>
    </div>
    <!-- 已选择的题目 -->
    <div style="margin-top: 40px;">
      <h2>已选择的题目</h2>
      <Table 
        highlight-row 
        ref="curRowTable" 
        :columns="questionColumn" 
        :data="curQuestionList"></Table>
    </div>
    <Button style="margin: 30px auto; display: block;" type="ghost" v-show="isPublish === 0" @click="publishTask">发布作业</Button>
    <Button style="margin: 30px auto; display: block;" type="ghost" v-show="isPublish === 1" disabled>已发布</Button>
    <!-- 选择题 -->
    <Modal
      v-model="chooseMod"
      title="选择题"
      :closable="false"
      :mask-closable="false">
      <Table 
        @on-current-change="addTaskQuestion"
        highlight-row 
        ref="curRowTable" 
        :columns="questionColumn" 
        :data="questionList"></Table>
    </Modal>
    <!-- 判断题 -->
    <Modal
      v-model="judgeMod"
      title="判断题"
      :closable="false"
      :mask-closable="false">
      <Table 
        @on-current-change="addTaskQuestion"
        highlight-row 
        ref="curRowTable" 
        :columns="questionColumn" 
        :data="questionList"></Table>
    </Modal>
    <!-- 填空题 -->
    <Modal
      v-model="fillMod"
      title="填空题"
      :closable="false"
      :mask-closable="false">
      <Table 
        @on-current-change="addTaskQuestion"
        highlight-row 
        ref="curRowTable" 
        :columns="questionColumn" 
        :data="questionList"></Table>
    </Modal>
    <!-- 主观题 -->
    <Modal
      v-model="wordsMod"
      title="主观题"
      :closable="false"
      :mask-closable="false">
      <Table 
        @on-current-change="addTaskQuestion"
        highlight-row 
        ref="curRowTable" 
        :columns="questionColumn" 
        :data="questionList"></Table>
    </Modal>
    <!-- 添加题目 -->
    <Modal
      ok-text="添加"
      width="900"
      v-model="addMod"
      title="添加题目"
      :closable="false"
      :mask-closable="false"
      @on-ok="addQuestion">
      <div class="add-question-wrap">
        <!-- 选择题目类型 -->
        <div class="task-add-question choose-type">
          <h1>题目类型：</h1>
          <RadioGroup v-model="questionTypeNum" type="button" size="large">
            <Radio 
              v-for="typee of questionType"
              :key="typee.id" 
              :label="typee.num">{{typee.name}}</Radio>
          </RadioGroup>
        </div>
        <br>
        <!-- 题目 -->
        <div class="task-add-question fill-question">
          <h3>题目：</h3>
          <mavon-editor style="" v-model="questionVal" :editable="true" :toolbars="toolbars"></mavon-editor>
        </div>
        <!-- 答案 -->
        <div class="task-add-question fill-answer">
          <h3>答案：</h3>
          <mavon-editor style="" v-model="answerVal" :editable="true" :toolbars="toolbars"></mavon-editor>
        </div>
      </div>
    </Modal>
    <!-- 显示作业记录列表按钮 -->
    <span class="task-list-btn" v-show="tlBtn" @click="tlBtn = false">作业记录</span>
    <!-- 作业记录列表 -->
    <div class="task-list" v-show="!tlBtn">
      <div style="background: #20a0ff; color: #fff;">选择作业</div>
      <div v-for="task of taskes" :key="task.id" @click="getTaskInfo(task.task_id, task.task_name, $event)">{{task.task_name}}</div>
      <div style="background: #58b957; color: #fff; text-align: center;" @click="toCreateTaskStatus">创建作业</div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import VueMarkdown from 'vue-markdown'
import vueObj from './publish_task'
export default vueObj
</script>

<style scoped>
@import url('./style.css');
</style>

