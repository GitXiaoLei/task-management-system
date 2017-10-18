import $ from 'jquery'
import 'jquery-confirm/dist/jquery-confirm.min.css'
import 'jquery-confirm/dist/jquery-confirm.min.js'

const jconfirm = {
  successTips (content) {
    $.alert({
      title: content,
      content: '',
      type: 'green',
      buttons: {
        '确定': function () {
          window.location.reload()
        }
      }
    })
  },
  failTips (content) {
    $.alert({
      title: content,
      content: '',
      type: 'red',
      buttons: {
        '确定': function () {
          window.location.reload()
        }
      }
    })
  }
}

export default jconfirm
