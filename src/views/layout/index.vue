<template>
  <el-container class="main-container">
    <!-- 头部区域 -->
    <el-header>
      <!-- 左侧的 logo -->
      <img src="../../assets/images/logo.png" alt="" />
      <!-- 右侧的菜单 -->
      <el-menu
        class="el-menu-top"
        mode="horizontal"
        background-color="#23262E"
        text-color="#fff"
        active-text-color="#409EFF"
      >
        <el-submenu index="1">
          <template slot="title">
            <!-- 头像 -->
            <img :src="user_pic" alt="" class="avatar" />
            <span>个人中心</span>
          </template>
          <el-menu-item index="1-1"><i class="el-icon-s-operation"></i>基本资料</el-menu-item>
          <el-menu-item index="1-2"><i class="el-icon-camera"></i>更换头像</el-menu-item>
          <el-menu-item index="1-3"><i class="el-icon-key"></i>重置密码</el-menu-item>
        </el-submenu>
        <el-menu-item index="2" @click="logoutFn"><i class="el-icon-switch-button"></i>退出</el-menu-item>
      </el-menu>
    </el-header>
    <el-container>
      <!-- 侧边栏区域 -->
      <el-aside width="200px">
        <div class="user-box">
          <img :src="user_pic" alt="" v-if="user_pic" />
          <img src="../../assets/images/logo.png" alt="" v-else />
          <span>欢迎 {{ nickname || username }}</span>
        </div>
        <!-- 侧边栏-菜单 -->
        <!--
          el-menu:导航菜单
          default-active 当前激活菜单的 index 对应菜单就激活的样式
          @open: sub-menu 展开的回调
          @close: sub-menu 关闭的回调
          active-text-color 激活时的文件颜色
         -->
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#23262E"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          router
        >
        <template v-for="item in menus">
          <!-- 不包含子菜单的"一级菜单" -->
          <el-menu-item v-if="!item.children" :index="item.indexPath" :key="item.indexPath">
            <i :class="item.icon"></i>
            <span>{{item.title}}</span>
          </el-menu-item>
          <!-- 包含子菜单的"一级菜单" -->
          <el-submenu v-else :index="item.indexPath" :key="item.indexPath">
            <template slot="title">
              <i :class="item.icon"></i>
              <span>{{item.title}}</span>
            </template>
            <!-- 循环渲染二级菜单 -->
            <el-menu-item :index="subItem.indexPath" v-for="subItem in item.children" :key="subItem.indexPath">
              <i :class="subItem.icon"></i>
              <span>{{subItem.title}}</span>
            </el-menu-item>
          </el-submenu>
        </template>
        </el-menu>
      </el-aside>
      <el-container>
        <!-- 页面主体区域 -->
        <el-main><router-view></router-view></el-main>
        <!-- 底部 footer 区域 -->
        <el-footer>© www.itheima.com - 黑马程序员</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { getMenusAPI } from '@/api'
export default {
  name: 'my-layout',
  data () {
    return {
      menus: []// 侧边栏数据
    }
  },
  created () {
    this.getMenuListFn()
  },
  methods: {
    // 退出登录->点击事件
    logoutFn () {
      this.$confirm('退出登录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 执行退出登录的操作
          // 1.清空token
          this.$store.commit('updateToken', '')
          // 2.清除用户信息
          this.$store.commit('updateUserInfo', {})
          // console.log(this.$store.state.toekn)
          // 3.强制转跳
          this.$router.push('/login')
          this.$message({
            type: 'success',
            message: '退出成功'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退出'
          })
        })
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    // 获取侧边栏数据函数
    async getMenuListFn () {
      const { data: res } = await getMenusAPI()
      // console.log(res)
      this.menus = res.data
    }
  },
  computed: {
    ...mapGetters(['nickname', 'username', 'user_pic'])
  }
}
</script>

<style lang="less" scoped>
.main-container {
  height: 100%;
  .el-header,
  .el-aside {
    background-color: #23262e;
  }
  .el-header {
    padding: 0;
    display: flex;
    justify-content: space-between;
  }
  .el-main {
    overflow-y: scroll;
    height: 0;
    background-color: #f2f2f2;
  }
  .el-footer {
    background-color: #eee;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.avatar {
  border-radius: 50%;
  width: 35px;
  height: 35px;
  background-color: #fff;
  margin-right: 10px;
  object-fit: cover;
}
// 左侧边栏用户信息区域
.user-box {
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
  user-select: none;
  img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background-color: pink;
    margin-right: 15px;
    object-fit: cover;
  }
  span {
    color: white;
    font-size: 12px;
  }
}

// 侧边栏菜单的样式
.el-aside {
  .el-submenu,
  .el-menu-item {
    width: 200px;
    user-select: none;
  }
}

</style>
