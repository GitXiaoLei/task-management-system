import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';
import 'minireset.css';
import '../common/style/iconfont.css';
import App from '../vue/page/teacher/teacher.vue';

Vue.use(ElementUI);
const vm = new Vue({
    el: '#app',
    render: h => h(App)
})