import contents from '../../../components/content.vue'
// import { getUserInfo, updateStudentInfo } from '../../api.js'
import { getStudentWebData } from '../../api.js'
export default {
  name: 'home',
  components: { contents },
  data() {
    return {
      data: {}
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
  mounted () {
    getStudentWebData()
    .then((data) => {
      data = data.data
      if (data.code !== 1) {
        console.error('获取页面初始化数据失败')
        return
      }
      this.data = data.data
    })
    .catch((e) => {
      console.error(e)
    })
  }
}