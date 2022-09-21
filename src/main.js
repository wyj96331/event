import Vue from 'vue'
import App from './App.vue'

import router from './router'
import store from './store'

import '@/assets/global.less'
import '@/elementUI'
import VueQuillEditor from 'vue-quill-editor'
// 导入dayjs方法
import dayjs from 'dayjs'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 定义时间格式化函数
Vue.prototype.$formatDate = (dateObj) => {
  return dayjs(dateObj).format('YYYY-MM-DD HH:mm:ss')
}
Vue.use(VueQuillEditor /* { default global options } */)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
