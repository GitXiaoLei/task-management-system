<template>
    <div>
		<el-button @click="showAddDialog">添加老师</el-button>
		<!-- 所有老师表格 -->
		<el-table
			:data="tcsData"
			border
			v-loading="loading">
			<el-table-column
				prop="uid"
				label="ID">
			</el-table-column>
			<el-table-column
				prop="real_name"
				label="真实姓名">
			</el-table-column>
            <el-table-column
				prop="username"
				label="用户名">
			</el-table-column>
            <el-table-column
				prop="sex"
				label="性别">
			</el-table-column>
            <el-table-column
				prop="department"
				label="院系">
			</el-table-column>
			<el-table-column label="操作">
				<template scope="scope">
                    <el-button
						size="small"
						type="primary"
						@click="showEditDialog(scope.$index, scope.row)">
						编辑
					</el-button>
					<el-button
						size="small"
						type="danger"
						@click="showDelDialog(scope.$index, scope.row)">
						删除
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!-- 修改账号信息的dialog -->
		<el-dialog :title="dialogTitle" :visible.sync="dialogEditVisible" :inline="true">
			<el-form :model="updateForm">
				<el-form-item label="真实姓名">
					<el-input v-model="updateForm.real_name"></el-input>
				</el-form-item>
				<el-form-item label="用户名">
					<el-input v-model="updateForm.username"></el-input>
				</el-form-item>
				<el-form-item label="密码">
					<el-input v-model="updateForm.password"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-select v-model="updateForm.sex" placeholder="请选择性别">
						<el-option label="-" value="-"></el-option>
						<el-option label="男" value="男"></el-option>
						<el-option label="女" value="女"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="院系">
					<el-select v-model="updateForm.department" :placeholder="updateForm.department">
						<el-option v-for="department in departments" :key="department.id" :label="department" :value="department"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button @click="dialogEditVisible = false">取 消</el-button>
				<el-button type="primary" @click="updateTc">确 定</el-button>
			</div>
		</el-dialog>
		<!-- 分页 -->
		<el-pagination
			class="page"
			layout="prev, pager, next"
			:total="totalCount"
			:page-count="totalPages"
			:current-page="curPage"
			@current-change="pageChange">
		</el-pagination>
		<!-- 删除提示的Dialog -->
		<el-dialog
			title="是否要删除此老师账号？"
			:visible.sync="dialogDelVisible"
			size="tiny">
			<div class="will-del-user">{{willDelData.real_name}}</div>
			<span slot="footer">
				<el-button @click="dialogDelVisible = false">取 消</el-button>
				<el-button type="primary" @click="delTc">确 定</el-button>
			</span>
		</el-dialog>
    </div>
</template>

<script>
import { getTeachers, delTeacher, getDepartments, updateTeacher, addTeacher } from '../api';

export default {
    data() {
        return {
            tcsData: [], // 所有老师账号的数据
			loading: true, // loading的显示与隐藏
			dialogDelVisible: false, // 删除提示框的显示与隐藏
			dialogEditVisible: false, // 修改框的显示与隐藏
			willDelIndex: -1, // 将要删除数据的索引
			willEditIndex: -1, // 将要编辑数据的索引
			willDelData: {}, // 将要删除的数据
			totalPages: 0, // 总页数
			curPage: 1,// 总页数
			totalCount: 0, // 总数量
			updateForm: { // 修改信息表单
				uid: -1,
				real_name: '',
				username: '',
				sex: '不设置',
				department: '',
				password: '',
			},
			departments: [], // 所有院系
			willEditData: {}, // 将要编辑的数据
			isGetDm: false, // 是否请求了department数据：保证其值为true时，不重复请求
			dialogTitle: '正在修改', // dialog标题
        };
    },
    methods: {
        // 获取所有老师账号信息
        getAll() {
			let params = { page: this.curPage };
            getTeachers(params)
                .then((data) => {
                    data = data.data;
                    if(data.code === 1) {

						this.tcsData = this.sexTransform(data.data.list);
						this.totalPages = data.data.all_pages;
						this.curPage = parseInt(data.data.current_page);
						this.totalCount = data.data.count;
                        this.loading = false;
                    }
                })
                .catch((err) => {
                    this.errorMsg(err.message);
                });

		},
		// 删除老师账号
		delTc() {
			delTeacher(this.willDelData)
				.then((data) => {
					data = data.data;
					this.successMsg(data.message);
					this.dialogDelVisible = false;
					this.willDelData = {};
					// 删除某个院系成功后，删除本地数据中的那个老师
					this.tcsData.splice(this.willDelIndex, 1);
				})
				.catch((err) => {
					this.errorMsg(err.message);
				});
		},
		// 修改老师账号信息
		updateTc() {
			if(this.updateForm.sex === '-') {
				this.updateForm.sex = 0;
			}else if(this.updateForm.sex === '男') {
				this.updateForm.sex = 1;
			}else if(this.updateForm.sex === '女') {
				this.updateForm.sex = 2;
			}

			// 更新老师
			if(this.dialogTitle === '正在修改') {
				updateTeacher(this.updateForm)
					.then((data) => {
						data = data.data;
						if(data.code === 1) {
							this.successMsg(data.message);
							this.dialogEditVisible = false;
							// 修改本地的数据
							Object.keys(this.updateForm).forEach((item) => {
								this.tcsData[this.willEditIndex][item] = this.updateForm[item];
							});
						}else {
							this.errorMsg(data.message);
						}
					})
					.catch((err) => {
						this.errorMsg(err.message);
					});

			// 添加老师
			}else if(this.dialogTitle === '正在添加') {
				delete this.updateForm.uid;
				console.log(this.updateForm)
				addTeacher(this.updateForm)
					.then((data) => {
						data = data.data;
						if(data.code === 1) {
							this.successMsg(data.message);
							this.dialogEditVisible = false;
						}else {
							this.errorMsg(data.message);
						}
					})
					.catch((err) => {
						this.errorMsg(err.message);
					});
			}
			
		},
		// 显示删除院系的提示
		showDelDialog(index, row) {
			this.willDelIndex = index;
			this.willDelData = row;
			this.dialogDelVisible = true;
		},
		// 性别转换
		sexTransform(arr) {
			arr.forEach((item) => {
				if(item.sex === 0) {
					item.sex = '-';
				}else if(item.sex === 1) {
					item.sex = '男';
				}else if(item.sex === 2) {
					item.sex = '女';
				}
			});
			return arr;
		},
		// 跳转到某一页
		pageChange(curPage) {
			this.loading = true;
			let params = { page: curPage };
            getTeachers(params)
                .then((data) => {
                    data = data.data;
                    if(data.code === 1) {
						this.tcsData = data.data.list;
						this.totalPages = data.data.all_pages;
						this.curPage = parseInt(data.data.current_page);
						this.totalCount = data.data.count;
                        this.loading = false;
                    }
                })
                .catch((err) => {
                    this.errorMsg(err.message);
                });
		},
		// 显示编辑的Dialog
		showEditDialog(index, row) {
			this.willEditData = row;
			this.willEditIndex = index;
			this.dialogEditVisible = true;
			
			this.dialogTitle = '正在修改';

			this.updateForm.department = this.willEditData.department;
			this.updateForm.sex = this.willEditData.sex;
			this.updateForm.username = this.willEditData.username;
			this.updateForm.real_name = this.willEditData.real_name;
			this.updateForm.password = this.willEditData.password;

			this.updateForm.uid = this.willEditData.uid;
			if(this.isGetDm) return; 
			// 获取院系
			this.getDms();
		},
		// 获取院系
		getDms() {
			getDepartments()
				.then((data) => {
					data = data.data;
					if(data.code === 1) {
						// 将获得的院系存起来
						data.data.forEach((item, index, arr) => {
							this.departments.push(item.name)
						});
						this.isGetDm = true;
					}
				})
				.catch((err) => {
					this.errorMsg(err.message);
				});
		},
		// 显示添加老师的Dialog：是编辑老师的是同一个Dialog
		showAddDialog() {
			this.dialogTitle = '正在添加';
			this.dialogEditVisible = true;
			// 将要上传的数据线清空
			Object.keys(this.updateForm).forEach((item) => {
				this.updateForm[item] = '';
			});
			if(this.isGetDm) return; 
			// 获取院系
			this.getDms();
		},
		// 成功的消息提示弹窗
		successMsg(msg) {
			this.$message({
				message: msg,
				type: 'success'
			});
		},
		// 失败的消息提示弹窗
		errorMsg(msg) {
			this.$message({
				message: msg,
				type: 'error'
			})
		}
    },
    created() {
        this.getAll();
    }
}
</script>

<style>
.v-modal{ display: none; }
.will-del-user{ text-align: center; }
.page{ float: right; }
</style>



