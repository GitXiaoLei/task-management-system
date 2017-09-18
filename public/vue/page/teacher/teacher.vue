<template>
	<t-main :index="'3'">
		<contents slot="content"></contents>
	</t-main>
</template>

<script>
import tMain from '../../component/t_main';
import contents from './contents';

export default {
	components: { tMain, contents }
}
</script>

<style scoped>

</style>


