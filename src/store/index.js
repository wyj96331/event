import { getUserInfoAPI } from '@/api'
import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '', // 用来存储登录成功后获得的token值
    userInfo: {}// 用来存储用户信息
  },
  getters: {
    // 1.正常写法
    // username (state){
    //   return state.userInfo.username
    // }

    // 2.箭头函数写法
    // username: (state) = > {
    //   return state.userInfo.username
    // }

    // 3.箭头函数的简写形式 省去 括号 和 return(reutrn后面只有一个表达式的时候)
    nickname: state => state.userInfo.nickname, // 昵称
    username: state => state.userInfo.username, // 用户名
    user_pic: state => state.userInfo.user_pic // 用户头像
  },
  mutations: {
    // 更新token的mutation函数
    updateToken (state, newToken) {
      state.token = newToken
    },
    // 更新用户信息
    updateUserInfo (state, info) {
      state.userInfo = info
    }
  },
  // 配置为 vuex 的插件
  plugins: [createPersistedState()],
  actions: {
    // 定义获取用户基本信息的 action 函数
    async initUserInfo (store) {
      // 调用获取用户信息的后台请求函数，获取信息
      const { data: res } = await getUserInfoAPI()
      // 通过返回的状态码判断获取信息是是否成功
      if (res.code === 0) {
        // 获取信息成功后，通过dispatch调用mutations里的updateUserInfo函数保存信息到userInfo
        store.commit('updateUserInfo', res.data)
      }
    }
  },
  modules: {}
})
