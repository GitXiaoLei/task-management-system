import contents from '../../../components/content.vue'
// import { getUserInfo, updateStudentInfo } from '../../api.js'
export default {
  name: 'publish',
  components: { contents },
  data() {
    return {
      
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
    
  }
}