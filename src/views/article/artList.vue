<template>
  <div>
    <!-- 内容区域 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>文章列表</span>
      </div>
      <!-- 搜索区域 -->
      <div class="search-box">
        <el-form :inline="true" :model="q">
          <el-form-item label="文章分类">
            <el-select v-model="q.cate_id" placeholder="请选择分类" size="small">
              <el-option :label="item.cate_name" :value="item.id" v-for="item in cateList" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布状态" style="margin-left: 15px">
            <el-select v-model="q.state" placeholder="请选择状态" size="small">
              <el-option label="已发布" value="已发布"></el-option>
              <el-option label="草稿" value="草稿"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="initArtListFn">筛选</el-button>
            <el-button type="info" size="small" @click="resetListFn">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- 发表文章的按钮 -->
        <el-button type="primary" size="small" class="btn-pub" @click="showPubDialogFn">发表文章</el-button>
      </div>

      <!-- 文章表格区域 -->
      <el-table :data="artList" style="width: 100%" border stripe>
        <el-table-column label="文章标题" prop="title">
          <!--  定义一个作用域插槽<template>  -->
          <template v-slot="scope">
            <el-link type="primary" @click="showDetailFn(scope.row.id)">{{ scope.row.title }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="分类" prop="cate_name"></el-table-column>
        <el-table-column label="发表时间" prop="pub_date">
          <!--  定义一个作用域插槽<template>  -->
          <template v-slot="scope">
            <span>{{ $formatDate(scope.row.pub_date) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="state"></el-table-column>
        <el-table-column label="操作">
          <!--  定义一个作用域插槽<template>  -->
          <template v-slot="scope">
           <el-button type="danger"  @click="removeFn(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChangeFn"
        @current-change="handleCurrentChangeFn"
        :current-page.sync="q.pagenum"
        :page-sizes="[2, 3, 5, 10]"
        :page-size.sync="q.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 发表文章的 Dialog 对话框 -->
    <el-dialog
      title="发表文章"
      :visible.sync="pubDialogVisible"
      fullscreen
      :before-close="handleClose"
      @close="onDialogClosedFn"
    >
      <!-- 发布文章的对话框 -->
      <el-form :model="pubForm" :rules="pubFormRules" ref="pubFormRef" label-width="100px">
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="pubForm.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="文章分类" prop="cate_id">
          <el-select v-model="pubForm.cate_id" placeholder="请选择分类" style="width: 100%">
            <el-option :label="item.cate_name" :value="item.id" v-for="item in cateList" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
          <!-- 使用 v-model 进行双向的数据绑定 -->
          <quill-editor v-model="pubForm.content" @change="contentChangeFn"></quill-editor>
        </el-form-item>
        <el-form-item label="文章封面" prop="cover_img">
          <!-- 用来显示封面的图片 -->
          <img src="../../assets/images/cover.jpg" alt="" class="cover-img" ref="imgRef" />
          <br />
          <!-- 文件选择框，默认被隐藏 -->
          <input type="file" style="display: none" accept="image/*" ref="iptFileRef" @change="onCoverchangeFn" />
          <!-- 选择封面的按钮 -->
          <el-button type="text" @click="sleCoverFn">+ 选择封面</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="pubArticleFn('已发布')">发布</el-button>
          <el-button type="info" @click="pubArticleFn('草稿')">存为草稿</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 查看文章详情的对话框 -->
    <el-dialog title="文章预览" :visible.sync="detailVisible" width="80%">
      <h1 class="title">{{ artDetail.title }}</h1>

      <div class="info">
        <span>作者：{{ artDetail.nickname || artDetail.username }}</span>
        <span>发布时间：{{ $formatDate(artDetail.pub_date) }}</span>
        <span>所属分类：{{ artDetail.cate_name }}</span>
        <span>状态：{{ artDetail.state }}</span>
      </div>

      <!-- 分割线 -->
      <el-divider></el-divider>

      <!-- 文章的封面 -->
      <img v-if="artDetail.cover_img" :src="baseURLR + artDetail.cover_img" alt="" />

      <!-- 文章的详情 -->
      <div v-html="artDetail.content" class="detail-box"></div>
    </el-dialog>
  </div>
</template>

<script>
import { getArtCateListAPI, uploadArticleAPI, getArtcleListAPI, getArtcleDetailAPI, delArticleAPI } from '@/api'
// 导入默认的封面图片
import defaultImg from '@/assets/images/cover.jpg'
import { baseURL } from '@/utils/request'
export default {
  name: 'ArtList',
  data () {
    return {
      // 查询参数对象
      q: {
        pagenum: 1, // 默认拿第一页的数据
        pagesize: 2, // 默认当前页面需要几条数据
        cate_id: '',
        state: ''
      },
      // 控制发表文章对话框的显示与隐藏
      pubDialogVisible: false,
      // ...其他
      pubForm: {
        // 表单的数据对象
        title: '', // 文章标题
        cate_id: '', // 文章分类id
        content: '', // 文章内容
        cover_img: '', // 封面图片(保存的是个文件)
        state: '' // 文章的发布状态，可选值有两个：草稿、已发布
      },
      pubFormRules: {
        // 表单的验证规则对象
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 1, max: 30, message: '文章标题的长度为1-30个字符', trigger: 'blur' }
        ],
        cate_id: [{ required: true, message: '请选择文章标题', trigger: 'change' }],
        content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }],
        cover_img: [{ required: true, message: '请添加文章封面', trigger: 'change' }]
      },
      cateList: [], // 文章分类
      artList: [], // 文章的列表数据
      total: 0, // 总数据条数
      detailVisible: false, // 用于显示文章详情的对话框(显示/隐藏)
      artDetail: {}, // 文章的详情信息对象
      baseURLR: baseURL // 网络请求基地址()
    }
  },
  created () {
    // 获取文章分类列表
    this.initCateList()
    // 获取文章列表
    this.initArtListFn()
  },
  methods: {
    // 对话框关闭前的回调
    async handleClose (done) {
      // 询问用户是否确认关闭对话框
      const confirmResult = await this.$confirm('此操作将导致文章信息丢失, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => err)

      // 取消了关闭-阻止住, 什么都不干
      if (confirmResult === 'cancel') return
      // 确认关闭
      done()
    },
    // 发表文章->点击出现对话框
    showPubDialogFn () {
      this.pubDialogVisible = true
    },
    // 初始化文章分类的列表数据
    async initCateList () {
      const { data: res } = await getArtCateListAPI()
      if (res.code === 0) this.cateList = res.data
    },
    // 选择封面点击事件->让文件选择窗口出现
    sleCoverFn () {
      this.$refs.iptFileRef.click()
    },
    // 用换选择了封面文件
    onCoverchangeFn (e) {
      // 获取用户选择的文件列表
      const files = e.target.files
      if (files.length === 0) {
        // 用户没有选择封面
        this.pubForm.cover_img = null
        // 因为用户没用选择封面 所以使用默认的封面图片
        // console.log(defaultImg)
        this.$refs.imgRef.setAttribute('src', defaultImg)
      } else {
        // 用户选择了封面
        this.pubForm.cover_img = files[0]
        // 封面文件预览：
        // 1.将文件数组内的第一属性转化为url地址
        // 2.通过setAttribute('属性名',属性值)方法将url地址赋值到对应标签上
        const url = URL.createObjectURL(files[0])
        this.$refs.imgRef.setAttribute('src', url)
      }
      // 让表单单独校验封面规则
      this.$refs.pubFormRef.validateField('cover_img')
    },
    // 发布文章或存为草稿->点击事件
    pubArticleFn (state) {
      // 1.设置状态(发布or草稿)
      this.pubForm.state = state
      // 2 .表单预校验
      this.$refs.pubFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('请完善文章信息')
        // 3.判断是否提供了封面
        if (!this.pubForm.cover_img) return this.$message.error('请提供文章封面')
        // 准备一个表单数据对象的容器
        // FormData是HTML5新出的专门为了装文件内容和其他参数的一个容器
        const fd = new FormData()

        // 向 FormData 中追加数据:
        // 方法1:
        // fd.append('title', this.pubForm.title)
        // fd.append('cate_id', this.pubForm.cate_id)
        // fd.append('content', this.pubForm.content)
        // fd.append('cover_img', this.pubForm.cover_img)
        // fd.append('state', this.pubForm.state)

        // 方法2:
        Object.keys(this.pubForm).forEach((key) => {
          fd.append(key, this.pubForm[key])
        })

        // 发起请求
        const { data: res } = await uploadArticleAPI(fd)
        if (res.code !== 0) return this.$message.error('发布文章失败！')
        this.$message.success('发布文章成功！')

        // 关闭对话框
        this.pubDialogVisible = false
        // 刷新文章列表数据
        this.initArtListFn()
      })
    },
    // 发布文章的对话框关闭后的处理函数
    onDialogClosedFn () {
      // 清空相应的数据
      this.$refs.pubFormRef.resetFields()
      // 文本框内容清空
      this.pubForm.content = ''
      // 封面图片恢复默认图片
      this.$refs.imgRef.setAttribute('src', defaultImg)
    },
    // 富文本表单校验事件
    contentChangeFn () {
      this.$refs.pubFormRef.validateField('content')
    },
    // 初始化文章列表
    async initArtListFn () {
      const { data: res } = await getArtcleListAPI(this.q)
      if (res.code !== 0) return this.$message.error(res.message)
      // this.$message.success(res.message)
      this.artList = res.data
      this.total = res.total
      // console.log(res)
    },
    // 页面条数发生变化
    handleSizeChangeFn (newSize) {
      // 为页面条数赋值
      this.q.pagesize = newSize
      // 默认显示第一页的数据
      this.q.pagenum = 1
      // 重新请求数据
      this.initArtListFn()
    },
    // 页码发生变化
    handleCurrentChangeFn (newPage) {
      // 为页码赋值
      this.q.pagenum = newPage
      // 重新请求数据
      this.initArtListFn()
    },
    // 重置按钮->点击事件
    resetListFn () {
      // 1. 重置查询参数对象
      this.q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
      }
      // 2.发送请求，重新获取数据
      this.initArtListFn()
    },
    // 查看文章详情->点击事件
    async showDetailFn (id) {
      // 显示对话框
      this.detailVisible = true
      // console.log(id)
      const { data: res } = await getArtcleDetailAPI(id)
      // console.log(res)
      if (res.code !== 0) return this.$message.error(res.message)
      this.artDetail = res.data
    },
    // 删除文章->点击事件
    async removeFn (id) {
      // 1.询问用户是否删除
      const confirmResult = await this.$confirm('是否删除该文章', '提示', {
        confirmButtonText: '确定',
        canceButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 2.取消了删除
      if (confirmResult === 'cancel') return
      // 执行删除的操作
      const { data: res } = await delArticleAPI(id)
      if (res.code !== 0) return this.$message(res.message)
      this.$message.success(res.message)
      if (this.artList.length === 1) {
        if (this.q.pagenum > 1) this.q.pagenum--
      }
      // 2.发送请求，重新获取数据
      this.initArtListFn()
    }
  }
}
</script>

<style lang="less" scoped>
.search-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .btn-pub {
    margin-top: 5px;
  }
}
// 设置富文本编辑器的默认最小高度
// ::v-deep作用: 穿透选择, 正常style上加了scope的话, 会给.ql-editor[data-v-hash]属性, 只能选择当前页面标签或者组件的根标签
// 如果想要选择组件内的标签(那些标签没有data-v-hash值)所以正常选择选不中, 加了::v-deep空格前置的话, 选择器就会变成如下形式
// [data-v-hash] .ql-editor 这样就能选中组件内的标签的class类名了
::v-deep .ql-editor {
  min-height: 300px;
}
// 设置图片封面的宽高
.cover-img {
  width: 400px;
  height: 280px;
  object-fit: cover;
}
.el-pagination {
  margin-top: 15px;
}
.title {
  font-size: 24px;
  text-align: center;
  font-weight: normal;
  color: #000;
  margin: 0 0 10px 0;
}

.info {
  font-size: 12px;
  span {
    margin-right: 20px;
  }
}

// 修改 dialog 内部元素的样式，需要添加样式穿透
::v-deep .detail-box {
  img {
    width: 500px;
  }
}
</style>
