<template>
  <contents>
    <!-- 表格 -->
    <div id="hot-preview">
      <HotTable :root="root" :settings="hotSettings"></HotTable>
    </div>
    <!-- 选择课程、班级 -->
    <div class="create-task-wrap">
      <Card style="width:380px;">
        <h2 slot="title">选项</h2>
        <!-- 选择课程 -->
        <h3 style="margin: 10px 0;">选择课程</h3>
        <RadioGroup v-model="subjectId" type="button" size="large" @on-change="getSubjectClass">
          <Tooltip
            placement="top"
            v-for="subject of subjectData" 
            :key="subject.id"
            :content="subject.subject_num">
            <Radio :label="subject.subject_id" style="margin-left: 10px;">{{subject.subject_name}}</Radio>
          </Tooltip>
        </RadioGroup>
        <h3 style="margin: 10px 0;">选择班级</h3>
        <RadioGroup v-model="classId" type="button" size="large" @on-change="getReportCard">
          <Radio  
            v-for="clas of classData"
            :key="clas.id" 
            :label="clas.class_id">
            {{clas.class_name}}
          </Radio>
        </RadioGroup>
      </Card>
    </div>
    
    <Button type="ghost" @click="exportExcel">点击</Button>
    <a href="" download="这里是下载的文件名.xlsx" id="hf"></a>
  </contents>
</template>

<style scoped>
.create-task-wrap {
  position: absolute;
  right: 10px;
  top: 20px;
}
 #test-hot {
  width: 600px;
  min-height: 200px;
  overflow: auto;
  margin: 20px 0 0 20px;
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