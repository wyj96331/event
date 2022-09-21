<template>
  <div>
    <!-- 预览文章分类 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix header-box">
        <span>文章分类</span>
        <el-button type="primary" size="mini" @click="addCateShowDialogFn"
          >添加分类</el-button
        >
      </div>
      <el-table :data="cateList" style="width: 100%" border stripe>
        <el-table-column
          type="index"
          label="序号"
          width="100"
        ></el-table-column>
        <el-table-column prop="cate_name" label="分类名称"></el-table-column>
        <el-table-column prop="cate_alias" label="分类别名"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button
              type="primary"
              size="mini"
              @click="updateCateBtnFn(scope.row)"
              >修改</el-button
            >
            <el-button type="danger" size="mini" @click="removeFn(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog
      :visible.sync="addVisible"
      width="35%"
      @closed="onAddClosedFn"
      :close-on-click-modal="false"
      :before-close="handleClose"
      :title="isEdit ? '修改文章分类' : '添加文章分类'"
    >
      <!-- 添加的表单 -->
      <el-form
        :model="addForm"
        :rules="addRules"
        ref="addRef"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="cate_name">
          <el-input
            v-model="addForm.cate_name"
            minlength="1"
            maxlength="10"
          ></el-input>
        </el-form-item>
        <el-form-item label="分类别名" prop="cate_alias">
          <el-input
            v-model="addForm.cate_alias"
            minlength="1"
            maxlength="15"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancelFn">取 消</el-button>
        <el-button size="mini" type="primary" @click="addFn">添 加</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getArtCateListAPI,
  addArtCateAPI,
  updataArtCateAPI,
  deleteArtCateAPI
} from '@/api'
export default {
  name: 'ArtCate',
  data () {
    return {
      cateList: [], // 文章分类数组
      addVisible: false, // 添加分类-对话框是否显示
      addForm: {
        // 表单数据对象
        cate_name: '',
        cate_alias: ''
      },
      addRules: {
        // 添加表单的验证规则对象
        cate_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          {
            pattern: /^\S{1,10}$/,
            message: '分类名必须是1-10位的非空字符',
            trigger: 'blur'
          }
        ],
        cate_alias: [
          { required: true, message: '请输入分类别名', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z0-9]{1,15}$/,
            message: '分类别名必须是1-15位的字母数字',
            trigger: 'blur'
          }
        ]
      },
      isEdit: false, // 保存编辑状态(false:新增，true:编辑)
      editId: '' // 要修改的文章的id
    }
  },
  created () {
    // 获取文章分类
    this.initCateListFn()
  },
  methods: {
    // 获取文章分类
    async initCateListFn () {
      const res = await getArtCateListAPI()
      this.cateList = res.data.data
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          done()
        })
        .catch((_) => {})
    },
    // 添加分类点击事件->显示对话框
    addCateShowDialogFn () {
      this.addVisible = true
      this.isEdit = false
      this.editId = ''
    },
    // 对话框取消按钮->点击事件->让对话框消失
    cancelFn () {
      // 关闭对话框
      this.addVisible = false
    },
    // 对话框确认按钮->点击事件->调用接口/让对话框消失
    addFn () {
      // 表单预验证
      this.$refs.addRef.validate(async (valid) => {
        if (valid) {
          // 增加文章分类
          if (!this.isEdit) {
            // 调用接口传递数据给后台
            const { data: res } = await addArtCateAPI(this.addForm)
            if (res.code !== 0) return this.$message.error(res.message)
            this.$message.success(res.message)
          } else {
            // 修改文章分类
            const { data: res } = await updataArtCateAPI({
              id: this.editId,
              ...this.addForm
            })
            if (res.code !== 0) return this.$message.error('分类更新失败')
            this.$message.success('分类更新成功')
          }
          // 重新获取文章分类
          this.initCateListFn()
          // 关闭对话框
          this.addVisible = false
          this.onAddClosedFn()
        } else {
          return false
        }
      })
    },
    // 关闭对话框->重置表单
    onAddClosedFn () {
      this.$refs.addRef.resetFields()
    },
    // 修改文章分类
    updateCateBtnFn (obj) {
      // obj:{id:文章分类的id cate_name:文章分类的名字 cate_alias:文章分类的别名}
      // 显示弹窗
      this.addVisible = true
      this.isEdit = true
      this.editId = obj.id
      // 数据回显
      this.addForm.cate_name = obj.cate_name
      this.addForm.cate_alias = obj.cate_alias
    },
    // 删除文章分类
    async removeFn (id) {
      const { data: res } = await deleteArtCateAPI(id)
      if (res.code !== 0) return this.$message.error(res.message)
      this.$message.success(res.message)
      // 重新获取文章分类
      this.initCateListFn()
    }
  }
}
</script>

<style lang="less" scoped>
.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
