<template>
  <contents>
    
    <!-- 选择课程、班级 -->
    <div class="create-task-wrap">
      <Card style="width:380px;">
        <h2 slot="title">选项</h2>
        <!-- 选择课程 -->
        <h3 style="margin: 10px 0;">选择课程</h3>
        <RadioGroup v-if="subjectData.length > 0" v-model="subjectId" type="button" size="large" @on-change="getSubjectClass">
          <Tooltip
            placement="top"
            v-for="subject of subjectData" 
            :key="subject.id"
            :content="subject.subject_num">
            <Radio :label="subject.subject_id" style="margin-left: 10px;">{{subject.subject_name}}</Radio>
          </Tooltip>
        </RadioGroup>
        <div v-else style="text-align: center; color: #888;">还没有添加课程,前往 <router-link to="/teacher/personal">个人中心</router-link> 添加课程<br>再去 <router-link to="/teacher/publish">布置作业</router-link> 发布作业</div>
        <h3 style="margin: 10px 0;">选择班级</h3>
        <RadioGroup v-if="classData.length > 0" v-model="classId" type="button" size="large" @on-change="getReportCard">
          <Radio  
            v-for="clas of classData"
            :key="clas.id" 
            :label="clas.class_id">
            {{clas.class_name}}
          </Radio>
        </RadioGroup>
        <div v-else style="text-align: center; color: #888;">还没有添加班级,前往 <router-link to="/teacher/personal">个人中心</router-link> 添加班级</div>
      </Card>
    </div>
    <!-- 表格 -->
    <div id="hot-preview">
      <HotTable :root="root" :settings="hotSettings"></HotTable>
      <Button size="small" class="download-btn" type="ghost" @click="exportExcel" v-if="isDown">下载</Button>
    </div>
    <a href="" download="成绩单.xlsx" id="hf"></a>
  </contents>
</template>

<style scoped>
#hot-preview {
  position: relative;
}
.create-task-wrap {
  margin: 20px;
}
.download-btn {
  position: absolute;
  left: 24px;
  top: 0;
  z-index: 1000;
  background: #fff;
  display: none;
}
#test-hot {
  position: relative;
  width: 100%;
  min-height: 200px;
  overflow: auto;
  margin: 20px 0 0 20px;
}
#test-hot + .download-btn {
  display: inline-block;
}
h3 {
  text-indent: 10px;
  border-left: 2px solid #2d8cf0;
}
</style>

<script>
import grade from "./grade"
export default grade
</script>