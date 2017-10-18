<template>
  <div>
    <!-- 选择课程 -->
    <div>
      <h2>请选择课程：</h2>
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
    </div>
    <!-- 创建作业按钮 -->
    <div><Button type="ghost" @click="createTask" v-show="isCTShow">创建作业</Button></div>
    <!-- 选择班级 -->
    <div>
      <h2>请选择班级：</h2>
      <CheckboxGroup v-model="classIds">
        <Checkbox
          v-for="klass of classes"
          :key="klass.id"
          :label="klass.class_id"
          @click.native.self="editClass(klass.class_id, $event)">{{klass.class_name}}</Checkbox>
      </CheckboxGroup>
    </div>
    <!-- 选择题目 -->
    <div>
      <h2>请选择题目：</h2>
      <Button type="ghost" @click="showChooseMod">选择选择题</Button>
      <Button type="ghost" @click="showJudgeMod">选择判断题</Button>
      <Button type="ghost" @click="showFillMod">选择填空题</Button>
      <Button type="ghost" @click="showWordsMod">选择主观题</Button>
      <Button type="primary" @click="showAddMod">添加题目</Button>
    </div>
    <!-- 已选择的题目 -->
    <div>
      
    </div>
    <!-- 选择题 -->
    <Modal
      v-model="chooseMod"
      title="选择题"
      :closable="false"
      :mask-closable="false">
      
    </Modal>
    <!-- 判断题 -->
    <Modal
      v-model="judgeMod"
      title="判断题"
      :closable="false"
      :mask-closable="false">
      
    </Modal>
    <!-- 填空题 -->
    <Modal
      v-model="fillMod"
      title="填空题"
      :closable="false"
      :mask-closable="false">
      <Table 
        @on-current-change="change"
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
        @on-current-change="change"
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
      <div v-for="task of taskes" :key="task.id" @click="getSubjectsByTaskId(task.task_id)">{{task.task_name}}</div>
    </div>
  </div>
</template>

<script>
import { getSubjects, createTask, getClasses, addTaskClass, delTaskClass, getChoose, getJudge, getFill, getWords, addQuestion, getTask5, getSubjectsByTaskId } from '../api'
import $ from 'jquery'
import VueMarkdown from 'vue-markdown'
export default {
  name: 'app',
  components: {},
  data () {
    return {
      subjects: [], // 老师所教的课程列表
      subjectId: 0, // 选中的课程的id
      taskName: '', // 作业名称
      taskId: 0, // 当前作业的id
      isDisabled: false, // 是否禁用选择课程的按钮
      isCTShow: true, // 创建作业的按钮是否显示
      classes: [], // 老师所教课程下的班级列表
      classIds: [], // 被选中的班级id
      chooseMod: false, // 选择题modal
      judgeMod: false, // 判断题modal
      fillMod: false, // 填空题modal
      wordsMod: false, // 主观题modal
      addMod: false, // 添加题目modal
      questionList: [], // 问题列表
      questionColumn: [ // 表格的表头数据
        { title: '问题', key: 'question' },
        { title: '答案', key: 'answer' }
      ],
      questionVal: '', // 问题
      answerVal: '', // 答案
      toolbars: { // markdown工具栏
        preview: true, // 预览
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        fullscreen: true, // 全屏编辑
        code: true, // code
        ol: true, // 有序列表
        ul: true, // 无序列表
        mark: true, // 标记
        subfield: true, // 单双栏模式
      },
      questionType: [ // 所有题目类型
        { num: 0, name: '选择题' },
        { num: 1, name: '判断题' },
        { num: 2, name: '填空题' },
        { num: 3, name: '主观题' },
      ],
      questionTypeNum: 0, // 题目类型
      tlBtn: true, // 作业列表按钮 是否显示
      taskes: [], // 最近5次作业记录列表
    }
  },
  methods: {
    change (status) {
      this.$Message.info('开关状态：' + status);
    },
    // 点击某次作业，获取该作业所对应的课程
    getSubjectsByTaskId (taskId) {
      const params = { task_id: taskId }
      getSubjectsByTaskId(params)
      .then((data) => {
        data = data.data
        if (data.code !== 1) {
          this.errorMsg('获取失败')
          return
        }
        this.successMsg('获取成功')
        console.log(data)
      })
      .catch((e) => {
        this.errorMsg(e)
      })
    },
    // 添加题目
    addQuestion () {
      if (this.questionVal === '') {
        this.errorMsg('请输入问题')
        return
      }
      if (this.answerVal === '') {
        this.errorMsg('请输入答案')
        return
      }
      if (this.subjectId === 0) {
        this.errorMsg('未选择科目')
        return
      }
      const params = {
        question: this.questionVal,
        answer: this.answerVal,
        type: this.questionTypeNum,
        subject_id: this.subjectId
      }
      addQuestion(params)
      .then((data) => {
        data = data.data
        if (data.code !== 1) {
          this.errorMsg('添加题目失败')
          return
        }
        this.successMsg(data.message)
        // 将题目添加到本地数据中...
        
      })
      .catch((e) => {
        this.errorMsg('添加题目失败')
      })
    },
    // 创建作业
    createTask () {
      if (this.subjectId === 0) {
        this.errorMsg('请先选择课程')
        return
      }
      if (this.taskName === '') {
        this.errorMsg('请输入作业名称')
        return
      }
      const params = { 
        subject_id: this.subjectId,
        task_name: this.taskName
      }
      // 创建作业记录
      createTask(params)
      .then((data) => {
        data = data.data
        if (data.code !== 1) {
          this.errorMsg('创建作业失败')
          return
        }
        this.successMsg('创建作业成功')
        this.taskId = data.data.insertId
        this.isDisabled = true
        this.isCTShow = false
        const params = { subject_id: this.subjectId }
        // 获取班级列表
        getClasses(params)
        .then((data) => {
          data = data.data
          if (data.code !== 1) {
            this.errorMsg('获取班级列表失败')
            return
          }
          this.classes = data.data
        })
        .catch((e) => {
          this.errorMsg(e)
        })
      })
      .catch((e) => {
        this.errorMsg(e)
      })
    },
    // 编辑班级：添加或删除
    editClass (classId, e) {
      // 添加班级
      if (!$(e.srcElement).hasClass('ivu-checkbox-wrapper-checked')) {
        const params = {
          task_id: this.taskId,
          class_id: classId
        }
        addTaskClass(params)
        .then((data) => {
          data = data.data
          if (data.code !== 1) {
            this.errorMsg('添加班级失败')
            return
          }
          this.successMsg('添加班级成功')
        })
        .catch((e) => {
          this.errorMsg(e)
        })
      } else {
      // 删除班级
        const params = {
          task_id: this.taskId,
          class_id: classId
        }
        delTaskClass(params)
        .then((data) => {
          data = data.data
          if (data.code !== 1) {
            this.errorMsg('删除班级失败')
            return
          }
          this.successMsg('删除班级成功')
        })
        .catch((e) => {
          this.errorMsg(e)
        })
      }
    },
    // 添加题目modal
    showAddMod () {
      this.addMod = true
    },
    change (cur, old) {
      console.log(cur)
      console.log(old)
    },
    // 选择题
    showChooseMod () {
      this.chooseMod = true
      getChoose({ subject_id: this.subjectId })
      .then((data) => {
        data = data.data
        if (data.code !== 1) {
          this.errorMsg('获取选择题失败')
          return
        }
        this.questionList = data.data
      })
      .catch((e) => {
        this.errorMsg(e)
      })
    },
    // 判断题
    showJudgeMod () {
      this.judgeMod = true
      getJudge({ subject_id: this.subjectId })
      .then((data) => {
        data = data.data
        if (data.code !== 1) {
          this.errorMsg('获取判断题失败')
          return
        }
        this.questionList = data.data
      })
      .catch((e) => {
        this.errorMsg(e)
      })
    },
    // 填空题
    showFillMod () {
      this.fillMod = true
      getFill({ subject_id: this.subjectId })
      .then((data) => {
        data = data.data
        if (data.code !== 1) {
          this.errorMsg('获取填空题失败')
          return
        }
        this.questionList = data.data
      })
      .catch((e) => {
        this.errorMsg(e)
      })
    },
    // 主观题
    showWordsMod () {
      this.wordsMod = true
      getWords({ subject_id: this.subjectId })
      .then((data) => {
        data = data.data
        if (data.code !== 1) {
          this.errorMsg('获取主观题失败')
          return
        }
        this.questionList = data.data
      })
      .catch((e) => {
        this.errorMsg(e)
      })
    },
    // 成功消息提示
    successMsg (msg) {
      this.$Message.success(msg)
    },
    // 错误消息提示
    errorMsg (msg) {
      this.$Message.error(msg)
    }
  },
  created () {
    // 获取自己所教的课程
    getSubjects()
    .then((data) => {
      data = data.data
      if (data.code !== 1) {
        this.errorMsg('获取课程列表失败')
        return
      }
      this.subjects = data.data
      // 获取最近5次作业记录
      getTask5()
      .then((data) => {
        data = data.data
        if (data.code !== 1) {
          this.errorMsg('获取最近5次作业记录失败')
          return
        }
        this.taskes = data.data
      })
      .catch((e) => {
        this.errorMsg(e)
      })
    })
    .catch((e) => {
      this.errorMsg(e)
    })
    
  }
}
</script>

<style scoped>
@import url('./style.css');
</style>

