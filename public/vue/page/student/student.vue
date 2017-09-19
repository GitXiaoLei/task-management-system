<template>
	<t-main :index="'4'">
		<contents slot="content"></contents>
	</t-main>
</template>

<script>
import tMain from '../../component/t_main';
import contents from './contents';

export default {
	components: { tMain, contents },
	methods: {
		
	},
	created() {
		// this.getDepartments();
	}
}
</script>

<style scoped>

</style>


