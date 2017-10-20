<template>
  <contents>
    <!-- 卡片 -->
    <Card style="width: 500px; margin: 50px auto;">
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
          <Input v-model="form.userName" placeholder="请输入用户名" v-show="modifi"></Input>
          <span class="span" v-show="!modifi">{{form.userName}}</span>
        </FormItem>
        <FormItem label="真实姓名" prop="realName">
          <Input v-model="form.realName" placeholder="请输入真实姓名" v-show="modifi"></Input>
          <span class="span" v-show="!modifi">{{form.realName}}</span>
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
          <span class="span">{{form.departmentName}}</span>
        </FormItem>
        <FormItem label="班级">
          <span class="span">{{form.className}}</span>
        </FormItem>
        <FormItem label="电话号码">
          <Input v-model="form.phoneNum" placeholder="请输入电话号码" v-show="modifi"></Input>
          <span class="span" v-show="!modifi">{{form.phoneNum}}</span>
        </FormItem>
        <FormItem label="QQ号">
          <Input v-model="form.qqNum" placeholder="请输入QQ号" v-show="modifi"></Input>
          <span class="span" v-show="!modifi">{{form.qqNum}}</span>
        </FormItem>
        <FormItem v-show="modifi">
          <Button type="primary" style="float: right;" @click.native="handleModifi('form')">修改</Button>
          <Button type="ghost" style="float: right; margin-right: 8px" @click="cancel">取消</Button>
        </FormItem>
      </Form>
    </Card>
  </contents>
</template>

<style scoped>
.span{
  display: inline-block;
  height: 21px;
  line-height: 21px;
  font-weight: bold;
}
.ivu-card{
  transition: .3s;
}
</style>

<script>
import personal from "./personal"
export default personal
</script>