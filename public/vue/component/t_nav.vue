<template>
    <el-menu :default-active="index" class="t-nav" theme="dark">
        <el-menu-item index="1"><i class="iconfont icon-department"></i><span>院系管理</span></el-menu-item>
        <el-menu-item index="2"><i class="iconfont icon-subject"></i><span>科目管理</span></el-menu-item>
        <el-menu-item index="3"><i class="iconfont icon-teacher"></i><span>老师管理</span></el-menu-item>
        <el-menu-item index="4"><i class="iconfont icon-student"></i><span>学生管理</span></el-menu-item>
    </el-menu>
</template>

<script>
export default {
    name: 'tNav',
    props: {
        index: String
    },
    data() {
        return {

        };
    }
}
</script>

<style scoped>
.t-nav{
    width: 220px;  
    height: 100%;
}
.iconfont{
    margin-right: 10px;
}
</style>

