<template>
  <contents>
    <!-- 个人信息 -->
    <div class="wrap">
      <Card>
        <div slot="title" style="overflow: hidden;">
          <h2 style="float: left; line-height: 24px;">个人信息</h2>
          <Button type="ghost" style="float: right;" v-show="!modifi" @click="modifi = !modifi" size="small">修改资料</Button>
        </div>
        <!-- 表单 -->
        <Form 
          :label-width="100" 
          label-position="right"
          :rules="ruleValidate"
          ref="form"
          :model="form">
          <FormItem label="用户名" prop="userName">
            <Input v-model="form.username" placeholder="请输入用户名" v-show="modifi"></Input>
            <span class="span" v-show="!modifi">{{form.username}}</span>
          </FormItem>
          <FormItem label="真实姓名" prop="realName">
            <Input v-model="form.real_name" placeholder="请输入真实姓名" v-show="modifi"></Input>
            <span class="span" v-show="!modifi">{{form.real_name}}</span>
          </FormItem>
          <FormItem label="性别" prop="sex">
            <Select v-model="form.sex" v-show="modifi">
              <Option :value="0">未设置</Option>
              <Option :value="1">男</Option>
              <Option :value="2">女</Option>
            </Select>
            <span class="span" v-show="!modifi">{{calSex}}</span>
          </FormItem>
          <FormItem label="院系">
            <span class="span">{{form.department_name}}</span>
          </FormItem>
          <FormItem label="电话号码">
            <Input v-model="form.phone_num" placeholder="请输入电话号码" v-show="modifi"></Input>
            <span class="span" v-show="!modifi">{{form.phone_num}}</span>
          </FormItem>
          <FormItem label="QQ号">
            <Input v-model="form.qq_num" placeholder="请输入QQ号" v-show="modifi"></Input>
            <span class="span" v-show="!modifi">{{form.qq_num}}</span>
          </FormItem>
          <FormItem label="修改密码">
            <Input type="password" v-model="password" placeholder="请输入原密码" style="width: 100px;" v-show="!isRepassWord"></Input>
            <Button type="ghost" v-show="!isRepassWord" @click="confirmPassword">确认</Button>
            <Input type="password" v-model="newPassword" placeholder="请输入新密码" style="width: 100px;" v-show="isRepassWord"></Input>
            <Button type="ghost" v-show="isRepassWord" @click="anewPassword">修改</Button>
          </FormItem>
          <FormItem v-show="modifi">
            <Button type="primary" style="float: right;" @click.native="handleModifi('form')">修改</Button>
            <Button type="ghost" style="float: right; margin-right: 8px" @click="cancel">取消</Button>
          </FormItem>
        </Form>
      </Card>
    </div>
    <!-- 所教课程、所教班级 -->
    <div class="wrap">
      <!-- 所教课程 -->
      <Card :padding="0">
        <div slot="title" style="overflow: hidden;">
          <h2 style="float: left; line-height: 24px;">所教课程</h2>
          <Button type="ghost" style="float: right;" @click="getSubjectList" size="small">添加课程</Button>
        </div>
        <Table border :columns="subjectColumn" :data="subjects"></Table>
      </Card>
    </div>
    <!-- 课程列表 -->
    <Modal
      v-model="subjectListMod"
      title="课程"
      :closable="false"
      :mask-closable="false"
      cancel-text=""
      ok-text="取消">
      <Table border :columns="subjectListColumn" :data="subjectList"></Table>
    </Modal>
    <!-- 班级列表 -->
    <Modal
      v-model="classListMod"
      title="班级"
      :closable="false"
      :mask-closable="false"
      cancel-text=""
      ok-text="取消">
      <Table border :columns="classListColumn" :data="classList"></Table>
    </Modal>
  </contents>
</template>

<style scoped>
.wrap{
  float: left;
  overflow: hidden;
}
.wrap:nth-of-type(1) {
  width: 300px;
  margin: 40px;
}
.wrap:nth-of-type(2) {
  width: 520px;
  margin: 40px 0 50px 60px;
}
.ivu-table-wrapper{
  border: none;
}
.wrap .ivu-table-expanded-cell{
  padding: 10px 20px!important;
}
</style>

<script>
import personal from "./personal"
export default personal
</script>