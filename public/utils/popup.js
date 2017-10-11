import $ from 'jquery'
import 'jquery-confirm/dist/jquery-confirm.min.css'
import 'jquery-confirm/dist/jquery-confirm.min.js'

const jconfirm = {
  successTips (content, delay) {
    $.confirm({
      title: content,
      content: '',
      type: 'green',
      autoClose: 'close|' + delay
    })
  },
  failTips (content, delay) {
    $.confirm({
      title: content,
      content: '',
      type: 'red',
      autoClose: 'close|' + delay
    })
  }
}

export default jconfirm
