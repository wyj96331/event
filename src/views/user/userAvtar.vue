<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>更换头像</span>
    </div>
    <div>
      <!-- 图片，用来展示用户选择的头像 -->
      <img class="the_img" v-if="!this.avatar" src="../../assets/images/avatar.jpg" alt="" />
      <img class="the_img" v-else :src="this.avatar" alt="" />
      <!-- 按钮区域 -->
      <div class="btn-box">
        <input type="file" accept="image/*" style="display: none" ref="iptRef" @change="onFileChange" />
        <el-button type="primary" icon="el-icon-plus" @click="chooseImg">选择图片</el-button>
        <el-button type="success" icon="el-icon-upload" :disabled="avatar === ''" @click="onloadFn">上传头像</el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
import { updateAvatarAPI } from '@/api'
export default {
  name: 'UserAvatar',
  data () {
    return {
      avatar: ''
    }
  },
  methods: {
    // 选择图片->点击事件->让选择框出现
    chooseImg () {
      // 模拟点击行为
      this.$refs.iptRef.click()
    },
    // 在选择框中选择图片后触发的改变事件
    onFileChange (e) {
      // 获取用户选择的文件列表（伪数组）
      const files = e.target.files
      if (files.length === 0) {
        // 没有选择图片
        this.avatar = ''
      } else {
        // 选择了图片
        // console.log(files[0])

        // 解决方案1：文件->内存临时地址
        // 语法：URL.createObjectURl(文件)
        // 返回值：内存临时地址
        // this.avatar = URL.createObjectURL(files[0])

        // 解决方案2：文件->base64字符串(此文件可以发送给后台)
        // 语法：
        // 1.创建FileReader 对象
        const fr = new FileReader()
        // 2.调用readAsDataURL函数读取文件内容
        fr.readAsDataURL(files[0])
        // 3.监听fr的onload事件
        fr.onload = e => {
          // 4.通过e.target.result获取到读取结果，值就是字符串(base64的字符串)
          // console.log(e.target)
          this.avatar = e.target.result
        }
      }
    },
    async onloadFn () {
      const { data: res } = await updateAvatarAPI(this.avatar)
      // 判断用户上传头像是否成功，给予响应的提示
      if (res.code !== 0) return this.$message.error(res.message)
      // 上传成功
      this.$message.success(res.message)
      // 立刻让vuex里的actions(获取用户信息的actions)再请求一次后台更新vuex里的信息
      this.$store.dispatch('initUserInfo')
    }
  }
}
</script>

<style lang="less" scoped>
.btn-box {
  margin-top: 10px;
}
.preview {
  object-fit: cover;
}
.the_img {
  width: 350px;
  height: 350px;
}
</style>
