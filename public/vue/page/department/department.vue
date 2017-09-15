<template>
	<div id="main">
		<t-header class="header-wrap"></t-header>
		<t-nav class="nav-wrap" :index="'1'"></t-nav>
		<div class="content">
			
			
		</div>
	</div>
</template>

<script>
import tNav from '../../component/t_nav';
import tHeader from '../../component/t_header';
import api from './api';

export default {
	components: { tNav, tHeader},
	methods: {
		/**
		 * 获取所有的院系
		 */
		getDepartments() {
			api.getDepartments()
				.then((data) => {
					console.log(data);
				})
				.catch((err) => {
					console.error(err);
				});
		}
	},
	created() {
		// this.getDepartments();
	}
}
</script>

<style scoped>

</style>


