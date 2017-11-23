import contents from '../../../components/content.vue'
// import { getUserInfo, updateStudentInfo } from '../../api.js'
import { getTeacherIndexWebData } from '../../api.js'
export default {
  name: 'home',
  components: { contents },
  data() {
    return {
      taskData: []
    }
  },
  methods: {
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
    document.title = '首页'
  },
  mounted () {
    getTeacherIndexWebData()
    .then((data) => {
      data = data.data
      if (data.code !== 1) {
        this.errorMsg('获取页面初始化数据失败')
        return
      }
      this.taskData = data.data
    })
    .catch((e) => {
      console.error(e)
    })
  }
}