<template>
	<div id="main">
		<t-header class="header-wrap"></t-header>
		<t-nav class="nav-wrap" :index="'2'"></t-nav>
		<div class="content">
			
			
		</div>
	</div>
</template>

<script>
import tNav from '../../component/t_nav';
import tHeader from '../../component/t_header';

export default {
	components: { tNav, tHeader },
	methods: {
		
	},
	created() {
		// this.getDepartments();
	}
}
</script>

<style scoped>

</style>


