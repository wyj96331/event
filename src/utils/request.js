// 基于axios封装网络请求函数
import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message } from 'element-ui'
// 引入进度条
import nProgress from 'nprogress'
// 引入进度条样式
import 'nprogress/nprogress.css'
// 用axios.create() 创建一个带配置项的自定义axios函数
export const baseURL = 'http://big-event-vue-api-t.itheima.net'
const myAxios = axios.create({
  baseURL
})

// 定义一个请求拦截器
myAxios.interceptors.request.use(config => {
  // 进度条开始
  nProgress.start()
  // 请求前触发一次
  if (store.state.token) { config.headers.Authorization = store.state.token }
  return config
},
error => {
  // 请求发起前的代码，如果有异常报错，会直接进入这里
  // 会返回一个拒绝状态的Promise对象
  return Promise.reject(error)
})

// 定义一个响应拦截器
myAxios.interceptors.response.use(response => {
  // 进度条结束
  nProgress.done()
  // 响应状态码为 2xx 时触发成功的回调，形参中的 response 是“成功的结果”
  return response
}, error => {
  // 响应状态码不是 2xx 时触发失败的回调，形参中的 error 是“失败的结果”
  if (error.response.status === 401) {
    // 本次响应状态码是401
    // 清空vuex里的数据
    store.commit('updateToken', '')
    store.commit('updateUserInfo', {})
    // 强制转跳页面
    router.push('/login')
    Message.error('用户身份已过期')
  }
  return Promise.reject(error)
})

export default myAxios
