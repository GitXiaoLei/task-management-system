import contents from '../../../components/content.vue'
// import { getUserInfo, updateStudentInfo } from '../../api.js'
import { getGradeWebData, getSubjectClass, getReportCard } from '../../api.js'
import XLSX from 'xlsx'
import HotTable from 'vue-handsontable-official'
import list from '../../../components/list.vue'

export default {
  name: 'grade',
  components: { contents, HotTable, list },
  data() {
    return {
      subjectData: [], // 所教课程
      subjectId: 0,
      classData: [], // 课程下所教的班级
      classId: 0,
      data: [], // 要下载的文件数据
      isDown: false,
      root: 'test-hot',
      hotSettings: {
        data: [
          ["学号", "姓名", "1", "2", "3", "4", "5", "6", '平均分'],
        ],
        colHeaders: true,
        rowHeaders: true
      }
    }
  },
  methods: {
    // 获取成绩单
    getReportCard () {
      const params = {
        subject_id: this.subjectId,
        class_id: this.classId
      }
      getReportCard(params)
      .then((data) => {
        data = data.data
        if (data.code !== 1) {
          this.errorMsg(data.message)
          return
        }
        this.successMsg('获取成绩单成功')
        this.hotSettings.data = data.data
        this.data = []
        jQuery.extend(true, this.data, data.data)
        this.isDown = true
      })
      .catch((e) => {
        console.error(e)
      })
    },
    // 获取某个课程下的班级
    getSubjectClass () {
      const params = { subject_id: this.subjectId }
      getSubjectClass(params)
      .then((data) => {
        data = data.data
        if (data.code !== 1) {
          this.errorMsg(data.message)
          return
        }
        this.successMsg('获取班级成功')
        this.classData = data.data
        this.isDown = false
      })
      .catch((e) => {
        console.error(e)
      })
    },
    // 导出excel文件
    exportExcel() {
      downloadExl(this.data)
      var tmpDown; //导出的二进制对象
      function downloadExl(json, type) {
        var tmpdata = json[0];
        json.unshift({});
        var keyMap = []; //获取keys
        for (var k in tmpdata) {
          keyMap.push(k);
          json[0][k] = k;
        }
        var tmpdata = [];//用来保存转换好的json 
        json.map((v, i) => keyMap.map((k, j) => Object.assign({}, {
          v: v[k],
          position: (j > 25 ? getCharCol(j) : String.fromCharCode(65 + j)) + (i + 1)
        }))).reduce((prev, next) => prev.concat(next)).forEach((v, i) => tmpdata[v.position] = {
          v: v.v
        });
        var outputPos = Object.keys(tmpdata); //设置区域,比如表格从A1到D10
        var tmpWB = {
          SheetNames: ['mySheet'], //保存的表标题
          Sheets: {
            'mySheet': Object.assign({},
              tmpdata, //内容
              {
                '!ref': outputPos[0] + ':' + outputPos[outputPos.length - 1] //设置填充区域
              })
          }
        };
        tmpDown = new Blob([s2ab(XLSX.write(tmpWB,
          { bookType: (type == undefined ? 'xlsx' : type), bookSST: false, type: 'binary' }//这里的数据是用来定义导出的格式类型
        ))], {
            type: ""
          }); //创建二进制对象写入转换好的字节流
        var href = URL.createObjectURL(tmpDown); //创建对象超链接
        document.getElementById("hf").href = href; //绑定a标签
        document.getElementById("hf").click(); //模拟点击实现下载
        setTimeout(function () { //延时释放
          URL.revokeObjectURL(tmpDown); //用URL.revokeObjectURL()来释放这个object URL
        }, 100);
      }

      function s2ab(s) { //字符串转字符流
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
      }
      // 将指定的自然数转换为26进制表示。映射关系：[0-25] -> [A-Z]。
      function getCharCol(n) {
        let temCol = '',
          s = '',
          m = 0
        while (n > 0) {
          m = n % 26 + 1
          s = String.fromCharCode(m + 64) + s
          n = (n - m) / 26
        }
        return s
      }
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
  mounted () {
    getGradeWebData()
    .then((data) => {
      data = data.data
      if (data.code !== 1) {
        console.error('获取页面初始化数据失败')
        return
      }
      this.subjectData = data.data
    })
  },
  created() {
    
  }
}
