<template>
  <contents @click.native="click">
    <div class="create-wrap">
      <!-- 创建作业 -->
      <div class="create-task-wrap">
        <Card style="width:380px; margin: 40px;">
          <h2 slot="title">创建作业</h2>
          <!-- 选择课程 -->
          <h3 style="margin: 10px 0;">选择课程</h3>
          <RadioGroup v-model="subjectId" type="button" size="large">
            <Tooltip
              placement="top"
              v-for="subject of subjects" 
              :key="subject.id"
              :content="subject.subject_num">
              <Radio :label="subject.subject_id" :disabled="isDisabled" style="margin-left: 10px;">{{subject.subject_name}}</Radio>
            </Tooltip>
          </RadioGroup>
          <h3 style="margin: 10px 0;">作业名称</h3>
          <Input v-model="taskName" placeholder="请输入作业名称" :disabled="isDisabled" style="width: 336px; margin-left: 10px;"></Input>
          <h3 style="margin: 10px 0;">过期时间</h3>
          <DatePicker :disabled="isDisabled" placement="top-start" type="date" placeholder="选择作业过期时间" style="width: 336px; margin-left: 10px;" v-model="overdueTime"></DatePicker>
          <!-- 创建作业按钮 -->
          <Button type="primary" @click="createTask" :disabled="isDisabled" style="float: right; margin: 10px 0;">创建</Button>
        </Card>
      </div>
      <!-- 作业记录 -->
      <div class="task-record-wrap">
        <Card style="width:380px; margin: 40px;">
          <div slot="title" style="overflow: hidden;">
            <h2 style="float: left;">作业记录</h2>
            <Button type="primary" size="small" style="float: right;" @click="toCreateTaskStatus">创建作业</Button>
          </div>
          
          <Tabs type="card">
            <TabPane label="未发布">
              <ul class="head"><li>作业名称</li><li>过期时间</li></ul>
              <ul 
                v-for="noPublishedTask of noPublishedTaskList" :key="noPublishedTask.id" 
                class="ul-list no-publish"
                @click="getTaskInfo(noPublishedTask.task_id, noPublishedTask.task_name, $event)">
                <li>{{noPublishedTask.task_name}}</li>
                <li class="overdue-time">{{noPublishedTask.overdue_time}}</li>
                <Button type="error" size="small" class="del-task" @click="delTask(noPublishedTask.task_id, $event)">删除</Button>
              </ul>
            </TabPane>
            <TabPane label="已发布">
              <ul class="head"><li>作业名称</li><li>过期时间</li></ul>
              <ul 
                v-for="publishedTask of publishedTaskList" :key="publishedTask.id" 
                class="ul-list"
                @click="getTaskInfo(publishedTask.task_id, publishedTask.task_name, $event)">
                <li>{{publishedTask.task_name}}</li>
                <li class="overdue-time">{{publishedTask.overdue_time}}</li>
                <Button type="error" size="small" class="del-task" @click="delTask(publishedTask.task_id, $event)">删除</Button>
              </ul>
            </TabPane>
          </Tabs>

        </Card>
      </div>
    </div>
    
    
    <div class="line"></div>
    <!-- 选项：班级选项、题目选项 -->
    <div class="option-wrap">
      <h1>&nbsp;{{taskName}} </h1>
      <!-- 班级选项 -->
      <div style="margin: 40px; float: left;">
        <Card style="width: 350px;">
          <h2 slot="title">班级选项</h2>
          <h3 style="margin: 10px 0;">选择班级</h3>
          <CheckboxGroup v-model="classIds">
            <Checkbox
              class="checkbox"
              v-for="klass of classes"
              :key="klass.id"
              :label="klass.class_id"
              @click.native.self="editClass(klass.class_id, $event)">{{klass.class_name}}</Checkbox>
          </CheckboxGroup>
        </Card>
      </div>
      <!-- 题目选项 -->
      <div style="margin: 40px; float: left;">
        <Card style="width: 480px;">
          <h2 slot="title">题目选项</h2>
          <!-- 选择题目 -->
          <h3 style="margin: 10px 0;">选择题目</h3>
          <div style="text-align: center;">
            <Button type="ghost" @click="showChooseMod" :disabled="isPublish === 1">选择题</Button>
            <Button type="ghost" @click="showJudgeMod" :disabled="isPublish === 1">判断题</Button>
            <Button type="ghost" @click="showFillMod" :disabled="isPublish === 1">填空题</Button>
            <Button type="ghost" @click="showWordsMod" :disabled="isPublish === 1">主观题</Button>
          </div>
          <!-- 添加题目 -->
          <h3 style="margin: 10px 0;">添加题目</h3>
          <div style="text-align: center;">
            <Button type="primary" @click="showAddMod" :disabled="isPublish === 1">添加题目</Button>
          </div>
          <!-- 已选择的题目 -->
          <h3 style="margin: 10px 0;">已选题目</h3>
          <Table
            no-data-text="未选择题目"
            highlight-row 
            ref="curRowTable"
            :columns="curQuestionColumn" 
            :data="curQuestionList"></Table>
        </Card>
      </div>
    </div>
    <div class="line"></div>
    <Button style="margin: 30px auto; display: block;" type="primary" v-show="isPublish === 0" @click="publishTask">发布作业</Button>
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
      :closable="false"
      :mask-closable="false"
      @on-ok="addQuestion">
      <h2 slot="header">添加题目</h2>
      <div class="add-question-wrap">
        <Tabs type="card">
          <!-- 文字添加 -->
          <TabPane label="文字添加">
            <!-- 选择题目类型 -->
            <div class="task-add-question choose-type">
              <h3>题目类型：</h3>
              <RadioGroup v-model="questionTypeNum" type="button" size="large" style="margin-left: 20px;">
                <Radio
                  v-for="typee of questionType"
                  :key="typee.id" 
                  :label="typee.num">{{typee.name}}</Radio>
              </RadioGroup>
            </div>
            <br>
            <!-- 题目 -->
            <div class="task-add-question fill-question">
              <h3>题目</h3>
              <mavon-editor style="" v-model="questionVal" :editable="true" :toolbars="toolbars"></mavon-editor>
            </div>
            <!-- 答案 -->
            <div class="task-add-question fill-answer">
              <h3>答案</h3>
              <mavon-editor style="" v-model="answerVal" :editable="true" :toolbars="toolbars"></mavon-editor>
            </div>
          </TabPane>
          <!-- 文件导入 -->
          <TabPane label="文件导入" style="position: relative;">
            <div>
              <input type="file" @change="readFile" @drag="readFile">
              <div class="input-style">点击或将文件拖拽到这里上传</div>
            </div>
            <div class="progress">
              <Progress :percent="percent" status="active" v-show="progressShow"></Progress>
            </div>
            <div class="help">
              <h3>Excel文件格式说明</h3>
              <ul>
                <li>1.请严格按照下图所示的格式填写Excel表格</li>
                <li>2.上传的文件格式为Excel</li>
                <li>3.A列表示问题，B列表示答案，C列表示题目类型（0表示选择题；1表示判断题；2表示填空；3表示主观题）</li>
              </ul>
              <img src="../../../../common/img/help.png" alt="help">
            </div>
          </TabPane>
        </Tabs>
      </div>
    </Modal>
    <!-- 修改题目 -->
    <Modal
      ok-text="修改"
      width="900"
      v-model="modifiMod"
      :closable="false"
      :mask-closable="false"
      @on-ok="modifiSubjectQuestion">
      <h2 slot="header">修改题目</h2>
      <div class="add-question-wrap">
        <!-- 选择题目类型 -->
        <div class="task-add-question choose-type">
          <h3>题目类型</h3>
          <RadioGroup v-model="questionTypeNum" type="button" size="large" style="margin-left: 20px;">
            <Radio
              v-for="typee of questionType"
              :key="typee.id" 
              :label="typee.num">{{typee.name}}</Radio>
          </RadioGroup>
        </div>
        <br>
        <!-- 题目 -->
        <div class="task-add-question fill-question">
          <h3>题目</h3>
          <mavon-editor style="" v-model="questionVal" :editable="true" :toolbars="toolbars"></mavon-editor>
        </div>
        <!-- 答案 -->
        <div class="task-add-question fill-answer">
          <h3>答案</h3>
          <mavon-editor style="" v-model="answerVal" :editable="true" :toolbars="toolbars"></mavon-editor>
        </div>
      </div>
    </Modal>
  </contents>
</template>

<script>
import $ from 'jquery'
import VueMarkdown from 'vue-markdown'
import vueObj from './publish.js'
export default vueObj
</script>

<style scoped>
@import url('./style.css');
</style>

