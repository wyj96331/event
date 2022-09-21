import store from '@/store'
import { Message } from 'element-ui'
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/', // 网页第一次打开默认路由路径就是'/'
    component: () => import('@/views/layout'),
    redirect: '/home', // 路由重定向会导致路由数组规则再次改变
    children: [
      {
        path: 'home',
        component: () => import('@/views/home')
      },
      {
        path: 'user-info', // 用户信息
        component: () => import('@/views/user/userInfo.vue')
      },
      {
        path: 'user-avatar', // 更换头像
        component: () => import('@/views/user/userAvtar.vue')
      },
      {
        path: 'user-pwd', // 修改密码
        component: () => import('@/views/user/userPwd.vue')
      },
      {
        path: 'art-cate', // 文章分类
        component: () => import('@/views/article/artcate.vue')
      },
      {
        path: 'art-list', // 文章列表
        component: () => import('@/views/article/artList')
      }
    ]
  },
  {
    path: '/reg',
    component: () => import('@/views/register')
  },
  {
    path: '/login',
    component: () => import('@/views/login')
  },
  {
    path: '/percentage',
    component: () => import('@/views/percentage')
  }
]

const router = new VueRouter({
  routes
})

const whiteList = ['/login', '/reg']
// 全局前置路由守卫
router.beforeEach((to, from, next) => {
  const token = store.state.token
  // 有token但是没有用户信息, 才去请求用户信息保存到vuex里
  if (token) { // 有token(登录状态下)
    if (!store.state.userInfo.username) {
    // 调用actions里方法请求数据
      store.dispatch('initUserInfo')
    }
    next()
  } else { // 无token(不是登录状态下)
    if (whiteList.includes(to.path)) {
      next()
    } else {
    // 未登录,强制转跳到登录页面
      Message.error('请登录您的用户')
      next('/login')
    }
  }
})

export default router
