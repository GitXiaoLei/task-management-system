import contents from '../../../components/content.vue'
import tabList from '../../../components/tab-list.vue'
// import { getUserInfo, updateStudentInfo } from '../../api.js'
export default {
  name: 'check',
  components: { contents, tabList },
  data() {
    return {
      data: [
        [
          {
            task_name: '第1次JS作业',
            overdue_time: '2017-10-30'
          },
          {
            task_name: '第2次JS作业',
            overdue_time: '2017-10-30'
          },
        ],
        [
          {
            task_name: '第1次CSS作业',
            overdue_time: '2017-10-30'
          },
          {
            task_name: '第2次CSS作业',
            overdue_time: '2017-10-30'
          },
        ]
      ]
    }
  },
  methods: {
    liDel (row, event) {
      console.log('del')
    },
    liClick (row, event) {
      console.log('li')
    },
    // 成功消息提示
    successMsg(msg) {
      this.$Message.success(msg)
    },
    // 失败消息提示
    errorMsg(msg) {
      this.$Message.error(msg)
    }
  },
  computed: {
    
  },
  created() {
    
  }
}