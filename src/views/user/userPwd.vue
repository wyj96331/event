<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>重置密码</span>
    </div>
    <!-- 表单 -->
    <el-form :model="pwdForm" :rules="pwdFormRules" ref="pwdFormRef" label-width="100px">
      <el-form-item label="原密码" prop="old_pwd">
        <el-input v-model="pwdForm.old_pwd" type="password"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="new_pwd">
        <el-input v-model="pwdForm.new_pwd" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="re_pwd">
        <el-input v-model="pwdForm.re_pwd" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updatePwdFn">修改密码</el-button>
        <el-button @click="resetFn">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { updatePwdAPI } from '@/api'
export default {
  name: 'UserPwd',
  data () {
    // 新密码和旧密码不能相同
    const samePwd = (rules, value, callback) => {
      if (value === this.pwdForm.old_pwd) { return callback(new Error('新密码和旧密码不能相同')) }
      callback()
    }
    // 确认密码和新密码要保持一致
    const rePwd = (rules, value, callback) => {
      if (value !== this.pwdForm.new_pwd) { return callback(new Error('旧密码和新密码要保持一致')) }
      callback()
    }
    return {
      // 表单的数据对象
      pwdForm: {
        old_pwd: '',
        new_pwd: '',
        re_pwd: ''
      },
      // 表单的验证规则对象
      pwdFormRules: {
        old_pwd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { pattern: /^\S{6,15}$/, message: '密码长度必须是6-15位的非空字符串', trigger: 'blur' }
        ],
        new_pwd: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { pattern: /^\S{6,15}$/, message: '密码长度必须是6-15位的非空字符串', trigger: 'blur' },
          { validator: samePwd, trigger: 'blur' }
        ],
        re_pwd: [
          { required: true, message: '请再次确认新密码', trigger: 'blur' },
          { pattern: /^\S{6,15}$/, message: '密码长度必须是6-15位的非空字符串', trigger: 'blur' },
          { validator: rePwd, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 修改密码->点击事件
    updatePwdFn () {
      // 进行表单校验
      this.$refs.pwdFormRef.validate(async valid => {
        // 校验未通过
        if (!valid) return false
        // 校验通过
        const { data: res } = await updatePwdAPI(this.pwdForm)
        if (!res.code === 0) return this.$message.error('更新密码失败！')
        // 修改密码成功
        this.$message.success('更新密码成功！')
        // 清空输入框
        this.$refs.pwdFormRef.resetFields()
      })
    },
    // 重置输入框->点击事件
    resetFn () {
      this.$refs.pwdFormRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.el-form {
  width: 500px;
}
</style>
