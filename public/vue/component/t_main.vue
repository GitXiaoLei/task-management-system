<template>
    <div id="main">
		<t-header class="header-wrap"></t-header>
		<t-nav class="nav-wrap" :index="index"></t-nav>
		<div class="content" scrollbar>
            <slot name="content"></slot>
		</div>
	</div>
</template>

<script>
import tNav from './t_nav';
import tHeader from './t_header';

export default {
    name: 'tMain',
	components: { tNav, tHeader },
	props: {
		index: String
	}
}
</script>

<style scoped>
#main, body, html {
    width: 100%;
    height: 100%;
    overflow: hidden;
}
.header-wrap{
	position: fixed;
    left: 0;
    top: 0;
    right: 0;
}
.nav-wrap{
	width: 220px;
	position: fixed;
	left: 0;
	top: 60px;
	bottom: 0;
}
.content{
	position: fixed;
	height: 100%;
	left: 220px;
	right: 0;
	top: 60px;
	bottom: 0;
	overflow-y: scroll;
	padding: 30px;
	padding-bottom: 90px;
}
.el-menu{
    border-radius: 0;
}
.el-menu-item{
	transition: .3s;
}
.el-menu-item.is-active{
	transform: translateX(6px);
}
</style>

