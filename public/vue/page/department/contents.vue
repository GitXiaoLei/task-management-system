<template>
    <div>
        
    </div>
</template>

<script>
import api from './api';

export default {
    name: 'contents',
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
}
</script>
