import type { App } from 'vue'
import copy from './copy'
import debounce from './debounce'
import throttle from './throttle'
import longpress from './longpress'
import waterMarker from './waterMarker'

const directivesList: any = {
  // Custom directives
  copy,
  waterMarker,
  debounce,
  throttle,
  longpress,
}

const directives = {
  install: function (app: App<Element>) {
    Object.keys(directivesList).forEach(key => {
      // 注册自定义指令
      app.directive(key, directivesList[key])
    })
  },
}

export default directives
