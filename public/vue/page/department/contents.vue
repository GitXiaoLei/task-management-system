<template>
    <div>
        <h1>添加院系</h1>
		<el-form :inline="true">
			<el-form-item label="院系名称">
				<el-input v-model="department.name" placeholder="请输入院系名"></el-input>
			</el-form-item>
			<el-button @click="addDepartment">添加</el-button>
		</el-form>
    </div>
</template>

<script>
import api from './api';

export default {
	name: 'contents',
	data() {
		return {
			department: { name: '' }
		}
	},
    methods: {
		/**
		 * 获取所有的院系
		 */
		getDepartments() {
			api
				.getDepartments()
				.then((data) => {
					console.log(data);
				})
				.catch((err) => {
					console.error(err);
				});
		},
		/**
		 * 添加院系
		 */
		addDepartment() {
			api
				.addDepartment(this.department)
				.then((data) => {
					console.log(data.data);
				})
				.catch((err) => {
					console.log(err);
				});
		}
	},
}
</script>
