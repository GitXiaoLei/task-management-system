<template>
	<div id="main">
		<t-header class="header-wrap"></t-header>
		<t-nav class="nav-wrap" :index="'1'"></t-nav>
		<div class="content">
			
		</div>
	</div>
</template>

<script>
import tNav from '../component/t_nav';
import tHeader from '../component/t_header';

export default {
	components: { tNav, tHeader}
}
</script>

<style scoped>

</style>


