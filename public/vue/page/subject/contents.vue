<template>
    <div>
        <!-- 添加科目 -->
        <h2>添加科目</h2>
		<el-form :inline="true">
			<el-form-item label="科目名称">
				<el-input v-model="sj.name" placeholder="请输入科目名称"></el-input>
			</el-form-item>
			<el-button @click="addSj">添加</el-button>
		</el-form>
        <!-- 所有科目 -->
		<h2>所有科目</h2>
		<el-table
			:data="sjsData"
			border
			v-loading="loading">
			<el-table-column
				prop="s_id"
				label="ID">
			</el-table-column>
			<el-table-column
				prop="name"
				label="科目名称">
			</el-table-column>
			<el-table-column label="操作">
				<template scope="scope">
					<el-button
						size="small"
						type="danger"
						@click="showDelDialog(scope.$index, scope.row)">
						删除
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!-- 删除提示的Dialog -->
		<el-dialog
			title="是否要删除此科目？"
			:visible.sync="dialogVisible"
			size="tiny">
			<span>{{willDelData.name}}</span>
			<span slot="footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="delSj">确 定</el-button>
			</span>
		</el-dialog>
    </div>
</template>

<script>
import { getSubjects, addSubject, delSubject } from '../api';

export default {
    name: 'contents',
    data() {
        return {
            sj:{ name: '' },// 添加的科目
            sjsData: [],//所有院系的信息
			loading: true,//loading
			willDelData: {},//将要删除的数据
			willDelIndex: -1,//将要删除数据的索引
			dialogVisible: false,//是否显示删除提示的dialog
        }
    },
    methods: {
        // 获取所有的科目
		getSjs() {
			getSubjects()
				.then((data) => {
					data = data.data;
					if(data.code) {
						this.sjsData = data.data;
						this.loading = false;
					}else{
						console.log(data);
					}
				})
				.catch((err) => {
					console.error(err);
				});
        },
        // 添加科目
        addSj() {
            addSubject(this.sj)
                .then((data) => {
                    data = data.data;
					this.successMsg(data.message);
					this.getSjs();
                })
                .catch((err) => {
                    console.error(err);
                });
        },
        // 显示删除院系的提示
		showDelDialog(index, row) {
			this.willDelIndex = index;
			this.willDelData = row;
			this.dialogVisible = true;
        },
        // 删除科目
		delSj() {
			delSubject(this.willDelData)
				.then((data) => {
					data = data.data;
					this.successMsg(data.message);
					this.dialogVisible = false;
					this.willDelData = {};
					// 删除某个院系成功后，删除本地数据中的那个院系
					this.sjsData.splice(this.willDelIndex, 1);
				})
				.catch((err) => {
					console.error(err);
				});
		},
        // 成功的消息提示弹窗
		successMsg(msg) {
			this.$message({
				message: msg,
				type: 'success'
			});
		},
    },
    created() {
        this.getSjs();
    }

}
</script>

<style>
.v-modal{
    display: none;
}
</style>
